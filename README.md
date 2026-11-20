# Prototipo mecatrónico educativo

Plataforma robótica móvil para prácticas de mecatrónica. Ingeniería Mecatrónica · FCAL – UNER.

## Contenido

| Carpeta | Qué hay |
|---|---|
| `00_Planeamiento/` | Documentación inicial, TP de viabilidad y deseabilidad, manual de identidad y presentaciones (`Presentacion_Prototipo_Mecatronico_glass.pptx` es la versión actual). |
| `renders/` | Renders del prototipo usados en la presentación. |
| `planos/` | Vistas y hojas de planos generadas desde el CAD. |
| `_glass_deck/gen/` | Generador de la presentación (pptxgenjs). `python patch_glass.py` y luego `node build_glass.js salida.pptx`. |
| `_glass_deck/ui/` | Maqueta HTML de la interfaz web del robot (pantalla, celular y notebook). |
| `_deckbuild/`, `_render/`, `_cdp/` | Scripts auxiliares de la presentación, renders y composición. |

El modelo 3D completo (`robot.obj`, `robot_import.blend`) no está en el repositorio por tamaño. El CAD se trabaja en Fusion.

Los renders, la interfaz y las simulaciones son conceptuales: el diseño sigue en desarrollo.
