# Paquete de entrega — Bibliotheca para Android

Complemento técnico de [`docs/documentacion.html`](../../docs/documentacion.html). El manual
describe **qué** hace cada módulo; esto traduce el boceto a las decisiones concretas de un
proyecto de Android Studio: tokens, tipografía, medidas, modelo de datos, red y navegación.

No es una aplicación compilable. Son los archivos de partida, ya escritos, para pegar en el
proyecto y seguir desde ahí.

---

## La regla que ahorra la primera semana

El boceto está trazado a **390 × 844 px CSS, y 1 px CSS equivale a 1 dp**. Todas las medidas
se copian tal cual, sin recalcular: el radio de 44, los 22 dp que sobresale el FAB, la portada
de 280 dp, las miniaturas de 62 × 92.

Lo único que no se copia es el ancho: el boceto trabaja sobre un lienzo fijo de 390 px, y en
Android el ancho útil va de 360 a 412 dp. Ningún ancho se fija; se resuelve con `fillMaxWidth()`
y los paddings de [`Dimens.kt`](ui/theme/Dimens.kt).

---

## Qué hay aquí

| Archivo | Contenido | Va en |
|---|---|---|
| [`ui/theme/Color.kt`](ui/theme/Color.kt) | Las 4 apariencias × 3 modos y su mapeo a roles Material 3 | `ui/theme/` |
| [`ui/theme/Type.kt`](ui/theme/Type.kt) | Las 4 familias por *downloadable fonts* y la escala por rol | `ui/theme/` |
| [`ui/theme/Theme.kt`](ui/theme/Theme.kt) | `BibliothecaTheme` y los accesos a lo que no cabe en M3 | `ui/theme/` |
| [`ui/theme/Dimens.kt`](ui/theme/Dimens.kt) | Medidas del boceto en dp y duraciones de animación | `ui/theme/` |
| [`ui/navigation/Navegacion.kt`](ui/navigation/Navegacion.kt) | Rutas, pestañas y transiciones | `ui/navigation/` |
| [`data/local/Entidades.kt`](data/local/Entidades.kt) | Entidades Room, enums y proyecciones | `data/local/` |
| [`data/local/BibliothecaDao.kt`](data/local/BibliothecaDao.kt) | DAO, consultas del resumen anual y base de datos | `data/local/` |
| [`data/remote/CatalogoApis.kt`](data/remote/CatalogoApis.kt) | Retrofit para Google Books y Open Library, DTOs y normalización | `data/remote/` |
| [`data/scraper/TiendaScrapers.kt`](data/scraper/TiendaScrapers.kt) | Jsoup sobre Amazon y Gandhi, con limitador por host | `data/scraper/` |
| [`data/MetadatosRepository.kt`](data/MetadatosRepository.kt) | La cascada de resolución completa | `data/` |

Paquete base `mx.bibliotheca` — cámbialo por el que use el equipo.

---

## Dependencias

```kotlin
// build.gradle.kts (módulo)
dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.09.00")
    implementation(composeBom)
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.ui:ui-text-google-fonts")   // downloadable fonts
    implementation("androidx.navigation:navigation-compose:2.8.0")

    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    ksp("androidx.room:room-compiler:2.6.1")

    implementation("com.squareup.retrofit2:retrofit:2.11.0")
    implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:1.7.1")
    implementation("com.jakewharton.retrofit:retrofit2-kotlinx-serialization-converter:1.0.0")

    implementation("org.jsoup:jsoup:1.18.1")                     // scraper de respaldo
    implementation("io.coil-kt:coil-compose:2.7.0")              // portadas remotas
}
```

`java.time` necesita `coreLibraryDesugaringEnabled = true` si el `minSdk` baja de 26.

---

## Clave de Google Books

Nunca en el control de versiones.

```properties
# local.properties  (fuera de git)
GOOGLE_BOOKS_KEY=AIza...
```

```kotlin
// build.gradle.kts (módulo)
val props = Properties().apply {
    rootProject.file("local.properties").inputStream().use { load(it) }
}
android {
    defaultConfig {
        buildConfigField("String", "GOOGLE_BOOKS_KEY", "\"${props["GOOGLE_BOOKS_KEY"]}\"")
    }
    buildFeatures { buildConfig = true }
}
```

En la consola de Google Cloud, restringe la clave **por nombre de paquete y huella SHA-1** y
limítala a la Books API. Extraerla del APK es trivial; la restricción es lo que impide usarla
en otra aplicación. Cuota: 1 000 consultas al día, que la caché de 30 días vuelve holgada.

Open Library no lleva credencial.

---

## Orden sugerido de trabajo

1. **Tema y medidas.** Con `Color.kt`, `Type.kt`, `Theme.kt` y `Dimens.kt` dentro, cualquier
   pantalla que se escriba después ya sale con la identidad correcta.
2. **Room y datos de ejemplo.** Sembrar la base con los mismos 8 libros del prototipo permite
   comparar cada pantalla con su captura del manual.
3. **Pantallas raíz** — Colección, Libreros, Préstamos — contra datos locales, sin red.
4. **Ficha de detalle** con sus dos vistas, que es donde vive la lógica de negocio real.
5. **Motor de metadatos**, empezando por Google Books; el resto de la cascada se añade encima
   sin tocar las pantallas.
6. **Scrapers**, al final y con pruebas contra HTML guardado.

---

## Decisiones que quedan abiertas

Puntos donde el boceto no alcanza y hace falta acuerdo con diseño o producto:

- **Dos contrastes del modo claro.** Los tres modos están definidos y verificados, pero el claro
  arrastra dos pares por debajo del umbral WCAG: blanco sobre el acento (4,22 frente a 4,5) y las
  captions en tintaSuave (2,83 frente a 3,0). `#55799B` y `#657F96` los corrigen con un cambio de
  tono casi imperceptible, pero afectan a todas las capturas del manual, así que lo decide diseño.
- **Textos en español e inglés.** Ajustes ofrece los dos idiomas; hacen falta `values/strings.xml`
  y `values-en/strings.xml`. Ninguna cadena debe quedar escrita en los composables.
- **Selectores de scraping.** Los de `TiendaScrapers.kt` están escritos a partir de la
  estructura habitual de ambos buscadores y **no se han verificado contra el marcado en vivo**.
  Hay que comprobarlos al implementar.
- **Términos de servicio.** Antes de publicar, confirmar que el uso previsto del scraping
  —consulta puntual iniciada por la persona usuaria, sin redistribuir contenido— es admisible
  para Amazon y Gandhi. Es decisión de producto, no técnica.
- **Descarga del resumen anual.** El botón existe en el boceto sin formato definido. Compartir
  una imagen generada es lo natural en móvil, pero hay que decidirlo.
- **Portadas.** El prototipo usa imágenes remotas. En producción conviene cachearlas en disco
  y permitir foto propia, sobre todo para ediciones que ningún catálogo tiene.
