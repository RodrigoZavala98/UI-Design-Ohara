package mx.bibliotheca.data

import kotlinx.coroutines.CancellationException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.cancelChildren
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import kotlinx.coroutines.withTimeoutOrNull
import mx.bibliotheca.data.local.MetadatosCacheDao
import mx.bibliotheca.data.local.MetadatosCacheEntity
import mx.bibliotheca.data.remote.FichaLibro
import mx.bibliotheca.data.remote.Fuente
import mx.bibliotheca.data.remote.GoogleBooksApi
import mx.bibliotheca.data.remote.OpenLibraryApi
import mx.bibliotheca.data.remote.aFicha
import mx.bibliotheca.data.scraper.TiendaScraper
import java.time.LocalDate
import kotlin.coroutines.coroutineContext

/**
 * Motor de metadatos.
 *
 * Nadie quiere teclear nueve campos por libro. El repositorio los resuelve solo
 * recorriendo fuentes progresivamente menos formales y se detiene en la primera
 * que devuelve una ficha utilizable; el resto no llega a consultarse.
 *
 *   1 · Caché local        30 días, por ISBN
 *   2 · Google Books       clave de API, mejor cobertura en español
 *   3 · Open Library       abierta, sin clave, buen fondo antiguo
 *   4 · Amazon y Gandhi    scraping con Jsoup, solo por ISBN, en paralelo
 *   5 · Alta manual        siempre disponible, nunca se bloquea el alta
 *
 * Toda la cadena corre fuera del hilo principal.
 */
class MetadatosRepository(
    private val googleBooks: GoogleBooksApi,
    private val openLibrary: OpenLibraryApi,
    private val scrapers: List<TiendaScraper>,
    private val cache: MetadatosCacheDao,
    private val claveGoogle: String,
) {

    /**
     * Resolución por ISBN — la vía del escáner. Es la única que llega al
     * scraping, porque un ISBN identifica una edición concreta.
     *
     * Devuelve null si ninguna fuente la reconoce: el formulario se abre con
     * lo que haya y el resto en blanco.
     */
    suspend fun porIsbn(isbn: String): FichaLibro? = withContext(Dispatchers.IO) {
        val limpio = isbn.filter { it.isDigit() || it == 'X' || it == 'x' }
        if (limpio.length !in listOf(10, 13)) return@withContext null

        cacheVigente(limpio)?.let { return@withContext it }

        val ficha = conTiempoLimite(TIEMPO_API_MS) {
            googleBooks.buscar(GoogleBooksApi.porIsbn(limpio), claveGoogle, maximo = 1)
                .items.firstNotNullOfOrNull { it.aFicha() }
        } ?: conTiempoLimite(TIEMPO_API_MS) {
            openLibrary.buscarPorIsbn(OpenLibraryApi.consultaIsbn(limpio))
                .docs.firstOrNull()?.aFicha()
        } ?: consultarTiendas(limpio)

        ficha?.also { guardarEnCache(limpio, it) }
    }

    /**
     * Búsqueda por título — la vía del buscador de la pantalla de alta.
     *
     * No pasa por los scrapers: por título los buscadores de las tiendas
     * devuelven ruido (otras ediciones, accesorios, resúmenes).
     *
     * Se consultan las dos APIs y se combinan: Google primero por calidad de
     * ficha, Open Library después para lo que Google no tenga, descartando
     * duplicados por ISBN y por título normalizado.
     */
    suspend fun porTitulo(titulo: String, limite: Int = 12): List<FichaLibro> =
        withContext(Dispatchers.IO) {
            if (titulo.trim().length < MINIMO_CARACTERES) return@withContext emptyList()

            val deGoogle = conTiempoLimite(TIEMPO_API_MS) {
                googleBooks.buscar(GoogleBooksApi.porTitulo(titulo), claveGoogle, limite)
                    .items.mapNotNull { it.aFicha() }
            }.orEmpty()

            val deOpenLibrary = conTiempoLimite(TIEMPO_API_MS) {
                openLibrary.buscarPorTitulo(titulo, limite).docs.map { it.aFicha() }
            }.orEmpty()

            (deGoogle + deOpenLibrary)
                .distinctBy { it.isbn ?: it.titulo.normalizar() }
                .take(limite)
        }

    /* ── Escalón 4: tiendas ────────────────────────────────────────── */

    /**
     * Las dos tiendas se consultan a la vez y gana la primera que responda con
     * una ficha válida; el resto se cancela. Son hosts distintos, así que el
     * paralelismo no infringe el límite de una consulta por segundo de ninguna.
     */
    private suspend fun consultarTiendas(isbn: String): FichaLibro? =
        withTimeoutOrNull(TIEMPO_SCRAPER_MS) {
            coroutineScope {
                val resultados = Channel<FichaLibro?>(capacity = scrapers.size)

                scrapers.forEach { tienda ->
                    launch {
                        val ficha = try {
                            tienda.buscarPorIsbn(isbn)
                        } catch (e: CancellationException) {
                            throw e
                        } catch (e: Exception) {
                            // Un fallo de análisis es "no encontrado", no un error visible.
                            null
                        }
                        resultados.send(ficha)
                    }
                }

                repeat(scrapers.size) {
                    val ficha = resultados.receive()
                    if (ficha != null) {
                        coroutineContext.cancelChildren()
                        return@coroutineScope ficha
                    }
                }
                null
            }
        }

    /* ── Caché ─────────────────────────────────────────────────────── */

    private suspend fun cacheVigente(isbn: String): FichaLibro? {
        val entrada = cache.vigente(isbn, LocalDate.now().minusDays(DIAS_CACHE)) ?: return null
        return FichaLibro(
            titulo = entrada.titulo,
            autor = entrada.autor,
            anio = entrada.anio,
            paginas = entrada.paginas,
            isbn = entrada.isbn,
            idioma = entrada.idioma?.let { runCatching { enumValueOf<mx.bibliotheca.data.local.Idioma>(it) }.getOrNull() },
            editorial = entrada.editorial,
            sinopsis = entrada.sinopsis,
            portada = entrada.portada,
            fuente = Fuente.CACHE,
        )
    }

    private suspend fun guardarEnCache(isbn: String, ficha: FichaLibro) {
        cache.guardar(
            MetadatosCacheEntity(
                isbn = isbn,
                titulo = ficha.titulo,
                autor = ficha.autor,
                anio = ficha.anio,
                paginas = ficha.paginas,
                idioma = ficha.idioma?.name,
                editorial = ficha.editorial,
                sinopsis = ficha.sinopsis,
                portada = ficha.portada,
                fuente = ficha.fuente.name,
                resueltoEl = LocalDate.now(),
            )
        )
    }

    /* ── Utilidades ────────────────────────────────────────────────── */

    /** Un timeout o un fallo de red pasan el turno a la siguiente fuente. */
    private suspend fun <T> conTiempoLimite(ms: Long, bloque: suspend () -> T): T? =
        withTimeoutOrNull(ms) {
            try {
                bloque()
            } catch (e: CancellationException) {
                throw e
            } catch (e: Exception) {
                null
            }
        }

    private fun String.normalizar() = trim().lowercase().replace(Regex("[^\\p{L}\\p{N}]+"), " ")

    companion object {
        const val MINIMO_CARACTERES = 3
        /** Espera desde la última tecla antes de consultar, en la búsqueda por título. */
        const val ESPERA_TECLEO_MS = 400L
        private const val TIEMPO_API_MS = 6_000L
        private const val TIEMPO_SCRAPER_MS = 8_000L
        private const val DIAS_CACHE = 30L
    }
}
