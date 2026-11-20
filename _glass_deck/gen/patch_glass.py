import re, sys, os

here = os.path.dirname(os.path.abspath(__file__))
src = open(os.path.join(here, 'build.js'), encoding='utf-8').read()


def rep(txt, a, b, count=1):
    assert a in txt, 'missing: ' + a[:90]
    return txt.replace(a, b, count)


def rep_between(txt, start, end, new):
    i = txt.index(start)
    j = txt.index(end, i)
    return txt[:i] + new + txt[j:]


# ---------- fonts, palette, backgrounds ----------
src = rep(src, "const BG = path.join(__dirname, 'bg.png');",
          "const BG = path.join(__dirname, 'bg_glass.jpg');\n"
          "const BGH = path.join(__dirname, 'bg_glass_hero.jpg');")
src = rep(src, "const F = 'Segoe UI';", "const F = 'Inter';\nconst FT = 'Manrope';")
src = rep(src, "ink: '0F172A', sub: '4F6178', mute: '6B7C93', line: 'CBD5E1'",
          "ink: '0B1220', sub: '475569', mute: '64748B', line: 'FFFFFF'")

# ---------- header helpers ----------
new_helpers = r'''function mix(hex, t) {
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
'''
src = rep_between(src, "function base(", "// card with tag / title / sub / status line", new_helpers + "\n")

# chip -> glass pill
src = rep(src,
          "s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: ww, h: 0.24, rectRadius: 0.12, fill: { color, transparency: 88 }, line: { color, width: 0.75 } });",
          "s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: ww, h: 0.24, rectRadius: 0.12, fill: { color: 'FFFFFF', transparency: 20 }, line: { color, width: 0.75, transparency: 35 } });")

# render placeholder -> glass
src = rep(src,
          "s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.16, fill: { color: C.white, transparency: 55 }, line: { color: C.gray, width: 1.25, dashType: 'dash' } });",
          "s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.22, fill: { color: 'FFFFFF', transparency: 45 }, line: { color: 'FFFFFF', width: 1.5, transparency: 10 }, shadow: glassShadow() });")

# ---------- shopping list table (slide 24) ----------
src = rep(src,
          "const hdr = (t) => ({ text: t, options: { bold: true, color: C.white, fill: { color: '1E3A8A' }, fontSize: 9.5, fontFace: F } });",
          "const hdr = (t) => ({ text: t, options: { bold: true, color: C.sub, fill: { color: 'EEF2F8', transparency: 8 }, fontSize: 9.5, fontFace: F } });")
src = rep(src,
          "const td = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 9, color: C.ink, fontFace: F }, o) });",
          "const td = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 9, color: C.ink, fontFace: F, fill: { color: 'FFFFFF', transparency: 28 } }, o) });")
src = src.replace("fill: { color: 'DBEAFE' }", "fill: { color: 'DBEAFE', transparency: 10 }")
src = rep(src,
          "rowH: 0.4, border: { type: 'solid', pt: 0.5, color: 'D5DCE6' }, fill: { color: 'FFFFFF' },",
          "rowH: 0.4, border: { type: 'solid', pt: 1, color: 'FFFFFF' },")

# ---------- web interface section (after the touch-screen slide) ----------
web = open(os.path.join(here, 'web_slides.js'), encoding='utf-8').read()
anchor = "{\n  const s = base('Sensores y control: cómo se conecta todo'"
src = rep(src, anchor, web + anchor)
src = rep(src, "'Control manual, estado de sensores y alertas'", "'Muestra la interfaz web del robot: control, sensores y alertas'")

# ---------- data that changed in the CAD (20/11/2026) ----------
fixes = [
    ("'Eje en X = 78,03 mm, Y ≈ 0, sobre la lente'", "'Eje en X ≈ 102 mm, Y = 0, sobre la lente'"),
    ("'Misma X e Y. Lente a 116,5 mm del suelo'", "'Misma X e Y. Lente a 115,5 mm del suelo'"),
    ("Lente a 116,5 mm del suelo'", "Lente a 115,5 mm del suelo'"),
    ("'≈ 340 × 218 × 216 mm, con pantalla, bujes y LiDAR'", "'≈ 340 × 218 × 214 mm, con pantalla, bujes y LiDAR'"),
    ("'300 × 180 mm, esquinas R8'", "'300 × 180 × 3 mm, chapón de acero, esquinas R8'"),
    ("'258 × 154 × 4 mm, acero dulce, esquinas R8'", "'258 × 154 × 3 mm, chapón de acero, esquinas R8'"),
    ("'Goma Ø50 mm, a 220 mm del eje motriz'", "'Nylon (Grilon) Ø50 mm, eje de aluminio, a ≈ 237 mm del eje motriz'"),
    ("'Placa superior, ranuras delanteras. Eje en X = 78,03 mm, Y ≈ 0'", "'Placa superior, adelante. Eje en X ≈ 102 mm, Y = 0'"),
    ("'Goma de Ø50 mm', 'Pedir altura de montaje'", "'Nylon (Grilon) Ø50 mm, eje de aluminio', 'Montada a la placa inferior · confirmar altura'"),
    ("'4 mm de acero dulce, espesor preliminar'", "'Chapón de acero de 3 mm (definido en el CAD)'"),
]
for a, b in fixes:
    src = rep(src, a, b)

# ---------- slide "Reparto de tareas": make room for the extra table row ----------
for t in ("block(s, 0.7, 1.6, w, 3.25,", "block(s, 4.72, 1.6, w, 3.25,", "block(s, 8.74, 1.6, w, 3.25,"):
    src = rep(src, t, t.replace("3.25,", "2.95,"))
src = rep(src, "s.addText('Interfaces abiertas', { x: 0.7, y: 5.0,", "s.addText('Interfaces abiertas', { x: 0.7, y: 4.7,")
src = rep(src, "], 0.7, 5.35, 11.95, [2.4, 7.5, 2.05], 0.33, 9.5);", "], 0.7, 5.03, 11.95, [2.4, 7.5, 2.05], 0.3, 9.5);")

# ---------- consistency with the web-interface section ----------
src = rep(src, "• Envío de datos a la computadora externa\\n", "• Servidor de la interfaz web (HTTP + WebSocket)\\n")
src = rep(src, "• Interfaz web para ver lecturas y mapa\\n", "• Interfaz web desde el navegador, por Wi‑Fi\\n")
src = rep(src, "    ['IMU opcional', 'I²C (Qwiic) a la Pi o al ESP32', 'Por definir'],",
          "    ['Interfaz web', 'Wi‑Fi: punto de acceso del robot o red del aula. HTTP + WebSocket', 'Propuesta'],\n"
          "    ['IMU opcional', 'I²C (Qwiic) a la Pi o al ESP32', 'Por definir'],")
src = rep(src, "    ['Adaptador USB–UART', 'Incluido en el kit del LiDAR o a cargo del taller', 'Confirmar'],",
          "    ['Red de la interfaz web', 'Punto de acceso propio del robot o red de la facultad', 'Por definir'],\n"
          "    ['Adaptador USB–UART', 'Incluido en el kit del LiDAR o a cargo del taller', 'Confirmar'],")

# ---------- cover ----------
src = rep(src, "const s = pres.addSlide(); slideNo += 1; s.background = { path: BG };\n  s.addText('IDEA DE PROYECTO",
          "const s = pres.addSlide(); slideNo += 1; s.background = { path: BGH };\n  s.addText('IDEA DE PROYECTO")
src = rep(src,
          "s.addText('Un robot para aprender mecatrónica haciendo', { x: 0.7, y: 1.85, w: 6.3, h: 2.7, fontFace: F, fontSize: 44,",
          "s.addText('Aprender mecatrónica, sobre ruedas', { x: 0.7, y: 1.85, w: 6.3, h: 2.7, fontFace: FT, fontSize: 48,")
src = rep(src,
          "'Un prototipo programable y ampliable para usar en distintas materias de la carrera.'",
          "'Un robot móvil, programable y ampliable para aprender haciendo en distintas materias de la carrera.'")
# cover + closing + annex footers use the shared footer pill
src = rep(src,
          "  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });\n"
          "  s.addText('Prototipo mecatrónico educativo', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0 });\n"
          "  s.addText('01', { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0 });",
          "  footerBar(s, 'Prototipo mecatrónico educativo');")

# closing (12) and annex divider (13): hero background + shared footer
for title in ("'Integrar teoría y práctica con un solo sistema'", "'Anexo técnico'"):
    i = src.index("s.addText(" + title)
    j = src.rindex("s.background = { path: BG };", 0, i)
    src = src[:j] + "s.background = { path: BGH };" + src[j + len("s.background = { path: BG };"):]
old_foot = re.compile(
    r"  s\.addShape\(pres\.shapes\.LINE, \{ x: 0\.7, y: 6\.97, w: 11\.93, h: 0, line: \{ color: C\.line, width: 0\.5 \} \}\);\n"
    r"  s\.addText\('Prototipo mecatrónico educativo', \{[^\n]*\n"
    r"  s\.addText\(String\(slideNo\)\.padStart\(2, '0'\), \{[^\n]*\n")
src, n = old_foot.subn("  footerBar(s, 'Prototipo mecatrónico educativo');\n", src)
print('custom footers replaced:', n)

# ---------- display font for headings / big numbers ----------
def big_bold(m):
    size = float(m.group(1))
    face = 'FT' if size >= 15 else 'F'
    return 'fontFace: %s, fontSize: %s, bold: true' % (face, m.group(1))
src, n1 = re.subn(r"fontFace: F, fontSize: (\d+(?:\.\d+)?), bold: true", big_bold, src)

def run_bold(m):
    size = float(m.group(1))
    return ('{ fontFace: FT, fontSize: %s, bold: true' % m.group(1)) if size >= 15 else m.group(0)
src, n2 = re.subn(r"\{ fontSize: (\d+(?:\.\d+)?), bold: true", run_bold, src)
print('heading faces:', n1, 'run faces:', n2)

open(os.path.join(here, 'build_glass.js'), 'w', encoding='utf-8').write(src)
print('ok')

