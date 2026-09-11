package mx.bibliotheca.data.local

import androidx.room.ColumnInfo
import androidx.room.Embedded
import androidx.room.Entity
import androidx.room.ForeignKey
import androidx.room.Index
import androidx.room.PrimaryKey
import androidx.room.Relation
import androidx.room.TypeConverter
import java.time.LocalDate

/**
 * Modelo de dominio, traducido de `src/data.ts` del prototipo.
 *
 * Tres decisiones respecto al boceto:
 *  1. Las frases y el historial de lectura son tablas propias, no listas
 *     embebidas. Se consultan y se borran de forma individual, y el resumen
 *     anual agrega sobre el historial de todos los libros.
 *  2. Las fechas son LocalDate. El boceto las guarda como texto ISO y las
 *     formatea al vuelo; el formato (DD-MM-AAAA o AAAA-MM-DD) es preferencia
 *     de usuario y pertenece a la capa de presentación, nunca al almacenamiento.
 *  3. Género, idioma y edición son enums. En el boceto son cadenas con una
 *     lista de opciones al lado; el enum impide estados imposibles.
 */

/* ── Catálogos ─────────────────────────────────────────────────────────── */

enum class Edicion(val etiqueta: String) {
    TAPA_BLANDA("Tapa blanda"),
    TAPA_DURA("Tapa dura"),
    BOLSILLO("Edición de bolsillo"),
    EBOOK("eBook"),
    AUDIOLIBRO("Audiolibro"),
    CD("CD"),
    DVD("DVD"),
}

enum class Idioma(val etiqueta: String, val codigoMarc: String) {
    ESPANOL("Español", "spa"),
    INGLES("Inglés", "eng"),
    FRANCES("Francés", "fre"),
    ITALIANO("Italiano", "ita"),
    PORTUGUES("Portugués", "por"),
    ALEMAN("Alemán", "ger");

    companion object {
        /**
         * Los catálogos devuelven los idiomas de todas las ediciones sin orden
         * de relevancia: para "Pedro Páramo", Open Library encabeza con "swe".
         * Preferimos español y, si no está, el primer código reconocible.
         */
        fun desdeMarc(codigos: List<String>): Idioma? {
            if (codigos.contains(ESPANOL.codigoMarc)) return ESPANOL
            val alterno = mapOf("fra" to FRANCES, "deu" to ALEMAN)
            return codigos.firstNotNullOfOrNull { codigo ->
                entries.find { it.codigoMarc == codigo } ?: alterno[codigo]
            }
        }
    }
}

enum class Genero(val etiqueta: String) {
    LITERATURA("Literatura"),
    NARRATIVA("Narrativa"),
    ENSAYO("Ensayo"),
    CIENCIA("Ciencia"),
    HISTORIA("Historia"),
    POESIA("Poesía"),
    BIOGRAFIA("Biografía"),
    INFANTIL("Infantil"),
}

/* ── Tablas ────────────────────────────────────────────────────────────── */

@Entity(tableName = "libreros")
data class LibreroEntity(
    @PrimaryKey val id: String,
    val nombre: String,
    val icono: String,
    /** Color del librero en ARGB. */
    val color: Int,
    val orden: Int = 0,
)

@Entity(
    tableName = "libros",
    foreignKeys = [
        ForeignKey(
            entity = LibreroEntity::class,
            parentColumns = ["id"],
            childColumns = ["libreroId"],
            onDelete = ForeignKey.SET_NULL,
        ),
    ],
    indices = [Index("libreroId"), Index(value = ["isbn"], unique = true)],
)
data class LibroEntity(
    @PrimaryKey val id: String,
    val titulo: String,
    val autor: String,
    val anio: Int,
    val paginas: Int,
    val isbn: String?,
    val genero: Genero,
    val idioma: Idioma,
    val edicion: Edicion,
    val libreroId: String?,
    /** URL remota o URI local de la portada. */
    val portada: String?,
    /** Color del lomo, usado como fondo de carga, sombra y resaltado de frases. */
    @ColumnInfo(name = "color_lomo") val colorLomo: Int,
    val calificacion: Int,
    val leido: Boolean,
    val sinopsis: String?,
    val resena: String?,
    /** Página por la que va la lectura. Derivable del historial, se guarda por rapidez de consulta. */
    val paginaActual: Int = 0,
    val anadidoEl: LocalDate = LocalDate.now(),
)

@Entity(
    tableName = "frases",
    foreignKeys = [
        ForeignKey(
            entity = LibroEntity::class,
            parentColumns = ["id"],
            childColumns = ["libroId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index("libroId")],
)
data class FraseEntity(
    @PrimaryKey val id: String,
    val libroId: String,
    val texto: String,
    val pagina: Int?,
    val guardadaEl: LocalDate = LocalDate.now(),
)

@Entity(
    tableName = "sesiones_lectura",
    foreignKeys = [
        ForeignKey(
            entity = LibroEntity::class,
            parentColumns = ["id"],
            childColumns = ["libroId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index("libroId"), Index("fecha")],
)
data class SesionLecturaEntity(
    @PrimaryKey val id: String,
    val libroId: String,
    val fecha: LocalDate,
    val paginaDesde: Int,
    val paginaHasta: Int,
) {
    val paginasLeidas: Int get() = paginaHasta - paginaDesde
}

@Entity(
    tableName = "prestamos",
    foreignKeys = [
        ForeignKey(
            entity = LibroEntity::class,
            parentColumns = ["id"],
            childColumns = ["libroId"],
            onDelete = ForeignKey.CASCADE,
        ),
    ],
    indices = [Index("libroId")],
)
data class PrestamoEntity(
    @PrimaryKey val id: String,
    val libroId: String,
    val prestatario: String,
    /** Iniciales para el avatar; se derivan del nombre si no se indican. */
    val iniciales: String,
    val prestadoEl: LocalDate,
    val venceEl: LocalDate,
    val devuelto: Boolean = false,
    val devueltoEl: LocalDate? = null,
)

/* ── Proyecciones ──────────────────────────────────────────────────────── */

/** Lo que necesita la ficha de detalle en una sola consulta. */
data class LibroCompleto(
    @Embedded val libro: LibroEntity,
    @Relation(parentColumn = "libreroId", entityColumn = "id")
    val librero: LibreroEntity?,
    @Relation(parentColumn = "id", entityColumn = "libroId")
    val frases: List<FraseEntity>,
    @Relation(parentColumn = "id", entityColumn = "libroId")
    val sesiones: List<SesionLecturaEntity>,
    @Relation(parentColumn = "id", entityColumn = "libroId")
    val prestamos: List<PrestamoEntity>,
) {
    val prestamoActivo: PrestamoEntity? get() = prestamos.firstOrNull { !it.devuelto }
    val porcentaje: Int
        get() = if (libro.paginas > 0) (libro.paginaActual * 100) / libro.paginas else 0
}

/** Fila de la pantalla de préstamos: el préstamo con su libro. */
data class PrestamoConLibro(
    @Embedded val prestamo: PrestamoEntity,
    @Relation(parentColumn = "libroId", entityColumn = "id")
    val libro: LibroEntity,
)

/* ── Conversores ───────────────────────────────────────────────────────── */

class Conversores {
    @TypeConverter fun fechaATexto(v: LocalDate?): String? = v?.toString()
    @TypeConverter fun textoAFecha(v: String?): LocalDate? = v?.let(LocalDate::parse)

    @TypeConverter fun edicionATexto(v: Edicion): String = v.name
    @TypeConverter fun textoAEdicion(v: String): Edicion = Edicion.valueOf(v)

    @TypeConverter fun idiomaATexto(v: Idioma): String = v.name
    @TypeConverter fun textoAIdioma(v: String): Idioma = Idioma.valueOf(v)

    @TypeConverter fun generoATexto(v: Genero): String = v.name
    @TypeConverter fun textoAGenero(v: String): Genero = Genero.valueOf(v)
}
