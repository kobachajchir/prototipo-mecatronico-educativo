import json, os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from PIL import Image

P = 'D:/ProyectoFinal/planos'
S = 0.4  # escala 1:2,5 -> mm de hoja por mm de robot
INK = '#111827'

vinfo = {}
for v in ('top', 'side', 'front', 'rear'):
    vinfo[v] = json.load(open(f'{P}/v_{v}.png.json'))
    vinfo[v]['img'] = Image.open(f'{P}/v_{v}.png').convert('RGB')
CX, CY, CZ = vinfo['top']['center_mm']

fig = plt.figure(figsize=(420 / 25.4, 297 / 25.4), dpi=200)
ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 420); ax.set_ylim(0, 297); ax.axis('off')

# ---- marco ----
ax.add_patch(Rectangle((5, 5), 410, 287, fill=False, lw=1.2, ec=INK))
ax.add_patch(Rectangle((10, 10), 400, 277, fill=False, lw=0.5, ec=INK))

# ---- posición de las vistas (centro de la imagen en la hoja) ----
POS = {'top': (80, 172), 'side': (250, 218), 'front': (215, 103), 'rear': (335, 103)}


def sheet(view, x=None, y=None, z=None):
    xc, yc = POS[view]
    if view == 'top':      return (xc - (y - CY) * S, yc + (x - CX) * S)
    if view == 'side':     return (xc + (x - CX) * S, yc + (z - CZ) * S)
    if view == 'front':    return (xc + (y - CY) * S, yc + (z - CZ) * S)
    return (xc - (y - CY) * S, yc + (z - CZ) * S)


for v, (xc, yc) in POS.items():
    im = vinfo[v]['img']; w = im.width / vinfo[v]['ppm'] * S; h = im.height / vinfo[v]['ppm'] * S
    ax.imshow(im, extent=(xc - w / 2, xc + w / 2, yc - h / 2, yc + h / 2), zorder=1, interpolation='lanczos')
ax.set_xlim(0, 420); ax.set_ylim(0, 297)

FS = 5.6


def arrows(p1, p2):
    ax.annotate('', xy=p2, xytext=p1, arrowprops=dict(arrowstyle='<|-|>', lw=0.5, color=INK, shrinkA=0, shrinkB=0, mutation_scale=5), zorder=5)


def dim_h(x1, x2, yl, text, ref1=None, ref2=None, above=True):
    ax.plot([x1, x1], [ref1 if ref1 is not None else yl, yl + (1.5 if yl >= (ref1 or yl) else -1.5)], color=INK, lw=0.3, zorder=4)
    ax.plot([x2, x2], [ref2 if ref2 is not None else yl, yl + (1.5 if yl >= (ref2 or yl) else -1.5)], color=INK, lw=0.3, zorder=4)
    arrows((x1, yl), (x2, yl))
    ax.text((x1 + x2) / 2, yl + (0.9 if above else -0.9), text, ha='center', va='bottom' if above else 'top', fontsize=FS, color=INK, zorder=6,
            bbox=dict(fc='white', ec='none', pad=0.3, alpha=0.9))


def dim_v(y1, y2, xl, text, ref1=None, ref2=None, left=True):
    ax.plot([ref1 if ref1 is not None else xl, xl + (1.5 if xl >= (ref1 or xl) else -1.5)], [y1, y1], color=INK, lw=0.3, zorder=4)
    ax.plot([ref2 if ref2 is not None else xl, xl + (1.5 if xl >= (ref2 or xl) else -1.5)], [y2, y2], color=INK, lw=0.3, zorder=4)
    arrows((xl, y1), (xl, y2))
    ax.text(xl + (-0.9 if left else 0.9), (y1 + y2) / 2, text, ha='right' if left else 'left', va='center', rotation=90, fontsize=FS, color=INK, zorder=6,
            bbox=dict(fc='white', ec='none', pad=0.3, alpha=0.9))


def label(view, text, sub=''):
    xc, yc = POS[view]
    return text, sub


def title(x, y, t, sub):
    ax.text(x, y, t, fontsize=8, fontweight='bold', color=INK, ha='center', va='center')
    ax.text(x, y - 3.6, sub, fontsize=5.6, color='#374151', ha='center', va='center')


def centerline(p1, p2):
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color='#b91c1c', lw=0.35, dashes=(8, 2, 1.5, 2), zorder=3)


# ================= PLANTA =================
t = lambda x, y: sheet('top', x=x, y=y)
xmin, xmax, ymax = -187.35, 152.7, 109.0
# línea de centro longitudinal y ejes
centerline(t(xmin - 8, 0), t(xmax + 8, 0))
centerline(t(95, ymax + 6), t(95, -ymax - 6))
centerline(t(-125, 40), t(-125, -40))
# cadena longitudinal (derecha del dibujo = lado derecho del robot, y negativo)
Xr = t(0, -ymax)[0]
pts = [-187.35, -150.0, -125.0, 0.0, 95.0, 152.7]
for a, b in zip(pts[:-1], pts[1:]):
    dim_v(t(a, 0)[1], t(b, 0)[1], Xr + 9, f'{b - a:g}'.replace('.', ','), ref1=Xr + 1, ref2=Xr + 1, left=False)
dim_v(t(xmin, 0)[1], t(xmax, 0)[1], Xr + 19, '340', ref1=Xr + 1, ref2=Xr + 1, left=False)
# anchos arriba
Yt = t(xmax, 0)[1]
dim_h(t(0, 98)[0], t(0, -98)[0], Yt + 8, 'Ancho de vía 196 (centros de rueda)', ref1=t(95, 98)[1], ref2=t(95, -98)[1])
dim_h(t(0, 109)[0], t(0, -109)[0], Yt + 16, 'Ancho total 218', ref1=t(95, 109)[1], ref2=t(95, -109)[1])
# anchos abajo
Yb = t(xmin, 0)[1]
dim_h(t(0, 90)[0], t(0, -90)[0], Yb - 8, 'Placa inferior 180', ref1=t(-150, 90)[1], ref2=t(-150, -90)[1], above=False)
dim_h(t(0, 63.45)[0], t(0, -63.45)[0], Yb - 16, 'Pantalla 126,9', ref1=t(xmin, 63.45)[1], ref2=t(xmin, -63.45)[1], above=False)
dim_h(t(0, 77)[0], t(0, -77)[0], Yb - 24, 'Placa superior 154', ref1=t(-124, 77)[1], ref2=t(-124, -77)[1], above=False)
# distancia entre ejes (izquierda)
Xl = t(0, ymax)[0]
dim_v(t(-125, 0)[1], t(95, 0)[1], Xl - 9, 'Eje de ruedas – pivote: 220', ref1=Xl - 1, ref2=Xl - 1, left=True)
# LiDAR
lx, ly = t(102, 0)
ax.annotate('LiDAR\neje x = +102', xy=(lx, ly), xytext=(lx - 36, ly + 22), fontsize=FS, color=INK, ha='center',
            arrowprops=dict(arrowstyle='-', lw=0.4, color=INK), zorder=6)
ax.annotate('FRENTE', xy=(t(0, 0)[0], t(xmax, 0)[1] + 26), xytext=(t(0, 0)[0], t(xmax, 0)[1] + 33), fontsize=6, ha='center', fontweight='bold',
            arrowprops=dict(arrowstyle='<|-', color=INK, lw=0.8), color=INK)
title(POS['top'][0], 102.5 - 8, 'PLANTA', 'Esc. 1:2,5')

# ================= LATERAL =================
s_ = lambda x, z: sheet('side', x=x, z=z)
zmax = 213.52
centerline(s_(95, -6), s_(95, 91))
centerline(s_(-125, -6), s_(-125, 60))
centerline(s_(102, 146), s_(102, zmax + 8))
Yb0 = s_(0, 0)[1]
pts = [-187.35, -125.0, 95.0, 152.7]
for a, b in zip(pts[:-1], pts[1:]):
    dim_h(s_(a, 0)[0], s_(b, 0)[0], Yb0 - 8, f'{b - a:g}'.replace('.', ','), ref1=Yb0, ref2=Yb0)
dim_h(s_(xmin, 0)[0], s_(xmax, 0)[0], Yb0 - 16, 'Largo total 340', ref1=Yb0, ref2=Yb0)
Yt0 = s_(0, zmax)[1]
dim_h(s_(67, 0)[0], s_(137, 0)[0], Yt0 + 4, 'LiDAR 70', ref1=Yt0, ref2=Yt0)
dim_h(s_(-124, 0)[0], s_(134, 0)[0], Yt0 + 12, 'Placa superior 258', ref1=s_(0, 146)[1], ref2=s_(0, 146)[1])
dim_h(s_(-150, 0)[0], s_(150, 0)[0], Yt0 + 20, 'Placa inferior 300', ref1=s_(0, 88)[1], ref2=s_(0, 88)[1])
Xs = s_(xmax, 0)[0]
dim_v(s_(0, 0)[1], s_(0, 85)[1], Xs + 10, 'Despeje 85', ref1=Xs + 1, ref2=Xs + 1, left=False)
dim_v(s_(0, 88)[1], s_(0, 143)[1], Xs + 10, 'Luz entre placas 55', ref1=Xs + 1, ref2=Xs + 1, left=False)
dim_v(s_(0, 146)[1], s_(0, zmax)[1], Xs + 10, '67,5', ref1=Xs + 1, ref2=Xs + 1, left=False)
dim_v(s_(0, 0)[1], s_(0, zmax)[1], Xs + 20, 'Alto total 213,5', ref1=Xs + 1, ref2=Xs + 1, left=False)
Xs0 = s_(xmin, 0)[0]
dim_v(s_(0, 80.78)[1], s_(0, 150.08)[1], Xs0 - 8, 'Pantalla 69,3', ref1=Xs0 - 1, ref2=Xs0 - 1, left=True)
# diámetros y eje
wx, wy = s_(95, 42.5)
ax.annotate('Ø85 × 16\neje z = 42,5', xy=(wx + 17 * 0.707 * S * 1.0, wy - 17 * 0.707 * S * 1.0), xytext=(wx + 30, wy - 20), fontsize=FS, color=INK,
            arrowprops=dict(arrowstyle='-', lw=0.4, color=INK), zorder=6)
cx_, cy_ = s_(-142, 25)
ax.annotate('Ø50 × 20', xy=(cx_ - 8, cy_ - 8), xytext=(cx_ - 16, cy_ - 24), fontsize=FS, color=INK, ha='center',
            arrowprops=dict(arrowstyle='-', lw=0.4, color=INK), zorder=6)
ax.annotate('inclinación 12°', xy=s_(-180, 118), xytext=(s_(-180, 118)[0] - 18, s_(-180, 118)[1] + 18), fontsize=FS, color=INK, ha='center',
            arrowprops=dict(arrowstyle='-', lw=0.4, color=INK), zorder=6)
title(POS['side'][0], 164.5 - 4, 'ALZADO LATERAL (DERECHO)', 'Esc. 1:2,5')

# ================= FRONTAL =================
f_ = lambda y, z: sheet('front', y=y, z=z)
centerline(f_(0, -6), f_(0, zmax + 8))
Yb0 = f_(0, 0)[1]
dim_h(f_(98, 0)[0], f_(-98, 0)[0], Yb0 - 8, 'Ancho de vía 196', ref1=Yb0, ref2=Yb0)
dim_h(f_(109, 0)[0], f_(-109, 0)[0], Yb0 - 16, 'Ancho total 218', ref1=Yb0, ref2=Yb0)
dim_h(f_(106, 0)[0], f_(90, 0)[0], Yb0 - 24, 'Rueda 16', ref1=Yb0, ref2=Yb0, above=False)
Yt0 = f_(0, zmax)[1]
dim_h(f_(35, 0)[0], f_(-35, 0)[0], Yt0 + 4, 'LiDAR 70', ref1=Yt0, ref2=Yt0)
dim_h(f_(77, 0)[0], f_(-77, 0)[0], Yt0 + 12, 'Placa superior 154', ref1=f_(0, 146)[1], ref2=f_(0, 146)[1])
dim_h(f_(90, 0)[0], f_(-90, 0)[0], Yt0 + 20, 'Placa inferior 180', ref1=f_(0, 88)[1], ref2=f_(0, 88)[1])
Xf = f_(-109, 0)[0]
dim_v(f_(0, 0)[1], f_(0, zmax)[1], f_(109, 0)[0] + 10, 'Alto total 213,5', ref1=f_(109, 0)[0] + 1, ref2=f_(109, 0)[0] + 1, left=False)
dim_v(f_(0, 0)[1], f_(0, 85)[1], Xf - 10, 'Despeje 85', ref1=Xf - 1, ref2=Xf - 1, left=True)
title(POS['front'][0], 52 - 8, 'ALZADO FRONTAL', 'Esc. 1:2,5')

# ================= POSTERIOR =================
r_ = lambda y, z: sheet('rear', y=y, z=z)
centerline(r_(0, -6), r_(0, zmax + 8))
Yb0 = r_(0, 0)[1]
dim_h(r_(109, 0)[0], r_(-109, 0)[0], Yb0 - 8, 'Ancho total 218', ref1=Yb0, ref2=Yb0)
Yt0 = r_(0, zmax)[1]
dim_h(r_(63.45, 0)[0], r_(-63.45, 0)[0], Yt0 + 4, 'Pantalla 126,9', ref1=r_(0, 150.08)[1], ref2=r_(0, 150.08)[1])
dim_h(r_(90, 0)[0], r_(-90, 0)[0], Yt0 + 12, 'Placa inferior 180', ref1=r_(0, 88)[1], ref2=r_(0, 88)[1])
Xr2 = r_(-109, 0)[0]
dim_v(r_(0, 80.78)[1], r_(0, 150.08)[1], Xr2 + 10, 'Pantalla 69,3', ref1=Xr2 + 1, ref2=Xr2 + 1, left=False)
dim_v(r_(0, 0)[1], r_(0, zmax)[1], Xr2 + 20, 'Alto total 213,5', ref1=Xr2 + 1, ref2=Xr2 + 1, left=False)
title(POS['rear'][0], 52 - 8, 'ALZADO POSTERIOR', 'Esc. 1:2,5')

# ================= ISOMÉTRICA (referencia) =================
iso = 'D:/ProyectoFinal/renders/idea.png'
if os.path.exists(iso):
    im = Image.open(iso).convert('RGBA'); w = 78; h = w * im.height / im.width
    ax.imshow(im, extent=(330, 330 + w, 270 - h / 2 - 8, 270 + h / 2 - 8), zorder=2)
    ax.text(330 + w / 2, 270 - h / 2 - 12, 'Isométrica (referencia, sin escala)', fontsize=5.6, ha='center', va='top', color='#374151')

# ================= CUADRO DE COTAS Y ROTULO =================
cuadro = [
    'CUADRO DE COTAS PRINCIPALES (mm)',
    'Largo × ancho × alto totales: 340 × 218 × 213,5',
    'Placa inferior: 300 × 180 × 3 (cara inferior a z = 85)',
    'Placa superior: 258 × 154 × 3 (z = 143 a 146)',
    'Luz entre placas: 55 · Pilares pasantes: 6, a x = −96 / 0 / +96, y = ±65',
    'Ruedas motrices: Ø85 × 16, eje en x = +95, z = 42,5 · Ancho de vía 196',
    'Rueda loca: Ø50 × 20, pivote en x = −125 · Distancia eje–pivote 220',
    'LiDAR: cuerpo 70 × 70, tope en z = 213,5, eje en x = +102 (adaptador 80 × 80 × 4)',
    'Pantalla: 126,9 × 69,3 (proyectada), inclinada 12°, borde trasero en x = −187,35',
    'Batería: 97,5 × 151 × 65, centrada, a z = 14',
]
y0 = 52
ax.add_patch(Rectangle((200, 12), 205, 42, fill=False, lw=0.5, ec=INK))
for i, line in enumerate(cuadro):
    ax.text(203, 51 - i * 3.9, line, fontsize=5.4 if i else 6.2, fontweight='bold' if i == 0 else 'normal', color=INK, va='center')

ax.add_patch(Rectangle((10, 10), 140, 46, fill=False, lw=0.7, ec=INK))
rows = [('PROYECTO', 'Plataforma robótica móvil educativa'), ('PLANO', 'Vistas generales acotadas'),
        ('ESCALA', '1:2,5 · Unidades: mm'), ('ORIGEN', 'Centro de la placa inferior; x adelante, y izquierda, z arriba desde el piso'),
        ('AUTOR', 'Koba Chajchir · Ingeniería Mecatrónica · FCAL – UNER'), ('FECHA / REV.', '20/11/2026 · Rev. A (preliminar)'),
        ('NOTA', 'Cotas medidas del modelo CAD. Referencia, no diseño definitivo.')]
yy = 53
for k, v in rows:
    ax.plot([10, 150], [yy - 6, yy - 6], color=INK, lw=0.3)
    ax.text(12, yy - 3, k, fontsize=4.6, color='#6b7280', va='center')
    ax.text(40, yy - 3, v, fontsize=5.2 if k != 'ORIGEN' else 4.6, color=INK, va='center')
    yy -= 6.4

os.makedirs(P, exist_ok=True)
fig.savefig(f'{P}/Plano_01_vistas_generales.pdf', dpi=200)
fig.savefig(f'{P}/Plano_01_vistas_generales.png', dpi=200)
print('ok')
