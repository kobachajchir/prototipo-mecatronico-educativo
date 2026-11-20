s = open('assemble.py', encoding='utf-8').read()

# 1) renderSlot con imagen automática desde D:/ProyectoFinal/renders
hook = "header = header[:hs] + newbase + header[he:]\n"
assert hook in s
new_rs = r'''
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
'''
s = s.replace(hook, hook + new_rs, 1)

# 2) chasis con clave de render
s = s.replace("n1 = load('new_sections.js')", "n1 = load('new_sections.js')\nn1['04'] = n1['04'].replace(\"'Chasis · vista 3/4 con cotas');\", \"'Chasis · vista 3/4 con cotas', 'chasis');\")", 1)
s = s.replace("n3 = load(\"new3.js\")", "n3 = load(\"new3.js\")\nn4 = load(\"new4.js\")", 1)

# 3) nuevo orden: principal corta + anexo
import re
start = s.index("order = [")
end = s.index("\n", start)
neworder = ("order = [n4['P01'], n4['P02'], n4['P03'], n4['P04'], n4['P05'], n4['P06'], n4['P07'], secs['08'], n3['B'], n4['P10'], n4['P11'], n4['DIV'],\n"
            "         n1['02'], n1['03'], n1['04'], n1['05'], n1['06'], n2['07'], n3['A'], n2['09'], secs['09'], n2['11'], secs['10'], secs['11'], n2['14'], n2['16']]")
s = s[:start] + neworder + s[end:]
open('assemble.py', 'w', encoding='utf-8').write(s)
print('ok')
