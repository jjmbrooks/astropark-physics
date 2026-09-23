import { getAttraction } from './data.js';
import { getProgress, markAttractionRead } from '../../state/index.js';
import { navigate } from '../../router/index.js';

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
      <div class="view-body"><p class="text-muted">Esa atracción no existe.</p></div>
    `;
    el.querySelector('[data-back]')?.addEventListener('click', () => navigate('atracciones'));
    return { el, destroy() {} };
  }

  // Marcar leída al abrir detalle
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
    ? `<a class="btn btn-primary" href="#/laboratorio/${a.labId}">Probar sim</a>`
    : '';
  const arcadeCta = a.arcadeId
    ? `<a class="btn btn-secondary" href="#/arcade/${a.arcadeId}">Jugar arcade</a>`
    : '';

  el.innerHTML = `
    <header class="view-header">
      <button type="button" class="btn-back" data-back aria-label="Volver a atracciones">← Atracciones</button>
      <h1 class="view-header__title">
        <span aria-hidden="true">${a.emoji}</span> ${escapeHtml(a.alien)}
      </h1>
      <p class="view-header__subtitle">${escapeHtml(a.name)} · ${escapeHtml(a.concept)}</p>
    </header>
    <div class="view-body attr-detail__body">
      <section class="panel">
        <h2 class="panel__title">Historia</h2>
        <p class="theory-p">${escapeHtml(a.story)}</p>
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
        <div class="cta-row">${labCta}${arcadeCta}</div>
      </section>
    </div>
  `;

  el.querySelector('[data-back]')?.addEventListener('click', () => navigate('atracciones'));
  el.querySelector('[data-mark-read]')?.addEventListener('click', () => {
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
