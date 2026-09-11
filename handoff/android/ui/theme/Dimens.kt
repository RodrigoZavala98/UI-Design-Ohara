package mx.bibliotheca.ui.theme

import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp

/**
 * Medidas del boceto.
 *
 * REGLA DE CONVERSIÓN: el boceto está trazado a 390 × 844 px CSS, y 1 px CSS
 * equivale a 1 dp. Todas las medidas se copian tal cual, sin recalcular.
 * El dispositivo de referencia es un iPhone 14; en Android el ancho útil
 * habitual va de 360 a 412 dp, así que ningún ancho fijo debe hardcodearse:
 * lo que el boceto resuelve con un lienzo de 390 px, aquí lo resuelve
 * `fillMaxWidth()` con los paddings de abajo.
 *
 * Equivalencias de las utilidades del prototipo, por si hay que leer el TSX:
 *   rounded-xl  = 12 dp     p-3  / gap-3  = 12 dp
 *   rounded-2xl = 16 dp     p-3.5         = 14 dp
 *   rounded-3xl = 24 dp     p-4  / px-4   = 16 dp
 *   rounded-full= 999 dp    p-5  / px-5   = 20 dp
 *                           px-6          = 24 dp
 */
object Dimens {

    /* ── Rejilla base ──────────────────────────────────────────────── */
    /** Margen lateral de casi todas las pantallas (px-6). */
    val margenPantalla: Dp = 24.dp
    /** Margen lateral dentro de modales y fichas (p-5). */
    val margenContenido: Dp = 20.dp
    val separacionLista: Dp = 10.dp
    val separacionSeccion: Dp = 20.dp

    /* ── Radios ────────────────────────────────────────────────────── */
    val radioChip: Dp = 999.dp
    val radioCampo: Dp = 12.dp
    val radioTarjeta: Dp = 16.dp
    val radioPanel: Dp = 24.dp
    /** Esquina del marco del dispositivo en el boceto; en Android lo da el sistema. */
    val radioDispositivo: Dp = 44.dp

    /* ── Navegación inferior ───────────────────────────────────────── */
    val alturaNavegacion: Dp = 72.dp
    val diametroFab: Dp = 56.dp
    /**
     * Lo que el FAB sobresale por encima de la barra. En el boceto se resuelve
     * con margen negativo dentro de la barra; en Compose corresponde a un
     * FloatingActionButton anclado con `FabPosition.Center` sobre una
     * NavigationBar de 5 posiciones, o a un offset equivalente.
     */
    val sobresalienteFab: Dp = 22.dp

    /* ── Portadas ──────────────────────────────────────────────────── */
    /** Proporción de toda portada de libro. */
    const val PROPORCION_PORTADA = 2f / 3f
    val portadaListaAncho: Dp = 48.dp
    val portadaListaAlto: Dp = 68.dp
    val portadaPrestamoAncho: Dp = 52.dp
    val portadaPrestamoAlto: Dp = 74.dp
    val portadaResumenAncho: Dp = 62.dp
    val portadaResumenAlto: Dp = 92.dp
    val portadaBusquedaAncho: Dp = 44.dp
    val portadaBusquedaAlto: Dp = 64.dp

    /* ── Detalle del libro ─────────────────────────────────────────── */
    /** Altura de la portada a sangre en la ficha. */
    val alturaHeroDetalle: Dp = 280.dp
    val alturaBarraProgreso: Dp = 7.dp

    /* ── Otros ─────────────────────────────────────────────────────── */
    val alturaVisorEscaner: Dp = 300.dp
    val huecoIcono: Dp = 36.dp          // cuadro de icono en filas de ficha
    val huecoIconoGrande: Dp = 44.dp    // cuadro de icono en tarjetas de método
    val avatarPrestamo: Dp = 28.dp
    val avatarPerfil: Dp = 48.dp

    /* ── Columnas ──────────────────────────────────────────────────── */
    const val COLUMNAS_COLECCION = 3       // rejilla de la colección
    const val COLUMNAS_LIBRERO_ABIERTO = 4 // rejilla dentro de un librero
}

/**
 * Duraciones y retardos de las animaciones del boceto.
 * El escalonado de listas es lo que da su carácter a la entrada de cada pantalla.
 */
object Motion {
    const val ENTRADA_MS = 280        // fadeIn
    const val DESLIZA_ARRIBA_MS = 340 // slideUp, modal de añadir
    const val DESLIZA_LADO_MS = 260   // slideRight, pantallas apiladas
    const val ESCALA_MS = 220         // scaleIn, elementos dentro de una vista visible
    /** Retardo acumulado por elemento en listas escalonadas (35–50 ms). */
    const val ESCALONADO_MS = 45
}
