# AWFO — AWorldForYou

An immersive cinematic 3D web experience — a tiny universe made for someone special.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r180-black?style=flat-square)](https://threejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646cff?style=flat-square)](https://vitejs.dev/)

---

## Overview

AWFO is an interactive 3D diorama and storytelling experience built with React Three Fiber, Three.js, GSAP, and Zustand. It allows developers to create a personalized, emotional, and cinematic journey with custom memories, milestones, letters, and interactive special scenes.

---

## Personalize Your Experience

Anyone can personalize the entire experience in minutes by editing a single configuration file and adding photos.

### 1. Edit `src/data/experienceData.ts`

Open `src/data/experienceData.ts` and customize the fields:

```ts
import type { ExperienceData } from '../types/experience.types';

export const experienceData: ExperienceData = {
  girlfriendName: 'Emma',          // Her name (appears across scenes & endings)
  senderName: 'Lucas',             // Your name (appears on letter & closing card)
  mode: 'default',                 // 'default' | 'birthday' | 'womensDay'

  intro: {
    line1: 'I made a little world for you.',
    line2: 'Come in.',
  },

  loading: {
    building: 'Building your little world...',
    ready: 'Ready.',
  },

  memories: [
    {
      id: 'photo-1',
      objectType: 'photo',
      title: 'Beach Day',
      date: '2024-06-15',
      image: '/assets/images/beach-trip.jpg',
      description: 'Our first trip to the ocean together.',
      scene: 'beach',
      worldPosition: [-2, 0.5, 1],
    },
    // Add 3-6 memories...
  ],

  timeline: [
    {
      id: 'm-2024',
      date: '2024',
      label: 'Where it began',
      worldPosition: [3, 1, -2],
      memoryId: 'photo-4',
    },
    // Milestones connecting points in the 3D diorama...
  ],

  letter: [
    "There are things I don't say often enough.",
    "Thank you for being the gentle light in my life.",
    "For the ordinary days that become extraordinary with you.",
    "For the quiet moments when words aren't needed.",
    "For standing by me through every storm and every sunrise.",
    "And if I were given a thousand lifetimes to choose...",
    "I would still find you, and I would still choose you.",
  ],

  birthday: {
    enabled: true,
    message: 'Happy Birthday',
    wishPrompt: 'Make a Wish',
  },

  womensDay: {
    enabled: true,
    message: "Happy Women's Day",
    gardenPrompt: 'For the person who makes my world brighter and more beautiful every single day.',
  },

  finalScene: {
    line1: 'This little world is mine.',
    line2: "But you're my favorite part of it.",
    line3: 'I love you.',
    closing: 'See you in our next chapter.',
  },

  audio: {
    enabled: true,
    defaultVolume: 0.8,
  },
};
```

---

### 2. Choose Experience Mode

The `mode` property in `experienceData.ts` controls the narrative path after the Letter Scene:

| Mode | Path After Letter | Ideal Occasion |
|------|-------------------|----------------|
| `default` | Letter → Final Luminous Crystal Heart Scene | Anniversaries, Valentine's, Everyday Love |
| `birthday` | Letter → Interactive Birthday Cake & Wish Scene → Final Scene | Birthday Celebrations |
| `womensDay` | Letter → Interactive Blooming Floral Heart Garden → Final Scene | International Women's Day (March 8) / Special Occasions |

---

### 3. Add Memory Photos

1. Place your JPG, PNG, or WebP photos in `public/assets/images/`.
2. Reference the path in `experienceData.memories[].image` (e.g. `/assets/images/my-photo.jpg`).
3. **Recommended image dimensions**: Max 1920×1080px (or 1200×900px), 4:3 or 16:9 aspect ratio, optimized for web.

---

### 4. Customizing Audio & Music

- Background tracks and sound effects are configured in `src/data/assetManifest.ts`.
- Place your audio files (MP3/OGG) in `public/assets/audio/`.
- Audio crossfades dynamically between phases (`intro` → `world` → `memory` → `letter` → `birthday` / `ending`).

---

## Development & Commands

```bash
# Install dependencies
npm install

# Start local development server (with hot reload)
npm run dev

# Build production bundle with TypeScript type-checking
npm run build

# Preview production build locally
npm run preview
```

### DevTools HUD

In development mode (or with `?dev=1` query parameter), a collapsible HUD appears at the bottom-left of the screen to:
- Jump to any phase (`loading`, `intro`, `world`, `memory`, `timeline`, `letter`, `birthday`, `womensDay`, `final`)
- Switch experience modes live (`default`, `birthday`, `womensDay`)
- Toggle graphics quality tiers (`HIGH`, `MEDIUM`, `LOW`)
- Switch audio layers and test camera choreography sequences

---

## Project Structure

```
AWFO/
├── public/
│   └── assets/
│       ├── audio/            # MP3 / OGG audio tracks & SFX
│       ├── images/           # Memory photos & placeholders
│       ├── models/           # GLTF / GLB 3D models
│       └── textures/         # Environment textures & normal maps
├── src/
│   ├── components/
│   │   ├── audio/            # AudioManager & AudioControl
│   │   ├── camera/           # CinematicCamera director
│   │   ├── effects/          # AtmosphericFog, PostProcessing, ParticleSystem
│   │   ├── interactions/     # InteractiveObject, MemoryPortal
│   │   ├── scenes/           # 3D scenes & Framer Motion DOM overlays
│   │   │   ├── birthday/     # BirthdayCake & BirthdayOverlay
│   │   │   ├── final/        # CrystalHeart & FinalOverlay
│   │   │   ├── letter/       # Envelope3D & LetterOverlay
│   │   │   ├── memories/     # Beach, Cafe, NightWalk, FirstMeeting environments
│   │   │   └── womensDay/    # FloralHeart & WomensDayOverlay
│   │   ├── ui/               # DevTools HUD
│   │   └── world/            # Diorama terrain, house, trees, pond, milestones
│   ├── data/
│   │   ├── assetManifest.ts  # Audio, textures, models registry
│   │   ├── cameraSequences.ts# GSAP keyframed camera choreography
│   │   └── experienceData.ts # ★ MAIN PERSONALIZATION DATA FILE ★
│   ├── experience/           # ExperienceState (Zustand), SceneManager, Director
│   ├── hooks/                # useQualityTier, useAudioManager, useAssetProgress
│   └── types/
│       └── experience.types.ts# Core TypeScript interfaces & schemas
└── docs/                     # Comprehensive architecture & phase documents
```

---

## Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://r3f.docs.pmnd.rs/) + [@react-three/drei](https://github.com/pmndrs/drei) + [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)
- **Animation & Choreography**: [GSAP](https://greensock.com/) + [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Audio Engine**: [Howler.js](https://howlerjs.com/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/)

---

## Asset Optimization & Performance Guidelines

To maintain 60 FPS on desktop and 30+ FPS on mobile, follow these guidelines when adding custom 3D models and textures:

### 3D Models (GLB)
- **Draco Compression**: Compress all custom GLBs using `gltf-transform`:
  ```bash
  npx @gltf-transform/cli optimize input.glb output.glb --compress draco
  ```
- **Size Budget**: Keep each individual model under **2 MB** and total initial bundle under **12 MB**.
- **Geometry**: Reuse geometries and leverage instanced rendering (`@react-three/drei` `<Instances>`) for repeated elements.

### Textures & Images
- **Format**: Convert PNG/JPG textures to **WebP** where possible.
- **Max Resolution**: 2048×2048 for key backgrounds/HDRIs, 1024×1024 for props, and 512×512 for secondary materials and normal maps.

### Quality Tiers & Automatic Fallback
- The engine automatically detects hardware capabilities (GPU tier, device memory, core count) and adjusts DPR, shadow resolution, post-processing effects, and particle counts.
- **Auto-Downgrade**: If the render frame rate falls below 30 FPS for 3 consecutive seconds, the quality tier automatically steps down to preserve smooth motion.
- **WebGL Fallback**: If WebGL is unsupported or a context loss occurs, a graceful 2D CSS-animated fallback is presented.


---

## Production Deployment

You can deploy AWFO to any static web hosting platform in minutes.

### 1. Build for Production
```bash
npm run build
```
This produces optimized production assets in the `dist/` directory.

### 2. Deploy to Popular Hosting Platforms

#### Vercel
```bash
npx vercel --prod
```
Or connect your GitHub repository directly on [Vercel Dashboard](https://vercel.com). The default build settings (`npm run build`, output directory `dist`) work automatically out of the box.

#### Netlify
```bash
npx netlify deploy --prod --dir=dist
```
Or create a `netlify.toml` in the project root:
```toml
[build]
  publish = "dist"
  command = "npm run build"
```

#### Cloudflare Pages
1. Link your repository in Cloudflare Dashboard.
2. Select **Vite** preset.
3. Build command: `npm run build`
4. Build output directory: `dist`

#### GitHub Pages
To deploy to GitHub Pages with the `gh-pages` package:
1. Ensure `base: './'` in `vite.config.ts`.
2. Run `npm run build` and publish the `dist` branch to GitHub Pages.

---

## Documentation

- [Experience Architecture](docs/01-experience-architecture.md)
- [Scene Map](docs/02-scene-map.md)
- [Interaction Map](docs/03-interaction-map.md)
- [Camera Choreography](docs/04-camera-choreography.md)
- [Asset Requirements](docs/05-asset-requirements.md)
- [Technical Architecture](docs/06-technical-architecture.md)
- [Performance Strategy](docs/07-performance-strategy.md)
- [Tasks Breakdown](docs/TASKS-BREAKDOWN.md)

