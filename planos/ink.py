import numpy as np
from PIL import Image, ImageFilter

P = 'D:/ProyectoFinal/planos'


def ink(view, thr=0.045, thick=5):
    im = Image.open(f'{P}/v_{view}.png').convert('L')
    g = np.asarray(im).astype(float) / 255.0
    gb = np.asarray(im.filter(ImageFilter.GaussianBlur(1.2))).astype(float) / 255.0
    gy, gx = np.gradient(gb)
    mag = np.hypot(gx, gy)
    edge = (mag > thr * 0.35).astype(np.uint8) * 255          # contornos y cambios de plano
    # silueta: borde entre fondo blanco y modelo
    bg = (g > 0.985)
    sil = np.abs(np.gradient(bg.astype(float))[0]) + np.abs(np.gradient(bg.astype(float))[1])
    edge = np.maximum(edge, ((sil > 0.2) * 255).astype(np.uint8))
    e = Image.fromarray(edge).filter(ImageFilter.MaxFilter(thick))
    e = np.asarray(e) > 0
    tone = np.clip(0.80 + 0.20 * g, 0, 1)                    # relleno gris muy claro
    out = np.where(bg[..., None], 1.0, tone[..., None]) * np.ones((1, 1, 3))
    out[e] = 0.07
    Image.fromarray((out * 255).astype('uint8')).save(f'{P}/ink_{view}.png')
    print(view, im.size)


if __name__ == '__main__':
    for v in ('top', 'side', 'front', 'rear', 'bottom'):
        ink(v)
    for v in ('side',):
        i = Image.open(f'{P}/ink_{v}.png'); i.resize((i.width // 3, i.height // 3), Image.LANCZOS).save(f'{P}/prev_ink_{v}.png')
