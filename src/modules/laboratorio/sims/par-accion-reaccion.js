import { updateSim } from '../../../state/index.js';
import { playSuccess, playFail, playStar } from '../../../audio/engine.js';

/**
 * sim-par-accion-reaccion — 3ª ley de Newton + vectores (PF2 / M1).
 * Grog y Kiki en hover-skates: fuerzas iguales y opuestas; a = F/m distinta si m distinta.
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountParAccionReaccion(container) {
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap" style="min-width:360px">
        <canvas data-canvas aria-label="Par acción-reacción: Grog y Kiki se empujan"></canvas>
      </div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">F₁₂ = F₂₁</div><div class="hud-stat__value" data-f>20 N</div></div>
        <div class="hud-stat"><div class="hud-stat__label">a₁ · a₂</div><div class="hud-stat__value" data-a>2.00 · 4.00 m/s²</div></div>
      </div>
      <div class="sim-controls">
        <div class="predict-box panel" data-predict>
          <p class="panel__title">Predice antes de empujar</p>
          <p class="theory-p" style="margin:0 0 .5rem">Si ambos se empujan con la misma fuerza, ¿quién sale más rápido?</p>
          <div class="sim-actions" style="margin:0">
            <button type="button" class="btn btn-secondary" data-pred="grog">Grog (más masa)</button>
            <button type="button" class="btn btn-secondary" data-pred="kiki">Kiki (menos masa)</button>
            <button type="button" class="btn btn-secondary" data-pred="igual">Igual de rápido</button>
          </div>
          <p class="text-muted" data-pred-msg style="margin-top:.5rem">Elige una opción para desbloquear el empujón.</p>
        </div>
        <div class="control-row">
          <label for="par-f">Fuerza del empujón F (N)</label>
          <input id="par-f" type="range" min="5" max="40" step="1" value="20" />
        </div>
        <div class="control-row">
          <label for="par-m1">Masa de Grog m₁ (kg)</label>
          <input id="par-m1" type="range" min="4" max="20" step="1" value="10" />
        </div>
        <div class="control-row">
          <label for="par-m2">Masa de Kiki m₂ (kg)</label>
          <input id="par-m2" type="range" min="2" max="16" step="1" value="5" />
        </div>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-push disabled>Empujar</button>
          <button type="button" class="btn btn-ghost" data-reset>Reiniciar</button>
        </div>
        <p class="text-muted" data-hint>F₁₂ = −F₂₁ siempre. Las aceleraciones sí cambian con la masa: a = F/m.</p>
        <div class="stars-award" data-stars aria-live="polite"></div>
        <p class="theory-p theory-p--warn" data-feedback style="display:none"></p>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const fEl = container.querySelector('#par-f');
  const m1El = container.querySelector('#par-m1');
  const m2El = container.querySelector('#par-m2');
  const fOut = container.querySelector('[data-f]');
  const aOut = container.querySelector('[data-a]');
  const starsEl = container.querySelector('[data-stars]');
  const hintEl = container.querySelector('[data-hint]');
  const feedbackEl = container.querySelector('[data-feedback]');
  const pushBtn = container.querySelector('[data-push]');
  const predMsg = container.querySelector('[data-pred-msg]');

  let F = 20;
  let m1 = 10;
  let m2 = 5;
  let a1 = F / m1;
  let a2 = F / m2;

  let raf = 0;
  let running = true;
  let last = performance.now();
  let pushing = false;
  let tAnim = 0;
  let x1 = 0;
  let x2 = 0;
  let v1 = 0;
  let v2 = 0;
  let awarded = 0;
  /** @type {null | 'grog' | 'kiki' | 'igual'} */
  let prediction = null;
  let predictedOk = false;

  function recalc() {
    F = Number(fEl.value);
    m1 = Number(m1El.value);
    m2 = Number(m2El.value);
    a1 = F / m1;
    a2 = F / m2;
    fOut.textContent = `${F} N`;
    aOut.textContent = `${a1.toFixed(2)} · ${a2.toFixed(2)} m/s²`;
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawArrow(x0, y0, x1a, y1a, color, label) {
    const dx = x1a - x0;
    const dy = y1a - y0;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1a, y1a);
    ctx.stroke();
    const ah = 8;
    ctx.beginPath();
    ctx.moveTo(x1a, y1a);
    ctx.lineTo(x1a - ux * ah - uy * ah * 0.5, y1a - uy * ah + ux * ah * 0.5);
    ctx.lineTo(x1a - ux * ah + uy * ah * 0.5, y1a - uy * ah - ux * ah * 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.font = '11px sans-serif';
    ctx.fillText(label, (x0 + x1a) / 2 - 18, y0 - 8);
  }

  function drawAlien(cx, cy, color, label, mass) {
    const r = 14 + mass * 0.6;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.fillStyle = '#0b1020';
    ctx.beginPath();
    ctx.arc(cx - r * 0.3, cy - r * 0.2, 3, 0, Math.PI * 2);
    ctx.arc(cx + r * 0.3, cy - r * 0.2, 3, 0, Math.PI * 2);
    ctx.fill();
    // skate
    ctx.fillStyle = '#4CC9F0';
    ctx.fillRect(cx - r - 4, cy + r - 2, r * 2 + 8, 5);
    ctx.fillStyle = '#e8ecf8';
    ctx.font = '11px sans-serif';
    ctx.fillText(label, cx - 14, cy + r + 16);
    ctx.fillStyle = '#9aa3c0';
    ctx.fillText(`m=${mass} kg`, cx - 20, cy + r + 28);
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#0B1020';
    ctx.fillRect(0, 0, w, h);

    // starfield
    ctx.fillStyle = 'rgba(232,236,248,0.35)';
    for (let i = 0; i < 28; i++) {
      const sx = ((i * 97) % w);
      const sy = ((i * 53) % (h * 0.55));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    const ground = h * 0.72;
    ctx.strokeStyle = '#2a3555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ground);
    ctx.lineTo(w, ground);
    ctx.stroke();

    const mid = w * 0.5;
    const scale = Math.min(18, (w - 80) / 40);
    const base1 = mid - 70;
    const base2 = mid + 70;
    const gX = base1 - x1 * scale;
    const kX = base2 + x2 * scale;
    const cy = ground - 28;

    drawAlien(gX, cy, '#FF8C42', 'Grog', m1);
    drawAlien(kX, cy, '#FFD93D', 'Kiki', m2);

    // Equal-length opposite force arrows (same pixel length regardless of mass)
    const arrowLen = Math.min(70, 20 + F * 1.2);
    const ay = cy - 36;
    drawArrow(gX + 18, ay, gX + 18 + arrowLen, ay, '#FF5DB1', `F₁₂=${F} N`);
    drawArrow(kX - 18, ay, kX - 18 - arrowLen, ay, '#4CC9F0', `F₂₁=${F} N`);

    // a labels
    ctx.fillStyle = '#B7F34C';
    ctx.font = '12px sans-serif';
    ctx.fillText(`a₁=${a1.toFixed(2)}`, gX - 24, cy - 52);
    ctx.fillText(`a₂=${a2.toFixed(2)}`, kX - 24, cy - 52);

    ctx.fillStyle = '#9aa3c0';
    ctx.font = '11px sans-serif';
    ctx.fillText('F₁₂ = −F₂₁  ·  a = F/m', mid - 70, h - 10);
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (pushing) {
      tAnim += dt;
      v1 += a1 * dt;
      v2 += a2 * dt;
      x1 += v1 * dt;
      x2 += v2 * dt;
      if (tAnim > 1.6) {
        pushing = false;
        awardAfterPush();
      }
    }

    draw();
    raf = requestAnimationFrame(tick);
  }

  function explainPrediction() {
    const faster = m1 < m2 ? 'grog' : m2 < m1 ? 'kiki' : 'igual';
    let msg = '';
    if (prediction === 'igual') {
      msg =
        'Casi: las fuerzas son iguales (3ª ley), pero la aceleración es a = F/m. Quien tenga menos masa acelera más. No gana “la fuerza mayor”: las dos fuerzas son la misma.';
      predictedOk = false;
    } else if (prediction === faster || (faster === 'igual' && prediction === 'igual')) {
      msg =
        '¡Bien! F₁₂ = F₂₁ siempre. Quien tiene menos masa sale con mayor a = F/m. El error común “la fuerza mayor gana” no aplica: aquí las fuerzas son iguales.';
      predictedOk = true;
    } else {
      msg =
        'Ojo: las fuerzas del par son iguales y opuestas (misma longitud de flecha). Acelera más quien tiene menos masa. “La fuerza mayor gana” es el error que hay que dejar atrás.';
      predictedOk = false;
    }
    feedbackEl.style.display = 'block';
    feedbackEl.innerHTML = `<strong>Feedback:</strong> ${msg}`;
    if (predictedOk) playSuccess();
    else playFail();
  }

  function awardAfterPush() {
    let stars = 1;
    if (predictedOk) stars = 2;
    if (predictedOk && Math.abs(m1 - m2) >= 3) stars = 3;
    // Also require having seen unequal masses
    if (m1 === m2 && predictedOk) stars = Math.min(stars, 2);

    if (stars > awarded) {
      awarded = stars;
      updateSim('sim-par-accion-reaccion', {
        stars,
        bestScore: stars * 33,
        completed: true,
      });
      starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
      starsEl.classList.add('stars-award--pop');
      playStar();
      hintEl.textContent =
        stars >= 3
          ? '3★: predijiste bien y viste a = F/m con masas distintas.'
          : `Llevas ${stars}★. Varía las masas y predice de nuevo.`;
    }
  }

  function onPredict(e) {
    const btn = e.currentTarget;
    prediction = btn.getAttribute('data-pred');
    container.querySelectorAll('[data-pred]').forEach((b) => b.classList.remove('is-selected'));
    btn.classList.add('is-selected');
    pushBtn.disabled = false;
    predMsg.textContent = 'Listo. Ajusta F y masas, luego Empujar.';
  }

  function onPush() {
    if (!prediction) return;
    explainPrediction();
    x1 = 0;
    x2 = 0;
    v1 = 0;
    v2 = 0;
    tAnim = 0;
    pushing = true;
  }

  function onReset() {
    pushing = false;
    x1 = x2 = v1 = v2 = tAnim = 0;
    prediction = null;
    pushBtn.disabled = true;
    container.querySelectorAll('[data-pred]').forEach((b) => b.classList.remove('is-selected'));
    predMsg.textContent = 'Elige una opción para desbloquear el empujón.';
    feedbackEl.style.display = 'none';
  }

  container.querySelectorAll('[data-pred]').forEach((b) => b.addEventListener('click', onPredict));
  fEl.addEventListener('input', recalc);
  m1El.addEventListener('input', recalc);
  m2El.addEventListener('input', recalc);
  pushBtn.addEventListener('click', onPush);
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
