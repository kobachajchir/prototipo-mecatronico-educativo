const pptxgen = require('pptxgenjs');
const path = require('path');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pres.title = 'Prototipo mecatrónico educativo';

const BG = path.join(__dirname, 'bg.png');
const F = 'Segoe UI';
const C = {
  ink: '0F172A', sub: '4F6178', mute: '6B7C93', line: 'CBD5E1', white: 'FFFFFF',
  M: '3B82F6', Md: '1D4ED8', E: 'F59E0B', Ed: 'B45309', C: '8B5CF6', Cd: '6D28D9', P: '10B981', Pd: '047857',
  red: 'B91C1C', gray: '64748B',
};
const AREAS = [['M', C.M], ['E', C.E], ['C', C.C], ['P', C.P]];
const AREA_NAME = { M: 'MECÁNICA', E: 'ELECTRÓNICA', C: 'CONTROL', P: 'PROGRAMACIÓN' };
let slideNo = 0;

// ---------- helpers ----------
function base(title, sub, areas, footer) {
  const s = pres.addSlide();
  slideNo += 1;
  s.background = { path: BG };
  s.addText(title, { x: 0.7, y: 0.28, w: 10.0, h: 0.7, fontFace: F, fontSize: 28, bold: true, color: C.ink, margin: 0, valign: 'middle' });
  if (sub) s.addText(sub, { x: 0.7, y: 0.98, w: 10.0, h: 0.4, fontFace: F, fontSize: 14, color: C.sub, margin: 0, valign: 'top' });
  AREAS.forEach(([k, col], i) => {
    const on = areas.includes(k);
    s.addShape(pres.shapes.OVAL, { x: 10.95 + i * 0.52, y: 0.3, w: 0.42, h: 0.42, fill: { color: on ? col : 'E6ECF5' }, line: { color: on ? col : 'E6ECF5', width: 0 } });
    s.addText(k, { x: 10.95 + i * 0.52, y: 0.3, w: 0.42, h: 0.42, fontFace: F, fontSize: 12, bold: true, color: on ? C.white : '94A3B8', align: 'center', valign: 'middle', margin: 0 });
  });
  s.addText(areas.map(a => AREA_NAME[a]).join(' + '), { x: 9.6, y: 0.82, w: 3.1, h: 0.3, fontFace: F, fontSize: 7, color: C.sub, align: 'right', charSpacing: 1.5, margin: 0, valign: 'top' });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText(footer || 'Prototipo mecatrónico educativo · Ingeniería Mecatrónica', { x: 0.7, y: 7.03, w: 10, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0, valign: 'middle' });
  s.addText(String(slideNo).padStart(2, '0'), { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0, valign: 'middle' });
  return s;
}

function card(s, x, y, w, h, color, opts = {}) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: opts.r ?? 0.14,
    fill: opts.solid ? { color: C.white, transparency: opts.t ?? 8 } : { color, transparency: opts.t ?? 86 },
    line: { color: opts.solid ? (opts.border || 'E2E8F0') : color, width: opts.lw ?? 1.25, dashType: opts.dash || 'solid' },
    shadow: opts.shadow ? { type: 'outer', color: '1E293B', opacity: 0.12, blur: 8, offset: 2, angle: 90 } : undefined,
  });
}

function zone(s, x, y, w, h, color, label) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: C.white, transparency: 82 }, line: { color, width: 1, dashType: 'dash' } });
  s.addText(label, { x: x + 0.15, y: y + 0.05, w: w - 0.3, h: 0.28, fontFace: F, fontSize: 8, bold: true, color, charSpacing: 2, margin: 0, valign: 'middle' });
}

// card with tag / title / sub / status line
function partCard(s, x, y, w, h, color, dark, tag, title, sub, status, statusKind) {
  card(s, x, y, w, h, color);
  const kindColor = { COMPRAR: C.Md, TALLER: C.Pd, OPCIONAL: C.Cd, INCLUIDO: C.Pd, 'POR DEFINIR': C.gray }[statusKind] || C.sub;
  const runs = [
    { text: tag, options: { fontSize: 6.5, bold: true, color: dark, charSpacing: 1.2, breakLine: true } },
    { text: title, options: { fontSize: 10.5, bold: true, color: C.ink, breakLine: true } },
  ];
  if (sub) runs.push({ text: sub, options: { fontSize: 8, color: C.sub, breakLine: true } });
  if (statusKind) runs.push({ text: statusKind, options: { fontSize: 7, bold: true, color: kindColor } }, { text: status ? '  ' + status : '', options: { fontSize: 7, color: C.mute } });
  s.addText(runs, { x, y, w, h, fontFace: F, margin: [9, 2, 8, 2], valign: 'middle' });
}

// wire = polyline with end dots
function wire(s, pts, color, dashed) {
  for (let i = 0; i < pts.length - 1; i++) {
    const [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), line: { color, width: 2.25, dashType: dashed ? 'dash' : 'solid' } });
  }
  [pts[0], pts[pts.length - 1]].forEach(([x, y]) => {
    s.addShape(pres.shapes.OVAL, { x: x - 0.065, y: y - 0.065, w: 0.13, h: 0.13, fill: { color }, line: { color: C.white, width: 1 } });
  });
}
function lab(s, text, x, y, w, color, align = 'center', bold = false) {
  s.addText(text, { x, y, w, h: 0.2, fontFace: F, fontSize: 7, bold, color, align, margin: 0, valign: 'middle', fit: 'shrink' });
}
// horizontal wire with label above & below
function hwire(s, x1, x2, y, color, above, below, dashed) {
  wire(s, [[x1, y], [x2, y]], color, dashed);
  const w = Math.abs(x2 - x1) - 0.1, x = Math.min(x1, x2) + 0.05;
  if (above) lab(s, above, x, y - 0.25, w, color, 'center', true);
  if (below) lab(s, below, x, y + 0.06, w, C.sub, 'center', false);
}
function chip(s, text, x, y, color, w) {
  const ww = w || 0.12 + text.length * 0.068;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: ww, h: 0.24, rectRadius: 0.12, fill: { color, transparency: 88 }, line: { color, width: 0.75 } });
  s.addText(text, { x, y, w: ww, h: 0.24, fontFace: F, fontSize: 7.5, bold: true, color, align: 'center', valign: 'middle', margin: 0 });
  return ww;
}
function renderSlot(s, x, y, w, h, label) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: C.white, transparency: 55 }, line: { color: C.gray, width: 1.25, dashType: 'dash' } });
  s.addText([
    { text: 'RENDER 3D', options: { fontSize: 11, bold: true, color: C.gray, charSpacing: 3, breakLine: true } },
    { text: label, options: { fontSize: 10, color: C.sub, breakLine: true } },
    { text: 'Render conceptual · diseño en desarrollo', options: { fontSize: 8, color: C.mute, italic: true } },
  ], { x, y, w, h, fontFace: F, align: 'center', valign: 'middle', margin: 8 });
}
function bullets(items, size = 11, color = C.ink) {
  return items.map((t, i) => ({ text: t, options: { bullet: { indent: 12 }, fontSize: size, color, breakLine: i < items.length - 1, paraSpaceAfter: 4 } }));
}
function block(s, x, y, w, h, color, dark, title, body, size = 10.5) {
  card(s, x, y, w, h, color);
  s.addText(title, { x: x + 0.18, y: y + 0.1, w: w - 0.36, h: 0.36, fontFace: F, fontSize: 14, bold: true, color: dark, margin: 0, valign: 'middle' });
  s.addText(body, { x: x + 0.18, y: y + 0.5, w: w - 0.36, h: h - 0.6, fontFace: F, fontSize: size, color: C.ink, margin: 0, valign: 'top' });
}

const WIRE = { dig: C.Md, ana: C.Ed, ser: C.Pd, pot: C.red, tbd: C.gray };

// =====================================================================
// 01 PORTADA
// =====================================================================
{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BG };
  s.addText('IDEA DE PROYECTO · INGENIERÍA MECATRÓNICA', { x: 0.7, y: 1.35, w: 7.0, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: C.Md, charSpacing: 3, margin: 0 });
  s.addText('Un robot mecatrónico para aprender haciendo', { x: 0.7, y: 1.95, w: 6.4, h: 2.2, fontFace: F, fontSize: 40, bold: true, color: C.ink, margin: 0, valign: 'top' });
  s.addText('Un prototipo programable y ampliable que integra teoría y práctica en distintas materias de la carrera.', { x: 0.7, y: 3.75, w: 6.0, h: 0.8, fontFace: F, fontSize: 15, color: C.sub, margin: 0, valign: 'top' });
  [['MECÁNICA', C.M, C.Md], ['ELECTRÓNICA', C.E, C.Ed], ['CONTROL', C.C, C.Cd], ['PROGRAMACIÓN', C.P, C.Pd]].forEach(([t, col, dk], i) => {
    const xs = [0.7, 2.15, 3.95, 5.3];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: xs[i], y: 4.85, w: [1.35, 1.7, 1.25, 1.55][i], h: 0.38, rectRadius: 0.19, fill: { color: col, transparency: 88 }, line: { color: col, width: 1.25 } });
    s.addText(t, { x: xs[i], y: 4.85, w: [1.35, 1.7, 1.25, 1.55][i], h: 0.38, fontFace: F, fontSize: 9.5, bold: true, color: dk, align: 'center', valign: 'middle', margin: 0 });
  });
  s.addText('Koba Chajchir', { x: 0.7, y: 5.6, w: 6, h: 0.3, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0 });
  s.addText('Proyecto final · Ingeniería Mecatrónica · FCAL – UNER', { x: 0.7, y: 5.9, w: 6.5, h: 0.3, fontFace: F, fontSize: 11, color: C.sub, margin: 0 });
  renderSlot(s, 7.6, 1.2, 5.2, 4.9, 'Portada · modelo completo en perspectiva 3/4');
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText('Prototipo mecatrónico educativo · Ingeniería Mecatrónica', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0 });
  s.addText('01', { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0 });
}

// =====================================================================
// 02 EL PROBLEMA
// =====================================================================
{
  const s = base('La teoría y la práctica andan separadas', 'Poca práctica en la carrera y poco contacto entre las ramas de la mecatrónica.', ['M', 'E', 'C', 'P']);
  const w = 3.8, y = 1.75, h = 3.6;
  block(s, 0.7, y, w, h, C.M, C.Md, 'Hoy', 'Hay pocas actividades prácticas con robótica y mecatrónica.\n\nEn las materias, cada rama se ve por separado y casi sin integrarse.');
  block(s, 4.77, y, w, h, C.E, C.Ed, 'Consecuencia', 'Cuesta vincular la teoría con la práctica.\n\nDesmotivación, poco disfrute de los trabajos prácticos y baja participación.');
  block(s, 8.84, y, w, h, C.P, C.Pd, 'Propuesta', 'Un sistema mecatrónico para usar y programar, con ensayos más dinámicos y parecidos a un juego.\n\nUna base que los estudiantes puedan ampliar a medida que aprenden.');
  chip(s, 'APRECIACIÓN DEL AUTOR · ESTUDIANTE DE LA CARRERA', 0.7, 5.6, C.Ed, 4.3);
  s.addText('Todavía no está medido. Se contrastará con una encuesta a estudiantes (Google Forms) y con consultas a docentes.', { x: 0.7, y: 5.95, w: 11.9, h: 0.6, fontFace: F, fontSize: 12, color: C.sub, margin: 0, valign: 'top' });
}

// =====================================================================
// 03 A QUIÉN SIRVE
// =====================================================================
{
  const s = base('A quién va dirigido', 'Se entrega a la carrera. No se vende.', ['M', 'E', 'C', 'P']);
  const y = 1.75, h = 3.45, w = 3.8;
  block(s, 0.7, y, w, h, C.P, C.Pd, 'Estudiantes', 'Usan y programan el robot, hacen ensayos y lo amplían con sus propias ideas.\n\nPueden contrastar la teoría con mediciones reales.');
  block(s, 4.77, y, w, h, C.M, C.Md, 'Docentes', 'Incorporan el prototipo a sus clases con ensayos de cada materia.\n\nPara decidirlo: cuerpo docente de cada materia, jefe de cátedra y profesor de prácticas.');
  block(s, 8.84, y, w, h, C.C, C.Cd, 'La carrera y la facultad', 'Reciben el prototipo y lo usan también para presentaciones, ferias y eventos con una demostración en funcionamiento.\n\nLa aprobación institucional queda por consultar.');
  chip(s, 'PENDIENTE DE CONFIRMAR CON DOCENTES Y FACULTAD', 0.7, 5.45, C.gray, 4.4);
  s.addText('Primer dato a verificar: el interés real de los estudiantes en hacer la carrera más práctica.', { x: 0.7, y: 5.85, w: 11.9, h: 0.5, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0 });
}

// =====================================================================
// 04 LA IDEA
// =====================================================================
{
  const s = base('La idea: un robot móvil educativo', 'Control a bordo y una computadora externa que recibe y procesa los datos.', ['M', 'E', 'C', 'P']);
  renderSlot(s, 0.7, 1.65, 7.1, 4.95, 'Modelo completo · vista 3/4');
  card(s, 8.1, 1.65, 4.55, 4.95, C.M);
  s.addText('Qué es', { x: 8.3, y: 1.75, w: 4.2, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: C.Md, margin: 0 });
  s.addText(bullets([
    'Dos ruedas motrices y una rueda loca.',
    'Dos placas unidas por seis pilares.',
    'LiDAR 3D y cámara al frente.',
    'Sensor de línea bajo el chasis.',
    'Raspberry Pi 5 y ESP32-P4 como cerebro.',
    'Pantalla táctil en la parte trasera.',
    'Zona de montaje central para accesorios.',
  ], 11.5), { x: 8.3, y: 2.2, w: 4.2, h: 3.2, fontFace: F, margin: 0, valign: 'top' });
  s.addText('Cotas iniciales del CAD: unos 340 × 218 × 216 mm. Son referencias, no un diseño mecánico definitivo.', { x: 8.3, y: 5.5, w: 4.2, h: 0.95, fontFace: F, fontSize: 9.5, italic: true, color: C.sub, margin: 0, valign: 'top' });
}

// =====================================================================
// 05 FUNCIONES MÍNIMAS
// =====================================================================
{
  const s = base('Qué debería poder hacer', 'Funciones mínimas para empezar a usarse en una materia.', ['M', 'E', 'C', 'P']);
  const items = [
    [C.M, C.Md, 'Mover motores', 'Dos motorreductores con encoder, uno por rueda, con driver doble y lazo de velocidad.'],
    [C.E, C.Ed, 'Medir corriente', 'Un sensor por motor para ver la carga y detectar un bloqueo junto con el encoder.'],
    [C.C, C.Cd, 'Sensores funcionales', 'Línea de 5 canales, LiDAR 3D, cámara y, opcionalmente, una IMU.'],
    [C.P, C.Pd, 'Comunicación', 'Entre la Raspberry, el ESP32 y la computadora externa, con una interfaz web.'],
  ];
  items.forEach(([c, d, t, b], i) => {
    block(s, 0.7 + i * 3.0, 1.75, 2.85, 2.6, c, d, t, b, 11);
  });
  renderSlot(s, 0.7, 4.6, 5.8, 2.15, 'Detalle del frente · LiDAR, cámara y sensor de línea');
  renderSlot(s, 6.8, 4.6, 5.85, 2.15, 'Detalle inferior · motores, batería y bandejas');
}

// =====================================================================
// 06 CAPACIDADES EN ESTUDIO
// =====================================================================
{
  const s = base('Capacidades en estudio', 'Lo que el prototipo permitiría trabajar. Todavía no está comprobado.', ['M', 'C', 'P']);
  const items = [
    [C.M, C.Md, 'Odometría', 'Posición y giro a partir de los encoders, el diámetro de rueda y la separación entre ruedas.'],
    [C.C, C.Cd, 'Trayectorias', 'Seguimiento de línea y movimiento por diferencia de velocidad entre ruedas.'],
    [C.E, C.Ed, 'Datos LiDAR', 'Nube de puntos del Unitree 4D LiDAR L1 PM por UART, con IMU incluida.'],
    [C.P, C.Pd, 'Mapeo 3D', 'Procesamiento en la Raspberry y visualización en la computadora externa.'],
  ];
  items.forEach(([c, d, t, b], i) => {
    block(s, 0.7 + (i % 2) * 6.05, 1.75 + Math.floor(i / 2) * 2.35, 5.85, 2.15, c, d, t, b, 12);
    chip(s, 'EN ESTUDIO', 0.7 + (i % 2) * 6.05 + 4.55, 1.85 + Math.floor(i / 2) * 2.35, C.gray, 1.1);
  });
  s.addText('El funcionamiento real de cada capacidad se comprobará durante el desarrollo y al terminar el prototipo.', { x: 0.7, y: 6.5, w: 11.9, h: 0.35, fontFace: F, fontSize: 11, italic: true, color: C.sub, margin: 0 });
}

// =====================================================================
// 07 UNA PLATAFORMA, SEIS MATERIAS
// =====================================================================
{
  const s = base('Una plataforma, seis materias', 'Ejemplos de uso propuestos. Falta contrastarlos con los docentes.', ['M', 'E', 'C', 'P']);
  const m = [
    [C.P, C.Pd, 'Microcontroladores', 'Programar el control del prototipo y entender cómo funciona.'],
    [C.C, C.Cd, 'Robótica II', 'Odometría, matemática y cálculo de trayectorias.'],
    [C.E, C.Ed, 'Sistemas Mecatrónicos', 'Lectura e integración de sensores y comunicación.'],
    [C.C, C.Cd, 'Sistemas de Control', 'Ajuste del PID y control fino de motores.'],
    [C.M, C.Md, 'Mecanismos', 'Cálculo de fuerzas y esfuerzos.'],
    [C.M, C.Md, 'Tecnología Industrial', 'Escanear y reproducir objetos 3D, usar CAD y diseñar módulos nuevos.'],
  ];
  m.forEach(([c, d, t, b], i) => {
    block(s, 0.7 + (i % 3) * 4.05, 1.75 + Math.floor(i / 3) * 2.45, 3.85, 2.25, c, d, t, b, 11.5);
  });
  s.addText('Todavía no se eligió una materia inicial única.', { x: 0.7, y: 6.65, w: 11.9, h: 0.3, fontFace: F, fontSize: 11, italic: true, color: C.sub, margin: 0 });
}

// =====================================================================
// 08 ESQUEMA DE SENSORES Y CONTROL
// =====================================================================
{
  const s = base('Sensores y control: cómo se conecta todo', 'Cada sensor llega por cable al controlador que lo necesita.', ['M', 'E', 'C', 'P'], 'Sistemas Mecatrónicos · Microcontroladores · Sistemas de Control · Robótica II');
  // zones
  zone(s, 0.3, 1.5, 2.72, 5.15, C.Ed, 'SENSORES');
  zone(s, 4.35, 1.5, 4.3, 5.15, C.gray, 'CONTROLADORES HERMANOS');
  zone(s, 9.8, 1.5, 3.25, 5.15, C.Md, 'ACCIONAMIENTO Y SALIDAS');

  // left cards
  const lx = 0.45, lw = 2.4, lh = 0.7;
  const cy = i => 1.9 + i * 0.8;
  const cc = i => cy(i) + 0.35;
  partCard(s, lx, cy(0), lw, lh, C.E, C.Ed, 'SENSOR 3D', 'Unitree 4D LiDAR L1 PM', 'Nube de puntos + IMU · UART TTL', '· USD 249 · Onyx Robotics', 'COMPRAR');
  partCard(s, lx, cy(1), lw, lh, C.E, C.Ed, 'CÁMARA', 'Logitech C270', 'USB · 720p · campo de 55° diagonal', '· ARS 47.565 · Gerbio', 'COMPRAR');
  partCard(s, lx, cy(2), lw, lh, C.E, C.Ed, 'SENSOR DE PISTA', 'OSOYOO IR de 5 canales', 'Posición de la línea bajo el chasis', '· ARS 28.466 · CVR Electrónica', 'COMPRAR');
  partCard(s, lx, cy(3), lw, lh, C.E, C.Ed, 'MOVIMIENTO · ENCODERS', 'Encoders de los motores', 'Velocidad y giro de cada rueda', 'en cada motor Pololu #4756', 'INCLUIDO');
  partCard(s, lx, cy(4), lw, lh, C.E, C.Ed, 'CORRIENTE EN MOTORES', 'Pololu #5240 · ±10 A (×2)', 'Uno por motor, en serie con un cable', '· USD 5,25 c/u · DigiKey', 'COMPRAR');
  partCard(s, lx, cy(5), lw, lh, C.E, C.Ed, 'MOVIMIENTO · IMU', 'SparkFun BNO086', 'Evaluar antes la IMU del LiDAR', '· USD 34,95 · SparkFun', 'OPCIONAL');

  // Pi (bigger)
  card(s, 4.5, 1.9, 4.0, 2.15, C.P, { lw: 1.75, shadow: true });
  s.addText([
    { text: 'CEREBRO DE DATOS', options: { fontSize: 7, bold: true, color: C.Pd, charSpacing: 1.5, breakLine: true } },
    { text: 'Raspberry Pi 5 · 4 GB', options: { fontSize: 18, bold: true, color: C.ink, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'Recibe la nube de puntos del LiDAR y el video de la cámara', options: { bullet: { indent: 11 }, fontSize: 9, color: C.ink, breakLine: true } },
    { text: 'Procesa el mapeo 3D y entrega datos a la computadora', options: { bullet: { indent: 11 }, fontSize: 9, color: C.ink, breakLine: true } },
    { text: 'Se alimenta con 5 V / 5 A por USB-C PD', options: { bullet: { indent: 11 }, fontSize: 9, color: C.ink, breakLine: true, paraSpaceAfter: 4 } },
    { text: 'COMPRAR', options: { fontSize: 7, bold: true, color: C.Md } },
    { text: '  ARS 325.280 · Starware', options: { fontSize: 7, color: C.mute } },
  ], { x: 4.5, y: 1.9, w: 4.0, h: 2.15, fontFace: F, margin: [12, 4, 10, 4], valign: 'middle' });

  // ESP (smaller)
  card(s, 4.5, 4.7, 3.6, 1.95, C.C, { lw: 1.75, shadow: true });
  s.addText([
    { text: 'CONTROL EN TIEMPO REAL', options: { fontSize: 7, bold: true, color: C.Cd, charSpacing: 1.5, breakLine: true } },
    { text: 'Waveshare ESP32-P4', options: { fontSize: 14, bold: true, color: C.ink, breakLine: true } },
    { text: 'WiFi 6 + pantalla táctil de 5″', options: { fontSize: 9, color: C.sub, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'PID de velocidad por rueda con encoders', options: { bullet: { indent: 11 }, fontSize: 8.5, color: C.ink, breakLine: true } },
    { text: 'Lee línea, corriente (ADC) e IMU', options: { bullet: { indent: 11 }, fontSize: 8.5, color: C.ink, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'COMPRAR', options: { fontSize: 7, bold: true, color: C.Md } },
    { text: '  ARS 145.200 · Mercado Libre', options: { fontSize: 7, color: C.mute, breakLine: true } },
    { text: 'Si el pinout no alcanza: ESP32 DevKit V1 (ARS 20.470)', options: { fontSize: 7, italic: true, color: C.mute } },
  ], { x: 4.5, y: 4.7, w: 3.6, h: 1.95, fontFace: F, margin: [12, 4, 10, 4], valign: 'middle' });

  // Pi inputs (straight)
  hwire(s, 2.85, 4.5, cc(0), WIRE.ser, 'UART TTL', 'vía adaptador USB–UART');
  hwire(s, 2.85, 4.5, cc(1), WIRE.ser, 'USB', 'video 720p');
  // ESP inputs (elbows)
  const e = [5.05, 5.45, 5.85, 6.3];
  const vx = [4.3, 4.05, 3.8];
  wire(s, [[2.85, cc(2)], [vx[0], cc(2)], [vx[0], e[0]], [4.5, e[0]]], WIRE.dig);
  lab(s, '5 señales digitales', 2.9, cc(2) - 0.25, vx[0] - 2.95, WIRE.dig, 'center', true);
  lab(s, 'pines por definir', 2.9, cc(2) + 0.06, vx[0] - 2.95, C.sub);
  wire(s, [[2.85, cc(3)], [vx[1], cc(3)], [vx[1], e[1]], [4.5, e[1]]], WIRE.dig);
  lab(s, 'A/B × 2 motores', 2.9, cc(3) - 0.25, vx[1] - 2.95, WIRE.dig, 'center', true);
  lab(s, 'velocidad y giro', 2.9, cc(3) + 0.06, vx[1] - 2.95, C.sub);
  wire(s, [[2.85, cc(4)], [vx[2], cc(4)], [vx[2], e[2]], [4.5, e[2]]], WIRE.ana);
  lab(s, '2 analógicas', 2.9, cc(4) - 0.25, vx[2] - 2.95, WIRE.ana, 'center', true);
  lab(s, 'ADC · GPIO21/22', 2.9, cc(4) + 0.06, vx[2] - 2.95, C.sub);
  hwire(s, 2.85, 4.5, cc(5), WIRE.tbd, 'bus por definir', 'opcional', true);

  // Pi <-> ESP link (two vertical dashed wires)
  wire(s, [[5.75, 4.05], [5.75, 4.7]], WIRE.tbd, true);
  wire(s, [[6.35, 4.05], [6.35, 4.7]], WIRE.tbd, true);
  s.addText([{ text: 'Consignas Pi → ESP', options: { bold: true, color: C.gray, breakLine: true } }, { text: 'enlace por definir', options: { color: C.sub } }], { x: 4.5, y: 4.1, w: 1.15, h: 0.55, fontFace: F, fontSize: 6.5, align: 'right', margin: 0, valign: 'middle' });
  s.addText([{ text: 'Telemetría ESP → Pi', options: { bold: true, color: C.gray, breakLine: true } }, { text: 'UART, USB o Wi-Fi: por definir', options: { color: C.sub } }], { x: 6.45, y: 4.1, w: 1.9, h: 0.55, fontFace: F, fontSize: 6.5, align: 'left', margin: 0, valign: 'middle' });

  // right: PC
  partCard(s, 9.95, 1.9, 2.9, 0.8, C.gray, C.gray, 'COMPUTADORA EXTERNA', 'Interfaz web', 'Visualiza y procesa lecturas y mapa', 'la usa el estudiante', 'POR DEFINIR');
  hwire(s, 8.5, 9.95, 2.3, WIRE.tbd, 'Wi-Fi / Ethernet', 'enlace por definir', true);
  // right: Cytron + motors
  partCard(s, 9.95, 4.6, 2.9, 0.8, C.M, C.Md, 'MOVIMIENTO · DRIVER', 'Cytron MDD10A', 'Driver doble de 10 A · 2 canales', '· USD 25,90 · Cytron', 'COMPRAR');
  hwire(s, 8.1, 9.95, 5.0, WIRE.dig, 'PWM + DIR', '2 canales');
  partCard(s, 9.95, 5.95, 2.9, 0.65, C.M, C.Md, 'MOVIMIENTO · MOTORES', '2 × Pololu #4756 · 12 V · 76 rpm', null, '· USD 60,95 c/u · DigiKey', 'COMPRAR');
  wire(s, [[11.0, 5.4], [11.0, 5.95]], WIRE.pot);
  wire(s, [[11.9, 5.4], [11.9, 5.95]], WIRE.pot);
  s.addText([{ text: 'Motor A', options: { bold: true, color: WIRE.pot, breakLine: true } }, { text: 'rueda izq.', options: { color: C.sub } }], { x: 9.95, y: 5.42, w: 0.98, h: 0.5, fontFace: F, fontSize: 7, align: 'right', margin: 0, valign: 'middle' });
  s.addText([{ text: 'Motor B', options: { bold: true, color: WIRE.pot, breakLine: true } }, { text: 'rueda der.', options: { color: C.sub } }], { x: 11.98, y: 5.42, w: 0.87, h: 0.5, fontFace: F, fontSize: 7, align: 'left', margin: 0, valign: 'middle' });

  // legend
  const lg = [['Digital', WIRE.dig, false], ['Analógica', WIRE.ana, false], ['Serie / USB', WIRE.ser, false], ['Potencia de motor', WIRE.pot, false], ['Por definir', WIRE.tbd, true]];
  let lx0 = 0.7;
  lg.forEach(([t, col, d]) => {
    s.addShape(pres.shapes.LINE, { x: lx0, y: 6.82, w: 0.4, h: 0, line: { color: col, width: 2.25, dashType: d ? 'dash' : 'solid' } });
    s.addText(t, { x: lx0 + 0.47, y: 6.72, w: 1.4, h: 0.2, fontFace: F, fontSize: 7.5, color: C.sub, margin: 0, valign: 'middle' });
    lx0 += 0.47 + t.length * 0.07 + 0.4;
  });
}

// =====================================================================
// 09 ALIMENTACIÓN
// =====================================================================
{
  const s = base('Alimentación y potencia', 'Una batería de 12 V alimenta cada bloque a través del regulador que necesita.', ['E', 'M'], 'Electrónica de Potencia · Electrónica Básica · Sistemas Mecatrónicos');
  zone(s, 0.3, 1.5, 3.2, 5.15, C.Ed, 'FUENTE Y PROTECCIÓN');
  zone(s, 4.1, 1.5, 3.45, 5.15, C.gray, 'REGULACIÓN');
  zone(s, 9.8, 1.5, 3.25, 5.15, C.Md, 'CARGAS');

  // battery + protection
  partCard(s, 0.5, 2.0, 2.8, 1.0, C.E, C.Ed, 'BATERÍA', 'Probattery BSLA-1270-CPB', '12 V · 7 Ah · terminal F1', '· ARS 29.255 · Electroimpulso (fuera del subtotal)', 'COMPRAR');
  partCard(s, 0.5, 3.75, 2.8, 0.95, C.P, C.Pd, 'PROTECCIÓN', 'Fusible y corte de tracción', 'Punto de corte accesible', 'por definir', 'TALLER');
  partCard(s, 0.5, 5.4, 2.8, 0.9, C.P, C.Pd, 'CARGA', 'Cargador del taller', 'Con el perfil de la batería', 'fuera del subtotal', 'TALLER');
  wire(s, [[1.9, 3.0], [1.9, 3.75]], WIRE.pot);
  lab(s, '12 V', 1.98, 3.25, 0.7, WIRE.pot, 'left', true);
  wire(s, [[1.9, 5.4], [1.9, 4.7]], WIRE.tbd, true);
  lab(s, 'carga', 1.98, 4.92, 0.7, C.sub, 'left');

  // bus
  const busX = 3.8;
  wire(s, [[3.3, 4.2], [busX, 4.2]], WIRE.pot);
  lab(s, 'barra de 12 V', 3.45, 2.02, 0.95, WIRE.pot, 'center', true);
  s.addShape(pres.shapes.LINE, { x: busX, y: 2.3, w: 0, h: 3.9, line: { color: WIRE.pot, width: 3.5 } });

  const rows = [2.3, 3.5, 4.7, 5.9];
  rows.forEach(y => wire(s, [[busX, y], [4.3, y]], WIRE.pot));
  // regulators
  partCard(s, 4.3, 1.95, 3.0, 0.7, C.M, C.Md, 'DIRECTO A 12 V', 'Driver Cytron MDD10A', 'Alimenta ambos motores', '· ARS 49.858', 'COMPRAR');
  partCard(s, 4.3, 3.15, 3.0, 0.7, C.E, C.Ed, '12 V → 5 V', 'Yahboom YB-MPP01', 'USB-C PD de 5 V / 5 A', '· USD 9 · Yahboom', 'COMPRAR');
  partCard(s, 4.3, 4.35, 3.0, 0.7, C.E, C.Ed, '12 V → 12 V regulados', 'Pololu #4984 buck-boost', 'Mantiene 12 V para el LiDAR', '· USD 18,95 · Pololu', 'COMPRAR');
  partCard(s, 4.3, 5.55, 3.0, 0.7, C.P, C.Pd, 'RAMA DE 5 V', 'Regulación de la Waveshare', 'Alimentación USB-C de 5 V', 'por definir', 'TALLER');
  // loads
  const loads = [
    ['MOVIMIENTO', '2 × Pololu #4756', 'Motores con encoder, uno por rueda', C.M, C.Md, 'Motor A y B', 'pasa por el sensor de corriente'],
    ['CÓMPUTO', 'Raspberry Pi 5', 'Cerebro de datos', C.P, C.Pd, '5 V / 5 A', 'cable USB-C PD de 5 A'],
    ['SENSOR 3D', 'Unitree L1 PM', 'Mapeo 3D con IMU', C.E, C.Ed, '12 V', 'regulados'],
    ['CONTROL', 'Waveshare ESP32-P4', 'Controlador y pantalla', C.C, C.Cd, '5 V', 'por USB-C'],
  ];
  loads.forEach(([tag, t, sub, c, d, l1, l2], i) => {
    const y = [1.95, 3.15, 4.35, 5.55][i];
    partCard(s, 9.95, y, 2.9, 0.7, c, d, tag, t, sub, null, null);
    hwire(s, 7.3, 9.95, y + 0.35, WIRE.pot, l1, l2, i === 3);
  });
  s.addText('Pico y consumo de cada carga todavía sin medir: la distribución se dimensionará con las piezas definitivas.', { x: 0.7, y: 6.7, w: 11.9, h: 0.22, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0 });
}

// =====================================================================
// 10 COMPRAR VS TALLER
// =====================================================================
{
  const s = base('Qué compramos y qué hacemos nosotros', 'Precios en ARS con 10 % de envío; los de exterior se pasaron a ARS 1.750 por dólar. Sin IVA ni aduana.', ['E', 'M'], 'Presupuesto de componentes actualizado el 20/11/2026');
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: '1E3A8A' }, fontSize: 9.5, fontFace: F } });
  const td = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 9, color: C.ink, fontFace: F }, o) });
  const r = (a, b, c, d) => [td(a, { bold: true }), td(b), td(c), td(d, { align: 'right' })];
  const rows = [
    [hdr('Componente'), hdr('Origen'), hdr('Proveedor'), hdr('ARS')],
    r('Unitree 4D LiDAR L1 PM', 'Exterior · USD 249', 'Onyx Robotics', '479.325'),
    r('Raspberry Pi 5 · 4 GB', 'Argentina', 'Starware', '325.280'),
    r('2 × Pololu #4756 + encoder', 'Exterior · USD 60,95 c/u', 'DigiKey (cotizar RC Juampa)', '234.658'),
    r('Waveshare ESP32-P4 + pantalla 5″', 'Argentina', 'Mercado Libre', '145.200'),
    r('Driver Cytron MDD10A', 'Exterior · USD 25,90', 'Cytron', '49.858'),
    r('Logitech C270', 'Argentina', 'Gerbio', '47.565'),
    r('Pololu #4984 buck-boost 12 V', 'Exterior · USD 18,95', 'Pololu', '36.488'),
    r('OSOYOO IR de 5 canales', 'Argentina', 'CVR Electrónica', '28.466'),
    r('2 × Pololu #5240 (corriente)', 'Exterior · USD 5,25 c/u', 'DigiKey', '20.213'),
    r('Yahboom YB-MPP01 (12 V → 5 V PD)', 'Exterior · USD 9', 'Yahboom', '17.325'),
    [td('Subtotal cotizado', { bold: true, fill: { color: 'DBEAFE' } }), td('', { fill: { color: 'DBEAFE' } }), td('', { fill: { color: 'DBEAFE' } }), td('1.384.376', { bold: true, align: 'right', fill: { color: 'DBEAFE' } })],
  ];
  s.addTable(rows, { x: 0.7, y: 1.6, w: 7.75, colW: [2.9, 1.95, 1.9, 1.0], rowH: 0.4, border: { type: 'solid', pt: 0.5, color: 'D5DCE6' }, fill: { color: 'FFFFFF' }, margin: [0.02, 0.08, 0.02, 0.08], valign: 'middle' });
  // right cards
  card(s, 8.75, 1.6, 3.9, 2.85, C.P);
  s.addText('Lo ponemos nosotros (taller)', { x: 8.95, y: 1.68, w: 3.6, h: 0.35, fontFace: F, fontSize: 13, bold: true, color: C.Pd, margin: 0 });
  s.addText(bullets([
    'Rodadura y fabricación: ruedas, cubos, ejes, rodamientos, rueda loca, soportes, chapón, pilares y tornillería.',
    'Potencia y cableado: rama de 5 V, fusibles, conector de carga, corte de tracción.',
    'Insumos: microSD, refrigeración de la Pi, soportes de cámara y LiDAR.',
    'Cargador de la batería.',
  ], 9.5), { x: 8.95, y: 2.05, w: 3.55, h: 2.35, fontFace: F, margin: 0, valign: 'top' });
  card(s, 8.75, 4.6, 3.9, 2.15, C.C);
  s.addText('Opcionales y por definir', { x: 8.95, y: 4.68, w: 3.6, h: 0.35, fontFace: F, fontSize: 13, bold: true, color: C.Cd, margin: 0 });
  s.addText(bullets([
    'IMU SparkFun BNO086: USD 34,95 (unos ARS 67.300).',
    'ESP32 DevKit V1 de respaldo: ARS 20.470.',
    'Batería: Probattery ARS 29.255 o Yuasa NP7-12 ARS 61.984 (fuera del subtotal).',
    'Adaptador USB–UART del LiDAR, si el kit no lo trae.',
  ], 9.5), { x: 8.95, y: 5.05, w: 3.55, h: 1.65, fontFace: F, margin: 0, valign: 'top' });
}

// =====================================================================
// 11 COSTOS Y FINANCIAMIENTO
// =====================================================================
{
  const s = base('Cuánto cuesta y cómo se paga', 'Es un entregable educativo: no hay precio de venta ni retorno económico.', ['E', 'M', 'P']);
  const big = (x, y, w, h, color, dark, label, num, note) => {
    card(s, x, y, w, h, color, { solid: true, border: color, shadow: true });
    s.addText(label, { x, y: y + 0.15, w, h: 0.3, fontFace: F, fontSize: 9, bold: true, color: dark, align: 'center', charSpacing: 2, margin: 0 });
    s.addText(num, { x, y: y + 0.5, w, h: 0.9, fontFace: F, fontSize: 34, bold: true, color: C.ink, align: 'center', margin: 0, valign: 'middle' });
    s.addText(note, { x: x + 0.2, y: y + 1.45, w: w - 0.4, h: h - 1.55, fontFace: F, fontSize: 12, color: C.sub, align: 'center', margin: 0, valign: 'top' });
  };
  big(0.7, 1.7, 3.9, 2.55, C.M, C.Md, 'ESCENARIO ELEGIDO', 'ARS 1.384.376', 'Componentes cotizados: Pi 5 de 4 GB y LiDAR L1 PM. Incluye 10 % de envío; sin IVA ni aduana.');
  big(4.72, 1.7, 3.9, 2.55, C.C, C.Cd, 'SI SE IMPORTA LA PI', 'ARS 1.309.346', 'Referencia si se confirma comprar la Pi 5 en el exterior al costo estimado.');
  big(8.74, 1.7, 3.9, 2.55, C.E, C.Ed, 'ESCENARIO DE MAYOR COSTO', 'ARS 1.826.719', 'Con LiDAR L2 y Raspberry Pi de 8 GB. Se mantiene solo como comparación.');
  block(s, 0.7, 4.5, 5.9, 1.9, C.P, C.Pd, 'Cómo se cubre', 'Financiamiento privado del autor. Se agradecería ayuda económica de la facultad, que todavía no está consultada.', 13);
  block(s, 6.72, 4.5, 5.92, 1.9, C.gray, C.gray, 'Qué falta confirmar', 'Envío a Argentina, impuestos y aduana, y si el kit del LiDAR trae el adaptador USB–UART. La estimación inicial del autor era de unos ARS 1.300.000.', 13);
}

// =====================================================================
// 12 LEAN CANVAS
// =====================================================================
{
  const s = base('Modelo de negocio: Lean Canvas', 'Cada bloque indica qué tan firme es lo que se afirma.', ['P', 'M']);
  const b = [
    ['1 · Problema', 'DEL AUTOR', C.Ed, 'Poca práctica; teoría y práctica separadas.'],
    ['2 · Segmento', 'DEFINIDO', C.Pd, 'Estudiantes y docentes de Ing. Mecatrónica.'],
    ['3 · Propuesta de valor', 'HIPÓTESIS', C.Cd, 'Plataforma integral, programable y ampliable.'],
    ['4 · Solución', 'EN DISEÑO', C.Md, 'Robot móvil con LiDAR, cámara, sensores y comunicación.'],
    ['5 · Canales', 'PENDIENTE', C.gray, 'Presentar ideas de uso y llevar el prototipo a los docentes.'],
    ['6 · Ingresos', 'NO APLICA', C.gray, 'Se entrega a la carrera. No se vende.'],
    ['7 · Costos', 'ESTIMACIÓN', C.Ed, 'Componentes ≈ ARS 1,38 M. Financiamiento por definir.'],
    ['8 · Métricas', 'PENDIENTE', C.gray, 'Uso en las materias e interés de los estudiantes.'],
    ['9 · Ventaja', 'HIPÓTESIS', C.Cd, 'Sistema integral, abierto y ampliable en varias ramas.'],
  ];
  b.forEach(([t, tag, col, body], i) => {
    const x = 0.7 + (i % 3) * 4.05, y = 1.6 + Math.floor(i / 3) * 1.6;
    card(s, x, y, 3.85, 1.48, col, { solid: true, border: col, shadow: true });
    s.addText(t, { x: x + 0.15, y: y + 0.08, w: 2.3, h: 0.32, fontFace: F, fontSize: 12.5, bold: true, color: C.ink, margin: 0, valign: 'middle' });
    chip(s, tag, x + 3.85 - 0.15 - (0.2 + tag.length * 0.068), y + 0.12, col, 0.2 + tag.length * 0.068);
    s.addText(body, { x: x + 0.15, y: y + 0.5, w: 3.55, h: 0.9, fontFace: F, fontSize: 12, color: C.sub, margin: 0, valign: 'top' });
  });
  s.addText('Hipótesis crítica a testear primero: que los estudiantes quieran una carrera más práctica.', { x: 0.7, y: 6.5, w: 11.9, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: C.ink, margin: 0 });
}

// =====================================================================
// 13 HOJA DE RUTA
// =====================================================================
{
  const s = base('Hoja de ruta y pendientes', 'Lo que falta verificar antes de construir.', ['M', 'E', 'C', 'P']);
  const steps = [
    [C.P, C.Pd, '1 · Consultar', 'Encuesta a estudiantes en Google Forms y consulta a docentes y facultad.'],
    [C.E, C.Ed, '2 · Confirmar piezas', 'Precios finales, envío a Argentina, adaptador USB–UART del LiDAR.'],
    [C.C, C.Cd, '3 · Cerrar el diseño', 'Pinout, enlace entre la Pi y el ESP, alimentación y chasis.'],
    [C.M, C.Md, '4 · Construir y programar', 'Armado, pruebas y funciones mínimas funcionando.'],
    [C.P, C.Pd, '5 · Presentar', 'Llevar el prototipo a los docentes. Meta: junio de 2027.'],
  ];
  const w = 2.12;
  steps.forEach(([c, d, t, b], i) => {
    const x = 0.7 + i * 2.42;
    card(s, x, 1.8, w, 2.3, c);
    s.addText(t, { x: x + 0.15, y: 1.9, w: w - 0.3, h: 0.7, fontFace: F, fontSize: 13, bold: true, color: d, margin: 0, valign: 'top' });
    s.addText(b, { x: x + 0.15, y: 2.7, w: w - 0.3, h: 1.3, fontFace: F, fontSize: 11, color: C.ink, margin: 0, valign: 'top' });
    if (i < 4) wire(s, [[x + w, 2.95], [x + 2.42, 2.95]], C.gray);
  });
  s.addText('PENDIENTE DE VERIFICAR', { x: 0.7, y: 4.55, w: 6, h: 0.3, fontFace: F, fontSize: 10, bold: true, color: C.sub, charSpacing: 2, margin: 0 });
  ['Disponibilidad de componentes', 'Diseño definitivo', 'Aprobación institucional', 'Utilidad educativa'].forEach((t, i) => {
    const w2 = 2.85;
    card(s, 0.7 + i * 3.02, 4.95, w2, 0.8, C.gray, { solid: true, border: C.gray });
    s.addText(t, { x: 0.7 + i * 3.02, y: 4.95, w: w2, h: 0.8, fontFace: F, fontSize: 12, bold: true, color: C.ink, align: 'center', valign: 'middle', margin: 4 });
  });
  s.addText('La fecha de junio de 2027 es una meta del autor, no un plazo confirmado.', { x: 0.7, y: 6.0, w: 11.9, h: 0.3, fontFace: F, fontSize: 12, italic: true, color: C.sub, margin: 0 });
}

// =====================================================================
// 14 DECISIÓN
// =====================================================================
{
  const s = base('Decisión: avanzar con revisión', 'Semáforo de deseabilidad, factibilidad y viabilidad.', ['M', 'E', 'C', 'P']);
  const L = [
    ['DESEABILIDAD', 'AMARILLO', 'El problema lo percibe el autor. Falta la encuesta y la consulta a docentes.'],
    ['FACTIBILIDAD', 'AMARILLO', 'Conseguir las piezas en el país y cerrar el diseño. El resto se puede hacer.'],
    ['VIABILIDAD', 'AMARILLO', 'Unos ARS 1,38 M de componentes. Financiamiento por consultar con la facultad.'],
  ];
  L.forEach(([t, st, b], i) => {
    const x = 0.7 + i * 4.05;
    card(s, x, 1.7, 3.85, 1.95, C.E, { solid: true, border: C.E, shadow: true });
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.9, w: 0.34, h: 0.34, fill: { color: 'FACC15' }, line: { color: C.Ed, width: 1 } });
    s.addText(t, { x: x + 0.65, y: 1.85, w: 2.0, h: 0.44, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: 'middle' });
    chip(s, st, x + 3.85 - 0.15 - 1.0, 1.95, C.Ed, 1.0);
    s.addText(b, { x: x + 0.2, y: 2.45, w: 3.45, h: 1.1, fontFace: F, fontSize: 12.5, color: C.sub, margin: 0, valign: 'top' });
  });
  const k = [
    ['Driver de valor', 'Integrar teoría y práctica con un solo sistema.'],
    ['Restricción principal', 'Conseguir las piezas en el país.'],
    ['Supuesto crítico', 'Que estudiantes y docentes quieran usarlo.'],
    ['Próxima evidencia', 'Resultados de la encuesta a estudiantes.'],
  ];
  k.forEach(([t, b], i) => {
    const x = 0.7 + (i % 2) * 6.05, y = 3.95 + Math.floor(i / 2) * 1.0;
    card(s, x, y, 5.85, 0.88, C.M, { solid: true, border: 'E2E8F0' });
    s.addText([{ text: t, options: { bold: true, color: C.Md, fontSize: 11, breakLine: true } }, { text: b, options: { color: C.ink, fontSize: 11 } }], { x: x + 0.2, y, w: 5.45, h: 0.88, fontFace: F, margin: 0, valign: 'middle' });
  });
  s.addText('Decisión del autor: AVANZAR, revisando componentes y posibles reducciones de costo.', { x: 0.7, y: 6.1, w: 11.9, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: C.ink, margin: 0 });
}

// =====================================================================
// 15 CIERRE
// =====================================================================
{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BG };
  s.addText('La mecatrónica se aprende integrando.', { x: 0.7, y: 0.45, w: 11.93, h: 0.7, fontFace: F, fontSize: 30, bold: true, color: C.ink, align: 'center', margin: 0 });
  s.addText('Un mismo prototipo para conectar mecánica, electrónica, control y programación.', { x: 0.7, y: 1.2, w: 11.93, h: 0.45, fontFace: F, fontSize: 15, color: C.sub, align: 'center', margin: 0 });
  renderSlot(s, 4.2, 1.95, 4.95, 3.9, 'Cierre · modelo completo');
  const q = [
    [0.55, 2.1, C.M, C.Md, 'MECÁNICA', 'chasis · ruedas · odometría'],
    [0.55, 4.0, C.E, C.Ed, 'ELECTRÓNICA', 'sensores · corriente · potencia'],
    [9.4, 2.1, C.C, C.Cd, 'CONTROL', 'PID · trayectorias · línea'],
    [9.4, 4.0, C.P, C.Pd, 'PROGRAMACIÓN', 'ESP32 · Raspberry · web'],
  ];
  q.forEach(([x, y, c, d, t, b]) => {
    card(s, x, y, 3.4, 1.55, c);
    s.addText(t, { x, y: y + 0.2, w: 3.4, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: d, align: 'center', margin: 0 });
    s.addText(b, { x: x + 0.2, y: y + 0.75, w: 3.0, h: 0.5, fontFace: F, fontSize: 11, color: C.sub, align: 'center', margin: 0, valign: 'top' });
  });
  s.addText('¡Gracias!', { x: 0.7, y: 6.1, w: 11.93, h: 0.6, fontFace: F, fontSize: 24, bold: true, color: C.ink, align: 'center', margin: 0 });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText('Prototipo mecatrónico educativo · Ingeniería Mecatrónica', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0 });
  s.addText('15', { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0 });
}

const out = process.argv[2];
pres.writeFile({ fileName: out }).then(f => console.log('OK', f));
