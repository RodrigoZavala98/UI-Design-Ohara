package mx.bibliotheca.data.local

import androidx.room.Dao
import androidx.room.Database
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.RoomDatabase
import androidx.room.Transaction
import androidx.room.TypeConverters
import androidx.room.Update
import kotlinx.coroutines.flow.Flow
import java.time.LocalDate

/**
 * Consultas derivadas de lo que cada pantalla necesita mostrar.
 * Todo devuelve Flow: al registrar un avance, la colección, el detalle y el
 * resumen anual se recomponen solos.
 */
@Dao
interface BibliothecaDao {

    /* ── Colección ─────────────────────────────────────────────────── */

    @Transaction
    @Query("SELECT * FROM libros ORDER BY titulo")
    fun observarLibros(): Flow<List<LibroCompleto>>

    /** Buscador de la colección: filtra por título o autor, sin distinguir mayúsculas. */
    @Transaction
    @Query(
        """
        SELECT * FROM libros
        WHERE (:consulta = '' OR titulo LIKE '%' || :consulta || '%' COLLATE NOCASE
                             OR autor  LIKE '%' || :consulta || '%' COLLATE NOCASE)
          AND (:genero IS NULL OR genero = :genero)
        ORDER BY titulo
        """
    )
    fun buscarEnColeccion(consulta: String, genero: String?): Flow<List<LibroCompleto>>

    @Query("SELECT COUNT(*) FROM libros WHERE leido = 1")
    fun contarLeidos(): Flow<Int>

    @Transaction
    @Query("SELECT * FROM libros WHERE id = :libroId")
    fun observarLibro(libroId: String): Flow<LibroCompleto?>

    @Query("SELECT * FROM libros WHERE isbn = :isbn LIMIT 1")
    suspend fun libroPorIsbn(isbn: String): LibroEntity?

    /* ── Libreros ──────────────────────────────────────────────────── */

    @Query("SELECT * FROM libreros ORDER BY orden, nombre")
    fun observarLibreros(): Flow<List<LibreroEntity>>

    @Transaction
    @Query("SELECT * FROM libros WHERE libreroId = :libreroId ORDER BY titulo")
    fun librosDelLibrero(libreroId: String): Flow<List<LibroCompleto>>

    /* ── Préstamos ─────────────────────────────────────────────────── */

    @Transaction
    @Query("SELECT * FROM prestamos WHERE devuelto = 0 ORDER BY venceEl")
    fun observarPrestamosActivos(): Flow<List<PrestamoConLibro>>

    @Transaction
    @Query("SELECT * FROM prestamos WHERE devuelto = 1 ORDER BY devueltoEl DESC")
    fun observarHistorialPrestamos(): Flow<List<PrestamoConLibro>>

    @Query("UPDATE prestamos SET devuelto = 1, devueltoEl = :fecha WHERE id = :prestamoId")
    suspend fun marcarDevuelto(prestamoId: String, fecha: LocalDate = LocalDate.now())

    /* ── Seguimiento de lectura ────────────────────────────────────── */

    @Query("SELECT * FROM sesiones_lectura WHERE libroId = :libroId ORDER BY fecha DESC, id DESC")
    fun observarHistorial(libroId: String): Flow<List<SesionLecturaEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertarSesion(sesion: SesionLecturaEntity)

    @Query("DELETE FROM sesiones_lectura WHERE id = :sesionId")
    suspend fun borrarSesion(sesionId: String)

    /**
     * Registrar un avance y sincronizar el estado del libro es una sola
     * operación: si se guardara la sesión sin actualizar `paginaActual` y
     * `leido`, la ficha quedaría contradiciendo a su propio historial.
     */
    @Transaction
    suspend fun registrarAvance(libro: LibroEntity, sesion: SesionLecturaEntity) {
        insertarSesion(sesion)
        actualizarLibro(
            libro.copy(
                paginaActual = sesion.paginaHasta,
                leido = sesion.paginaHasta >= libro.paginas,
            )
        )
    }

    /**
     * Al borrar una entrada, la página actual vuelve al último avance que
     * queda —o a cero si no queda ninguno— y el estado de leído se reajusta.
     */
    @Transaction
    suspend fun borrarSesionYRecalcular(libro: LibroEntity, sesionId: String) {
        borrarSesion(sesionId)
        val ultima = ultimaPagina(libro.id) ?: 0
        actualizarLibro(libro.copy(paginaActual = ultima, leido = ultima >= libro.paginas))
    }

    @Query("SELECT MAX(paginaHasta) FROM sesiones_lectura WHERE libroId = :libroId")
    suspend fun ultimaPagina(libroId: String): Int?

    /* ── Resumen anual ─────────────────────────────────────────────── */

    /**
     * Libros terminados dentro del año, fechados por la sesión que alcanzó la
     * última página. Es la definición que usa "My year in books": una estrella
     * por libro completado, ordenados del mes más reciente al más antiguo.
     */
    @Transaction
    @Query(
        """
        SELECT l.* FROM libros l
        JOIN sesiones_lectura s ON s.libroId = l.id
        WHERE s.paginaHasta >= l.paginas
          AND strftime('%Y', s.fecha) = :anio
        GROUP BY l.id
        ORDER BY MAX(s.fecha) DESC
        """
    )
    fun librosTerminadosEn(anio: String): Flow<List<LibroCompleto>>

    /** Mes (1–12) en que se terminó cada libro, para agrupar el resumen. */
    @Query(
        """
        SELECT l.id AS libroId, CAST(strftime('%m', MAX(s.fecha)) AS INTEGER) AS mes
        FROM libros l
        JOIN sesiones_lectura s ON s.libroId = l.id
        WHERE s.paginaHasta >= l.paginas AND strftime('%Y', s.fecha) = :anio
        GROUP BY l.id
        """
    )
    fun mesDeTermino(anio: String): Flow<List<MesTermino>>

    /**
     * Páginas leídas en el año: suma de todos los tramos registrados, así que
     * incluye lo avanzado en libros que aún no se terminan.
     */
    @Query(
        """
        SELECT COALESCE(SUM(paginaHasta - paginaDesde), 0)
        FROM sesiones_lectura WHERE strftime('%Y', fecha) = :anio
        """
    )
    fun paginasLeidasEn(anio: String): Flow<Int>

    /* ── Escrituras ────────────────────────────────────────────────── */

    @Insert(onConflict = OnConflictStrategy.ABORT)
    suspend fun insertarLibro(libro: LibroEntity)

    @Update
    suspend fun actualizarLibro(libro: LibroEntity)

    @Query("DELETE FROM libros WHERE id = :libroId")
    suspend fun borrarLibro(libroId: String)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun guardarFrase(frase: FraseEntity)

    @Query("DELETE FROM frases WHERE id = :fraseId")
    suspend fun borrarFrase(fraseId: String)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun guardarPrestamo(prestamo: PrestamoEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun guardarLibrero(librero: LibreroEntity)
}

data class MesTermino(val libroId: String, val mes: Int)

/** Ficha resuelta por el motor de metadatos, cacheada por ISBN 30 días. */
@androidx.room.Entity(tableName = "cache_metadatos")
data class MetadatosCacheEntity(
    @androidx.room.PrimaryKey val isbn: String,
    val titulo: String,
    val autor: String,
    val anio: Int?,
    val paginas: Int?,
    val idioma: String?,
    val editorial: String?,
    val sinopsis: String?,
    val portada: String?,
    val fuente: String,
    val resueltoEl: LocalDate,
)

@Dao
interface MetadatosCacheDao {
    @Query("SELECT * FROM cache_metadatos WHERE isbn = :isbn AND resueltoEl >= :minimo")
    suspend fun vigente(isbn: String, minimo: LocalDate): MetadatosCacheEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun guardar(entrada: MetadatosCacheEntity)

    @Query("DELETE FROM cache_metadatos WHERE resueltoEl < :minimo")
    suspend fun purgar(minimo: LocalDate)
}

@Database(
    entities = [
        LibroEntity::class,
        LibreroEntity::class,
        FraseEntity::class,
        SesionLecturaEntity::class,
        PrestamoEntity::class,
        MetadatosCacheEntity::class,
    ],
    version = 1,
    exportSchema = true,
)
@TypeConverters(Conversores::class)
abstract class BibliothecaDatabase : RoomDatabase() {
    abstract fun dao(): BibliothecaDao
    abstract fun cacheDao(): MetadatosCacheDao
}
