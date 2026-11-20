const pptxgen = require('pptxgenjs');
const path = require('path');const fs = require('fs');
const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5
pres.title = 'Prototipo mecatrónico educativo';

const BG = path.join(__dirname, 'bg_glass.jpg');
const BGH = path.join(__dirname, 'bg_glass_hero.jpg');
const F = 'Inter';
const FT = 'Manrope';
const C = {
  ink: '0B1220', sub: '475569', mute: '64748B', line: 'FFFFFF', white: 'FFFFFF',
  M: '3B82F6', Md: '1D4ED8', E: 'F59E0B', Ed: 'B45309', C: '8B5CF6', Cd: '6D28D9', P: '10B981', Pd: '047857',
  red: 'B91C1C', gray: '64748B',
};
const AREAS = [['M', C.M], ['E', C.E], ['C', C.C], ['P', C.P]];
const AREA_NAME = { M: 'MECÁNICA', E: 'ELECTRÓNICA', C: 'CONTROL', P: 'PROGRAMACIÓN' };
let slideNo = 0;

// ---------- helpers ----------
function mix(hex, t) {
  const c = parseInt(hex, 16), r = (c >> 16) & 255, g = (c >> 8) & 255, b = c & 255;
  const m = (v) => Math.round(255 + (v - 255) * t);
  return [m(r), m(g), m(b)].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}
function glassShadow() {
  return { type: 'outer', color: '1E293B', opacity: 0.10, blur: 18, offset: 5, angle: 90 };
}

function base(title, sub, a3, a4) {
  const footer = Array.isArray(a3) ? a4 : a3;
  const s = pres.addSlide();
  slideNo += 1;
  s.background = { path: BG };
  s.addText(title, { x: 0.7, y: 0.26, w: 11.9, h: 0.74, fontFace: FT, fontSize: 30, bold: true, color: C.ink, margin: 0, valign: 'middle' });
  if (sub) s.addText(sub, { x: 0.7, y: 1.0, w: 11.9, h: 0.4, fontFace: F, fontSize: 14, color: C.sub, margin: 0, valign: 'top' });
  footerBar(s, footer || 'Plataforma robótica móvil para prácticas de mecatrónica');
  return s;
}

function footerBar(s, text) {
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: 'FFFFFF', width: 1, transparency: 20 } });
  s.addText(text, { x: 0.7, y: 7.03, w: 10, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0, valign: 'middle' });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 12.13, y: 7.04, w: 0.5, h: 0.26, rectRadius: 0.13, fill: { color: 'FFFFFF', transparency: 35 }, line: { color: 'FFFFFF', width: 0.75, transparency: 10 } });
  s.addText(String(slideNo).padStart(2, '0'), { x: 12.13, y: 7.04, w: 0.5, h: 0.26, fontFace: F, fontSize: 8.5, bold: true, color: C.sub, align: 'center', margin: 0, valign: 'middle' });
}

function techTable(s, rows, x, y, w, colW, rowH, fs) {
  const body = rows.map((r, i) => r.map((t, j) => i === 0
    ? { text: t, options: { bold: true, color: C.sub, fill: { color: 'EEF2F8', transparency: 8 }, fontSize: fs, fontFace: F } }
    : { text: t, options: { bold: j === 0, color: C.ink, fontSize: fs, fontFace: F, fill: { color: 'FFFFFF', transparency: i % 2 ? 22 : 38 } } }));
  s.addTable(body, { x, y, w, colW, rowH, border: { type: 'solid', pt: 1, color: 'FFFFFF' }, margin: [0.02, 0.1, 0.02, 0.1], valign: 'middle' });
}

function card(s, x, y, w, h, color, opts = {}) {
  const solid = !!opts.solid;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: opts.r ?? 0.2,
    fill: { color: solid ? 'FFFFFF' : mix(color, 0.16), transparency: solid ? 22 : 30 },
    line: { color: 'FFFFFF', width: opts.lw ?? 1.5, transparency: 12, dashType: opts.dash || 'solid' },
    shadow: glassShadow(),
  });
}

function zone(s, x, y, w, h, color, label) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.2, fill: { color: 'FFFFFF', transparency: 68 }, line: { color: 'FFFFFF', width: 1.25, transparency: 10 } });
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
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: ww, h: 0.24, rectRadius: 0.12, fill: { color: 'FFFFFF', transparency: 20 }, line: { color, width: 0.75, transparency: 35 } });
  s.addText(text, { x, y, w: ww, h: 0.24, fontFace: F, fontSize: 7.5, bold: true, color, align: 'center', valign: 'middle', margin: 0 });
  return ww;
}
const RENDER_DIR = 'D:/ProyectoFinal/renders';
function findRender(key) {
  if (!key) return null;
  for (const ext of ['png', 'jpg', 'jpeg', 'webp']) {
    const p = path.join(RENDER_DIR, key + '.' + ext);
    if (fs.existsSync(p)) return p;
  }
  return null;
}
function renderSlot(s, x, y, w, h, label, key) {
  const img = findRender(key);
  if (img) {
    s.addImage({ path: img, x, y, w, h, sizing: { type: 'contain', w, h } });
    return;
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.22, fill: { color: 'FFFFFF', transparency: 45 }, line: { color: 'FFFFFF', width: 1.5, transparency: 10 }, shadow: glassShadow() });
  s.addText([
    { text: 'RENDER 3D', options: { fontSize: 11, bold: true, color: C.gray, charSpacing: 3, breakLine: true } },
    { text: label, options: { fontSize: 10, color: C.sub, breakLine: true } },
    { text: key ? 'Archivo esperado: renders/' + key + '.png' : 'Render conceptual · diseño en desarrollo', options: { fontSize: 8, color: C.mute, italic: true } },
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

{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BGH };
  s.addText('IDEA DE PROYECTO · INGENIERÍA MECATRÓNICA', { x: 0.7, y: 1.35, w: 6.4, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: C.Md, charSpacing: 3, margin: 0 });
  s.addText('Aprender mecatrónica, sobre ruedas', { x: 0.7, y: 1.85, w: 6.3, h: 2.7, fontFace: FT, fontSize: 48, bold: true, color: C.ink, margin: 0, valign: 'top' });
  s.addText('Un robot móvil, programable y ampliable para aprender haciendo en distintas materias de la carrera.', { x: 0.7, y: 4.75, w: 5.9, h: 0.9, fontFace: F, fontSize: 16, color: C.sub, margin: 0, valign: 'top' });
  s.addText('Koba Chajchir', { x: 0.7, y: 5.95, w: 6, h: 0.3, fontFace: F, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  s.addText('Ingeniería Mecatrónica · FCAL – UNER', { x: 0.7, y: 6.27, w: 6.5, h: 0.3, fontFace: F, fontSize: 11, color: C.sub, margin: 0 });
  renderSlot(s, 7.2, 0.9, 5.7, 5.6, 'Portada · prototipo en vista 3/4', 'portada');
  footerBar(s, 'Prototipo mecatrónico educativo');
}

{
  const s = base('Qué problema resuelve', 'Y cuál es el objetivo del prototipo.');
  card(s, 0.7, 1.75, 5.3, 3.3, C.E);
  s.addText('HOY', { x: 0.95, y: 1.9, w: 4.8, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: C.Ed, charSpacing: 3, margin: 0 });
  s.addText('Pocas prácticas. Teoría y práctica separadas.', { x: 0.95, y: 2.35, w: 4.8, h: 2.5, fontFace: FT, fontSize: 30, bold: true, color: C.ink, margin: 0, valign: 'top' });
  card(s, 7.3, 1.75, 5.3, 3.3, C.P);
  s.addText('OBJETIVO', { x: 7.55, y: 1.9, w: 4.8, h: 0.3, fontFace: F, fontSize: 11, bold: true, color: C.Pd, charSpacing: 3, margin: 0 });
  s.addText('Un sistema mecatrónico para programar, medir y ampliar.', { x: 7.55, y: 2.35, w: 4.8, h: 2.5, fontFace: FT, fontSize: 30, bold: true, color: C.ink, margin: 0, valign: 'top' });
  wire(s, [[6.0, 3.4], [7.3, 3.4]], C.gray);
  const t = [['Para quién', 'Docentes y estudiantes'], ['Cómo llega', 'Se entrega a la carrera'], ['Meta', 'Junio de 2027']];
  t.forEach(([a, b], i) => {
    const x = 0.7 + i * 4.05;
    card(s, x, 5.4, 3.85, 1.2, C.M, { solid: true, border: 'E2E8F0', shadow: true });
    s.addText([{ text: a, options: { fontSize: 10, bold: true, color: C.Md, charSpacing: 2, breakLine: true } }, { text: b, options: { fontFace: FT, fontSize: 17, bold: true, color: C.ink } }], { x: x + 0.2, y: 5.4, w: 3.5, h: 1.2, fontFace: F, margin: 0, valign: 'middle' });
  });
}

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
    s.addText(n, { x: 8.5, y: y + 0.45, w: 0.65, h: 0.65, fontFace: FT, fontSize: 20, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 });
    s.addText([{ text: t, options: { fontFace: FT, fontSize: 17, bold: true, color: d, breakLine: true } }, { text: b, options: { fontSize: 12, color: C.sub } }], { x: 9.35, y, w: 3.2, h: 1.55, fontFace: F, margin: 0, valign: 'middle' });
  });
}

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
    s.addText(n, { x: x + 0.2, y: 1.75, w: 2.4, h: 0.8, fontFace: FT, fontSize: 38, bold: true, color: d, margin: 0, valign: 'middle' });
    s.addText(t, { x: x + 0.2, y: 2.55, w: 2.45, h: 0.45, fontFace: FT, fontSize: 19, bold: true, color: C.ink, margin: 0 });
    s.addText(b, { x: x + 0.2, y: 3.05, w: 2.45, h: 1.2, fontFace: F, fontSize: 12.5, color: C.sub, margin: 0, valign: 'top' });
  });
  renderSlot(s, 0.7, 4.65, 11.95, 2.1, 'Detalle · motores, sensores y controladores', 'funciones');
}

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
    s.addText(t, { x: x + 0.3, y: y + 0.35, w: 5.0, h: 0.8, fontFace: FT, fontSize: 30, bold: true, color: d, margin: 0, valign: 'middle' });
    s.addText(b, { x: x + 0.3, y: y + 1.2, w: 5.0, h: 0.8, fontFace: F, fontSize: 15, color: C.ink, margin: 0, valign: 'top' });
    chip(s, 'EN ESTUDIO', x + 5.85 - 0.25 - 1.1, y + 0.2, C.gray, 1.1);
  });
}

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

{
  const s = base('Alcance', 'Qué incluye el prototipo y qué queda abierto.');
  card(s, 0.7, 1.65, 6.4, 4.95, C.P);
  s.addText('Incluye', { x: 1.0, y: 1.8, w: 5.8, h: 0.5, fontFace: FT, fontSize: 22, bold: true, color: C.Pd, margin: 0 });
  s.addText(bullets(['Tracción con control de velocidad', 'Sensado de corriente en los motores', 'Seguimiento de línea', 'LiDAR 3D y cámara', 'Comunicación e interfaz web', 'Pantalla táctil de operación'], 19), { x: 1.0, y: 2.45, w: 5.9, h: 3.9, fontFace: F, margin: 0, valign: 'top', paraSpaceAfter: 12 });
  card(s, 7.35, 1.65, 5.3, 4.95, C.gray);
  s.addText('Queda abierto', { x: 7.65, y: 1.8, w: 4.8, h: 0.5, fontFace: FT, fontSize: 22, bold: true, color: C.gray, margin: 0 });
  s.addText(bullets(['IMU opcional', 'IA opcional para detectar objetos', 'Accesorios o brazo en la zona de montaje', 'Enlace Pi–ESP32 y pantalla por definir'], 19), { x: 7.65, y: 2.45, w: 4.8, h: 3.9, fontFace: F, margin: 0, valign: 'top', paraSpaceAfter: 12 });
}

{
  const s = base('Pantalla táctil de operación', 'Waveshare ESP32-P4 de 5″: el panel desde donde se maneja y se ve el robot.');
  s.addImage({ path: 'D:/ProyectoFinal/renders/11_detalle_pantalla_control_manual.png', x: 0.7, y: 1.6, w: 6.6, h: 5.13 });
  s.addText('Composición: render del CAD con la interfaz simulada en la pantalla', { x: 0.7, y: 6.72, w: 6.6, h: 0.22, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.65, y: 1.6, w: 4.95, h: 2.79, rectRadius: 0.1, fill: { color: '0B1220' }, line: { color: C.line, width: 0.75 } });
  s.addImage({ path: 'D:/ProyectoFinal/renders/12_ui_control_manual_nuestro_auto.png', x: 7.65, y: 1.6, w: 4.95, h: 2.79 });
  s.addText('Control manual táctil (interfaz de referencia, simulada)', { x: 7.65, y: 4.42, w: 4.95, h: 0.25, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0 });
  card(s, 7.65, 4.8, 4.95, 1.95, C.C);
  s.addText(bullets(['Multitáctil capacitivo de 5 puntos', '720 × 1280 en vertical; en horizontal con una configuración por software', 'Muestra la interfaz web del robot: control, sensores y alertas', 'Enlace con la Pi o el ESP32: por definir'], 11), { x: 7.85, y: 4.9, w: 4.6, h: 1.75, fontFace: F, margin: 0, valign: 'middle', paraSpaceAfter: 4 });
}


﻿
{
  const UI = (f) => path.join(__dirname, '..', 'ui', f);
  const s = base('Interfaz web: la misma app en todos lados', 'Se diseña una sola vez y se usa en la pantalla del robot y desde cualquier dispositivo con Wi‑Fi, sin instalar nada.', ['C', 'P'], 'Sistemas Mecatrónicos · Sistemas Operativos y Redes · Computación II');
  // robot screen / notebook
  const iw = 6.78, ih = iw * 1440 / 2560;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.6, w: iw + 0.12, h: ih + 0.12, rectRadius: 0.14, fill: { color: '0B1220' }, line: { color: 'FFFFFF', width: 1.25, transparency: 10 }, shadow: glassShadow() });
  s.addImage({ path: UI('ui_panel.png'), x: 0.76, y: 1.66, w: iw, h: ih });
  // phone
  const ph = 4.28, pw = ph * 1170 / 2532;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.85, y: 1.6, w: pw + 0.14, h: ph + 0.14, rectRadius: 0.28, fill: { color: '0B1220' }, line: { color: 'FFFFFF', width: 1.25, transparency: 10 }, shadow: glassShadow() });
  s.addImage({ path: UI('ui_celular.png'), x: 7.92, y: 1.67, w: pw, h: ph, rounding: false });
  // device chips under the screen
  let cx = 0.7;
  [['Pantalla del robot · 5″', C.Ed], ['Celular', C.Pd], ['Tablet', C.Md], ['Notebook', C.Cd]].forEach(([t, c]) => { cx += chip(s, t, cx, 5.72, c, 0.25 + t.length * 0.072) + 0.12; });
  s.addText('Maqueta de diseño con datos simulados. La misma app se adapta al tamaño de cada pantalla.', { x: 0.7, y: 6.1, w: 6.9, h: 0.3, fontFace: F, fontSize: 9.5, italic: true, color: C.sub, margin: 0 });
  // feature cards
  const feats = [
    [C.M, C.Md, 'Control manual', 'Joystick táctil y modos: manual, seguir línea, mapeo.'],
    [C.E, C.Ed, 'Telemetría en vivo', 'Velocidad, corriente por motor, batería y sensor de línea.'],
    [C.P, C.Pd, 'Cámara y mapa', 'Video de la C270 y planta del LiDAR en la misma vista.'],
    [C.C, C.Cd, 'Parada y alertas', 'STOP siempre visible y avisos de bloqueo o batería baja.'],
  ];
  feats.forEach(([c, d, t, b], i) => {
    const y = 1.6 + i * 1.2;
    card(s, 10.25, y, 2.4, 1.08, c);
    s.addText([{ text: t, options: { fontFace: FT, fontSize: 13, bold: true, color: d, breakLine: true } }, { text: b, options: { fontSize: 9.5, color: C.ink } }], { x: 10.4, y, w: 2.12, h: 1.08, fontFace: F, margin: 0, valign: 'middle' });
  });
  s.addText('Propuesta de diseño: falta programarla y probarla con usuarios.', { x: 10.25, y: 6.42, w: 2.4, h: 0.4, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0, valign: 'top' });
}

{
  const s = base('Cómo llega la interfaz a cada dispositivo', 'Un servidor en la Raspberry Pi 5; cada pantalla es solo un navegador. Esquema propuesto, a validar.', ['E', 'C', 'P'], 'Sistemas Operativos y Redes · Sistemas Embebidos · Computación II');
  zone(s, 0.7, 1.55, 5.05, 3.15, C.Md, 'EN EL ROBOT');
  partCard(s, 0.9, 1.95, 2.5, 1.15, C.P, C.Pd, 'SERVIDOR WEB', 'Raspberry Pi 5', 'Sirve la app · HTTP + WebSocket', 'cámara, mapa y telemetría', 'INCLUIDO');
  partCard(s, 0.9, 3.35, 2.5, 1.15, C.C, C.Cd, 'TIEMPO REAL', 'ESP32 DevKit V1', 'Recibe consignas, devuelve datos', 'enlace por definir', 'POR DEFINIR');
  partCard(s, 3.65, 1.95, 1.9, 1.15, C.E, C.Ed, 'PANTALLA 5″', 'Waveshare ESP32-P4', 'Abre la misma app', 'cómo: por definir', 'POR DEFINIR');
  wire(s, [[2.15, 3.1], [2.15, 3.35]], C.gray, true);
  wire(s, [[3.4, 2.52], [3.65, 2.52]], C.Pd);
  s.addText('La pantalla puede abrir la app en un navegador o usar una versión nativa (LVGL) que consulta la misma API.', { x: 3.65, y: 3.3, w: 1.95, h: 1.2, fontFace: F, fontSize: 8.5, color: C.sub, margin: 0, valign: 'top' });

  // Wi-Fi hub
  card(s, 6.1, 2.25, 1.6, 1.75, C.M, { solid: true });
  s.addText([{ text: 'Wi‑Fi', options: { fontFace: FT, fontSize: 22, bold: true, color: C.Md, breakLine: true } }, { text: 'Punto de acceso del robot o red del aula', options: { fontSize: 9, color: C.sub } }], { x: 6.2, y: 2.25, w: 1.4, h: 1.75, fontFace: F, align: 'center', valign: 'middle', margin: 0 });
  hwire(s, 5.75, 6.1, 3.12, C.Md, '', '');
  hwire(s, 7.7, 8.05, 3.12, C.Md, '', '');

  zone(s, 8.05, 1.55, 4.6, 3.15, C.Pd, 'CUALQUIER DISPOSITIVO CON WI‑FI');
  [['Celular', 'Abre la dirección del robot en el navegador'], ['Tablet', 'Misma app, diseño adaptado a la pantalla'], ['Notebook', 'Vista completa: cámara, mapa y datos']].forEach(([t, b], i) => {
    partCard(s, 8.25, 1.95 + i * 0.9, 4.2, 0.78, C.P, C.Pd, 'CLIENTE', t, b);
  });

  block(s, 0.7, 5.0, 3.85, 1.6, C.C, C.Cd, 'Seguridad', bullets(['Acceso con contraseña', 'Un solo dispositivo maneja; el resto mira', 'Si se corta el Wi‑Fi, el robot frena solo'], 10.5));
  block(s, 4.75, 5.0, 3.85, 1.6, C.P, C.Pd, 'En clase', bullets(['Cada estudiante ve los datos en su celular', 'Descarga de mediciones (CSV) para analizar', 'Sin instalar programas en las PC'], 10.5));
  block(s, 8.8, 5.0, 3.85, 1.6, C.E, C.Ed, 'Por definir', bullets(['Punto de acceso propio o red de la facultad', 'Navegador o versión nativa en la pantalla', 'Latencia del video por Wi‑Fi: medir'], 10.5));
}


{
  const s = base('Sensores y control: cómo se conecta todo', 'Cada sensor llega por cable al controlador que lo necesita.', ['M', 'E', 'C', 'P'], 'Sistemas Mecatrónicos · Microcontroladores · Sistemas de Control · Robótica II');
  // zones
  zone(s, 0.3, 1.5, 2.72, 5.15, C.Ed, 'SENSORES');
  zone(s, 4.35, 1.5, 4.3, 5.15, C.gray, 'CONTROLADORES');
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
    { text: 'Raspberry Pi 5 · 4 GB', options: { fontFace: FT, fontSize: 18, bold: true, color: C.ink, breakLine: true, paraSpaceAfter: 4 } },
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
    { text: 'ESP32 DevKit V1', options: { fontSize: 14, bold: true, color: C.ink, breakLine: true } },
    { text: 'ESP-WROOM-32 · 240 MHz · Wi-Fi + BT', options: { fontSize: 9, color: C.sub, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'PID de velocidad por rueda con encoders (PCNT)', options: { bullet: { indent: 11 }, fontSize: 8.5, color: C.ink, breakLine: true } },
    { text: 'Lee línea, corriente (ADC1) e IMU opcional', options: { bullet: { indent: 11 }, fontSize: 8.5, color: C.ink, breakLine: true } },
    { text: 'Lógica de 3,3 V', options: { bullet: { indent: 11 }, fontSize: 8.5, color: C.ink, breakLine: true, paraSpaceAfter: 3 } },
    { text: 'COMPRAR', options: { fontSize: 7, bold: true, color: C.Md } },
    { text: '  ARS 20.470 · Starware', options: { fontSize: 7, color: C.mute } },
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
  lab(s, 'ADC1 · GPIO32–39', 2.9, cc(4) + 0.06, vx[2] - 2.95, C.sub);
  hwire(s, 2.85, 4.5, cc(5), WIRE.tbd, 'bus por definir', 'opcional', true);

  // Pi <-> ESP link (two vertical dashed wires)
  wire(s, [[5.75, 4.05], [5.75, 4.7]], WIRE.tbd, true);
  wire(s, [[6.35, 4.05], [6.35, 4.7]], WIRE.tbd, true);
  s.addText([{ text: 'Consignas Pi → ESP', options: { bold: true, color: C.gray, breakLine: true } }, { text: 'enlace por definir', options: { color: C.sub } }], { x: 4.5, y: 4.1, w: 1.15, h: 0.55, fontFace: F, fontSize: 6.5, align: 'right', margin: 0, valign: 'middle' });
  s.addText([{ text: 'Telemetría ESP → Pi', options: { bold: true, color: C.gray, breakLine: true } }, { text: 'UART, USB o Wi-Fi: por definir', options: { color: C.sub } }], { x: 6.45, y: 4.1, w: 1.9, h: 0.55, fontFace: F, fontSize: 6.5, align: 'left', margin: 0, valign: 'middle' });

  // right: PC
  partCard(s, 9.95, 1.9, 2.9, 0.8, C.gray, C.gray, 'COMPUTADORA EXTERNA', 'Interfaz web', 'Visualiza y procesa lecturas y mapa', 'la usa el estudiante', 'POR DEFINIR');
  hwire(s, 8.5, 9.95, 2.3, WIRE.tbd, 'Wi-Fi / Ethernet', 'enlace por definir', true);
  partCard(s, 9.95, 3.2, 2.9, 0.8, C.C, C.Cd, 'PANTALLA · HMI', 'Waveshare ESP32-P4 · 5″ táctil', 'Panel de operación del robot', '· ARS 145.200 · Mercado Libre', 'COMPRAR');
  wire(s, [[8.5, 3.6], [9.95, 3.6]], WIRE.tbd, true);
  lab(s, 'por definir', 8.55, 3.35, 1.35, WIRE.tbd, 'center', true);
  lab(s, 'UART, USB o Wi-Fi', 8.55, 3.66, 1.35, C.sub);
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
  [['+', 4.4], ['=', 8.55]].forEach(([t, x]) => s.addText(t, { x, y: py + ph / 2 - 0.3, w: 0.45, h: 0.6, fontFace: FT, fontSize: 30, bold: true, color: C.gray, align: 'center', valign: 'middle', margin: 0 }));
  techTable(s, [
    ['Sensor', 'Ubicación', 'Orientación', 'Campo'],
    ['LiDAR L1 PM', 'Eje en X ≈ 102 mm, Y = 0, sobre la lente', 'Eje inclinado ≈ 45° hacia adelante (propuesta)', '360° × 90°'],
    ['Logitech C270', 'Misma X e Y. Lente a 115,5 mm del suelo', 'Horizontal, hacia el frente', '55° diag. ≈ 28,6° vert.'],
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
    s.addText(n, { x: x + 0.2, y: 2.1, w: 0.6, h: 0.6, fontFace: FT, fontSize: 19, bold: true, color: C.white, align: 'center', valign: 'middle', margin: 0 });
    s.addText(t, { x: x + 0.2, y: 2.85, w: w - 0.35, h: 0.7, fontFace: FT, fontSize: 16, bold: true, color: d, margin: 0, valign: 'top' });
    s.addText(b, { x: x + 0.2, y: 3.6, w: w - 0.35, h: 1.2, fontFace: F, fontSize: 11.5, color: C.ink, margin: 0, valign: 'top' });
    if (i < 4) wire(s, [[x + w, 3.4], [x + 2.42, 3.4]], C.gray);
  });
  s.addText('Pendiente de verificar', { x: 0.7, y: 5.2, w: 6, h: 0.3, fontFace: F, fontSize: 12, bold: true, color: C.sub, charSpacing: 1.5, margin: 0 });
  ['Disponibilidad de componentes', 'Diseño definitivo', 'Aprobación institucional', 'Utilidad educativa'].forEach((t, i) => {
    card(s, 0.7 + i * 3.02, 5.6, 2.85, 0.85, C.gray, { solid: true, border: C.gray });
    s.addText(t, { x: 0.7 + i * 3.02, y: 5.6, w: 2.85, h: 0.85, fontFace: F, fontSize: 12.5, bold: true, color: C.ink, align: 'center', valign: 'middle', margin: 4 });
  });
}

{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BGH };
  s.addText('Integrar teoría y práctica con un solo sistema', { x: 0.7, y: 0.45, w: 11.93, h: 0.8, fontFace: FT, fontSize: 32, bold: true, color: C.ink, align: 'center', margin: 0 });
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
    s.addText(big, { x, y: y + 0.15, w: 3.4, h: 0.85, fontFace: FT, fontSize: 34, bold: true, color: d, align: 'center', valign: 'middle', margin: 0 });
    s.addText(cap, { x: x + 0.15, y: y + 1.0, w: 3.1, h: 0.7, fontFace: F, fontSize: 10.5, color: C.sub, align: 'center', valign: 'top', margin: 0 });
  });
  footerBar(s, 'Prototipo mecatrónico educativo');
}

{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BGH };
  s.addText('Anexo técnico', { x: 0.7, y: 2.2, w: 11.93, h: 1.1, fontFace: FT, fontSize: 48, bold: true, color: C.ink, align: 'center', margin: 0 });
  s.addText('Cotas, sensores, especificaciones, cálculos, alimentación, compras y decisiones abiertas.', { x: 1.5, y: 3.4, w: 10.3, h: 0.9, fontFace: F, fontSize: 18, color: C.sub, align: 'center', margin: 0, valign: 'top' });
  footerBar(s, 'Prototipo mecatrónico educativo');
}


{
  const s = base('Contexto, objetivo y requisitos', 'Qué problema se busca atender y cómo se va a saber si el prototipo sirve.');
  block(s, 0.7, 1.65, 4.2, 2.35, C.M, C.Md, 'Observación', 'Pocas actividades prácticas de robótica y mecatrónica. Teoría y práctica separadas, con poca interacción entre las ramas.\n\nApreciación del autor como estudiante. Sin medir.', 11);
  block(s, 0.7, 4.15, 4.2, 2.55, C.P, C.Pd, 'Objetivo', 'Una plataforma mecatrónica programable y ampliable, entregada a la carrera, que sirva para ensayos en varias materias.\n\nPrevista para junio de 2027 (meta, no plazo confirmado).', 11);
  s.addText('Requisitos propuestos y cómo verificarlos', { x: 5.2, y: 1.65, w: 7.4, h: 0.35, fontFace: F, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  techTable(s, [
    ['Requisito', 'Criterio de verificación', 'Estado'],
    ['Uso simple e intuitivo', 'Prueba de uso con docentes y estudiantes', 'Por definir'],
    ['Mediciones y lecturas correctas', 'Comparación contra una referencia medida', 'Por definir'],
    ['Odometría eficaz', 'Error de pose tras una trayectoria de prueba', 'Por definir'],
    ['Ampliable', 'Zona de montaje de 64 × 60 mm y expansión de E/S', 'En diseño'],
    ['Código abierto y buenas prácticas', 'Repositorio documentado y reproducible', 'Por definir'],
    ['Interés real de los usuarios', 'Encuesta a estudiantes y consulta a docentes', 'Pendiente'],
  ], 5.2, 2.05, 7.45, [2.55, 3.65, 1.25], 0.52, 10);
}

{
  const s = base('Alcance funcional mínimo', 'Funciones con las que el prototipo podría empezar a usarse en una materia.');
  techTable(s, [
    ['Función', 'Implementación prevista', 'Estado'],
    ['Tracción diferencial', '2 × Pololu #4756 (12 V, 76 rpm, con encoder) + driver Cytron MDD10A de 10 A', 'Preferido'],
    ['Lazo de velocidad', 'PID por rueda con realimentación de encoder, en el ESP32', 'Por implementar'],
    ['Sensado de corriente', '2 × Pololu #5240 (ACS71240, ±10 A, 3,3 V), uno por motor, leídos por ADC1 del ESP32 (GPIO32–39)', 'Preferido · pines por definir'],
    ['Odometría', 'Encoders + radio efectivo y separación entre ruedas', 'Por implementar'],
    ['Seguimiento de línea', 'OSOYOO IR de 5 canales, 5 entradas digitales', 'Base'],
    ['Percepción 3D', 'Unitree 4D LiDAR L1 PM por UART TTL hacia la Raspberry Pi 5', 'Elegido'],
    ['Visión', 'Logitech C270, USB, 720p, conectada a la Raspberry Pi', 'Preferida'],
    ['Interfaz local', 'Pantalla táctil de 5″ Waveshare ESP32-P4', 'Preferida · enlace por definir'],
    ['Comunicación', 'Enlace Pi ↔ ESP y Pi → PC externa, con interfaz web', 'Por definir'],
  ], 0.7, 1.65, 11.95, [2.4, 7.2, 2.35], 0.5, 10.5);
  s.addText('Alcance, rendimiento y funcionamiento de cada función quedan por comprobar durante el desarrollo.', { x: 0.7, y: 6.7, w: 11.9, h: 0.25, fontFace: F, fontSize: 10, italic: true, color: C.sub, margin: 0 });
}

{
  const s = base('Plataforma mecánica: cotas iniciales', 'Referencias para el primer CAD. No son un diseño mecánico definitivo.', 'Mecanismos y Elementos de Máquinas · Tecnología Industrial · Sistemas de Representación');
  renderSlot(s, 0.7, 1.65, 5.2, 5.0, 'Chasis · vista 3/4 con cotas', 'chasis');
  techTable(s, [
    ['Elemento', 'Cota o dato'],
    ['Envolvente (L × A × H)', '≈ 340 × 218 × 214 mm, con pantalla, bujes y LiDAR'],
    ['Placa inferior', '300 × 180 × 3 mm, chapón de acero, esquinas R8'],
    ['Placa superior', '258 × 154 × 3 mm, chapón de acero, esquinas R8'],
    ['Altura libre entre placas', '55 mm'],
    ['Pilares', '6 × Ø12 × 55 mm, 130 mm entre filas, 96 mm entre vecinos, paso Ø5,5 (M5)'],
    ['Despeje de la placa inferior', '85 mm al suelo'],
    ['Ruedas motrices', 'Ø85 × 16 mm, eje a 42,5 mm del suelo'],
    ['Rueda loca', 'Nylon (Grilon) Ø50 mm, eje de aluminio, a ≈ 237 mm del eje motriz'],
    ['Sensor de línea', 'Cara activa regulable de 5 a 20 mm (recorrido 15 mm)'],
    ['Batería', '151 × 65 × 97,5 mm, ≈ 2,2 kg, a 14 mm del suelo'],
    ['Montaje central', '4 ranuras de 24 × 5,5 mm en 64 × 60 mm y 2 arcos de R106 mm / 30°'],
  ], 6.15, 1.65, 6.5, [2.3, 4.2], 0.41, 9.5);
}

{
  const s = base('Cinemática y odometría', 'Modelo diferencial. Los parámetros marcados se miden en el prototipo.', 'Robótica I y II · Mecánica Racional · Sistemas de Control');
  card(s, 0.7, 1.65, 6.2, 2.25, C.M);
  s.addText('Cinemática del chasis', { x: 0.9, y: 1.72, w: 5.8, h: 0.35, fontFace: F, fontSize: 13, bold: true, color: C.Md, margin: 0 });
  s.addText([
    { text: 'v = (vR + vL) / 2', options: { breakLine: true } },
    { text: 'ω = (vR − vL) / b', options: { breakLine: true } },
    { text: 'vi = ωi · r      (i = L, R)', options: { breakLine: true } },
    { text: 'b: separación entre ruedas · r: radio efectivo', options: { fontSize: 9.5, color: C.sub, fontFace: F } },
  ], { x: 0.9, y: 2.1, w: 5.8, h: 1.7, fontFace: 'Consolas', fontSize: 13, color: C.ink, margin: 0, valign: 'top', paraSpaceAfter: 4 });
  card(s, 0.7, 4.05, 6.2, 2.6, C.C);
  s.addText('Odometría con encoders', { x: 0.9, y: 4.12, w: 5.8, h: 0.35, fontFace: F, fontSize: 13, bold: true, color: C.Cd, margin: 0 });
  s.addText([
    { text: 'Δsi = 2π · r · Ni / (CPR · n)', options: { breakLine: true } },
    { text: 'Δs = (ΔsR + ΔsL) / 2', options: { breakLine: true } },
    { text: 'Δθ = (ΔsR − ΔsL) / b', options: { breakLine: true } },
    { text: 'x ← x + Δs · cos(θ + Δθ/2)', options: { breakLine: true } },
    { text: 'y ← y + Δs · sin(θ + Δθ/2)', options: { breakLine: true } },
    { text: 'θ ← θ + Δθ', options: { breakLine: true } },
    { text: 'Ni: cuentas del encoder · CPR: cuentas por vuelta · n: reducción', options: { fontSize: 9.5, color: C.sub, fontFace: F } },
  ], { x: 0.9, y: 4.5, w: 5.8, h: 2.1, fontFace: 'Consolas', fontSize: 12, color: C.ink, margin: 0, valign: 'top', paraSpaceAfter: 2 });
  s.addText('Parámetros del modelo', { x: 7.2, y: 1.65, w: 5.4, h: 0.35, fontFace: F, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  techTable(s, [
    ['Parámetro', 'Valor', 'Estado'],
    ['r (radio de rueda)', '42,5 mm nominal (Ø85)', 'Medir con rueda real'],
    ['b (separación)', 'A tomar del CAD', 'Por medir'],
    ['CPR y reducción', 'Del motor Pololu #4756', 'Por confirmar'],
    ['Lazo de velocidad', 'PID por rueda', 'Punto de partida'],
    ['Línea → giro', '5 sensores → posición respecto del centro', 'Por implementar'],
    ['Carga vs. bloqueo', 'Corriente + velocidad del encoder', 'Por implementar'],
  ], 7.2, 2.05, 5.45, [1.75, 2.35, 1.35], 0.5, 9.5);
  s.addText('Giro por diferencia de velocidad. Con tres apoyos (dos motrices y una loca) el deslizamiento de la rueda loca queda sin modelar.', { x: 7.2, y: 5.75, w: 5.4, h: 0.9, fontFace: F, fontSize: 10, italic: true, color: C.sub, margin: 0, valign: 'top' });
}

{
  const s = base('Sensado: señales, interfaces y datos técnicos', 'Qué mide cada sensor, cómo se conecta y a qué controlador llega.', 'Sistemas Mecatrónicos · Microcontroladores · Electrónica Básica');
  techTable(s, [
    ['Sensor', 'Magnitud', 'Interfaz', 'Destino', 'Dato técnico'],
    ['Unitree 4D LiDAR L1 PM', 'Nube de puntos 3D + IMU', 'UART TTL (USB–UART)', 'Pi 5', 'Alimentación 12 V. 21.600 puntos/s. Campo 360° × 90°. Zona ciega de 0,05 m'],
    ['Logitech C270', 'Video', 'USB', 'Pi 5', '720p. 55° diagonal ≈ 28,6° vertical. Lente a 115,5 mm del suelo'],
    ['OSOYOO IR 5 canales', 'Posición de la línea', '5 entradas digitales', 'ESP32', 'PCB de 81 × 27,4 mm. Cara activa a 5–20 mm del suelo'],
    ['Encoders del Pololu #4756', 'Velocidad y giro', 'Señales A/B por motor', 'ESP32', 'Resolución por confirmar. Realimentan el PID y la odometría'],
    ['Pololu #5240 (ACS71240)', 'Corriente del motor', 'Analógica 3,3 V', 'ADC1 del ESP32', '±10 A bidireccional. Bloqueo ≈ 5,5 A a 12 V. Compensar cero y filtrar PWM'],
    ['SparkFun BNO086 (opcional)', 'Orientación', 'I²C (Qwiic)', 'Por definir', 'Evaluar antes la IMU del LiDAR'],
  ], 0.7, 1.65, 11.95, [2.55, 2.05, 2.1, 1.35, 3.9], 0.68, 10);
  s.addText('Los GPIO21/22 que figuraban como candidatos eran del ESP32-P4. En el ESP32 clásico no son ADC: la corriente va a ADC1 (GPIO32–39), porque ADC2 no se puede usar con Wi-Fi.', { x: 0.7, y: 6.6, w: 11.9, h: 0.3, fontFace: F, fontSize: 10, italic: true, color: C.sub, margin: 0 });
}


{
  const s = base('Especificaciones de los componentes principales', 'Controlador de tracción, computadora de a bordo y LiDAR 3D.', 'Microcontroladores · Sistemas Embebidos · Sistemas Mecatrónicos');
  const col = (x, w, color, dark, title, sub, rows, src) => {
    card(s, x, 1.6, w, 5.15, color);
    s.addText(title, { x: x + 0.15, y: 1.68, w: w - 0.3, h: 0.35, fontFace: F, fontSize: 13.5, bold: true, color: dark, margin: 0 });
    s.addText(sub, { x: x + 0.15, y: 2.02, w: w - 0.3, h: 0.3, fontFace: F, fontSize: 9, color: C.sub, margin: 0 });
    techTable(s, [['Parámetro', 'Valor'], ...rows], x + 0.12, 2.4, w - 0.24, [1.25, w - 0.24 - 1.25], 0.34, 8.5);
    s.addText(src, { x: x + 0.15, y: 6.4, w: w - 0.3, h: 0.3, fontFace: F, fontSize: 7.5, italic: true, color: C.mute, margin: 0 });
  };
  col(0.7, 3.9, C.C, C.Cd, 'ESP32 DevKit V1', 'Controlador de tracción (ESP-WROOM-32) · ARS 20.470', [
    ['CPU', 'Xtensa LX6 de 2 núcleos, hasta 240 MHz'],
    ['Memoria', '520 KB de SRAM; flash de 4 MB típica'],
    ['Conectividad', 'Wi-Fi 802.11 b/g/n 2,4 GHz y Bluetooth 4.2 + BLE'],
    ['Lógica', '3,3 V (no tolera 5 V en los pines)'],
    ['ADC', '12 bits. ADC1: GPIO32–39. ADC2 no sirve con Wi-Fi'],
    ['Periféricos', '3 UART, 2 I²C, 3 SPI, PWM LEDC y contador de pulsos (PCNT)'],
    ['Alimentación', '5 V por USB o VIN'],
  ], 'Datasheet Espressif ESP32-WROOM-32. Los pines varían según el fabricante de la placa.');
  col(4.72, 3.9, C.P, C.Pd, 'Raspberry Pi 5 · 4 GB', 'Computadora de a bordo · ARS 325.280', [
    ['SoC', 'Broadcom BCM2712, 4 núcleos Cortex-A76 a 2,4 GHz'],
    ['Memoria', '4 GB LPDDR4X'],
    ['Red', 'Gigabit Ethernet, Wi-Fi 5 de doble banda, Bluetooth 5.0'],
    ['USB', '2 × USB 3.0 y 2 × USB 2.0'],
    ['E/S', 'GPIO de 40 pines (UART, I²C, SPI)'],
    ['Alimentación', '5 V / 5 A por USB-C PD'],
    ['Almacenamiento', 'microSD (a cargo del taller)'],
  ], 'Especificaciones generales de la Raspberry Pi 5.');
  col(8.74, 3.9, C.E, C.Ed, 'Unitree 4D LiDAR L1 PM', 'Sensor 3D con IMU · USD 249', [
    ['Campo de visión', '360° horizontal × 90° vertical'],
    ['Frecuencia', '21.600 puntos/s'],
    ['Alcance', '0,05 m (zona ciega) a 20 m con 90 % de reflectividad'],
    ['Interfaz', 'UART TTL, vía adaptador USB–UART'],
    ['Alimentación', '12 V regulados'],
    ['Masa y tamaño', '≈ 230 g · 75 × 75 × 65 mm'],
    ['Datos', 'Nube de puntos + IMU'],
  ], 'Fichas de Unitree y revendedores. El alcance de la PM se verifica con el fabricante.');
}

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
    ['Ubicación', 'Placa superior, adelante. Eje en X ≈ 102 mm, Y = 0'],
    ['Orientación', 'Eje inclinado ≈ 45° hacia adelante (propuesta, a verificar en el CAD)'],
    ['Campo y frecuencia', '360° × 90° · 21.600 puntos/s · zona ciega de 0,05 m'],
    ['Datos', 'Nube de puntos + IMU por UART TTL hacia la Pi'],
  ], 8.0, 4.3, 4.65, [1.35, 3.3], 0.46, 9);
}

{
  const s = base('Reparto de tareas entre controladores', 'Qué hace cada procesador y qué interfaces siguen abiertas.', 'Sistemas Embebidos · Sistemas Operativos y Redes · Computación II');
  const w = 3.9;
  block(s, 0.7, 1.6, w, 2.95, C.C, C.Cd, 'ESP32 DevKit V1 · tiempo real', '• Lazo PID de velocidad por rueda\n• Conteo de encoders (PCNT)\n• ADC1: corriente de ambos motores, con cero compensado y filtro del PWM\n• Lectura del sensor de línea y corrección de giro\n• PWM y dirección hacia el Cytron MDD10A', 12.5);
  block(s, 4.72, 1.6, w, 2.95, C.P, C.Pd, 'Raspberry Pi 5 · datos', '• Adquisición del LiDAR por UART y de la cámara por USB\n• Mapeo 3D y procesamiento\n• Servidor de la interfaz web (HTTP + WebSocket)\n• Consignas hacia el ESP32 y telemetría de vuelta\n• IA opcional (detección) como ampliación\n• Refrigeración y microSD a cargo del taller', 12.5);
  block(s, 8.74, 1.6, w, 2.95, C.gray, C.gray, 'Computadora externa', '• Interfaz web desde el navegador, por Wi‑Fi\n• Procesamiento pesado\n• Reparto de cálculo entre la Pi y la PC: por definir\n• Formato de los datos: por definir', 12.5);
  s.addText('Interfaces abiertas', { x: 0.7, y: 4.7, w: 6, h: 0.3, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0 });
  techTable(s, [
    ['Enlace', 'Opciones', 'Estado'],
    ['Pi ↔ ESP32', 'UART, USB o Wi-Fi. Protocolo de consignas y telemetría', 'Por definir'],
    ['Pi → PC externa', 'Wi-Fi o Ethernet. Formato de datos', 'Por definir'],
    ['Interfaz web', 'Wi‑Fi: punto de acceso del robot o red del aula. HTTP + WebSocket', 'Propuesta'],
    ['IMU opcional', 'I²C (Qwiic) a la Pi o al ESP32', 'Por definir'],
    ['Pantalla Waveshare', 'Enlace con la Pi o el DevKit: UART, USB o Wi-Fi', 'Por definir'],
  ], 0.7, 5.03, 11.95, [2.4, 7.5, 2.05], 0.3, 9.5);
}

{
  const s = base('Alimentación y potencia', 'Distribución desde la batería de 12 V hacia cada regulador y carga.', ['E', 'M'], 'Electrónica de Potencia · Electrónica Básica · Sistemas Mecatrónicos');
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
  partCard(s, 4.3, 5.55, 3.0, 0.7, C.P, C.Pd, 'RAMA DE 5 V', 'Alimentación de DevKit y pantalla', 'Rama de 5 V a cargo del taller', 'por definir', 'TALLER');
  // loads
  const loads = [
    ['MOVIMIENTO', '2 × Pololu #4756', 'Motores con encoder, uno por rueda', C.M, C.Md, 'Motor A y B', 'pasa por el sensor de corriente'],
    ['CÓMPUTO', 'Raspberry Pi 5', 'Cerebro de datos', C.P, C.Pd, '5 V / 5 A', 'cable USB-C PD de 5 A'],
    ['SENSOR 3D', 'Unitree L1 PM', 'Mapeo 3D con IMU', C.E, C.Ed, '12 V', 'regulados'],
    ['CONTROL Y PANTALLA', 'ESP32 DevKit + Waveshare', 'DevKit por VIN; pantalla por USB-C', C.C, C.Cd, '5 V', 'por VIN y USB-C'],
  ];
  loads.forEach(([tag, t, sub, c, d, l1, l2], i) => {
    const y = [1.95, 3.15, 4.35, 5.55][i];
    partCard(s, 9.95, y, 2.9, 0.7, c, d, tag, t, sub, null, null);
    hwire(s, 7.3, 9.95, y + 0.35, WIRE.pot, l1, l2, i === 3);
  });
  s.addText('Motor: bloqueo ≈ 5,5 A a 12 V (extrapolado). Cytron: 10 A por canal. Yahboom: 5 V / 5 A, entrada de 7 a 24 V. Pololu #4984: 12 V, hasta 2,5 A típicos. Consumos reales sin medir.', { x: 0.7, y: 6.7, w: 11.9, h: 0.22, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0 });
}


{
  const s = base('Aplicación por materia', 'Ensayos propuestos y señales del prototipo que usarían. Falta contrastarlos con los docentes.', 'Microcontroladores · Robótica II · Sistemas de Control · Mecanismos · Tecnología Industrial');
  techTable(s, [
    ['Materia', 'Ensayo o tema', 'Señales y recursos del prototipo'],
    ['Microcontroladores', 'Programar el control del robot y entender su funcionamiento', 'PWM, ADC1, PCNT, UART, GPIO del ESP32'],
    ['Robótica II', 'Odometría, matemática y cálculo de trayectorias', 'Encoders, IMU, geometría del chasis'],
    ['Sistemas Mecatrónicos', 'Lectura e integración de sensores y comunicación', 'Todos los sensores y los enlaces Pi–ESP–PC'],
    ['Sistemas de Control', 'Ajuste del PID y control fino de motores', 'Velocidad (encoder) y corriente de cada motor'],
    ['Mecanismos', 'Cálculo de fuerzas y esfuerzos', 'Corriente (par estimado) y cotas del chasis'],
    ['Tecnología Industrial', 'Escaneo y reproducción de objetos 3D, CAD, diseño de módulos', 'LiDAR 3D y zona de montaje de accesorios'],
  ], 0.7, 1.65, 11.95, [2.6, 5.15, 4.2], 0.68, 11);
  s.addText('Todavía no se eligió una materia inicial. Los ensayos son ejemplos del autor.', { x: 0.7, y: 6.5, w: 11.9, h: 0.3, fontFace: F, fontSize: 10.5, italic: true, color: C.sub, margin: 0 });
}

{
  const s = base('Lista de compras y trabajo de taller', 'Precios en ARS con 10 % de envío; los de exterior se pasaron a ARS 1.750 por dólar. Sin IVA ni aduana.', ['E', 'M'], 'Presupuesto de componentes actualizado el 20/11/2026');
  const hdr = (t) => ({ text: t, options: { bold: true, color: C.sub, fill: { color: 'EEF2F8', transparency: 8 }, fontSize: 9.5, fontFace: F } });
  const td = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 9, color: C.ink, fontFace: F, fill: { color: 'FFFFFF', transparency: 28 } }, o) });
  const r = (a, b, c, d) => [td(a, { bold: true }), td(b), td(c), td(d, { align: 'right' })];
  const rows = [
    [hdr('Componente'), hdr('Origen'), hdr('Proveedor'), hdr('ARS')],
    r('Unitree 4D LiDAR L1 PM', 'Exterior · USD 249', 'Onyx Robotics', '479.325'),
    r('Raspberry Pi 5 · 4 GB', 'Argentina', 'Starware', '325.280'),
    r('2 × Pololu #4756 + encoder', 'Exterior · USD 60,95 c/u', 'DigiKey (cotizar RC Juampa)', '234.658'),
    r('Driver Cytron MDD10A', 'Exterior · USD 25,90', 'Cytron', '49.858'),
    r('Logitech C270', 'Argentina', 'Gerbio', '47.565'),
    r('Pololu #4984 buck-boost 12 V', 'Exterior · USD 18,95', 'Pololu', '36.488'),
    r('OSOYOO IR de 5 canales', 'Argentina', 'CVR Electrónica', '28.466'),
    r('Waveshare ESP32-P4 · pantalla táctil 5″', 'Argentina', 'Mercado Libre', '145.200'),
    r('ESP32 DevKit V1', 'Argentina', 'Starware', '20.470'),
    r('2 × Pololu #5240 (corriente)', 'Exterior · USD 5,25 c/u', 'DigiKey', '20.213'),
    r('Yahboom YB-MPP01 (12 V → 5 V PD)', 'Exterior · USD 9', 'Yahboom', '17.325'),
    [td('Subtotal cotizado', { bold: true, fill: { color: 'DBEAFE', transparency: 10 } }), td('', { fill: { color: 'DBEAFE', transparency: 10 } }), td('', { fill: { color: 'DBEAFE', transparency: 10 } }), td('1.404.846', { bold: true, align: 'right', fill: { color: 'DBEAFE', transparency: 10 } })],
  ];
  s.addTable(rows, { x: 0.7, y: 1.6, w: 7.75, colW: [2.9, 1.95, 1.9, 1.0], rowH: 0.4, border: { type: 'solid', pt: 1, color: 'FFFFFF' }, margin: [0.02, 0.08, 0.02, 0.08], valign: 'middle' });
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
    'Rama de 5 V de la pantalla Waveshare: a cargo del taller.',
    'Batería: Probattery ARS 29.255 o Yuasa NP7-12 ARS 61.984 (fuera del subtotal).',
    'Adaptador USB–UART del LiDAR, si el kit no lo trae.',
  ], 9.5), { x: 8.95, y: 5.05, w: 3.55, h: 1.65, fontFace: F, margin: 0, valign: 'top' });
}


{
  const s = base('Costo estimado de componentes', 'Entregable educativo: sin precio de venta ni retorno económico.', ['E', 'M', 'P']);
  const big = (x, y, w, h, color, dark, label, num, note) => {
    card(s, x, y, w, h, color, { solid: true, border: color, shadow: true });
    s.addText(label, { x, y: y + 0.15, w, h: 0.3, fontFace: F, fontSize: 9, bold: true, color: dark, align: 'center', charSpacing: 2, margin: 0 });
    s.addText(num, { x, y: y + 0.5, w, h: 0.9, fontFace: FT, fontSize: 34, bold: true, color: C.ink, align: 'center', margin: 0, valign: 'middle' });
    s.addText(note, { x: x + 0.2, y: y + 1.45, w: w - 0.4, h: h - 1.55, fontFace: F, fontSize: 12, color: C.sub, align: 'center', margin: 0, valign: 'top' });
  };
  big(0.7, 1.7, 3.9, 2.55, C.M, C.Md, 'ESCENARIO ELEGIDO', 'ARS 1.404.846', 'Pi 5 de 4 GB, LiDAR L1 PM, ESP32 DevKit V1 y pantalla Waveshare. Con 10 % de envío; sin IVA ni aduana.');
  big(4.72, 1.7, 3.9, 2.55, C.C, C.Cd, 'SI SE IMPORTA LA PI', 'ARS 1.329.816', 'Referencia si se confirma comprar la Pi 5 en el exterior al costo estimado.');
  big(8.74, 1.7, 3.9, 2.55, C.E, C.Ed, 'ESCENARIO DE MAYOR COSTO', 'ARS 1.847.189', 'Con LiDAR L2 y Raspberry Pi de 8 GB. Se mantiene solo como comparación.');
  block(s, 0.7, 4.5, 5.9, 1.9, C.P, C.Pd, 'Cómo se cubre', 'Financiamiento privado del autor. Se agradecería ayuda económica de la facultad, que todavía no está consultada.', 13);
  block(s, 6.72, 4.5, 5.92, 1.9, C.gray, C.gray, 'Qué falta confirmar', 'Envío a Argentina, impuestos, aduana, adaptador USB–UART y el enlace de la pantalla con el robot.', 13);
}


{
  const s = base('Decisiones de diseño abiertas', 'Lo que hay que cerrar antes de fabricar.', 'Sistemas Mecatrónicos · Proyecto de Ingeniería Mecatrónica');
  techTable(s, [
    ['Tema', 'Opciones', 'Estado'],
    ['Pantalla Waveshare ESP32-P4', 'Enlace con la Pi o con el DevKit: UART, USB o Wi-Fi', 'Por definir'],
    ['Enlace Pi ↔ ESP32', 'UART, USB o Wi-Fi', 'Por definir'],
    ['Orientación del LiDAR', 'Arriba, abajo o inclinado ≈ 45° hacia adelante', 'Propuesta: inclinado · verificar en el CAD'],
    ['Modelo de IA', 'Sin IA al inicio; YOLO nano como ampliación', 'Ampliación propuesta'],
    ['Pines del ESP32', 'ADC1 (GPIO32–39) para corriente; PCNT para encoders', 'Pinout pendiente'],
    ['Regulación de 12 V del LiDAR', 'Pololu #4984 buck-boost, hasta 2,5 A típicos', 'Preferido · confirmar envío'],
    ['Protección y corte de tracción', 'Fusible, corte y baja tensión', 'Por definir (taller)'],
    ['Ruedas y cubos', 'Ø85 × 16 mm del CAD o Pololu #1435 de Ø90', 'Cubo y carga radial por cerrar'],
    ['Rueda loca', 'Nylon (Grilon) Ø50 mm, eje de aluminio', 'Montada a la placa inferior · confirmar altura'],
    ['Batería', 'Probattery BSLA-1270-CPB o Yuasa NP7-12', 'Orientación, terminales y cargador'],
    ['Red de la interfaz web', 'Punto de acceso propio del robot o red de la facultad', 'Por definir'],
    ['Adaptador USB–UART', 'Incluido en el kit del LiDAR o a cargo del taller', 'Confirmar'],
    ['Placa superior', 'Chapón de acero de 3 mm (definido en el CAD)', 'Depende de los accesorios'],
  ], 0.7, 1.55, 11.95, [2.7, 6.3, 2.95], 0.37, 9.5);
}

{
  const s = base('Estado y decisión', 'Semáforo de deseabilidad, factibilidad y viabilidad.', 'Proyecto de Ingeniería Mecatrónica');
  const L = [
    ['DESEABILIDAD', 'El problema lo percibe el autor. Falta la encuesta y la consulta a docentes.'],
    ['FACTIBILIDAD', 'Conseguir las piezas en el país y cerrar el diseño. El resto se puede hacer.'],
    ['VIABILIDAD', 'Componentes por unos ARS 1,40 M. Financiamiento por consultar.'],
  ];
  L.forEach(([t, b], i) => {
    const x = 0.7 + i * 4.05;
    card(s, x, 1.65, 3.85, 1.9, C.E, { solid: true, border: C.E, shadow: true });
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.85, w: 0.34, h: 0.34, fill: { color: 'FACC15' }, line: { color: C.Ed, width: 1 } });
    s.addText(t, { x: x + 0.65, y: 1.8, w: 2.0, h: 0.44, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: 'middle' });
    chip(s, 'AMARILLO', x + 3.85 - 0.15 - 1.0, 1.9, C.Ed, 1.0);
    s.addText(b, { x: x + 0.2, y: 2.4, w: 3.45, h: 1.1, fontFace: F, fontSize: 12, color: C.sub, margin: 0, valign: 'top' });
  });
  techTable(s, [
    ['Aspecto', 'Conclusión'],
    ['Driver de valor', 'Integrar teoría y práctica con un solo sistema mecatrónico'],
    ['Restricción principal', 'Conseguir las piezas en el país'],
    ['Supuesto crítico', 'Que estudiantes y docentes quieran usarlo'],
    ['Próxima evidencia', 'Resultados de la encuesta a estudiantes'],
  ], 0.7, 3.85, 11.95, [3.2, 8.75], 0.42, 11);
  s.addText('Decisión del autor: AVANZAR, revisando componentes y posibles reducciones de costo.', { x: 0.7, y: 6.15, w: 11.9, h: 0.4, fontFace: FT, fontSize: 15, bold: true, color: C.ink, margin: 0 });
}


const out = process.argv[2];
pres.writeFile({ fileName: out }).then(f => console.log('OK', f));
