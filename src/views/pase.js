/** Placeholder view — Mi Pase (F1 shell only). */
export function renderPase() {
  const el = document.createElement('div');
  el.className = 'view view--pase';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Mi Pase</h1>
      <p class="view-header__subtitle">Progreso y reporte · F5</p>
    </header>
    <div class="view-body">
      <div class="placeholder-card">
        <p><strong>Placeholder F1.</strong> Estrellas, export y reset llegarán más adelante. Sin localStorage aún.</p>
      </div>
    </div>
  `;
  return el;
}
