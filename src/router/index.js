/**
 * Hash router (ADR-004).
 * Routes: #/ | #/atracciones | #/laboratorio | #/arcade | #/pase
 */

const ROUTES = {
  atracciones: 'atracciones',
  laboratorio: 'laboratorio',
  arcade: 'arcade',
  pase: 'pase',
};

/**
 * Parse location.hash → route id.
 * @returns {'atracciones'|'laboratorio'|'arcade'|'pase'}
 */
export function getRoute() {
  const raw = (location.hash || '').replace(/^#\/?/, '').trim();
  const segment = raw.split('/')[0] || '';
  if (!segment || segment === ROUTES.atracciones) return ROUTES.atracciones;
  if (segment === ROUTES.laboratorio) return ROUTES.laboratorio;
  if (segment === ROUTES.arcade) return ROUTES.arcade;
  if (segment === ROUTES.pase) return ROUTES.pase;
  return ROUTES.atracciones;
}

/**
 * Navigate by setting hash (no full reload).
 * @param {string} routeId
 */
export function navigate(routeId) {
  const id = ROUTES[routeId] || ROUTES.atracciones;
  const next = `#/${id}`;
  if (location.hash === next) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  location.hash = next;
}

/**
 * Subscribe to hash changes. Returns unsubscribe.
 * @param {(route: string) => void} listener
 */
export function onRouteChange(listener) {
  const handler = () => listener(getRoute());
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}

export { ROUTES };
