package mx.bibliotheca.ui.navigation

import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.navigation.NavType
import androidx.navigation.navArgument
import mx.bibliotheca.ui.theme.Motion

/**
 * Mapa de navegación, derivado del orden de apilamiento del boceto.
 *
 * El prototipo no tiene enrutador: apila capas absolutas dentro del marco del
 * dispositivo con z-index. Esa jerarquía se traduce así:
 *
 *   boceto                              → Android
 *   ──────────────────────────────────────────────────────────────────────
 *   Pestañas de la nav inferior          → destinos raíz con NavigationBar
 *   Detalle del libro        (z 50)      → destino apilado, entra de derecha
 *   Ajustes                  (z 60)      → destino apilado, entra de derecha
 *   Subsecciones de Ajustes  (z 70)      → destinos anidados en su grafo
 *   Añadir libro             (z 60)      → hoja modal: en el boceto entra
 *                                          deslizando desde abajo, que en
 *                                          Android es un ModalBottomSheet a
 *                                          altura completa, no un destino
 *
 * El botón flotante de la barra no es una pestaña: es una acción. No participa
 * del backstack ni conserva estado de pestaña.
 */
sealed class Destino(val ruta: String) {

    /* ── Raíces: las tres pestañas de la barra inferior ────────────── */
    data object Coleccion : Destino("coleccion")
    data object Libreros : Destino("libreros")
    data object Prestamos : Destino("prestamos")

    /* ── Apilados ──────────────────────────────────────────────────── */
    data object DetalleLibro : Destino("libro/{libroId}") {
        const val ARG = "libroId"
        fun crearRuta(libroId: String) = "libro/$libroId"
        val argumentos = listOf(navArgument(ARG) { type = NavType.StringType })
    }

    data object Ajustes : Destino("ajustes")

    data object AjustesSeccion : Destino("ajustes/{seccion}") {
        const val ARG = "seccion"
        fun crearRuta(seccion: SeccionAjustes) = "ajustes/${seccion.name.lowercase()}"
        val argumentos = listOf(navArgument(ARG) { type = NavType.StringType })
    }

    data object ResumenAnual : Destino("ajustes/resumen-anual")

    /* ── Hoja modal, fuera del grafo ───────────────────────────────── */
    data object AnadirLibro : Destino("anadir")
}

enum class SeccionAjustes { APARIENCIA, LIBRERIA, NOTIFICACIONES, PRIVACIDAD, ACERCA_DE }

/** Las tres pestañas, en el orden en que aparecen en la barra. */
enum class Pestana(val destino: Destino, val etiqueta: String) {
    COLECCION(Destino.Coleccion, "Colección"),
    LIBREROS(Destino.Libreros, "Libreros"),
    PRESTAMOS(Destino.Prestamos, "Préstamos"),
}

/**
 * Transiciones equivalentes a las cuatro animaciones del boceto.
 *
 * `slideRight` del prototipo es la entrada estándar de un destino apilado;
 * `slideUp` corresponde a la hoja modal de añadir libro, que la gestiona el
 * propio ModalBottomSheet.
 */
object Transiciones {
    private val duracion = tween<Float>(Motion.DESLIZA_LADO_MS)
    private val duracionOffset = tween<androidx.compose.ui.unit.IntOffset>(Motion.DESLIZA_LADO_MS)

    val entrada: AnimatedContentTransitionScope<*>.() -> androidx.compose.animation.EnterTransition = {
        slideInHorizontally(duracionOffset) { ancho -> ancho / 6 } + fadeIn(duracion)
    }

    val salida: AnimatedContentTransitionScope<*>.() -> androidx.compose.animation.ExitTransition = {
        slideOutHorizontally(duracionOffset) { ancho -> -ancho / 12 } + fadeOut(duracion)
    }
}

/*
 * NOTAS PARA LA IMPLEMENTACIÓN
 *
 * · La barra inferior se muestra solo en los tres destinos raíz. En detalle,
 *   ajustes y resumen anual desaparece: en el boceto esas pantallas cubren el
 *   lienzo entero, incluida la barra.
 *
 * · Cada pestaña conserva su propio backstack (`saveState`/`restoreState` al
 *   navegar entre raíces), de modo que volver a Colección recupera el filtro y
 *   la posición de desplazamiento.
 *
 * · El selector Información / Seguimiento de la ficha NO es navegación: son
 *   dos vistas del mismo destino y comparten el estado de lectura. Un cambio
 *   de página tiene que verse al instante en el chip de estado de la otra
 *   pestaña, así que el estado vive en el ViewModel del detalle.
 *
 * · "My year in books" cuelga de Ajustes porque es donde está su entrada
 *   destacada, pero no es una subsección: tiene su propia ruta para poder
 *   enlazarla desde una notificación de resumen anual sin pasar por Ajustes.
 */
