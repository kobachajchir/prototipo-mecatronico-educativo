import bpy, mathutils, time
t0 = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath='D:/ProyectoFinal/_render/robot.obj', forward_axis='NEGATIVE_Z', up_axis='Y')
objs = [o for o in bpy.context.scene.objects if o.type == 'MESH']
mn = [1e9] * 3; mx = [-1e9] * 3
for o in objs:
    for c in o.bound_box:
        w = o.matrix_world @ mathutils.Vector(c)
        for i in range(3):
            mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
lines = ['objetos=%d' % len(objs), 'min=%s' % [round(v, 3) for v in mn], 'max=%s' % [round(v, 3) for v in mx],
         'dims=%s' % [round(mx[i] - mn[i], 3) for i in range(3)], 'materiales=%d' % len(bpy.data.materials), 'secs=%.1f' % (time.time() - t0)]
open('D:/ProyectoFinal/_render/import_info.txt', 'w').write('\n'.join(lines))
bpy.ops.wm.save_as_mainfile(filepath='D:/ProyectoFinal/_render/robot_import.blend')
