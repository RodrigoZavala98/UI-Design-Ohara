package mx.bibliotheca.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf

/**
 * Preferencia de tema del usuario (Ajustes → Apariencia).
 *
 * CLARO y OSCURO son elección explícita; SISTEMA sigue al ajuste del teléfono.
 * SEPIA es un modo propio de lectura, no una variante de claro: tiene su
 * escala de papel cálido y no debe activarse solo por el modo del sistema.
 */
enum class ModoTema { CLARO, SEPIA, OSCURO, SISTEMA }

private val LocalColoresExtra = staticCompositionLocalOf {
    Apariencia.NEBLINA.claro.coloresExtra()
}

private val LocalTipografiaExtra = staticCompositionLocalOf { TipografiaExtra() }

private val LocalApariencia = staticCompositionLocalOf { Apariencia.NEBLINA }

/**
 * Tema de la aplicación.
 *
 * La apariencia y el modo llegan desde las preferencias del usuario; el
 * llamador los observa y los pasa, de modo que cambiarlos en Ajustes recolorea
 * la aplicación entera sin reiniciar.
 *
 * No se usa color dinámico (Material You): la identidad de Bibliotheca depende
 * de que la tríada 60-30-10 se mantenga exacta, y el color extraído del fondo
 * de pantalla la rompería.
 */
@Composable
fun BibliothecaTheme(
    apariencia: Apariencia = Apariencia.NEBLINA,
    modo: ModoTema = ModoTema.CLARO,
    content: @Composable () -> Unit,
) {
    val paleta = apariencia.paleta(modo, sistemaOscuro = isSystemInDarkTheme())
    val esquema = paleta.aEsquema()

    CompositionLocalProvider(
        LocalApariencia provides apariencia,
        LocalColoresExtra provides paleta.coloresExtra(),
        LocalTipografiaExtra provides TipografiaExtra(),
    ) {
        MaterialTheme(
            colorScheme = esquema,
            typography = BibliothecaTypography,
            content = content,
        )
    }
}

/**
 * Accesos a lo que no cabe en MaterialTheme.
 *
 *   BibliothecaTheme.extra.tintaSuave      → captions y placeholders
 *   BibliothecaTheme.tipografia.cita       → frases y sinopsis
 *   BibliothecaTheme.apariencia            → apariencia activa
 */
object BibliothecaTheme {
    val extra: ColoresExtra
        @Composable get() = LocalColoresExtra.current

    val tipografia: TipografiaExtra
        @Composable get() = LocalTipografiaExtra.current

    val apariencia: Apariencia
        @Composable get() = LocalApariencia.current
}

/*
 * Los tres modos están definidos con contrastes verificados: ver
 * `docs/documentacion.html` → Sistema de diseño → Los tres modos.
 *
 * SEPIA comparte su escala de papel entre las cuatro apariencias; lo único
 * que cambia de una a otra es el acento, oscurecido un paso para que no
 * pierda contraste sobre crema.
 */
