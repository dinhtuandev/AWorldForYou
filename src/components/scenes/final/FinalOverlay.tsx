import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { experienceData } from '../../../data/experienceData';

export const FinalOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const resetExperience = useExperienceStore((state) => state.resetExperience);
  const setPhase = useExperienceStore((state) => state.setPhase);

  const [stepIndex, setStepIndex] = useState(0);

  const lines = [
    experienceData.finalScene.line1,
    experienceData.finalScene.line2,
    experienceData.finalScene.line3,
    experienceData.finalScene.closing,
  ];

  // Reset step progression when entering final phase
  useEffect(() => {
    if (phase === 'final') {
      setStepIndex(0);
    }
  }, [phase]);

  // Timed progression through ending lines
  useEffect(() => {
    if (phase !== 'final') return;

    const timer = setInterval(() => {
      setStepIndex((prev) => {
        if (prev < lines.length) {
          return prev + 1;
        }
        clearInterval(timer);
        return prev;
      });
    }, 4200);

    return () => clearInterval(timer);
  }, [phase, lines.length]);

  const handleReplayClick = useCallback(() => {
    resetExperience();
  }, [resetExperience]);

  const handleReplayKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleReplayClick();
      }
    },
    [handleReplayClick]
  );

  const handleExploreWorldClick = useCallback(() => {
    setPhase('world');
  }, [setPhase]);

  const handleExploreWorldKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleExploreWorldClick();
      }
    },
    [handleExploreWorldClick]
  );

  if (phase !== 'final') {
    return null;
  }

  const isFinalStep = stepIndex >= lines.length - 1;

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Final scene closing message"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none outline-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="rounded-full border border-rose-500/30 bg-neutral-950/60 px-4 py-1.5 text-xs font-light tracking-widest text-rose-200 backdrop-blur-md">
          A World For {experienceData.girlfriendName}
        </div>

        <div className="text-xs font-light tracking-widest text-neutral-400 font-mono">
          Forever & Always
        </div>
      </div>

      {/* Center Cinematic Typography */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {stepIndex < lines.length ? (
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl w-[90vw] px-8 py-7 text-center rounded-3xl border border-rose-500/30 bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-neutral-950/90"
            >
              <p
                className={`font-light leading-relaxed tracking-wide text-rose-50 font-serif drop-shadow-lg ${
                  stepIndex === lines.length - 1
                    ? 'text-[clamp(1.5rem,4.5vw,2.8rem)] text-rose-100'
                    : 'text-[clamp(1.15rem,3.8vw,2.2rem)]'
                }`}
              >
                "{lines[stepIndex]}"
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="closing-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="max-w-lg w-[90vw] rounded-2xl border border-rose-500/20 bg-neutral-950/75 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-rose-950/40"
            >
              <h1 className="text-[clamp(1.4rem,4.2vw,2.1rem)] font-light tracking-wide text-white font-serif">
                "{experienceData.finalScene.closing}"
              </h1>
              <p className="mt-4 text-[clamp(0.7rem,1.8vw,0.85rem)] font-light tracking-widest text-rose-300 uppercase">
                With all my love, {experienceData.senderName}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Affordances */}
      {isFinalStep && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            type="button"
            tabIndex={0}
            aria-label="Replay experience from beginning"
            onClick={handleReplayClick}
            onKeyDown={handleReplayKeyDown}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-xs font-semibold tracking-wider text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 hover:shadow-rose-500/50 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Replay Experience</span>
          </button>

          <button
            type="button"
            tabIndex={0}
            aria-label="Explore world diorama freely"
            onClick={handleExploreWorldClick}
            onKeyDown={handleExploreWorldKeyDown}
            className="pointer-events-auto rounded-full border border-white/20 bg-neutral-950/60 px-5 py-2.5 text-xs font-medium tracking-wider text-neutral-300 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Explore World
          </button>
        </motion.div>
      )}
    </div>
  );
};
