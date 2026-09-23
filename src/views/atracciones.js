/** Placeholder view — Atracciones (F1 shell only). */
export function renderAtracciones() {
  const el = document.createElement('div');
  el.className = 'view view--atracciones';
  el.innerHTML = `
    <header class="view-header">
      <h1 class="view-header__title"><span class="brand-dot" aria-hidden="true"></span>Atracciones</h1>
      <p class="view-header__subtitle">Parque Xenon-9 · próximamente las 5 atracciones</p>
    </header>
    <div class="view-body">
      <div class="placeholder-card">
        <p><strong>Placeholder F1.</strong> Aquí irá el board de atracciones (Zorp, Grog, Kiki, Nebu, Tiki &amp; Tok).</p>
      </div>
    </div>
  `;
  return el;
}
