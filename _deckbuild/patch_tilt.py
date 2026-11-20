def edit(fn, pairs):
    s = open(fn, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, (fn, a[:80])
        s = s.replace(a, b, 1)
    open(fn, 'w', encoding='utf-8').write(s)


ROT = "TILT = np.radians(45)\nRY = np.array([[np.cos(TILT), 0, np.sin(TILT)], [0, 1, 0], [-np.sin(TILT), 0, np.cos(TILT)]])\n"
edit('gen_images.py', [
    ("DL = np.stack([rxy * np.cos(phi), rxy * np.sin(phi), dz], 1)\n",
     ROT + "DL = np.stack([rxy * np.cos(phi), rxy * np.sin(phi), dz], 1) @ RY.T\n"),
    ("DL2 = np.stack([rxy2 * np.cos(phi2), rxy2 * np.sin(phi2), dz2], 1)\n",
     "DL2 = np.stack([rxy2 * np.cos(phi2), rxy2 * np.sin(phi2), dz2], 1) @ RY.T\n"),
    ("    ax.plot([0, 1280], [360, 360], color='#94a3b8', lw=1.2, ls='--')\n", ""),
    ("    ax.text(14, 392, 'Horizonte del sensor: debajo no hay puntos (el hemisferio mira hacia arriba)', color='#94a3b8', fontsize=15)\n", ""),
    ("ax.add_patch(Wedge((0, 0), R, 0, 180, fc='#10b98122', ec='#047857', lw=2))",
     "ax.add_patch(Wedge((0, 0), R, -45, 135, fc='#10b98122', ec='#047857', lw=2))"),
    ("ax.add_patch(Wedge((0, 0), 0.08, 0, 180, fc='#94a3b8', ec='#64748b', lw=1))",
     "ax.add_patch(Wedge((0, 0), 0.08, -45, 135, fc='#94a3b8', ec='#64748b', lw=1))"),
    ("ax.plot([0, 0], [0, 1.25], color='#64748b', lw=1, ls='--')",
     "ax.plot([0, 1.0], [0, 1.0], color='#64748b', lw=1.2, ls='--')\nax.text(0.66, 0.78, 'eje ≈ 45°', color='#475569', fontsize=13, rotation=45)\nax.add_patch(Arc((0, 0), 0.7, 0.7, theta1=0, theta2=45, ec='#475569', lw=1.2))"),
    ("ax.add_patch(Wedge((0.0, -0.18), 0.9, -14.3, 14.3, fc='#f59e0b33', ec='#b45309', lw=1.5, ls='-'))",
     "ax.add_patch(Wedge((0.0, 0.0), 0.9, -14.3, 14.3, fc='#f59e0b66', ec='#b45309', lw=1.5, ls='-'))"),
    ("ax.text(0, 0.45, 'Hemisferio\\n360° × 90°'", "ax.text(-0.45, 0.5, 'Hemisferio\\n360° × 90°'"),
    ("ax.text(1.0, -0.38, 'Cámara: 28,6° vertical'", "ax.text(1.55, -0.2, 'Cámara: 28,6° vertical'"),
    ("ax.annotate('', xy=(1.1, 1.0), xytext=(0.78, 0.78), arrowprops=dict(arrowstyle='->', color='#475569'))\n", ""),
    ("ax.text(1.12, 1.02, 'alcance\\nhasta 20 m', color='#475569', fontsize=13)", "ax.text(0.55, -0.62, 'alcance hasta 20 m', color='#475569', fontsize=13)"),
    ("ax.set_xlim(-1.3, 1.6); ax.set_ylim(-0.7, 1.4)", "ax.set_xlim(-1.3, 1.6); ax.set_ylim(-1.0, 1.15)"),
])

edit('new3.js', [
    ("{ text: 'Con el eje hacia arriba, el hemisferio ve techo y paredes por encima del sensor, pero no el piso. ', options: { bold: true, color: C.ink } },\n    { text: 'Si se invierte o se inclina, cambia lo que ve. El sentido de montaje está por definir.', options: { color: C.sub } },",
     "{ text: 'Con el eje inclinado ≈ 45° hacia adelante, el hemisferio cubre el piso delante del robot, el horizonte y el techo. ', options: { bold: true, color: C.ink } },\n    { text: 'Es una propuesta: falta verificar en el CAD qué partes del chasis tapan el campo.', options: { color: C.sub } },"),
    ("['Orientación', 'Eje vertical. Sentido (arriba o abajo): por definir'],",
     "['Orientación', 'Eje inclinado ≈ 45° hacia adelante (propuesta, a verificar en el CAD)'],"),
    ("'Eje vertical (sentido por definir)'", "'Eje inclinado ≈ 45° hacia adelante (propuesta)'"),
    ("'Solape: 0° a 14° sobre el horizonte'", "'Solape: todo el campo de la cámara'"),
    ("'Nube acumulada de ≈ 5 s con el robot quieto. Con el eje hacia arriba, el LiDAR solo comparte con la cámara la franja de 0° a 14° sobre el horizonte.'",
     "'Nube acumulada de ≈ 5 s con el robot quieto. Con el eje inclinado, el LiDAR cubre todo el encuadre de la cámara. La oclusión por el chasis no está simulada.'"),
    ("'Modelo de IA: por definir'", "'Modelo de IA: ampliación opcional'"),
    ("{ text: 'Imagen → detección o segmentación → etiqueta por píxel → proyección a la nube con la ubicación y orientación → nube coloreada y etiquetada.', options: { breakLine: true, paraSpaceAfter: 5 } },",
     "{ text: 'Base: sin IA. Cada punto toma el color del píxel donde se proyecta, usando la ubicación y la orientación de ambos sensores.', options: { breakLine: true, paraSpaceAfter: 5 } },"),
    ("{ text: 'Candidatos para la Raspberry Pi 5 sin acelerador: YOLO nano (detección) o una segmentación liviana. Falta validar velocidad y precisión en la Pi.', options: { color: C.sub } },",
     "{ text: 'Opcional: detección con YOLO nano para etiquetar los puntos dentro de cada caja. Falta medir la velocidad en la Pi y revisar la licencia (Ultralytics es AGPL-3.0).', options: { color: C.sub } },"),
])

edit('new2.js', [
    ("], 0.7, 1.6, 11.95, [2.7, 6.3, 2.95], 0.46, 10);", "], 0.7, 1.55, 11.95, [2.7, 6.3, 2.95], 0.37, 9.5);"),
    ("    ['Enlace Pi ↔ ESP32', 'UART, USB o Wi-Fi', 'Por definir'],\n",
     "    ['Enlace Pi ↔ ESP32', 'UART, USB o Wi-Fi', 'Por definir'],\n    ['Orientación del LiDAR', 'Arriba, abajo o inclinado ≈ 45° hacia adelante', 'Propuesta: inclinado · verificar en el CAD'],\n    ['Modelo de IA', 'Sin IA al inicio; YOLO nano como ampliación', 'Ampliación propuesta'],\n"),
    ("• Consignas hacia el ESP32 y telemetría de vuelta\\n", "• Consignas hacia el ESP32 y telemetría de vuelta\\n• IA opcional (detección) como ampliación\\n"),
    ("'Pinout del ESP32, enlace Pi–ESP, alimentación, pantalla y chasis.'", "'Pinout del ESP32, enlace Pi–ESP, alimentación, pantalla, chasis y soporte inclinado del LiDAR.'"),
])
print('ok')
