# Phase Plans Index

> Self-contained implementation guides for coding agents (Cursor, Claude, Codex).

## How to Use

1. Pick the next unchecked milestone from `docs/TASKS-BREAKDOWN.md`
2. Open the corresponding phase plan below
3. Follow the **Agent Prompt** section at the top of each plan
4. Complete acceptance criteria only — do not scope-creep into next phase
5. Update TASKS-BREAKDOWN checkboxes + Agent Notes when done

## Phase Order (Strict)

```text
Phase 0 ✅ Agent Infrastructure (docs, rules)
  ↓
Phase 1 → Project Scaffold
  ↓
Phase 2 → Core Systems
  ↓
Phase 3 → Scenes (largest phase — sub-milestones)
  ↓
Phase 4 → Visual Systems (can overlap with Phase 3 world/memory)
  ↓
Phase 5 → Content & Personalization
  ↓
Phase 6 → Performance & Mobile
  ↓
Phase 7 → Polish & QA
```

## Plans

| Phase | File | Scope | Est. Sessions |
|-------|------|-------|---------------|
| 1 | [phase-1-scaffold.md](./phase-1-scaffold.md) | Vite, R3F, folder structure, types, data | 1 |
| 2 | [phase-2-core-systems.md](./phase-2-core-systems.md) | State, SceneManager, Camera, Audio, Assets | 2–3 |
| 3 | [phase-3-scenes.md](./phase-3-scenes.md) | All experience scenes | 6–8 |
| 4 | [phase-4-visual-systems.md](./phase-4-visual-systems.md) | Shaders, post-processing, particles | 2–3 |
| 5 | [phase-5-content.md](./phase-5-content.md) | Data schema, personalization, modes | 1 |
| 6 | [phase-6-performance.md](./phase-6-performance.md) | Quality tiers, mobile, optimization | 2 |
| 7 | [phase-7-polish.md](./phase-7-polish.md) | QA, audio polish, full playthrough | 1–2 |

## Reference Docs

| Doc | When to Read |
|-----|--------------|
| `docs/01-experience-architecture.md` | Before any state/scene work |
| `docs/02-scene-map.md` | Before implementing a scene |
| `docs/03-interaction-map.md` | Before interactive objects |
| `docs/04-camera-choreography.md` | Before camera sequences |
| `docs/05-asset-requirements.md` | Before adding assets |
| `docs/06-technical-architecture.md` | Always (folder structure, types) |
| `docs/07-performance-strategy.md` | Before optimization work |
| `docs/AGENT-WORKFLOW.md` | Every session start |
| `.cursor/rules/awfo.mdc` | Every session start |

## Agent Notes Convention

Each phase plan has an **Agent Notes** section at the bottom. Latest agent writes:

```markdown
## Agent Notes (latest)
- **Agent:** [name/tool]
- **Date:** YYYY-MM-DD
- **Completed:** [milestones]
- **Blocked:** [issues]
- **Next:** [recommended next milestone]
```

## Agent Notes (latest)

- **Agent:** Cursor (Phase 0)
- **Date:** 2026-08-18
- **Completed:** Phase 0 — all docs, rules, phase plans
- **Blocked:** None
- **Next:** Phase 1 — M1.1 Vite scaffold
