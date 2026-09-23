import { getRoute, navigate, onRouteChange, ROUTES } from '../router/index.js';
import { renderAtracciones } from './atracciones.js';
import { renderLaboratorio } from './laboratorio.js';
import { renderArcade } from './arcade.js';
import { renderPase } from './pase.js';

const TABS = [
  {
    id: ROUTES.atracciones,
    label: 'Atracciones',
    icon: '🛸',
    aria: 'Atracciones',
  },
  {
    id: ROUTES.laboratorio,
    label: 'Laboratorio',
    icon: '🧪',
    aria: 'Laboratorio',
  },
  {
    id: ROUTES.arcade,
    label: 'Arcade',
    icon: '🕹️',
    aria: 'Zona Arcade',
  },
  {
    id: ROUTES.pase,
    label: 'Mi Pase',
    icon: '🎫',
    aria: 'Mi Pase',
  },
];

const RENDERERS = {
  [ROUTES.atracciones]: renderAtracciones,
  [ROUTES.laboratorio]: renderLaboratorio,
  [ROUTES.arcade]: renderArcade,
  [ROUTES.pase]: renderPase,
};

/**
 * Mount app shell: view root + fixed bottom nav.
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
      const current = getRoute();
      if (current === tab.id) {
        viewRoot.scrollTo({ top: 0, behavior: 'smooth' });
      }
      navigate(tab.id);
    });
    nav.appendChild(btn);
  }

  root.appendChild(viewRoot);
  root.appendChild(nav);

  function paint(route) {
    const render = RENDERERS[route] || RENDERERS[ROUTES.atracciones];
    viewRoot.replaceChildren(render());
    viewRoot.scrollTop = 0;

    for (const el of nav.querySelectorAll('.bottom-nav__tab')) {
      const active = el.dataset.route === route;
      el.classList.toggle('is-active', active);
      el.setAttribute('aria-current', active ? 'page' : 'false');
    }

    document.title = `${titleFor(route)} · AstroPark Physics`;
  }

  function titleFor(route) {
    const tab = TABS.find((t) => t.id === route);
    return tab ? tab.aria : 'Atracciones';
  }

  // Normalize empty hash → #/atracciones
  if (!location.hash || location.hash === '#' || location.hash === '#/') {
    history.replaceState(null, '', `${location.pathname}${location.search}#/atracciones`);
  }

  paint(getRoute());
  return onRouteChange(paint);
}
