import numpy as np
from PIL import Image, ImageFilter, ImageDraw

BASE = 'D:/ProyectoFinal/renders/02_iso_trasera_izquierda.png'
SHOT = 'D:/ProyectoFinal/_cdp/pantalla_nuestro_auto.png'
OUT_FULL = 'D:/ProyectoFinal/renders/10_composicion_pantalla_control_manual.png'
OUT_DET = 'D:/ProyectoFinal/renders/11_detalle_pantalla_control_manual.png'
S = 3

base = Image.open(BASE).convert('RGB')
W, H = base.size
shot = Image.open(SHOT).convert('RGB')
sw, sh = shot.size

# esquinas del área activa de la pantalla en el render (px originales): TL, TR, BR, BL
quad = [(1362.3, 561.0), (1568.0, 509.3), (1586.5, 653.0), (1381.0, 706.0)]
quad = [(x * S, y * S) for x, y in quad]

big = base.resize((W * S, H * S), Image.LANCZOS)

# caja de trabajo alrededor del cuadrilátero
pad = 40 * S
x0 = int(min(p[0] for p in quad)) - pad; x1 = int(max(p[0] for p in quad)) + pad
y0 = int(min(p[1] for p in quad)) - pad; y1 = int(max(p[1] for p in quad)) + pad
bw, bh = x1 - x0, y1 - y0
dst = [(x - x0, y - y0) for x, y in quad]
src = [(0, 0), (sw, 0), (sw, sh), (0, sh)]


def coeffs(dst_pts, src_pts):
    A = []; B = []
    for (x, y), (X, Y) in zip(dst_pts, src_pts):
        A.append([x, y, 1, 0, 0, 0, -X * x, -X * y]); B.append(X)
        A.append([0, 0, 0, x, y, 1, -Y * x, -Y * y]); B.append(Y)
    return np.linalg.solve(np.array(A, float), np.array(B, float))


c = coeffs(dst, src)
warped = shot.transform((bw, bh), Image.PERSPECTIVE, tuple(c), Image.BICUBIC)
mask = Image.new('L', (sw, sh), 255).transform((bw, bh), Image.PERSPECTIVE, tuple(c), Image.BILINEAR)
# borde suave de 1 px
mask = mask.filter(ImageFilter.GaussianBlur(S * 0.5))

# efecto de vidrio: leve reflejo diagonal y un poco menos de brillo
arr = np.asarray(warped).astype(float) * 0.93
yy, xx = np.mgrid[0:bh, 0:bw]
t = (xx / bw * 0.6 + yy / bh * 0.4)
refl = np.clip(0.12 - 0.22 * np.abs(t - 0.38), 0, 0.12)[..., None]
arr = arr * (1 - refl) + 255 * refl
warped = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))

region = big.crop((x0, y0, x1, y1))
# resplandor suave de la pantalla sobre el marco
glow = warped.copy(); glow.putalpha(mask)
glow_l = Image.new('RGB', (bw, bh), (0, 0, 0)); glow_l.paste(warped, (0, 0), mask)
glow_b = glow_l.filter(ImageFilter.GaussianBlur(10 * S))
glow_a = np.asarray(glow_b).astype(float) * 0.28
region = Image.fromarray(np.clip(np.asarray(region).astype(float) + glow_a, 0, 255).astype('uint8'))
region.paste(warped, (0, 0), mask)
big.paste(region, (x0, y0))

final = big.resize((W, H), Image.LANCZOS)
final.save(OUT_FULL)

# detalle ampliado del robot con la pantalla
dx0, dy0, dx1, dy1 = int(1250 * S), int(430 * S), int(1700 * S), int(780 * S)
det = big.crop((dx0, dy0, dx1, dy1))
det.save(OUT_DET)
print('ok', final.size, det.size)
