# 06 — Roadmap

Fases secuenciales. **No saltar la definición.** Cada fase tiene Definition of Done (DoD). Marcar checkboxes en PRs/commits al cerrar fase.

---

## F0 — Docs + repo skeleton *(done)*

**Objetivo:** Repo público con documentación completa y scaffold mínimo (sin feature SPA).

**DoD:**

- [x] Repo `jjmbrooks/astropark-physics` público en `main`
- [x] `README.md`, `AGENTS.md`, `LICENSE` (MIT), `.gitignore`
- [x] `docs/01` … `docs/07` presentes y accionables
- [x] `package.json` + `vite.config.js` (`base` Pages) + `index.html` + `src/main.js` placeholder
- [x] `src/**` stubs con README por módulo (sin sims/juegos/UI chrome)
- [x] Push a `origin/main`

**Salida:** otro bot puede empezar F1 sin preguntar el brief a Brooks.

---

## F1 — Shell app *(done)*

**Objetivo:** App shell Xenon-9 con bottom nav y 4 vistas vacías.

**Incluye:**

- Tailwind cableado (plugin Vite preferido)
- Tema dark Xenon-9 (tokens básicos)
- Hash router + 4 vistas placeholder con títulos
- Bottom nav fija, targets ≥48px, safe-area
- Funciona en viewport **360px** sin overflow horizontal

**DoD:**

- [x] `npm run dev` y `npm run build` OK
- [x] 4 tabs cambian de vista
- [x] Screenshot / prueba manual 360×640
- [x] Sin lógica de sims/juegos aún

**Ownership sugerido:** `src/router/`, `src/views/`, `src/styles/`

---

## F2 — Atracciones *(done)*

**Objetivo:** Board de 5 cards + páginas de detalle (teoría + fórmulas).

**Incluye:**

- Datos de las 5 atracciones según `03-CONTENIDO.md`
- Lista + detalle por slug (`zorp`, `grog`, `kiki`, `nebu`, `tiki-tok`)
- Marcar “leída” en `state` al visitar / completar lectura
- CTAs a lab/arcade (pueden ser `#` stubs si F3 no listo)

**DoD:**

- [x] 5 cards visibles y navegables
- [x] Fórmulas correctas (sin inventar temas)
- [x] Progreso `attractions.*.read` persiste en refresh

**Ownership:** `src/modules/atracciones/`, `src/state/` (parcial)

---

## F3 — Laboratorio (primeros 2 sims) *(done)*

**Objetivo:** `sim-zorp-inercia` + `sim-grog-empuje` jugables en Canvas 2D.

**DoD:**

- [x] Lista Laboratorio muestra al menos 2 sims activos
- [x] Mount/unmount limpio (sin rAF zombie al cambiar de tab)
- [x] Controles táctiles usables; estrellas o score se guardan
- [x] Touch/pointer OK en Chrome móvil emulado

**Ownership:** `src/modules/laboratorio/`

---

## F4 — Resto de sims + Arcade juego 1 *(done)*

**Objetivo:** `sim-kiki-balanza`, `sim-nebu-caida` + primer juego (`game-zorp-dash` por defecto).

**DoD:**

- [x] 4 sims listados; los 4 corren
- [x] 1 juego arcade completable con score/★ en LS
- [x] Navegación lista ↔ play estable

**Ownership:** `laboratorio/` + `arcade/` (juego 1)

---

## F5 — Juegos 2–3 + Mi Pase + export *(done)*

**Objetivo:** `game-grog-push`, `game-orbit-hop`; vista Mi Pase completa; export reporte.

**DoD:**

- [x] 3 juegos jugables
- [x] Mi Pase muestra progreso agregado
- [x] Export texto (copiar) funciona; QR opcional pero deseable
- [x] Reset progreso con confirmación

**Ownership:** `arcade/`, `pase/`, `state/`

---

## F6 — Polish mobile, a11y básica, Pages live *(done)*

**Objetivo:** Producción usable en aula.

**DoD:**

- [x] Contraste / labels / focus básicos
- [x] Workflow GitHub Actions → Pages publicado
- [x] URL viva `https://jjmbrooks.github.io/astropark-physics/` (Actions; habilitar source=Actions si hace falta)
- [x] README actualizado con URL y “cómo correr”
- [ ] Prueba en dispositivo real Android y/o iOS si disponible (manual / docente)

---

## Dependencias entre fases

```
F0 → F1 → F2 → F3 → F4 → F5 → F6
              ↘ (F2 puede solaparse con prep de estado F3)
```

Paralelismo seguro: ver [`07-HANDOFF.md`](07-HANDOFF.md).

## Fuera de roadmap v1

- Cuentas cloud, multiplayer, i18n, Phaser, React, contenido fuera de las 5 atracciones.
