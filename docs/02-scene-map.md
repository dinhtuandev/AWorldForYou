# Scene Map

> Each scene: purpose, entry trigger, exit trigger, dependencies, acceptance criteria.

---

## LoadingScene

**Purpose:** Cinematic asset preload. No generic "Loading 0%..." bar.

| Property | Value |
|----------|-------|
| Phase | `loading` |
| Entry | App mount |
| Exit | Critical assets ready → `intro` |
| Type | DOM overlay (not R3F) |

**Visual:**
- Small glowing object slowly forming
- Text: "Building your little world..."
- Real progress from AssetManager
- Text: "Ready." → fade to black → intro

**Acceptance:**
- [ ] Progress reflects actual asset load %
- [ ] Smooth transition to IntroScene
- [ ] Works on slow connections (graceful timeout message)

**Dependencies:** AssetManager

---

## IntroScene

**Purpose:** Cinematic opening. Black void → particle field → invitation to enter.

| Property | Value |
|----------|-------|
| Phase | `intro` |
| Entry | Loading complete |
| Exit | User click after "Come in." → `world` |
| Duration | ~4–6s before "Come in." appears |

**Sequence:**
1. Complete black, no UI
2. Single glowing particle center
3. Particle expands, hundreds emerge
4. Camera moves forward
5. Distant object visible
6. Text: "I made a little world for you."
7. After 4–6s: "Come in." + subtle interaction indicator
8. On click: camera travels through particles → world reveals

**Acceptance:**
- [ ] No navbar or traditional UI
- [ ] Text from `experienceData` (intro copy configurable)
- [ ] Click triggers CameraDirector sequence `intro-to-world`
- [ ] Audio: ambient space starts after first interaction

**Dependencies:** CameraDirector, ParticleSystem, AudioManager

---

## WorldScene

**Purpose:** Main explorable miniature diorama. Hub for all discovery.

| Property | Value |
|----------|-------|
| Phase | `world` |
| Entry | Intro complete |
| Exit | Interact with memory / timeline / letter objects |
| Persistent | Yes — stays mounted, visibility toggled |

**World Contents:**
- House, garden, trees, flowers, pathway, pond
- Warm windows, street lamp, bridge
- Distant mountains, sky, clouds
- Subtle ambient life: clouds, leaves, water, fireflies

**Controls:**
- Desktop: orbit + optional WASD
- Mobile: touch orbit, larger hit radius
- Never require WASD on mobile

**Acceptance:**
- [ ] World feels alive but not chaotic
- [ ] Interactive objects have subtle affordance (glow, scale, cursor)
- [ ] 60fps desktop on reasonable hardware
- [ ] Quality tier adapts post-processing and shadows

**Dependencies:** All core systems, World GLB assets

---

## MemoryScene

**Purpose:** Immersive 3D environment representing a shared memory.

| Property | Value |
|----------|-------|
| Phase | `memory` |
| Entry | Click memory object in world |
| Exit | Back interaction / fade → `world` |
| Data-driven | One sub-scene per `memory.scene` type |

**Transition (MemoryPortal):**
1. Photo moves toward camera
2. Image fills screen
3. Blur
4. Depth separation (foreground/background)
5. Transform to 3D environment
6. Audio crossfade
7. Camera enters memory

**Memory Environment Types:**

| ID | Environment | Key Elements |
|----|-------------|--------------|
| `beach` | Beach | Sunset, ocean waves, warm light, wind particles |
| `cafe` | Cafe | Table, coffee, window rain, warm interior |
| `nightWalk` | Night walk | Street lamps, dark blue, stars, fog |
| `firstMeeting` | Symbolic | Simplified, emotionally recognizable |

**Acceptance:**
- [ ] NO HTML modal for memories
- [ ] Portal transition feels like "entering the memory"
- [ ] Each env loads lazily (dynamic import)
- [ ] Audio switches to emotional layer

**Dependencies:** MemoryPortal, CameraDirector, per-env components

---

## TimelineOverlay

**Purpose:** 3D chronological milestones floating in world space.

| Property | Value |
|----------|-------|
| Phase | `timeline` (sub-layer, world still mounted) |
| Entry | User approaches timeline area / object |
| Exit | Milestone viewed → return to world exploration |

**Visual:**
- Floating crystals, orbs, or small islands
- Connected by subtle light paths
- Each milestone from `experienceData.timeline`

**On Select:**
- Camera flies to milestone
- Environment subtly shifts
- Short memory snippet appears (not modal — in-world text/particles)

**Acceptance:**
- [ ] NOT a vertical HTML timeline
- [ ] Camera sequence per milestone
- [ ] Visited milestones tracked in state

**Dependencies:** CameraDirector, experienceData.timeline

---

## LetterScene

**Purpose:** Intimate letter reveal via 3D envelope.

| Property | Value |
|----------|-------|
| Phase | `letter` |
| Entry | User finds envelope in world |
| Exit | Letter complete → mode-specific next scene |

**Sequence:**
1. Room darkens
2. Envelope becomes primary light source
3. Camera approaches slowly
4. Envelope opens (physical animation)
5. Text appears line by line with intentional pauses
6. Lines from `experienceData.letter[]`

**Acceptance:**
- [ ] Physically believable envelope (paper, wax seal, shadows)
- [ ] Pauses between lines (not word-by-word animation)
- [ ] Minimal piano/ambient audio
- [ ] Routes to birthday / womensDay / final based on mode

**Dependencies:** 3D envelope model, CameraDirector, AudioManager

---

## BirthdayScene

**Purpose:** Birthday celebration finale (mode-gated).

| Property | Value |
|----------|-------|
| Phase | `birthday` |
| Entry | Letter complete + `mode === 'birthday'` |
| Exit | Wish made → `final` |

**Sequence:**
1. Dark room, spotlight on
2. 3D cake with integrated candles
3. "It's your day." → "Make a wish."
4. Blow interaction (mic if available, tap fallback)
5. Flames out, smoke, lighting change, fireworks
6. Camera pulls back, world illuminated at night
7. "Happy Birthday, [NAME]."

**Acceptance:**
- [ ] Mic blow with graceful fallback (tap candles)
- [ ] Candles physically in scene, not overlay
- [ ] Name from experienceData

**Dependencies:** Birthday cake GLB, particle fireworks, AudioManager

---

## WomensDayScene

**Purpose:** Elegant garden growth sequence (mode-gated).

| Property | Value |
|----------|-------|
| Phase | `womensDay` |
| Entry | Letter complete + `mode === 'womensDay'` |
| Exit | Garden complete → `final` |

**Sequence:**
1. Empty garden
2. One flower appears per user interaction
3. Garden fills progressively
4. Camera rises — flowers form subtle heart from above
5. "For the person who makes my world more beautiful."
6. "Happy Women's Day."

**Acceptance:**
- [ ] Elegant, not cartoonish
- [ ] Heart shape subtle from aerial view
- [ ] Each interaction grows one flower

**Dependencies:** Flower instancing, CameraDirector

---

## FinalScene

**Purpose:** Emotional closing. Night world, heart, final message.

| Property | Value |
|----------|-------|
| Phase | `final` |
| Entry | Birthday / WomensDay / default letter path |
| Exit | Idle / loop |

**Sequence:**
1. Return to miniature world at night
2. Fireflies, brighter stars, world illuminated
3. Camera rises above world
4. Lights converge to center
5. Glowing 3D heart (glass/crystal, NOT emoji)
6. Heart pulses subtly
7. Text sequence with pauses:
   - "This little world is mine."
   - "But you're my favorite part of it."
   - "I love you."
   - "See you in our next chapter."
8. Emotional crescendo audio

**Acceptance:**
- [ ] Beautiful 3D heart (translucent/glass)
- [ ] Night world visible from above
- [ ] All text from experienceData.finalScene

**Dependencies:** Heart model/shader, CameraDirector, AudioManager
