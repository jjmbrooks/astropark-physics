# 07 — Handoff (cómo retomar / trabajar en paralelo)

## Arranque en frío (cualquier bot o humano)

1. Clonar: `git clone https://github.com/jjmbrooks/astropark-physics.git`
2. Leer **en orden:** `AGENTS.md` → `docs/01` … `docs/06` (este archivo al final).
3. `git status` / `git log -5 --oneline` → ver en qué fase está el repo.
4. No re-preguntar a Brooks el brief de producto: está en `docs/`.
5. Implementar solo la fase abierta del roadmap; no “aprovechar” para meter React/Phaser.

## Contratos estables (no romper sin migrar)

| Contrato | Dónde | Regla |
|----------|-------|-------|
| IDs sims/juegos/atracciones | `03-CONTENIDO.md` + schema `04` | No renombrar sin migración LS + docs |
| Prefijo LS `astropark.` | `04-ARQUITECTURA.md` | Obligatorio |
| Hash routes | `04` | Mantener `#/atracciones` etc. |
| `base` Vite | `vite.config.js` + ADR-006 | `/astropark-physics/` |
| Package name | `package.json` | `astropark-physics` |

## Ownership de carpetas (paralelismo)

| Carpeta | Dueño típico | Puede tocar en paralelo si… |
|---------|--------------|------------------------------|
| `docs/` | Definición / Brooks | Solo fixes editoriales; no cambiar IDs a mitad de fase |
| `src/router/`, `src/views/`, `src/styles/` | F1 shell | Tras F1 mergeado, cambios mínimos |
| `src/state/` | Compartido | Coordinar schema; un PR de migración a la vez |
| `src/modules/atracciones/` | F2 | Independiente de canvas |
| `src/modules/laboratorio/` | F3–F4 | Un sim por PR preferible |
| `src/modules/arcade/` | F4–F5 | Un juego por PR |
| `src/modules/pase/` | F5 | Depende de schema estable |
| `.github/workflows/` | F6 | No antes de build verde |

**Regla de oro:** no dos agentes editen el mismo archivo de sim/juego a la vez. Partir por ID (`sim-zorp-inercia.js` vs `sim-grog-empuje.js`).

## Checklist al empezar una sesión

- [ ] ¿Leí la fase actual en `06-ROADMAP.md`?
- [ ] ¿El DoD de la fase anterior está cumplido?
- [ ] ¿Voy a tocar `state` schema? → plan de migración
- [ ] ¿Necesito dependencia nueva? → ADR en `05` primero
- [ ] ¿Es feature code en F0? → **NO**; solo docs/scaffold

## Checklist al terminar una sesión

- [ ] Commits claros en `main` (o PR) con mensaje que cite la fase (`F1: …`)
- [ ] Actualicé checkboxes DoD si cerré fase
- [ ] `npm run build` pasa (desde F1)
- [ ] Anoté en el PR/comentario qué quedó pendiente (IDs, TODOs)
- [ ] No dejé secretos ni `.env` con tokens

## Cómo reportar avances (a Brooks / agente padre)

Formato corto:

```
Fase: F3
Hecho: sim-zorp-inercia mount + score en LS
Pendiente: sim-grog-empuje sliders
Bloqueos: ninguno | descripción
URL prueba: http://localhost:5173/astropark-physics/
```

## Conflictos / decisiones que SÍ requieren a Brooks

- Cambiar stack (React, Phaser, backend).
- Añadir atracciones/temas fuera de `03`.
- Cambiar licencia o visibilidad del repo.
- Publicar a dominio custom / cambiar `base`.

Todo lo demás debe resolverse con los docs.

## Contacto repo

- GitHub: https://github.com/jjmbrooks/astropark-physics
- Owner: **jjmbrooks** (Jhonatan Jesús Martínez Brooks)
