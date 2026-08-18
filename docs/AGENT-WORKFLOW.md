# Agent Workflow

> How any coding agent (Cursor, Claude, Codex) should work on this project.

## Before Starting Any Task

1. Read `Tasks.md` (creative spec — the "why")
2. Read relevant doc in `docs/01–07` (architecture — the "how")
3. Read assigned phase plan in `docs/phases/`
4. Check `docs/TASKS-BREAKDOWN.md` for current milestone status
5. Follow rules in `.cursor/rules/awfo.mdc`

## Session Rules

### DO

- Implement **one milestone** per session (e.g. M2.2 IntroScene only)
- Use placeholder assets until asset pipeline ready
- Read all content from `src/data/experienceData.ts`
- Test with `npm run dev` before marking complete
- Update checkbox in `TASKS-BREAKDOWN.md` when done
- Match existing code style and folder structure

### DO NOT

- Skip architecture docs and code directly
- Hardcode personal names, messages, or image paths
- Use HTML modals for memories
- Autoplay audio before user interaction
- Put logic in `App.tsx` (max 30 lines)
- Implement multiple scenes in one session
- Add effects that don't serve the experience
- Create pink gradient Valentine's templates

## Branch Naming

```text
cursor/<short-description>
```

Examples:
- `cursor/phase-1-scaffold`
- `cursor/intro-scene`
- `cursor/memory-portal`

## Commit Messages

Format: `type(scope): description`

```text
feat(scaffold): add Vite + R3F project structure
feat(intro): implement particle reveal sequence
feat(systems): add CameraDirector with GSAP
fix(world): reduce draw calls with instancing
docs(phase-2): add core systems implementation plan
```

## Handoff Between Agents

When finishing a session, leave notes in the phase plan file:

```markdown
## Agent Notes (latest)
- Completed: IntroScene particle system
- Blocked: Need final house GLB (using placeholder)
- Next: M3.4 WorldScene full diorama
```

## Prompt Template for Subagents

Copy and fill in:

```markdown
You are implementing AWFO (AWorldForYou), an immersive 3D love experience.

Read first:
- docs/06-technical-architecture.md
- docs/phases/phase-N-<name>.md
- .cursor/rules/awfo.mdc

Your task: [MILESTONE ID] — [DESCRIPTION]

Acceptance criteria:
- [ ] ...

Constraints:
- Do NOT implement [out-of-scope items]
- Use placeholder assets
- All text from experienceData.ts

When done:
- Update docs/TASKS-BREAKDOWN.md checkbox
- Add Agent Notes to phase plan
```

## Visual Hierarchy (Always)

```text
composition → lighting → materials → camera → animation → post-processing
```

Do not compensate for poor composition with excessive post-processing.

## Testing Minimum

Every deliverable must pass:

1. `npm run dev` — no console errors
2. Phase transition works (dev HUD or natural flow)
3. No TypeScript errors (`npm run build`)
4. Acceptance criteria in scene-map checked off

## Priority When Conflicts Arise

1. Experience quality (does it feel cinematic?)
2. Performance (60fps desktop)
3. Code cleanliness
4. Feature completeness

## Questions?

If spec is ambiguous:
- Prefer subtle and elegant over flashy
- Prefer data-driven over hardcoded
- Prefer placeholder + swap over blocking on assets
- Check `Tasks.md` §25 creative rule
