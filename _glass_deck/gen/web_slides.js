
{
  const UI = (f) => path.join(__dirname, '..', 'ui', f);
  const s = base('Interfaz web: la misma app en todos lados', 'Se diseña una sola vez y se usa en la pantalla del robot y desde cualquier dispositivo con Wi‑Fi, sin instalar nada.', ['C', 'P'], 'Sistemas Mecatrónicos · Sistemas Operativos y Redes · Computación II');
  // robot screen / notebook
  const iw = 6.78, ih = iw * 1440 / 2560;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.7, y: 1.6, w: iw + 0.12, h: ih + 0.12, rectRadius: 0.14, fill: { color: '0B1220' }, line: { color: 'FFFFFF', width: 1.25, transparency: 10 }, shadow: glassShadow() });
  s.addImage({ path: UI('ui_panel.png'), x: 0.76, y: 1.66, w: iw, h: ih });
  // phone
  const ph = 4.28, pw = ph * 1170 / 2532;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.85, y: 1.6, w: pw + 0.14, h: ph + 0.14, rectRadius: 0.28, fill: { color: '0B1220' }, line: { color: 'FFFFFF', width: 1.25, transparency: 10 }, shadow: glassShadow() });
  s.addImage({ path: UI('ui_celular.png'), x: 7.92, y: 1.67, w: pw, h: ph, rounding: false });
  // device chips under the screen
  let cx = 0.7;
  [['Pantalla del robot · 5″', C.Ed], ['Celular', C.Pd], ['Tablet', C.Md], ['Notebook', C.Cd]].forEach(([t, c]) => { cx += chip(s, t, cx, 5.72, c, 0.25 + t.length * 0.072) + 0.12; });
  s.addText('Maqueta de diseño con datos simulados. La misma app se adapta al tamaño de cada pantalla.', { x: 0.7, y: 6.1, w: 6.9, h: 0.3, fontFace: F, fontSize: 9.5, italic: true, color: C.sub, margin: 0 });
  // feature cards
  const feats = [
    [C.M, C.Md, 'Control manual', 'Joystick táctil y modos: manual, seguir línea, mapeo.'],
    [C.E, C.Ed, 'Telemetría en vivo', 'Velocidad, corriente por motor, batería y sensor de línea.'],
    [C.P, C.Pd, 'Cámara y mapa', 'Video de la C270 y planta del LiDAR en la misma vista.'],
    [C.C, C.Cd, 'Parada y alertas', 'STOP siempre visible y avisos de bloqueo o batería baja.'],
  ];
  feats.forEach(([c, d, t, b], i) => {
    const y = 1.6 + i * 1.2;
    card(s, 10.25, y, 2.4, 1.08, c);
    s.addText([{ text: t, options: { fontFace: FT, fontSize: 13, bold: true, color: d, breakLine: true } }, { text: b, options: { fontSize: 9.5, color: C.ink } }], { x: 10.4, y, w: 2.12, h: 1.08, fontFace: F, margin: 0, valign: 'middle' });
  });
  s.addText('Propuesta de diseño: falta programarla y probarla con usuarios.', { x: 10.25, y: 6.42, w: 2.4, h: 0.4, fontFace: F, fontSize: 8.5, italic: true, color: C.sub, margin: 0, valign: 'top' });
}

{
  const s = base('Cómo llega la interfaz a cada dispositivo', 'Un servidor en la Raspberry Pi 5; cada pantalla es solo un navegador. Esquema propuesto, a validar.', ['E', 'C', 'P'], 'Sistemas Operativos y Redes · Sistemas Embebidos · Computación II');
  zone(s, 0.7, 1.55, 5.05, 3.15, C.Md, 'EN EL ROBOT');
  partCard(s, 0.9, 1.95, 2.5, 1.15, C.P, C.Pd, 'SERVIDOR WEB', 'Raspberry Pi 5', 'Sirve la app · HTTP + WebSocket', 'cámara, mapa y telemetría', 'INCLUIDO');
  partCard(s, 0.9, 3.35, 2.5, 1.15, C.C, C.Cd, 'TIEMPO REAL', 'ESP32 DevKit V1', 'Recibe consignas, devuelve datos', 'enlace por definir', 'POR DEFINIR');
  partCard(s, 3.65, 1.95, 1.9, 1.15, C.E, C.Ed, 'PANTALLA 5″', 'Waveshare ESP32-P4', 'Abre la misma app', 'cómo: por definir', 'POR DEFINIR');
  wire(s, [[2.15, 3.1], [2.15, 3.35]], C.gray, true);
  wire(s, [[3.4, 2.52], [3.65, 2.52]], C.Pd);
  s.addText('La pantalla puede abrir la app en un navegador o usar una versión nativa (LVGL) que consulta la misma API.', { x: 3.65, y: 3.3, w: 1.95, h: 1.2, fontFace: F, fontSize: 8.5, color: C.sub, margin: 0, valign: 'top' });

  // Wi-Fi hub
  card(s, 6.1, 2.25, 1.6, 1.75, C.M, { solid: true });
  s.addText([{ text: 'Wi‑Fi', options: { fontFace: FT, fontSize: 22, bold: true, color: C.Md, breakLine: true } }, { text: 'Punto de acceso del robot o red del aula', options: { fontSize: 9, color: C.sub } }], { x: 6.2, y: 2.25, w: 1.4, h: 1.75, fontFace: F, align: 'center', valign: 'middle', margin: 0 });
  hwire(s, 5.75, 6.1, 3.12, C.Md, '', '');
  hwire(s, 7.7, 8.05, 3.12, C.Md, '', '');

  zone(s, 8.05, 1.55, 4.6, 3.15, C.Pd, 'CUALQUIER DISPOSITIVO CON WI‑FI');
  [['Celular', 'Abre la dirección del robot en el navegador'], ['Tablet', 'Misma app, diseño adaptado a la pantalla'], ['Notebook', 'Vista completa: cámara, mapa y datos']].forEach(([t, b], i) => {
    partCard(s, 8.25, 1.95 + i * 0.9, 4.2, 0.78, C.P, C.Pd, 'CLIENTE', t, b);
  });

  block(s, 0.7, 5.0, 3.85, 1.6, C.C, C.Cd, 'Seguridad', bullets(['Acceso con contraseña', 'Un solo dispositivo maneja; el resto mira', 'Si se corta el Wi‑Fi, el robot frena solo'], 10.5));
  block(s, 4.75, 5.0, 3.85, 1.6, C.P, C.Pd, 'En clase', bullets(['Cada estudiante ve los datos en su celular', 'Descarga de mediciones (CSV) para analizar', 'Sin instalar programas en las PC'], 10.5));
  block(s, 8.8, 5.0, 3.85, 1.6, C.E, C.Ed, 'Por definir', bullets(['Punto de acceso propio o red de la facultad', 'Navegador o versión nativa en la pantalla', 'Latencia del video por Wi‑Fi: medir'], 10.5));
}


