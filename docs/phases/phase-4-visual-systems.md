# Phase 4 — Visual Systems

## Agent Prompt

```markdown
Implement Phase 4 (Visual Systems) for AWFO.

Prerequisite: Phase 3 at least through M3.4 (WorldScene exists).

Read first:
- docs/07-performance-strategy.md (quality tiers)
- Tasks.md §3 Visual Quality, §18 Advanced Visual Features
- .cursor/rules/awfo.mdc

Enhance visuals with shaders and post-processing. All effects must be quality-gated.
Do NOT add effects that don't serve the experience.
```

---

## Goal

Premium cinematic WebGL visuals: post-processing, custom shaders, particle systems. Every effect tied to quality tier.

---

## M4.1 — PostProcessing

**File:** `src/components/effects/PostProcessing.tsx`

Using `@react-three/postprocessing`:

```tsx
<EffectComposer enabled={tier !== 'low'}>
  <Bloom intensity={tier === 'high' ? 0.3 : 0.15} ... />
  {tier === 'high' && <DepthOfField ... />}
  {tier !== 'low' && <Noise opacity={0.02} />}
  {tier === 'high' && <ChromaticAberration offset={[0.0005, 0.0005]} />}
</EffectComposer>
```

Read `qualityPresets` from `useQualityTier`. Half-resolution bloom on MEDIUM.

Wire into `Experience.tsx` — single composer for the Canvas.

---

## M4.2 — Water Shader

**File:** `src/components/effects/shaders/water.ts`

Apply to pond plane in `Pond.tsx`:

- Animated normal map UV scroll
- Simple fresnel for edge highlight
- Subtle vertex sine displacement for waves
- Uniforms: `uTime`, `uQuality` (reduce wave amplitude on LOW)

Fallback on LOW: static blue reflective material.

---

## M4.3 — Atmospheric Fog

**File:** `src/components/effects/shaders/fog.ts` or use Three.js `FogExp2`

- World scene: warm subtle fog (#1a1520)
- NightWalk memory: dark blue fog
- Final scene: lighter fog with firefly visibility

Distance adjusted per scene. Disable on LOW if FPS drops.

---

## M4.4 — Film Grain

Subtle post-processing noise (M4.1 `Noise` effect).

- opacity: 0.02 HIGH, 0.01 MEDIUM, 0 LOW
- Never overpower — "cinematic" not "vintage filter"

---

## M4.5 — ParticleSystem

**File:** `src/components/effects/ParticleSystem.tsx`

Reusable configurable emitter:

```tsx
<ParticleSystem
  count={100}
  spread={[10, 5, 10]}
  color="#ffd700"
  size={0.02}
  behavior="float" | "fall" | "firefly" | "wind"
  qualityScale={qualityPreset.particles}
/>
```

Used by:
- IntroScene (expanding particles)
- WorldScene (fireflies, ambient dust)
- BeachMemory (wind particles)
- BirthdayScene (smoke, fireworks)

Instanced `Points` for performance. Scale count by quality tier.

---

## M4.6 — Glass Heart Material

**File:** final scene heart mesh

Using `@react-three/drei` `MeshTransmissionMaterial` or custom shader:

- Translucent glass/crystal
- Subtle internal glow (emissive)
- Pulse: scale 1 → 1.03 sine loop
- Bloom picks up edges

Fallback LOW: emissive solid mesh with bloom.

---

## M4.7 — Emissive Materials

Interactive object glow + house windows:

```tsx
// HoverAffordance glow
material.emissive.lerp(targetColor, delta * 5);

// House windows
<meshStandardMaterial emissive="#ffaa44" emissiveIntensity={0.8} />
```

Street lamp bulb, timeline crystals, milestone orbs — consistent warm emissive palette.

---

## Visual Hierarchy Checklist

Before marking Phase 4 complete, verify per scene:

1. **Composition** — objects placed with intentional framing
2. **Lighting** — key light direction consistent
3. **Materials** — PBR where appropriate, not flat colors
4. **Camera** — sequences already from Phase 2/3
5. **Animation** — ambient life from Phase 3
6. **Post-processing** — last layer, subtle

---

## Acceptance Criteria

- [ ] PostProcessing quality-gated (HIGH/MEDIUM/LOW)
- [ ] Water shader on pond with animated waves
- [ ] Fog in world + night scenes
- [ ] Film grain subtle on HIGH/MEDIUM
- [ ] Reusable ParticleSystem with quality scaling
- [ ] Glass heart in final scene
- [ ] Emissive glow on interactive objects + windows
- [ ] 60fps on desktop HIGH with all effects
- [ ] No visual effect added without purpose

---

## Out of Scope

- New scenes
- Performance optimization beyond quality gating (Phase 6)
- Asset creation

---

## Agent Notes (latest)

- **Agent:** —
- **Date:** —
- **Completed:** —
- **Blocked:** —
- **Next:** M4.1 PostProcessing
