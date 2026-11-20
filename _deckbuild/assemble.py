import re
src = open('build_v1.js', encoding='utf-8').read()
sep = re.compile(r"// =+\n// (\d\d) [^\n]*\n// =+\n")
parts = sep.split(src)
header = parts[0]
secs = {}
for i in range(1, len(parts), 2):
    secs[parts[i]] = parts[i + 1]
tail_i = secs['15'].index("const out = process.argv[2];")
footer = secs['15'][tail_i:]
secs['15'] = secs['15'][:tail_i]


def rep(txt, a, b):
    assert a in txt, a[:70]
    return txt.replace(a, b, 1)


hs = header.index("function base(")
he = header.index("function card(")
newbase = r'''function base(title, sub, a3, a4) {
  const footer = Array.isArray(a3) ? a4 : a3;
  const s = pres.addSlide();
  slideNo += 1;
  s.background = { path: BG };
  s.addText(title, { x: 0.7, y: 0.28, w: 11.9, h: 0.7, fontFace: F, fontSize: 28, bold: true, color: C.ink, margin: 0, valign: 'middle' });
  if (sub) s.addText(sub, { x: 0.7, y: 0.98, w: 11.9, h: 0.4, fontFace: F, fontSize: 14, color: C.sub, margin: 0, valign: 'top' });
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText(footer || 'Plataforma robótica móvil para prácticas de mecatrónica', { x: 0.7, y: 7.03, w: 10, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0, valign: 'middle' });
  s.addText(String(slideNo).padStart(2, '0'), { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0, valign: 'middle' });
  return s;
}

function techTable(s, rows, x, y, w, colW, rowH, fs) {
  const body = rows.map((r, i) => r.map((t, j) => i === 0
    ? { text: t, options: { bold: true, color: C.white, fill: { color: '1E3A8A' }, fontSize: fs, fontFace: F } }
    : { text: t, options: { bold: j === 0, color: C.ink, fontSize: fs, fontFace: F, fill: { color: 'FFFFFF' } } }));
  s.addTable(body, { x, y, w, colW, rowH, border: { type: 'solid', pt: 0.5, color: 'D5DCE6' }, margin: [0.02, 0.08, 0.02, 0.08], valign: 'middle' });
}

'''
header = header[:hs] + newbase + header[he:]

rs0 = header.index("function renderSlot(")
rs1 = header.index("function bullets(")
new_render = """const RENDER_DIR = 'D:/ProyectoFinal/renders';
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
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: C.white, transparency: 55 }, line: { color: C.gray, width: 1.25, dashType: 'dash' } });
  s.addText([
    { text: 'RENDER 3D', options: { fontSize: 11, bold: true, color: C.gray, charSpacing: 3, breakLine: true } },
    { text: label, options: { fontSize: 10, color: C.sub, breakLine: true } },
    { text: key ? 'Archivo esperado: renders/' + key + '.png' : 'Render conceptual · diseño en desarrollo', options: { fontSize: 8, color: C.mute, italic: true } },
  ], { x, y, w, h, fontFace: F, align: 'center', valign: 'middle', margin: 8 });
}

"""
header = header[:rs0] + new_render + header[rs1:]
header = header.replace("const path = require('path');", "const path = require('path');\
const fs = require('fs');", 1)

s8 = secs['08']
s8 = rep(s8, "'CONTROLADORES HERMANOS'", "'CONTROLADORES'")
a = s8.index("  // ESP (smaller)")
b = s8.index("  // Pi inputs (straight)")
esp = r'''  // ESP (smaller)
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

'''
s8 = s8[:a] + esp + s8[b:]
s8 = rep(s8, "lab(s, 'ADC · GPIO21/22', 2.9", "lab(s, 'ADC1 · GPIO32–39', 2.9")
INS = """  partCard(s, 9.95, 3.2, 2.9, 0.8, C.C, C.Cd, 'PANTALLA · HMI', 'Waveshare ESP32-P4 · 5″ táctil', 'Panel de operación del robot', '· ARS 145.200 · Mercado Libre', 'COMPRAR');
  wire(s, [[8.5, 3.6], [9.95, 3.6]], WIRE.tbd, true);
  lab(s, 'por definir', 8.55, 3.35, 1.35, WIRE.tbd, 'center', true);
  lab(s, 'UART, USB o Wi-Fi', 8.55, 3.66, 1.35, C.sub);
"""
s8 = rep(s8, "  // right: Cytron + motors\n", INS + "  // right: Cytron + motors\n")
secs['08'] = s8

s9 = secs['09']
s9 = rep(s9, "'Una batería de 12 V alimenta cada bloque a través del regulador que necesita.'", "'Distribución desde la batería de 12 V hacia cada regulador y carga.'")
s9 = rep(s9, "'RAMA DE 5 V', 'Regulación de la Waveshare', 'Alimentación USB-C de 5 V', 'por definir', 'TALLER'", "'RAMA DE 5 V', 'Alimentación de DevKit y pantalla', 'Rama de 5 V a cargo del taller', 'por definir', 'TALLER'")
s9 = rep(s9, "['CONTROL', 'Waveshare ESP32-P4', 'Controlador y pantalla', C.C, C.Cd, '5 V', 'por USB-C']", "['CONTROL Y PANTALLA', 'ESP32 DevKit + Waveshare', 'DevKit por VIN; pantalla por USB-C', C.C, C.Cd, '5 V', 'por VIN y USB-C']")
s9 = rep(s9, "'Pico y consumo de cada carga todavía sin medir: la distribución se dimensionará con las piezas definitivas.'", "'Motor: bloqueo ≈ 5,5 A a 12 V (extrapolado). Cytron: 10 A por canal. Yahboom: 5 V / 5 A, entrada de 7 a 24 V. Pololu #4984: 12 V, hasta 2,5 A típicos. Consumos reales sin medir.'")
secs['09'] = s9

s10 = secs['10']
s10 = rep(s10, "base('Qué compramos y qué hacemos nosotros'", "base('Lista de compras y trabajo de taller'")
a = s10.index("    r('Unitree 4D LiDAR")
b = s10.index("    [td('Subtotal cotizado'")
rows = r'''    r('Unitree 4D LiDAR L1 PM', 'Exterior · USD 249', 'Onyx Robotics', '479.325'),
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
'''
s10 = s10[:a] + rows + s10[b:]
s10 = rep(s10, "td('1.384.376'", "td('1.404.846'")
s10 = rep(s10, "'ESP32 DevKit V1 de respaldo: ARS 20.470.'", "'Rama de 5 V de la pantalla Waveshare: a cargo del taller.'")
secs['10'] = s10

s11 = secs['11']
s11 = rep(s11, "base('Cuánto cuesta y cómo se paga', 'Es un entregable educativo: no hay precio de venta ni retorno económico.'", "base('Costo estimado de componentes', 'Entregable educativo: sin precio de venta ni retorno económico.'")
s11 = rep(s11, "'ARS 1.384.376', 'Componentes cotizados: Pi 5 de 4 GB y LiDAR L1 PM. Incluye 10 % de envío; sin IVA ni aduana.'", "'ARS 1.404.846', 'Pi 5 de 4 GB, LiDAR L1 PM, ESP32 DevKit V1 y pantalla Waveshare. Con 10 % de envío; sin IVA ni aduana.'")
s11 = rep(s11, "'ARS 1.309.346', 'Referencia si se confirma comprar la Pi 5 en el exterior al costo estimado.'", "'ARS 1.329.816', 'Referencia si se confirma comprar la Pi 5 en el exterior al costo estimado.'")
s11 = rep(s11, "'ARS 1.826.719', 'Con LiDAR L2 y Raspberry Pi de 8 GB. Se mantiene solo como comparación.'", "'ARS 1.847.189', 'Con LiDAR L2 y Raspberry Pi de 8 GB. Se mantiene solo como comparación.'")
s11 = rep(s11, "'Envío a Argentina, impuestos y aduana, y si el kit del LiDAR trae el adaptador USB–UART. La estimación inicial del autor era de unos ARS 1.300.000.'", "'Envío a Argentina, impuestos, aduana, adaptador USB–UART y el enlace de la pantalla con el robot.'")
secs['11'] = s11


def load(fn):
    t = open(fn, encoding='utf-8').read()
    d = {}
    for m in re.finditer(r"//### (\w+)\n(.*?)(?=\n//### |\Z)", t, re.S):
        d[m.group(1)] = m.group(2) + "\n"
    return d


n1 = load('new_sections.js')
n1['04'] = n1['04'].replace("'Chasis · vista 3/4 con cotas');", "'Chasis · vista 3/4 con cotas', 'chasis');")
n2 = load("new2.js")
n3 = load("new3.js")
n4 = load("new4.js")
order = [n4['P01'], n4['P02'], n4['P03'], n4['P04'], n4['P05'], n4['P06'], n4['P07'], n4['PANT'], secs['08'], n3['B'], n4['P10'], n4['P11'], n4['DIV'],
         n1['02'], n1['03'], n1['04'], n1['05'], n1['06'], n2['07'], n3['A'], n2['09'], secs['09'], n2['11'], secs['10'], secs['11'], n2['14'], n2['16']]
out = header + "\n".join(order) + "\n" + footer
open('build.js', 'w', encoding='utf-8').write(out)
print(len(order))
