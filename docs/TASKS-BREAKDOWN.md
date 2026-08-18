# Tasks Breakdown

> Master checklist. Update checkboxes as milestones complete.

## Phase 0 — Agent Infrastructure ✅

- [x] P0.1 Experience architecture doc
- [x] P0.2 Scene map doc
- [x] P0.3 Interaction map doc
- [x] P0.4 Camera choreography doc
- [x] P0.5 Asset requirements doc
- [x] P0.6 Technical architecture doc
- [x] P0.7 Performance strategy doc
- [x] P0.8 Agent workflow doc
- [x] P0.9 Cursor rules (`.cursor/rules/awfo.mdc`)
- [x] P0.10 Phase plan files for subagents
- [x] P0.11 Tasks breakdown (this file)

---

## Phase 1 — Project Scaffold ✅

- [x] M1.1 Vite + React + TypeScript init
- [x] M1.2 Install R3F, drei, three, GSAP, zustand, framer-motion, postprocessing, howler
- [x] M1.3 Folder structure per `docs/06-technical-architecture.md`
- [x] M1.4 `experience.types.ts` — all type definitions
- [x] M1.5 `experienceData.ts` — placeholder personal content
- [x] M1.6 `assetManifest.ts` — asset paths + preload/lazy lists
- [x] M1.7 `App.tsx` + `Experience.tsx` — empty Canvas renders
- [x] M1.8 Verify: `npm run dev` shows empty 3D canvas, `npm run build` passes

**Plan:** `docs/phases/phase-1-scaffold.md`

---

## Phase 2 — Core Systems ✅

- [x] M2.1 `ExperienceState.ts` — Zustand store with all phases
- [x] M2.2 `SceneManager.tsx` — phase → scene routing
- [x] M2.3 `CameraDirector.tsx` — GSAP sequence player
- [x] M2.4 `cameraSequences.ts` — intro + world sequences
- [x] M2.5 `InteractionManager.tsx` — raycast + registry
- [x] M2.6 `InteractiveObject.tsx` — hover affordance wrapper
- [x] M2.7 `AudioManager.ts` — layer system + crossfade
- [x] M2.8 `AssetManager` — preload with progress
- [x] M2.9 `useQualityTier.ts` — auto-detect + presets
- [x] M2.10 `DevTools.tsx` — phase jumper (dev only)
- [x] M2.11 Verify: dev HUD switches phases, camera test sequence plays

**Plan:** `docs/phases/phase-2-core-systems.md`

---

## Phase 3 — Scenes

### Loading + Intro
- [x] M3.1 `LoadingScene` — cinematic preload
- [x] M3.2 `IntroScene` — particle reveal + "Come in."
- [x] M3.3 Intro → World camera transition

### World
- [x] M3.4 `WorldScene` skeleton — placeholder diorama
- [x] M3.5 World lighting + HDRI + fog
- [x] M3.6 World ambient life (clouds, fireflies, water)
- [x] M3.7 Interactive objects placed from experienceData

### Memory
- [x] M3.8 `MemoryPortal` — photo-to-3D transition shader
- [x] M3.9 `BeachMemory` environment
- [x] M3.10 `CafeMemory` environment
- [x] M3.11 `NightWalkMemory` environment
- [x] M3.12 `FirstMeetingMemory` environment

### Timeline + Letter + Modes + Final
- [x] M3.13 `TimelineOverlay` — floating milestones
- [x] M3.14 `LetterScene` — 3D envelope + sequential text
- [x] M3.15 `BirthdayScene` — cake + candle blow
- [x] M3.16 `WomensDayScene` — garden growth
- [x] M3.17 `FinalScene` — night world + heart + closing text

**Plan:** `docs/phases/phase-3-scenes.md`

---

## Phase 4 — Visual Systems ✅

- [x] M4.1 `PostProcessing.tsx` — quality-gated effects
- [x] M4.2 Water shader (pond)
- [x] M4.3 Atmospheric fog shader
- [x] M4.4 Film grain (subtle)
- [x] M4.5 `ParticleSystem` — reusable emitter
- [x] M4.6 Glass/crystal heart material (final scene)
- [x] M4.7 Emissive materials (windows, interactive glow)

**Plan:** `docs/phases/phase-4-visual-systems.md`

---

## Phase 5 — Content & Personalization

- [x] M5.1 Finalize `experienceData.ts` schema with all fields
- [x] M5.2 README personalization guide
- [x] M5.3 Sample memory photos (placeholder)
- [x] M5.4 Mode switching (birthday / womensDay / default)
- [x] M5.5 Verify: change data file → entire experience updates

**Plan:** `docs/phases/phase-5-content.md`

---

## Phase 6 — Performance & Mobile ✅

- [x] M6.1 Quality tier presets applied to all scenes
- [x] M6.2 Mobile touch controls + hit radius
- [x] M6.3 Lazy loading for memory scenes
- [x] M6.4 GLB compression pipeline
- [x] M6.5 Instancing (trees, flowers, fireflies)
- [x] M6.6 FPS testing all scenes all tiers
- [x] M6.7 WebGL fallback page


**Plan:** `docs/phases/phase-6-performance.md`

---

## Phase 7 — Polish & QA ✅

- [x] M7.1 Audio crossfade polish all transitions
- [x] M7.2 Camera easing consistency audit
- [x] M7.3 Letter pause timing
- [x] M7.4 Birthday mic fallback (tap candles)
- [x] M7.5 Responsive text sizing
- [x] M7.6 Full playthrough test (all modes)
- [x] M7.7 Production build verification

**Plan:** `docs/phases/phase-7-polish.md`

---

## MVP Shortcut (if time-limited)

Minimum shippable experience:

- [x] Phase 0 docs
- [x] M1.* scaffold
- [x] M2.* core systems
- [x] M3.1–3.3 loading + intro
- [x] M3.4–3.7 world skeleton
- [x] M3.8–3.9 one memory portal + beach
- [x] M3.14 letter scene
- [x] M3.17 final scene


Skip for MVP: timeline, birthday, womensDay, extra memory envs.
