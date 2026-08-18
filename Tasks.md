# Build an Award-Level Immersive 3D Love Experience

You are a **senior creative developer, 3D web engineer, interaction designer, and cinematic experience director**.

Your task is to build an **immersive, cinematic, emotionally engaging 3D web experience for a girlfriend**.

This must NOT look like a typical Valentine's Day / birthday website.

Do not create:
- generic pink romantic templates
- floating heart spam
- basic HTML cards
- static photo galleries
- cheesy gradient backgrounds
- excessive emojis
- simple "Happy Birthday ❤️" landing pages
- generic particle backgrounds with text on top
- boring scroll sections

The experience should feel closer to a **small interactive 3D game, digital art installation, cinematic WebGL experience, or interactive short film**.

---

# 1. Creative Direction

Core concept:

## "A Little World Made For You"

The website is a tiny 3D universe created specifically for one person.

The user does not simply scroll through a website.

They **enter a world**.

They explore.

They interact with objects.

They discover memories.

The environment reacts to them.

The camera moves cinematically.

The story gradually reveals itself.

The final emotional payoff should feel earned.

Think:

- cinematic game intro
- interactive art installation
- miniature diorama
- dreamy 3D world
- intimate digital gift
- emotional short film

NOT:

- traditional website
- dashboard
- portfolio
- landing page

---

# 2. Technology

Use:

- React
- TypeScript
- Vite or Next.js
- React Three Fiber
- Three.js
- @react-three/drei
- GSAP for cinematic camera choreography
- Framer Motion where appropriate for DOM/UI transitions
- GLSL shaders where they materially improve the visuals
- postprocessing
- Web Audio API / HTML5 Audio
- GLTF/GLB 3D assets

Use a clean component architecture.

Suggested structure:

```text
src/
├── components/
│   ├── scenes/
│   ├── world/
│   ├── camera/
│   ├── effects/
│   ├── interactions/
│   ├── ui/
│   └── audio/
│
├── experience/
│   ├── SceneManager
│   ├── CameraDirector
│   ├── InteractionManager
│   └── ExperienceState
│
├── assets/
│   ├── models/
│   ├── textures/
│   ├── audio/
│   └── images/
│
├── data/
│   ├── memories.ts
│   ├── timeline.ts
│   └── messages.ts
│
└── App.tsx
```

Separate the **content/data** from the 3D implementation so personal information can easily be replaced.

---

# 3. Visual Quality

The visual target should be:

## Premium cinematic WebGL.

Use:

- physically based materials
- soft shadows
- ambient occlusion
- depth of field
- bloom used subtly
- volumetric-looking light
- atmospheric fog
- reflections where useful
- cinematic exposure
- tone mapping
- subtle film grain
- high-quality anti-aliasing
- carefully controlled color grading

Do NOT overuse effects.

The visual hierarchy should be:

```text
composition
    ↓
lighting
    ↓
materials
    ↓
camera
    ↓
animation
    ↓
post-processing
```

Do not compensate for poor composition with excessive post-processing.

---

# 4. Opening Experience

The website begins completely black.

No navbar.

No visible traditional UI.

A tiny glowing particle appears in the center.

The particle slowly expands.

Hundreds of particles emerge.

The camera begins moving forward.

A distant 3D object becomes visible.

Text appears subtly:

> "I made a little world for you."

Do not immediately reveal the entire scene.

Create anticipation.

After approximately 4–6 seconds:

> "Come in."

A subtle interaction indicator appears.

When the user clicks:

The camera travels through the particle field.

The black void transforms into a miniature 3D world.

---

# 5. The Miniature World

Create a beautiful stylized 3D diorama.

The world contains:

- small house
- garden
- trees
- flowers
- pathway
- small pond
- warm windows
- street lamp
- small bridge
- distant mountains
- sky
- clouds
- subtle particles

The world should feel alive.

Add:

- slowly moving clouds
- leaves moving in wind
- subtle water movement
- fireflies
- environmental particles
- dynamic light
- small ambient animations

Do NOT make everything move.

Movement should be subtle.

The goal is:

## "This world feels alive."

---

# 6. Camera Direction

Do not leave the camera static.

Create a dedicated:

```text
CameraDirector
```

system.

It should support cinematic camera sequences.

Example:

```text
INTRO
  ↓
ORBIT WORLD
  ↓
APPROACH HOUSE
  ↓
ENTER HOUSE
  ↓
MEMORY ROOM
  ↓
MEMORY PORTAL
  ↓
RETURN TO WORLD
  ↓
LETTER
  ↓
FINAL SCENE
```

Camera movement should use:

- easing
- spline paths
- smooth interpolation
- GSAP timelines
- lookAt targets
- controlled depth of field

Avoid abrupt camera movement.

---

# 7. Exploration

Allow the user to interact with the world.

The experience can support:

- orbit controls
- mouse movement
- click interaction
- hover interaction
- scroll-based progression
- optional WASD exploration on desktop

Do not force complicated controls.

The experience must remain accessible to someone who has never played a 3D game.

Objects that can be interacted with should subtly communicate this through:

- glow
- scale
- light
- cursor
- particles
- gentle animation

Never use giant "CLICK HERE" buttons.

---

# 8. Memory Objects

Place several meaningful objects throughout the world.

For example:

```text
Camera
Letter
Music Box
Photo
Flower
Gift Box
Clock
```

Each object represents a different part of the relationship.

When the user approaches or clicks an object:

The camera performs a cinematic transition.

Do NOT open a normal modal.

Instead, transform the environment.

Example:

User clicks a camera.

The camera object grows.

The entire scene transitions.

The screen becomes the inside of a photograph.

---

# 9. Memory Transition

This is one of the most important effects.

A 2D photograph should become a 3D memory environment.

Example:

Photo:

```text
Two people at the beach.
```

When clicked:

1. photo moves toward camera
2. image fills screen
3. image becomes blurred
4. depth begins appearing
5. foreground/background separate
6. environment transforms into a 3D scene
7. ambient audio changes
8. camera enters the memory

The user should feel:

## "I just entered the memory."

Do not simply show an image in a modal.

---

# 10. Memory Environments

Each important memory can have a small stylized 3D environment.

Examples:

### Beach memory

- sunset
- ocean
- moving waves
- warm lighting
- wind particles

### Cafe memory

- table
- coffee
- window
- rain
- warm interior lighting

### Night walk

- street lamps
- dark blue atmosphere
- stars
- subtle fog

### First meeting

Use a simplified symbolic environment rather than trying to recreate everything realistically.

The memory should be emotionally recognizable, not photorealistic.

---

# 11. Timeline

Create a 3D timeline.

Do NOT use a normal vertical HTML timeline.

Create floating chronological objects in the world.

Example:

```text
2024 ─────●
             \
2025 ────────●
               \
2026 ───────────●
```

Each milestone can be represented by:

- glowing crystal
- floating photograph
- small island
- planet
- memory orb

When selected:

Camera flies toward the milestone.

The environment changes.

A short memory appears.

---

# 12. The Letter

Eventually the user discovers a 3D envelope.

Make it physically believable.

Include:

- paper
- envelope
- wax seal
- subtle shadows
- realistic opening animation

When clicked:

The room becomes dark.

The envelope becomes the primary light source.

The camera slowly approaches.

The letter opens.

Text appears gradually.

Example:

> "There are things I don't say enough."

Pause.

> "Thank you for being part of my life."

Pause.

> "For the ordinary days."

Pause.

> "For the difficult days."

Pause.

> "For every memory."

Then:

> "And if I could choose again..."

Long pause.

> "I'd still choose you."

Do not animate every word.

Use intentional pauses.

---

# 13. Birthday Mode

If this experience is being used for a birthday:

Transition from the letter into a dark room.

A spotlight turns on.

A beautiful 3D birthday cake appears.

The candles are physically integrated into the scene.

Text:

> "It's your day."

Then:

> "Make a wish."

Support microphone input if feasible.

When the user blows:

- candle flames react
- flames disappear
- smoke particles appear
- lighting changes
- fireworks appear
- music rises
- camera pulls backward

Then reveal the entire miniature world illuminated at night.

Final text:

> "Happy Birthday, [NAME]."

---

# 14. 8/3 Mode

If used for International Women's Day:

Replace the cake scene with:

## "The Garden"

Start with a completely empty garden.

One flower appears.

User interaction causes another flower to grow.

Continue.

Eventually the entire garden becomes filled with flowers.

Camera rises.

From above, the flowers form a subtle heart.

Do NOT make it cartoonish.

Make it elegant and cinematic.

Text:

> "For the person who makes my world more beautiful."

Then:

> "Happy Women's Day."

---

# 15. Music

Music must be part of the experience.

Do not autoplay aggressively.

Start ambient sound after user interaction.

Use different audio layers:

```text
INTRO
  ambient space

WORLD
  soft atmospheric music

MEMORY
  emotional music

LETTER
  minimal piano / ambient

ENDING
  emotional crescendo
```

Use smooth crossfades.

Do not abruptly switch tracks.

Add a very subtle audio control.

---

# 16. Final Scene

After the final memory:

Return to the miniature world.

But now it is nighttime.

The entire world is illuminated.

Fireflies appear.

The stars become brighter.

The camera slowly rises above the world.

The user sees the entire world from above.

Then all lights gradually converge toward the center.

A glowing 3D heart appears.

Not an emoji.

Create a beautiful:

- glass heart
- crystal heart
- translucent heart
- or glowing volumetric heart

The heart pulses subtly.

Text:

> "This little world is mine."

Pause.

> "But you're my favorite part of it."

Pause.

Then:

# "I love you."

Final small text:

> "See you in our next chapter."

---

# 17. Interaction Philosophy

Every interaction should have a purpose.

Avoid:

- random spinning objects
- meaningless particle explosions
- excessive cursor effects
- constant camera movement
- unnecessary animations
- giant text
- excessive UI

Follow:

```text
curiosity
    ↓
interaction
    ↓
discovery
    ↓
emotion
    ↓
reward
```

The user should always wonder:

> "What happens if I interact with this?"

---

# 18. Advanced Visual Features

Where technically appropriate, implement:

- custom GLSL shaders
- animated water shader
- procedural particles
- firefly particles
- atmospheric fog
- depth of field
- bloom
- subtle chromatic aberration
- screen-space effects
- environment reflections
- animated emissive materials
- procedural sky
- dynamic lighting
- mouse-reactive objects
- parallax
- camera shake only when appropriate

Do not add features simply to demonstrate technical ability.

Every effect must support the experience.

---

# 19. Performance

This must be a real production-quality web experience.

Target:

## Desktop

60 FPS on reasonable hardware.

## Mobile

Prioritize stability over graphical quality.

Implement:

- lazy loading
- progressive asset loading
- compressed GLB assets
- texture compression where practical
- DPR limits
- adaptive pixel ratio
- reduced post-processing on mobile
- reduced shadow quality on mobile
- object visibility management
- LOD where appropriate
- instancing for repeated objects
- asset preloading only when useful

Create a quality system:

```text
HIGH
MEDIUM
LOW
```

Automatically adapt based on device capability where practical.

Do not ship an experience that looks beautiful in screenshots but runs at 15 FPS.

---

# 20. Loading Experience

Do not show a generic:

"Loading 0%..."

Instead create a minimal cinematic preload experience.

Example:

A small glowing object slowly forms.

Text:

> "Building your little world..."

Progress should be real.

Once assets are ready:

> "Ready."

Then transition into the experience.

---

# 21. Responsive Design

Desktop:

Full immersive WebGL.

Mobile:

Do not simply shrink desktop.

Adapt:

- camera
- controls
- object scale
- interaction radius
- post-processing
- text size
- UI
- performance

Support touch interaction.

Avoid requiring WASD on mobile.

---

# 22. Content Architecture

All personal content must be configurable.

Create a data structure similar to:

```ts
const experienceData = {
  girlfriendName: "...",
  senderName: "...",

  memories: [
    {
      title: "...",
      date: "...",
      image: "...",
      description: "...",
      scene: "beach"
    }
  ],

  letter: [
    "...",
    "...",
    "..."
  ],

  birthday: {
    enabled: true,
    date: "...",
    message: "..."
  },

  womensDay: {
    enabled: false,
    message: "..."
  }
}
```

The developer should be able to personalize the entire experience by editing one data file.

---

# 23. Visual References / Design Philosophy

Use the quality bar of modern WebGL creative development.

Study the principles behind:

- immersive Three.js showcases
- React Three Fiber experiences
- cinematic portfolio experiences
- interactive 3D art installations
- WebGL storytelling
- third-person 3D exploration
- shader-driven websites

The goal is not to copy another website.

The goal is to reproduce the **level of interaction and craftsmanship**.

Recent Three.js showcases demonstrate techniques such as React Three Fiber, GLSL shaders, cinematic camera systems, reflections, volumetric-style effects, third-person navigation and interactive environments. Use those principles as technical inspiration. 

---

# 24. Code Quality

Do not produce a single giant `App.tsx`.

Use:

- reusable components
- typed interfaces
- scene composition
- state management
- isolated effects
- clean hooks
- reusable animation utilities
- centralized experience state
- centralized asset configuration

Example:

```text
Experience
 ├── IntroScene
 ├── WorldScene
 ├── MemoryScene
 ├── LetterScene
 ├── BirthdayScene
 └── FinalScene
```

Create reusable systems:

```text
CameraDirector
SceneTransition
InteractiveObject
MemoryPortal
ParticleSystem
AudioManager
AssetManager
PostProcessing
```

---

# 25. Important Creative Rule

Do not make this feel like:

> "A developer made a website for his girlfriend."

Make it feel like:

> "Someone created a tiny universe specifically for me."

That distinction is the entire point of the project.

Before implementing, first create:

1. experience architecture
2. scene map
3. interaction map
4. camera choreography
5. asset requirements
6. technical architecture
7. performance strategy

Then implement the experience scene by scene.

Do not rush directly into coding.

Build the **visual language and interaction system first**, then add personal content.

The final result should be something the recipient remembers as an **experience**, not merely a website.