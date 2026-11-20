//### A
{
  const AS = (f) => path.join(__dirname, 'assets', f);
  const s = base('Escaneo 3D con el LiDAR L1 PM', 'Simulación conceptual con la geometría del robot. No es una captura real.', 'Robótica II · Sistemas Mecatrónicos · Tecnología Industrial');
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.6, w: 7.0, h: 3.94, rectRadius: 0.1, fill: { color: '0B1220' }, line: { color: C.line, width: 0.75 } });
  s.addImage({ path: AS('lidar_wide.png'), x: 0.7, y: 1.6, w: 7.0, h: 3.94 });
  s.addText('Nube de puntos simulada: ≈ 1 s de escaneo (36.000 puntos, patrón ilustrativo), coloreada por altura.', { x: 0.7, y: 5.6, w: 7.0, h: 0.3, fontFace: F, fontSize: 9.5, italic: true, color: C.sub, margin: 0 });
  s.addText([
    { text: 'Con el eje inclinado ≈ 45° hacia adelante, el hemisferio cubre el piso delante del robot, el horizonte y el techo. ', options: { bold: true, color: C.ink } },
    { text: 'Es una propuesta: falta verificar en el CAD qué partes del chasis tapan el campo.', options: { color: C.sub } },
  ], { x: 0.7, y: 5.95, w: 7.0, h: 0.8, fontFace: F, fontSize: 11, margin: 0, valign: 'top' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.0, y: 1.6, w: 2.25, h: 2.25, rectRadius: 0.08, fill: { color: '0B1220' }, line: { color: C.line, width: 0.75 } });
  s.addImage({ path: AS('scan_top.png'), x: 8.0, y: 1.6, w: 2.25, h: 2.25 });
  s.addImage({ path: AS('fov_side.png'), x: 10.4, y: 1.6, w: 2.25, h: 1.69 });
  s.addText('Vista en planta (color = distancia)', { x: 8.0, y: 3.88, w: 2.25, h: 0.3, fontFace: F, fontSize: 8.5, color: C.sub, margin: 0, valign: 'top' });
  s.addText('Corte lateral del campo de visión', { x: 10.4, y: 3.32, w: 2.25, h: 0.3, fontFace: F, fontSize: 8.5, color: C.sub, margin: 0, valign: 'top' });
  techTable(s, [
    ['Dato', 'Valor'],
    ['Ubicación', 'Placa superior, ranuras delanteras. Eje en X = 78,03 mm, Y ≈ 0'],
    ['Orientación', 'Eje inclinado ≈ 45° hacia adelante (propuesta, a verificar en el CAD)'],
    ['Campo y frecuencia', '360° × 90° · 21.600 puntos/s · zona ciega de 0,05 m'],
    ['Datos', 'Nube de puntos + IMU por UART TTL hacia la Pi'],
  ], 8.0, 4.3, 4.65, [1.35, 3.3], 0.46, 9);
}
//### B
{
  const AS = (f) => path.join(__dirname, 'assets', f);
  const s = base('Cámara + LiDAR: reconstrucción conjunta', 'Misma escena y mismo encuadre: cada punto del LiDAR toma el color de la imagen. Imágenes simuladas.', 'Robótica II · Sistemas Mecatrónicos · Inteligencia Artificial');
  const pw = 3.7, ph = pw * 9 / 16, py = 1.6;
  const px = [0.7, 4.85, 9.0];
  const imgs = ['cam.png', 'lidar.png', 'fused.png'];
  const caps = [['Logitech C270', 'Imagen de la cámara (simulada)'], ['Unitree L1 PM', 'Nube desde la cámara · color por altura'], ['Reconstrucción conjunta', 'Mismos puntos con el color de la cámara']];
  imgs.forEach((f, i) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: px[i], y: py, w: pw, h: ph, rectRadius: 0.08, fill: { color: '0B1220' }, line: { color: C.line, width: 0.75 } });
    s.addImage({ path: AS(f), x: px[i], y: py, w: pw, h: ph });
    s.addText([{ text: caps[i][0], options: { bold: true, color: C.ink, fontSize: 11, breakLine: true } }, { text: caps[i][1], options: { color: C.sub, fontSize: 9.5 } }], { x: px[i], y: py + ph + 0.05, w: pw, h: 0.5, fontFace: F, margin: 0, valign: 'top' });
  });
  [['+', 4.4], ['=', 8.55]].forEach(([t, x]) => s.addText(t, { x, y: py + ph / 2 - 0.3, w: 0.45, h: 0.6, fontFace: F, fontSize: 30, bold: true, color: C.gray, align: 'center', valign: 'middle', margin: 0 }));
  techTable(s, [
    ['Sensor', 'Ubicación', 'Orientación', 'Campo'],
    ['LiDAR L1 PM', 'Eje en X = 78,03 mm, Y ≈ 0, sobre la lente', 'Eje inclinado ≈ 45° hacia adelante (propuesta)', '360° × 90°'],
    ['Logitech C270', 'Misma X e Y. Lente a 116,5 mm del suelo', 'Horizontal, hacia el frente', '55° diag. ≈ 28,6° vert.'],
    ['Cámara ↔ LiDAR', 'Desfase vertical: por medir en el CAD', 'Rotación relativa: por calibrar', 'Solape: todo el campo de la cámara'],
  ], 0.7, 4.45, 7.55, [1.45, 2.65, 1.85, 1.6], 0.46, 8.5);
  card(s, 8.5, 4.45, 4.15, 2.3, C.C);
  s.addText('Modelo de IA: ampliación opcional', { x: 8.68, y: 4.57, w: 3.8, h: 0.34, fontFace: F, fontSize: 13, bold: true, color: C.Cd, margin: 0 });
  s.addText([
    { text: 'Base: sin IA. Cada punto toma el color del píxel donde se proyecta, usando la ubicación y la orientación de ambos sensores.', options: { breakLine: true, paraSpaceAfter: 5 } },
    { text: 'Opcional: detección con YOLO nano para etiquetar los puntos dentro de cada caja. Falta medir la velocidad en la Pi y revisar la licencia (Ultralytics es AGPL-3.0).', options: { color: C.sub } },
  ], { x: 8.68, y: 4.95, w: 3.8, h: 1.8, fontFace: F, fontSize: 9.5, color: C.ink, margin: 0, valign: 'top' });
  s.addText('Nube acumulada de ≈ 5 s con el robot quieto. Con el eje inclinado, el LiDAR cubre todo el encuadre de la cámara. La oclusión por el chasis no está simulada.', { x: 0.7, y: 6.5, w: 7.55, h: 0.4, fontFace: F, fontSize: 9, italic: true, color: C.sub, margin: 0, valign: 'top' });
}
