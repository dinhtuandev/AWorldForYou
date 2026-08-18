import { useEffect, useState, useRef } from 'react';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useAssetProgress } from '../../hooks/useAssetProgress';
import { experienceData } from '../../data/experienceData';

export const LoadingScene = () => {
  const phase = useExperienceStore((state) => state.phase);
  const setPhase = useExperienceStore((state) => state.setPhase);
  const { progress, isReady } = useAssetProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasTriggeredTransition = useRef(false);

  // Smoothly interpolate progress
  useEffect(() => {
    if (phase !== 'loading') return;

    const targetProgress = isReady ? 1 : Math.max(progress, 0.2);
    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        if (prev >= 0.99 || prev >= targetProgress) {
          if (targetProgress >= 1) {
            setIsDone(true);
            return 1;
          }
          return prev;
        }
        const step = Math.max(0.04, (targetProgress - prev) * 0.2);
        const next = Math.min(targetProgress, prev + step);
        if (next >= 0.99) {
          setIsDone(true);
          return 1;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [progress, isReady, phase]);

  // Guaranteed transition to intro
  useEffect(() => {
    if (!isDone || phase !== 'loading' || hasTriggeredTransition.current) return;
    hasTriggeredTransition.current = true;

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 400);

    const doneTimer = setTimeout(() => {
      setPhase('intro');
      setIsFadingOut(false);
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [isDone, phase, setPhase]);

  if (phase !== 'loading' && !isFadingOut) {
    return null;
  }

  const percentage = Math.round(displayProgress * 100);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 text-neutral-100 transition-opacity duration-700 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle background radial ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-neutral-950/80 to-neutral-950 pointer-events-none" />

      {/* Central glowing core / orbital spinner */}
      <div className="relative flex items-center justify-center mb-10">
        <div className="w-16 h-16 rounded-full border border-amber-200/20 animate-[spin_8s_linear_infinite]" />
        <div className="absolute w-10 h-10 rounded-full border border-amber-300/30 border-t-amber-100 animate-[spin_3s_ease-in-out_infinite]" />
        <div className="absolute w-2 h-2 rounded-full bg-amber-100 shadow-[0_0_15px_#fde68a] animate-pulse" />
      </div>

      {/* Status Typography */}
      <div className="relative z-10 text-center space-y-3 px-6">
        <p className="text-sm md:text-base font-light tracking-[0.25em] text-neutral-300 transition-all duration-500">
          {isDone ? experienceData.loading.ready : experienceData.loading.building}
        </p>

        {/* Minimal hairline progress indicator */}
        <div className="w-48 md:w-64 h-[2px] mx-auto bg-neutral-800/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-200/40 via-amber-100 to-amber-200/40 transition-all duration-200 ease-out shadow-[0_0_8px_rgba(253,230,138,0.5)]"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
