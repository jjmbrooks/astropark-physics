import { updateSim } from '../../../state/index.js';

/**
 * sim-nebu-caida — caída libre con control de g (comparar).
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountNebuCaida(container) {
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap"><canvas data-canvas aria-label="Caída libre en Xenon-9"></canvas></div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">g A</div><div class="hud-stat__value" data-ga>7.5</div></div>
        <div class="hud-stat"><div class="hud-stat__label">g B</div><div class="hud-stat__value" data-gb>9.8</div></div>
      </div>
      <div class="sim-controls">
        <div class="control-row">
          <label for="nebu-ga">Planeta A (izquierda)</label>
          <select id="nebu-ga">
            <option value="7.5" selected>Xenon-9 · 7.5</option>
            <option value="9.8">Tierra · 9.8</option>
            <option value="1.6">Luna · 1.6</option>
            <option value="24.8">Júpiter · 24.8</option>
          </select>
        </div>
        <div class="control-row">
          <label for="nebu-gb">Planeta B (derecha)</label>
          <select id="nebu-gb">
            <option value="7.5">Xenon-9 · 7.5</option>
            <option value="9.8" selected>Tierra · 9.8</option>
            <option value="1.6">Luna · 1.6</option>
            <option value="24.8">Júpiter · 24.8</option>
          </select>
        </div>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-drop>Soltar</button>
          <button type="button" class="btn btn-ghost" data-reset>Reiniciar</button>
        </div>
        <p class="text-muted" data-hint>Compara caídas. Mayor g → llega antes. ★ al soltar con g distintos.</p>
        <div class="stars-award" data-stars aria-live="polite"></div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const gaEl = container.querySelector('#nebu-ga');
  const gbEl = container.querySelector('#nebu-gb');
  const gaOut = container.querySelector('[data-ga]');
  const gbOut = container.querySelector('[data-gb]');
  const starsEl = container.querySelector('[data-stars]');
  const hintEl = container.querySelector('[data-hint]');

  const H = 12; // meters fall
  let balls = [
    { y: 0, v: 0, done: false, t: 0 },
    { y: 0, v: 0, done: false, t: 0 },
  ];
  let dropping = false;
  let raf = 0;
  let running = true;
  let last = performance.now();
  let awarded = 0;
  let drops = 0;

  function gPair() {
    return [Number(gaEl.value), Number(gbEl.value)];
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function refreshLabels() {
    const [ga, gb] = gPair();
    gaOut.textContent = `${ga}`;
    gbOut.textContent = `${gb}`;
  }

  function maybeAward() {
    const [ga, gb] = gPair();
    let stars = 1;
    if (ga !== gb) stars = 2;
    if (drops >= 2 && ga !== gb) stars = 3;
    if (stars > awarded) {
      awarded = stars;
      updateSim('sim-nebu-caida', { stars, bestScore: stars * 33, completed: true });
      starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      hintEl.textContent =
        stars >= 3
          ? '¡Viste cómo g cambia el tiempo de caída!'
          : 'Suelta de nuevo con g distintos para más ★.';
    }
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const [ga, gb] = gPair();
    const gs = [ga, gb];

    if (dropping) {
      let allDone = true;
      for (let i = 0; i < 2; i++) {
        const b = balls[i];
        if (b.done) continue;
        allDone = false;
        b.v += gs[i] * dt;
        b.y += b.v * dt;
        b.t += dt;
        if (b.y >= H) {
          b.y = H;
          b.v = 0;
          b.done = true;
        }
      }
      if (allDone) dropping = false;
    }

    draw();
    raf = requestAnimationFrame(tick);
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0B1020';
    ctx.fillRect(0, 0, w, h);

    const top = 30;
    const ground = h - 30;
    const scale = (ground - top) / H;
    const [ga, gb] = gPair();

    ctx.strokeStyle = '#2a3555';
    ctx.beginPath();
    ctx.moveTo(0, ground);
    ctx.lineTo(w, ground);
    ctx.stroke();

    const xs = [w * 0.3, w * 0.7];
    const colors = ['#4cc9f0', '#f72585'];
    const labels = [`A g=${ga}`, `B g=${gb}`];

    for (let i = 0; i < 2; i++) {
      const b = balls[i];
      const py = top + b.y * scale;
      ctx.fillStyle = colors[i];
      ctx.beginPath();
      ctx.arc(xs[i], py, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e8ecf8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[i], xs[i], top - 10);
      if (b.done || b.t > 0) {
        ctx.fillStyle = '#9aa3c0';
        ctx.fillText(`t=${b.t.toFixed(2)} s`, xs[i], ground + 16);
      }
    }
    ctx.font = '20px sans-serif';
    ctx.fillText('🔵', w / 2, 22);
    ctx.textAlign = 'left';
  }

  function onDrop() {
    balls = [
      { y: 0, v: 0, done: false, t: 0 },
      { y: 0, v: 0, done: false, t: 0 },
    ];
    dropping = true;
    drops += 1;
    maybeAward();
  }

  function onReset() {
    dropping = false;
    balls = [
      { y: 0, v: 0, done: false, t: 0 },
      { y: 0, v: 0, done: false, t: 0 },
    ];
  }

  gaEl.addEventListener('change', refreshLabels);
  gbEl.addEventListener('change', refreshLabels);
  container.querySelector('[data-drop]').addEventListener('click', onDrop);
  container.querySelector('[data-reset]').addEventListener('click', onReset);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas.parentElement);
  resize();
  refreshLabels();
  last = performance.now();
  raf = requestAnimationFrame(tick);

  return function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    container.innerHTML = '';
  };
}
