import { useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../experience/ExperienceState';
import { experienceData } from '../../data/experienceData';
import { useCameraDirector } from '../../experience/CameraDirector';

export const TimelineOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const activeMilestoneId = useExperienceStore((state) => state.activeMilestoneId);
  const selectMilestone = useExperienceStore((state) => state.selectMilestone);
  const enterMemory = useExperienceStore((state) => state.enterMemory);
  const { playSequence } = useCameraDirector();

  const activeMilestone = experienceData.timeline.find(
    (item) => item.id === activeMilestoneId
  );

  const linkedMemory = activeMilestone?.memoryId
    ? experienceData.memories.find((mem) => mem.id === activeMilestone.memoryId)
    : undefined;

  const handleClose = useCallback(() => {
    selectMilestone('');
    playSequence({
      id: 'timeline-overview-return',
      keyframes: [
        {
          position: [6, 4, 10],
          target: [0, 1.5, 0],
          duration: 2.0,
          ease: 'power2.inOut',
        },
      ],
    });
  }, [selectMilestone, playSequence]);

  const handleCloseKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClose();
      }
    },
    [handleClose]
  );

  const handleEnterMemory = useCallback(() => {
    if (!linkedMemory) return;
    enterMemory(linkedMemory.id);
  }, [linkedMemory, enterMemory]);

  const handleEnterMemoryKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleEnterMemory();
      }
    },
    [handleEnterMemory]
  );

  if (!activeMilestone || (phase !== 'world' && phase !== 'timeline')) {
    return null;
  }

  return (
    <AnimatePresence>
      <div
        tabIndex={0}
        role="region"
        aria-label="Milestone detail overlay"
        className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none outline-none"
      >
        {/* Top Bar with Return button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <button
            type="button"
            tabIndex={0}
            aria-label="Return to World Overview"
            onClick={handleClose}
            onKeyDown={handleCloseKeyDown}
            className="pointer-events-auto group flex items-center gap-2 rounded-full border border-sky-400/30 bg-neutral-950/60 px-4 py-2 text-xs font-medium tracking-wider text-sky-200 backdrop-blur-md transition-all duration-300 hover:border-sky-300 hover:bg-neutral-900/80 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-400/50"
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
            <span>World Overview</span>
          </button>

          {/* Milestone Badge */}
          <div className="rounded-full border border-sky-400/40 bg-sky-950/60 px-4 py-1.5 text-xs font-mono font-medium tracking-widest text-sky-300 backdrop-blur-md shadow-lg shadow-sky-950/50">
            {activeMilestone.date}
          </div>
        </motion.div>

        {/* Milestone Detail Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.96 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-md w-[90vw] text-center"
        >
          <div className="rounded-2xl border border-sky-400/20 bg-neutral-950/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-sky-900/30">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 px-3 py-1 text-[11px] font-medium tracking-widest text-sky-400 uppercase mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
              Timeline Milestone
            </div>

            <h2 className="text-[clamp(1.25rem,4vw,1.875rem)] font-light tracking-wide text-white font-serif">
              {activeMilestone.label}
            </h2>

            {linkedMemory && (
              <p className="mt-3 text-[clamp(0.85rem,2.5vw,1rem)] font-light leading-relaxed text-neutral-300">
                "{linkedMemory.description}"
              </p>
            )}

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {linkedMemory && (
                <button
                  type="button"
                  tabIndex={0}
                  aria-label={`Enter memory: ${linkedMemory.title}`}
                  onClick={handleEnterMemory}
                  onKeyDown={handleEnterMemoryKeyDown}
                  className="pointer-events-auto rounded-full bg-gradient-to-r from-sky-400 to-sky-500 px-5 py-2.5 text-xs font-semibold tracking-wider text-neutral-950 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-sky-500/40 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  Enter Memory
                </button>
              )}

              <button
                type="button"
                tabIndex={0}
                aria-label="Close milestone detail"
                onClick={handleClose}
                onKeyDown={handleCloseKeyDown}
                className="pointer-events-auto rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-medium tracking-wider text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
