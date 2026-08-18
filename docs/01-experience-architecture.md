# Experience Architecture

> Source of truth for global experience flow. All scenes and systems must align with this document.

## Core Concept

**"A Little World Made For You"** — an immersive 3D cinematic web experience. The user enters a world, explores, discovers memories, and earns an emotional payoff.

## Experience Phases (State Machine)

```text
loading → intro → world ⇄ memory
                      ⇄ timeline
                      → letter → birthday | womensDay | final → [end]
```

### Phase Enum

```ts
type ExperiencePhase =
  | 'loading'
  | 'intro'
  | 'world'
  | 'memory'
  | 'timeline'
  | 'letter'
  | 'birthday'
  | 'womensDay'
  | 'final';
```

### Valid Transitions

| From | To | Trigger |
|------|----|---------|
| `loading` | `intro` | All critical assets loaded |
| `intro` | `world` | User clicks after "Come in." |
| `world` | `memory` | User interacts with memory object |
| `memory` | `world` | User exits memory (back gesture / fade out) |
| `world` | `timeline` | User discovers timeline area |
| `timeline` | `world` | Milestone viewed, camera returns |
| `world` | `letter` | User finds envelope object |
| `letter` | `birthday` | `experienceData.mode === 'birthday'` |
| `letter` | `womensDay` | `experienceData.mode === 'womensDay'` |
| `letter` | `final` | `experienceData.mode === 'default'` |
| `birthday` | `final` | Cake sequence complete |
| `womensDay` | `final` | Garden sequence complete |
| `final` | — | Experience ends (loop or idle) |

## Global State (ExperienceState)

Managed by Zustand store at `src/experience/ExperienceState.ts`.

```ts
interface ExperienceState {
  phase: ExperiencePhase;
  previousPhase: ExperiencePhase | null;

  // User
  userHasInteracted: boolean;   // gates audio autoplay
  isTransitioning: boolean;     // blocks duplicate triggers

  // Memory
  activeMemoryId: string | null;
  visitedMemoryIds: string[];

  // Timeline
  activeMilestoneId: string | null;
  visitedMilestoneIds: string[];

  // Letter
  letterLineIndex: number;

  // Audio
  audioEnabled: boolean;
  currentAudioLayer: AudioLayer;

  // Quality
  qualityTier: 'high' | 'medium' | 'low';

  // Mode (from experienceData)
  mode: 'default' | 'birthday' | 'womensDay';
}
```

## Event Bus (Internal)

Scenes communicate via store actions, not direct imports:

```ts
// Actions
setPhase(phase: ExperiencePhase): void
enterMemory(memoryId: string): void
exitMemory(): void
selectMilestone(milestoneId: string): void
advanceLetter(): void
markUserInteraction(): void
setQualityTier(tier: QualityTier): void
```

## Scene Ownership

Each phase maps to exactly one primary scene component:

| Phase | Component | Mount Strategy |
|-------|-----------|----------------|
| `loading` | `LoadingScene` | Full screen DOM overlay |
| `intro` | `IntroScene` | R3F Canvas |
| `world` | `WorldScene` | R3F Canvas (persistent) |
| `memory` | `MemoryScene` | R3F overlay, world hidden |
| `timeline` | `TimelineOverlay` | Sub-layer within world |
| `letter` | `LetterScene` | R3F, world dimmed |
| `birthday` | `BirthdayScene` | R3F |
| `womensDay` | `WomensDayScene` | R3F |
| `final` | `FinalScene` | R3F, world at night |

## SceneManager Responsibilities

1. Mount/unmount scenes based on `phase`
2. Coordinate crossfade transitions (opacity, not hard cut)
3. Delegate camera sequences to `CameraDirector`
4. Delegate audio crossfades to `AudioManager`
5. Block interactions during `isTransitioning`

## Content Separation Rule

**All personal content lives in `src/data/experienceData.ts`.**

Scenes read data; they never hardcode names, messages, or image paths.

## Interaction Philosophy

```text
curiosity → interaction → discovery → emotion → reward
```

Every interaction must have purpose. No decorative spinners, no "CLICK HERE" buttons.

## Dev Tools (Development Only)

Expose via `?dev=1` query param:

- Phase jumper dropdown
- Quality tier override
- Camera sequence replay
- Skip intro button

Remove or gate behind env in production build.
