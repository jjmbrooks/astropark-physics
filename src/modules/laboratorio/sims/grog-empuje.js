import { updateSim } from '../../../state/index.js';

/**
 * sim-grog-empuje — F, m, d → a, W
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountGrogEmpuje(container) {
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap"><canvas data-canvas aria-label="Empuje de vagones de Grog"></canvas></div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">Aceleración a</div><div class="hud-stat__value" data-a>0.00 m/s²</div></div>
        <div class="hud-stat"><div class="hud-stat__label">Trabajo W</div><div class="hud-stat__value" data-w>0.0 J</div></div>
      </div>
      <div class="sim-controls">
        <div class="control-row">
          <label for="grog-f">Fuerza F (N)</label>
          <input id="grog-f" type="range" min="5" max="50" step="1" value="20" />
        </div>
        <div class="control-row">
          <label for="grog-m">Masa m (kg)</label>
          <input id="grog-m" type="range" min="2" max="20" step="1" value="5" />
        </div>
        <div class="control-row">
          <label for="grog-d">Distancia d (m)</label>
          <input id="grog-d" type="range" min="1" max="15" step="0.5" value="5" />
        </div>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-push>Empujar</button>
          <button type="button" class="btn btn-ghost" data-reset>Reiniciar</button>
        </div>
        <p class="text-muted" data-hint>Meta: a ≈ 4 m/s² y W ≈ 60 J (F=20, m=5, d=3) → ★</p>
        <div class="stars-award" data-stars aria-live="polite"></div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const fEl = container.querySelector('#grog-f');
  const mEl = container.querySelector('#grog-m');
  const dEl = container.querySelector('#grog-d');
  const aOut = container.querySelector('[data-a]');
  const wOut = container.querySelector('[data-w]');
  const starsEl = container.querySelector('[data-stars]');
  const hintEl = container.querySelector('[data-hint]');

  let F = 20;
  let m = 5;
  let d = 5;
  let a = F / m;
  let W = F * d;

  let raf = 0;
  let running = true;
  let last = performance.now();
  let animX = 0;
  let animV = 0;
  let pushing = false;
  let pushedDist = 0;
  let awarded = 0;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function recalc() {
    F = Number(fEl.value);
    m = Number(mEl.value);
    d = Number(dEl.value);
    a = F / m;
    W = F * d;
    aOut.textContent = `${a.toFixed(2)} m/s²`;
    wOut.textContent = `${W.toFixed(1)} J`;
    checkStars();
  }

  function checkStars() {
    // Target example: a≈4, W≈60 → F=20,m=5,d=3
    let stars = 0;
    if (Math.abs(a - 4) < 0.6) stars = 1;
    if (Math.abs(a - 4) < 0.35 && Math.abs(W - 60) < 25) stars = 2;
    if (Math.abs(a - 4) <= 0.15 && Math.abs(W - 60) <= 8) stars = 3;
    // Also award for matching F=20,m=5,d=3 exactly-ish
    if (F === 20 && m === 5 && Math.abs(d - 3) < 0.01) stars = 3;
    if (stars > awarded) {
      awarded = stars;
      updateSim('sim-grog-empuje', { stars, bestScore: stars * 33, completed: true });
      starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      hintEl.textContent =
        stars >= 3
          ? '¡Exacto! a = F/m y W = F·d.'
          : `Vas bien (${stars}★). Acerca a≈4 y W≈60.`;
    }
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (pushing) {
      animV += a * dt;
      const dx = animV * dt;
      animX += dx;
      pushedDist += dx;
      if (pushedDist >= d) {
        pushing = false;
        animV = 0;
      }
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

    const ground = h * 0.75;
    ctx.strokeStyle = '#2a3555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ground);
    ctx.lineTo(w, ground);
    ctx.stroke();

    // target marker for d
    const scale = (w - 80) / 15;
    const startX = 40;
    const targetX = startX + d * scale;
    ctx.strokeStyle = '#f72585';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(targetX, ground - 60);
    ctx.lineTo(targetX, ground);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#f72585';
    ctx.font = '11px sans-serif';
    ctx.fillText(`d=${d} m`, targetX - 18, ground - 66);

    const boxX = startX + Math.min(animX, d) * scale;
    const boxW = 28 + m * 1.5;
    const boxH = 24 + m * 0.8;
    ctx.fillStyle = '#f72585';
    ctx.fillRect(boxX, ground - boxH, boxW, boxH);
    ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText('🟠', boxX + boxW / 2 - 8, ground - boxH / 2 + 5);

    // force arrow
    ctx.strokeStyle = '#2de2e6';
    ctx.fillStyle = '#2de2e6';
    ctx.lineWidth = 3;
    const flen = Math.min(90, F * 1.5);
    const fy = ground - boxH - 12;
    ctx.beginPath();
    ctx.moveTo(boxX - 4, fy);
    ctx.lineTo(boxX - 4 + flen, fy);
    ctx.stroke();
    ctx.font = '11px sans-serif';
    ctx.fillText(`F=${F} N`, boxX, fy - 8);

    // mass label
    ctx.fillStyle = '#9aa3c0';
    ctx.fillText(`m=${m} kg`, boxX, ground + 16);
  }

  function onPush() {
    animX = 0;
    animV = 0;
    pushedDist = 0;
    pushing = true;
    checkStars();
  }

  function onReset() {
    pushing = false;
    animX = 0;
    animV = 0;
    pushedDist = 0;
  }

  fEl.addEventListener('input', recalc);
  mEl.addEventListener('input', recalc);
  dEl.addEventListener('input', recalc);
  container.querySelector('[data-push]').addEventListener('click', onPush);
  container.querySelector('[data-reset]').addEventListener('click', onReset);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas.parentElement);
  resize();
  recalc();
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
