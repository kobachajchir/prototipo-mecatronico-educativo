def edit(fn, pairs):
    s = open(fn, encoding='utf-8').read()
    for a, b in pairs:
        assert a in s, (fn, a[:70])
        s = s.replace(a, b, 1)
    open(fn, 'w', encoding='utf-8').write(s)


edit('assemble.py', [
    # BOM: add Waveshare row and new subtotal
    ("    r('ESP32 DevKit V1', 'Argentina', 'Starware', '20.470'),\n",
     "    r('Waveshare ESP32-P4 · pantalla táctil 5″', 'Argentina', 'Mercado Libre', '145.200'),\n    r('ESP32 DevKit V1', 'Argentina', 'Starware', '20.470'),\n"),
    ("s10 = rep(s10, \"td('1.384.376'\", \"td('1.259.646'\")", "s10 = rep(s10, \"td('1.384.376'\", \"td('1.404.846'\")"),
    ("'Pantalla por definir, no incluida: Waveshare 5″ ARS 145.200 o Raspberry Pi Touch Display 2 de 7″ ARS 197.163.'",
     "'Rama de 5 V de la pantalla Waveshare: a cargo del taller.'"),
    # costs
    ("'ARS 1.259.646', 'Pi 5 de 4 GB, LiDAR L1 PM y ESP32 DevKit V1. Con 10 % de envío; sin IVA, aduana ni pantalla.'",
     "'ARS 1.404.846', 'Pi 5 de 4 GB, LiDAR L1 PM, ESP32 DevKit V1 y pantalla Waveshare. Con 10 % de envío; sin IVA ni aduana.'"),
    ("'ARS 1.184.616'", "'ARS 1.329.816'"),
    ("'ARS 1.701.989'", "'ARS 1.847.189'"),
    ("'Pantalla: sumar ARS 145.200 (Waveshare 5″) o ARS 197.163 (Pi Touch Display 2). Envío a Argentina, impuestos, aduana y adaptador USB–UART.'",
     "'Envío a Argentina, impuestos, aduana, adaptador USB–UART y el enlace de la pantalla con el robot.'"),
    # power load row 4
    ("['CONTROL', 'ESP32 DevKit V1', 'Controlador de tracción', C.C, C.Cd, '5 V', 'por VIN o USB']",
     "['CONTROL Y PANTALLA', 'ESP32 DevKit + Waveshare', 'DevKit por VIN; pantalla por USB-C', C.C, C.Cd, '5 V', 'por VIN y USB-C']"),
    ("'RAMA DE 5 V', 'Alimentación del ESP32', 'Entrada de 5 V por VIN o USB', 'por definir', 'TALLER'",
     "'RAMA DE 5 V', 'Alimentación de DevKit y pantalla', 'Rama de 5 V a cargo del taller', 'por definir', 'TALLER'"),
])
edit('new_sections.js', [
    ("['Interfaz local', 'Pantalla táctil: Waveshare 5″ o Raspberry Pi Touch Display 2 de 7″', 'Por definir'],",
     "['Interfaz local', 'Pantalla táctil de 5″ Waveshare ESP32-P4', 'Preferida · enlace por definir'],"),
])
edit('new2.js', [
    ("['Pantalla', 'Waveshare ESP32-P4 de 5″ (ARS 145.200) o Raspberry Pi Touch Display 2 de 7″ (ARS 197.163)', 'Por definir'],",
     "['Pantalla Waveshare ESP32-P4', 'Enlace con la Pi o con el DevKit: UART, USB o Wi-Fi', 'Por definir'],"),
    ("'Componentes por unos ARS 1,26 M sin pantalla. Financiamiento por consultar.'",
     "'Componentes por unos ARS 1,40 M. Financiamiento por consultar.'"),
    ("    ['IMU opcional', 'I²C (Qwiic) a la Pi o al ESP32', 'Por definir'],\n",
     "    ['IMU opcional', 'I²C (Qwiic) a la Pi o al ESP32', 'Por definir'],\n    ['Pantalla Waveshare', 'Enlace con la Pi o el DevKit: UART, USB o Wi-Fi', 'Por definir'],\n"),
])
print('ok')
