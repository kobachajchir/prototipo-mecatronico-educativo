//### 07
{
  const s = base('Especificaciones de los componentes principales', 'Controlador de tracción, computadora de a bordo y LiDAR 3D.', 'Microcontroladores · Sistemas Embebidos · Sistemas Mecatrónicos');
  const col = (x, w, color, dark, title, sub, rows, src) => {
    card(s, x, 1.6, w, 5.15, color);
    s.addText(title, { x: x + 0.15, y: 1.68, w: w - 0.3, h: 0.35, fontFace: F, fontSize: 13.5, bold: true, color: dark, margin: 0 });
    s.addText(sub, { x: x + 0.15, y: 2.02, w: w - 0.3, h: 0.3, fontFace: F, fontSize: 9, color: C.sub, margin: 0 });
    techTable(s, [['Parámetro', 'Valor'], ...rows], x + 0.12, 2.4, w - 0.24, [1.25, w - 0.24 - 1.25], 0.34, 8.5);
    s.addText(src, { x: x + 0.15, y: 6.4, w: w - 0.3, h: 0.3, fontFace: F, fontSize: 7.5, italic: true, color: C.mute, margin: 0 });
  };
  col(0.7, 3.9, C.C, C.Cd, 'ESP32 DevKit V1', 'Controlador de tracción (ESP-WROOM-32) · ARS 20.470', [
    ['CPU', 'Xtensa LX6 de 2 núcleos, hasta 240 MHz'],
    ['Memoria', '520 KB de SRAM; flash de 4 MB típica'],
    ['Conectividad', 'Wi-Fi 802.11 b/g/n 2,4 GHz y Bluetooth 4.2 + BLE'],
    ['Lógica', '3,3 V (no tolera 5 V en los pines)'],
    ['ADC', '12 bits. ADC1: GPIO32–39. ADC2 no sirve con Wi-Fi'],
    ['Periféricos', '3 UART, 2 I²C, 3 SPI, PWM LEDC y contador de pulsos (PCNT)'],
    ['Alimentación', '5 V por USB o VIN'],
  ], 'Datasheet Espressif ESP32-WROOM-32. Los pines varían según el fabricante de la placa.');
  col(4.72, 3.9, C.P, C.Pd, 'Raspberry Pi 5 · 4 GB', 'Computadora de a bordo · ARS 325.280', [
    ['SoC', 'Broadcom BCM2712, 4 núcleos Cortex-A76 a 2,4 GHz'],
    ['Memoria', '4 GB LPDDR4X'],
    ['Red', 'Gigabit Ethernet, Wi-Fi 5 de doble banda, Bluetooth 5.0'],
    ['USB', '2 × USB 3.0 y 2 × USB 2.0'],
    ['E/S', 'GPIO de 40 pines (UART, I²C, SPI)'],
    ['Alimentación', '5 V / 5 A por USB-C PD'],
    ['Almacenamiento', 'microSD (a cargo del taller)'],
  ], 'Especificaciones generales de la Raspberry Pi 5.');
  col(8.74, 3.9, C.E, C.Ed, 'Unitree 4D LiDAR L1 PM', 'Sensor 3D con IMU · USD 249', [
    ['Campo de visión', '360° horizontal × 90° vertical'],
    ['Frecuencia', '21.600 puntos/s'],
    ['Alcance', '0,05 m (zona ciega) a 20 m con 90 % de reflectividad'],
    ['Interfaz', 'UART TTL, vía adaptador USB–UART'],
    ['Alimentación', '12 V regulados'],
    ['Masa y tamaño', '≈ 230 g · 75 × 75 × 65 mm'],
    ['Datos', 'Nube de puntos + IMU'],
  ], 'Fichas de Unitree y revendedores. El alcance de la PM se verifica con el fabricante.');
}
//### 09
{
  const s = base('Reparto de tareas entre controladores', 'Qué hace cada procesador y qué interfaces siguen abiertas.', 'Sistemas Embebidos · Sistemas Operativos y Redes · Computación II');
  const w = 3.9;
  block(s, 0.7, 1.6, w, 3.25, C.C, C.Cd, 'ESP32 DevKit V1 · tiempo real', '• Lazo PID de velocidad por rueda\n• Conteo de encoders (PCNT)\n• ADC1: corriente de ambos motores, con cero compensado y filtro del PWM\n• Lectura del sensor de línea y corrección de giro\n• PWM y dirección hacia el Cytron MDD10A', 12.5);
  block(s, 4.72, 1.6, w, 3.25, C.P, C.Pd, 'Raspberry Pi 5 · datos', '• Adquisición del LiDAR por UART y de la cámara por USB\n• Mapeo 3D y procesamiento\n• Envío de datos a la computadora externa\n• Consignas hacia el ESP32 y telemetría de vuelta\n• IA opcional (detección) como ampliación\n• Refrigeración y microSD a cargo del taller', 12.5);
  block(s, 8.74, 1.6, w, 3.25, C.gray, C.gray, 'Computadora externa', '• Interfaz web para ver lecturas y mapa\n• Procesamiento pesado\n• Reparto de cálculo entre la Pi y la PC: por definir\n• Formato de los datos: por definir', 12.5);
  s.addText('Interfaces abiertas', { x: 0.7, y: 5.0, w: 6, h: 0.3, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0 });
  techTable(s, [
    ['Enlace', 'Opciones', 'Estado'],
    ['Pi ↔ ESP32', 'UART, USB o Wi-Fi. Protocolo de consignas y telemetría', 'Por definir'],
    ['Pi → PC externa', 'Wi-Fi o Ethernet. Formato de datos', 'Por definir'],
    ['IMU opcional', 'I²C (Qwiic) a la Pi o al ESP32', 'Por definir'],
    ['Pantalla Waveshare', 'Enlace con la Pi o el DevKit: UART, USB o Wi-Fi', 'Por definir'],
  ], 0.7, 5.35, 11.95, [2.4, 7.5, 2.05], 0.33, 9.5);
}
//### 11
{
  const s = base('Aplicación por materia', 'Ensayos propuestos y señales del prototipo que usarían. Falta contrastarlos con los docentes.', 'Microcontroladores · Robótica II · Sistemas de Control · Mecanismos · Tecnología Industrial');
  techTable(s, [
    ['Materia', 'Ensayo o tema', 'Señales y recursos del prototipo'],
    ['Microcontroladores', 'Programar el control del robot y entender su funcionamiento', 'PWM, ADC1, PCNT, UART, GPIO del ESP32'],
    ['Robótica II', 'Odometría, matemática y cálculo de trayectorias', 'Encoders, IMU, geometría del chasis'],
    ['Sistemas Mecatrónicos', 'Lectura e integración de sensores y comunicación', 'Todos los sensores y los enlaces Pi–ESP–PC'],
    ['Sistemas de Control', 'Ajuste del PID y control fino de motores', 'Velocidad (encoder) y corriente de cada motor'],
    ['Mecanismos', 'Cálculo de fuerzas y esfuerzos', 'Corriente (par estimado) y cotas del chasis'],
    ['Tecnología Industrial', 'Escaneo y reproducción de objetos 3D, CAD, diseño de módulos', 'LiDAR 3D y zona de montaje de accesorios'],
  ], 0.7, 1.65, 11.95, [2.6, 5.15, 4.2], 0.68, 11);
  s.addText('Todavía no se eligió una materia inicial. Los ensayos son ejemplos del autor.', { x: 0.7, y: 6.5, w: 11.9, h: 0.3, fontFace: F, fontSize: 10.5, italic: true, color: C.sub, margin: 0 });
}
//### 14
{
  const s = base('Decisiones de diseño abiertas', 'Lo que hay que cerrar antes de fabricar.', 'Sistemas Mecatrónicos · Proyecto de Ingeniería Mecatrónica');
  techTable(s, [
    ['Tema', 'Opciones', 'Estado'],
    ['Pantalla Waveshare ESP32-P4', 'Enlace con la Pi o con el DevKit: UART, USB o Wi-Fi', 'Por definir'],
    ['Enlace Pi ↔ ESP32', 'UART, USB o Wi-Fi', 'Por definir'],
    ['Orientación del LiDAR', 'Arriba, abajo o inclinado ≈ 45° hacia adelante', 'Propuesta: inclinado · verificar en el CAD'],
    ['Modelo de IA', 'Sin IA al inicio; YOLO nano como ampliación', 'Ampliación propuesta'],
    ['Pines del ESP32', 'ADC1 (GPIO32–39) para corriente; PCNT para encoders', 'Pinout pendiente'],
    ['Regulación de 12 V del LiDAR', 'Pololu #4984 buck-boost, hasta 2,5 A típicos', 'Preferido · confirmar envío'],
    ['Protección y corte de tracción', 'Fusible, corte y baja tensión', 'Por definir (taller)'],
    ['Ruedas y cubos', 'Ø85 × 16 mm del CAD o Pololu #1435 de Ø90', 'Cubo y carga radial por cerrar'],
    ['Rueda loca', 'Goma de Ø50 mm', 'Pedir altura de montaje'],
    ['Batería', 'Probattery BSLA-1270-CPB o Yuasa NP7-12', 'Orientación, terminales y cargador'],
    ['Adaptador USB–UART', 'Incluido en el kit del LiDAR o a cargo del taller', 'Confirmar'],
    ['Placa superior', '4 mm de acero dulce, espesor preliminar', 'Depende de los accesorios'],
  ], 0.7, 1.55, 11.95, [2.7, 6.3, 2.95], 0.37, 9.5);
}
//### 15
{
  const s = base('Hoja de ruta', 'Etapas hasta tener el prototipo funcionando. La fecha es una meta.', 'Proyecto de Ingeniería Mecatrónica');
  const steps = [
    [C.P, C.Pd, '1 · Consultar', 'Encuesta a estudiantes (Google Forms) y consulta a docentes y a la facultad.'],
    [C.E, C.Ed, '2 · Confirmar piezas', 'Precios finales, envío a Argentina y adaptador USB–UART del LiDAR.'],
    [C.C, C.Cd, '3 · Cerrar el diseño', 'Pinout del ESP32, enlace Pi–ESP, alimentación, pantalla, chasis y soporte inclinado del LiDAR.'],
    [C.M, C.Md, '4 · Construir y programar', 'Armado, ajuste del PID, odometría y lectura de sensores.'],
    [C.P, C.Pd, '5 · Presentar', 'Llevar el prototipo a los docentes. Meta: junio de 2027.'],
  ];
  const w = 2.12;
  steps.forEach(([c, d, t, b], i) => {
    const x = 0.7 + i * 2.42;
    card(s, x, 1.7, w, 2.4, c);
    s.addText(t, { x: x + 0.15, y: 1.8, w: w - 0.3, h: 0.7, fontFace: F, fontSize: 13, bold: true, color: d, margin: 0, valign: 'top' });
    s.addText(b, { x: x + 0.15, y: 2.6, w: w - 0.3, h: 1.4, fontFace: F, fontSize: 11, color: C.ink, margin: 0, valign: 'top' });
    if (i < 4) wire(s, [[x + w, 2.9], [x + 2.42, 2.9]], C.gray);
  });
  s.addText('Pendiente de verificar', { x: 0.7, y: 4.5, w: 6, h: 0.3, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0 });
  techTable(s, [
    ['Aspecto', 'Qué falta'],
    ['Disponibilidad de componentes', 'Stock y envío a Argentina del LiDAR, la Pi y los Pololu'],
    ['Diseño definitivo', 'Cotas, soportes, cableado y refrigeración'],
    ['Aprobación institucional', 'Consulta a la facultad y a los docentes'],
    ['Utilidad educativa', 'Resultados de la encuesta y prueba en una materia'],
  ], 0.7, 4.85, 11.95, [3.6, 8.35], 0.37, 10.5);
}
//### 16
{
  const s = base('Estado y decisión', 'Semáforo de deseabilidad, factibilidad y viabilidad.', 'Proyecto de Ingeniería Mecatrónica');
  const L = [
    ['DESEABILIDAD', 'El problema lo percibe el autor. Falta la encuesta y la consulta a docentes.'],
    ['FACTIBILIDAD', 'Conseguir las piezas en el país y cerrar el diseño. El resto se puede hacer.'],
    ['VIABILIDAD', 'Componentes por unos ARS 1,40 M. Financiamiento por consultar.'],
  ];
  L.forEach(([t, b], i) => {
    const x = 0.7 + i * 4.05;
    card(s, x, 1.65, 3.85, 1.9, C.E, { solid: true, border: C.E, shadow: true });
    s.addShape(pres.shapes.OVAL, { x: x + 0.2, y: 1.85, w: 0.34, h: 0.34, fill: { color: 'FACC15' }, line: { color: C.Ed, width: 1 } });
    s.addText(t, { x: x + 0.65, y: 1.8, w: 2.0, h: 0.44, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0, valign: 'middle' });
    chip(s, 'AMARILLO', x + 3.85 - 0.15 - 1.0, 1.9, C.Ed, 1.0);
    s.addText(b, { x: x + 0.2, y: 2.4, w: 3.45, h: 1.1, fontFace: F, fontSize: 12, color: C.sub, margin: 0, valign: 'top' });
  });
  techTable(s, [
    ['Aspecto', 'Conclusión'],
    ['Driver de valor', 'Integrar teoría y práctica con un solo sistema mecatrónico'],
    ['Restricción principal', 'Conseguir las piezas en el país'],
    ['Supuesto crítico', 'Que estudiantes y docentes quieran usarlo'],
    ['Próxima evidencia', 'Resultados de la encuesta a estudiantes'],
  ], 0.7, 3.85, 11.95, [3.2, 8.75], 0.42, 11);
  s.addText('Decisión del autor: AVANZAR, revisando componentes y posibles reducciones de costo.', { x: 0.7, y: 6.15, w: 11.9, h: 0.4, fontFace: F, fontSize: 15, bold: true, color: C.ink, margin: 0 });
}
