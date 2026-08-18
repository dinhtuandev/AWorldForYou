# Phase 7 — Polish & QA

## Agent Prompt

```markdown
Implement Phase 7 (Polish & QA) for AWFO.

Prerequisite: Phases 1–6 complete.

Read first:
- docs/02-scene-map.md (acceptance criteria per scene)
- Tasks.md §15 Music, §17 Interaction Philosophy
- docs/TASKS-BREAKDOWN.md (verify all boxes)

Final polish pass. Fix inconsistencies, complete full playthrough testing.
Do NOT add new features — polish existing ones.
```

---

## Goal

Ship-ready experience. Full playthrough smooth on desktop + mobile. All transitions polished.

---

## M7.1 — Audio Crossfade Polish

Audit every phase transition:

| Transition | From Layer | To Layer | Duration |
|------------|-----------|----------|----------|
| loading → intro | none | intro | fade in 2s |
| intro → world | intro | world | crossfade 2s |
| world → memory | world | memory | crossfade 2s |
| memory → world | memory | world | crossfade 2s |
| world → letter | world | letter | crossfade 2.5s |
| letter → final/birthday | letter | ending/birthday | crossfade 2s |
| → final | any | ending | crescendo 3s |

Fix any abrupt cuts. Ensure `userHasInteracted` gate still respected.

Add subtle `AudioControl` UI (tiny mute icon, bottom corner, fades when idle).

---

## M7.2 — Camera Easing Audit

Replay every sequence from `cameraSequences.ts`:

- [ ] No linear camera moves (except orbit loop)
- [ ] No jerk between sequences (store last position)
- [ ] lookAt reaches target before sequence ends
- [ ] DoF transitions smooth (no pop)
- [ ] Mobile FOV wider (75°) — verify framing still good
- [ ] Interrupt mid-sequence → clean reset

Adjust easing/durations as needed. Document changes in `cameraSequences.ts`.

---

## M7.3 — Letter Pause Timing

**File:** `LetterScene.tsx`

Tune pauses between letter lines:

| Line Type | Pause |
|-----------|-------|
| Normal line | 2.5s |
| "And if I could choose again..." | 4s (long pause) |
| Final "I'd still choose you." | 3s then transition |

Optional: click/tap to advance early (skip pause).

Text animation: fade in per line, not typewriter.

---

## M7.4 — Birthday Mic Fallback

**File:** `BirthdayScene.tsx`

Primary: Web Audio API microphone blow detection (volume threshold).

Fallback chain:
1. Mic available → blow to extinguish
2. Mic denied/unavailable → show subtle "Tap the candles" hint
3. Tap each candle → flame out individually
4. All out → fireworks sequence

Never block the experience on mic permission.

---

## M7.5 — Responsive Text

**File:** `src/components/ui/CinematicText.tsx`

DOM overlay for all cinematic text:

```css
.cinematic-text {
  font-size: clamp(1rem, 3vw, 1.5rem);
  max-width: 80vw;
  text-align: center;
}
```

Test on:
- Desktop 1920×1080
- Tablet 768×1024
- Mobile 375×667

No text overflow or clipping.

---

## M7.6 — Full Playthrough Test

Test ALL three modes end-to-end:

### Default Mode
```text
loading → intro → click → world → interact memory → exit →
find letter → read → final scene → end
```

### Birthday Mode
```text
... → letter → birthday cake → blow/tap → fireworks → final → end
```

### WomensDay Mode
```text
... → letter → garden → plant flowers → aerial heart → final → end
```

Record issues. Fix before marking complete.

Also test:
- Dev HUD phase jumper still works
- Back button / refresh → reasonable state (loading restart OK)
- Tab backgrounded → audio pauses

---

## M7.7 — Production Build

```bash
npm run build
npm run preview
```

Verify:
- [ ] Zero build errors/warnings
- [ ] Bundle size JS gzip < 500KB
- [ ] All assets load from correct paths
- [ ] DevTools NOT visible in production
- [ ] No console errors during full playthrough
- [ ] `.env` / secrets not in bundle

Update README with build + deploy instructions.

---

## Final Quality Checklist

From Tasks.md §25:

- [ ] Feels like "a tiny universe" not "a developer's website"
- [ ] No generic Valentine's template aesthetics
- [ ] No floating heart spam
- [ ] No HTML modals for memories
- [ ] Interactions have purpose (curiosity → reward)
- [ ] Visual hierarchy respected
- [ ] Performance targets met
- [ ] Personalization works via one data file
- [ ] Experience memorable and emotional

---

## Acceptance Criteria

- [ ] Audio transitions smooth everywhere
- [ ] Camera sequences polished
- [ ] Letter timing feels intentional
- [ ] Birthday mic fallback works
- [ ] Text responsive on all devices
- [ ] Full playthrough passes all 3 modes
- [ ] Production build clean
- [ ] README complete with setup + personalize + deploy

---

## Out of Scope

- Hosting deployment (user choice)
- Analytics
- SEO optimization
- Additional memory environments beyond data file

---

## Agent Notes (latest)

- **Agent:** —
- **Date:** —
- **Completed:** —
- **Blocked:** —
- **Next:** M7.1 Audio polish
