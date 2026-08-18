import { useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { experienceData } from '../../../data/experienceData';

export const MemoryOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const activeMemoryId = useExperienceStore((state) => state.activeMemoryId);
  const exitMemory = useExperienceStore((state) => state.exitMemory);

  const activeMemory = experienceData.memories.find(
    (item) => item.id === activeMemoryId
  ) ?? experienceData.memories[0];

  const handleReturnClick = useCallback(() => {
    exitMemory();
  }, [exitMemory]);

  const handleReturnKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        exitMemory();
      }
    },
    [exitMemory]
  );

  if (phase !== 'memory' || !activeMemory) {
    return null;
  }

  return (
    <AnimatePresence>
      <div
        tabIndex={0}
        role="region"
        aria-label="Memory view overlay"
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none outline-none"
      >
        {/* Top Header - Return Affordance */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <button
            type="button"
            tabIndex={0}
            aria-label="Return to World Diorama"
            onClick={handleReturnClick}
            onKeyDown={handleReturnKeyDown}
            className="pointer-events-auto group flex items-center gap-2.5 rounded-full border border-white/20 bg-neutral-950/60 px-4 py-2 text-xs font-medium tracking-wider text-neutral-200 backdrop-blur-md transition-all duration-300 hover:border-amber-400/60 hover:bg-neutral-900/80 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span>Return to World</span>
          </button>

          {/* Date Stamp Tag */}
          <div className="rounded-full border border-white/10 bg-neutral-950/60 px-3.5 py-1.5 text-xs font-mono font-light tracking-widest text-neutral-300 backdrop-blur-sm">
            {activeMemory.date}
          </div>
        </motion.div>

        {/* Bottom Story Snippet */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 1.0, delay: 0.5 }}
          className="mx-auto max-w-xl w-[90vw] text-center"
        >
          <div className="rounded-2xl border border-white/10 bg-neutral-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
            <p className="text-xs font-medium tracking-widest text-amber-300/80 uppercase mb-2">
              Shared Memory
            </p>
            <h1 className="text-[clamp(1.25rem,4vw,1.875rem)] font-light tracking-wide text-white font-serif">
              {activeMemory.title}
            </h1>
            <p className="mt-3 text-[clamp(0.85rem,2.5vw,1rem)] font-light leading-relaxed text-neutral-300">
              "{activeMemory.description}"
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
