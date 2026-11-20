import bpy, math, mathutils, json
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath='D:/ProyectoFinal/_render/robot.obj', forward_axis='Y', up_axis='Z', global_scale=0.01, use_split_objects=False, use_split_groups=True)
ang = math.radians(12.0)
nrm = mathutils.Vector((-math.cos(ang), 0, math.sin(ang)))
rdir = mathutils.Vector((0, -1, 0)); vdir = mathutils.Vector((math.sin(ang), 0, math.cos(ang)))
rows = []
for o in bpy.context.scene.objects:
    if o.type != 'MESH': continue
    mw = o.matrix_world
    c = mw @ mathutils.Vector(o.bound_box[0])
    # solo objetos cerca de la pantalla
    wmn = [1e9] * 3; wmx = [-1e9] * 3
    for cc in o.bound_box:
        w = mw @ mathutils.Vector(cc)
        for i in range(3): wmn[i] = min(wmn[i], w[i]); wmx[i] = max(wmx[i], w[i])
    if not (wmx[0] < -0.12 and wmn[0] > -0.21 and wmn[1] > -0.09 and wmx[1] < 0.09 and wmx[2] > 0.06): continue
    sc = mw.to_scale().x
    for p in o.data.polygons:
        if p.normal.dot(nrm) > 0.99 and p.area * sc * sc > 0.0002:
            vs = [mw @ o.data.vertices[i].co for i in p.vertices]
            ds = [v.dot(nrm) for v in vs]; rs = [v.dot(rdir) for v in vs]; ts = [v.dot(vdir) for v in vs]
            rows.append((o.name, round(sum(ds) / len(ds), 5), round(min(rs), 4), round(max(rs), 4), round(min(ts), 4), round(max(ts), 4), round(p.area * sc * sc * 1e4, 1)))
rows.sort(key=lambda r: -r[1])
open('D:/ProyectoFinal/_render/screen_probe.txt', 'w', encoding='utf-8').write('\n'.join(str(r) for r in rows[:40]))
