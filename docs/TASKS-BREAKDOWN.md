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

## Phase 1 — Project Scaffold

- [ ] M1.1 Vite + React + TypeScript init
- [ ] M1.2 Install R3F, drei, three, GSAP, zustand, framer-motion, postprocessing, howler
- [ ] M1.3 Folder structure per `docs/06-technical-architecture.md`
- [ ] M1.4 `experience.types.ts` — all type definitions
- [ ] M1.5 `experienceData.ts` — placeholder personal content
- [ ] M1.6 `assetManifest.ts` — asset paths + preload/lazy lists
- [ ] M1.7 `App.tsx` + `Experience.tsx` — empty Canvas renders
- [ ] M1.8 Verify: `npm run dev` shows empty 3D canvas, `npm run build` passes

**Plan:** `docs/phases/phase-1-scaffold.md`

---

## Phase 2 — Core Systems

- [ ] M2.1 `ExperienceState.ts` — Zustand store with all phases
- [ ] M2.2 `SceneManager.tsx` — phase → scene routing
- [ ] M2.3 `CameraDirector.tsx` — GSAP sequence player
- [ ] M2.4 `cameraSequences.ts` — intro + world sequences
- [ ] M2.5 `InteractionManager.tsx` — raycast + registry
- [ ] M2.6 `InteractiveObject.tsx` — hover affordance wrapper
- [ ] M2.7 `AudioManager.ts` — layer system + crossfade
- [ ] M2.8 `AssetManager` — preload with progress
- [ ] M2.9 `useQualityTier.ts` — auto-detect + presets
- [ ] M2.10 `DevTools.tsx` — phase jumper (dev only)
- [ ] M2.11 Verify: dev HUD switches phases, camera test sequence plays

**Plan:** `docs/phases/phase-2-core-systems.md`

---

## Phase 3 — Scenes

### Loading + Intro
- [ ] M3.1 `LoadingScene` — cinematic preload
- [ ] M3.2 `IntroScene` — particle reveal + "Come in."
- [ ] M3.3 Intro → World camera transition

### World
- [ ] M3.4 `WorldScene` skeleton — placeholder diorama
- [ ] M3.5 World lighting + HDRI + fog
- [ ] M3.6 World ambient life (clouds, fireflies, water)
- [ ] M3.7 Interactive objects placed from experienceData

### Memory
- [ ] M3.8 `MemoryPortal` — photo-to-3D transition shader
- [ ] M3.9 `BeachMemory` environment
- [ ] M3.10 `CafeMemory` environment
- [ ] M3.11 `NightWalkMemory` environment
- [ ] M3.12 `FirstMeetingMemory` environment

### Timeline + Letter + Modes + Final
- [ ] M3.13 `TimelineOverlay` — floating milestones
- [ ] M3.14 `LetterScene` — 3D envelope + sequential text
- [ ] M3.15 `BirthdayScene` — cake + candle blow
- [ ] M3.16 `WomensDayScene` — garden growth
- [ ] M3.17 `FinalScene` — night world + heart + closing text

**Plan:** `docs/phases/phase-3-scenes.md`

---

## Phase 4 — Visual Systems

- [ ] M4.1 `PostProcessing.tsx` — quality-gated effects
- [ ] M4.2 Water shader (pond)
- [ ] M4.3 Atmospheric fog shader
- [ ] M4.4 Film grain (subtle)
- [ ] M4.5 `ParticleSystem` — reusable emitter
- [ ] M4.6 Glass/crystal heart material (final scene)
- [ ] M4.7 Emissive materials (windows, interactive glow)

**Plan:** `docs/phases/phase-4-visual-systems.md`

---

## Phase 5 — Content & Personalization

- [ ] M5.1 Finalize `experienceData.ts` schema with all fields
- [ ] M5.2 README personalization guide
- [ ] M5.3 Sample memory photos (placeholder)
- [ ] M5.4 Mode switching (birthday / womensDay / default)
- [ ] M5.5 Verify: change data file → entire experience updates

**Plan:** `docs/phases/phase-5-content.md`

---

## Phase 6 — Performance & Mobile

- [ ] M6.1 Quality tier presets applied to all scenes
- [ ] M6.2 Mobile touch controls + hit radius
- [ ] M6.3 Lazy loading for memory scenes
- [ ] M6.4 GLB compression pipeline
- [ ] M6.5 Instancing (trees, flowers, fireflies)
- [ ] M6.6 FPS testing all scenes all tiers
- [ ] M6.7 WebGL fallback page

**Plan:** `docs/phases/phase-6-performance.md`

---

## Phase 7 — Polish & QA

- [ ] M7.1 Audio crossfade polish all transitions
- [ ] M7.2 Camera easing consistency audit
- [ ] M7.3 Letter pause timing
- [ ] M7.4 Birthday mic fallback (tap candles)
- [ ] M7.5 Responsive text sizing
- [ ] M7.6 Full playthrough test (all modes)
- [ ] M7.7 Production build verification

**Plan:** `docs/phases/phase-7-polish.md`

---

## MVP Shortcut (if time-limited)

Minimum shippable experience:

- [x] Phase 0 docs
- [ ] M1.* scaffold
- [ ] M2.* core systems
- [ ] M3.1–3.3 loading + intro
- [ ] M3.4–3.7 world skeleton
- [ ] M3.8–3.9 one memory portal + beach
- [ ] M3.14 letter scene
- [ ] M3.17 final scene

Skip for MVP: timeline, birthday, womensDay, extra memory envs.
