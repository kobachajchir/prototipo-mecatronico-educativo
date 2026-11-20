s = open('D:/ProyectoFinal/_render/render.py', encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b, 1)


rep("    if best:\n", "    vdir0 = mathutils.Vector((math.sin(ang), 0, math.cos(ang)))\n    best = (0, nrm * 0.20003 + vdir0 * 0.07555, 0.00343, 'Body1:2964')\n    if best:\n")
rep("w, h = 0.1106, 0.0622", "w, h = 0.1104, 0.0623")
rep("bgn.inputs['Color'].default_value = (0.86, 0.88, 0.92, 1)", "bgn.inputs['Color'].default_value = (0.60, 0.62, 0.66, 1)")
rep("K = ARGS.get('k', 0.12)", "K = ARGS.get('k', 0.07)")
rep("WORLD = ARGS.get('world', 0.3)", "WORLD = ARGS.get('world', 0.35)")
open('D:/ProyectoFinal/_render/render.py', 'w', encoding='utf-8').write(s)
print('ok')
