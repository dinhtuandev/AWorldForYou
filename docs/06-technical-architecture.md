# Technical Architecture

> Folder structure, dependencies, managers, and data flow.

## Tech Stack

| Layer | Choice | Version Notes |
|-------|--------|---------------|
| Build | Vite | React + TS template |
| Framework | React 18+ | |
| 3D | Three.js + R3F + drei | |
| Animation | GSAP | Camera sequences |
| DOM animation | Framer Motion | UI overlays only |
| State | Zustand | ExperienceState |
| Post-processing | @react-three/postprocessing | Quality-gated |
| Audio | Howler.js | Layer management |
| Types | TypeScript strict | |

---

## Folder Structure

```text
src/
├── main.tsx
├── App.tsx                         # Mount <Experience /> only
│
├── experience/
│   ├── Experience.tsx              # Canvas + providers + SceneManager
│   ├── ExperienceState.ts          # Zustand store
│   ├── SceneManager.tsx            # Phase → scene routing
│   ├── CameraDirector.tsx          # GSAP camera sequences
│   ├── InteractionManager.tsx      # Raycast + object registry
│   └── SceneTransition.tsx         # Crossfade wrapper
│
├── components/
│   ├── scenes/
│   │   ├── LoadingScene.tsx
│   │   ├── IntroScene.tsx
│   │   ├── WorldScene.tsx
│   │   ├── MemoryScene.tsx
│   │   ├── memories/               # BeachMemory, CafeMemory, ...
│   │   ├── TimelineOverlay.tsx
│   │   ├── LetterScene.tsx
│   │   ├── BirthdayScene.tsx
│   │   ├── WomensDayScene.tsx
│   │   └── FinalScene.tsx
│   │
│   ├── world/                      # Diorama pieces
│   │   ├── Terrain.tsx
│   │   ├── House.tsx
│   │   ├── Trees.tsx
│   │   ├── Pond.tsx
│   │   ├── Clouds.tsx
│   │   └── Fireflies.tsx
│   │
│   ├── interactions/
│   │   ├── InteractiveObject.tsx
│   │   ├── MemoryPortal.tsx
│   │   └── HoverAffordance.tsx
│   │
│   ├── camera/
│   │   └── CinematicCamera.tsx
│   │
│   ├── effects/
│   │   ├── PostProcessing.tsx
│   │   ├── shaders/                # Water, fog, grain
│   │   └── ParticleSystem.tsx
│   │
│   ├── ui/
│   │   ├── CinematicText.tsx       # DOM text overlays
│   │   ├── AudioControl.tsx        # Subtle mute toggle
│   │   └── DevTools.tsx            # Phase jumper (dev only)
│   │
│   └── audio/
│       └── AudioManager.ts
│
├── hooks/
│   ├── useQualityTier.ts
│   ├── useAssetProgress.ts
│   ├── useCinematicCamera.ts
│   └── useInteraction.ts
│
├── data/
│   ├── experienceData.ts           # ★ ALL personal content
│   ├── assetManifest.ts            # Asset paths + preload/lazy
│   ├── cameraSequences.ts          # Camera keyframes
│   └── interactions.ts             # Interactive object configs
│
├── types/
│   └── experience.types.ts
│
├── utils/
│   ├── animation.ts                # GSAP helpers
│   └── device.ts                   # Mobile/GPU detection
│
└── assets/                         # Static files (or public/)
    ├── models/
    ├── textures/
    ├── audio/
    └── images/
```

---

## Dependency Graph

```text
ExperienceState (zustand)
    ├── SceneManager
    │     ├── LoadingScene
    │     ├── IntroScene
    │     ├── WorldScene
    │     ├── MemoryScene
    │     ├── LetterScene
    │     ├── BirthdayScene / WomensDayScene
    │     └── FinalScene
    │
    ├── CameraDirector
    │     └── cameraSequences.ts
    │
    ├── InteractionManager
    │     └── InteractiveObject
    │
    ├── AudioManager
    │     └── assetManifest (audio)
    │
    ├── AssetManager
    │     └── assetManifest (models/textures)
    │
    └── PostProcessing
          └── useQualityTier
```

**Rule:** Scenes depend on managers. Managers depend on state + data. Data files depend on nothing.

---

## Key Types

```ts
// src/types/experience.types.ts

export type ExperiencePhase = 'loading' | 'intro' | 'world' | 'memory' | 'timeline' | 'letter' | 'birthday' | 'womensDay' | 'final';
export type QualityTier = 'high' | 'medium' | 'low';
export type ExperienceMode = 'default' | 'birthday' | 'womensDay';
export type MemorySceneId = 'beach' | 'cafe' | 'nightWalk' | 'firstMeeting';
export type AudioLayer = 'intro' | 'world' | 'memory' | 'letter' | 'ending' | 'birthday' | 'none';

export interface Memory {
  id: string;
  objectType: string;
  title: string;
  date: string;
  image: string;
  description: string;
  scene: MemorySceneId;
  worldPosition: [number, number, number];
}

export interface TimelineMilestone {
  id: string;
  date: string;
  label: string;
  worldPosition: [number, number, number];
  memoryId?: string;
}

export interface ExperienceData {
  girlfriendName: string;
  senderName: string;
  mode: ExperienceMode;
  intro: { line1: string; line2: string };
  memories: Memory[];
  timeline: TimelineMilestone[];
  letter: string[];
  birthday?: { enabled: boolean; message: string };
  womensDay?: { enabled: boolean; message: string };
  finalScene: {
    line1: string;
    line2: string;
    line3: string;
    closing: string;
  };
}
```

---

## Component Patterns

### Scene Component

```tsx
// Each scene receives no props — reads from ExperienceState + experienceData
export function IntroScene() {
  const phase = useExperienceStore(s => s.phase);
  if (phase !== 'intro') return null;
  // ...
}
```

### Interactive Object

```tsx
<InteractiveObject
  id="mem-photo-1"
  position={memory.worldPosition}
  affordance="glow"
  onInteract={() => enterMemory(memory.id)}
  cameraSequenceId={`memory-portal-${memory.id}`}
>
  <PhotoFrame texture={memory.image} />
</InteractiveObject>
```

### Manager Hook Pattern

```ts
// CameraDirector exposed as hook + ref
const { play, isPlaying, stop } = useCameraDirector();
```

---

## Data Flow Example: Memory Click

```text
1. User clicks photo frame
2. InteractionManager raycast → InteractiveObject.onInteract
3. store.enterMemory('photo-1')
   → phase = 'memory', activeMemoryId = 'photo-1', isTransitioning = true
4. CameraDirector.play('memory-portal-photo-1')
5. MemoryPortal shader transition (photo → 3D)
6. SceneManager mounts MemoryScene (beach)
7. AudioManager.crossfade('world' → 'memory')
8. isTransitioning = false
```

---

## Environment Config

```ts
// vite.config.ts — no special config needed initially
// tsconfig — strict: true
// .env — VITE_DEV_TOOLS=true for dev HUD
```

---

## Testing Strategy

| Level | Tool | What |
|-------|------|------|
| Unit | Vitest | State transitions, data parsing |
| Integration | Dev HUD | Phase jumper, camera replay |
| Visual | Manual | Each scene acceptance criteria |
| Performance | Stats.js (dev) | FPS per scene per quality tier |

---

## Code Quality Rules

1. No file > 300 lines (split into sub-components)
2. `App.tsx` < 30 lines
3. All scenes in `components/scenes/`
4. No hardcoded personal strings in components
5. Types exported from `experience.types.ts`
6. Shaders in separate `.glsl` or template literal files
