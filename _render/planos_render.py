import bpy, sys, json, math, mathutils, time

ARGS = json.loads(sys.argv[sys.argv.index('--') + 1])
VIEW = ARGS['view']            # top | side | front | rear | info
OUT = ARGS.get('out')
PPM = ARGS.get('ppm', 6.0)     # px por mm de robot
SAMPLES = ARGS.get('samples', 32)
LINES = ARGS.get('lines', True)

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath='D:/ProyectoFinal/_render/robot.obj', forward_axis='Y', up_axis='Z',
                      global_scale=0.01, use_split_objects=False, use_split_groups=True)
scn = bpy.context.scene
objs = [o for o in scn.objects if o.type == 'MESH']


def is_floor(o): return o.name.startswith('Piso blanco') or o.name.startswith('L\u00ednea negra') or o.name.startswith('Línea negra')


robot = [o for o in objs if not is_floor(o)]
for o in objs:
    if is_floor(o): o.hide_render = True


def bb(olist):
    mn = [1e9] * 3; mx = [-1e9] * 3
    for o in olist:
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            for i in range(3): mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
    return mn, mx


IDS = ARGS.get('ids', False)
rmn, rmx = bb(robot)
if VIEW == 'info':
    def mm(olist):
        a, b = bb(olist)
        return [round(v * 1000, 2) for v in a + b]
    by = {}
    for o in robot: by.setdefault(o.name, []).append(o)
    info = {'robot': mm(robot)}
    for key in ['Placa inferior', 'Chapón superior', 'Rueda loca', 'Pivote', 'Banda de goma Ø85 × 16 — derecha', 'Banda de goma Ø85 × 16 — izquierda',
                'Llanta estampada — derecha', 'Cuna con apoyos', 'Yuasa', 'Soporte de pantalla USB', 'Body1:2964', 'Body1:2963', 'Guía con ranuras', 'Corredera del sensor']:
        sel = [o for o in robot if o.name.startswith(key)]
        if sel: info[key] = mm(sel)
    # elementos sobre la placa superior (LiDAR y su adaptador)
    above = []
    for o in robot:
        a, b = bb([o])
        if a[2] >= 0.1455 and abs((a[1] + b[1]) / 2) < 0.06 and a[0] > 0.0:
            above.append(o)
    if above: info['sobre_placa_superior'] = mm(above)
    info['sobre_lista'] = []
    for o in above:
        a, b = bb([o])
        info['sobre_lista'].append((o.name, [round(v * 1000, 1) for v in a + b], len(o.data.polygons)))
    # pilares: objetos delgados verticales entre placas
    pil = []
    for o in robot:
        a, b = bb([o])
        if 0.087 < a[2] < 0.095 and b[2] > 0.14 and (b[0] - a[0]) < 0.0135 and (b[1] - a[1]) < 0.0135:
            pil.append((o.name, [round(v * 1000, 1) for v in a + b]))
    info['pilares'] = pil[:12]
    json.dump(info, open('D:/ProyectoFinal/planos/cotas_modelo.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    sys.exit(0)

# material neutro (técnico)
clay = bpy.data.materials.new('clay'); clay.use_nodes = True
b = clay.node_tree.nodes['Principled BSDF']; b.inputs['Base Color'].default_value = (0.80, 0.82, 0.85, 1); b.inputs['Roughness'].default_value = 0.85
for o in robot:
    o.data.materials.clear(); o.data.materials.append(clay)

cx = (rmn[0] + rmx[0]) / 2; cy = (rmn[1] + rmx[1]) / 2; cz = (rmn[2] + rmx[2]) / 2
sizes = {'bottom': (rmx[1] - rmn[1], rmx[0] - rmn[0]), 'top': (rmx[1] - rmn[1], rmx[0] - rmn[0]), 'side': (rmx[0] - rmn[0], rmx[2] - rmn[2]),
         'front': (rmx[1] - rmn[1], rmx[2] - rmn[2]), 'rear': (rmx[1] - rmn[1], rmx[2] - rmn[2])}
PADMM = 40
cw_mm = sizes[VIEW][0] * 1000 + 2 * PADMM; ch_mm = sizes[VIEW][1] * 1000 + 2 * PADMM
resx, resy = int(round(cw_mm * PPM)), int(round(ch_mm * PPM))
scn.render.resolution_x, scn.render.resolution_y = resx, resy
cam_d = bpy.data.cameras.new('c'); cam_d.type = 'ORTHO'
cam_d.ortho_scale = max(resx, resy) / PPM / 1000.0
cam = bpy.data.objects.new('c', cam_d); scn.collection.objects.link(cam); scn.camera = cam
D = 3.0
if VIEW == 'top':
    cam.location = (cx, cy, rmx[2] + D); cam.rotation_euler = (0, 0, math.radians(-90))
elif VIEW == 'bottom':
    cam.location = (cx, cy, rmn[2] - D); cam.rotation_euler = (math.radians(180), 0, math.radians(90))
elif VIEW == 'side':
    cam.location = (cx, rmn[1] - D, cz); cam.rotation_euler = (math.radians(90), 0, 0)
elif VIEW == 'front':
    cam.location = (rmx[0] + D, cy, cz); cam.rotation_euler = (math.radians(90), 0, math.radians(90))
else:
    cam.location = (rmn[0] - D, cy, cz); cam.rotation_euler = (math.radians(90), 0, math.radians(-90))
cam_d.clip_start = 0.01; cam_d.clip_end = 20

world = bpy.data.worlds.new('w'); scn.world = world; world.use_nodes = False; world.color = (1.0, 1.0, 1.0)
sun = bpy.data.lights.new('sun', 'SUN'); sun.energy = 1.6; sun.angle = math.radians(25)
so = bpy.data.objects.new('sun', sun); so.rotation_euler = (math.radians(50), math.radians(10), math.radians(-35)); scn.collection.objects.link(so)

import random
random.seed(7)
if IDS:
    for o in robot:
        o.color = (random.random(), random.random(), random.random(), 1)
scn.render.engine = 'BLENDER_WORKBENCH'
scn.display.render_aa = 'OFF' if IDS else '16'
sh = scn.display.shading
sh.light = 'FLAT' if IDS else 'STUDIO'
sh.color_type = 'OBJECT' if IDS else 'SINGLE'
sh.single_color = (0.86, 0.88, 0.91)
sh.show_object_outline = not IDS
sh.object_outline_color = (0.04, 0.04, 0.06)
sh.show_cavity = not IDS
sh.cavity_type = 'BOTH'
sh.cavity_ridge_factor = 0.6
sh.cavity_valley_factor = 1.0
sh.show_shadows = False
scn.view_settings.view_transform = 'Standard'
scn.render.film_transparent = False
scn.render.image_settings.file_format = 'PNG'; scn.render.image_settings.color_mode = 'RGB'
scn.render.filepath = OUT
t0 = time.time()
bpy.ops.render.render(write_still=True)
json.dump({'view': VIEW, 'res': [resx, resy], 'ppm': PPM, 'center_mm': [round(cx * 1000, 3), round(cy * 1000, 3), round(cz * 1000, 3)],
           'bbox_mm': [round(v * 1000, 3) for v in rmn + rmx], 'pad_mm': PADMM, 'secs': round(time.time() - t0, 1)},
          open(OUT + '.json', 'w'), indent=1)
