/**
 * Hash router (ADR-004).
 * Routes:
 *   #/atracciones | #/atracciones/:slug
 *   #/laboratorio | #/laboratorio/:simId
 *   #/arcade | #/arcade/:gameId
 *   #/pase
 */

const SECTIONS = {
  atracciones: 'atracciones',
  laboratorio: 'laboratorio',
  arcade: 'arcade',
  pase: 'pase',
};

/**
 * @typedef {{ section: string, param: string|null, path: string }} RouteInfo
 */

/**
 * Parse location.hash.
 * @returns {RouteInfo}
 */
export function getRouteInfo() {
  const raw = (location.hash || '').replace(/^#\/?/, '').trim();
  const parts = raw.split('/').filter(Boolean);
  let section = parts[0] || SECTIONS.atracciones;
  if (!Object.values(SECTIONS).includes(section)) {
    section = SECTIONS.atracciones;
  }
  const param = parts[1] || null;
  return {
    section,
    param,
    path: parts.length ? parts.join('/') : section,
  };
}

/** @returns {string} section id for bottom nav */
export function getRoute() {
  return getRouteInfo().section;
}

/**
 * Navigate by hash path (e.g. 'atracciones/zorp', 'laboratorio/sim-zorp-inercia').
 * @param {string} path
 */
export function navigate(path) {
  const clean = String(path || '')
    .replace(/^#\/?/, '')
    .replace(/^\//, '');
  const next = `#/${clean || SECTIONS.atracciones}`;
  if (location.hash === next) {
    window.dispatchEvent(new HashChangeEvent('hashchange'));
    return;
  }
  location.hash = next;
}

/**
 * @param {(info: RouteInfo) => void} listener
 * @returns {() => void}
 */
export function onRouteChange(listener) {
  const handler = () => listener(getRouteInfo());
  window.addEventListener('hashchange', handler);
  return () => window.removeEventListener('hashchange', handler);
}

export { SECTIONS as ROUTES };
