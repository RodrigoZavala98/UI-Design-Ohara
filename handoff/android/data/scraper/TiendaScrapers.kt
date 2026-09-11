package mx.bibliotheca.data.scraper

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import mx.bibliotheca.data.remote.FichaLibro
import mx.bibliotheca.data.remote.Fuente
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.nodes.Element

/**
 * Respaldo por scraping — último escalón del motor de metadatos.
 *
 * Jsoup es una biblioteca de Java/Kotlin muy ligera para parsear HTML: no hay
 * navegador headless ni motor de JavaScript, solo se descarga el documento del
 * buscador de la tienda y se extraen nodos con selectores CSS. Por eso el
 * respaldo cabe en la aplicación sin engordarla.
 *
 * Cubre el hueco típico de los catálogos globales: ediciones locales y
 * reimpresiones recientes que Google y Open Library tardan meses en registrar.
 *
 * REGLAS
 *  · Solo por ISBN. Un ISBN identifica una edición concreta, así que el primer
 *    resultado es fiable. Por título los buscadores devuelven ruido —otras
 *    ediciones, accesorios, resúmenes— y esa vía no se usa.
 *  · Solo tras el fallo de ambas APIs.
 *  · Una consulta por segundo y por tienda, siempre en respuesta a una acción
 *    explícita del usuario. Nunca en segundo plano.
 *  · Cualquier fallo de análisis se trata como "no encontrado", jamás como
 *    error visible.
 *
 * ANTES DE PUBLICAR: revisar los términos de servicio de cada tienda y
 * confirmar que este uso —consulta puntual iniciada por la persona usuaria,
 * sin redistribución de contenido— es admisible. Es una decisión de producto,
 * no técnica.
 */
interface TiendaScraper {
    val fuente: Fuente
    val host: String
    suspend fun buscarPorIsbn(isbn: String): FichaLibro?
}

private const val AGENTE =
    "Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36"

private const val TIEMPO_LIMITE_MS = 8_000

/**
 * Descarga y parsea en el hilo de entrada/salida.
 *
 * Nunca desde el hilo principal: en Android una petición de red allí lanza
 * NetworkOnMainThreadException, y aun sin eso el análisis del HTML bloquearía
 * el dibujado.
 */
private suspend fun descargar(url: String): Document? = withContext(Dispatchers.IO) {
    runCatching {
        Jsoup.connect(url)
            .userAgent(AGENTE)
            .header("Accept-Language", "es-MX,es;q=0.9")
            .timeout(TIEMPO_LIMITE_MS)
            .followRedirects(true)
            .get()
    }.getOrNull()
}

/* ═══════════════════════════════ Amazon ═════════════════════════════════ */

class AmazonScraper(
    private val limitador: LimitadorPorHost,
) : TiendaScraper {

    override val fuente = Fuente.AMAZON
    override val host = "www.amazon.com.mx"

    override suspend fun buscarPorIsbn(isbn: String): FichaLibro? {
        limitador.esperarTurno(host)
        val doc = descargar("https://$host/s?k=$isbn&i=stripbooks") ?: return null

        val resultado = doc.selectFirst("div[data-component-type=s-search-result]") ?: return null
        val titulo = resultado.selectFirst("h2 span")?.text()?.trim().orEmpty()
        if (titulo.isBlank()) return null

        return FichaLibro(
            titulo = titulo,
            autor = resultado.autorAmazon() ?: "Autor desconocido",
            isbn = isbn,
            editorial = null,
            portada = resultado.selectFirst("img.s-image")?.mejorImagen(),
            fuente = fuente,
        )
    }

    /** La línea de autoría va bajo el título, tras "de" o "by" según el idioma de la página. */
    private fun Element.autorAmazon(): String? =
        select("div.a-row.a-size-base.a-color-secondary span.a-size-base")
            .map { it.text().trim() }
            .firstOrNull { it.isNotBlank() && !it.startsWith("de") && !it.startsWith("by") }
}

/* ═══════════════════════════════ Gandhi ═════════════════════════════════ */

class GandhiScraper(
    private val limitador: LimitadorPorHost,
) : TiendaScraper {

    override val fuente = Fuente.GANDHI
    override val host = "www.gandhi.com.mx"

    override suspend fun buscarPorIsbn(isbn: String): FichaLibro? {
        limitador.esperarTurno(host)
        val doc = descargar("https://$host/catalogsearch/result/?q=$isbn") ?: return null

        val tarjeta = doc.selectFirst("li.product-item .product-item-info")
            ?: doc.selectFirst(".product-item-info")
            ?: return null

        val titulo = tarjeta.selectFirst("a.product-item-link")?.text()?.trim().orEmpty()
        if (titulo.isBlank()) return null

        return FichaLibro(
            titulo = titulo,
            autor = tarjeta.selectFirst(".product-item-author, .autor")?.text()?.trim()
                ?: "Autor desconocido",
            isbn = isbn,
            portada = tarjeta.selectFirst("img.product-image-photo")?.mejorImagen(),
            fuente = fuente,
        )
    }
}

/** Prefiere la variante de mayor resolución del srcset si la hay. */
private fun Element.mejorImagen(): String? {
    val srcset = attr("srcset")
    if (srcset.isNotBlank()) {
        return srcset.split(",")
            .mapNotNull { it.trim().split(" ").firstOrNull() }
            .lastOrNull()
    }
    return attr("src").ifBlank { null }
}

/**
 * Un turno por segundo y por host. Como las dos tiendas son hosts distintos,
 * pueden consultarse en paralelo sin infringir el límite de ninguna.
 */
class LimitadorPorHost(private val intervaloMs: Long = 1_000) {
    /** Instante a partir del cual cada host vuelve a estar disponible. */
    private val disponibleEn = mutableMapOf<String, Long>()
    private val cerrojo = Mutex()

    suspend fun esperarTurno(host: String) {
        // El turno se reserva bajo cerrojo y la espera se hace fuera, para no
        // bloquear a los demás hosts mientras uno cumple su intervalo.
        val espera = cerrojo.withLock {
            val ahora = System.currentTimeMillis()
            val libreEn = disponibleEn[host] ?: 0L
            val espera = (libreEn - ahora).coerceAtLeast(0L)
            disponibleEn[host] = ahora + espera + intervaloMs
            espera
        }
        if (espera > 0) delay(espera)
    }
}

/*
 * FRAGILIDAD ASUMIDA
 *
 * Los selectores de arriba están escritos a partir de la estructura habitual
 * de ambos buscadores y NO se han verificado contra el marcado en vivo: hay
 * que comprobarlos al implementar y volverán a romperse cuando las tiendas
 * cambien su HTML. Por eso este escalón va el último, cada tienda vive en su
 * propia clase para poder corregirla sin tocar nada más, y un fallo de
 * análisis solo pasa el turno al alta manual.
 *
 * Merece la pena una prueba instrumentada por tienda que corra contra un HTML
 * guardado en `androidTest/assets`, más una alerta si el porcentaje de fallos
 * en producción sube: es la señal de que cambiaron el marcado.
 */
