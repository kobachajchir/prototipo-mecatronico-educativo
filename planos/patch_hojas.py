p = 'D:/ProyectoFinal/planos/plano_hojas.py'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert a in s, a[:70]
    s = s.replace(a, b, 1)


# 1) recorte del fondo tenue de los renders 3D
rep("""def crop_alpha(path, thr=30):
    im = Image.open(path).convert('RGBA'); a = np.asarray(im)[..., 3]
    ys, xs = np.where(a > thr)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))""",
    """def crop_alpha(path, thr=40):
    arr = np.asarray(Image.open(path).convert('RGBA')).copy()
    a = arr[..., 3].astype(float)
    arr[..., 3] = (np.clip((a - 75) / (255 - 75), 0, 1) * 255).astype('uint8')   # quita la sombra tenue y deja la de contacto
    ys, xs = np.where(arr[..., 3] > thr)
    return Image.fromarray(arr).crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))""")

# 2) llamadas del alzado lateral
rep("""leader(ax, (wx - 9.5, wy - 9.5), (wx - 25, wy - 22), 'Ø85 × 16, eje z = 42,5')""",
    """leader(ax, (wx - 10.3, wy - 1.0), (wx - 28, wy - 4.0), 'Ø85 × 16\\neje z = 42,5')""")
rep("""leader(ax, (cx_ - 5, cy_ - 4), (cx_ - 2, cy_ - 22), 'Ø50 × 20')""",
    """leader(ax, (cx_ - 5.5, cy_ - 1.0), (cx_ - 21, cy_ - 8.0), 'Ø50 × 20')""")

# 3) flecha FRENTE a la izquierda de la planta
rep("""ax.annotate('FRENTE', xy=(t_(y=0)[0] + 30, Yt + 3), xytext=(t_(y=0)[0] + 30, Yt - 12), fontsize=FS, ha='center', fontweight='bold', color=INK,
            arrowprops=dict(arrowstyle='-|>', color=INK, lw=0.8))""",
    """ax.annotate('', xy=(Xl - 7, Yt), xytext=(Xl - 7, Yt - 13), arrowprops=dict(arrowstyle='-|>', color=INK, lw=0.9))
ax.text(Xl - 7, Yt - 16, 'FRENTE', fontsize=FS, ha='center', va='center', fontweight='bold', color=INK)""")
rep("""ax.annotate('FRENTE', xy=(b_(y=0)[0] + 28, Yt + 3), xytext=(b_(y=0)[0] + 28, Yt - 12), fontsize=FS, ha='center', fontweight='bold', color=INK,
            arrowprops=dict(arrowstyle='-|>', color=INK, lw=0.8))""",
    """XlB = b_(y=-YMAX)[0]
ax.annotate('', xy=(XlB - 7, Yt), xytext=(XlB - 7, Yt - 13), arrowprops=dict(arrowstyle='-|>', color=INK, lw=0.9))
ax.text(XlB - 7, Yt - 16, 'FRENTE', fontsize=FS, ha='center', va='center', fontweight='bold', color=INK)""")
open(p, 'w', encoding='utf-8').write(s)
print('ok')
