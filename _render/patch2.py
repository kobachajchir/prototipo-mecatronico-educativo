s = open('D:/ProyectoFinal/_render/render.py', encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:60]
    s = s.replace(a, b, 1)


rep("bs.inputs['Emission Strength'].default_value = 1.1", "bs.inputs['Emission Strength'].default_value = ARGS.get('ui_strength', 2.6)")
rep("area('key', (cx + 0.7, cy + 0.9, 1.1), 1.0, 300)", "area('key', (cx + 0.7, cy + 0.9, 1.1), 0.5, 300)")
rep("MARGIN = ARGS.get('margin', 1.12)", "MARGIN = ARGS.get('margin', 1.28)")
open('D:/ProyectoFinal/_render/render.py', 'w', encoding='utf-8').write(s)
print('ok')
