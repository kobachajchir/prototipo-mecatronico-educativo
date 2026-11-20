s = open('assemble.py', encoding='utf-8').read()
marker = "secs['08'] = s8"
block = '''INS = """  partCard(s, 9.95, 3.2, 2.9, 0.8, C.C, C.Cd, 'PANTALLA · HMI', 'Waveshare ESP32-P4 · 5″ táctil', 'Panel de operación del robot', '· ARS 145.200 · Mercado Libre', 'COMPRAR');
  wire(s, [[8.5, 3.6], [9.95, 3.6]], WIRE.tbd, true);
  lab(s, 'por definir', 8.55, 3.35, 1.35, WIRE.tbd, 'center', true);
  lab(s, 'UART, USB o Wi-Fi', 8.55, 3.66, 1.35, C.sub);
"""
s8 = rep(s8, "  // right: Cytron + motors\\n", INS + "  // right: Cytron + motors\\n")
'''
assert marker in s
s = s.replace(marker, block + marker, 1)
open('assemble.py', 'w', encoding='utf-8').write(s)
print('ok')
