# Camera Choreography

> GSAP-driven cinematic camera sequences. Defined in `src/data/cameraSequences.ts`.

## CameraDirector API

```ts
interface CameraKeyframe {
  position: [number, number, number];
  lookAt: [number, number, number];
  duration: number;          // seconds
  ease: string;              // GSAP ease, e.g. 'power2.inOut'
  dof?: {
    focusDistance: number;
    bokehScale: number;
    focalLength?: number;
  };
}

interface CameraSequence {
  id: string;
  keyframes: CameraKeyframe[];
  onComplete?: () => void;
}

// Usage
cameraDirector.play('intro-to-world');
cameraDirector.play('memory-portal-beach', { onComplete: () => enterMemory() });
```

## Global Camera Rules

1. **Never abrupt movement** — minimum 1.5s for any transition
2. **Easing always** — no linear camera moves except micro-adjustments
3. **lookAt leads position** — camera looks before it arrives
4. **DoF follows focus** — blur unfocused areas during close-ups
5. **Spline paths** for long travels (intro → world, final rise)

---

## Sequence Catalog

### INTRO

#### `intro-particle-reveal`
| # | Position | LookAt | Duration | Ease | Notes |
|---|----------|--------|----------|------|-------|
| 1 | [0, 0, 8] | [0, 0, 0] | 0 | — | Start: black, single particle |
| 2 | [0, 0, 5] | [0, 0, 0] | 4.0 | power1.inOut | Slow forward through particles |
| 3 | [0, 1, 3] | [0, 0.5, -2] | 2.0 | power2.out | Distant object visible |

#### `intro-to-world`
| # | Position | LookAt | Duration | Ease | Notes |
|---|----------|--------|----------|------|-------|
| 1 | [0, 2, 2] | [0, 0, 0] | 0 | — | Pre-click position |
| 2 | [0, 3, -5] | [0, 1, -10] | 3.0 | power3.inOut | Through particle field |
| 3 | [8, 6, 12] | [0, 2, 0] | 4.0 | power2.out | Reveal full diorama |
| 4 | [6, 4, 10] | [0, 1.5, 0] | 2.0 | power1.out | Settle to orbit start |

---

### WORLD

#### `orbit-world`
Looping gentle orbit for idle/exploration default.

| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | [8, 5, 8] | [0, 1, 0] | 0 | — |
| 2 | [-8, 5, 8] | [0, 1, 0] | 20.0 | none (linear orbit) |

#### `approach-house`
| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | current | [0, 1, 0] | 0 | — |
| 2 | [2, 2.5, 4] | [0, 2, -1] | 3.0 | power2.inOut |
| 3 | [0.5, 2.2, 2] | [0, 2, -2] | 2.0 | power1.out |

DoF: focusDistance tightens on door.

#### `approach-{object}` (template)
Per memory object. Offset from `experienceData.memories[].worldPosition`.

| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | current | object pos | 0 | — |
| 2 | object + [1.5, 1, 2] | object pos | 2.5 | power2.inOut |

---

### MEMORY PORTAL

#### `memory-portal-{memoryId}`
Critical sequence — 8 steps, ~6s total.

| Step | Action | Duration | Notes |
|------|--------|----------|-------|
| 1 | Camera approaches photo frame | 1.5s | power2.in |
| 2 | Photo scale-up toward camera (object anim, not camera) | 1.0s | Photo fills viewport |
| 3 | Blur shader ramp | 0.5s | Post-processing |
| 4 | Depth separation (parallax layers) | 1.0s | Shader transition |
| 5 | Crossfade to 3D memory env | 1.0s | Scene swap mid-blur |
| 6 | Camera enters memory space | 1.5s | power3.out |
| 7 | Settle with slight drift | 0.5s | Idle exploration start |

#### `memory-exit`
Reverse of portal — blur → photo shrink → return to world position.

| # | Duration | Ease |
|---|----------|------|
| Full reverse | 4.0s | power2.inOut |

---

### TIMELINE

#### `fly-to-milestone-{id}`
| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | current | milestone | 0 | — |
| 2 | milestone + [3, 2, 3] | milestone | 3.0 | power3.inOut |

#### `return-from-timeline`
| # | Duration | Ease |
|---|----------|------|
| Back to last world orbit position | 2.5s | power2.out |

---

### LETTER

#### `letter-approach`
| # | Position | LookAt | Duration | Ease | DoF |
|---|----------|--------|----------|------|-----|
| 1 | [0, 1.5, 3] | [0, 1, 0] | 0 | — | wide |
| 2 | [0, 1.2, 1.2] | [0, 1, 0] | 4.0 | power1.inOut | tight on envelope |
| 3 | [0, 1.1, 0.8] | [0, 1, 0] | 2.0 | power1.out | hold for reading |

Room darkens via lighting, not camera.

---

### BIRTHDAY

#### `birthday-reveal`
| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | [0, 2, 4] | [0, 1, 0] | 0 | — |
| 2 | [0, 1.8, 2.5] | [0, 1.2, 0] | 3.0 | power2.out | Spotlight moment |

#### `birthday-pullback`
| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | current | cake | 0 | — |
| 2 | [0, 8, 15] | [0, 2, 0] | 5.0 | power2.inOut | Reveal night world |

---

### WOMENS DAY

#### `garden-rise`
| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | [0, 2, 5] | [0, 0, 0] | 0 | — |
| 2 | [0, 12, 8] | [0, 0, 0] | 6.0 | power2.inOut | Aerial heart reveal |

---

### FINAL

#### `final-rise`
| # | Position | LookAt | Duration | Ease |
|---|----------|--------|----------|------|
| 1 | [6, 4, 10] | [0, 1, 0] | 0 | — |
| 2 | [0, 15, 12] | [0, 0, 0] | 8.0 | power1.inOut | Rise above world |
| 3 | [0, 8, 5] | [0, 1, 0] | 4.0 | power2.out | Converge on heart |

#### `final-heart-focus`
| # | Position | LookAt | Duration | Ease | DoF |
|---|----------|--------|----------|------|-----|
| 1 | [0, 3, 4] | [0, 1.5, 0] | 3.0 | power2.inOut | tight |

---

## Implementation Notes

- Use `@react-three/drei` `CameraControls` disabled during sequences
- GSAP timeline per sequence; kill on interrupt
- Store `lastWorldCameraPosition` for return transitions
- Spline paths: use `three` `CatmullRomCurve3` for intro-to-world and final-rise
- Mobile: same sequences, slightly wider FOV (75° vs 60°)

## Testing Checklist

- [ ] No camera jerk between sequences
- [ ] lookAt always reaches target before sequence ends
- [ ] DoF transitions smoothly (no pop)
- [ ] Interrupt mid-sequence → clean reset
- [ ] All sequences completable at 60fps
