import { updateGame } from '../../../state/index.js';

/**
 * game-orbit-hop — qualitative: outer orbit slower; timing rendezvous.
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountOrbitHop(container) {
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap" style="aspect-ratio:1; max-height:50vh;">
        <canvas data-canvas aria-label="Orbit Hop"></canvas>
      </div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">Órbita</div><div class="hud-stat__value" data-orbit>1</div></div>
        <div class="hud-stat"><div class="hud-stat__label">Score</div><div class="hud-stat__value" data-score>0</div></div>
      </div>
      <div class="sim-controls">
        <p class="text-muted">Salta cuando el satélite exterior esté alineado. Órbita externa = más lenta (Kepler cualitativo).</p>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-hop>Saltar órbita</button>
          <button type="button" class="btn btn-ghost" data-reset>Reiniciar</button>
        </div>
        <div class="stars-award" data-stars aria-live="polite"></div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const orbitEl = container.querySelector('[data-orbit]');
  const scoreEl = container.querySelector('[data-score]');
  const starsEl = container.querySelector('[data-stars]');

  // orbit index 0..2 — angular speeds decrease with radius
  const radii = [0.28, 0.42, 0.58];
  const omegas = [1.4, 0.85, 0.55]; // outer slower
  let playerOrbit = 0;
  let playerAngle = 0;
  let targetAngle = Math.PI; // beacon on next orbit
  let score = 0;
  let hops = 0;
  let raf = 0;
  let running = true;
  let last = performance.now();
  let flash = 0;
  let done = false;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function save() {
    const stars = score >= 80 ? 3 : score >= 45 ? 2 : score >= 15 ? 1 : 0;
    updateGame('game-orbit-hop', {
      stars,
      bestScore: Math.min(100, score),
      completed: hops > 0,
    });
    if (stars) starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  }

  function hop() {
    if (done) return;
    if (playerOrbit >= radii.length - 1) {
      done = true;
      score = Math.min(100, score + 20);
      scoreEl.textContent = String(score);
      save();
      return;
    }
    const next = playerOrbit + 1;
    // target beacon angle on next orbit moves with omega[next]
    let diff = Math.abs(((playerAngle - targetAngle + Math.PI) % (Math.PI * 2)) - Math.PI);
    // normalize diff 0..pi
    diff = Math.min(diff, Math.PI * 2 - diff);
    const align = diff < 0.45;
    if (align) {
      score = Math.min(100, score + 30);
      flash = 1;
      playerOrbit = next;
      hops += 1;
    } else {
      score = Math.max(0, score - 8);
      flash = -1;
    }
    orbitEl.textContent = String(playerOrbit + 1);
    scoreEl.textContent = String(score);
    if (playerOrbit >= radii.length - 1) {
      done = true;
      score = Math.min(100, score + 10);
      scoreEl.textContent = String(score);
      save();
    } else {
      save();
    }
  }

  function tick(now) {
    if (!running) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    playerAngle += omegas[playerOrbit] * dt;
    // beacon on next orbit (or same if last)
    const nextIdx = Math.min(playerOrbit + 1, radii.length - 1);
    targetAngle += omegas[nextIdx] * dt;
    if (flash !== 0) flash *= 0.9;
    if (Math.abs(flash) < 0.05) flash = 0;

    draw();
    raf = requestAnimationFrame(tick);
  }

  function draw() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = w / 2;
    const cy = h / 2;
    const R = Math.min(w, h) * 0.5;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = flash > 0 ? '#0a1810' : flash < 0 ? '#180a10' : '#070b16';
    ctx.fillRect(0, 0, w, h);

    // planet
    ctx.beginPath();
    ctx.arc(cx, cy, R * 0.12, 0, Math.PI * 2);
    ctx.fillStyle = '#7b2cbf';
    ctx.fill();

    for (let i = 0; i < radii.length; i++) {
      ctx.strokeStyle = i === playerOrbit ? '#2de2e6' : '#2a3555';
      ctx.lineWidth = i === playerOrbit ? 2 : 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radii[i] * R * 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // beacon on next orbit
    if (playerOrbit < radii.length - 1) {
      const br = radii[playerOrbit + 1] * R * 2;
      const bx = cx + Math.cos(targetAngle) * br;
      const by = cy + Math.sin(targetAngle) * br;
      ctx.fillStyle = '#b5f34a';
      ctx.beginPath();
      ctx.arc(bx, by, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // player
    const pr = radii[playerOrbit] * R * 2;
    const px = cx + Math.cos(playerAngle) * pr;
    const py = cy + Math.sin(playerAngle) * pr;
    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🟡', px, py + 7);
    ctx.textAlign = 'left';

    ctx.fillStyle = '#9aa3c0';
    ctx.font = '11px sans-serif';
    ctx.fillText('Exterior más lento', 8, 16);
    if (done) {
      ctx.fillStyle = '#b5f34a';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('¡Órbita completa!', cx, cy);
      ctx.textAlign = 'left';
    }
  }

  function reset() {
    playerOrbit = 0;
    playerAngle = 0;
    targetAngle = Math.PI;
    score = 0;
    hops = 0;
    done = false;
    flash = 0;
    orbitEl.textContent = '1';
    scoreEl.textContent = '0';
    starsEl.textContent = '';
  }

  container.querySelector('[data-hop]').addEventListener('click', hop);
  container.querySelector('[data-reset]').addEventListener('click', reset);
  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    hop();
  });

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
    container.innerHTML = '';
  };
}
