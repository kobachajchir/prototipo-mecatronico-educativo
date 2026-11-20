import os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Wedge, Circle, Arc

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
os.makedirs(OUT, exist_ok=True)

# ---------------- escena (mundo: x adelante, y izquierda, z arriba, metros) ----------------
ROOM = dict(x0=-1.0, x1=5.0, y0=-2.0, y1=2.0, z0=0.0, z1=2.7)
WALL_COL = {  # por eje y lado
    ('x', 0): (0.86, 0.82, 0.74), ('x', 1): (0.88, 0.85, 0.78),
    ('y', 0): (0.80, 0.84, 0.88), ('y', 1): (0.84, 0.80, 0.78),
    ('z', 0): (0.52, 0.56, 0.62), ('z', 1): (0.95, 0.95, 0.95),
}
BOXES = [  # (x0,x1,y0,y1,z0,z1,color)
    (2.0, 2.6, -0.7, -0.1, 0.0, 0.5, (0.72, 0.52, 0.30)),      # caja de cartón
    (3.0, 3.8, 0.2, 1.2, 0.72, 0.76, (0.64, 0.46, 0.28)),       # tablero de mesa
    (3.02, 3.08, 0.22, 0.28, 0.0, 0.72, (0.35, 0.35, 0.38)),    # patas
    (3.72, 3.78, 0.22, 0.28, 0.0, 0.72, (0.35, 0.35, 0.38)),
    (3.02, 3.08, 1.12, 1.18, 0.0, 0.72, (0.35, 0.35, 0.38)),
    (3.72, 3.78, 1.12, 1.18, 0.0, 0.72, (0.35, 0.35, 0.38)),
    (4.3, 5.0, -1.8, -0.6, 0.0, 1.8, (0.38, 0.48, 0.62)),       # armario
    (4.98, 5.0, 0.2, 1.4, 1.0, 1.8, (0.97, 0.97, 0.97)),        # pizarra
]
CYL = (2.4, 1.1, 0.2, 0.6, (0.25, 0.62, 0.42))  # cx, cy, r, h, color
LIGHT = np.array([0.3, -0.2, 0.93]); LIGHT /= np.linalg.norm(LIGHT)


def cast(O, D):
    """O (3,), D (N,3) -> t (N,), color (N,3), normal (N,3)"""
    N = D.shape[0]
    t_best = np.full(N, np.inf); col = np.zeros((N, 3)); nor = np.zeros((N, 3))
    # sala (salida)
    for ax, i in (('x', 0), ('y', 1), ('z', 2)):
        lo, hi = ROOM[ax + '0'], ROOM[ax + '1']
        d = D[:, i]
        with np.errstate(divide='ignore', invalid='ignore'):
            t = np.where(d > 1e-9, (hi - O[i]) / d, np.where(d < -1e-9, (lo - O[i]) / d, np.inf))
        side = (d > 0).astype(int)
        m = (t > 1e-6) & (t < t_best)
        t_best = np.where(m, t, t_best)
        for s in (0, 1):
            mm = m & (side == s)
            col[mm] = WALL_COL[(ax, s)]
            n = np.zeros(3); n[i] = -1 if s == 1 else 1
            nor[mm] = n
    # cajas
    for (x0, x1, y0, y1, z0, z1, c) in BOXES:
        lo = np.array([x0, y0, z0]); hi = np.array([x1, y1, z1])
        with np.errstate(divide='ignore', invalid='ignore'):
            t1 = (lo - O) / D; t2 = (hi - O) / D
        tmin = np.minimum(t1, t2); tmax = np.maximum(t1, t2)
        te = np.nanmax(tmin, axis=1); tx = np.nanmin(tmax, axis=1)
        axis = np.nanargmax(tmin, axis=1)
        hit = (te <= tx) & (te > 1e-6) & (te < t_best)
        t_best = np.where(hit, te, t_best)
        col[hit] = c
        n = np.zeros((N, 3)); n[np.arange(N), axis] = -np.sign(D[np.arange(N), axis])
        nor[hit] = n[hit]
    # cilindro
    cx, cy, r, h, c = CYL
    ox, oy = O[0] - cx, O[1] - cy
    a = D[:, 0] ** 2 + D[:, 1] ** 2
    b = 2 * (ox * D[:, 0] + oy * D[:, 1]); cc = ox * ox + oy * oy - r * r
    disc = b * b - 4 * a * cc
    with np.errstate(divide='ignore', invalid='ignore'):
        ts = (-b - np.sqrt(np.where(disc >= 0, disc, np.nan))) / (2 * a)
    z = O[2] + ts * D[:, 2]
    hit = (disc >= 0) & (ts > 1e-6) & (z >= 0) & (z <= h) & (ts < t_best)
    t_best = np.where(hit, ts, t_best); col[hit] = c
    nn = np.stack([O[0] + ts * D[:, 0] - cx, O[1] + ts * D[:, 1] - cy, np.zeros(N)], 1)
    nn /= np.maximum(np.linalg.norm(nn, axis=1, keepdims=True), 1e-9); nor[hit] = nn[hit]
    # tapa
    with np.errstate(divide='ignore', invalid='ignore'):
        tc = (h - O[2]) / D[:, 2]
    px = O[0] + tc * D[:, 0] - cx; py = O[1] + tc * D[:, 1] - cy
    hit = (tc > 1e-6) & (px * px + py * py <= r * r) & (tc < t_best) & (O[2] > h)
    t_best = np.where(hit, tc, t_best); col[hit] = c; nor[hit] = np.array([0, 0, 1.0])
    return t_best, col, nor


def shade(col, nor):
    k = 0.55 + 0.45 * np.abs(nor @ LIGHT)
    return np.clip(col * k[:, None], 0, 1)


# ---------------- geometría del robot (CAD inicial) ----------------
CAM = np.array([0.078, 0.0, 0.1165])   # lente a 116,5 mm del suelo, X = 78,03 mm
LID = np.array([0.078, 0.0, 0.190])    # eje del LiDAR sobre la lente (altura aproximada)
W, H = 640, 360
DIAG = np.radians(55.0)
f = (np.hypot(W, H) / 2) / np.tan(DIAG / 2)

# ---------------- cámara ----------------
u, v = np.meshgrid(np.arange(W) + 0.5, np.arange(H) + 0.5)
Dc = np.stack([np.full_like(u, f), -(u - W / 2), -(v - H / 2)], -1).reshape(-1, 3)
Dc /= np.linalg.norm(Dc, axis=1, keepdims=True)
t, col, nor = cast(CAM, Dc)
img = shade(col, nor).reshape(H, W, 3)
fog = np.clip(1 - 0.06 * t.reshape(H, W), 0.55, 1)[..., None]
img = np.clip(img * fog, 0, 1)
plt.imsave(os.path.join(OUT, 'cam.png'), np.kron(img, np.ones((2, 2, 1))))

# ---------------- LiDAR: hemisferio 360° x 90° (patrón ilustrativo) ----------------
N = 36000
i = np.arange(N)
dz = 1 - (i + 0.5) / N                      # 1 (cenit) .. 0 (horizonte)
phi = i * np.pi * (3 - np.sqrt(5))
rxy = np.sqrt(1 - dz ** 2)
TILT = np.radians(45)
RY = np.array([[np.cos(TILT), 0, np.sin(TILT)], [0, 1, 0], [-np.sin(TILT), 0, np.cos(TILT)]])
DL = np.stack([rxy * np.cos(phi), rxy * np.sin(phi), dz], 1) @ RY.T
tl, coll, norl = cast(LID, DL)
valid = (tl > 0.05) & (tl < 20)
P = LID + DL * tl[:, None]
P = P[valid]; coll = coll[valid]; rng = tl[valid]

# color de la cámara para los puntos dentro de su campo
rel = P - CAM
inside = (rel[:, 0] > 0.05)
uu = W / 2 - f * rel[:, 1] / np.where(inside, rel[:, 0], 1)
vv = H / 2 - f * rel[:, 2] / np.where(inside, rel[:, 0], 1)
inside &= (uu >= 0) & (uu < W) & (vv >= 0) & (vv < H)
cam_rgb = np.zeros((len(P), 3))
cam_rgb[inside] = img[vv[inside].astype(int), uu[inside].astype(int)]


# ---------------- vistas ----------------
def view(Vp, target, fov_deg, size):
    wpx, hpx = size
    fwd = target - Vp; fwd /= np.linalg.norm(fwd)
    right = np.cross(fwd, [0, 0, 1.0]); right /= np.linalg.norm(right)
    up = np.cross(right, fwd)
    ff = (wpx / 2) / np.tan(np.radians(fov_deg) / 2)

    def proj(Q):
        r = Q - Vp
        z = r @ fwd
        x = r @ right; y = r @ up
        with np.errstate(divide='ignore', invalid='ignore'):
            return wpx / 2 + ff * x / z, hpx / 2 - ff * y / z, z
    return proj


def robot_wire(ax, proj, color='#fbbf24'):
    # envolvente del robot: 0.30 x 0.22 x 0.19 (aprox.), centrado en el origen
    x0, x1, y0, y1, z0, z1 = -0.15, 0.17, -0.11, 0.11, 0.0, 0.19
    pts = np.array([[a, b, c] for a in (x0, x1) for b in (y0, y1) for c in (z0, z1)])
    edges = [(0, 1), (2, 3), (4, 5), (6, 7), (0, 2), (1, 3), (4, 6), (5, 7), (0, 4), (1, 5), (2, 6), (3, 7)]
    uu_, vv_, zz = proj(pts)
    for a, b in edges:
        if zz[a] > 0.1 and zz[b] > 0.1:
            ax.plot([uu_[a], uu_[b]], [vv_[a], vv_[b]], color=color, lw=1.6)


def render(fname, pts, colors, proj, size, emph=None, frustum=False, title=None):
    wpx, hpx = size
    fig = plt.figure(figsize=(wpx / 100, hpx / 100), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, wpx); ax.set_ylim(hpx, 0); ax.axis('off')
    fig.patch.set_facecolor('#0b1220'); ax.set_facecolor('#0b1220')
    uu_, vv_, zz = proj(pts)
    m = (zz > 0.2) & (uu_ >= 0) & (uu_ < wpx) & (vv_ >= 0) & (vv_ < hpx)
    order = np.argsort(-zz[m])
    sizes = np.where(emph[m][order], 9.0, 3.2) if emph is not None else 3.2
    ax.scatter(uu_[m][order], vv_[m][order], c=colors[m][order], s=sizes, marker='s', linewidths=0)
    robot_wire(ax, proj)
    fig.savefig(os.path.join(OUT, fname), dpi=100, facecolor=fig.get_facecolor())
    plt.close(fig)


proj = view(np.array([-0.95, -1.35, 1.35]), np.array([3.0, 0.3, 1.0]), 75, (1280, 720))
# nube del LiDAR por altura
hcol = plt.cm.turbo(np.clip(P[:, 2] / 2.7, 0, 1))[:, :3]
render('lidar_wide.png', P, hcol, proj, (1280, 720))
# nube fusionada: color de cámara dentro del campo, resto en gris azulado por altura
gray = plt.cm.bone(0.25 + 0.55 * np.clip(P[:, 2] / 2.7, 0, 1))[:, :3]
fused = np.where(inside[:, None], np.clip(cam_rgb * 1.25, 0, 1), gray * 0.95)
render('fused_wide.png', P, fused, proj, (1280, 720), emph=inside)

# vista en planta del escaneo (por distancia)
fig = plt.figure(figsize=(7.2, 7.2), dpi=100)
ax = fig.add_axes([0.02, 0.02, 0.96, 0.96]); ax.set_aspect('equal'); ax.axis('off')
fig.patch.set_facecolor('#0b1220'); ax.set_facecolor('#0b1220')
sc = ax.scatter(P[:, 1], P[:, 0], c=rng, s=2.4, cmap='viridis', linewidths=0, marker='s')
for r in (1, 2, 3, 4, 5):
    ax.add_patch(Circle((0, 0.078), r, fill=False, ec='#334155', lw=0.8, ls='--'))
    ax.text(0.03, 0.078 + r, f'{r} m', color='#94a3b8', fontsize=14)
ax.add_patch(plt.Rectangle((-0.11, -0.15), 0.22, 0.32, fill=False, ec='#fbbf24', lw=1.8))
ax.annotate('', xy=(0, 0.6), xytext=(0, 0.2), arrowprops=dict(arrowstyle='->', color='#fbbf24', lw=1.8))
ax.text(0.06, 0.55, 'frente', color='#fbbf24', fontsize=14)
ax.set_xlim(-2.3, 2.3); ax.set_ylim(-1.3, 5.2)
fig.savefig(os.path.join(OUT, 'scan_top.png'), dpi=100, facecolor=fig.get_facecolor())
plt.close(fig)

# esquema del campo de visión (corte lateral)
fig = plt.figure(figsize=(7.2, 5.4), dpi=100)
ax = fig.add_axes([0.02, 0.02, 0.96, 0.96]); ax.set_aspect('equal'); ax.axis('off')
fig.patch.set_facecolor('none')
R = 1.0
ax.add_patch(Wedge((0, 0), R, -45, 135, fc='#10b98122', ec='#047857', lw=2))
ax.add_patch(Wedge((0, 0), 0.08, -45, 135, fc='#94a3b8', ec='#64748b', lw=1))
ax.plot([-1.25, 1.25], [0, 0], color='#64748b', lw=1.5)
ax.plot([0, 1.0], [0, 1.0], color='#64748b', lw=1.2, ls='--')
ax.text(0.66, 0.78, 'eje ≈ 45°', color='#475569', fontsize=13, rotation=45)
ax.add_patch(Arc((0, 0), 0.7, 0.7, theta1=0, theta2=45, ec='#475569', lw=1.2))
ax.add_patch(Wedge((0.0, 0.0), 0.9, -14.3, 14.3, fc='#f59e0b66', ec='#b45309', lw=1.5, ls='-'))
ax.text(-0.45, 0.5, 'Hemisferio\n360° × 90°', ha='center', color='#047857', fontsize=19, fontweight='bold')
ax.text(0.04, 0.12, 'zona ciega 0,05 m', ha='left', color='#475569', fontsize=13)
ax.text(1.55, -0.2, 'Cámara: 28,6° vertical', ha='right', color='#b45309', fontsize=14, fontweight='bold')
ax.text(0.55, -0.62, 'alcance hasta 20 m', color='#475569', fontsize=13)
ax.set_xlim(-1.3, 1.6); ax.set_ylim(-1.0, 1.15)
fig.savefig(os.path.join(OUT, 'fov_side.png'), dpi=100, transparent=True)
plt.close(fig)

# ---------------- vistas desde la cámara (misma escena y mismo encuadre que cam.png) ----------------
N2 = 120000
i2 = np.arange(N2)
dz2 = 1 - (i2 + 0.5) / N2
phi2 = i2 * np.pi * (3 - np.sqrt(5))
rxy2 = np.sqrt(1 - dz2 ** 2)
DL2 = np.stack([rxy2 * np.cos(phi2), rxy2 * np.sin(phi2), dz2], 1) @ RY.T
tl2, coll2, norl2 = cast(LID, DL2)
v2 = (tl2 > 0.05) & (tl2 < 20)
P2 = LID + DL2 * tl2[:, None]
P2 = P2[v2]
rel2 = P2 - CAM
in2 = rel2[:, 0] > 0.05
uu2 = W / 2 - f * rel2[:, 1] / np.where(in2, rel2[:, 0], 1)
vv2 = H / 2 - f * rel2[:, 2] / np.where(in2, rel2[:, 0], 1)
in2 &= (uu2 >= 0) & (uu2 < W) & (vv2 >= 0) & (vv2 < H)
rgb2 = np.zeros((len(P2), 3))
rgb2[in2] = img[vv2[in2].astype(int), uu2[in2].astype(int)]
hfov_deg = np.degrees(2 * np.arctan((W / 2) / f))
projc = view(CAM, CAM + np.array([1.0, 0, 0]), hfov_deg, (1280, 720))


def render_cam(fname, pts, colors, sel):
    fig = plt.figure(figsize=(12.8, 7.2), dpi=100)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 1280); ax.set_ylim(720, 0); ax.axis('off')
    fig.patch.set_facecolor('#0b1220'); ax.set_facecolor('#0b1220')
    a, b, z_ = projc(pts)
    m = (z_ > 0.05) & (a >= 0) & (a < 1280) & (b >= 0) & (b < 720) & sel
    ax.scatter(a[m], b[m], c=colors[m], s=16, marker='s', linewidths=0)
    fig.savefig(os.path.join(OUT, fname), dpi=100, facecolor=fig.get_facecolor())
    plt.close(fig)


allsel = np.ones(len(P2), dtype=bool)
render_cam('lidar.png', P2, plt.cm.turbo(np.clip(P2[:, 2] / 2.7, 0, 1))[:, :3], allsel)
render_cam('fused.png', P2, np.clip(rgb2 * 1.15, 0, 1), in2)
print('vista de camara:', int(in2.sum()), 'puntos en el encuadre')

print('imagenes OK', len(P), 'puntos;', int(inside.sum()), 'con color de camara')
