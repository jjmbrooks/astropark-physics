# 08 — Roles, jerarquía y delegación (Kanban)

Fuente de verdad operativa del ecosistema: **PLAYBOOK_Operaciones_NexIA_v1** (Vault).  
Contrato pipeline: [CONTRATO Codelius ↔ Runica](https://docs.google.com/document/d/1-VSsqIkXl6nRoIVC1oU3te4oReRxsoX0NI1kF4hVbNo/edit).  
SOUL mano de obra: [SOUL Runica](https://docs.google.com/document/d/1VuqtL8RnQDc20mlQD2-OWZLxSLWtGDEHXLjSKkkQuRU/edit).

Este archivo **ancla la jerarquía en el repo**. No forkear políticas largas aquí; citar Vault.

## Jerarquía

```
Brooks (producto / decisión final)
  └─ NexIA (orquestación ecosistema, prioridad, alcance, cierre DoD)
       └─ Codelius (dueño técnico del repo y del producto de código)
            └─ Runica (Hermes — slices mecánicos vía Kanban, assignee `runica`)
```

| Rol | Quién | Qué hace aquí |
|-----|--------|----------------|
| Owner humano | **Brooks** (`jjmbrooks`) | OK de alcance, stack, licencia, dominio |
| Orquestador | **NexIA** | Tarjetas padre, coste Grok vs Hermes, cierra DoD |
| Owner técnico / código | **Codelius** (Grok Bot) | Integra en **este** repo; review + merge; parte slices |
| Mano de obra | **Runica** (`runica`, banda **L**) | Scaffolding, CRUD, wiring, tests, boilerplate |
| Infra / secretos | **Inge** | Credenciales, GitHub org, VPS, skills compartidos |
| Pedagogía | **aguilar** | Alineación Prepa 42 / contenidos (artefacto, no fork) |
| UI/UX | **disenador** | Specs/mockups UI |
| Narrativa | **storyteller** | Personajes / copy narrativo |
| Imagen / música | **director-creativo** + **melody** | Assets creativos |
| SFX / clips legales | **Mediateca** | Handoff `[Grok:Mediateca]` → assignee `nexia` |

**Regla:** un solo owner de código por producto = **Codelius**. Especialistas entregan artefactos; no abren forks paralelos del producto.

## Flujo típico (app / juego de clase)

1. NexIA abre tarjeta padre (alcance + DoD + coste Grok vs Hermes).
2. Hijos en paralelo: aguilar, disenador, storyteller, creativo/melody, Mediateca si hace falta media.
3. Codelius integra en el repo (owner).
4. Subtareas mecánicas → **Runica** (banda L), con DoD claro.
5. Codelius review + smoke (`npm run build`); NexIA cierra DoD.

## Cómo delegar a Runica (Kanban)

- Board: `nexia` (salvo que NexIA indique otro).
- Assignee: `runica`.
- Banda preferida: **L**. Subir a M solo si la tarjeta lo pide o falla DoD en L.
- Cross-perfil: **solo Kanban** (no chats ad-hoc como canal de trabajo).
- Runica **no** tiene bot Telegram en esta fase.
- DoD mínimo en cada tarjeta: qué archivos tocar, criterio de done, link a docs/ADR, si requiere review de Codelius antes de merge a `main`.
- Entrega esperada de Runica: comentario con qué hizo + link PR/commit + `done` solo si cumple DoD.
- Bloqueo: causa accionable (falta spec, falta acceso repo, test rojo X) → escalar Codelius (técnico) / NexIA (alcance) / Inge (credenciales).

### Qué sí / no asignar a Runica

| Sí (mecánico) | No |
|---------------|-----|
| Scaffolding, CRUD, wiring, tests, refactors mecánicos | Decidir UX / pedagogía / narrativa / assets |
| Implementar aceptación ya escrita en la tarjeta o Drive | Cambiar infra, secretos, mapa de bandas |
| PR en repo autorizado | Merge a `main` sin DoD + OK de Codelius si la tarjeta pide review |
| Boilerplate acorde a `docs/04` y ADRs | Abrir alcance nuevo o “mejoras grandes” sin propuesta en comentario |

## Handoffs Grok ↔ NexIA

| Origen | Título tarjeta | Assignee |
|--------|----------------|----------|
| Codelius → NexIA | `[Grok:Codelius] …` | `nexia` |
| Mediateca → NexIA | `[Grok:Mediateca] …` | `nexia` |
| Heraldo → NexIA | `[Grok:Heraldo] …` | `nexia` |

## Primer slice Runica (cuando Inge deje el perfil live)

Candidatos mecánicos post-F6 (elegir uno con DoD corto):

1. Tests smoke Playwright/Vitest mínimos de router + mount/unmount de un sim.
2. Extracción de constantes de física (`g` Xenon-9 / Tierra / Luna / Júpiter) a módulo compartido + tests unitarios.
3. A11y checklist automatizable (landmarks, focus en bottom nav) sin rediseño.

Hasta que Runica esté live: Codelius implementa o deja la tarjeta en borrador sin assignee `runica`.

## Relación con otros docs del repo

| Pregunta | Archivo |
|----------|---------|
| Cómo retomar / ownership de carpetas | `07-HANDOFF.md` |
| Fases / DoD producto | `06-ROADMAP.md` |
| Instrucciones cortas para bots | `AGENTS.md` |

## Ejemplo vivo — AstroPark F7

Épica Kanban `t_494ce233` (`[Grok:Codelius]`): upgrade pedagogía + media para **Del Átomo al Universo P1**. Hijos: aguilar `t_e6293466`, disenador `t_3f5fbdea`, storyteller `t_15ce55ef`, director-creativo `t_54c6f50c`, melody `t_b83d2bd3`.
