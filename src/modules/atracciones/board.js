import { ATTRACTIONS } from './data.js';
import { getProgress } from '../../state/index.js';
import { navigate } from '../../router/index.js';

function starsLabel(n) {
  if (!n) return 'Sin estrellas';
  return '★'.repeat(n) + '☆'.repeat(3 - n);
}

/**
 * Board de 5 cards.
 * @returns {HTMLElement}
 */
export function renderAttractionBoard() {
  const progress = getProgress();
  const wrap = document.createElement('div');
  wrap.className = 'attr-board';

  for (const a of ATTRACTIONS) {
    const p = progress.attractions[a.slug] || { read: false, stars: 0 };
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'attr-card';
    card.style.setProperty('--accent', a.color);
    card.setAttribute('aria-label', `${a.alien}: ${a.name}. ${p.read ? 'Leída' : 'Sin leer'}`);
    card.innerHTML = `
      <span class="attr-card__emoji" aria-hidden="true">${a.emoji}</span>
      <span class="attr-card__body">
        <span class="attr-card__alien">${a.alien}</span>
        <span class="attr-card__name">${a.name}</span>
        <span class="attr-card__concept">${a.concept}</span>
        <span class="attr-card__meta">
          <span class="badge ${p.read ? 'badge--ok' : 'badge--muted'}">${p.read ? 'Leída' : 'Por leer'}</span>
          <span class="attr-card__stars" aria-hidden="true">${starsLabel(p.stars)}</span>
        </span>
      </span>
      <span class="attr-card__chevron" aria-hidden="true">›</span>
    `;
    card.addEventListener('click', () => navigate(`atracciones/${a.slug}`));
    wrap.appendChild(card);
  }

  return wrap;
}
