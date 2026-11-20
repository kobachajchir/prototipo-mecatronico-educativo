from PIL import Image

top = Image.open('D:/ProyectoFinal/_render/top_real.png').convert('RGBA')
top = top.crop(top.getbbox())
H = 480
top = top.resize((int(top.width * H / top.height), H), Image.LANCZOS)
bg = Image.open('D:/ProyectoFinal/_cdp/03_control_manual_sin_modelo.png').convert('RGBA')
cx, cy = 1024, 566
bg.alpha_composite(top, (cx - top.width // 2, cy - top.height // 2))
bg.convert('RGB').save('D:/ProyectoFinal/_cdp/pantalla_nuestro_auto.png')
bg.convert('RGB').save('D:/ProyectoFinal/renders/12_ui_control_manual_nuestro_auto.png')
print('ui ok', top.size)

s = open('D:/ProyectoFinal/_render/render.py', encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b, 1)


rep("for o in floor_objs:\n    o.hide_render = not FLOOR", "for o in floor_objs:\n    o.hide_render = (not FLOOR) or (TRANSPARENT and not o.name.startswith('Piso'))")
rep("    dist = 0.6\n    for _ in range(40):", "    dist = ARGS.get('dist', 0.6)\n    if ARGS.get('focus'):\n        center = mathutils.Vector(ARGS['focus'])\n    for _ in range(0 if ARGS.get('dist') else 40):")
rep("    INFO['dist'] = round(dist, 3)", "    if ARGS.get('dist'):\n        cam.location = center + dv * dist\n        cam.rotation_euler = (center - cam.location).to_track_quat('-Z', 'Y').to_euler()\n    INFO['dist'] = round(dist, 3)")
open('D:/ProyectoFinal/_render/render.py', 'w', encoding='utf-8').write(s)
print('render.py ok')
