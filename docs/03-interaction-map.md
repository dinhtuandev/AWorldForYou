# Interaction Map

> Every interactive object: ID, trigger, camera sequence, audio change, state update.

## Interaction System Overview

```text
User input (click/hover/touch)
  → InteractionManager (raycast)
  → InteractiveObject handler
  → ExperienceState action
  → SceneManager transition
  → CameraDirector sequence
  → AudioManager crossfade
```

## Interactive Object Registry

All objects registered in `src/data/interactions.ts` (or derived from `experienceData`).

### Base Interface

```ts
interface InteractiveObjectConfig {
  id: string;
  label: string;                    // dev only, never shown to user
  worldPosition: [number, number, number];
  hoverRadius: number;
  affordance: 'glow' | 'scale' | 'light' | 'particles';
  cameraSequenceId: string;
  onInteract: () => void;           // store action
  disabledWhen?: ExperiencePhase[];
}
```

---

## World Scene Objects

### Memory Objects

| ID | Object | Type | Affordance | Camera Seq | Action |
|----|--------|------|------------|------------|--------|
| `mem-camera` | Camera | 3D model | glow + scale | `approach-camera` | `enterMemory('camera')` |
| `mem-letter` | Letter box | 3D model | light pulse | `approach-letter-box` | `enterMemory('letter-box')` |
| `mem-musicbox` | Music box | 3D model | particles | `approach-musicbox` | `enterMemory('musicbox')` |
| `mem-photo-1` | Photo frame | 3D + texture | glow | `memory-portal-beach` | `enterMemory('photo-1')` |
| `mem-photo-2` | Photo frame | 3D + texture | glow | `memory-portal-cafe` | `enterMemory('photo-2')` |
| `mem-flower` | Flower | 3D model | scale | `approach-flower` | `enterMemory('flower')` |
| `mem-giftbox` | Gift box | 3D model | light | `approach-giftbox` | `enterMemory('giftbox')` |
| `mem-clock` | Clock | 3D model | emissive pulse | `approach-clock` | `enterMemory('clock')` |

Each memory object maps to an entry in `experienceData.memories[]`.

### Navigation Objects

| ID | Object | Trigger | Action |
|----|--------|---------|--------|
| `timeline-entrance` | Glowing path / arch | Click when near | `setPhase('timeline')` |
| `envelope` | 3D envelope | Click | `setPhase('letter')` |
| `house-door` | House door | Click | Camera enters house interior |

### Intro

| ID | Object | Trigger | Action |
|----|--------|---------|--------|
| `intro-enter` | Invisible plane / particle field | Click after "Come in." | `setPhase('world')` + camera seq |

---

## Memory Scene Interactions

| ID | Trigger | Action |
|----|---------|--------|
| `memory-exit` | Click back area / subtle arrow | `exitMemory()` → world |
| `memory-explore` | Optional hotspots | Show description text in-world |

No modals. Descriptions appear as floating in-scene typography or particle text.

---

## Timeline Interactions

| ID | Object | Trigger | Action |
|----|--------|---------|--------|
| `milestone-{id}` | Crystal/orb per milestone | Click | `selectMilestone(id)` + camera fly |

---

## Letter Scene Interactions

| ID | Trigger | Action |
|----|---------|--------|
| `envelope-open` | Click envelope | Start open animation + letter reveal |
| `letter-advance` | Auto-timed | `advanceLetter()` per line |

Letter is mostly passive — user watches. Optional click to skip pause.

---

## Birthday Scene Interactions

| ID | Trigger | Action |
|----|---------|--------|
| `candle-blow` | Mic blow OR tap | Extinguish flames, trigger fireworks |
| `wish-complete` | All candles out | Transition to final |

**Mic fallback:** If `navigator.mediaDevices` unavailable, show subtle tap hint on candles.

---

## WomensDay Scene Interactions

| ID | Trigger | Action |
|----|---------|--------|
| `plant-flower` | Click/tap empty plot | Grow next flower from queue |
| `garden-complete` | All flowers planted | Camera rise + heart reveal |

---

## Hover Affordance Spec

Objects communicate interactivity through **one primary** affordance:

| Affordance | Implementation |
|------------|----------------|
| `glow` | Emissive intensity lerp 0→1 on hover |
| `scale` | Scale 1→1.05 with spring easing |
| `light` | Point light intensity increase |
| `particles` | Emit rate increase on hover |

**Cursor:** `cursor: pointer` only on interactive meshes.

**Never:** Giant buttons, "CLICK HERE" text, excessive bounce.

---

## Interaction Blocking

Interactions disabled when:
- `isTransitioning === true`
- Current phase doesn't match object's `disabledWhen` exclusion
- Object already visited (optional — some objects allow re-interact)

---

## Mobile Adaptations

| Desktop | Mobile |
|---------|--------|
| Hover affordance | Tap-to-highlight (brief glow on first tap near) |
| Small hit targets | `hoverRadius * 1.5` |
| WASD exploration | Disabled — orbit only |
| Click | Touch with debounce |

---

## Dev: Interaction Debug

When `?dev=1`:
- Show wireframe hit spheres for all interactive objects
- Log interaction events to console
- Highlight active object ID in HUD
