import { updateGame } from '../../../state/index.js';

/**
 * game-zorp-dash — endless/timed lane dash with pointer events.
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountZorpDash(container) {
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap" style="aspect-ratio: 9/14; max-height: 55vh;">
        <canvas data-canvas aria-label="Zorp Dash"></canvas>
      </div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">Score</div><div class="hud-stat__value" data-score>0</div></div>
        <div class="hud-stat"><div class="hud-stat__label">Tiempo</div><div class="hud-stat__value" data-time>30</div></div>
      </div>
      <div class="sim-controls">
        <p class="text-muted">Toca izquierda/derecha (o desliza) para cambiar de carril. Velocidad constante — timing de inercia.</p>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-start>Jugar</button>
          <button type="button" class="btn btn-ghost" data-reset>Reiniciar</button>
        </div>
        <div class="stars-award" data-stars aria-live="polite"></div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const scoreEl = container.querySelector('[data-score]');
  const timeEl = container.querySelector('[data-time]');
  const starsEl = container.querySelector('[data-stars]');
  const startBtn = container.querySelector('[data-start]');

  const LANES = 3;
  let lane = 1;
  let obstacles = [];
  let score = 0;
  let timeLeft = 30;
  let playing = false;
  let gameOver = false;
  let raf = 0;
  let running = true;
  let last = performance.now();
  let spawnAcc = 0;
  let speed = 180; // px/s constant-ish

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function starsFromScore(s) {
    if (s >= 70) return 3;
    if (s >= 40) return 2;
    if (s >= 15) return 1;
    return 0;
  }

  function finish() {
    playing = false;
    gameOver = true;
    const stars = starsFromScore(score);
    const capped = Math.min(100, score);
    updateGame('game-zorp-dash', {
      stars,
      bestScore: capped,
      completed: capped > 0,
    });
    if (stars) starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    startBtn.textContent = 'Otra vez';
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (playing) {
      timeLeft -= dt;
      if (timeLeft <= 0) {
        timeLeft = 0;
        finish();
      }
      spawnAcc += dt;
      if (spawnAcc > 0.7) {
        spawnAcc = 0;
        const l = Math.floor(Math.random() * LANES);
        obstacles.push({ lane: l, y: -40 });
      }
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const playerY = h * 0.82;
      for (const o of obstacles) {
        o.y += speed * dt;
      }
      obstacles = obstacles.filter((o) => {
        if (o.y > h + 40) {
          score += 2;
          return false;
        }
        // collision
        if (o.lane === lane && Math.abs(o.y - playerY) < 28) {
          score = Math.max(0, score - 8);
          return false;
        }
        return true;
      });
      scoreEl.textContent = String(Math.min(100, score));
      timeEl.textContent = String(Math.ceil(timeLeft));
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

    const laneW = w / LANES;
    for (let i = 1; i < LANES; i++) {
      ctx.strokeStyle = '#2a3555';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(i * laneW, 0);
      ctx.lineTo(i * laneW, h);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    for (const o of obstacles) {
      ctx.fillStyle = '#f72585';
      ctx.fillRect(o.lane * laneW + laneW * 0.2, o.y - 16, laneW * 0.6, 32);
    }

    const px = lane * laneW + laneW / 2;
    const py = h * 0.82;
    ctx.font = '28px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🟢', px, py);
    ctx.textAlign = 'left';

    if (!playing && !gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#e8ecf8';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Toca Jugar', w / 2, h / 2);
      ctx.textAlign = 'left';
    }
    if (gameOver) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#b5f34a';
      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Score ${Math.min(100, score)}`, w / 2, h / 2);
      ctx.textAlign = 'left';
    }
  }

  function move(dir) {
    if (!playing) return;
    lane = Math.max(0, Math.min(LANES - 1, lane + dir));
  }

  function onPointer(e) {
    if (!playing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    if (x < rect.width / 2) move(-1);
    else move(1);
  }

  let startX = 0;
  function onPointerDown(e) {
    startX = e.clientX;
    canvas.setPointerCapture?.(e.pointerId);
  }
  function onPointerUp(e) {
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 30) move(dx > 0 ? 1 : -1);
    else onPointer(e);
  }

  function start() {
    lane = 1;
    obstacles = [];
    score = 0;
    timeLeft = 30;
    playing = true;
    gameOver = false;
    spawnAcc = 0;
    scoreEl.textContent = '0';
    timeEl.textContent = '30';
    starsEl.textContent = '';
    startBtn.textContent = 'En partida…';
  }

  function reset() {
    playing = false;
    gameOver = false;
    obstacles = [];
    score = 0;
    timeLeft = 30;
    lane = 1;
    scoreEl.textContent = '0';
    timeEl.textContent = '30';
    startBtn.textContent = 'Jugar';
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointerup', onPointerUp);
  startBtn.addEventListener('click', start);
  container.querySelector('[data-reset]').addEventListener('click', reset);

  const onKey = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'a') move(-1);
    if (e.key === 'ArrowRight' || e.key === 'd') move(1);
  };
  window.addEventListener('keydown', onKey);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas.parentElement);
  resize();
  last = performance.now();
  raf = requestAnimationFrame(tick);

  return function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    window.removeEventListener('keydown', onKey);
    container.innerHTML = '';
  };
}
