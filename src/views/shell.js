import { getRouteInfo, navigate, onRouteChange, ROUTES } from '../router/index.js';
import { renderAtracciones } from './atracciones.js';
import { renderLaboratorio } from './laboratorio.js';
import { renderArcade } from './arcade.js';
import { renderPase } from './pase.js';
import { playTap, isSoundEnabled, toggleSound } from '../audio/engine.js';

const BASE = import.meta.env.BASE_URL || '/';

const TABS = [
  { id: ROUTES.atracciones, label: 'Atracciones', icon: 'icon-atracciones', aria: 'Atracciones' },
  { id: ROUTES.laboratorio, label: 'Laboratorio', icon: 'icon-laboratorio', aria: 'Laboratorio' },
  { id: ROUTES.arcade, label: 'Arcade', icon: 'icon-arcade', aria: 'Zona Arcade' },
  { id: ROUTES.pase, label: 'Mi Pase', icon: 'icon-pase', aria: 'Mi Pase' },
];

const RENDERERS = {
  [ROUTES.atracciones]: renderAtracciones,
  [ROUTES.laboratorio]: renderLaboratorio,
  [ROUTES.arcade]: renderArcade,
  [ROUTES.pase]: renderPase,
};

function svgIcon(id) {
  return `<svg class="nav-svg" width="22" height="22" aria-hidden="true"><use href="${BASE}assets/icons/xenon9-icons.svg#${id}"></use></svg>`;
}

/**
 * @param {HTMLElement} root
 */
export function mountShell(root) {
  root.innerHTML = '';
  root.classList.add('app-shell');

  // Inject icon sprite once (for older Safari use fallback via img if needed)
  if (!document.getElementById('xenon-icons-host')) {
    const host = document.createElement('div');
    host.id = 'xenon-icons-host';
    host.hidden = true;
    fetch(`${BASE}assets/icons/xenon9-icons.svg`)
      .then((r) => r.text())
      .then((txt) => {
        host.innerHTML = txt;
        document.body.prepend(host);
        // refresh uses to local symbols
        root.querySelectorAll('use').forEach((u) => {
          const href = u.getAttribute('href') || '';
          const id = href.split('#')[1];
          if (id) u.setAttribute('href', `#${id}`);
        });
      })
      .catch(() => {});
  }

  const topBar = document.createElement('div');
  topBar.className = 'top-bar';
  topBar.innerHTML = `
    <span class="top-bar__brand">AstroPark</span>
    <button type="button" class="sound-toggle" data-sound aria-pressed="false" aria-label="Activar sonido">
      ${svgIcon('icon-sound-off')}
      <span data-sound-label>Sonido off</span>
    </button>
  `;

  const viewRoot = document.createElement('main');
  viewRoot.id = 'view-root';
  viewRoot.setAttribute('role', 'main');

  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Navegación principal');

  for (const tab of TABS) {
    const btn = document.createElement('a');
    btn.href = `#/${tab.id}`;
    btn.className = 'bottom-nav__tab';
    btn.dataset.route = tab.id;
    btn.setAttribute('aria-label', tab.aria);
    btn.innerHTML = `
      <span class="bottom-nav__icon" aria-hidden="true">${svgIcon(tab.icon)}</span>
      <span class="bottom-nav__label">${tab.label}</span>
    `;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playTap();
      const info = getRouteInfo();
      if (info.section === tab.id && !info.param) {
        viewRoot.scrollTo({ top: 0, behavior: 'smooth' });
      }
      navigate(tab.id);
    });
    nav.appendChild(btn);
  }

  root.appendChild(topBar);
  root.appendChild(viewRoot);
  root.appendChild(nav);

  function syncSoundBtn() {
    const on = isSoundEnabled();
    const btn = topBar.querySelector('[data-sound]');
    const label = topBar.querySelector('[data-sound-label]');
    if (!btn) return;
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-label', on ? 'Silenciar' : 'Activar sonido');
    btn.querySelector('.bottom-nav__icon, .nav-svg')?.parentElement;
    btn.innerHTML = `${svgIcon(on ? 'icon-sound-on' : 'icon-sound-off')}<span data-sound-label>${on ? 'Sonido on' : 'Sonido off'}</span>`;
  }

  topBar.querySelector('[data-sound]')?.addEventListener('click', () => {
    toggleSound();
    syncSoundBtn();
    playTap();
  });
  syncSoundBtn();

  /** @type {null | (() => void)} */
  let currentDestroy = null;

  function paint(info) {
    if (typeof currentDestroy === 'function') {
      try {
        currentDestroy();
      } catch (err) {
        console.warn('AstroPark destroy error', err);
      }
      currentDestroy = null;
    }

    const render = RENDERERS[info.section] || RENDERERS[ROUTES.atracciones];
    const result = render(info);
    const el = result?.el ?? result;
    currentDestroy = typeof result?.destroy === 'function' ? result.destroy : null;

    viewRoot.replaceChildren(el);
    viewRoot.scrollTop = 0;

    for (const tabEl of nav.querySelectorAll('.bottom-nav__tab')) {
      const active = tabEl.dataset.route === info.section;
      tabEl.classList.toggle('is-active', active);
      tabEl.setAttribute('aria-current', active ? 'page' : 'false');
    }

    document.title = `${titleFor(info)} · AstroPark Physics`;
  }

  function titleFor(info) {
    const tab = TABS.find((t) => t.id === info.section);
    return tab ? tab.aria : 'Atracciones';
  }

  if (!location.hash || location.hash === '#' || location.hash === '#/') {
    history.replaceState(null, '', `${location.pathname}${location.search}#/atracciones`);
  }

  paint(getRouteInfo());
  return onRouteChange(paint);
}
