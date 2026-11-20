//### 01
{
  const s = pres.addSlide(); slideNo += 1; s.background = { path: BG };
  s.addText('PROYECTO FINAL · INGENIERÍA MECATRÓNICA · DOCUMENTACIÓN TÉCNICA INICIAL', { x: 0.7, y: 1.2, w: 7.0, h: 0.5, fontFace: F, fontSize: 10.5, bold: true, color: C.Md, charSpacing: 2.5, margin: 0, valign: 'top' });
  s.addText('Plataforma robótica móvil para prácticas de mecatrónica', { x: 0.7, y: 1.9, w: 6.5, h: 2.0, fontFace: F, fontSize: 36, bold: true, color: C.ink, margin: 0, valign: 'top' });
  s.addText('Robot diferencial de dos ruedas motrices y una rueda loca. Control a bordo con Raspberry Pi 5 y ESP32 DevKit V1, LiDAR 3D, cámara, sensor de línea y sensado de corriente en motores.', { x: 0.7, y: 4.05, w: 6.3, h: 1.1, fontFace: F, fontSize: 14, color: C.sub, margin: 0, valign: 'top' });
  s.addText([
    { text: 'Estado: ', options: { bold: true, color: C.ink } },
    { text: 'idea y diseño inicial. Sin hardware armado. Modelo CAD y renders conceptuales.', options: { color: C.sub } },
  ], { x: 0.7, y: 5.3, w: 6.3, h: 0.6, fontFace: F, fontSize: 12, margin: 0, valign: 'top' });
  s.addText('Koba Chajchir', { x: 0.7, y: 6.1, w: 6, h: 0.3, fontFace: F, fontSize: 13, bold: true, color: C.ink, margin: 0 });
  s.addText('Ingeniería Mecatrónica · FCAL – UNER', { x: 0.7, y: 6.4, w: 6.5, h: 0.3, fontFace: F, fontSize: 11, color: C.sub, margin: 0 });
  renderSlot(s, 7.6, 1.2, 5.2, 4.9, 'Portada · modelo completo en perspectiva 3/4');
  s.addShape(pres.shapes.LINE, { x: 0.7, y: 6.97, w: 11.93, h: 0, line: { color: C.line, width: 0.5 } });
  s.addText('Plataforma robótica móvil para prácticas de mecatrónica', { x: 0.7, y: 7.03, w: 8, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, margin: 0 });
  s.addText('01', { x: 11.63, y: 7.03, w: 1.0, h: 0.3, fontFace: F, fontSize: 9, color: C.mute, align: 'right', margin: 0 });
}
//### 02
{
  const s = base('Contexto, objetivo y requisitos', 'Qué problema se busca atender y cómo se va a saber si el prototipo sirve.');
  block(s, 0.7, 1.65, 4.2, 2.35, C.M, C.Md, 'Observación', 'Pocas actividades prácticas de robótica y mecatrónica. Teoría y práctica separadas, con poca interacción entre las ramas.\n\nApreciación del autor como estudiante. Sin medir.', 11);
  block(s, 0.7, 4.15, 4.2, 2.55, C.P, C.Pd, 'Objetivo', 'Una plataforma mecatrónica programable y ampliable, entregada a la carrera, que sirva para ensayos en varias materias.\n\nPrevista para junio de 2027 (meta, no plazo confirmado).', 11);
  s.addText('Requisitos propuestos y cómo verificarlos', { x: 5.2, y: 1.65, w: 7.4, h: 0.35, fontFace: F, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  techTable(s, [
    ['Requisito', 'Criterio de verificación', 'Estado'],
    ['Uso simple e intuitivo', 'Prueba de uso con docentes y estudiantes', 'Por definir'],
    ['Mediciones y lecturas correctas', 'Comparación contra una referencia medida', 'Por definir'],
    ['Odometría eficaz', 'Error de pose tras una trayectoria de prueba', 'Por definir'],
    ['Ampliable', 'Zona de montaje de 64 × 60 mm y expansión de E/S', 'En diseño'],
    ['Código abierto y buenas prácticas', 'Repositorio documentado y reproducible', 'Por definir'],
    ['Interés real de los usuarios', 'Encuesta a estudiantes y consulta a docentes', 'Pendiente'],
  ], 5.2, 2.05, 7.45, [2.55, 3.65, 1.25], 0.52, 10);
}
//### 03
{
  const s = base('Alcance funcional mínimo', 'Funciones con las que el prototipo podría empezar a usarse en una materia.');
  techTable(s, [
    ['Función', 'Implementación prevista', 'Estado'],
    ['Tracción diferencial', '2 × Pololu #4756 (12 V, 76 rpm, con encoder) + driver Cytron MDD10A de 10 A', 'Preferido'],
    ['Lazo de velocidad', 'PID por rueda con realimentación de encoder, en el ESP32', 'Por implementar'],
    ['Sensado de corriente', '2 × Pololu #5240 (ACS71240, ±10 A, 3,3 V), uno por motor, leídos por ADC1 del ESP32 (GPIO32–39)', 'Preferido · pines por definir'],
    ['Odometría', 'Encoders + radio efectivo y separación entre ruedas', 'Por implementar'],
    ['Seguimiento de línea', 'OSOYOO IR de 5 canales, 5 entradas digitales', 'Base'],
    ['Percepción 3D', 'Unitree 4D LiDAR L1 PM por UART TTL hacia la Raspberry Pi 5', 'Elegido'],
    ['Visión', 'Logitech C270, USB, 720p, conectada a la Raspberry Pi', 'Preferida'],
    ['Interfaz local', 'Pantalla táctil de 5″ Waveshare ESP32-P4', 'Preferida · enlace por definir'],
    ['Comunicación', 'Enlace Pi ↔ ESP y Pi → PC externa, con interfaz web', 'Por definir'],
  ], 0.7, 1.65, 11.95, [2.4, 7.2, 2.35], 0.5, 10.5);
  s.addText('Alcance, rendimiento y funcionamiento de cada función quedan por comprobar durante el desarrollo.', { x: 0.7, y: 6.7, w: 11.9, h: 0.25, fontFace: F, fontSize: 10, italic: true, color: C.sub, margin: 0 });
}
//### 04
{
  const s = base('Plataforma mecánica: cotas iniciales', 'Referencias para el primer CAD. No son un diseño mecánico definitivo.', 'Mecanismos y Elementos de Máquinas · Tecnología Industrial · Sistemas de Representación');
  renderSlot(s, 0.7, 1.65, 5.2, 5.0, 'Chasis · vista 3/4 con cotas');
  techTable(s, [
    ['Elemento', 'Cota o dato'],
    ['Envolvente (L × A × H)', '≈ 340 × 218 × 216 mm, con pantalla, bujes y LiDAR'],
    ['Placa inferior', '300 × 180 mm, esquinas R8'],
    ['Placa superior', '258 × 154 × 4 mm, acero dulce, esquinas R8'],
    ['Altura libre entre placas', '55 mm'],
    ['Pilares', '6 × Ø12 × 55 mm, 130 mm entre filas, 96 mm entre vecinos, paso Ø5,5 (M5)'],
    ['Despeje de la placa inferior', '85 mm al suelo'],
    ['Ruedas motrices', 'Ø85 × 16 mm, eje a 42,5 mm del suelo'],
    ['Rueda loca', 'Goma Ø50 mm, a 220 mm del eje motriz'],
    ['Sensor de línea', 'Cara activa regulable de 5 a 20 mm (recorrido 15 mm)'],
    ['Batería', '151 × 65 × 97,5 mm, ≈ 2,2 kg, a 14 mm del suelo'],
    ['Montaje central', '4 ranuras de 24 × 5,5 mm en 64 × 60 mm y 2 arcos de R106 mm / 30°'],
  ], 6.15, 1.65, 6.5, [2.3, 4.2], 0.41, 9.5);
}
//### 05
{
  const s = base('Cinemática y odometría', 'Modelo diferencial. Los parámetros marcados se miden en el prototipo.', 'Robótica I y II · Mecánica Racional · Sistemas de Control');
  card(s, 0.7, 1.65, 6.2, 2.25, C.M);
  s.addText('Cinemática del chasis', { x: 0.9, y: 1.72, w: 5.8, h: 0.35, fontFace: F, fontSize: 13, bold: true, color: C.Md, margin: 0 });
  s.addText([
    { text: 'v = (vR + vL) / 2', options: { breakLine: true } },
    { text: 'ω = (vR − vL) / b', options: { breakLine: true } },
    { text: 'vi = ωi · r      (i = L, R)', options: { breakLine: true } },
    { text: 'b: separación entre ruedas · r: radio efectivo', options: { fontSize: 9.5, color: C.sub, fontFace: F } },
  ], { x: 0.9, y: 2.1, w: 5.8, h: 1.7, fontFace: 'Consolas', fontSize: 13, color: C.ink, margin: 0, valign: 'top', paraSpaceAfter: 4 });
  card(s, 0.7, 4.05, 6.2, 2.6, C.C);
  s.addText('Odometría con encoders', { x: 0.9, y: 4.12, w: 5.8, h: 0.35, fontFace: F, fontSize: 13, bold: true, color: C.Cd, margin: 0 });
  s.addText([
    { text: 'Δsi = 2π · r · Ni / (CPR · n)', options: { breakLine: true } },
    { text: 'Δs = (ΔsR + ΔsL) / 2', options: { breakLine: true } },
    { text: 'Δθ = (ΔsR − ΔsL) / b', options: { breakLine: true } },
    { text: 'x ← x + Δs · cos(θ + Δθ/2)', options: { breakLine: true } },
    { text: 'y ← y + Δs · sin(θ + Δθ/2)', options: { breakLine: true } },
    { text: 'θ ← θ + Δθ', options: { breakLine: true } },
    { text: 'Ni: cuentas del encoder · CPR: cuentas por vuelta · n: reducción', options: { fontSize: 9.5, color: C.sub, fontFace: F } },
  ], { x: 0.9, y: 4.5, w: 5.8, h: 2.1, fontFace: 'Consolas', fontSize: 12, color: C.ink, margin: 0, valign: 'top', paraSpaceAfter: 2 });
  s.addText('Parámetros del modelo', { x: 7.2, y: 1.65, w: 5.4, h: 0.35, fontFace: F, fontSize: 14, bold: true, color: C.ink, margin: 0 });
  techTable(s, [
    ['Parámetro', 'Valor', 'Estado'],
    ['r (radio de rueda)', '42,5 mm nominal (Ø85)', 'Medir con rueda real'],
    ['b (separación)', 'A tomar del CAD', 'Por medir'],
    ['CPR y reducción', 'Del motor Pololu #4756', 'Por confirmar'],
    ['Lazo de velocidad', 'PID por rueda', 'Punto de partida'],
    ['Línea → giro', '5 sensores → posición respecto del centro', 'Por implementar'],
    ['Carga vs. bloqueo', 'Corriente + velocidad del encoder', 'Por implementar'],
  ], 7.2, 2.05, 5.45, [1.75, 2.35, 1.35], 0.5, 9.5);
  s.addText('Giro por diferencia de velocidad. Con tres apoyos (dos motrices y una loca) el deslizamiento de la rueda loca queda sin modelar.', { x: 7.2, y: 5.75, w: 5.4, h: 0.9, fontFace: F, fontSize: 10, italic: true, color: C.sub, margin: 0, valign: 'top' });
}
//### 06
{
  const s = base('Sensado: señales, interfaces y datos técnicos', 'Qué mide cada sensor, cómo se conecta y a qué controlador llega.', 'Sistemas Mecatrónicos · Microcontroladores · Electrónica Básica');
  techTable(s, [
    ['Sensor', 'Magnitud', 'Interfaz', 'Destino', 'Dato técnico'],
    ['Unitree 4D LiDAR L1 PM', 'Nube de puntos 3D + IMU', 'UART TTL (USB–UART)', 'Pi 5', 'Alimentación 12 V. 21.600 puntos/s. Campo 360° × 90°. Zona ciega de 0,05 m'],
    ['Logitech C270', 'Video', 'USB', 'Pi 5', '720p. 55° diagonal ≈ 28,6° vertical. Lente a 116,5 mm del suelo'],
    ['OSOYOO IR 5 canales', 'Posición de la línea', '5 entradas digitales', 'ESP32', 'PCB de 81 × 27,4 mm. Cara activa a 5–20 mm del suelo'],
    ['Encoders del Pololu #4756', 'Velocidad y giro', 'Señales A/B por motor', 'ESP32', 'Resolución por confirmar. Realimentan el PID y la odometría'],
    ['Pololu #5240 (ACS71240)', 'Corriente del motor', 'Analógica 3,3 V', 'ADC1 del ESP32', '±10 A bidireccional. Bloqueo ≈ 5,5 A a 12 V. Compensar cero y filtrar PWM'],
    ['SparkFun BNO086 (opcional)', 'Orientación', 'I²C (Qwiic)', 'Por definir', 'Evaluar antes la IMU del LiDAR'],
  ], 0.7, 1.65, 11.95, [2.55, 2.05, 2.1, 1.35, 3.9], 0.68, 10);
  s.addText('Los GPIO21/22 que figuraban como candidatos eran del ESP32-P4. En el ESP32 clásico no son ADC: la corriente va a ADC1 (GPIO32–39), porque ADC2 no se puede usar con Wi-Fi.', { x: 0.7, y: 6.6, w: 11.9, h: 0.3, fontFace: F, fontSize: 10, italic: true, color: C.sub, margin: 0 });
}
