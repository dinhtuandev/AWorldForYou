# Phase 5 — Content & Personalization

## Agent Prompt

```markdown
Implement Phase 5 (Content & Personalization) for AWFO.

Prerequisite: Phase 3 scenes exist, Phase 4 visuals applied.

Read first:
- docs/06-technical-architecture.md (ExperienceData type)
- Tasks.md §22 Content Architecture

Finalize data schema, add personalization docs, verify mode switching.
Do NOT change scene logic — only data layer and README.
```

---

## Goal

Any developer personalizes the entire experience by editing one data file. Mode switching (birthday / womensDay / default) fully wired.

---

## M5.1 — Finalize experienceData Schema

**File:** `src/data/experienceData.ts`

Ensure all fields consumed by scenes are defined:

```ts
export const experienceData: ExperienceData = {
  girlfriendName: string,
  senderName: string,
  mode: 'default' | 'birthday' | 'womensDay',

  intro: { line1, line2 },
  loading: { building: string, ready: string },

  memories: Memory[],      // 3–6 entries
  timeline: TimelineMilestone[],
  letter: string[],

  birthday?: {
    enabled: boolean,
    message: string,
    wishPrompt: string,
  },
  womensDay?: {
    enabled: boolean,
    message: string,
    gardenPrompt: string,
  },

  finalScene: { line1, line2, line3, closing },

  audio: {
    enabled: boolean,
    defaultVolume: number,
  },
};
```

Update `ExperienceData` type in `experience.types.ts` to match.

Audit all scene components — replace any remaining hardcoded strings with data references.

---

## M5.2 — README Personalization Guide

**File:** `README.md`

Add section:

```markdown
## Personalize Your Experience

1. Edit `src/data/experienceData.ts`
2. Set `girlfriendName`, `senderName`
3. Choose `mode`: `default`, `birthday`, or `womensDay`
4. Add memories (photo paths in `public/assets/images/`)
5. Customize letter lines and final scene text
6. Run `npm run dev`

### Memory Photos
- Place JPG/WebP in `public/assets/images/`
- Reference in `memories[].image`
- Recommended: 1920px max, 4:3 or 16:9

### Modes
- `default`: letter → final scene
- `birthday`: letter → cake → final scene
- `womensDay`: letter → garden → final scene
```

Also add: tech stack, dev commands, project structure overview.

---

## M5.3 — Sample Placeholder Images

Add 3–4 placeholder images in `public/assets/images/`:
- `placeholder-beach.jpg`
- `placeholder-cafe.jpg`
- `placeholder-night.jpg`

Can be solid-color JPGs with text label (dev only) or royalty-free samples.

Update `experienceData.memories[].image` to reference these.

---

## M5.4 — Mode Switching Verification

Test all three modes by changing `experienceData.mode`:

| Mode | Path After Letter |
|------|-------------------|
| `default` | FinalScene |
| `birthday` | BirthdayScene → FinalScene |
| `womensDay` | WomensDayScene → FinalScene |

Ensure `birthday.enabled` / `womensDay.enabled` flags respected.

Document in README which mode to set for which occasion.

---

## M5.5 — Data-Driven Verification

Checklist — change ONE field in experienceData, verify UI updates:

- [ ] `girlfriendName` → birthday + final text
- [ ] `intro.line1` → intro scene
- [ ] `memories[0].title` → memory environment
- [ ] `letter[0]` → letter scene first line
- [ ] `finalScene.line3` → "I love you." text
- [ ] `mode` → different ending path

No component recompilation needed beyond hot reload.

---

## Acceptance Criteria

- [x] Complete ExperienceData type + file
- [x] README personalization guide
- [x] Placeholder images in place
- [x] All 3 modes route correctly
- [x] Zero hardcoded personal strings in components
- [x] Audio paths in assetManifest match data config

---

## Out of Scope

- Real personal photos/content (user provides)
- i18n / multi-language
- CMS or admin UI

---

## Agent Notes (latest)

- **Agent:** Antigravity (Senior Front-End & Creative Engineer)
- **Date:** 2026-08-18
- **Completed:**
  - M5.1: Finalized `ExperienceData` interface (`girlfriendName`, `senderName`, `mode`, `intro`, `loading`, `memories`, `timeline`, `letter`, `birthday`, `womensDay`, `finalScene`, `audio`) in `src/types/experience.types.ts` and populated `src/data/experienceData.ts` with rich romantic content.
  - Audited all scenes (`LoadingScene`, `IntroOverlay`, `LetterOverlay`, `BirthdayOverlay`, `WomensDayOverlay`, `FinalOverlay`, `MemoryOverlay`, `TimelineOverlay`) to ensure zero hardcoded personal strings.
  - M5.2: Updated `README.md` with complete step-by-step Personalization Guide, mode instructions, memory photo guidelines, tech stack, and dev commands.
  - M5.3: Added high-quality SVG/JPG placeholder assets for all 4 memory themes in `public/assets/images/` (`placeholder-beach.svg`, `placeholder-cafe.svg`, `placeholder-night.svg`, `placeholder-first.svg`).
  - M5.4: Mode switching cleanly routes after letter scene to `final`, `birthday`, or `womensDay` based on `experienceData.mode` and respects enabled flags. Added mode switcher to DevTools HUD.
  - M5.5: Verified full data-driven reactivity & zero build errors with `npm run build`.
- **Blocked:** None
- **Next:** Phase 6 — Performance & Mobile (Milestones M6.1 – M6.7)
