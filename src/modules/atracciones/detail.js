import { getAttraction, bustUrl, poseUrl } from './data.js';
import { getProgress, markAttractionRead } from '../../state/index.js';
import { navigate } from '../../router/index.js';
import { playTap, playPortal } from '../../audio/engine.js';

/**
 * Detalle de atracción.
 * @param {string} slug
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderAttractionDetail(slug) {
  const a = getAttraction(slug);
  const el = document.createElement('div');
  el.className = 'attr-detail';

  if (!a) {
    el.innerHTML = `
      <header class="view-header">
        <button type="button" class="btn-back" data-back>← Atracciones</button>
        <h1 class="view-header__title">No encontrada</h1>
      </header>
      <div class="view-body">
        <p class="text-muted">Esa atracción no existe en Xenon-9. Vuelve al mapa del parque.</p>
      </div>
    `;
    el.querySelector('[data-back]')?.addEventListener('click', () => navigate('atracciones'));
    return { el, destroy() {} };
  }

  markAttractionRead(a.slug);
  const progress = getProgress();
  const p = progress.attractions[a.slug];

  const theoryHtml = a.theory.map((t) => `<p class="theory-p">${escapeHtml(t)}</p>`).join('');
  const goalsHtml = a.goals.map((g) => `<li>${escapeHtml(g)}</li>`).join('');
  const formulasHtml = a.formulas
    .map(
      (f) => `
      <div class="formula-card">
        <div class="formula-card__label">${escapeHtml(f.label)}</div>
        <div class="formula-card__expr" role="math">${escapeHtml(f.expr)}</div>
      </div>`,
    )
    .join('');

  const labCta = a.labId
    ? `<a class="btn btn-primary" href="#/laboratorio/${a.labId}" data-cta>Probar sim</a>`
    : '';
  const labExtra = a.labExtraId
    ? `<a class="btn btn-secondary" href="#/laboratorio/${a.labExtraId}" data-cta>Par acción-reacción</a>`
    : '';
  const arcadeCta = a.arcadeId
    ? `<a class="btn btn-secondary" href="#/arcade/${a.arcadeId}" data-cta>Jugar arcade</a>`
    : '';

  const bust = bustUrl(a.slug, 256);
  const pose = poseUrl(a.slug, 'accion');

  el.style.setProperty('--accent', a.color);

  el.innerHTML = `
    <header class="view-header" style="border-bottom-color: color-mix(in srgb, var(--accent) 45%, transparent)">
      <button type="button" class="btn-back" data-back aria-label="Volver a atracciones">← Atracciones</button>
      <h1 class="view-header__title view-header__title--with-bust">
        <img class="detail-bust" src="${bust}" width="64" height="64"
          alt="${escapeHtml(a.alien)}, alien del parque, atracción de ${escapeHtml(a.concept)}" />
        ${escapeHtml(a.alien)}
      </h1>
      <p class="view-header__subtitle">${escapeHtml(a.name)} · ${escapeHtml(a.concept)}</p>
    </header>
    <div class="view-body attr-detail__body">
      <section class="panel panel--pose">
        <img class="detail-pose" src="${pose}" width="220" height="293" alt=""
          loading="lazy" decoding="async" />
        <div>
          <h2 class="panel__title">Historia</h2>
          <p class="theory-p">${escapeHtml(a.story)}</p>
        </div>
      </section>

      <section class="panel">
        <h2 class="panel__title">Objetivos de aprendizaje</h2>
        <ul class="goal-list">${goalsHtml}</ul>
      </section>

      <section class="panel">
        <h2 class="panel__title">Teoría</h2>
        ${theoryHtml}
        <p class="theory-p theory-p--warn"><strong>Ojo:</strong> ${escapeHtml(a.misconception)}</p>
      </section>

      <section class="panel">
        <h2 class="panel__title">Fórmulas</h2>
        <div class="formula-grid">${formulasHtml}</div>
        <p class="theory-p"><strong>Ejemplo:</strong> ${escapeHtml(a.example)}</p>
      </section>

      <section class="panel panel--cta">
        <p class="badge ${p.read ? 'badge--ok' : 'badge--muted'}" data-read-badge>
          ${p.read ? '✓ Marcada como leída' : 'Sin marcar'}
        </p>
        <button type="button" class="btn btn-ghost" data-mark-read>Marcar como leída</button>
        <div class="cta-row">${labCta}${labExtra}${arcadeCta}</div>
      </section>
    </div>
  `;

  el.querySelector('[data-back]')?.addEventListener('click', () => {
    playTap();
    navigate('atracciones');
  });
  el.querySelectorAll('[data-cta]').forEach((n) =>
    n.addEventListener('click', () => {
      playTap();
      playPortal();
    }),
  );
  el.querySelector('[data-mark-read]')?.addEventListener('click', () => {
    playTap();
    markAttractionRead(a.slug);
    const badge = el.querySelector('[data-read-badge]');
    if (badge) {
      badge.className = 'badge badge--ok';
      badge.textContent = '✓ Marcada como leída';
    }
  });

  return { el, destroy() {} };
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
