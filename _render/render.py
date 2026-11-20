import bpy, bmesh, sys, json, math, mathutils, time

ARGS = json.loads(sys.argv[sys.argv.index('--') + 1])
MODE = ARGS.get('mode', 'iso')          # iso | top
OUT = ARGS['out']
RES = ARGS.get('res', [1600, 900])
SAMPLES = ARGS.get('samples', 64)
DIRV = ARGS.get('dir', [-1, 1, 0.7])
TRANSPARENT = ARGS.get('transparent', False)
UI = ARGS.get('ui', None)
FOCAL = ARGS.get('focal', 50)
MARGIN = ARGS.get('margin', 1.28)
LOOKAT_Z = ARGS.get('lookat_z', None)
FLOOR = ARGS.get('floor', True)
INFO = {}
K = ARGS.get('k', 0.07)
WORLD = ARGS.get('world', 0.35)

t0 = time.time()
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.wm.obj_import(filepath='D:/ProyectoFinal/_render/robot.obj', forward_axis='Y', up_axis='Z',
                      global_scale=0.01, use_split_objects=False, use_split_groups=True)
scn = bpy.context.scene
objs = [o for o in scn.objects if o.type == 'MESH']
INFO['objetos'] = len(objs)


def is_floor(o): return o.name.startswith('Piso blanco') or o.name.startswith('Línea negra') or o.name.startswith('L\u00ednea negra')


floor_objs = [o for o in objs if is_floor(o)]
robot_objs = [o for o in objs if not is_floor(o)]


def bbox(olist):
    mn = [1e9] * 3; mx = [-1e9] * 3
    for o in olist:
        for c in o.bound_box:
            w = o.matrix_world @ mathutils.Vector(c)
            for i in range(3):
                mn[i] = min(mn[i], w[i]); mx[i] = max(mx[i], w[i])
    return mn, mx


rmn, rmx = bbox(robot_objs)
INFO['robot_min'] = [round(v, 5) for v in rmn]; INFO['robot_max'] = [round(v, 5) for v in rmx]

# ---------- piso: un solo piso, con la cara superior exactamente en z = 0 (las ruedas lo apoyan sin atravesarlo) ----------
for o in floor_objs:
    o.hide_render = (not FLOOR) or (TRANSPARENT and not o.name.startswith('Piso'))
if floor_objs:
    fmn, fmx = bbox([o for o in floor_objs if o.name.startswith('Piso')])
    shift = rmn[2] - fmx[2]           # lleva la cara superior del piso al punto más bajo del robot
    INFO['piso_top_antes'] = round(fmx[2], 5); INFO['piso_desplazamiento'] = round(shift, 5)
    for o in floor_objs:
        o.location.z += shift + (0.0002 if o.name.startswith('L') else 0.0)

# ---------- materiales ----------
for m in bpy.data.materials:
    m.use_nodes = True
    bsdf = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
    if not bsdf: continue
    n = m.name
    rough, metal = 0.5, 0.0
    if n.startswith('Steel') or 'Alumin' in n or 'Chrome' in n or 'Brass' in n or 'Copper' in n:
        rough, metal = 0.35, 0.9
    elif 'Glossy' in n:
        rough = 0.2
    elif 'Opaque(25,25,25)' in n or 'Rubber' in n:
        rough = 0.6
    bsdf.inputs['Roughness'].default_value = rough
    bsdf.inputs['Metallic'].default_value = metal
    if 'Specular IOR Level' in bsdf.inputs: bsdf.inputs['Specular IOR Level'].default_value = 0.5
for o in floor_objs:
    for slot in o.material_slots:
        m = slot.material
        if m:
            b = next((n for n in m.node_tree.nodes if n.type == 'BSDF_PRINCIPLED'), None)
            if b: b.inputs['Roughness'].default_value = 0.85; b.inputs['Metallic'].default_value = 0.0
    if FLOOR and TRANSPARENT and o.name.startswith('Piso'):
        o.is_shadow_catcher = True

# ---------- pantalla: plano emisivo con la interfaz ----------
if UI and MODE == 'iso':
    ang = math.radians(12.0)
    nrm = mathutils.Vector((-math.cos(ang), 0, math.sin(ang)))
    best = None
    for o in robot_objs:
        wmn, wmx = bbox([o])
        c = [(wmn[i] + wmx[i]) / 2 for i in range(3)]
        if not (c[0] < -0.165 and abs(c[1]) < 0.065 and c[2] > 0.08): continue
        for p in o.data.polygons:
            sc = o.matrix_world.to_scale().x
            if p.normal.dot(nrm) > 0.995 and p.area * sc * sc > 0.003:
                ctr = o.matrix_world @ p.center
                d = ctr.dot(nrm)
                if best is None or d > best[0]:
                    best = (d, ctr, p.area * sc * sc, o.name)
    vdir0 = mathutils.Vector((math.sin(ang), 0, math.cos(ang)))
    best = (0, nrm * 0.20003 + vdir0 * 0.07555, 0.00343, 'Body1:2964')
    if best:
        INFO['pantalla'] = {'objeto': best[3], 'centro': [round(v, 5) for v in best[1]], 'area_m2': round(best[2], 6)}
        ctr = best[1] + nrm * 0.0003
        rdir = mathutils.Vector((0, -1, 0))
        vdir = mathutils.Vector((math.sin(ang), 0, math.cos(ang)))
        w, h = 0.1104, 0.0623
        verts = [ctr - rdir * w / 2 - vdir * h / 2, ctr + rdir * w / 2 - vdir * h / 2, ctr + rdir * w / 2 + vdir * h / 2, ctr - rdir * w / 2 + vdir * h / 2]
        me = bpy.data.meshes.new('UI_pantalla'); me.from_pydata([tuple(v) for v in verts], [], [(0, 1, 2, 3)]); me.update()
        uv = me.uv_layers.new(name='UVMap')
        for loop, (u, v) in zip(me.polygons[0].loop_indices, [(0, 0), (1, 0), (1, 1), (0, 1)]):
            uv.data[loop].uv = (u, v)
        plane = bpy.data.objects.new('UI_pantalla', me); scn.collection.objects.link(plane)
        mat = bpy.data.materials.new('UI_pantalla_mat'); mat.use_nodes = True
        nt = mat.node_tree; nt.nodes.clear()
        out = nt.nodes.new('ShaderNodeOutputMaterial'); bs = nt.nodes.new('ShaderNodeBsdfPrincipled')
        tex = nt.nodes.new('ShaderNodeTexImage'); tex.image = bpy.data.images.load(UI); tex.interpolation = 'Cubic'
        bs.inputs['Base Color'].default_value = (0.01, 0.01, 0.012, 1); bs.inputs['Roughness'].default_value = 0.12
        nt.links.new(tex.outputs['Color'], bs.inputs['Emission Color']); bs.inputs['Emission Strength'].default_value = ARGS.get('ui_strength', 2.6)
        nt.links.new(bs.outputs['BSDF'], out.inputs['Surface'])
        plane.data.materials.append(mat)

# ---------- iluminación de estudio ----------
cx = (rmn[0] + rmx[0]) / 2; cy = (rmn[1] + rmx[1]) / 2; cz = (rmn[2] + rmx[2]) / 2
center = mathutils.Vector((cx, cy, cz if LOOKAT_Z is None else LOOKAT_Z))
world = bpy.data.worlds.new('mundo'); scn.world = world; world.use_nodes = True
bgn = world.node_tree.nodes['Background']
bgn.inputs['Color'].default_value = (0.60, 0.62, 0.66, 1); bgn.inputs['Strength'].default_value = WORLD


def area(name, loc, size, energy, color=(1, 1, 1)):
    ld = bpy.data.lights.new(name, 'AREA'); ld.energy = energy * K; ld.size = size; ld.color = color
    lo = bpy.data.objects.new(name, ld); lo.location = loc; scn.collection.objects.link(lo)
    d = center - mathutils.Vector(loc); lo.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    return lo


if MODE == 'top':
    area('key', (cx + 0.15, cy - 0.15, 1.2), 1.2, 160)
    area('fill', (cx - 0.35, cy + 0.35, 1.0), 1.2, 80)
else:
    area('key', (cx + 0.7, cy + 0.9, 1.1), 0.5, 300)
    area('fill', (cx - 0.9, cy - 0.7, 0.8), 1.4, 120, (0.92, 0.95, 1.0))
    area('rim', (cx - 0.2, cy - 1.0, 0.9), 0.6, 150, (1.0, 0.97, 0.92))
    area('top', (cx, cy, 1.6), 1.6, 120)

# ---------- cámara ----------
cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d); scn.collection.objects.link(cam); scn.camera = cam
scn.render.resolution_x, scn.render.resolution_y = RES
corners = [mathutils.Vector((x, y, z)) for x in (rmn[0], rmx[0]) for y in (rmn[1], rmx[1]) for z in (rmn[2], rmx[2])]
if MODE == 'top':
    cam_d.type = 'ORTHO'
    ext = max(rmx[0] - rmn[0], rmx[1] - rmn[1])
    cam_d.ortho_scale = ext * MARGIN * 1.05
    cam.location = (cx, cy, 1.5)
    cam.rotation_euler = (0, 0, math.radians(-90))     # adelante (+x) hacia arriba de la imagen
else:
    cam_d.lens = FOCAL
    dv = mathutils.Vector(DIRV).normalized()
    from bpy_extras.object_utils import world_to_camera_view
    dist = ARGS.get('dist', 0.6)
    if ARGS.get('focus'):
        center = mathutils.Vector(ARGS['focus'])
    for _ in range(0 if ARGS.get('dist') else 40):
        cam.location = center + dv * dist
        cam.rotation_euler = (center - cam.location).to_track_quat('-Z', 'Y').to_euler()
        bpy.context.view_layer.update()
        xs = []; ys = []
        for c in corners:
            p = world_to_camera_view(scn, cam, c); xs.append(p.x); ys.append(p.y)
        span = max(max(xs) - 0.5, 0.5 - min(xs), (max(ys) - 0.5) * RES[1] / RES[0], (0.5 - min(ys)) * RES[1] / RES[0])
        if abs(span - 0.5 / MARGIN) < 0.01: break
        dist *= span * MARGIN / 0.5
    if ARGS.get('dist'):
        cam.location = center + dv * dist
        cam.rotation_euler = (center - cam.location).to_track_quat('-Z', 'Y').to_euler()
    INFO['dist'] = round(dist, 3)

# ---------- render ----------
scn.render.engine = 'CYCLES'
scn.cycles.device = 'CPU'
scn.cycles.samples = SAMPLES
scn.cycles.use_denoising = True
try: scn.cycles.denoiser = 'OPENIMAGEDENOISE'
except Exception: pass
scn.cycles.max_bounces = 6
scn.view_settings.view_transform = 'Standard'
scn.view_settings.look = 'None'
scn.render.film_transparent = TRANSPARENT or MODE == 'top'
scn.render.image_settings.file_format = 'PNG'
scn.render.image_settings.color_mode = 'RGBA' if scn.render.film_transparent else 'RGB'
scn.render.filepath = OUT
bpy.ops.render.render(write_still=True)
INFO['secs'] = round(time.time() - t0, 1)
open(OUT + '.json', 'w', encoding='utf-8').write(json.dumps(INFO, ensure_ascii=False, indent=1))
