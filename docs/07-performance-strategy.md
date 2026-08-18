# Performance Strategy

> Quality tiers, mobile adaptation, and optimization checklist.

## Targets

| Platform | FPS Target | Priority |
|----------|------------|----------|
| Desktop (mid-range GPU) | 60 FPS | Visual quality |
| Desktop (integrated GPU) | 45+ FPS | Balanced |
| Mobile (modern) | 30 FPS stable | Stability |
| Mobile (older) | 24 FPS stable | Minimum viable |

**Rule:** Never ship beautiful screenshots at 15 FPS.

---

## Quality Tier System

### Auto-Detection (`useQualityTier`)

```ts
function detectQualityTier(): QualityTier {
  const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  const dpr = window.devicePixelRatio;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (isMobile) return dpr > 2 ? 'medium' : 'low';
  if (cores >= 8 && dpr <= 2) return 'high';
  if (cores >= 4) return 'medium';
  return 'low';
}
```

Manual override via `?quality=high|medium|low` or dev HUD.

### Tier Presets

| Setting | HIGH | MEDIUM | LOW |
|---------|------|--------|-----|
| DPR max | 2.0 | 1.5 | 1.0 |
| Shadow map | 2048 PCF | 1024 Basic | Off |
| Post-processing | Bloom + DoF + Grain + CA | Bloom + DoF | Bloom only |
| Shadow casters | All | House + trees | None |
| Particle count | 100% | 50% | 25% |
| Fireflies | 30 | 15 | 5 |
| Clouds | 3 meshes | 2 meshes | 1 baked |
| Memory env detail | Full | Reduced | Minimal |
| Antialiasing | MSAA + FXAA | FXAA | None |
| Texture max | 2048 | 1024 | 512 |
| Instancing | Yes | Yes | Yes |

---

## Loading Strategy

### Preload (before intro)

Critical for first paint:
- World terrain + house (placeholder OK)
- Intro particle shader
- Ambient audio (1 track)
- HDRI env map (low res)

### Lazy Load (on demand)

- Memory environment GLBs (when object hovered or clicked)
- Birthday cake
- WomensDay flower variants
- Final heart model

### Progressive

```ts
// AssetManager
async preloadCritical(): Promise<void>   // → loading scene progress
async preloadWorld(): Promise<void>      // during intro
async loadMemory(id: string): Promise<void>  // on interact
```

---

## Optimization Techniques

### Geometry

- [ ] Instancing for trees, flowers, fireflies
- [ ] LOD for distant mountains (3 levels or simple fade)
- [ ] Merge static world geometry where possible
- [ ] Draco-compressed GLB

### Materials

- [ ] Share materials across instances
- [ ] Bake ambient occlusion where static
- [ ] Limit unique PBR materials to ~10 in world scene

### Rendering

- [ ] `frustumCulled` on all objects
- [ ] Visibility toggle for off-screen memory scenes
- [ ] `dpr={[1, maxDpr]}` on Canvas
- [ ] `performance={{ min: 0.5 }}` R3F adaptive

### Post-Processing

- [ ] Half-resolution bloom on MEDIUM/LOW
- [ ] DoF disabled on LOW
- [ ] Single EffectComposer pass

### React

- [ ] Memoize static world components
- [ ] Avoid state updates in useFrame unless necessary
- [ ] Dynamic import for memory scenes: `lazy(() => import('./memories/BeachMemory'))`

---

## Mobile-Specific

| Area | Adaptation |
|------|------------|
| Controls | Touch orbit only, no WASD |
| Hit radius | 1.5× desktop |
| Text size | Larger cinematic text |
| Camera FOV | 75° (vs 60° desktop) |
| Post-processing | MEDIUM or LOW only |
| Shadows | Off on LOW |
| Memory portal | Shorter transition (4s vs 6s) |

### Touch

- Single tap = interact
- Two-finger = orbit/pinch zoom
- No hover affordance — brief glow on tap proximity

---

## Memory Management

- Dispose geometries/materials on scene unmount
- Howler unload tracks not in current layer
- Texture dispose when memory scene exits
- Limit concurrent loaded memory envs to 1

---

## Monitoring (Dev)

```tsx
// DevTools.tsx
- FPS counter (stats.js)
- Draw calls / triangles
- Current quality tier
- Loaded assets list
- GPU info
```

---

## Performance Checklist (Per Scene)

Before marking a scene complete:

- [ ] 60fps on desktop HIGH
- [ ] 45fps on desktop MEDIUM
- [ ] 30fps on mobile MEDIUM
- [ ] No memory leak after 5 scene transitions
- [ ] Load time < 8s on 4G for critical assets
- [ ] No jank during camera sequences

---

## Fallbacks

| Feature | Fallback |
|---------|----------|
| WebGL unsupported | Static image + text experience (minimal) |
| Mic unavailable | Tap to blow candles |
| Slow load | Extended loading scene with reassuring text |
| Very low FPS | Auto-downgrade quality tier |

---

## Bundle Size

| Target | Size |
|--------|------|
| JS bundle (gzip) | < 500 KB |
| Initial preload assets | < 12 MB |
| Per memory env | < 5 MB |

Use Vite code splitting for memory scenes and mode-specific scenes (birthday, womensDay).
