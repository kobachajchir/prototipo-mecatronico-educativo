s = open('gen_images.py', encoding='utf-8').read()
s = s.replace("render('lidar.png', P, hcol, proj, (1280, 720))", "render('lidar_wide.png', P, hcol, proj, (1280, 720))")
s = s.replace("render('fused.png', P, fused, proj, (1280, 720), emph=inside)", "render('fused_wide.png', P, fused, proj, (1280, 720), emph=inside)")

block = '''
# ---------------- vistas desde la cámara (misma escena y mismo encuadre que cam.png) ----------------
N2 = 120000
i2 = np.arange(N2)
dz2 = 1 - (i2 + 0.5) / N2
phi2 = i2 * np.pi * (3 - np.sqrt(5))
rxy2 = np.sqrt(1 - dz2 ** 2)
DL2 = np.stack([rxy2 * np.cos(phi2), rxy2 * np.sin(phi2), dz2], 1)
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
    ax.plot([0, 1280], [360, 360], color='#94a3b8', lw=1.2, ls='--')
    ax.text(14, 392, 'Horizonte del sensor: debajo no hay puntos (el hemisferio mira hacia arriba)', color='#94a3b8', fontsize=15)
    fig.savefig(os.path.join(OUT, fname), dpi=100, facecolor=fig.get_facecolor())
    plt.close(fig)


allsel = np.ones(len(P2), dtype=bool)
render_cam('lidar.png', P2, plt.cm.turbo(np.clip(P2[:, 2] / 2.7, 0, 1))[:, :3], allsel)
render_cam('fused.png', P2, np.clip(rgb2 * 1.15, 0, 1), in2)
print('vista de camara:', int(in2.sum()), 'puntos en el encuadre')
'''
marker = "print('imagenes OK'"
assert marker in s
s = s.replace(marker, block + "\n" + marker, 1)
open('gen_images.py', 'w', encoding='utf-8').write(s)

n = open('new3.js', encoding='utf-8').read()
n = n.replace("AS('lidar.png'), x: 0.7, y: 1.6, w: 7.0, h: 3.94", "AS('lidar_wide.png'), x: 0.7, y: 1.6, w: 7.0, h: 3.94")
n = n.replace("['Unitree L1 PM', 'Nube de puntos por altura']", "['Unitree L1 PM', 'Nube desde la cámara · color por altura']")
n = n.replace("['Reconstrucción conjunta', 'Puntos con el color de la cámara']", "['Reconstrucción conjunta', 'Mismos puntos con el color de la cámara']")
n = n.replace("'Cada punto del LiDAR toma el color de la imagen de la cámara. Imágenes simuladas.'", "'Misma escena y mismo encuadre: cada punto del LiDAR toma el color de la imagen. Imágenes simuladas.'")
n = n.replace("'Con el eje hacia arriba el LiDAR solo comparte con la cámara una franja de 0° a 14° sobre el horizonte, y por eso solo esos puntos reciben color.'", "'Nube acumulada de ≈ 5 s con el robot quieto. Con el eje hacia arriba, el LiDAR solo comparte con la cámara la franja de 0° a 14° sobre el horizonte.'")
open('new3.js', 'w', encoding='utf-8').write(n)
print('ok')
