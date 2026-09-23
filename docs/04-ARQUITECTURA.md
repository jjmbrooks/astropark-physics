# 04 — Arquitectura

## Objetivo técnico

SPA estática, ES modules, Vite, sin backend. DOM para shell/navegación/teoría; **Canvas 2D** para sims y juegos.

## Árbol de carpetas (objetivo)

```
astropark-physics/
├── AGENTS.md
├── LICENSE
├── README.md
├── package.json
├── vite.config.js          # base: '/astropark-physics/'
├── index.html
├── public/                 # assets estáticos (favicon, robots, imgs)
├── docs/                   # definición (esta carpeta)
└── src/
    ├── main.js             # bootstrap
    ├── styles/             # Tailwind entry / CSS global Xenon-9
    ├── router/             # hash router o view switcher
    ├── state/              # store + localStorage adapters
    ├── views/              # shells de las 4 tabs (+ detalle)
    └── modules/
        ├── atracciones/    # data + render cards/detalle
        ├── laboratorio/    # sims Canvas
        ├── arcade/         # games Canvas
        └── pase/           # progreso + export
```

En **F0** las carpetas de módulos existen con `README.md` placeholder. No hay feature code.

## Módulos y responsabilidades

| Módulo | Ownership | Responsabilidad | No debe |
|--------|-----------|-----------------|---------|
| `router/` | shell | Leer `location.hash`, montar/desmontar vistas | Conocer física |
| `state/` | shell | Leer/escribir `astropark.*`, API `get/set/reset` | Dibujar canvas |
| `views/` | shell | Layout de cada tab, componer módulos | Lógica de física pesada |
| `modules/atracciones/` | contenido | Datos de 5 atracciones, UI teoría | Sims |
| `modules/laboratorio/` | sims | 4 sims Canvas + controles | Persistencia directa (usar `state/`) |
| `modules/arcade/` | games | 3 juegos Canvas | Teoría larga |
| `modules/pase/` | progreso | UI Mi Pase + export texto/QR | Reglas de física |

## Canvas vs DOM

| Qué | Tecnología |
|-----|------------|
| Bottom nav, headers, cards, teoría, formularios, sliders | **DOM** + Tailwind |
| Trayectorias, sprites simples, HUD de juego en tiempo real | **Canvas 2D** |
| Texto largo de teoría | DOM (accesible, seleccionable) |
| Partículas intensas / física multi-body compleja | Evaluar Phaser **solo** vía ADR nuevo |

Ciclo de vida Canvas:

1. `mount(container)` → crea canvas, listeners, rAF loop.  
2. `pause()` / `resume()` opcional al cambiar visibility.  
3. `unmount()` → cancel rAF, remove listeners, null refs.

## Routing

**Decisión:** hash router (`#/atracciones`, `#/laboratorio/:id`, etc.).

Razones: GitHub Pages sin config de fallback SPA; funciona con `file`/`preview` simple.

Ejemplo de rutas:

| Hash | Vista |
|------|-------|
| `#/` o `#/atracciones` | Board atracciones |
| `#/atracciones/zorp` | Detalle Zorp |
| `#/laboratorio` | Lista sims |
| `#/laboratorio/sim-zorp-inercia` | Sim |
| `#/arcade` | Lista juegos |
| `#/arcade/game-zorp-dash` | Juego |
| `#/pase` | Mi Pase |

Sin React Router. Implementación propia &lt;100 LOC aceptable.

## Estado + schema `localStorage`

Namespace: **`astropark.`**

### Claves

| Clave | Tipo | Descripción |
|-------|------|-------------|
| `astropark.version` | number | Schema version (empezar en `1`) |
| `astropark.profile` | object JSON | `{ displayName?: string }` local |
| `astropark.progress` | object JSON | Ver abajo |
| `astropark.settings` | object JSON | `{ reducedMotion?: boolean, ... }` opcional |

### `astropark.progress` (shape)

```json
{
  "attractions": {
    "zorp": { "read": true, "stars": 2 },
    "grog": { "read": false, "stars": 0 },
    "kiki": { "read": false, "stars": 0 },
    "nebu": { "read": false, "stars": 0 },
    "tiki-tok": { "read": false, "stars": 0 }
  },
  "sims": {
    "sim-zorp-inercia": { "stars": 0, "bestScore": 0, "completed": false },
    "sim-grog-empuje": { "stars": 0, "bestScore": 0, "completed": false },
    "sim-kiki-balanza": { "stars": 0, "bestScore": 0, "completed": false },
    "sim-nebu-caida": { "stars": 0, "bestScore": 0, "completed": false }
  },
  "games": {
    "game-zorp-dash": { "stars": 0, "bestScore": 0, "completed": false },
    "game-grog-push": { "stars": 0, "bestScore": 0, "completed": false },
    "game-orbit-hop": { "stars": 0, "bestScore": 0, "completed": false }
  },
  "updatedAt": "2026-09-22T00:00:00.000Z"
}
```

Reglas:

- Migrar si `astropark.version` &lt; actual (función `migrate(raw)`).
- Nunca escribir claves sin prefijo `astropark.`.
- Export reporte: serializar subset legible (no dump crudo opaco).

## Estilos

- Tailwind vía plugin Vite (`@tailwindcss/vite` o postcss) en build real.
- Tokens Xenon-9 en CSS variables o `theme.extend` (documentar en F1).
- Evitar CSS Modules al inicio salvo conflicto; preferir utilidades + pocos custom classes.

## Build / deploy

- `vite build` → `dist/`.
- `base: '/astropark-physics/'` en `vite.config.js` (project pages).
- GitHub Actions (F6): build on push `main` → upload `dist` a Pages **o** branch `gh-pages`.
- Enfoque documentado en [`05-DECISIONES.md`](05-DECISIONES.md): **Actions → GitHub Pages desde artifact `dist`**.

## Dependencias permitidas (v1)

- `vite` (+ Tailwind toolchain).
- Opcional ligero: librería QR pequeña solo en Mi Pase (F5).
- **No** añadir React/Vue/Svelte/Phaser sin ADR y OK de Brooks.

## Testing (mínimo)

- Manual en Chrome DevTools 360px + Safari iOS real cuando se pueda.
- Smoke: `npm run build` no falla.
- No hay suite e2e obligatoria en F0–F3.
