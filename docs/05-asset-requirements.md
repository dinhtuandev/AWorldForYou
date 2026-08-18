# Asset Requirements

> All 3D models, textures, audio, and images needed. Placeholder strategy included.

## Asset Pipeline

```text
assets/
├── models/          # GLB/GLTF (Draco compressed)
├── textures/        # JPG/PNG/WebP, max 2048px
├── audio/           # MP3/OGG, normalized -14 LUFS
└── images/          # Memory photos, UI
```

**Placeholder rule:** Use colored box/capsule meshes until final GLB ready. Swap via `assetManifest.ts` without code changes.

---

## 3D Models (GLB)

### World Diorama

| Asset ID | Description | Priority | Placeholder | Notes |
|----------|-------------|----------|-------------|-------|
| `world-terrain` | Ground plane with path | P0 | Flat plane + texture | Include pond depression |
| `world-house` | Small stylized house | P0 | Box + pyramid roof | Warm emissive windows |
| `world-trees` | 3 tree variants | P0 | Cone + cylinder | Instanced |
| `world-flowers` | Flower cluster | P1 | Small spheres | Instanced, multiple colors |
| `world-bridge` | Small wooden bridge | P1 | Thin box arch | Over pond |
| `world-lamp` | Street lamp | P1 | Cylinder + sphere | Emissive bulb |
| `world-pond` | Pond mesh | P1 | Circle plane | Water shader target |
| `world-mountains` | Distant low-poly mountains | P2 | Scaled boxes | Background, low poly |
| `world-clouds` | 3 cloud shapes | P2 | Soft spheres | Slow drift animation |

### Interactive Objects

| Asset ID | Description | Priority | Placeholder |
|----------|-------------|----------|-------------|
| `obj-camera` | Vintage camera | P1 | Box + cylinder lens |
| `obj-musicbox` | Music box | P2 | Small box |
| `obj-photo-frame` | Photo frame (empty) | P0 | Plane with frame border |
| `obj-envelope` | Letter envelope + wax seal | P0 | Folded plane mesh |
| `obj-giftbox` | Gift box with ribbon | P2 | Cube + ribbon planes |
| `obj-clock` | Small clock | P2 | Cylinder face |
| `obj-crystal` | Timeline milestone crystal | P1 | Icosahedron |

### Memory Environments

| Asset ID | Scene | Priority | Placeholder |
|----------|-------|----------|-------------|
| `mem-beach` | Beach environment kit | P1 | Plane + gradient sky |
| `mem-cafe` | Cafe interior kit | P2 | Table + chair boxes |
| `mem-nightwalk` | Street + lamps | P2 | Plane + lamp instances |
| `mem-symbolic` | Abstract symbolic space | P2 | Particles + platform |

### Special Scenes

| Asset ID | Description | Priority | Placeholder |
|----------|-------------|----------|-------------|
| `birthday-cake` | 3D cake with candles | P2 | Cylinder tiers + thin boxes |
| `final-heart` | Glass/crystal heart | P1 | Icosahedron + glass material |
| `womens-flowers` | Single flower mesh | P2 | Lathe/sphere petal |

---

## Textures

| Asset ID | Usage | Size | Format |
|----------|-------|------|--------|
| `tex-ground` | World ground | 1024 | JPG/WebP |
| `tex-house-walls` | House exterior | 1024 | JPG |
| `tex-house-roof` | Roof | 512 | JPG |
| `tex-water-normal` | Pond water normal map | 512 | PNG |
| `tex-noise` | Film grain, fog | 256 | PNG (tileable) |
| `tex-hdri-sunset` | World + beach lighting | 2048 | HDR → env map |
| `tex-hdri-night` | Final scene | 2048 | HDR |
| `tex-photo-{id}` | Memory photos | 1024 | JPG (from user) |

---

## Audio

| Asset ID | Layer | Duration | Priority | Notes |
|----------|-------|----------|----------|-------|
| `audio-ambient-space` | intro | loop | P0 | Dark, spacious |
| `audio-world-atmosphere` | world | loop | P0 | Soft, warm |
| `audio-memory-emotional` | memory | loop | P1 | Per-env variants optional |
| `audio-letter-piano` | letter | loop | P1 | Minimal piano |
| `audio-ending-crescendo` | final | 30–60s | P1 | Builds to emotional peak |
| `audio-birthday-music` | birthday | loop → crescendo | P2 | |
| `sfx-envelope-open` | letter | one-shot | P1 | Paper rustle |
| `sfx-candle-blow` | birthday | one-shot | P2 | |
| `sfx-fireworks` | birthday | one-shot | P2 | |
| `sfx-flower-grow` | womensDay | one-shot | P2 | Soft chime |
| `sfx-interact-hover` | world | one-shot | P2 | Very subtle |

**Audio rules:**
- No autoplay before user interaction
- All tracks same approximate loudness (-14 LUFS)
- Crossfade duration: 1.5–2.5s

---

## Images (User-Provided)

Configured in `experienceData.ts`:

```ts
memories: [
  { id: 'photo-1', image: '/assets/images/beach.jpg', scene: 'beach' },
  // ...
]
```

| Requirement | Spec |
|-------------|------|
| Format | JPG or WebP |
| Max size | 1920px longest edge |
| Aspect | 4:3 or 16:9 preferred |
| Count | 3–6 memories recommended |

---

## Asset Manifest

Central config at `src/data/assetManifest.ts`:

```ts
export const assetManifest = {
  models: {
    'world-house': '/assets/models/world-house.glb',
    // ...
  },
  textures: { /* ... */ },
  audio: { /* ... */ },
  preload: ['world-terrain', 'world-house', 'audio-ambient-space'], // critical
  lazy: ['mem-beach', 'mem-cafe', 'birthday-cake'],                 // on demand
};
```

---

## Compression & Optimization

| Type | Method |
|------|--------|
| GLB | Draco compression, meshopt |
| Textures | WebP, max 2048, mipmaps |
| Audio | MP3 128kbps + OGG fallback |
| HDR | PMREM pre-converted env maps |

---

## Placeholder → Final Swap Process

1. Build scene with placeholder (colored mesh + label)
2. Register final asset path in `assetManifest.ts`
3. No component code changes needed
4. Verify scale/position with dev tool

---

## Estimated Total Size Budget

| Category | Target |
|----------|--------|
| All models | < 15 MB |
| All textures | < 10 MB |
| All audio | < 8 MB |
| **Total initial load** | < 12 MB (preload only) |
| **Total experience** | < 35 MB |
