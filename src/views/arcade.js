/**
 * Placeholder F2 — juegos llegan en F4–F5.
 * @returns {{ el: HTMLElement, destroy: () => void }}
 */
export function renderArcade() {
  const el = document.createElement('div');
  el.className = 'view view--arcade';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Zona Arcade</h1>
      <p class="view-header__subtitle">Mini-juegos · llegan en F4–F5</p>
    </header>
    <div class="view-body">
      <div class="placeholder-card">
        <p><strong>Próximamente.</strong> Aquí irán los 3 juegos arcade.</p>
      </div>
    </div>
  `;
  return { el, destroy() {} };
}
