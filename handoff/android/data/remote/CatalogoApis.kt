package mx.bibliotheca.data.remote

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import mx.bibliotheca.data.local.Idioma
import retrofit2.http.GET
import retrofit2.http.Query

/**
 * Ficha normalizada. Las tres fuentes devuelven formas distintas; todas
 * terminan aquí para que el repositorio no sepa de dónde vino cada campo.
 */
data class FichaLibro(
    val titulo: String,
    val autor: String,
    val anio: Int? = null,
    val paginas: Int? = null,
    val isbn: String? = null,
    val idioma: Idioma? = null,
    val editorial: String? = null,
    val sinopsis: String? = null,
    val portada: String? = null,
    val fuente: Fuente,
)

enum class Fuente(val etiqueta: String, val verificada: Boolean) {
    CACHE("Caché local", true),
    GOOGLE_BOOKS("Google Books", true),
    OPEN_LIBRARY("Open Library", true),
    /** Los scrapers no son catálogo bibliográfico: la ficha se marca como no verificada. */
    AMAZON("Amazon", false),
    GANDHI("Gandhi", false),
}

/* ═══════════════════════════ Google Books ═══════════════════════════════
 *
 * Fuente primaria. Mejor cobertura de ediciones en español y la única que
 * devuelve sinopsis y portada en buena resolución.
 *
 * Base: https://www.googleapis.com/
 * Clave: BuildConfig.GOOGLE_BOOKS_KEY, inyectada desde local.properties.
 */
interface GoogleBooksApi {

    @GET("books/v1/volumes")
    suspend fun buscar(
        @Query("q") consulta: String,
        @Query("key") clave: String,
        @Query("maxResults") maximo: Int = 10,
        @Query("country") pais: String = "MX",
    ): VolumenesDto

    companion object {
        const val BASE_URL = "https://www.googleapis.com/"
        fun porIsbn(isbn: String) = "isbn:$isbn"
        fun porTitulo(titulo: String) = "intitle:$titulo"
    }
}

@Serializable
data class VolumenesDto(
    @SerialName("totalItems") val total: Int = 0,
    val items: List<VolumenDto> = emptyList(),
)

@Serializable
data class VolumenDto(
    val id: String,
    @SerialName("volumeInfo") val info: VolumenInfoDto,
)

@Serializable
data class VolumenInfoDto(
    val title: String,
    val subtitle: String? = null,
    val authors: List<String> = emptyList(),
    val publisher: String? = null,
    /** "1967", "1967-05" o "1967-05-30": nos quedamos con los cuatro primeros dígitos. */
    val publishedDate: String? = null,
    val description: String? = null,
    val pageCount: Int? = null,
    val language: String? = null,
    val industryIdentifiers: List<IdentificadorDto> = emptyList(),
    val imageLinks: ImagenesDto? = null,
)

@Serializable
data class IdentificadorDto(val type: String, val identifier: String)

@Serializable
data class ImagenesDto(
    val thumbnail: String? = null,
    val smallThumbnail: String? = null,
)

fun VolumenDto.aFicha(): FichaLibro? {
    if (info.title.isBlank()) return null
    return FichaLibro(
        titulo = listOfNotNull(info.title, info.subtitle).joinToString(". "),
        autor = info.authors.firstOrNull() ?: "Autor desconocido",
        anio = info.publishedDate?.take(4)?.toIntOrNull(),
        paginas = info.pageCount?.takeIf { it > 0 },
        isbn = info.industryIdentifiers.firstOrNull { it.type == "ISBN_13" }?.identifier
            ?: info.industryIdentifiers.firstOrNull()?.identifier,
        idioma = info.language?.let { codigo ->
            // Google usa ISO 639-1 ("es"), no MARC ("spa").
            when (codigo) {
                "es" -> Idioma.ESPANOL
                "en" -> Idioma.INGLES
                "fr" -> Idioma.FRANCES
                "it" -> Idioma.ITALIANO
                "pt" -> Idioma.PORTUGUES
                "de" -> Idioma.ALEMAN
                else -> null
            }
        },
        editorial = info.publisher,
        sinopsis = info.description,
        // Llega en http y con zoom bajo; se fuerza https y se sube la resolución.
        portada = info.imageLinks?.thumbnail
            ?.replace("http://", "https://")
            ?.replace("&zoom=1", "&zoom=2"),
        fuente = Fuente.GOOGLE_BOOKS,
    )
}

/* ═══════════════════════════ Open Library ═══════════════════════════════
 *
 * Respaldo abierto, sin clave ni cuota. Cubre bien el fondo antiguo y lo que
 * Google no tiene indexado, con fichas más pobres. Es la fuente que ya usa la
 * búsqueda por título del prototipo.
 *
 * Base: https://openlibrary.org/
 * Verificado: el parámetro `fields` funciona y recorta bastante la respuesta;
 * la API responde con `access-control-allow-origin: *`.
 */
interface OpenLibraryApi {

    @GET("search.json")
    suspend fun buscarPorTitulo(
        @Query("title") titulo: String,
        @Query("limit") limite: Int = 12,
        @Query("fields") campos: String = CAMPOS,
    ): BusquedaOpenLibraryDto

    @GET("search.json")
    suspend fun buscarPorIsbn(
        @Query("q") consulta: String,
        @Query("limit") limite: Int = 1,
        @Query("fields") campos: String = CAMPOS,
    ): BusquedaOpenLibraryDto

    companion object {
        const val BASE_URL = "https://openlibrary.org/"
        const val PORTADAS = "https://covers.openlibrary.org/b/id/"
        const val CAMPOS =
            "key,title,author_name,first_publish_year,cover_i,number_of_pages_median,isbn,language,publisher"

        fun consultaIsbn(isbn: String) = "isbn:$isbn"
    }
}

@Serializable
data class BusquedaOpenLibraryDto(
    @SerialName("numFound") val encontrados: Int = 0,
    val docs: List<DocumentoOpenLibraryDto> = emptyList(),
)

@Serializable
data class DocumentoOpenLibraryDto(
    val key: String,
    val title: String,
    @SerialName("author_name") val autores: List<String> = emptyList(),
    @SerialName("first_publish_year") val primerAnio: Int? = null,
    @SerialName("cover_i") val portadaId: Int? = null,
    @SerialName("number_of_pages_median") val paginasMedianas: Int? = null,
    val isbn: List<String> = emptyList(),
    /** Códigos MARC de todas las ediciones, sin orden de relevancia. */
    val language: List<String> = emptyList(),
    val publisher: List<String> = emptyList(),
)

fun DocumentoOpenLibraryDto.aFicha() = FichaLibro(
    titulo = title,
    autor = autores.firstOrNull() ?: "Autor desconocido",
    anio = primerAnio,
    paginas = paginasMedianas,
    isbn = isbn.firstOrNull(),
    idioma = Idioma.desdeMarc(language),
    editorial = publisher.firstOrNull(),
    sinopsis = null,   // la búsqueda no la trae; requiere /works/{key}.json
    portada = portadaId?.let { "${OpenLibraryApi.PORTADAS}$it-M.jpg" },
    fuente = Fuente.OPEN_LIBRARY,
)
