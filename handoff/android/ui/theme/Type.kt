package mx.bibliotheca.ui.theme

import androidx.compose.material3.Typography
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.googlefonts.GoogleFont
import androidx.compose.ui.unit.sp
import mx.bibliotheca.R

/**
 * Las cuatro familias del boceto están en Google Fonts, así que se resuelven
 * con *downloadable fonts*: no engordan el APK y el sistema las comparte entre
 * aplicaciones. Requiere en el manifiesto el proveedor de Google Play Services
 * y el array de certificados en `res/values/font_certs.xml`.
 *
 * Si el equipo prefiere empaquetarlas, los .ttf van en `res/font/` y solo
 * cambia la construcción de cada FontFamily.
 */
private val proveedor = GoogleFont.Provider(
    providerAuthority = "com.google.android.gms.fonts",
    providerPackage = "com.google.android.gms",
    certificates = R.array.com_google_android_gms_fonts_certs,
)

/** Títulos de pantalla, títulos de libro y cifras destacadas. */
val PlayfairDisplay = FontFamily(
    Font(GoogleFont("Playfair Display"), proveedor, FontWeight.SemiBold),
    Font(GoogleFont("Playfair Display"), proveedor, FontWeight.Bold),
)

/** Texto literario: sinopsis, reseñas, frases, notas. Se usa casi siempre en cursiva. */
val Lora = FontFamily(
    Font(GoogleFont("Lora"), proveedor, FontWeight.Normal),
    Font(GoogleFont("Lora"), proveedor, FontWeight.Normal, FontStyle.Italic),
)

/** Interfaz: etiquetas, botones, campos, metadatos. */
val DMSans = FontFamily(
    Font(GoogleFont("DM Sans"), proveedor, FontWeight.Normal),
    Font(GoogleFont("DM Sans"), proveedor, FontWeight.Medium),
    Font(GoogleFont("DM Sans"), proveedor, FontWeight.SemiBold),
)

/** Datos técnicos: ISBN y códigos. */
val DMMono = FontFamily(
    Font(GoogleFont("DM Mono"), proveedor, FontWeight.Normal),
    Font(GoogleFont("DM Mono"), proveedor, FontWeight.Medium),
)

/**
 * Escala tipográfica mapeada a los roles de Material 3.
 *
 *  rol M3           tamaño  familia            dónde se ve en el boceto
 *  ────────────────────────────────────────────────────────────────────────
 *  displaySmall     30 sp   Playfair 700       año en el resumen anual
 *  headlineMedium   28 sp   Playfair 700       título de pantalla (Colección…)
 *  headlineSmall    22 sp   Playfair 700       título del libro sobre la portada
 *  titleLarge       19 sp   Playfair 700       nombre de mes en el resumen anual
 *  titleMedium      15 sp   Playfair 600       título de tarjeta y de sección
 *  titleSmall       14 sp   DM Sans 600        etiqueta de botón
 *  bodyLarge        14 sp   DM Sans 400        texto de interfaz
 *  bodyMedium       12.5 sp DM Sans 400        metadatos y subtítulos
 *  bodySmall        11 sp   DM Sans 400        pies y notas
 *  labelLarge       13 sp   DM Sans 600        pestañas y chips
 *  labelMedium      11 sp   DM Sans 500        etiqueta de navegación
 *  labelSmall       11 sp   DM Sans 600        antetítulo en mayúsculas (+0.1em)
 */
val BibliothecaTypography = Typography(
    displaySmall = TextStyle(
        fontFamily = PlayfairDisplay, fontWeight = FontWeight.Bold,
        fontSize = 30.sp, lineHeight = 32.sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = PlayfairDisplay, fontWeight = FontWeight.Bold,
        fontSize = 28.sp, lineHeight = 31.sp,
    ),
    headlineSmall = TextStyle(
        fontFamily = PlayfairDisplay, fontWeight = FontWeight.Bold,
        fontSize = 22.sp, lineHeight = 26.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = PlayfairDisplay, fontWeight = FontWeight.Bold,
        fontSize = 19.sp, lineHeight = 24.sp,
    ),
    titleMedium = TextStyle(
        fontFamily = PlayfairDisplay, fontWeight = FontWeight.SemiBold,
        fontSize = 15.sp, lineHeight = 19.sp,
    ),
    titleSmall = TextStyle(
        fontFamily = DMSans, fontWeight = FontWeight.SemiBold,
        fontSize = 14.sp, lineHeight = 18.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = DMSans, fontWeight = FontWeight.Normal,
        fontSize = 14.sp, lineHeight = 21.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = DMSans, fontWeight = FontWeight.Normal,
        fontSize = 12.5.sp, lineHeight = 18.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = DMSans, fontWeight = FontWeight.Normal,
        fontSize = 11.sp, lineHeight = 16.sp,
    ),
    labelLarge = TextStyle(
        fontFamily = DMSans, fontWeight = FontWeight.SemiBold,
        fontSize = 13.sp, lineHeight = 17.sp,
    ),
    labelMedium = TextStyle(
        fontFamily = DMSans, fontWeight = FontWeight.Medium,
        fontSize = 11.sp, lineHeight = 14.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = DMSans, fontWeight = FontWeight.SemiBold,
        fontSize = 11.sp, lineHeight = 14.sp,
        letterSpacing = 1.1.sp,   // el 0.1em del boceto en los antetítulos
    ),
)

/**
 * Dos estilos del boceto no encajan en ningún rol de Material 3: el texto
 * literario en cursiva y el monoespaciado del ISBN. Viajan aparte y el tema
 * los expone por CompositionLocal.
 */
data class TipografiaExtra(
    val cita: TextStyle = TextStyle(
        fontFamily = Lora, fontStyle = FontStyle.Italic,
        fontSize = 13.5.sp, lineHeight = 23.sp,
    ),
    val literario: TextStyle = TextStyle(
        fontFamily = Lora, fontWeight = FontWeight.Normal,
        fontSize = 13.5.sp, lineHeight = 23.sp,
    ),
    val mono: TextStyle = TextStyle(
        fontFamily = DMMono, fontWeight = FontWeight.Normal,
        fontSize = 13.sp, lineHeight = 18.sp,
    ),
)
