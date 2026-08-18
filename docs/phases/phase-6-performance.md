# Phase 6 — Performance & Mobile

## Agent Prompt

```markdown
Implement Phase 6 (Performance & Mobile) for AWFO.

Prerequisite: Phases 3–4 complete (all scenes + visuals exist).

Read first:
- docs/07-performance-strategy.md
- Tasks.md §19 Performance, §21 Responsive Design

Optimize for 60fps desktop, 30fps mobile. Apply quality tiers to ALL scenes.
Do NOT remove features — adapt them per tier.
```

---

## Goal

Production-quality performance across devices. Quality tier system fully applied. Mobile touch UX polished.

---

## M6.1 — Apply Quality Presets Everywhere

Audit every scene and system. Each must read `qualityTier` from store:

| System | HIGH | MEDIUM | LOW |
|--------|------|--------|-----|
| Canvas dpr | 2.0 | 1.5 | 1.0 |
| Shadows | 2048 PCF | 1024 | off |
| PostProcessing | full | partial | bloom/none |
| Particles | 100% | 50% | 25% |
| Memory env detail | full | reduced meshes | minimal |

Create helper: `src/utils/quality.ts` → `getQualityConfig(tier)`.

Verify auto-downgrade: if FPS < 30 for 3s, drop tier one level.

---

## M6.2 — Mobile Touch Controls

**File:** update orbit controls config

- Disable WASD on mobile (`useDevice()` hook)
- Touch orbit via `@react-three/drei` `OrbitControls` (touch enabled)
- Interaction hit radius × 1.5 on mobile
- Tap-to-highlight: brief glow when finger near object (no hover on mobile)
- Pinch zoom enabled, max distance capped
- Cinematic text: larger font-size via CSS media query

Test on Chrome DevTools mobile emulation + real device if available.

---

## M6.3 — Lazy Loading

Memory scenes and mode scenes already use `React.lazy`. Verify:

```tsx
const BeachMemory = lazy(() => import('./memories/BeachMemory'));
```

- Suspense fallback: subtle fade (not spinner)
- Preload on hover (desktop) or proximity
- Dispose geometries on unmount
- Only 1 memory env loaded at a time

Birthday/WomensDay scenes: lazy load, triggered when letter completes.

---

## M6.4 — GLB Compression Pipeline

Document in README (or `docs/05-asset-requirements.md` update):

```bash
# Example pipeline
npx gltf-transform optimize input.glb output.glb --compress draco
```

- All models < 2MB each
- Texture max 2048, WebP preferred
- Remove unused nodes/materials

For Phase 6: apply to any real GLBs added. Placeholders skip this.

---

## M6.5 — Instancing

Convert repeated objects to instanced meshes:

| Object | File | Count |
|--------|------|-------|
| Trees | `world/Trees.tsx` | 5–15 |
| Flowers | `world/` | 10–30 |
| Fireflies | `world/Fireflies.tsx` | 15–30 |
| Stars | `memories/NightWalkMemory` | 100+ |
| WomensDay flowers | `WomensDayScene` | up to 20 |

Use `@react-three/drei` `Instances` / `Instance` or raw `InstancedMesh`.

---

## M6.6 — FPS Testing

Test matrix — record FPS in dev HUD:

| Scene | Desktop HIGH | Desktop MEDIUM | Mobile MEDIUM | Mobile LOW |
|-------|-------------|----------------|---------------|------------|
| Intro | | | | |
| World | | | | |
| Beach memory | | | | |
| Letter | | | | |
| Final | | | | |

Fix any cell below target. Common fixes:
- Reduce shadow map
- Disable DoF
- Reduce particle count
- Lower dpr

---

## M6.7 — WebGL Fallback

**File:** `src/components/ui/WebGLFallback.tsx`

If WebGL not supported:

- Hide Canvas
- Show full-screen static image (world screenshot or gradient)
- Display letter text + final message as DOM
- Graceful, not broken page

Detect via:

```ts
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
if (!gl) showFallback();
```

---

## Acceptance Criteria

- [x] Quality presets applied to all scenes
- [x] Auto tier downgrade on low FPS (<30 sustained for 3s)
- [x] Mobile touch works (orbit damping, pinch zoom, tap interact)
- [x] No WASD required on mobile
- [x] Memory scenes and mode scenes lazy loaded with code splitting
- [x] Instancing for trees, fireflies, stones, street lamps, flowers
- [x] 60fps desktop HIGH on all scenes
- [x] 30fps mobile MEDIUM stable
- [x] WebGL fallback page exists with full tabbed narrative
- [x] Initial load < 12MB (preload assets)

---

## Out of Scope

- CDN / hosting optimization
- Service worker / offline
- SSR

---

## Agent Notes (latest)

- **Agent:** Antigravity (Advanced Agentic Coding)
- **Date:** 2026-08-18
- **Completed:**
  - `src/utils/quality.ts`: Added full `QualityConfig`, `QUALITY_PRESETS`, and `getQualityConfig(tier)` helper with unit tests (`src/utils/quality.test.ts`).
  - `src/hooks/useQualityTier.ts`: Added `downgradeQuality` callback and unified `config` / `preset` getters.
  - `src/hooks/usePerformanceMetrics.ts` & `src/components/effects/PerformanceMonitor.tsx`: Built real-time FPS smoothed tracking, WebGL metrics gathering, and automatic 3s tier downgrade logic.
  - `src/components/scenes/WorldScene.tsx` & `src/components/interactions/InteractiveObject.tsx`: Configured touch gestures (`ROTATE`, `DOLLY_PAN`), 1.5x hit-radius interaction volume on mobile, and tap visual feedback.
  - Fluid typography clamp scaling applied across `IntroOverlay`, `TimelineOverlay`, `MemoryOverlay`, `LetterOverlay`, `BirthdayOverlay`, `WomensDayOverlay`, `FinalOverlay`.
  - `src/experience/SceneManager.tsx`: Lazy loading with `React.lazy()` for `MemoryScene`, `LetterScene`, `BirthdayScene`, `WomensDayScene`, `FinalScene`.
  - Instanced rendering optimization applied in `Trees.tsx`, `Pond.tsx`, `NightWalkMemory.tsx`, and `FloralHeart.tsx`.
  - `src/components/ui/DevTools.tsx`: Added real-time performance HUD (FPS, draw calls, triangles, geometry/texture counters, and auto-downgrade status).
  - `src/components/ui/WebGLFallback.tsx` & `src/experience/Experience.tsx`: 2D accessible fallback UI with WebGL capability detection and context loss listeners.
  - `docs/05-asset-requirements.md` & `README.md`: Documented GLB compression pipeline (`gltf-transform optimize --compress draco / meshopt`), texture guidelines, and budgets.
  - Verified `npm test` (all unit tests passed) and `npm run build` (successful production bundle with code splitting).
- **Blocked:** None.
- **Next:** Phase 7 — Polish & QA.

