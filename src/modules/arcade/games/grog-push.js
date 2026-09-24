import { updateGame } from '../../../state/index.js';

const LEVELS = [
  { mass: 4, targetF: 12, label: 'Caja ligera' },
  { mass: 8, targetF: 24, label: 'Caja media' },
  { mass: 15, targetF: 30, label: 'Caja pesada' },
];

/**
 * game-grog-push — elegir fuerza vs masa; no gastar de más.
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountGrogPush(container) {
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap"><canvas data-canvas aria-label="Grog Push"></canvas></div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">Nivel</div><div class="hud-stat__value" data-level>1/3</div></div>
        <div class="hud-stat"><div class="hud-stat__label">Score</div><div class="hud-stat__value" data-score>0</div></div>
      </div>
      <div class="sim-controls">
        <p class="text-muted" data-info>Elige F para empujar la caja ~3 m. a = F/m. Demasiada fuerza gasta puntos.</p>
        <div class="control-row">
          <label for="gp-f">Fuerza F (N)</label>
          <input id="gp-f" type="range" min="5" max="50" step="1" value="15" />
        </div>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-push>Empujar</button>
          <button type="button" class="btn btn-ghost" data-reset>Reiniciar</button>
        </div>
        <div class="stars-award" data-stars aria-live="polite"></div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const fEl = container.querySelector('#gp-f');
  const levelEl = container.querySelector('[data-level]');
  const scoreEl = container.querySelector('[data-score]');
  const infoEl = container.querySelector('[data-info]');
  const starsEl = container.querySelector('[data-stars]');

  let level = 0;
  let score = 0;
  let boxX = 0;
  let animating = false;
  let animV = 0;
  let targetD = 3;
  let raf = 0;
  let running = true;
  let last = performance.now();
  let message = '';

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function saveProgress() {
    const stars = score >= 80 ? 3 : score >= 50 ? 2 : score >= 20 ? 1 : 0;
    updateGame('game-grog-push', {
      stars,
      bestScore: Math.min(100, score),
      completed: score > 0,
    });
    if (stars) starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  }

  function syncInfo() {
    const L = LEVELS[level];
    levelEl.textContent = `${level + 1}/3`;
    scoreEl.textContent = String(score);
    infoEl.textContent = `${L.label}: m=${L.mass} kg. Ideal F≈${L.targetF} N para a≈3. Meta: no te pases.`;
    fEl.value = String(L.targetF);
  }

  function onPush() {
    if (animating || level >= LEVELS.length) return;
    const L = LEVELS[level];
    const F = Number(fEl.value);
    const a = F / L.mass;
    const ideal = L.targetF;
    const err = Math.abs(F - ideal);
    let gained = 0;
    if (err <= 2) gained = 34;
    else if (err <= 6) gained = 22;
    else if (err <= 12) gained = 12;
    else gained = 4;
    // penalize huge overshoot
    if (F > ideal * 1.6) gained = Math.max(0, gained - 10);

    score = Math.min(100, score + gained);
    message = `a=${a.toFixed(2)} m/s² · +${gained} pts`;
    boxX = 0;
    animV = 0;
    animating = true;
    targetD = 3;
    // store pending level advance after anim
    onPush._pending = { gained, next: true };
    scoreEl.textContent = String(score);
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (animating) {
      const L = LEVELS[Math.min(level, LEVELS.length - 1)];
      const F = Number(fEl.value);
      const a = F / L.mass;
      animV += a * dt;
      boxX += animV * dt;
      if (boxX >= targetD) {
        boxX = targetD;
        animating = false;
        level += 1;
        if (level >= LEVELS.length) {
          message = `¡Completado! Score ${score}`;
          saveProgress();
        } else {
          syncInfo();
        }
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
    const ground = h * 0.72;
    ctx.strokeStyle = '#2a3555';
    ctx.beginPath();
    ctx.moveTo(0, ground);
    ctx.lineTo(w, ground);
    ctx.stroke();

    const scale = (w - 80) / 5;
    const start = 40;
    const L = LEVELS[Math.min(level, LEVELS.length - 1)];
    const bx = start + boxX * scale;
    const bw = 24 + L.mass;
    ctx.fillStyle = '#f72585';
    ctx.fillRect(bx, ground - 40, bw, 40);
    ctx.font = '20px sans-serif';
    ctx.fillText('🟠', bx + bw / 2 - 10, ground - 14);
    ctx.fillStyle = '#9aa3c0';
    ctx.font = '12px sans-serif';
    ctx.fillText(message || `m=${L.mass} kg`, 12, 24);
    // goal line
    ctx.strokeStyle = '#b5f34a';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(start + 3 * scale, ground - 50);
    ctx.lineTo(start + 3 * scale, ground);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  function reset() {
    level = 0;
    score = 0;
    boxX = 0;
    animating = false;
    message = '';
    starsEl.textContent = '';
    syncInfo();
  }

  container.querySelector('[data-push]').addEventListener('click', onPush);
  container.querySelector('[data-reset]').addEventListener('click', reset);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas.parentElement);
  resize();
  syncInfo();
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
