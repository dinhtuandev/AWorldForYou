# Phase 2 — Core Systems

## Agent Prompt

```markdown
Implement Phase 2 (Core Systems) for AWFO.

Prerequisite: Phase 1 complete (scaffold exists, Canvas renders).

Read first:
- docs/01-experience-architecture.md
- docs/04-camera-choreography.md
- docs/06-technical-architecture.md
- docs/03-interaction-map.md

Milestones: M2.1 – M2.11

Build the manager layer. End state: dev HUD can switch phases,
camera test sequence plays on a placeholder cube, audio layers switch.
Do NOT implement full scenes yet — use placeholder meshes for testing.
```

---

## Goal

All reusable systems that scenes depend on. After Phase 2, any scene can be added independently.

---

## M2.1 — ExperienceState (Zustand)

**File:** `src/experience/ExperienceState.ts`

Implement store per `docs/01-experience-architecture.md`:

```ts
interface ExperienceStore {
  // State
  phase: ExperiencePhase;
  previousPhase: ExperiencePhase | null;
  userHasInteracted: boolean;
  isTransitioning: boolean;
  activeMemoryId: string | null;
  visitedMemoryIds: string[];
  activeMilestoneId: string | null;
  letterLineIndex: number;
  audioEnabled: boolean;
  currentAudioLayer: AudioLayer;
  qualityTier: QualityTier;
  mode: ExperienceMode;

  // Actions
  setPhase: (phase: ExperiencePhase) => void;
  enterMemory: (id: string) => void;
  exitMemory: () => void;
  selectMilestone: (id: string) => void;
  advanceLetter: () => void;
  markUserInteraction: () => void;
  setQualityTier: (tier: QualityTier) => void;
  setTransitioning: (v: boolean) => void;
}
```

Initialize `mode` from `experienceData.mode`.

Export `useExperienceStore` hook.

---

## M2.2 — SceneManager

**File:** `src/experience/SceneManager.tsx`

- Read `phase` from store
- Render scene components conditionally
- Wrap transitions in `SceneTransition` (opacity crossfade)
- Block duplicate transitions when `isTransitioning`

```tsx
export function SceneManager() {
  const phase = useExperienceStore(s => s.phase);
  return (
    <>
      {phase === 'intro' && <IntroScenePlaceholder />}
      {phase === 'world' && <WorldScenePlaceholder />}
      {/* ... */}
    </>
  );
}
```

Phase 2 uses **placeholder scenes** (colored cube/sphere per phase). Real scenes come in Phase 3.

Mount SceneManager inside `<Experience>` Canvas or as sibling for LoadingScene (DOM).

---

## M2.3 — CameraDirector

**File:** `src/experience/CameraDirector.tsx`

GSAP-driven camera sequence player:

```ts
class CameraDirector {
  play(sequenceId: string, options?: { onComplete?: () => void }): void;
  stop(): void;
  isPlaying: boolean;
}
```

Expose via React context or Zustand-adjacent hook `useCameraDirector()`.

Implementation:
- Read keyframes from `cameraSequences.ts`
- Animate `camera.position` and a `lookAtTarget` Vector3
- Use `useFrame` to apply lookAt each frame
- Kill timeline on stop/interrupt

---

## M2.4 — Camera Sequences Data

**File:** `src/data/cameraSequences.ts`

Implement sequences from `docs/04-camera-choreography.md`:

- `intro-particle-reveal`
- `intro-to-world`
- `orbit-world`
- `approach-house`
- `memory-portal-template` (parameterized)
- `final-rise`

Use placeholder coordinates — refine when world scene exists.

---

## M2.5 — InteractionManager

**File:** `src/experience/InteractionManager.tsx`

- Maintain registry: `Map<string, InteractionHandler>`
- On pointer move: raycast for hover state
- On click: call registered handler
- Respect `isTransitioning` and `userHasInteracted` gates
- Call `markUserInteraction()` on first click

---

## M2.6 — InteractiveObject

**File:** `src/components/interactions/InteractiveObject.tsx`

Wrapper component:

```tsx
<InteractiveObject
  id="test-cube"
  position={[0, 1, 0]}
  affordance="glow"
  onInteract={() => store.enterMemory('photo-1')}
  cameraSequenceId="approach-house"
>
  <mesh>...</mesh>
</InteractiveObject>
```

Affordance implementations in `HoverAffordance.tsx`:
- `glow`: emissive intensity lerp
- `scale`: scale lerp 1→1.05
- `light`: point light intensity
- `particles`: emit rate (stub OK for now)

Register with InteractionManager on mount, unregister on unmount.

---

## M2.7 — AudioManager

**File:** `src/components/audio/AudioManager.ts`

Howler-based layer system:

```ts
class AudioManager {
  playLayer(layer: AudioLayer): void;
  crossfadeTo(layer: AudioLayer, duration?: number): void;
  setMuted(muted: boolean): void;
}
```

Rules:
- No play until `userHasInteracted`
- Crossfade 1.5–2s between layers
- Map layers to `assetManifest.audio` paths
- Stub with silent tracks or skip if no audio files yet

React hook: `useAudioManager()` synced to store's `currentAudioLayer`.

---

## M2.8 — AssetManager

**File:** `src/experience/AssetManager.ts` (or hook `useAssetProgress`)

Using `@react-three/drei` `useProgress` or custom loader:

```ts
interface AssetManager {
  progress: number;        // 0–1
  isReady: boolean;
  preloadCritical(): Promise<void>;
  loadLazy(id: string): Promise<void>;
}
```

Track preload list from `assetManifest.preload`. For Phase 2, preload can be empty (instant ready).

---

## M2.9 — useQualityTier

**File:** `src/hooks/useQualityTier.ts`

Auto-detect per `docs/07-performance-strategy.md`. Set store on mount.

Export preset config object:

```ts
export const qualityPresets = {
  high: { dprMax: 2, shadows: true, postProcessing: 'full', particles: 1 },
  medium: { dprMax: 1.5, shadows: true, postProcessing: 'partial', particles: 0.5 },
  low: { dprMax: 1, shadows: false, postProcessing: 'minimal', particles: 0.25 },
};
```

Apply `dprMax` to Canvas `dpr={[1, dprMax]}`.

---

## M2.10 — DevTools

**File:** `src/components/ui/DevTools.tsx`

Only render when `import.meta.env.DEV` or `?dev=1`:

- Dropdown: jump to any ExperiencePhase
- Dropdown: override quality tier
- Button: replay current camera sequence
- Display: current phase, FPS (optional)

DOM overlay, not in Canvas.

---

## M2.11 — Integration Test

Wire everything in `Experience.tsx`:

```tsx
export function Experience() {
  useQualityTier();
  return (
    <>
      <Canvas dpr={[1, qualityPreset.dprMax]}>
        <CinematicCamera />
        <SceneManager />
        <InteractionManager />
      </Canvas>
      <DevTools />
      <AudioManagerProvider />
    </>
  );
}
```

**Test flow:**
1. Dev HUD → set phase `intro` → see placeholder
2. Dev HUD → set phase `world` → see placeholder + interactive cube
3. Click cube → camera sequence plays
4. Dev HUD → switch audio layer → crossfade (or log)

---

## Acceptance Criteria

- [x] ExperienceState with all phases and actions
- [x] SceneManager routes by phase (placeholders OK)
- [x] CameraDirector plays GSAP sequences smoothly
- [x] cameraSequences.ts has intro + world sequences
- [x] InteractionManager raycast + click works
- [x] InteractiveObject with glow affordance
- [x] AudioManager layer switching (stub audio OK)
- [x] AssetManager progress tracking
- [x] useQualityTier auto-detects and applies DPR
- [x] DevTools phase jumper works
- [x] No TS errors, no console errors

---

## Out of Scope

- Full scene visuals (Phase 3)
- Shaders, post-processing (Phase 4)
- Real GLB/audio assets
- LoadingScene UI (Phase 3)

---

## Agent Notes (latest)

- **Agent:** Antigravity (Subagent)
- **Date:** 2026-08-18
- **Completed:** M2.1 – M2.11 Core Systems implemented and verified with production build passing.
- **Blocked:** None
- **Next:** Phase 3 — Scenes (M3.1 LoadingScene & IntroScene)

