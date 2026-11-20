import json, os
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle
from PIL import Image

P = 'D:/ProyectoFinal/planos'
R = 'D:/ProyectoFinal/renders'
S = 0.25                      # 1:4 -> mm de hoja por mm de robot
INK = '#111111'
ACC = '#1e3a8a'               # acento discreto en títulos
FS = 7.3                      # pt  (>= 2,5 mm)
FSB = 9.0

meta = {v: json.load(open(f'{P}/v_{v}.png.json')) for v in ('top', 'side', 'front', 'rear', 'bottom')}
CX, CY, CZ = meta['top']['center_mm']
XMIN, XMAX, YMAX, ZMAX = -187.35, 152.7, 109.0, 213.52


def new_sheet():
    fig = plt.figure(figsize=(420 / 25.4, 297 / 25.4), dpi=200)
    ax = fig.add_axes([0, 0, 1, 1]); ax.set_xlim(0, 420); ax.set_ylim(0, 297); ax.axis('off')
    ax.add_patch(Rectangle((5, 5), 410, 287, fill=False, lw=1.0, ec=INK))
    ax.add_patch(Rectangle((10, 10), 400, 277, fill=False, lw=0.5, ec=INK))
    return fig, ax


def place(ax, view, xc, yc):
    im = Image.open(f'{P}/ink_{view}.png'); w = im.width / meta[view]['ppm'] * S; h = im.height / meta[view]['ppm'] * S
    ax.imshow(im, extent=(xc - w / 2, xc + w / 2, yc - h / 2, yc + h / 2), zorder=1, interpolation='lanczos')
    ax.set_xlim(0, 420); ax.set_ylim(0, 297)


def mapper(view, xc, yc):
    def f(x=0.0, y=0.0, z=0.0):
        if view == 'top':    return (xc - (y - CY) * S, yc + (x - CX) * S)
        if view == 'bottom': return (xc + (y - CY) * S, yc + (x - CX) * S)
        if view == 'side':   return (xc + (x - CX) * S, yc + (z - CZ) * S)
        if view == 'front':  return (xc + (y - CY) * S, yc + (z - CZ) * S)
        return (xc - (y - CY) * S, yc + (z - CZ) * S)
    return f


def arrows(ax, p1, p2):
    ax.annotate('', xy=p2, xytext=p1, arrowprops=dict(arrowstyle='<|-|>', lw=0.5, color=INK, shrinkA=0, shrinkB=0, mutation_scale=6), zorder=5)


def dim_h(ax, x1, x2, yl, text, r1, r2, below=False):
    s1 = 1.6 if yl >= r1 else -1.6; s2 = 1.6 if yl >= r2 else -1.6
    ax.plot([x1, x1], [r1, yl + s1], color=INK, lw=0.3, zorder=4); ax.plot([x2, x2], [r2, yl + s2], color=INK, lw=0.3, zorder=4)
    arrows(ax, (x1, yl), (x2, yl))
    ax.text((x1 + x2) / 2, yl + (-0.8 if below else 0.8), text, ha='center', va='top' if below else 'bottom', fontsize=FS, color=INK, zorder=6,
            bbox=dict(fc='white', ec='none', pad=0.2))


def dim_v(ax, y1, y2, xl, text, r1, r2, left=False):
    s1 = 1.6 if xl >= r1 else -1.6; s2 = 1.6 if xl >= r2 else -1.6
    ax.plot([r1, xl + s1], [y1, y1], color=INK, lw=0.3, zorder=4); ax.plot([r2, xl + s2], [y2, y2], color=INK, lw=0.3, zorder=4)
    arrows(ax, (xl, y1), (xl, y2))
    ax.text(xl + (-0.8 if left else 0.8), (y1 + y2) / 2, text, ha='right' if left else 'left', va='center', rotation=90, fontsize=FS, color=INK, zorder=6,
            bbox=dict(fc='white', ec='none', pad=0.2))


def vtitle(ax, x, y, t, sub, ha='center'):
    ax.text(x, y, t, fontsize=FSB, fontweight='bold', color=ACC, ha=ha, va='center')
    ax.text(x, y - 3.8, sub, fontsize=FS, color=INK, ha=ha, va='center')


def cline(ax, p1, p2):
    ax.plot([p1[0], p2[0]], [p1[1], p2[1]], color='#b91c1c', lw=0.35, dashes=(8, 2, 1.5, 2), zorder=3)


def leader(ax, xy, xyt, text, ha='center'):
    ax.annotate(text, xy=xy, xytext=xyt, fontsize=FS, color=INK, ha=ha, va='center', arrowprops=dict(arrowstyle='-', lw=0.4, color=INK), zorder=6,
                bbox=dict(fc='white', ec='none', pad=0.2))


def crop_alpha(path, thr=40):
    arr = np.asarray(Image.open(path).convert('RGBA')).copy()
    a = arr[..., 3].astype(float)
    arr[..., 3] = (np.clip((a - 75) / (255 - 75), 0, 1) * 255).astype('uint8')   # quita la sombra tenue y deja la de contacto
    ys, xs = np.where(arr[..., 3] > thr)
    return Image.fromarray(arr).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def model3d(ax, files, x0=262, x1=406, y_top=283, y_bottom=64):
    ax.text((x0 + x1) / 2, y_top + 0.5, 'MODELO 3D (sin escala)', fontsize=FSB, fontweight='bold', color=ACC, ha='center', va='bottom')
    n = len(files); slot_h = (y_top - y_bottom - 4) / n
    for i, f in enumerate(files):
        im = crop_alpha(f'{R}/{f}')
        w = x1 - x0; h = w * im.height / im.width
        if h > slot_h - 2: h = slot_h - 2; w = h * im.width / im.height
        cy = y_top - 4 - slot_h * (i + 0.5)
        ax.imshow(im, extent=((x0 + x1) / 2 - w / 2, (x0 + x1) / 2 + w / 2, cy - h / 2, cy + h / 2), zorder=2, interpolation='lanczos')
    ax.set_xlim(0, 420); ax.set_ylim(0, 297)


def strip(ax, notes, hoja, total, vistas, titulo):
    ax.add_patch(Rectangle((10, 10), 222, 48, fill=False, lw=0.6, ec=INK))
    ax.text(12, 55, 'NOTAS', fontsize=FS, fontweight='bold', color=ACC, va='center')
    y = 51.2
    for n in notes:
        lines = n['lines']
        for j, ln in enumerate(lines):
            ax.text(12 + (0 if j == 0 else 4), y, (n['k'] + ' ' if j == 0 else '') + ln, fontsize=FS, color=INK, va='center')
            y -= 3.55
        y -= 0.3
    # rótulo
    x0, w = 240, 170
    ax.add_patch(Rectangle((x0, 10), w, 48, fill=False, lw=0.8, ec=INK))
    rows = [
        ('TÍTULO', titulo, 'CÓDIGO', 'PF-GA-001'),
        ('PROYECTO', 'Plataforma robótica móvil educativa', 'REVISIÓN', 'A · 20/11/2026'),
        ('MATERIAL / PROCESO', 'No definido (modelo CAD de referencia)', 'UNIDADES', 'mm'),
        ('ESCALA', vistas, 'HOJA', f'{hoja} / {total}'),
        ('RESPONSABLE DE DOCUMENTACIÓN', 'Koba Chajchir', 'ESTADO', 'PRELIMINAR'),
    ]
    yy = 58
    rh = 48 / 6.0
    for i, (k1, v1, k2, v2) in enumerate(rows):
        ax.plot([x0, x0 + w], [yy - rh * (i + 1) - 0.0, yy - rh * (i + 1)], color=INK, lw=0.3)
        ax.text(x0 + 1.5, yy - rh * i - 1.7, k1, fontsize=5.4, color='#4b5563', va='center')
        ax.text(x0 + 1.5, yy - rh * i - 5.0, v1, fontsize=FS, color=INK, va='center')
        ax.text(x0 + 118, yy - rh * i - 1.7, k2, fontsize=5.4, color='#4b5563', va='center')
        ax.text(x0 + 118, yy - rh * i - 5.0, v2, fontsize=FS, color=INK, va='center', fontweight='bold' if k2 in ('ESTADO',) else 'normal')
        ax.plot([x0 + 116, x0 + 116], [yy - rh * i, yy - rh * (i + 1)], color=INK, lw=0.3)
    ax.text(x0 + 1.5, 10 + 1.6, 'Estado documental: cotas generales del CAD; acotado funcional y tolerancias pendientes. No apto para fabricación.', fontsize=5.4, color=INK, va='center')


NOTES_COMUNES = [
    dict(k='1.', lines=['Cotas en mm. Origen: centro de la placa inferior; x hacia adelante, y a la izquierda, z hacia arriba desde el piso.']),
    dict(k='2.', lines=['Vistas ortogonales independientes a escala 1:4; el alzado lateral se mira desde el lado derecho (frente hacia la derecha).']),
    dict(k='3.', lines=['Vistas generadas de la malla exportada de Fusion (refinamiento medio); no son un Drawing nativo asociativo.',
                        'Las cotas salen de la geometría del CAD (caja envolvente), no de los píxeles.']),
    dict(k='4.', lines=['Modelo 3D: render del sólido real, sin escala. La interfaz de la pantalla es ilustrativa.']),
    dict(k='5.', lines=['Plano preliminar: sin tolerancias, ajustes ni materiales definidos.']),
]

# ===================================================== HOJA 1 =====================================================
fig, ax = new_sheet()
# --- alzado lateral ---
POSs = (100, 236); place(ax, 'side', *POSs); s_ = mapper('side', *POSs)
Yb0 = s_(z=0)[1]; Yt0 = s_(z=ZMAX)[1]
cline(ax, s_(x=95, z=-6), s_(x=95, z=91)); cline(ax, s_(x=-125, z=-6), s_(x=-125, z=60)); cline(ax, s_(x=102, z=146), s_(x=102, z=ZMAX + 8))
pts = [XMIN, -125.0, 95.0, XMAX]
for a, b in zip(pts[:-1], pts[1:]):
    dim_h(ax, s_(x=a)[0], s_(x=b)[0], Yb0 - 7, f'{b - a:g}'.replace('.', ','), Yb0, Yb0, below=True)
dim_h(ax, s_(x=XMIN)[0], s_(x=XMAX)[0], Yb0 - 14.5, 'Largo total 340', Yb0, Yb0, below=True)
dim_h(ax, s_(x=67)[0], s_(x=137)[0], Yt0 + 6, 'LiDAR 70', Yt0, Yt0)
dim_h(ax, s_(x=-124)[0], s_(x=134)[0], Yt0 + 13.5, 'Placa superior 258', s_(z=146)[1], s_(z=146)[1])
dim_h(ax, s_(x=-150)[0], s_(x=150)[0], Yt0 + 21, 'Placa inferior 300', s_(z=88)[1], s_(z=88)[1])
Xs = s_(x=XMAX)[0]
dim_v(ax, s_(z=0)[1], s_(z=85)[1], Xs + 7, '85', Xs + 1, Xs + 1)
dim_v(ax, s_(z=88)[1], s_(z=143)[1], Xs + 7, '55', Xs + 1, Xs + 1)
dim_v(ax, s_(z=146)[1], s_(z=ZMAX)[1], Xs + 7, '67,5', Xs + 1, Xs + 1)
dim_v(ax, s_(z=0)[1], s_(z=ZMAX)[1], Xs + 15, 'Alto total 213,5', Xs + 1, Xs + 1)
Xs0 = s_(x=XMIN)[0]
dim_v(ax, s_(z=80.78)[1], s_(z=150.08)[1], Xs0 - 6, 'Pantalla 69,3', Xs0 - 1, Xs0 - 1, left=True)
wx, wy = s_(x=95, z=42.5)
leader(ax, (wx - 10.3, wy - 1.0), (wx - 28, wy - 4.0), 'Ø85 × 16\neje z = 42,5')
cx_, cy_ = s_(x=-142, z=25)
leader(ax, (cx_ - 5.5, cy_ - 1.0), (cx_ - 21, cy_ - 8.0), 'Ø50 × 20')
vtitle(ax, POSs[0], 186.5, 'ALZADO LATERAL (DERECHO)', 'Escala 1:4')

# --- planta ---
POSt = (100, 121); place(ax, 'top', *POSt); t_ = mapper('top', *POSt)
Xr = t_(y=-YMAX)[0]; Yt = t_(x=XMAX)[1]; Yb = t_(x=XMIN)[1]
cline(ax, t_(x=XMIN - 8, y=0), t_(x=XMAX + 8, y=0)); cline(ax, t_(x=95, y=YMAX + 6), t_(x=95, y=-YMAX - 6)); cline(ax, t_(x=-125, y=40), t_(x=-125, y=-40))
pts = [-187.35, -150.0, -125.0, 0.0, 95.0, XMAX]
for a, b in zip(pts[:-1], pts[1:]):
    dim_v(ax, t_(x=a)[1], t_(x=b)[1], Xr + 7, f'{b - a:g}'.replace('.', ','), Xr + 1, Xr + 1)
dim_v(ax, t_(x=XMIN)[1], t_(x=XMAX)[1], Xr + 15, 'Largo total 340', Xr + 1, Xr + 1)
dim_h(ax, t_(y=98)[0], t_(y=-98)[0], Yt + 6, 'Ancho de vía 196', t_(x=95, y=98)[1], t_(x=95, y=-98)[1])
dim_h(ax, t_(y=109)[0], t_(y=-109)[0], Yt + 13.5, 'Ancho total 218', t_(x=95, y=109)[1], t_(x=95, y=-109)[1])
dim_h(ax, t_(y=90)[0], t_(y=-90)[0], Yb - 7, 'Placa inferior 180', t_(x=-150, y=90)[1], t_(x=-150, y=-90)[1], below=True)
dim_h(ax, t_(y=63.45)[0], t_(y=-63.45)[0], Yb - 14.5, 'Pantalla 126,9', t_(x=XMIN, y=63.45)[1], t_(x=XMIN, y=-63.45)[1], below=True)
Xl = t_(y=YMAX)[0]
dim_v(ax, t_(x=-125)[1], t_(x=95)[1], Xl - 7, 'Eje – pivote 220', Xl - 1, Xl - 1, left=True)
lx, ly = t_(x=102, y=0)
leader(ax, (lx, ly), (lx - 33, ly + 14), 'LiDAR, eje x = +102')
vtitle(ax, 40, 171.5, 'PLANTA', 'Escala 1:4', ha='left')
ax.annotate('', xy=(Xl - 7, Yt), xytext=(Xl - 7, Yt - 13), arrowprops=dict(arrowstyle='-|>', color=INK, lw=0.9))
ax.text(Xl - 7, Yt - 16, 'FRENTE', fontsize=FS, ha='center', va='center', fontweight='bold', color=INK)

# --- cuadro de cotas principales ---
bx0, by0, bw, bh = 168, 66, 86, 216
ax.add_patch(Rectangle((bx0, by0), bw, bh, fill=False, lw=0.6, ec=INK))
ax.text(bx0 + bw / 2, by0 + bh - 4, 'CUADRO DE COTAS GENERALES', fontsize=FSB - 0.5, fontweight='bold', color=ACC, ha='center', va='center')
items = [
    ('Largo total', '340'), ('Ancho total', '218'), ('Alto total', '213,5'), (None, None),
    ('Placa inferior', '300 × 180 × 3'), ('  cara inferior a', 'z = 85'), ('Placa superior', '258 × 154 × 3'), ('  cara inferior a', 'z = 143'),
    ('Luz entre placas', '55'), ('Pilares pasantes', '6'), ('  x', '−96 · 0 · +96'), ('  y', '± 65'), (None, None),
    ('Ruedas motrices', 'Ø85 × 16'), ('  eje en x =', '+95'), ('  eje en z =', '42,5'), ('Ancho de vía', '196'), (None, None),
    ('Rueda loca', 'Ø50 × 20'), ('  pivote en x =', '−125'), ('Eje – pivote', '220'), (None, None),
    ('LiDAR (cuerpo)', '70 × 70'), ('  tope en z =', '213,5'), ('  eje en x =', '+102'), ('Adaptador LiDAR', '80 × 80 × 4'), (None, None),
    ('Pantalla (proyectada)', '126,9 × 69,3'), ('  inclinación', '12°'), ('  borde trasero x =', '−187,35'),
]
yy = by0 + bh - 11
for k, v in items:
    if k is None:
        yy -= 2.2; continue
    ax.text(bx0 + 3, yy, k, fontsize=FS, color=INK, va='center'); ax.text(bx0 + bw - 3, yy, v, fontsize=FS, color=INK, va='center', ha='right', fontweight='bold')
    yy -= 5.7

model3d(ax, ['portada.png', 'materias.png'])
strip(ax, NOTES_COMUNES, 1, 2, 'Alzado lateral y planta 1:4 · 3D sin escala', 'Vistas generales acotadas — alzado lateral y planta')
fig.savefig(f'{P}/Plano_PF-GA-001_hoja1.pdf', dpi=200); fig.savefig(f'{P}/Plano_PF-GA-001_hoja1.png', dpi=200)
plt.close(fig)

# ===================================================== HOJA 2 =====================================================
fig, ax = new_sheet()
# --- frontal ---
POSf = (75, 236); place(ax, 'front', *POSf); f_ = mapper('front', *POSf)
Yb0 = f_(z=0)[1]; Yt0 = f_(z=ZMAX)[1]
cline(ax, f_(z=-6), f_(z=ZMAX + 8))
dim_h(ax, f_(y=98)[0], f_(y=-98)[0], Yb0 - 7, 'Ancho de vía 196', Yb0, Yb0, below=True)
dim_h(ax, f_(y=109)[0], f_(y=-109)[0], Yb0 - 14.5, 'Ancho total 218', Yb0, Yb0, below=True)
dim_h(ax, f_(y=77)[0], f_(y=-77)[0], Yt0 + 6, 'Placa superior 154', f_(z=146)[1], f_(z=146)[1])
dim_h(ax, f_(y=90)[0], f_(y=-90)[0], Yt0 + 13.5, 'Placa inferior 180', f_(z=88)[1], f_(z=88)[1])
Xf = f_(y=-YMAX)[0]
dim_v(ax, f_(z=0)[1], f_(z=ZMAX)[1], f_(y=YMAX)[0] + 7, 'Alto total 213,5', f_(y=YMAX)[0] + 1, f_(y=YMAX)[0] + 1)
dim_v(ax, f_(z=0)[1], f_(z=85)[1], Xf - 7, '85', Xf - 1, Xf - 1, left=True)
vtitle(ax, POSf[0], 186.5, 'ALZADO FRONTAL', 'Escala 1:4')

# --- posterior ---
POSr = (190, 236); place(ax, 'rear', *POSr); r_ = mapper('rear', *POSr)
Yb0 = r_(z=0)[1]; Yt0 = r_(z=ZMAX)[1]
cline(ax, r_(z=-6), r_(z=ZMAX + 8))
dim_h(ax, r_(y=109)[0], r_(y=-109)[0], Yb0 - 7, 'Ancho total 218', Yb0, Yb0, below=True)
dim_h(ax, r_(y=63.45)[0], r_(y=-63.45)[0], Yt0 + 6, 'Pantalla 126,9', r_(z=150.08)[1], r_(z=150.08)[1])
dim_h(ax, r_(y=90)[0], r_(y=-90)[0], Yt0 + 13.5, 'Placa inferior 180', r_(z=88)[1], r_(z=88)[1])
Xr2 = r_(y=-YMAX)[0]
dim_v(ax, r_(z=0)[1], r_(z=ZMAX)[1], Xr2 + 15, 'Alto total 213,5', Xr2 + 1, Xr2 + 1)
dim_v(ax, r_(z=80.78)[1], r_(z=150.08)[1], Xr2 + 7, 'Pantalla 69,3', Xr2 + 1, Xr2 + 1)
vtitle(ax, POSr[0], 186.5, 'ALZADO POSTERIOR', 'Escala 1:4')

# --- planta inferior ---
POSb = (130, 121); place(ax, 'bottom', *POSb); b_ = mapper('bottom', *POSb)
Yt = b_(x=XMAX)[1]; Yb = b_(x=XMIN)[1]; Xb = b_(y=YMAX)[0]
cline(ax, b_(x=XMIN - 8, y=0), b_(x=XMAX + 8, y=0)); cline(ax, b_(x=95, y=YMAX + 6), b_(x=95, y=-YMAX - 6)); cline(ax, b_(x=-125, y=40), b_(x=-125, y=-40))
dim_v(ax, b_(x=XMIN)[1], b_(x=XMAX)[1], Xb + 7, 'Largo total 340', Xb + 1, Xb + 1)
dim_v(ax, b_(x=-125)[1], b_(x=95)[1], b_(y=-YMAX)[0] - 7, 'Eje – pivote 220', b_(y=-YMAX)[0] - 1, b_(y=-YMAX)[0] - 1, left=True)
dim_h(ax, b_(y=98)[0], b_(y=-98)[0], Yt + 6, 'Ancho de vía 196', b_(x=95, y=98)[1], b_(x=95, y=-98)[1])
dim_h(ax, b_(y=109)[0], b_(y=-109)[0], Yt + 13.5, 'Ancho total 218', b_(x=95, y=109)[1], b_(x=95, y=-109)[1])
XlB = b_(y=-YMAX)[0]
ax.annotate('', xy=(XlB - 7, Yt), xytext=(XlB - 7, Yt - 13), arrowprops=dict(arrowstyle='-|>', color=INK, lw=0.9))
ax.text(XlB - 7, Yt - 16, 'FRENTE', fontsize=FS, ha='center', va='center', fontweight='bold', color=INK)
vtitle(ax, 40, 171.5, 'PLANTA INFERIOR', 'Escala 1:4 · vista desde abajo', ha='left')

model3d(ax, ['idea.png', 'chasis.png'])
strip(ax, NOTES_COMUNES, 2, 2, 'Alzados frontal y posterior, planta inferior 1:4 · 3D sin escala', 'Vistas generales acotadas — alzados y planta inferior')
fig.savefig(f'{P}/Plano_PF-GA-001_hoja2.pdf', dpi=200); fig.savefig(f'{P}/Plano_PF-GA-001_hoja2.png', dpi=200)
print('ok')
