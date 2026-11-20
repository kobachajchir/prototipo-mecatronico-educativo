
{
  const s = pres.addSlide(); slideNo += 1;
  s.background = { path: 'D:/ProyectoFinal/renders/robot/lidar_cinematico.png' };
  // dark glass card, bottom right
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.55, y: 4.35, w: 5.1, h: 2.25, rectRadius: 0.22, fill: { color: '0B1220', transparency: 35 }, line: { color: 'FFFFFF', width: 1, transparency: 70 }, shadow: glassShadow() });
  s.addText('PERCEPCIÓN 3D', { x: 7.85, y: 4.55, w: 4.5, h: 0.3, fontFace: F, fontSize: 10, bold: true, color: '93C5FD', charSpacing: 3, margin: 0 });
  s.addText('Ve todo a su alrededor', { x: 7.85, y: 4.88, w: 4.6, h: 0.7, fontFace: FT, fontSize: 30, bold: true, color: 'FFFFFF', margin: 0, valign: 'middle' });
  s.addText('Unitree 4D LiDAR L1 · 360° × 90° · 21.600 puntos/s · alcance hasta 20 m', { x: 7.85, y: 5.62, w: 4.6, h: 0.6, fontFace: F, fontSize: 12, color: 'CBD5E1', margin: 0, valign: 'top' });
  s.addText('Imagen conceptual: render del CAD con el haz de escaneo simulado.', { x: 7.85, y: 6.2, w: 4.6, h: 0.3, fontFace: F, fontSize: 8.5, italic: true, color: '94A3B8', margin: 0 });
  s.addText('Robótica II · Sistemas Mecatrónicos', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: '94A3B8', margin: 0, valign: 'middle' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 12.13, y: 7.04, w: 0.5, h: 0.26, rectRadius: 0.13, fill: { color: 'FFFFFF', transparency: 80 }, line: { color: 'FFFFFF', width: 0.75, transparency: 60 } });
  s.addText(String(slideNo).padStart(2, '0'), { x: 12.13, y: 7.04, w: 0.5, h: 0.26, fontFace: F, fontSize: 8.5, bold: true, color: 'E2E8F0', align: 'center', margin: 0, valign: 'middle' });
}

