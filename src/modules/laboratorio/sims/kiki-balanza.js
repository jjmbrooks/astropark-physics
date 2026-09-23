import { PLANET_G } from '../../atracciones/data.js';
import { updateSim } from '../../../state/index.js';

/**
 * sim-kiki-balanza — planeta + masa → peso; quiz para ★
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountKikiBalanza(container) {
  const planets = Object.entries(PLANET_G);
  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap"><canvas data-canvas aria-label="Balanza de planetas de Kiki"></canvas></div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">Masa m</div><div class="hud-stat__value" data-m>50 kg</div></div>
        <div class="hud-stat"><div class="hud-stat__label">Peso P</div><div class="hud-stat__value" data-p>375 N</div></div>
      </div>
      <div class="sim-controls">
        <div class="control-row">
          <label for="kiki-planet">Planeta (g)</label>
          <select id="kiki-planet">
            ${planets
              .map(
                ([key, p]) =>
                  `<option value="${key}" ${key === 'xenon9' ? 'selected' : ''}>${p.label} · g=${p.g} m/s²</option>`,
              )
              .join('')}
          </select>
        </div>
        <div class="control-row">
          <label for="kiki-mass">Masa (kg)</label>
          <input id="kiki-mass" type="range" min="10" max="100" step="1" value="50" />
        </div>
        <div class="control-row">
          <label for="kiki-quiz">Quiz: ¿cuánto pesa 50 kg en Xenon-9?</label>
          <select id="kiki-quiz" aria-label="Respuesta del quiz">
            <option value="">Elige…</option>
            <option value="50">50 kg</option>
            <option value="375">375 N</option>
            <option value="490">490 N</option>
            <option value="80">80 N</option>
          </select>
        </div>
        <div class="sim-actions">
          <button type="button" class="btn btn-primary" data-check>Comprobar</button>
        </div>
        <p class="text-muted" data-hint>P = m·g. En Xenon-9, g = 7.5 m/s². Masa ≠ peso.</p>
        <div class="stars-award" data-stars aria-live="polite"></div>
      </div>
    </div>
  `;

  const canvas = container.querySelector('[data-canvas]');
  const ctx = canvas.getContext('2d');
  const planetEl = container.querySelector('#kiki-planet');
  const massEl = container.querySelector('#kiki-mass');
  const quizEl = container.querySelector('#kiki-quiz');
  const mOut = container.querySelector('[data-m]');
  const pOut = container.querySelector('[data-p]');
  const starsEl = container.querySelector('[data-stars]');
  const hintEl = container.querySelector('[data-hint]');

  let raf = 0;
  let running = true;
  let awarded = 0;
  let pulse = 0;

  function current() {
    const key = planetEl.value;
    const planet = PLANET_G[key] || PLANET_G.xenon9;
    const m = Number(massEl.value);
    const P = m * planet.g;
    return { key, planet, m, P };
  }

  function refresh() {
    const { m, P, planet } = current();
    mOut.textContent = `${m} kg`;
    pOut.textContent = `${P.toFixed(1)} N`;
    // soft stars for exploring different planets with same mass
    if (planet.g === 7.5 && m === 50) {
      maybeAward(1);
    }
  }

  function maybeAward(stars) {
    if (stars <= awarded) return;
    awarded = stars;
    updateSim('sim-kiki-balanza', { stars, bestScore: stars * 33, completed: true });
    starsEl.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
  }

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function tick() {
    if (!running) return;
    pulse += 0.05;
    draw();
    raf = requestAnimationFrame(tick);
  }

  function draw() {
    const { m, P, planet } = current();
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = '#070b16';
    ctx.fillRect(0, 0, w, h);

    // planet circle
    const cx = w * 0.28;
    const cy = h * 0.55;
    const r = 36 + planet.g * 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = planet.g > 15 ? '#f72585' : planet.g > 8 ? '#4cc9f0' : planet.g > 5 ? '#b5179e' : '#9aa3c0';
    ctx.fill();
    ctx.fillStyle = '#e8ecf8';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(planet.label, cx, cy + 4);
    ctx.fillText(`g=${planet.g}`, cx, cy + 18);

    // kiki + scale
    const kx = w * 0.7;
    const ky = h * 0.35;
    ctx.font = '28px sans-serif';
    ctx.fillText('🟣', kx, ky);
    // spring scale visual
    const stretch = Math.min(80, P / 8);
    ctx.strokeStyle = '#2de2e6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(kx, ky + 10);
    ctx.lineTo(kx, ky + 10 + stretch);
    ctx.stroke();
    ctx.fillStyle = '#b5f34a';
    ctx.fillRect(kx - 20, ky + 10 + stretch, 40, 18);
    ctx.fillStyle = '#0b1020';
    ctx.font = '11px sans-serif';
    ctx.fillText(`${P.toFixed(0)} N`, kx, ky + 23 + stretch);
    ctx.fillStyle = '#9aa3c0';
    ctx.fillText(`m=${m} kg`, kx, h * 0.9);
    ctx.textAlign = 'left';
  }

  function onCheck() {
    const ans = quizEl.value;
    if (ans === '375') {
      maybeAward(3);
      hintEl.textContent = '¡Correcto! 50 × 7.5 = 375 N. La masa sigue siendo 50 kg.';
    } else if (ans === '490') {
      maybeAward(1);
      hintEl.textContent = 'Eso sería en la Tierra (9.8). En Xenon-9 g=7.5 → 375 N.';
    } else if (ans === '50') {
      hintEl.textContent = '50 kg es la masa, no el peso. El peso va en newtons (N).';
      maybeAward(1);
    } else {
      hintEl.textContent = 'Prueba otra opción. Recuerda P = m·g con g=7.5.';
    }
  }

  planetEl.addEventListener('change', refresh);
  massEl.addEventListener('input', refresh);
  container.querySelector('[data-check]').addEventListener('click', onCheck);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas.parentElement);
  resize();
  refresh();
  raf = requestAnimationFrame(tick);

  return function destroy() {
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
    ro.disconnect();
    container.innerHTML = '';
  };
}
