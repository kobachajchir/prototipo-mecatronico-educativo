//### P01
{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BG };
  s.addText('IDEA DE PROYECTO · INGENIERÍA MECATRÓNICA', { x: 0.7, y: 1.35, w: 6.4, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: C.Md, charSpacing: 3, margin: 0 });
  s.addText('Un robot para aprender mecatrónica haciendo', { x: 0.7, y: 1.85, w: 6.3, h: 2.7, fontFace: F, fontSize: 44, bold: true, color: C.ink, margin: 0, valign: 'top' });
  s.addText('Un prototipo programable y ampliable para usar en distintas materias de la carrera.', { x: 0.7, y: 4.75, w: 5.9, h: 0.9, fontFace: F, fontSize: 16, color: C.sub, margin: 0, valign: 'top' });
  s.addText('Koba Chajchir', { x: 0.7, y: 5.95, w: 6, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  s.addText('Ingeniería Mecatrónica · FCAL – UNER', { x: 0.7, y: 6.27, w: 6.5, h: 0.3, fontFace: F, fontSize: 11, color: C.sub, margin: 0 });
  renderSlot(s, 7.2, 0.9, 5.7, 5.6, 'Portada · prototipo en vista 3/4', 'portada');
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText('Prototipo mecatrónico educativo', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0 });
  s.addText('01', { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0 });
}
//### P02
{
  const s = base('Qué problema resuelve', 'Y cuál es el objetivo del prototipo.');
  card(s, 0.7, 1.75, 5.3, 3.3, C.E);
  s.addText('HOY', { x: 0.95, y: 1.9, w: 4.8, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: C.Ed, charSpacing: 3, margin: 0 });
  s.addText('Pocas prácticas. Teoría y práctica separadas.', { x: 0.95, y: 2.35, w: 4.8, h: 2.5, fontFace: F, fontSize: 30, bold: true, color: C.ink, margin: 0, valign: 'top' });
  card(s, 7.3, 1.75, 5.3, 3.3, C.P);
  s.addText('OBJETIVO', { x: 7.55, y: 1.9, w: 4.8, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: C.Pd, charSpacing: 3, margin: 0 });
  s.addText('Un sistema mecatrónico para programar, medir y ampliar.', { x: 7.55, y: 2.35, w: 4.8, h: 2.5, fontFace: F, fontSize: 30, bold: true, color: C.ink, margin: 0, valign: 'top' });
  wire(s, [[6.0, 3.4], [7.3, 3.4]], C.gray);
  const t = [['Para quién', 'Docentes y estudiantes'], ['Cómo llega', 'Se entrega a la carrera'], ['Meta', 'Junio de 2027']];
  t.forEach(([a, b], i) => {
    const x = 0.7 + i * 4.05;
    card(s, x, 5.4, 3.85, 1.2, C.M, { solid: true, border: 'E2E8F0', shadow: true });
    s.addText([{ text: a, options: { fontSize: 10, bold: true, color: C.Md, charSpacing: 2, breakLine: true } }, { text: b, options: { fontSize: 17, bold: true, color: C.ink } }], { x: x + 0.2, y: 5.4, w: 3.5, h: 1.2, fontFace: F, margin: 0, valign: 'middle' });
  });
}
//### P03
{
  const s = base('La idea', 'Un robot móvil educativo, programable y ampliable.');
  renderSlot(s, 0.7, 1.6, 7.3, 5.1, 'Prototipo completo · vista 3/4', 'idea');
  const items = [
    [C.M, C.Md, '1', 'Robot móvil', 'Dos ruedas motrices y una rueda loca.'],
    [C.C, C.Cd, '2', 'Programable', 'Raspberry Pi 5 y ESP32 a bordo.'],
    [C.P, C.Pd, '3', 'Ampliable', 'Zona de montaje para sumar accesorios.'],
  ];
  items.forEach(([c, d, n, t, b], i) => {
    const y = 1.6 + i * 1.75;
    card(s, 8.3, y, 4.35, 1.55, c);
    s.addShape(pres.shapes.OVAL, { x: 8.5, y: y + 0.45, w: 0.65, h: 0.65, fill: { color: c }, line: { color: c, width: 0 } });
    s.addText(n, { x: 8.5, y: y + 0.45, w: 0.65, h: 0.65, fontFace: F, fontSize: 20, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 });
    s.addText([{ text: t, options: { fontSize: 17, bold: true, color: d, breakLine: true } }, { text: b, options: { fontSize: 12, color: C.sub } }], { x: 9.35, y, w: 3.2, h: 1.55, fontFace: F, margin: 0, valign: 'middle' });
  });
}
//### P04
{
  const s = base('Qué hace', 'Cuatro funciones mínimas para empezar a usarlo en una materia.');
  const f = [
    [C.M, C.Md, '01', 'Moverse', 'Tracción diferencial con control de velocidad.'],
    [C.E, C.Ed, '02', 'Medir', 'Corriente de cada motor y giro de cada rueda.'],
    [C.C, C.Cd, '03', 'Percibir', 'LiDAR 3D, cámara y sensor de línea.'],
    [C.P, C.Pd, '04', 'Comunicar', 'Entre la Pi, el ESP32 y una interfaz web.'],
  ];
  f.forEach(([c, d, n, t, b], i) => {
    const x = 0.7 + i * 3.02;
    card(s, x, 1.65, 2.85, 2.75, c);
    s.addText(n, { x: x + 0.2, y: 1.75, w: 2.4, h: 0.8, fontFace: F, fontSize: 38, bold: true, color: d, margin: 0, valign: 'middle' });
    s.addText(t, { x: x + 0.2, y: 2.55, w: 2.45, h: 0.45, fontFace: F, fontSize: 19, bold: true, color: C.ink, margin: 0 });
    s.addText(b, { x: x + 0.2, y: 3.05, w: 2.45, h: 1.2, fontFace: F, fontSize: 12.5, color: C.sub, margin: 0, valign: 'top' });
  });
  renderSlot(s, 0.7, 4.65, 11.95, 2.1, 'Detalle · motores, sensores y controladores', 'funciones');
}
//### P05
{
  const s = base('Qué permite estudiar', 'Capacidades del sistema. Todavía están en estudio.');
  const items = [
    [C.M, C.Md, 'Odometría', 'Dónde está el robot a partir de sus ruedas.'],
    [C.C, C.Cd, 'Trayectorias', 'Seguir una línea y recorrer un camino.'],
    [C.E, C.Ed, 'Datos LiDAR', 'Una nube de puntos del entorno.'],
    [C.P, C.Pd, 'Mapeo 3D', 'Armar el mapa y verlo en la computadora.'],
  ];
  items.forEach(([c, d, t, b], i) => {
    const x = 0.7 + (i % 2) * 6.05, y = 1.7 + Math.floor(i / 2) * 2.5;
    card(s, x, y, 5.85, 2.3, c);
    s.addText(t, { x: x + 0.3, y: y + 0.35, w: 5.0, h: 0.8, fontFace: F, fontSize: 30, bold: true, color: d, margin: 0, valign: 'middle' });
    s.addText(b, { x: x + 0.3, y: y + 1.2, w: 5.0, h: 0.8, fontFace: F, fontSize: 15, color: C.ink, margin: 0, valign: 'top' });
    chip(s, 'EN ESTUDIO', x + 5.85 - 0.25 - 1.1, y + 0.2, C.gray, 1.1);
  });
}
//### P06
{
  const s = base('Una plataforma, varias materias', 'Ejemplos de uso propuestos. Falta contrastarlos con los docentes.');
  renderSlot(s, 0.7, 1.6, 5.2, 5.1, 'Prototipo · vista de trabajo', 'materias');
  const m = [
    [C.P, C.Pd, 'Microcontroladores', 'Programar el control'],
    [C.C, C.Cd, 'Robótica II', 'Odometría y trayectorias'],
    [C.E, C.Ed, 'Sistemas Mecatrónicos', 'Sensores y comunicación'],
    [C.C, C.Cd, 'Sistemas de Control', 'Ajustar el PID'],
    [C.M, C.Md, 'Mecanismos', 'Fuerzas y esfuerzos'],
    [C.M, C.Md, 'Tecnología Industrial', 'Escaneo 3D y CAD'],
  ];
  m.forEach(([c, d, t, b], i) => {
    const x = 6.2 + (i % 2) * 3.25, y = 1.6 + Math.floor(i / 2) * 1.75;
    card(s, x, y, 3.1, 1.55, c);
    s.addText([{ text: t, options: { fontSize: 14.5, bold: true, color: d, breakLine: true } }, { text: b, options: { fontSize: 12, color: C.ink } }], { x: x + 0.2, y, w: 2.75, h: 1.55, fontFace: F, margin: 0, valign: 'middle' });
  });
}
//### P07
{
  const s = base('Alcance', 'Qué incluye el prototipo y qué queda abierto.');
  card(s, 0.7, 1.65, 6.4, 4.95, C.P);
  s.addText('Incluye', { x: 1.0, y: 1.8, w: 5.8, h: 0.5, fontFace: F, fontSize: 22, bold: true, color: C.Pd, margin: 0 });
  s.addText(bullets(['Tracción con control de velocidad', 'Sensado de corriente en los motores', 'Seguimiento de línea', 'LiDAR 3D y cámara', 'Comunicación e interfaz web', 'Pantalla táctil de operación'], 19), { x: 1.0, y: 2.45, w: 5.9, h: 3.9, fontFace: F, margin: 0, valign: 'top', paraSpaceAfter: 12 });
  card(s, 7.35, 1.65, 5.3, 4.95, C.gray);
  s.addText('Queda abierto', { x: 7.65, y: 1.8, w: 4.8, h: 0.5, fontFace: F, fontSize: 22, bold: true, color: C.gray, margin: 0 });
  s.addText(bullets(['IMU opcional', 'IA opcional para detectar objetos', 'Accesorios o brazo en la zona de montaje', 'Enlace Pi–ESP32 y pantalla por definir'], 19), { x: 7.65, y: 2.45, w: 4.8, h: 3.9, fontFace: F, margin: 0, valign: 'top', paraSpaceAfter: 12 });
}
//### P10
{
  const s = base('Próximos pasos', 'Hasta tener el prototipo funcionando. La fecha es una meta.');
  const steps = [
    [C.P, C.Pd, '1', 'Consultar', 'Encuesta a estudiantes y consulta a docentes.'],
    [C.E, C.Ed, '2', 'Confirmar piezas', 'Precios, envío y disponibilidad.'],
    [C.C, C.Cd, '3', 'Cerrar el diseño', 'Pinout, enlaces, alimentación y chasis.'],
    [C.M, C.Md, '4', 'Construir', 'Armado, programación y pruebas.'],
    [C.P, C.Pd, '5', 'Presentar', 'Llevarlo a los docentes. Meta: junio de 2027.'],
  ];
  const w = 2.12;
  steps.forEach(([c, d, n, t, b], i) => {
    const x = 0.7 + i * 2.42;
    card(s, x, 1.9, w, 3.0, c);
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 2.1, w: 0.6, h: 0.6, fill: { color: c }, line: { color: c, width: 0 } });
    s.addText(n, { x: x + 0.2, y: 2.1, w: 0.6, h: 0.6, fontFace: F, fontSize: 19, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 });
    s.addText(t, { x: x + 0.2, y: 2.85, w: w - 0.35, h: 0.7, fontFace: F, fontSize: 16, bold: true, color: d, margin: 0, valign: 'top' });
    s.addText(b, { x: x + 0.2, y: 3.6, w: w - 0.35, h: 1.2, fontFace: F, fontSize: 11.5, color: C.ink, margin: 0, valign: 'top' });
    if (i < 4) wire(s, [[x + w, 3.4], [x + 2.42, 3.4]], C.gray);
  });
  s.addText('Pendiente de verificar', { x: 0.7, y: 5.2, w: 6, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: C.sub, charSpacing: 1.5, margin: 0 });
  ['Disponibilidad de componentes', 'Diseño definitivo', 'Aprobación institucional', 'Utilidad educativa'].forEach((t, i) => {
    card(s, 0.7 + i * 3.02, 5.6, 2.85, 0.85, C.gray, { solid: true, border: C.gray });
    s.addText(t, { x: 0.7 + i * 3.02, y: 5.6, w: 2.85, h: 0.85, fontFace: F, fontSize: 12.5, bold: true, color: C.ink, align: 'center', valign: 'middle', margin: 4 });
  });
}
//### P11
{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BG };
  s.addText('Integrar teoría y práctica con un solo sistema', { x: 0.7, y: 0.45, w: 11.93, h: 0.8, fontFace: F, fontSize: 32, bold: true, color: C.ink, align: 'center', margin: 0 });
  s.addText('Un prototipo para usar, programar y ampliar en la carrera.', { x: 0.7, y: 1.25, w: 11.93, h: 0.45, fontFace: F, fontSize: 16, color: C.sub, align: 'center', margin: 0 });
  renderSlot(s, 4.2, 1.95, 4.95, 4.0, 'Cierre · prototipo completo', 'cierre');
  const q = [
    [0.55, 2.1, C.M, C.Md, '2', 'controladores\nRaspberry Pi 5 y ESP32'],
    [0.55, 4.1, C.E, C.Ed, '5', 'tipos de sensor\nLiDAR, cámara, línea, encoders, corriente'],
    [9.4, 2.1, C.P, C.Pd, '≈ 1,4 M', 'ARS en componentes\nestimación con envío'],
    [9.4, 4.1, C.C, C.Cd, 'Jun 2027', 'meta para tenerlo listo\nno es un plazo confirmado'],
  ];
  q.forEach(([x, y, c, d, big, cap]) => {
    card(s, x, y, 3.4, 1.75, c);
    s.addText(big, { x, y: y + 0.15, w: 3.4, h: 0.85, fontFace: F, fontSize: 34, bold: true, color: d, align: 'center', valign: 'middle', margin: 0 });
    s.addText(cap, { x: x + 0.15, y: y + 1.0, w: 3.1, h: 0.7, fontFace: F, fontSize: 10.5, color: C.sub, align: 'center', valign: 'top', margin: 0 });
  });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText('Prototipo mecatrónico educativo', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0 });
  s.addText(String(slideNo).padStart(2, '0'), { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0 });
}
//### DIV
{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BG };
  s.addText('Anexo técnico', { x: 0.7, y: 2.2, w: 11.93, h: 1.1, fontFace: F, fontSize: 48, bold: true, color: C.ink, align: 'center', margin: 0 });
  s.addText('Cotas, sensores, especificaciones, cálculos, alimentación, compras y decisiones abiertas.', { x: 1.5, y: 3.4, w: 10.3, h: 0.9, fontFace: F, fontSize: 18, color: C.sub, align: 'center', margin: 0, valign: 'top' });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText('Prototipo mecatrónico educativo', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0 });
  s.addText(String(slideNo).padStart(2, '0'), { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0 });
}

//### PANT
{
  const s = base('Pantalla táctil de operación', 'Waveshare ESP32-P4 de 5″: el panel desde donde se maneja y se ve el robot.');
  s.addImage({ path: 'D:/ProyectoFinal/renders/11_detalle_pantalla_control_manual.png', x: 0.7, y: 1.6, w: 6.6, h: 5.13 });
  s.addText('Composición: render del CAD con la interfaz simulada en la pantalla', { x: 0.7, y: 6.72, w: 6.6, h: 0.22, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.65, y: 1.6, w: 4.95, h: 2.79, rectRadius: 0.1, fill: { color: '0B1220' }, line: { color: C.line, width: 0.75 } });
  s.addImage({ path: 'D:/ProyectoFinal/renders/12_ui_control_manual_nuestro_auto.png', x: 7.65, y: 1.6, w: 4.95, h: 2.79 });
  s.addText('Control manual táctil (interfaz de referencia, simulada)', { x: 7.65, y: 4.42, w: 4.95, h: 0.25, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0 });
  card(s, 7.65, 4.8, 4.95, 1.95, C.C);
  s.addText(bullets(['Multitáctil capacitivo de 5 puntos', '720 × 1280 en vertical; en horizontal con una configuración por software', 'Control manual, estado de sensores y alertas', 'Enlace con la Pi o el ESP32: por definir'], 11), { x: 7.85, y: 4.9, w: 4.6, h: 1.75, fontFace: F, margin: 0, valign: 'middle', paraSpaceAfter: 4 });
}
