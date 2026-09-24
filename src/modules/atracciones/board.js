import { ATTRACTIONS, bustUrl } from './data.js';
import { getProgress } from '../../state/index.js';
import { navigate } from '../../router/index.js';
import { playTap, playPortal } from '../../audio/engine.js';

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
    card.setAttribute(
      'aria-label',
      `${a.alien}: ${a.name}. ${p.read ? 'Leída' : 'Sin leer'}`,
    );
    const src256 = bustUrl(a.slug, 256);
    const srcFull = bustUrl(a.slug, 1024);
    card.innerHTML = `
      <span class="attr-card__portrait" aria-hidden="true">
        <img
          src="${src256}"
          srcset="${src256} 256w, ${srcFull} 1024w"
          sizes="64px"
          width="64"
          height="64"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </span>
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
    card.addEventListener('click', () => {
      playTap();
      playPortal();
      navigate(`atracciones/${a.slug}`);
    });
    wrap.appendChild(card);
  }

  return wrap;
}
