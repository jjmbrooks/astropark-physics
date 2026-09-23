import { getRouteInfo, navigate, onRouteChange, ROUTES } from '../router/index.js';
import { renderAtracciones } from './atracciones.js';
import { renderLaboratorio } from './laboratorio.js';
import { renderArcade } from './arcade.js';
import { renderPase } from './pase.js';

const TABS = [
  { id: ROUTES.atracciones, label: 'Atracciones', icon: '🛸', aria: 'Atracciones' },
  { id: ROUTES.laboratorio, label: 'Laboratorio', icon: '🧪', aria: 'Laboratorio' },
  { id: ROUTES.arcade, label: 'Arcade', icon: '🕹️', aria: 'Zona Arcade' },
  { id: ROUTES.pase, label: 'Mi Pase', icon: '🎫', aria: 'Mi Pase' },
];

const RENDERERS = {
  [ROUTES.atracciones]: renderAtracciones,
  [ROUTES.laboratorio]: renderLaboratorio,
  [ROUTES.arcade]: renderArcade,
  [ROUTES.pase]: renderPase,
};

/**
 * @param {HTMLElement} root
 */
export function mountShell(root) {
  root.innerHTML = '';
  root.classList.add('app-shell');

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
      <span class="bottom-nav__icon" aria-hidden="true">${tab.icon}</span>
      <span class="bottom-nav__label">${tab.label}</span>
    `;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const info = getRouteInfo();
      if (info.section === tab.id && !info.param) {
        viewRoot.scrollTo({ top: 0, behavior: 'smooth' });
      }
      navigate(tab.id);
    });
    nav.appendChild(btn);
  }

  root.appendChild(viewRoot);
  root.appendChild(nav);

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
