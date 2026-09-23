# AGENTS.md — Instrucciones para agentes / bots

Eres un implementador en el repo **astropark-physics**.

## Jerarquía (ecosistema NexIA)

**Brooks** → **NexIA** → **Codelius** (owner técnico de este repo) → **Runica** (slices Kanban `runica`).

Detalle, mapa de perfiles y cómo delegar: **`docs/08-ROLES.md`**. Infra/secretos = Inge. No forks paralelos del producto.


## Antes de codear

1. Lee **en orden**: `docs/01-VISION.md` → `02` → `03` → `04` → `05` → `06` → `07`.
2. No te saltes la definición. Si algo no está en `docs/`, **no lo inventes** (ni temas de física, ni stack).
3. Mira `docs/06-ROADMAP.md`: implementa **solo la fase abierta**. F0 = docs; F1 = shell; etc.
4. Respeta ADRs en `docs/05-DECISIONES.md` (Vite, vanilla, Tailwind, Canvas 2D, hash router, Pages `base`, `astropark.*`).

## Qué está prohibido sin ADR + OK de Brooks

- React / Vue / Svelte / Angular
- Phaser u otros game engines “porque sí”
- Backend, auth, base de datos
- Renombrar IDs de sims/juegos/atracciones sin migración
- Feature SPA en F0 (este esqueleto es intencional)

## Qué sí puedes hacer

- Completar DoD de la fase actual con PRs/commits claros.
- Añadir archivos bajo el módulo que te toca (`07-HANDOFF.md` ownership).
- Mejorar docs si encuentras ambigüedad **sin cambiar contratos** (IDs, schema).
- Reportar bloqueos con el formato de handoff.

## Commits y ramas

- Preferir `main` con commits atómicos, o PRs cortos por sim/juego.
- Prefijo útil: `F1:`, `F3:`, `docs:`.
- No force-push a `main`. No commits con secretos.

## Reportar avances

```
Fase: Fx
Hecho: …
Pendiente: …
Bloqueos: …
```

## Smoke desde F1

```bash
npm install
npm run build
```

## Fuente de verdad

| Pregunta | Archivo |
|----------|---------|
| ¿Para quién / tono? | `docs/01-VISION.md` |
| ¿UI / nav / touch? | `docs/02-SPEC-PRODUCTO.md` |
| ¿Qué contenido? | `docs/03-CONTENIDO.md` |
| ¿Carpetas / LS? | `docs/04-ARQUITECTURA.md` |
| ¿Por qué Vite/Canvas? | `docs/05-DECISIONES.md` |
| ¿Qué fase sigue? | `docs/06-ROADMAP.md` |
| ¿Cómo paralelizar? | `docs/07-HANDOFF.md` |
