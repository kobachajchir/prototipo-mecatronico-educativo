import { spawn } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const OUT = 'D:/ProyectoFinal/_cdp';
const URL = 'http://127.0.0.1:5199/#/conducir';
const chrome = spawn('C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--remote-debugging-port=9333', '--user-data-dir=D:/ProyectoFinal/_chrome',
  '--window-size=1280,720', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
  '--no-first-run', '--disable-extensions', 'about:blank',
], { stdio: 'ignore' });

const sleep = ms => new Promise(r => setTimeout(r, ms));
let targets;
for (let i = 0; i < 30; i++) {
  try { targets = await (await fetch('http://127.0.0.1:9333/json')).json(); if (targets.length) break; } catch { /* espera */ }
  await sleep(500);
}
const page = targets.find(t => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map();
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } });
const send = (method, params = {}) => new Promise(res => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async expr => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value;
const shot = async name => {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  writeFileSync(`${OUT}/${name}.png`, Buffer.from(r.result.data, 'base64'));
  console.log('guardado', name);
};

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1.6, mobile: false });
await send('Page.navigate', { url: URL });
await sleep(5000);
console.log('ruta inicial:', await evalJs('location.pathname'));
console.log('click nav:', await evalJs("(()=>{const a=document.querySelector('a[href=\"/conducir\"]');if(a){a.click();return true}return false})()"));
await sleep(4000);
console.log('ruta:', await evalJs('location.pathname'));
await shot('01_conducir_1280');
// esperar el botón «Control táctil» habilitado
let ready = false;
for (let i = 0; i < 40; i++) {
  ready = await evalJs(`(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Control táctil/.test(x.textContent));return !!b && !b.disabled})()`);
  if (ready) break;
  await sleep(1000);
}
console.log('boton listo:', ready);
if (ready) {
  await evalJs(`[...document.querySelectorAll('button')].find(x=>/Control táctil/.test(x.textContent)).click()`);
  await sleep(6000);
  await shot('02_control_manual_1280');
  console.log('canvas ocultos:', await evalJs("(()=>{const c=[...document.querySelectorAll('canvas')];c.forEach(x=>x.style.visibility='hidden');return c.length})()"));
  await sleep(800);
  await shot('03_control_manual_sin_modelo');
}
console.log('texto pagina:', (await evalJs('document.body.innerText.slice(0,400)')));
await send('Browser.close'); await sleep(1000);
process.exit(0);
