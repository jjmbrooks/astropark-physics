import { GAMES, getGame } from './catalog.js';
import { mountZorpDash } from './games/zorp-dash.js';
import { navigate } from '../../router/index.js';
import { getProgress } from '../../state/index.js';

/** @type {Record<string, (el: HTMLElement) => () => void>} */
export const GAME_MOUNTERS = {
  'game-zorp-dash': mountZorpDash,
};

export function registerGame(id, fn) {
  GAME_MOUNTERS[id] = fn;
}

/**
 * @param {string} id
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderGameView(id) {
  const meta = getGame(id);
  const el = document.createElement('div');
  el.className = 'view view--game';

  if (!meta || !GAME_MOUNTERS[id]) {
    el.innerHTML = `
      <header class="view-header">
        <button type="button" class="btn-back" data-back>← Arcade</button>
        <h1 class="view-header__title">${meta ? meta.name : 'Juego no listo'}</h1>
        <p class="view-header__subtitle">${meta ? 'Disponible en una fase posterior' : 'ID desconocido'}</p>
      </header>
      <div class="view-body">
        <div class="placeholder-card"><p>Este juego aún no está implementado.</p></div>
      </div>
    `;
    el.querySelector('[data-back]')?.addEventListener('click', () => navigate('arcade'));
    return { el, destroy() {} };
  }

  const progress = getProgress();
  const g = progress.games[id] || { stars: 0, bestScore: 0 };

  el.innerHTML = `
    <header class="view-header">
      <button type="button" class="btn-back" data-back aria-label="Volver a arcade">← Arcade</button>
      <h1 class="view-header__title"><span aria-hidden="true">${meta.emoji}</span> ${meta.name}</h1>
      <p class="view-header__subtitle">Mejor: ${g.bestScore}/100 · ${g.stars ? '★'.repeat(g.stars) : 'Sin ★'}</p>
    </header>
    <div class="view-body" data-mount></div>
  `;
  el.querySelector('[data-back]')?.addEventListener('click', () => navigate('arcade'));
  const destroyGame = GAME_MOUNTERS[id](el.querySelector('[data-mount]'));

  return {
    el,
    destroy() {
      if (typeof destroyGame === 'function') destroyGame();
    },
  };
}

export function renderArcadeList() {
  const progress = getProgress();
  const el = document.createElement('div');
  el.className = 'view view--arcade';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Zona Arcade</h1>
      <p class="view-header__subtitle">Mini-juegos · timing y fuerza</p>
    </header>
    <div class="view-body"><div class="activity-list" data-list></div></div>
  `;
  const list = el.querySelector('[data-list]');
  for (const g of GAMES) {
    const p = progress.games[g.id] || { stars: 0, bestScore: 0 };
    const ready = Boolean(GAME_MOUNTERS[g.id]);
    const card = document.createElement(ready ? 'a' : 'div');
    if (ready) card.href = `#/arcade/${g.id}`;
    card.className = 'activity-card';
    card.setAttribute('aria-label', `${g.name}. ${ready ? 'Jugar' : 'Próximamente'}`);
    card.innerHTML = `
      <span class="activity-card__icon" aria-hidden="true">${g.emoji}</span>
      <span class="activity-card__body">
        <span class="activity-card__title">${g.name}</span>
        <span class="activity-card__sub">${g.blurb}</span>
        <span class="activity-card__sub">${
          ready
            ? p.bestScore
              ? `Mejor ${p.bestScore} · ${'★'.repeat(p.stars) || '—'}`
              : 'Jugar'
            : 'Próximamente'
        }</span>
      </span>
    `;
    if (!ready) card.style.opacity = '0.55';
    list.appendChild(card);
  }
  return { el, destroy() {} };
}
