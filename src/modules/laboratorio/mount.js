import { SIMS, getSim } from './catalog.js';
import { mountZorpInercia } from './sims/zorp-inercia.js';
import { mountGrogEmpuje } from './sims/grog-empuje.js';
import { mountKikiBalanza } from './sims/kiki-balanza.js';
import { mountNebuCaida } from './sims/nebu-caida.js';
import { navigate } from '../../router/index.js';
import { getProgress } from '../../state/index.js';

/** @type {Record<string, (el: HTMLElement) => () => void>} */
export const MOUNTERS = {
  'sim-zorp-inercia': mountZorpInercia,
  'sim-grog-empuje': mountGrogEmpuje,
  'sim-kiki-balanza': mountKikiBalanza,
  'sim-nebu-caida': mountNebuCaida,
};

/**
 * Register additional sim mounters (F4+).
 * @param {string} id
 * @param {(el: HTMLElement) => () => void} fn
 */
export function registerSim(id, fn) {
  MOUNTERS[id] = fn;
}

/**
 * @param {string} id
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderSimView(id) {
  const meta = getSim(id);
  const el = document.createElement('div');
  el.className = 'view view--sim';

  if (!meta || !MOUNTERS[id]) {
    el.innerHTML = `
      <header class="view-header">
        <button type="button" class="btn-back" data-back>← Laboratorio</button>
        <h1 class="view-header__title">${meta ? meta.name : 'Sim no listo'}</h1>
        <p class="view-header__subtitle">${meta ? 'Disponible en una fase posterior' : 'ID desconocido'}</p>
      </header>
      <div class="view-body">
        <div class="placeholder-card"><p>Este simulador aún no está implementado. Vuelve al laboratorio.</p></div>
      </div>
    `;
    el.querySelector('[data-back]')?.addEventListener('click', () => navigate('laboratorio'));
    return { el, destroy() {} };
  }

  const progress = getProgress();
  const stars = progress.sims[id]?.stars || 0;

  el.innerHTML = `
    <header class="view-header">
      <button type="button" class="btn-back" data-back aria-label="Volver al laboratorio">← Laboratorio</button>
      <h1 class="view-header__title"><span aria-hidden="true">${meta.emoji}</span> ${meta.name}</h1>
      <p class="view-header__subtitle">${meta.alien} · ${stars ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : 'Sin estrellas aún'}</p>
    </header>
    <div class="view-body" data-mount></div>
  `;
  el.querySelector('[data-back]')?.addEventListener('click', () => navigate('laboratorio'));

  const mountEl = el.querySelector('[data-mount]');
  const destroySim = MOUNTERS[id](mountEl);

  return {
    el,
    destroy() {
      if (typeof destroySim === 'function') destroySim();
    },
  };
}

/**
 * Lista de sims.
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderLabList() {
  const progress = getProgress();
  const el = document.createElement('div');
  el.className = 'view view--laboratorio';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Laboratorio</h1>
      <p class="view-header__subtitle">Sims Canvas 2D · física con las manos</p>
    </header>
    <div class="view-body"><div class="activity-list" data-list></div></div>
  `;
  const list = el.querySelector('[data-list]');
  for (const s of SIMS) {
    const p = progress.sims[s.id] || { stars: 0 };
    const ready = Boolean(MOUNTERS[s.id]);
    const card = document.createElement(ready ? 'a' : 'div');
    if (ready) card.href = `#/laboratorio/${s.id}`;
    card.className = 'activity-card';
    card.setAttribute('aria-label', `${s.name}. ${ready ? 'Abrir' : 'Próximamente'}`);
    card.innerHTML = `
      <span class="activity-card__icon" aria-hidden="true">${s.emoji}</span>
      <span class="activity-card__body">
        <span class="activity-card__title">${s.name}</span>
        <span class="activity-card__sub">${s.blurb}</span>
        <span class="activity-card__sub">${ready ? (p.stars ? '★'.repeat(p.stars) + '☆'.repeat(3 - p.stars) : 'Jugar') : 'Próximamente'}</span>
      </span>
    `;
    if (!ready) card.style.opacity = '0.55';
    list.appendChild(card);
  }
  return { el, destroy() {} };
}
