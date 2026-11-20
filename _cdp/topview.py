import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SS = 4                 # supersampling
PPM = 1.5 * SS         # px por mm (1,5 px/mm en la captura final)
W_MM, H_MM = 380, 360  # lienzo (mm)
CW, CH = int(W_MM * PPM), int(H_MM * PPM)
CX0, CX1 = -11.4, 0.0   # centro del bbox del robot (x adelante, y izquierda)


def P(x, y):
    """mm del robot (x adelante, y izquierda) -> px del lienzo (adelante = arriba)"""
    return (CW / 2 - (y - CX1) * PPM, CH / 2 - (x - CX0) * PPM)


def rect(d, x0, x1, y0, y1, fill, r=0, outline=None, ow=1):
    a = P(x1, y1); b = P(x0, y0)   # esquina sup-izq = (x1, y1)
    box = [min(a[0], b[0]), min(a[1], b[1]), max(a[0], b[0]), max(a[1], b[1])]
    if r > 0:
        d.rounded_rectangle(box, radius=r * PPM, fill=fill, outline=outline, width=ow)
    else:
        d.rectangle(box, fill=fill, outline=outline, width=ow)


def circle(d, x, y, rad, fill, outline=None, ow=1):
    cx, cy = P(x, y)
    d.ellipse([cx - rad * PPM, cy - rad * PPM, cx + rad * PPM, cy + rad * PPM], fill=fill, outline=outline, width=ow)


def arc_slot(d, R, ang, centre_deg, w, fill):
    n = 40
    pts = []
    for i in range(n + 1):
        th = math.radians(centre_deg + (-ang / 2 + ang * i / n))
        pts.append(P(R * math.cos(th), R * math.sin(th)))
    d.line(pts, fill=fill, width=int(w * PPM), joint='curve')
    for p in (pts[0], pts[-1]):
        r = w * PPM / 2
        d.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=fill)


def shade(layer, mask_box_fn=None, strength=0.10):
    """degradé suave tipo luz arriba-izquierda sobre una capa RGBA"""
    arr = np.asarray(layer).astype(float)
    yy, xx = np.mgrid[0:arr.shape[0], 0:arr.shape[1]]
    g = 1 + strength * (0.5 - (xx / arr.shape[1] * 0.45 + yy / arr.shape[0] * 0.55))
    arr[..., :3] = np.clip(arr[..., :3] * g[..., None], 0, 255)
    return Image.fromarray(arr.astype('uint8'), 'RGBA')


canvas = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))

# ---------- sombra suave ----------
sh = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
rect(sd, -150, 150, -90, 90, (0, 0, 0, 150), 8)
for sy in (-1, 1):
    rect(sd, 60 - 42.5, 60 + 42.5, sy * 104 - 8 if sy > 0 else sy * 120, sy * 120 if sy > 0 else sy * 104 + 8, (0, 0, 0, 150), 5)
rect(sd, -175.5, -152, -63, 63, (0, 0, 0, 140), 3)
sh = sh.filter(ImageFilter.GaussianBlur(7 * SS))
sh = Image.fromarray(np.roll(np.asarray(sh), (int(3 * SS), int(2 * SS)), axis=(0, 1)))
canvas.alpha_composite(sh)

# ---------- ruedas motrices (Ø85 x 16), eje a x = +60 ----------
AX = 60.0
layer = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); d = ImageDraw.Draw(layer)
for sy in (-1, 1):
    y_in, y_out = (104, 120) if sy > 0 else (-120, -104)
    # soporte de motor entre placa y rueda
    rect(d, AX - 18, AX + 18, 88 if sy > 0 else -104, 104 if sy > 0 else -88, (198, 202, 207, 255), 2)
    # neumático
    rect(d, AX - 42.5, AX + 42.5, y_in if sy > 0 else y_in, y_out if sy > 0 else y_out, (22, 23, 26, 255), 6, outline=(60, 62, 68, 255), ow=int(1.2 * SS))
    # surcos de la banda
    for k in range(-6, 7):
        xx = AX + k * 6.3
        a = P(xx, y_in + 2.2); b = P(xx, y_out - 2.2)
        d.line([a, b], fill=(46, 48, 54, 255), width=int(1.1 * SS))
    # buje (tapa de la llanta, visible de canto)
    rect(d, AX - 9, AX + 9, (y_out if sy > 0 else y_in) - (1.5 if sy > 0 else -1.5) * 1, (y_out if sy > 0 else y_in) + (1.5 if sy > 0 else -1.5) * 0, (170, 175, 180, 255), 1)
canvas.alpha_composite(layer)

# ---------- placa inferior (300 x 180) ----------
lay = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
rect(d, -150, 150, -90, 90, (121, 127, 135, 255), 8, outline=(86, 91, 98, 255), ow=int(1.4 * SS))
canvas.alpha_composite(shade(lay, strength=0.12))

# ---------- placa superior (258 x 154 x 4) ----------
lay = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
rect(d, -129, 129, -77, 77, (181, 187, 195, 255), 8, outline=(140, 146, 154, 255), ow=int(1.6 * SS))
SL = (40, 43, 49, 255)
for sx in (-32, 32):
    for sy in (-30, 30):
        rect(d, sx - 12, sx + 12, sy - 2.75, sy + 2.75, SL, 2.75)
for ss in (-1, 1):
    for sx in (-48, 48):
        rect(d, sx - 18, sx + 18, ss * 62 - 2.75, ss * 62 + 2.75, SL, 2.75)
arc_slot(d, 106, 30, 0, 5.5, SL); arc_slot(d, 106, 30, 180, 5.5, SL)
arc_slot(d, 50, 50, 0, 5.5, SL); arc_slot(d, 50, 50, 180, 5.5, SL)
for sx in (-118, 118):
    for sy in (-66, 66):
        circle(d, sx, sy, 2.75, SL)
# cabezas de tornillo M5 de los pilares pasantes
for sx in (-96, 0, 96):
    for sy in (-65, 65):
        circle(d, sx, sy, 5.5, (96, 101, 108, 255), (70, 74, 80, 255), int(1.2 * SS))
        circle(d, sx, sy, 2.2, (60, 63, 69, 255))
canvas.alpha_composite(shade(lay, strength=0.14))

# ---------- soportes y pantalla trasera ----------
lay = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
for sy in (-40, 40):
    rect(d, -152, -141, sy - 7, sy + 7, (205, 209, 214, 255), 1.5)
rect(d, -175.5, -152, -63.5, 63.5, (20, 22, 26, 255), 3, outline=(96, 102, 110, 255), ow=int(1.2 * SS))
rect(d, -174.0, -153.5, -60, 60, (12, 13, 16, 255), 2)
canvas.alpha_composite(lay)

# ---------- LiDAR Unitree L1 PM sobre su adaptador (x = 78,03) ----------
LX = 78.03
lay = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
rect(d, LX - 36, LX + 36, -36, 36, (236, 238, 240, 255), 4, outline=(190, 194, 199, 255), ow=int(1.2 * SS))
for sx, sy in ((-28, -28), (-28, 28), (28, -28), (28, 28)):
    circle(d, LX + sx, sy, 2.2, (150, 155, 160, 255))
canvas.alpha_composite(lay)
dome = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); d = ImageDraw.Draw(dome)
circle(d, LX, 0, 37.5, (16, 17, 20, 255), (56, 58, 64, 255), int(1.4 * SS))
circle(d, LX, 0, 27, (24, 26, 30, 255), (44, 46, 52, 255), int(1.0 * SS))
circle(d, LX, 0, 14, (12, 13, 16, 255))
# brillo del domo
hl = Image.new('RGBA', (CW, CH), (0, 0, 0, 0)); hd = ImageDraw.Draw(hl)
cx, cy = P(LX + 12, 12)
hd.ellipse([cx - 14 * PPM, cy - 9 * PPM, cx + 14 * PPM, cy + 9 * PPM], fill=(255, 255, 255, 70))
hl = hl.filter(ImageFilter.GaussianBlur(5 * SS))
canvas.alpha_composite(dome); canvas.alpha_composite(hl)

# ---------- recorte y salida ----------
bbox = canvas.getbbox()
canvas = canvas.crop(bbox)
final = canvas.resize((canvas.width // SS, canvas.height // SS), Image.LANCZOS)
final.save('D:/ProyectoFinal/_cdp/top_robot.png')
print('top_robot', final.size)
