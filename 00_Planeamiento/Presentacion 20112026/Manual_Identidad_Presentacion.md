# Manual de identidad visual – Presentación del prototipo mecatrónico educativo

Basado en `AutoFinalRobo2_Presentacion_FINAL.pptx` (51 diapositivas, 16:9, 13,33 × 7,5 in).
Lo que se hereda es la forma de mostrar; el contenido y el modelo 3D son los de este proyecto.

## 1. Idea visual
Estilo claro, técnico y limpio. Fondo con degradé suave y pastel, tarjetas redondeadas translúcidas y renders 3D sobre fondo transparente que "flotan" sobre el degradé. Cada área técnica tiene un color propio y ese color se repite en toda la presentación (etiquetas, tarjetas, títulos de bloque, indicador M·E·C·P).

## 2. Paleta
| Uso | Color | Hex |
|---|---|---|
| Título / texto principal | Azul noche | `#0F172A` · `#132033` |
| Texto secundario / subtítulo | Gris azulado | `#4F6178` |
| Pie de página, texto tenue | Gris | `#94A3B8` |
| Líneas y bordes neutros | Gris claro | `#CBD5E1` · `#D5DCE6` |
| Tarjeta blanca | Blanco | `#FFFFFF` |
| **Mecánica** | Azul | borde `#3B82F6` · texto `#1D4ED8` |
| **Electrónica** | Ámbar | borde `#F59E0B` · texto `#B45309` |
| **Control** | Violeta | borde `#8B5CF6` · texto `#6D28D9` |
| **Programación** | Verde | borde `#10B981` · texto `#047857` |

Fondo: degradé diagonal/horizontal con tonos durazno claro (arriba a la izquierda), gris casi blanco (centro), celeste (arriba a la derecha) y lavanda (abajo a la derecha), con un toque verde menta abajo a la izquierda. El centro queda neutro para que el texto se lea; los colores intensos quedan en los bordes.

Tarjetas: relleno del color del área con transparencia alta (~10–15 %), borde del color pleno de ~1,5 pt, esquinas muy redondeadas, sombra leve. Tarjetas neutras: blanco con sombra suave y sin borde de color.

## 3. Tipografía
- **Títulos y cuerpo:** Inter (en el archivo hay también Manrope en algunos textos). Si no está instalada, usar Segoe UI / Calibri como reemplazo.
- **Código y datos técnicos:** Consolas.
- Título de diapositiva: ~28 pt, negrita, azul noche, alineado a la izquierda.
- Subtítulo (una línea que resume la idea): ~16 pt, regular, gris azulado.
- Texto de tarjeta: 10,5–13 pt. Títulos de bloque en el color del área, ~15 pt.
- Cifras destacadas (comparaciones antes/después): 30–40 pt, negrita.
- Etiquetas pequeñas ("ANTES", "DESPUÉS", nombre de áreas): mayúsculas con espaciado de letras.
- Títulos cortos y afirmativos; los subtítulos explican en una frase.

## 4. Estructura de cada diapositiva interior
- Margen lateral ~0,7 in. Contenido en una grilla de 2–3 columnas o de tarjetas alineadas.
- **Arriba a la izquierda:** título + subtítulo.
- **Arriba a la derecha:** cuatro círculos M · E · C · P (azul, ámbar, violeta, verde). Los de las áreas que toca esa diapositiva van con color pleno y el resto en gris claro; debajo, el nombre de las áreas en mayúsculas pequeñas.
- **Pie:** línea fina gris, a la izquierda las materias o contexto asociado, a la derecha el número de diapositiva (dos dígitos).
- Aire generoso: nunca más de ~3 bloques de texto por diapositiva; el resto lo cuentan imágenes y esquemas.

## 5. Cómo se usan los renders 3D (lo central de la referencia)
1. **Portada:** render grande del modelo completo, recortado sin fondo, ocupando la mitad derecha y sobresaliendo apenas hacia los bordes. Vista en perspectiva 3/4 desde arriba, ligeramente elevada, que muestra a la vez la parte superior y un lateral. Texto a la izquierda, alineado a un eje vertical.
2. **Cierre:** el mismo render, centrado, rodeado por 4 tarjetas (una por área) y un mensaje de cierre arriba. Hace de "resumen" de la presentación.
3. **Arquitectura / bloques:** fila de tarjetas con un render aislado de cada componente sobre fondo transparente, con su nombre y un dato técnico debajo. Los componentes están conectados por flechas con etiqueta (protocolo o flujo).
4. **Ficha de componente:** un render grande en perspectiva a la izquierda (~55 % del ancho), dos vistas más chicas debajo (otro ángulo y vista cenital) y una tarjeta de texto a la derecha con características.
5. **Catálogo de piezas:** grilla de renders chicos y homogéneos, con nombre debajo y una nota sobre su origen.
6. **Proceso:** una cadena de tarjetas con flechas (herramienta → archivo → herramienta) para mostrar el flujo de trabajo (CAD → render → web).
7. **Capturas de pantalla** de software: dentro de un marco blanco con esquinas redondeadas y una nota debajo; la imagen principal grande y las secundarias en miniatura.

Reglas de render:
- Fondo transparente (PNG) o neutro, así el degradé de la diapositiva se ve por detrás.
- Luz suave de estudio, sin sombras duras ni reflejos que ensucien; sombra de contacto leve.
- Colores reales y saturados de los componentes (placas verdes y azules, piezas blancas, estructura gris oscuro) que contrastan con el fondo pastel.
- Perspectiva consistente en todas las imágenes (misma cámara y misma elevación) para que se lean como una misma serie.
- Una sola idea por imagen: el modelo completo, o un componente, o un detalle.

## 6. Tipos de diapositiva
1. **Portada:** título, etiqueta de contexto en azul y mayúsculas, píldoras de áreas, autor y render.
2. **Mapa / diagrama conceptual:** esquemas con elipses o tarjetas de colores por área.
3. **Arquitectura:** tarjetas conectadas con flechas y un render por bloque.
4. **Ficha de componente:** render + características + cómo se usa.
5. **Comparación / cifras:** tarjetas "antes → después" con una cifra grande.
6. **Proceso:** cadena de pasos con flechas.
7. **Cierre:** render central + 4 tarjetas de área + mensaje.
8. **Referencias / anexos:** texto compacto, sin elementos decorativos.

## 7. Honestidad del contenido (para este proyecto)
- El prototipo todavía no está definido: los renders son un **concepto visual**, no un diseño mecánico final. Indicarlo en una nota al pie ("Render conceptual – diseño en desarrollo").
- Lo que no esté verificado (componentes disponibles, aprobación institucional, utilidad educativa) se marca explícitamente como **hipótesis / pendiente de verificar**, sin presentarlo como un hecho.
- No incluir cifras, rendimientos ni funciones que todavía no existan.
