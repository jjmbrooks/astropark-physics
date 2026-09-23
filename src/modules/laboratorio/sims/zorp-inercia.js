import { updateSim } from '../../../state/index.js';

/**
 * sim-zorp-inercia — impulso + fricción; v constante si fricción≈0.
 * @param {HTMLElement} container
 * @returns {() => void} destroy
 */
export function mountZorpInercia(container) {
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap"><canvas data-canvas aria-label="Pista de inercia de Zorp"></canvas></div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">Velocidad</div><div class="hud-stat__value" data-v>0.00 m/s</div></div>
        <div class="hud-stat"><div class="hud-stat__label">Fricción μ</div><div class="hud-stat__value" data-mu>0.00</div></div>
      </div>
      <div class="sim-controls">
        <div class="control-row">
          <label for="zorp-friction">Fricción (0 = vacío del parque)</label>
          <input id="zorp-friction" type="range" min="0" max="1" step="0.01" value="0" aria-valuemin="0" aria-valuemax="1" />
        </div>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-impulse>¡Empujón!</button>
          <button type="button" class="btn btn-ghost" data-reset>Reiniciar</button>
        </div>
        <p class="text-muted" data-hint>Meta: con fricción ≈ 0, mantén v entre 3 y 5 m/s unos segundos → ★</p>
        <div class="stars-award" data-stars aria-live="polite"></div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const frictionEl = container.querySelector('#zorp-friction');
  const vEl = container.querySelector('[data-v]');
  const muEl = container.querySelector('[data-mu]');
  const starsEl = container.querySelector('[data-stars]');
  const hintEl = container.querySelector('[data-hint]');

  let raf = 0;
  let running = true;
  let last = performance.now();
  let x = 40; // px world mapped
  let v = 0; // m/s
  let friction = 0;
  let holdGood = 0; // seconds in target band with low friction
  let awarded = 0;

  const WORLD_W = 20; // meters across canvas

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function award(stars) {
    if (stars <= awarded) return;
    awarded = stars;
    updateSim('sim-zorp-inercia', { stars, bestScore: stars * 33, completed: true });
    starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    hintEl.textContent =
      stars >= 3
        ? '¡Inercia perfecta! v constante en el vacío.'
        : `Bien — ${stars}★. Sigue con μ≈0 y v en 3–5 m/s.`;
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    // Friction deceleration ~ μ * g_feel (simple)
    const aFriction = -Math.sign(v) * friction * 8;
    if (friction < 0.02) {
      // near vacuum: keep v
    } else if (Math.abs(v) > 0.01) {
      v += aFriction * dt;
      if (Math.sign(v) !== Math.sign(v - aFriction * dt) && Math.abs(v) < 0.05) v = 0;
    } else {
      v = 0;
    }

    x += v * dt;
    const metersToPx = canvas.clientWidth / WORLD_W;
    // wrap
    const maxX = WORLD_W - 1;
    if (x > maxX) x -= maxX;
    if (x < 0) x += maxX;

    // scoring: low friction + v in [3,5]
    if (friction < 0.05 && v >= 3 && v <= 5) {
      holdGood += dt;
      if (holdGood >= 1.5) award(1);
      if (holdGood >= 3) award(2);
      if (holdGood >= 5) award(3);
    } else if (friction >= 0.05) {
      holdGood = Math.max(0, holdGood - dt * 0.5);
    }

    vEl.textContent = `${v.toFixed(2)} m/s`;
    muEl.textContent = friction.toFixed(2);

    draw(metersToPx);
    raf = requestAnimationFrame(tick);
  }

  function draw(metersToPx) {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);

    // track
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, w, h);
    const groundY = h * 0.72;
    ctx.strokeStyle = '#2a3555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.lineTo(w, groundY);
    ctx.stroke();

    // grid marks every 2 m
    ctx.fillStyle = '#9aa3c0';
    ctx.font = '10px sans-serif';
    for (let m = 0; m <= WORLD_W; m += 2) {
      const px = m * metersToPx;
      ctx.beginPath();
      ctx.moveTo(px, groundY);
      ctx.lineTo(px, groundY + 6);
      ctx.stroke();
      ctx.fillText(`${m} m`, px + 2, groundY + 16);
    }

    // cart
    const cx = x * metersToPx;
    const cy = groundY - 18;
    ctx.fillStyle = '#2de2e6';
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(cx - 22, cy - 14, 44, 28, 6);
      ctx.fill();
    } else {
      ctx.fillRect(cx - 22, cy - 14, 44, 28);
    }
    ctx.fillStyle = '#0b1020';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🟢', cx, cy + 5);
    ctx.textAlign = 'left';

    // velocity arrow
    if (Math.abs(v) > 0.05) {
      ctx.strokeStyle = '#b5f34a';
      ctx.fillStyle = '#b5f34a';
      ctx.lineWidth = 3;
      const len = Math.min(80, Math.abs(v) * 12) * Math.sign(v);
      ctx.beginPath();
      ctx.moveTo(cx, cy - 28);
      ctx.lineTo(cx + len, cy - 28);
      ctx.stroke();
    }

    // vacuum badge
    if (friction < 0.05) {
      ctx.fillStyle = 'rgba(181,243,74,0.15)';
      ctx.fillRect(8, 8, 120, 22);
      ctx.fillStyle = '#b5f34a';
      ctx.font = '11px sans-serif';
      ctx.fillText('Vacío · v constante', 14, 23);
    }
  }

  function onFriction() {
    friction = Number(frictionEl.value);
    frictionEl.setAttribute('aria-valuenow', String(friction));
  }

  function onImpulse() {
    v += 2.5;
    if (v > 12) v = 12;
  }

  function onReset() {
    x = 2;
    v = 0;
    holdGood = 0;
    // keep awarded stars in LS; only reset local challenge timer visual
    starsEl.textContent = awarded ? '★'.repeat(awarded) + '☆'.repeat(3 - awarded) : '';
  }

  frictionEl.addEventListener('input', onFriction);
  container.querySelector('[data-impulse]').addEventListener('click', onImpulse);
  container.querySelector('[data-reset]').addEventListener('click', onReset);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas.parentElement);
  resize();
  onFriction();
  last = performance.now();
  raf = requestAnimationFrame(tick);

  return function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    frictionEl.removeEventListener('input', onFriction);
    container.innerHTML = '';
  };
}
