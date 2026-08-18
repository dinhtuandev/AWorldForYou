# Phase 3 — Scenes

## Agent Prompt

```markdown
Implement Phase 3 scenes for AWFO ONE SUB-MILESTONE at a time.

Prerequisite: Phase 2 complete (all core systems working).

Read first:
- docs/02-scene-map.md
- docs/03-interaction-map.md
- docs/04-camera-choreography.md
- docs/05-asset-requirements.md

Pick ONE milestone from M3.1–M3.17. Do not implement multiple scenes per session.
All text from experienceData.ts. Use placeholder GLB (colored meshes) until assets ready.
```

---

## Goal

Implement all experience scenes. This is the largest phase — **strictly one milestone per agent session**.

---

## Sub-Phase 3A — Loading + Intro (M3.1–M3.3)

### M3.1 LoadingScene

**File:** `src/components/scenes/LoadingScene.tsx` (DOM, not R3F)

- Render when `phase === 'loading'`
- Glowing object animation (CSS or small Canvas)
- Text from config: "Building your little world..."
- Real progress from AssetManager
- On ready: "Ready." → fade → `setPhase('intro')`

**Acceptance:** Real load progress, cinematic feel, no "0%" bar.

### M3.2 IntroScene

**File:** `src/components/scenes/IntroScene.tsx`

Sequence per `docs/02-scene-map.md`:
1. Black screen
2. Single particle → expansion → hundreds
3. Camera `intro-particle-reveal`
4. Text: `experienceData.intro.line1`
5. After 5s: `experienceData.intro.line2` + pulse indicator
6. Click → `markUserInteraction()` → `intro-to-world` → `setPhase('world')`

Use `ParticleSystem` (basic points material OK for now).

### M3.3 Intro → World Transition

Ensure CameraDirector `intro-to-world` sequence connects IntroScene end to WorldScene start seamlessly. Audio: ambient space layer after first click.

---

## Sub-Phase 3B — World (M3.4–M3.7)

### M3.4 WorldScene Skeleton

**File:** `src/components/scenes/WorldScene.tsx`

Placeholder diorama:
- Ground plane (green/brown)
- Box house with emissive windows
- Few cone trees
- Circle pond
- Orbit controls enabled

Persistent — stays mounted across memory/letter transitions (visibility toggle).

### M3.5 World Lighting

- HDRI environment map (drei `Environment` — preset `sunset` OK initially)
- Directional light with soft shadows (quality-gated)
- Ambient + hemisphere light
- Fog (atmospheric, subtle)

### M3.6 World Ambient Life

**Files:** `src/components/world/Clouds.tsx`, `Fireflies.tsx`, `Pond.tsx`

- Clouds: 2–3 soft meshes, slow drift
- Fireflies: instanced points, random glow
- Pond: plane with basic blue material (water shader in Phase 4)
- Leaves/wind: optional subtle rotation

All subtle. World should feel alive, not chaotic.

### M3.7 Interactive Objects in World

Place objects from `experienceData.memories[]`:

```tsx
{experienceData.memories.map(memory => (
  <InteractiveObject key={memory.id} ...>
    <PhotoFrame texture={memory.image} />
  </InteractiveObject>
))}
```

Plus: envelope (letter trigger), timeline entrance.

---

## Sub-Phase 3C — Memory (M3.8–M3.12)

### M3.8 MemoryPortal

**File:** `src/components/interactions/MemoryPortal.tsx`

**Critical effect.** 8-step transition per `docs/02-scene-map.md`:

1. Camera approaches photo
2. Photo scales toward camera
3. Fullscreen blur (shader uniform)
4. Depth separation (parallax / layered planes)
5. Crossfade to 3D memory env
6. Audio crossfade
7. Camera enters memory
8. `isTransitioning = false`

Implement as GSAP timeline + shader uniforms. Test with ONE photo first.

### M3.9 BeachMemory

**File:** `src/components/scenes/memories/BeachMemory.tsx`

- Sunset gradient sky
- Ocean plane with animated waves (basic sine displacement OK)
- Warm directional light
- Wind particles
- Lazy loaded via `React.lazy`

### M3.10 CafeMemory

- Table, chairs (boxes), coffee cup
- Window with rain streaks (shader or texture animation)
- Warm interior point lights

### M3.11 NightWalkMemory

- Dark blue fog
- Street lamp instances with point lights
- Star field (particles)
- Path plane

### M3.12 FirstMeetingMemory

- Symbolic/minimal — floating platform, soft particles, single spotlight
- Emotionally recognizable, not photorealistic

Each memory: exit interaction → reverse portal → world.

---

## Sub-Phase 3D — Timeline, Letter, Modes, Final (M3.13–M3.17)

### M3.13 TimelineOverlay

**File:** `src/components/scenes/TimelineOverlay.tsx`

- Floating crystals at `experienceData.timeline[].worldPosition`
- Light path connections
- Click → `selectMilestone()` → camera fly → snippet text in-world
- NOT an HTML timeline

### M3.14 LetterScene

**File:** `src/components/scenes/LetterScene.tsx`

- 3D envelope (folded planes + wax seal sphere)
- Room darkens (reduce ambient)
- Envelope emissive glow
- Click → open animation → sequential text from `experienceData.letter[]`
- Pauses between lines (2–3s), NOT word-by-word
- Route after last line based on `mode`

### M3.15 BirthdayScene

**File:** `src/components/scenes/BirthdayScene.tsx`

Only if `mode === 'birthday'`.

- Spotlight on cake (cylinder tiers + candle boxes)
- Text + "Make a wish"
- Mic blow detection OR tap fallback
- Candles out → smoke particles → fireworks → camera pullback
- "Happy Birthday, {girlfriendName}"

### M3.16 WomensDayScene

**File:** `src/components/scenes/WomensDayScene.tsx`

Only if `mode === 'womensDay'`.

- Empty garden plane
- Click → grow next flower (instanced)
- After all planted → camera rise → heart shape from above
- Elegant, not cartoonish

### M3.17 FinalScene

**File:** `src/components/scenes/FinalScene.tsx`

- World switches to night (HDRI swap, emissive windows, fireflies)
- Camera `final-rise` sequence
- Glass/crystal heart at center (icosahedron + transmission material)
- Heart pulse (scale sine)
- Text sequence from `experienceData.finalScene`
- Ending audio crescendo

---

## Session Pick Guide

| If you have ~2 hours | Pick |
|---------------------|------|
| First scene work | M3.1 LoadingScene |
| After loading works | M3.2 IntroScene |
| Core hub | M3.4 WorldScene skeleton |
| Most important effect | M3.8 MemoryPortal |
| First memory | M3.9 BeachMemory |
| Emotional climax | M3.17 FinalScene |

---

## Acceptance Criteria (Full Phase)

- [x] All 11 scene components exist and mount correctly
- [x] Full flow: loading → intro → world → memory → world → letter → final
- [x] MemoryPortal transition feels immersive (not modal)
- [x] All text from experienceData
- [x] Mode routing works (birthday/womensDay/default)
- [x] No scene hardcodes personal content

---

## Out of Scope

- Advanced shaders (Phase 4)
- Performance optimization (Phase 6)
- Final asset swap (Phase 5)

---

## Agent Notes (latest)
 
- **Agent:** Phase 3D Subagent (Timeline, Letter, Modes & Final Scenes)
- **Date:** 2026-08-18
- **Completed:** Sub-Phase 3D (M3.13 TimelineOverlay with 3D luminous Catmull-Rom light paths & crystal milestone inspection; M3.14 LetterScene with vintage 3D Envelope opening, wax seal release, and sequential letter reading overlay with mode routing; M3.15 BirthdayScene with 3D tiered birthday cake, animated flickering candles, mic blow detection / tap fallback, extinguishing smoke & celebratory particle fireworks; M3.16 WomensDayScene with 3D garden terrace, interactive 3D blooming floral heart along parametric curve, and garden-rise top-down camera sequence; M3.17 FinalScene with celestial starry night transformation, procedural luminous glass CrystalHeart with dual-beat pulse and orbiting stardust, sequential finalScene lines, and experience replay). All 3D scenes and DOM overlays fully integrated into SceneManager and Experience with 0 TypeScript/build errors.
- **Blocked:** None
- **Next:** Phase 4 — Visual Systems (M4.1 PostProcessing, M4.2 Water shader, M4.3 Atmospheric fog shader, M4.4 Film grain, M4.5 ParticleSystem, M4.6 Glass/crystal heart shader enhancements, M4.7 Emissive materials)


