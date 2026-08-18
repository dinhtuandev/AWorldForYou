import { useEffect, lazy, Suspense } from 'react';
import { useExperienceStore } from './ExperienceState';
import { SceneTransition } from './SceneTransition';
import { IntroScene } from '../components/scenes/IntroScene';
import { WorldScene } from '../components/scenes/WorldScene';

// Code-split & lazy load non-initial scenes to optimize bundle size and memory
const MemoryScene = lazy(() =>
  import('../components/scenes/MemoryScene').then((m) => ({ default: m.MemoryScene }))
);
const LetterScene = lazy(() =>
  import('../components/scenes/LetterScene').then((m) => ({ default: m.LetterScene }))
);
const BirthdayScene = lazy(() =>
  import('../components/scenes/BirthdayScene').then((m) => ({ default: m.BirthdayScene }))
);
const WomensDayScene = lazy(() =>
  import('../components/scenes/WomensDayScene').then((m) => ({ default: m.WomensDayScene }))
);
const FinalScene = lazy(() =>
  import('../components/scenes/FinalScene').then((m) => ({ default: m.FinalScene }))
);

export const SceneManager = () => {
  const phase = useExperienceStore((state) => state.phase);
  const setTransitioning = useExperienceStore((state) => state.setTransitioning);

  useEffect(() => {
    // Clear transitioning state after crossfade window
    const timer = window.setTimeout(() => {
      setTransitioning(false);
    }, 600);

    return () => window.clearTimeout(timer);
  }, [phase, setTransitioning]);

  return (
    <>
      <SceneTransition isActive={phase === 'intro'}>
        <IntroScene />
      </SceneTransition>

      <SceneTransition isActive={phase === 'world' || phase === 'timeline'}>
        <WorldScene />
      </SceneTransition>

      <Suspense fallback={null}>
        <SceneTransition isActive={phase === 'memory'}>
          <MemoryScene />
        </SceneTransition>

        <SceneTransition isActive={phase === 'letter'}>
          <LetterScene />
        </SceneTransition>

        <SceneTransition isActive={phase === 'birthday'}>
          <BirthdayScene />
        </SceneTransition>

        <SceneTransition isActive={phase === 'womensDay'}>
          <WomensDayScene />
        </SceneTransition>

        <SceneTransition isActive={phase === 'final'}>
          <FinalScene />
        </SceneTransition>
      </Suspense>
    </>
  );
};
