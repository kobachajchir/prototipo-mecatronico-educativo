s = open('D:/ProyectoFinal/_render/planos_render.py', encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


# vista inferior
rep("sizes = {'top': (rmx[1] - rmn[1], rmx[0] - rmn[0]),", "sizes = {'bottom': (rmx[1] - rmn[1], rmx[0] - rmn[0]), 'top': (rmx[1] - rmn[1], rmx[0] - rmn[0]),")
rep("elif VIEW == 'side':\n    cam.location", "elif VIEW == 'bottom':\n    cam.location = (cx, cy, rmn[2] - D); cam.rotation_euler = (math.radians(180), 0, math.radians(90))\nelif VIEW == 'side':\n    cam.location")

# pasada de identificación por pieza (color plano distinto por objeto) para sacar contornos nítidos
rep("rmn, rmx = bb(robot)\nif VIEW == 'info':", "IDS = ARGS.get('ids', False)\nrmn, rmx = bb(robot)\nif VIEW == 'info':")
rep("scn.render.engine = 'BLENDER_WORKBENCH'", "import random\nrandom.seed(7)\nif IDS:\n    for o in robot:\n        o.color = (random.random(), random.random(), random.random(), 1)\nscn.render.engine = 'BLENDER_WORKBENCH'")
rep("scn.display.render_aa = '16'", "scn.display.render_aa = 'OFF' if IDS else '16'")
rep("sh.light = 'STUDIO'\nsh.color_type = 'SINGLE'", "sh.light = 'FLAT' if IDS else 'STUDIO'\nsh.color_type = 'OBJECT' if IDS else 'SINGLE'")
rep("sh.show_object_outline = True", "sh.show_object_outline = not IDS")
rep("sh.show_cavity = True", "sh.show_cavity = not IDS")
open('D:/ProyectoFinal/_render/planos_render.py', 'w', encoding='utf-8').write(s)
print('ok')
