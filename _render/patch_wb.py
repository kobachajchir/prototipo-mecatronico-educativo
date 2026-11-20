s = open('D:/ProyectoFinal/_render/planos_render.py', encoding='utf-8').read()
a = s.index("scn.render.engine = 'CYCLES'")
b = s.index("t0 = time.time()")
new = '''scn.render.engine = 'BLENDER_WORKBENCH'
scn.display.render_aa = '16'
sh = scn.display.shading
sh.light = 'STUDIO'
sh.color_type = 'SINGLE'
sh.single_color = (0.86, 0.88, 0.91)
sh.show_object_outline = True
sh.object_outline_color = (0.04, 0.04, 0.06)
sh.show_cavity = True
sh.cavity_type = 'BOTH'
sh.cavity_ridge_factor = 0.6
sh.cavity_valley_factor = 1.0
sh.show_shadows = False
scn.view_settings.view_transform = 'Standard'
scn.render.film_transparent = False
scn.render.image_settings.file_format = 'PNG'; scn.render.image_settings.color_mode = 'RGB'
scn.render.filepath = OUT
'''
s = s[:a] + new + s[b:]
open('D:/ProyectoFinal/_render/planos_render.py', 'w', encoding='utf-8').write(s)
print('ok')
