import os
os.chdir('C:/Users/kobac/AppData/Local/Temp/claude/0e1aac5b3d0411e2/b60d6ae7-b335-430b-a8bf-19ba90423822/scratchpad/deck')

block = r'''
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
'''
open('new4.js', 'a', encoding='utf-8').write(block)
a = open('assemble.py', encoding='utf-8').read()
assert "n4['P07'], secs['08']" in a
a = a.replace("n4['P07'], secs['08']", "n4['P07'], n4['PANT'], secs['08']", 1)
open('assemble.py', 'w', encoding='utf-8').write(a)
print('ok')
