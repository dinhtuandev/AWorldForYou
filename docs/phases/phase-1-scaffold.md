# Phase 1 — Project Scaffold

## Agent Prompt

```markdown
Implement Phase 1 (Project Scaffold) for AWFO.

Read first:
- docs/06-technical-architecture.md
- docs/05-asset-requirements.md
- .cursor/rules/awfo.mdc

Milestones: M1.1 – M1.8 (see docs/TASKS-BREAKDOWN.md)

Deliver empty but structured project that renders a blank R3F Canvas.
Do NOT implement scenes, managers, or visual effects yet.
```

---

## Goal

Bootstrap the project with correct dependencies, folder structure, types, and placeholder data. End state: `npm run dev` shows empty 3D canvas, `npm run build` passes.

---

## M1.1 — Init Vite + React + TypeScript

```bash
npm create vite@latest . -- --template react-ts
npm install
```

Ensure existing `Tasks.md`, `docs/`, `.cursor/` are preserved.

---

## M1.2 — Install Dependencies

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install gsap zustand framer-motion howler
npm install -D @types/three @types/howler
```

---

## M1.3 — Folder Structure

Create empty directories per `docs/06-technical-architecture.md`:

```text
src/experience/
src/components/scenes/
src/components/scenes/memories/
src/components/world/
src/components/interactions/
src/components/camera/
src/components/effects/shaders/
src/components/ui/
src/components/audio/
src/hooks/
src/data/
src/types/
src/utils/
public/assets/models/
public/assets/textures/
public/assets/audio/
public/assets/images/
```

Add `.gitkeep` in empty asset folders.

---

## M1.4 — Types

Create `src/types/experience.types.ts` with all types from `docs/06-technical-architecture.md`:

- `ExperiencePhase`, `QualityTier`, `ExperienceMode`, `MemorySceneId`, `AudioLayer`
- `Memory`, `TimelineMilestone`, `ExperienceData`
- `CameraKeyframe`, `CameraSequence`
- `InteractiveObjectConfig`

Export everything.

---

## M1.5 — Experience Data (Placeholder)

Create `src/data/experienceData.ts`:

```ts
import type { ExperienceData } from '../types/experience.types';

export const experienceData: ExperienceData = {
  girlfriendName: 'My Love',
  senderName: 'Me',
  mode: 'default',
  intro: {
    line1: 'I made a little world for you.',
    line2: 'Come in.',
  },
  memories: [
    {
      id: 'photo-1',
      objectType: 'photo',
      title: 'Beach Day',
      date: '2024-06-15',
      image: '/assets/images/placeholder-beach.jpg',
      description: 'Our first trip to the ocean together.',
      scene: 'beach',
      worldPosition: [-2, 0.5, 1],
    },
    // Add 2–3 more placeholder memories
  ],
  timeline: [
    { id: 'm-2024', date: '2024', label: 'Where it began', worldPosition: [3, 1, -2] },
    { id: 'm-2025', date: '2025', label: 'Growing together', worldPosition: [4, 1.5, -3] },
    { id: 'm-2026', date: '2026', label: 'Our chapter now', worldPosition: [5, 2, -4] },
  ],
  letter: [
    'There are things I don\'t say enough.',
    'Thank you for being part of my life.',
    'For the ordinary days.',
    'For the difficult days.',
    'For every memory.',
    'And if I could choose again...',
    'I\'d still choose you.',
  ],
  birthday: { enabled: false, message: 'Happy Birthday' },
  womensDay: { enabled: false, message: 'Happy Women\'s Day' },
  finalScene: {
    line1: 'This little world is mine.',
    line2: 'But you\'re my favorite part of it.',
    line3: 'I love you.',
    closing: 'See you in our next chapter.',
  },
};
```

---

## M1.6 — Asset Manifest

Create `src/data/assetManifest.ts`:

```ts
export const assetManifest = {
  models: {} as Record<string, string>,
  textures: {} as Record<string, string>,
  audio: {} as Record<string, string>,
  preload: [] as string[],
  lazy: [] as string[],
};
```

Populate keys from `docs/05-asset-requirements.md` with placeholder paths. Mark critical assets in `preload`.

---

## M1.7 — App + Experience Shell

**`src/App.tsx`** (< 30 lines):

```tsx
import { Experience } from './experience/Experience';

export default function App() {
  return <Experience />;
}
```

**`src/experience/Experience.tsx`**:

```tsx
import { Canvas } from '@react-three/fiber';

export function Experience() {
  return (
    <Canvas
      camera={{ position: [0, 2, 8], fov: 60 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
    >
      <color attach="background" args={['#000000']} />
      <ambientLight intensity={0.2} />
      {/* Scenes added in Phase 2+ */}
    </Canvas>
  );
}
```

Remove Vite boilerplate (counter demo, etc.). Clean `index.css` — black background, no margin.

---

## M1.8 — Verify

```bash
npm run dev    # Black canvas with faint ambient light
npm run build  # Zero TS errors
```

---

## Acceptance Criteria

- [x] Vite + React + TS running
- [x] All dependencies installed
- [x] Folder structure matches architecture doc
- [x] Types file complete
- [x] experienceData.ts with placeholder content
- [x] assetManifest.ts with keys (empty paths OK)
- [x] App.tsx < 30 lines
- [x] Empty Canvas renders black screen
- [x] `npm run build` passes

---

## Out of Scope

- SceneManager, ExperienceState, CameraDirector
- Any scene components
- Post-processing, shaders, audio
- Real 3D assets

---

## Agent Notes (latest)

- **Agent:** Antigravity (Phase 1 Subagent)
- **Date:** 2026-08-18
- **Completed:** M1.1 - M1.8 (Vite + React + TS, 3D & animation packages, full folder structure, experience.types.ts, experienceData.ts, assetManifest.ts, Experience.tsx, App.tsx, verified build)
- **Blocked:** None
- **Next:** Phase 2 — Core Systems (M2.1 - M2.11)
