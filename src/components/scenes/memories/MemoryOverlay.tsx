import { useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { experienceData } from '../../../data/experienceData';

export const MemoryOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const activeMemoryId = useExperienceStore((state) => state.activeMemoryId);
  const exitMemory = useExperienceStore((state) => state.exitMemory);
  const enterMemory = useExperienceStore((state) => state.enterMemory);

  const activeMemoryIndex = experienceData.memories.findIndex(
    (item) => item.id === activeMemoryId
  );
  const activeMemory = experienceData.memories[activeMemoryIndex >= 0 ? activeMemoryIndex : 0];

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

  const handleNextMemory = useCallback(() => {
    const nextIdx = (activeMemoryIndex + 1) % experienceData.memories.length;
    enterMemory(experienceData.memories[nextIdx].id);
  }, [activeMemoryIndex, enterMemory]);

  if (phase !== 'memory' || !activeMemory) {
    return null;
  }

  return (
    <AnimatePresence>
      <div
        tabIndex={0}
        role="region"
        aria-label="Memory view overlay"
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-10 select-none outline-none"
      >
        {/* Top Header - Return & Timeline Stepper */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-between gap-3"
        >
          <button
            type="button"
            tabIndex={0}
            aria-label="Return to World Diorama"
            onClick={handleReturnClick}
            onKeyDown={handleReturnKeyDown}
            className="pointer-events-auto group flex items-center gap-2 rounded-full border border-amber-400/30 bg-neutral-950/70 px-4 py-2 text-xs font-medium tracking-wider text-amber-200 backdrop-blur-md transition-all duration-300 hover:border-amber-400 hover:bg-neutral-900/90 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            <svg
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Return to World</span>
          </button>

          {/* Date Stamp Tag */}
          <div className="rounded-full border border-amber-400/40 bg-neutral-950/70 px-4 py-1.5 text-xs font-mono font-medium tracking-widest text-amber-300 backdrop-blur-md">
            {activeMemory.date}
          </div>
        </motion.div>

        {/* Bottom Story Card with Couple Photo Thumbnail */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto max-w-xl w-[92vw] sm:w-[85vw]"
        >
          <div className="rounded-3xl border border-amber-400/30 bg-neutral-950/85 p-5 sm:p-6 backdrop-blur-xl shadow-2xl shadow-neutral-950/90 flex flex-col sm:flex-row items-center gap-5">
            {/* Couple Photo Frame Preview */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border border-amber-400/30 shrink-0 shadow-lg group">
              <img
                src={activeMemory.image}
                alt={activeMemory.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Memory Narrative */}
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium tracking-widest text-amber-400 uppercase mb-2">
                Shared Memory
              </div>
              <h1 className="text-[clamp(1.15rem,3.2vw,1.6rem)] font-light tracking-wide text-white font-serif">
                {activeMemory.title}
              </h1>
              <p className="mt-2 text-[clamp(0.8rem,2vw,0.92rem)] font-light leading-relaxed text-neutral-300">
                "{activeMemory.description}"
              </p>

              <div className="mt-4 flex items-center justify-center sm:justify-start gap-3">
                <button
                  type="button"
                  tabIndex={0}
                  aria-label="View next memory"
                  onClick={handleNextMemory}
                  className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 px-4 py-1.5 text-xs font-medium text-amber-200 transition-all duration-300 hover:bg-amber-400 hover:text-neutral-950 hover:scale-105"
                >
                  <span>Next Memory</span>
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
