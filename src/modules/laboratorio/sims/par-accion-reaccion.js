import { updateSim } from '../../../state/index.js';
import { playSuccess, playFail, playStar } from '../../../audio/engine.js';

/**
 * sim-par-accion-reaccion — 3ª ley de Newton + vectores (PF2 / M1).
 * Grog (izq) y Kiki (der) se empujan: fuerzas iguales y opuestas hacia AFUERA;
 * a = F/m distinta si las masas difieren.
 * @param {HTMLElement} container
 * @returns {() => void}
 */
export function mountParAccionReaccion(container) {
  const base = import.meta.env.BASE_URL || '/';

  container.innerHTML = `
    <div class="sim-layout">
      <div class="sim-canvas-wrap sim-canvas-wrap--tall" style="min-width:360px;aspect-ratio:16/12;max-height:48vh">
        <canvas data-canvas aria-label="Par acción-reacción: Grog y Kiki se empujan"></canvas>
      </div>
      <div class="hud-stats">
        <div class="hud-stat"><div class="hud-stat__label">|F| (iguales)</div><div class="hud-stat__value" data-f>20 N</div></div>
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
        <p class="text-muted" data-hint>Las fuerzas del par son iguales. Lo que cambia con la masa es la aceleración: a = F/m.</p>
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

  /** @type {HTMLImageElement} */
  const imgGrog = new Image();
  /** @type {HTMLImageElement} */
  const imgKiki = new Image();
  let grogReady = false;
  let kikiReady = false;
  imgGrog.onload = () => {
    grogReady = true;
  };
  imgKiki.onload = () => {
    kikiReady = true;
  };
  imgGrog.src = `${base}assets/aliens/busto-grog-256.webp`;
  imgKiki.src = `${base}assets/aliens/busto-kiki-256.webp`;

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

  /**
   * Flecha de x0→x1. Label debajo o encima según preferencia.
   * @param {'above'|'below'} labelSide
   */
  function drawArrow(x0, y0, x1a, y1a, color, label, {
    dashed = false,
    lineWidth = 3,
    labelSide = 'below',
    canvasW = 360,
    canvasH = 200,
  } = {}) {
    const dx = x1a - x0;
    const dy = y1a - y0;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    if (dashed) ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1a, y1a);
    ctx.stroke();
    ctx.setLineDash([]);
    const ah = 8;
    ctx.beginPath();
    ctx.moveTo(x1a, y1a);
    ctx.lineTo(x1a - ux * ah - uy * ah * 0.5, y1a - uy * ah + ux * ah * 0.5);
    ctx.lineTo(x1a - ux * ah + uy * ah * 0.5, y1a - uy * ah - ux * ah * 0.5);
    ctx.closePath();
    ctx.fill();
    if (label) {
      ctx.font = '10px sans-serif';
      const tw = ctx.measureText(label).width;
      let lx;
      let ly;
      if (labelSide === 'tip-out') {
        // etiqueta junto a la punta, hacia afuera (no arriba → sin clip superior)
        lx = ux < 0 ? x1a - tw - 4 : x1a + 4;
        ly = y0 + 4;
      } else if (labelSide === 'above') {
        lx = (x0 + x1a) / 2 - tw / 2;
        ly = Math.max(12, y0 - 6);
      } else {
        lx = (x0 + x1a) / 2 - tw / 2;
        ly = y0 + 14;
      }
      lx = Math.max(2, Math.min(canvasW - tw - 2, lx));
      ly = Math.max(11, Math.min(canvasH - 4, ly));
      ctx.fillText(label, lx, ly);
    }
    ctx.restore();
  }

  function bodyRadius(mass) {
    return Math.max(20, Math.min(30, 14 + mass * 0.9));
  }

  /**
   * Busto recortado en círculo + hover-skate; fallback = círculo de color.
   */
  function drawAlien(cx, cy, color, label, mass, img, imgReady) {
    const r = bodyRadius(mass);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    if (imgReady && img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
      ctx.fillStyle = '#0b1020';
      ctx.beginPath();
      ctx.arc(cx - r * 0.3, cy - r * 0.15, 3.5, 0, Math.PI * 2);
      ctx.arc(cx + r * 0.3, cy - r * 0.15, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // ring
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // hover-skate
    ctx.fillStyle = '#4CC9F0';
    ctx.shadowColor = 'rgba(76,201,240,0.55)';
    ctx.shadowBlur = 6;
    ctx.fillRect(cx - r - 6, cy + r - 3, r * 2 + 12, 7);
    ctx.shadowBlur = 0;

    // name + mass under body (nunca arriba → sin clip)
    ctx.fillStyle = '#e8ecf8';
    ctx.font = 'bold 11px sans-serif';
    const nameW = ctx.measureText(label).width;
    ctx.fillText(label, cx - nameW / 2, cy + r + 18);
    ctx.fillStyle = '#9aa3c0';
    ctx.font = '10px sans-serif';
    const massLabel = `m=${mass} kg`;
    const mw = ctx.measureText(massLabel).width;
    ctx.fillText(massLabel, cx - mw / 2, cy + r + 30);

    return r;
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
      const sx = (i * 97) % w;
      const sy = 12 + ((i * 53) % Math.max(1, h * 0.4));
      ctx.fillRect(sx, sy, 1.5, 1.5);
    }

    // ground leaves room under bodies for name/mass; top margin for force arrows
    const ground = h * 0.82;
    ctx.strokeStyle = '#2a3555';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, ground);
    ctx.lineTo(w, ground);
    ctx.stroke();

    const mid = w * 0.5;
    const scale = Math.min(12, (w - 110) / 40);
    // inset so outward arrows + tip labels fit at 360px
    const inset = 88;
    const base1 = Math.max(inset, mid - 72);
    const base2 = Math.min(w - inset, mid + 72);
    const gX = base1 - x1 * scale;
    const kX = base2 + x2 * scale;
    const cy = ground - 48;

    const r1 = drawAlien(gX, cy, '#FF8C42', 'Grog', m1, imgGrog, grogReady);
    const r2 = drawAlien(kX, cy, '#FFD93D', 'Kiki', m2, imgKiki, kikiReady);

    // ——— Fuerzas del par: misma longitud, sentidos OPUESTOS hacia AFUERA ———
    // Empujón: F sobre Grog (de Kiki) → izquierda; F sobre Kiki (de Grog) → derecha.
    // F₁₂ = fuerza sobre 1 (Grog) por 2 (Kiki); F₂₁ = sobre 2 por 1.
    // Fuerzas ancladas al borde del cuerpo, hacia AFUERA; etiqueta en la punta (tip-out)
    const forceLen = Math.min(44, 16 + F * 0.75); // misma px para ambos
    const fy = cy;

    // Grog: desde borde izquierdo → IZQUIERDA (afuera)
    drawArrow(gX - r1, fy, gX - r1 - forceLen, fy, '#FF5DB1', `F₁₂=${F}N`, {
      labelSide: 'tip-out',
      canvasW: w,
      canvasH: h,
    });
    // Kiki: desde borde derecho → DERECHA (afuera)
    drawArrow(kX + r2, fy, kX + r2 + forceLen, fy, '#4CC9F0', `F₂₁=${F}N`, {
      labelSide: 'tip-out',
      canvasW: w,
      canvasH: h,
    });

    // Aceleraciones: lima dashed, largo ∝ a, misma dirección; etiqueta abajo del eje
    const aScale = 6;
    const aLen1 = Math.min(52, Math.max(12, a1 * aScale));
    const aLen2 = Math.min(52, Math.max(12, a2 * aScale));
    const ay = cy + 16;
    drawArrow(gX - r1, ay, gX - r1 - aLen1, ay, '#B7F34C', `a₁=${a1.toFixed(1)}`, {
      dashed: true,
      lineWidth: 2,
      labelSide: 'below',
      canvasW: w,
      canvasH: h,
    });
    drawArrow(kX + r2, ay, kX + r2 + aLen2, ay, '#B7F34C', `a₂=${a2.toFixed(1)}`, {
      dashed: true,
      lineWidth: 2,
      labelSide: 'below',
      canvasW: w,
      canvasH: h,
    });

    // Leyenda (pie del canvas, sin clip)
    ctx.fillStyle = '#9aa3c0';
    ctx.font = '9px sans-serif';
    const legend = 'F₁₂: sobre Grog (de Kiki) · F₂₁: sobre Kiki (de Grog) · mismas |F|';
    const lw = ctx.measureText(legend).width;
    ctx.fillText(legend, Math.max(4, mid - lw / 2), h - 6);
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
    // Misconception a contradecir: “la fuerza es mayor sobre el más ligero” / “la fuerza mayor gana”
    if (prediction === 'igual') {
      msg =
        'Casi: las fuerzas del par son iguales (misma longitud de flecha). No es que “haya más fuerza sobre el ligero”: lo que cambia es la aceleración, a = F/m. Quien tenga menos masa acelera más.';
      predictedOk = false;
    } else if (prediction === faster) {
      msg =
        '¡Bien! F₁₂ = F₂₁ siempre (3ª ley). El error “la fuerza es mayor sobre el más ligero” es falso: las fuerzas son iguales; lo que cambia es a = F/m. Por eso el de menos masa sale más rápido.';
      predictedOk = true;
    } else {
      msg =
        'Ojo: no gana “quien recibe más fuerza”. En el par, las dos fuerzas son iguales y opuestas. Acelera más quien tiene menos masa (a = F/m). El mito “la fuerza es mayor sobre el más ligero” hay que dejarlo atrás.';
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
