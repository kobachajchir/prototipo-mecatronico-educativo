"""Cinematic LiDAR shot: dark grade of the Fusion render + 360° horizontal laser scan plane.

The render is an orthographic isometric view, so a horizontal circle projects to an
ellipse whose minor/major ratio is sin(35.26°) ≈ 0.577.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

src = sys.argv[1]
out = sys.argv[2]
rng = np.random.default_rng(11)

im = Image.open(src).convert('RGB')
x0, y0, W = 1050, 80, 2375            # crop: LiDAR on the left third, 16:9
H = int(W * 9 / 16)
im = im.crop((x0, y0, x0 + W, y0 + H))
a = np.asarray(im).astype(np.float32) / 255.0
lum = a @ np.array([0.299, 0.587, 0.114], dtype=np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

# ---------- scan-plane geometry (pixels, measured on the render) ----------
cx, cy = 667.0, 622.0     # LiDAR axis at the height of the scan window
R = 356.0                 # head radius on screen
K = 0.47                  # foreshortening of horizontal circles (measured on the render)

# sensor silhouette: the black plastic is much darker than the plate and background
dark = ((lum < 0.5) & (xx > 280) & (xx < 1060) & (yy > 180) & (yy < 1000)).astype(np.uint8) * 255
m = Image.fromarray(dark).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.MinFilter(31))
m = m.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))
body = np.asarray(m.filter(ImageFilter.GaussianBlur(2)), np.float32) / 255

# ---------- night grade ----------
graded = np.power(a, 1.9) * 0.62
spec = np.clip((lum - 0.55) / 0.45, 0, 1) ** 2
graded += (spec * 0.55)[..., None] * np.array([0.75, 0.85, 1.0], dtype=np.float32)
graded = graded * np.array([0.55, 0.70, 1.0], dtype=np.float32)
graded += np.array([0.025, 0.035, 0.07], dtype=np.float32) * (1 - lum[..., None]) * 0.9
# the sensor keeps a softer grade so the glossy black plastic still reads
gb = np.power(a, 1.25) * 0.85 * np.array([0.70, 0.80, 1.0], dtype=np.float32)
gb += (spec * 0.6)[..., None] * np.array([0.8, 0.9, 1.0], dtype=np.float32)
graded = graded * (1 - body[..., None]) + gb * body[..., None]
vx = (xx - W * 0.40) / (W * 0.8)
vy = (yy - H * 0.5) / (H * 0.8)
graded *= np.clip(1 - (vx ** 2 + vy ** 2) * 0.8, 0.18, 1)[..., None]

# ---------- 360° rays in the horizontal plane ----------
u = xx - cx
v = (yy - cy) / K                      # un-squash to the plane
phi = np.arctan2(v, u)
r = np.hypot(u, v) + 1e-3
outside = np.clip((r - R) / 25, 0, 1)  # rays start on the head surface
behind = v < 0                         # far half of the plane (behind the sensor on screen)

n = 520
angles = rng.uniform(-np.pi, np.pi, n)
widths = rng.uniform(0.0006, 0.0022, n)
gains = rng.uniform(0.0, 1.0, n) ** 5.0 * 0.40 + 0.008
hero = rng.choice(n, 12, replace=False)
gains[hero] = rng.uniform(0.9, 1.5, 12)
widths[hero] *= 1.5

rays = np.zeros((H, W), np.float32)
for th, w, g in zip(angles, widths, gains):
    d = np.abs(np.angle(np.exp(1j * (phi - th))))
    rays += np.exp(-(d / w) ** 2) * g
rays *= outside * np.clip(1.3 / (1 + (r - R) / 480), 0, 1.3)

# the scan plane itself, as a faint luminous disc
disc = outside * np.clip(1.0 / (1 + (r - R) / 700), 0, 1) * 0.06
disc = np.asarray(Image.fromarray((disc * 255 * 4).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(18)), np.float32) / 255 / 4

# point cloud: hits scattered along the beams, out to the frame edges
npts = 18000
pa = rng.choice(angles, npts, p=gains / gains.sum()) + rng.normal(0, 0.003, npts)
pr = R + 30 + rng.gamma(1.5, 650, npts)
px = (cx + np.cos(pa) * pr).astype(int)
py = (cy + np.sin(pa) * pr * K).astype(int)
ok = (px >= 0) & (px < W - 2) & (py >= 0) & (py < H - 2)
px, py, pr, pa = px[ok], py[ok], pr[ok], pa[ok]
t = np.clip((pr - R) / 2400, 0, 1)
col = np.stack([0.15 + 0.25 * t, 0.60 + 0.2 * (1 - t), np.ones_like(t)], 1)
bright = rng.uniform(0.3, 1.0, px.size) * np.clip(1.5 - t * 1.2, 0.25, 1.5)
dots = np.zeros((H, W, 3), np.float32)
for ddx, ddy, f in ((0, 0, 1.0), (1, 0, 0.55), (0, 1, 0.55), (1, 1, 0.35)):
    np.add.at(dots, (py + ddy, px + ddx), col * (bright * f)[:, None])

beam_col = np.array([0.35, 0.65, 1.0], np.float32)
core_col = np.array([0.85, 0.95, 1.0], np.float32)
light = rays[..., None] * beam_col + np.power(np.clip(rays, 0, 3), 3)[..., None] * 0.08 * core_col
light += disc[..., None] * np.array([0.25, 0.5, 1.0], np.float32)
light += dots

# the emission slit: a thin glow hugging the head at the scan height (front half only)
ring = np.exp(-((r - R) / 7) ** 2) * (v > -0.15 * R)
light += (ring * 0.9)[..., None] * np.array([0.45, 0.75, 1.0], np.float32)

def blur(arr, rad):
    img = Image.fromarray(np.clip(arr * 255 / 4, 0, 255).astype(np.uint8))
    return np.asarray(img.filter(ImageFilter.GaussianBlur(rad)), np.float32) / 255 * 4

bloom = blur(light, 5) * 0.6 + blur(light, 24) * 0.45 + blur(light, 90) * 0.35
light = light + bloom

# occlusion: the far half of the plane passes behind the sensor body
# and nothing glows over the head itself (inside the plane's ellipse), except the slit ring
t = np.clip(v / (0.45 * R), 0, 1)
front_out = (t * t * (3 - 2 * t)) * np.clip((r - R) / 30, 0, 1)   # smooth: only well in front of the head
occl = body * (1 - front_out)
light *= (1 - occl)[..., None]

res = graded + light
res = res / (1 + res * 0.55)
res = np.clip(res * 1.35, 0, 1)
res += rng.normal(0, 0.012, res.shape).astype(np.float32)
Image.fromarray((np.clip(res, 0, 1) * 255).astype(np.uint8)).save(out)
Image.fromarray((body * 255).astype(np.uint8)).save(out.replace('.png', '_mask.png'))
print(out, W, H)
