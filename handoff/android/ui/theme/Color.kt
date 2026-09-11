package mx.bibliotheca.ui.theme

import androidx.compose.material3.ColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.ui.graphics.Color

/**
 * Fórmula 60 – 30 – 10
 * ─────────────────────────────────────────────────────────────
 *  60 %  DOMINANTE  el fondo      — lienzos de pantalla, superficies base
 *  30 %  ESTRUCTURA la estructura — tarjetas, navegación, campos, contenedores
 *  10 %  ACENTO     la acción     — botón primario, pestaña activa, FAB, badges
 *
 * DOS EJES INDEPENDIENTES
 *  · La [Apariencia] elige la familia cromática: el matiz de la tríada.
 *  · El [ModoTema] decide cómo se renderiza esa familia: la luminosidad del
 *    60 y el 30, y la corrección que necesita el acento para seguir leyéndose.
 *
 * Cuatro apariencias por tres modos = doce combinaciones con un solo juego de
 * tokens. Los tres niveles viajan siempre juntos: cambiar solo el acento deja
 * el fondo y la estructura en la familia anterior y el conjunto se ve roto.
 *
 * Contrastes WCAG verificados en `docs/documentacion.html` → Sistema de diseño.
 */
data class Paleta(
    /* 60 % dominante */
    val dominante: Color,
    val dominanteClaro: Color,
    val dominanteProfundo: Color,
    /* 30 % estructura */
    val estructura: Color,
    val estructuraClara: Color,
    val estructuraOscura: Color,
    val estructuraProfunda: Color,
    /* 10 % acento */
    val acento: Color,
    val acentoClaro: Color,
    val acentoPalido: Color,
    /* Tinta */
    val tinta: Color,
    val tintaMedia: Color,
    val tintaSuave: Color,
    val tintaTenue: Color,
    /** Texto sobre el acento: blanco en claro y sepia, el fondo en oscuro. */
    val sobreAcento: Color,
    val esOscura: Boolean,
)

/** Colores semánticos. Conservan su significado en los tres modos. */
object Semantico {
    val error = Color(0xFFA05050)
    val errorPalido = Color(0xFFF0DADA)
    val aviso = Color(0xFFC07858)
    val avisoPalido = Color(0xFFF5E8E0)
    /* Variantes aclaradas para el modo oscuro. */
    val errorOscuro = Color(0xFFD98B8B)
    val avisoOscuro = Color(0xFFDFA07E)
}

/* ── Escala de papel del modo sepia ────────────────────────────────────────
 * Común a las cuatro apariencias: el papel es el papel. Solo cambia el acento.
 */
private object Papel {
    val fondo = Color(0xFFF2E8D5)
    val fondoClaro = Color(0xFFF8F1E3)
    val fondoProfundo = Color(0xFFE6DAC2)
    val estructura = Color(0xFFDCCDB0)
    val estructuraClara = Color(0xFFE9DEC6)
    val estructuraOscura = Color(0xFFC6B291)
    val estructuraProfunda = Color(0xFFA48F6E)
    val tinta = Color(0xFF33291C)
    val tintaMedia = Color(0xFF5A4B36)
    val tintaSuave = Color(0xFF8A795F)
    val tintaTenue = Color(0xFFB3A184)
}

/** Construye la paleta sepia de una apariencia a partir de su acento. */
private fun sepia(acento: Long, acentoClaro: Long, acentoPalido: Long) = Paleta(
    dominante = Papel.fondo,
    dominanteClaro = Papel.fondoClaro,
    dominanteProfundo = Papel.fondoProfundo,
    estructura = Papel.estructura,
    estructuraClara = Papel.estructuraClara,
    estructuraOscura = Papel.estructuraOscura,
    estructuraProfunda = Papel.estructuraProfunda,
    acento = Color(acento),
    acentoClaro = Color(acentoClaro),
    acentoPalido = Color(acentoPalido),
    tinta = Papel.tinta,
    tintaMedia = Papel.tintaMedia,
    tintaSuave = Papel.tintaSuave,
    tintaTenue = Papel.tintaTenue,
    sobreAcento = Color.White,
    esOscura = false,
)

enum class Apariencia(
    val etiqueta: String,
    val descripcion: String,
    val claro: Paleta,
    val sepia: Paleta,
    val oscuro: Paleta,
) {
    SALVIA(
        etiqueta = "Salvia",
        descripcion = "Equilibrio natural",
        claro = Paleta(
            dominante = Color(0xFFF2EDE4), dominanteClaro = Color(0xFFF8F5F0), dominanteProfundo = Color(0xFFE8E1D5),
            estructura = Color(0xFFC5D4CA), estructuraClara = Color(0xFFDCE8E0),
            estructuraOscura = Color(0xFFA8C0B2), estructuraProfunda = Color(0xFF8AAA96),
            acento = Color(0xFF4E7C5F), acentoClaro = Color(0xFF6B9678), acentoPalido = Color(0xFFD2E5DA),
            tinta = Color(0xFF2A3830), tintaMedia = Color(0xFF4A6055),
            tintaSuave = Color(0xFF7A9A88), tintaTenue = Color(0xFFADC4B8),
            sobreAcento = Color.White, esOscura = false,
        ),
        sepia = sepia(acento = 0xFF4E7C5F, acentoClaro = 0xFF6B9678, acentoPalido = 0xFFDFE7DC),
        oscuro = Paleta(
            dominante = Color(0xFF1A2620), dominanteClaro = Color(0xFF223029), dominanteProfundo = Color(0xFF15201B),
            estructura = Color(0xFF26362D), estructuraClara = Color(0xFF2F4238),
            estructuraOscura = Color(0xFF3A4F43), estructuraProfunda = Color(0xFF6F8F7C),
            acento = Color(0xFF89B39A), acentoClaro = Color(0xFFA4C8B3), acentoPalido = Color(0xFF24382E),
            tinta = Color(0xFFE7F1EA), tintaMedia = Color(0xFFB8CDC0),
            tintaSuave = Color(0xFF8CA79A), tintaTenue = Color(0xFF657F72),
            sobreAcento = Color(0xFF1A2620), esOscura = true,
        ),
    ),

    NEBLINA(
        etiqueta = "Neblina",
        descripcion = "Serenidad marina",
        claro = Paleta(
            dominante = Color(0xFFEEF2F7), dominanteClaro = Color(0xFFF8FAFC), dominanteProfundo = Color(0xFFE0E8F1),
            estructura = Color(0xFFC4D4E2), estructuraClara = Color(0xFFDBE7F1),
            estructuraOscura = Color(0xFFA6BCCF), estructuraProfunda = Color(0xFF7F9CB4),
            acento = Color(0xFF5A7FA0), acentoClaro = Color(0xFF7A9BB8), acentoPalido = Color(0xFFDBE7F2),
            tinta = Color(0xFF23313D), tintaMedia = Color(0xFF445A6C),
            tintaSuave = Color(0xFF7794A9), tintaTenue = Color(0xFFA9C1D2),
            sobreAcento = Color.White, esOscura = false,
        ),
        sepia = sepia(acento = 0xFF4D769B, acentoClaro = 0xFF6A90B0, acentoPalido = 0xFFE2E7EC),
        oscuro = Paleta(
            dominante = Color(0xFF17212C), dominanteClaro = Color(0xFF1E2A37), dominanteProfundo = Color(0xFF121A23),
            estructura = Color(0xFF253544), estructuraClara = Color(0xFF2E4051),
            estructuraOscura = Color(0xFF374C60), estructuraProfunda = Color(0xFF6D8BA4),
            acento = Color(0xFF8FB3D0), acentoClaro = Color(0xFFA9C6DD), acentoPalido = Color(0xFF24384A),
            tinta = Color(0xFFE6EFF7), tintaMedia = Color(0xFFB6CADB),
            tintaSuave = Color(0xFF8AA4B8), tintaTenue = Color(0xFF63798C),
            sobreAcento = Color(0xFF17212C), esOscura = true,
        ),
    ),

    LAVANDA(
        etiqueta = "Lavanda",
        descripcion = "Calma introspectiva",
        claro = Paleta(
            dominante = Color(0xFFF3F0F7), dominanteClaro = Color(0xFFFAF8FC), dominanteProfundo = Color(0xFFE8E2F0),
            estructura = Color(0xFFCFC7DE), estructuraClara = Color(0xFFE2DCEE),
            estructuraOscura = Color(0xFFB4A9C9), estructuraProfunda = Color(0xFF9385AD),
            acento = Color(0xFF7A6A9A), acentoClaro = Color(0xFF9789B3), acentoPalido = Color(0xFFE3DDEE),
            tinta = Color(0xFF2E2838), tintaMedia = Color(0xFF574D68),
            tintaSuave = Color(0xFF8D82A3), tintaTenue = Color(0xFFB9B0C9),
            sobreAcento = Color.White, esOscura = false,
        ),
        sepia = sepia(acento = 0xFF6F5F8F, acentoClaro = 0xFF8B7CA8, acentoPalido = 0xFFE5E0EA),
        oscuro = Paleta(
            dominante = Color(0xFF221D2E), dominanteClaro = Color(0xFF2B2539), dominanteProfundo = Color(0xFF1C1826),
            estructura = Color(0xFF322B42), estructuraClara = Color(0xFF3C3450),
            estructuraOscura = Color(0xFF473D5C), estructuraProfunda = Color(0xFF8B7FA5),
            acento = Color(0xFFA698C4), acentoClaro = Color(0xFFBCB0D5), acentoPalido = Color(0xFF322A44),
            tinta = Color(0xFFEEE9F6), tintaMedia = Color(0xFFC7BFD8),
            tintaSuave = Color(0xFF9D93B2), tintaTenue = Color(0xFF746A88),
            sobreAcento = Color(0xFF221D2E), esOscura = true,
        ),
    ),

    AMBAR(
        etiqueta = "Ámbar",
        descripcion = "Calidez acogedora",
        claro = Paleta(
            dominante = Color(0xFFF7F1E8), dominanteClaro = Color(0xFFFCF9F4), dominanteProfundo = Color(0xFFEEE3D4),
            estructura = Color(0xFFDDCDB4), estructuraClara = Color(0xFFEBE0CD),
            estructuraOscura = Color(0xFFC9B393), estructuraProfunda = Color(0xFFAB9271),
            acento = Color(0xFF8A6840), acentoClaro = Color(0xFFA5865F), acentoPalido = Color(0xFFEEE0CF),
            tinta = Color(0xFF3A2E20), tintaMedia = Color(0xFF63513C),
            tintaSuave = Color(0xFFA08D74), tintaTenue = Color(0xFFC6B49A),
            sobreAcento = Color.White, esOscura = false,
        ),
        sepia = sepia(acento = 0xFF7D5C34, acentoClaro = 0xFF9A7A50, acentoPalido = 0xFFECDFCB),
        oscuro = Paleta(
            dominante = Color(0xFF2A2119), dominanteClaro = Color(0xFF342A20), dominanteProfundo = Color(0xFF221B14),
            estructura = Color(0xFF3B3025), estructuraClara = Color(0xFF46392C),
            estructuraOscura = Color(0xFF524334), estructuraProfunda = Color(0xFFA08A6D),
            acento = Color(0xFFC9A071), acentoClaro = Color(0xFFDAB88F), acentoPalido = Color(0xFF3C2F20),
            tinta = Color(0xFFF6EFE4), tintaMedia = Color(0xFFD8C9B3),
            tintaSuave = Color(0xFFB09A7C), tintaTenue = Color(0xFF86735C),
            sobreAcento = Color(0xFF2A2119), esOscura = true,
        ),
    );

    fun paleta(modo: ModoTema, sistemaOscuro: Boolean): Paleta = when (modo) {
        ModoTema.CLARO -> claro
        ModoTema.SEPIA -> sepia
        ModoTema.OSCURO -> oscuro
        ModoTema.SISTEMA -> if (sistemaOscuro) oscuro else claro
    }
}

/**
 * Traducción de la tríada a roles de Material 3.
 *
 *  boceto              → rol M3                  → dónde se ve
 *  ─────────────────────────────────────────────────────────────────────
 *  dominante           → background / surface     lienzo de pantalla
 *  dominanteClaro      → surfaceBright            interior de modales
 *  dominanteProfundo   → surfaceContainerLow      huecos de icono, campos internos
 *  estructura          → surfaceVariant           tarjetas, nav, inputs
 *  estructuraOscura    → outlineVariant           bordes y separadores
 *  estructuraProfunda  → outline                  bordes marcados
 *  acento              → primary                  botón primario, FAB, activo
 *  acentoPalido        → primaryContainer         chip activo, badge suave
 *  tinta               → onSurface                texto principal
 *  tintaMedia          → onSurfaceVariant         texto secundario
 *
 * `tintaSuave` y `tintaTenue` no tienen rol equivalente en M3 (captions e
 * iconos inactivos). Viajan en [ColoresExtra], expuesto por el tema.
 */
fun Paleta.aEsquema(): ColorScheme {
    val error = if (esOscura) Semantico.errorOscuro else Semantico.error
    val construir = if (esOscura) ::darkColorScheme else ::lightColorScheme
    return construir(
        /* primary */ acento,
        /* onPrimary */ sobreAcento,
        /* primaryContainer */ acentoPalido,
        /* onPrimaryContainer */ if (esOscura) acentoClaro else acento,
        /* inversePrimary */ acentoClaro,
        /* secondary */ estructuraProfunda,
        /* onSecondary */ if (esOscura) dominante else Color.White,
        /* secondaryContainer */ estructuraClara,
        /* onSecondaryContainer */ tintaMedia,
    ).copy(
        background = dominante,
        onBackground = tinta,
        surface = dominante,
        onSurface = tinta,
        surfaceBright = dominanteClaro,
        surfaceContainerLowest = if (esOscura) dominanteProfundo else dominanteClaro,
        surfaceContainerLow = dominanteProfundo,
        surfaceContainer = estructura,
        surfaceVariant = estructura,
        onSurfaceVariant = tintaMedia,
        outline = estructuraProfunda,
        outlineVariant = estructuraOscura,
        error = error,
        onError = if (esOscura) dominante else Color.White,
        errorContainer = if (esOscura) estructura else Semantico.errorPalido,
        onErrorContainer = error,
    )
}

/** Colores del boceto que no tienen rol en Material 3. */
data class ColoresExtra(
    val tintaSuave: Color,     // captions, placeholders
    val tintaTenue: Color,     // iconos inactivos
    val acentoClaro: Color,    // estado hover / pulsado del acento
    val aviso: Color,
    val avisoPalido: Color,
)

fun Paleta.coloresExtra() = ColoresExtra(
    tintaSuave = tintaSuave,
    tintaTenue = tintaTenue,
    acentoClaro = acentoClaro,
    aviso = if (esOscura) Semantico.avisoOscuro else Semantico.aviso,
    avisoPalido = if (esOscura) estructura else Semantico.avisoPalido,
)

/*
 * PENDIENTE DE DISEÑO — modo claro
 *
 * Dos pares quedan por debajo del umbral WCAG, heredados de la paleta original
 * y presentes en todas las capturas del manual:
 *   · blanco sobre el acento  4,22 (necesita 4,5) → #55799B lo sube a 4,57
 *   · tintaSuave sobre fondo  2,83 (necesita 3,0) → #657F96 la sube a 3,71
 * Sepia y oscuro pasan en todos los pares.
 */
