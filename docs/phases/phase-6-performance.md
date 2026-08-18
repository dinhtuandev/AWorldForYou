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

- [ ] Quality presets applied to all scenes
- [ ] Auto tier downgrade on low FPS
- [ ] Mobile touch works (orbit, tap interact)
- [ ] No WASD required on mobile
- [ ] Memory scenes lazy loaded
- [ ] Instancing for trees, fireflies, flowers
- [ ] 60fps desktop HIGH on all scenes
- [ ] 30fps mobile MEDIUM stable
- [ ] WebGL fallback page exists
- [ ] Initial load < 12MB (preload assets)

---

## Out of Scope

- CDN / hosting optimization
- Service worker / offline
- SSR

---

## Agent Notes (latest)

- **Agent:** —
- **Date:** —
- **Completed:** —
- **Blocked:** —
- **Next:** M6.1 Quality presets audit
