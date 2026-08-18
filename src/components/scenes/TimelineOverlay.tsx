import { useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../experience/ExperienceState';
import { experienceData } from '../../data/experienceData';
import { useCameraDirector } from '../../experience/CameraDirector';
import { createApproachSequence } from '../../data/cameraSequences';

export const TimelineOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const activeMilestoneId = useExperienceStore((state) => state.activeMilestoneId);
  const selectMilestone = useExperienceStore((state) => state.selectMilestone);
  const enterMemory = useExperienceStore((state) => state.enterMemory);
  const setPhase = useExperienceStore((state) => state.setPhase);
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
          position: [6.8, 6.5, 9.0],
          target: [0, 0.7, 0],
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

  const handleStepClick = useCallback(
    (milestoneId: string, worldPos: [number, number, number]) => {
      selectMilestone(milestoneId);
      const seq = createApproachSequence(`approach-${milestoneId}`, worldPos, [1.4, 1.0, 2.0]);
      playSequence(seq);
    },
    [selectMilestone, playSequence]
  );

  const handleLetterStepClick = useCallback(() => {
    selectMilestone('');
    setPhase('letter');
  }, [selectMilestone, setPhase]);

  if (phase !== 'world' && phase !== 'timeline') {
    return null;
  }

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Story Timeline and Milestones"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-4 sm:p-6 md:p-8 select-none outline-none"
    >
      {/* Top Bar with Return button when a milestone is active */}
      <AnimatePresence>
        {activeMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <button
              type="button"
              tabIndex={0}
              aria-label="Return to World Overview"
              onClick={handleClose}
              onKeyDown={handleCloseKeyDown}
              className="pointer-events-auto group flex items-center gap-2 rounded-full border border-amber-400/30 bg-neutral-950/70 px-4 py-2 text-xs font-medium tracking-wider text-amber-200 backdrop-blur-md transition-all duration-300 hover:border-amber-300 hover:bg-neutral-900/90 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
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
              <span>Overview</span>
            </button>

            <div className="rounded-full border border-amber-400/40 bg-neutral-950/70 px-4 py-1.5 text-xs font-mono font-medium tracking-widest text-amber-300 backdrop-blur-md">
              {activeMilestone.date}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Milestone Detail Card with Couple Photo */}
      <AnimatePresence>
        {activeMilestone && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-lg w-[90vw] text-center my-auto"
          >
            <div className="rounded-3xl border border-amber-400/30 bg-neutral-950/85 p-5 sm:p-7 backdrop-blur-xl shadow-2xl shadow-neutral-950/90 flex flex-col items-center">
              {/* Couple / Girlfriend Photo Preview */}
              {linkedMemory && (
                <div className="relative w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-amber-400/20 mb-4 shadow-lg group">
                  <img
                    src={linkedMemory.image}
                    alt={linkedMemory.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-amber-200/90 font-mono">
                    <span>{linkedMemory.date}</span>
                    <span className="capitalize">{linkedMemory.scene} scene</span>
                  </div>
                </div>
              )}

              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-medium tracking-widest text-amber-400 uppercase mb-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                Our Story Milestone
              </div>

              <h2 className="text-[clamp(1.2rem,3.8vw,1.75rem)] font-light tracking-wide text-white font-serif">
                {activeMilestone.label}
              </h2>

              {linkedMemory && (
                <p className="mt-2.5 text-[clamp(0.85rem,2.4vw,0.95rem)] font-light leading-relaxed text-neutral-300">
                  "{linkedMemory.description}"
                </p>
              )}

              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                {linkedMemory && (
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label={`Enter 3D memory environment: ${linkedMemory.title}`}
                    onClick={handleEnterMemory}
                    onKeyDown={handleEnterMemoryKeyDown}
                    className="pointer-events-auto w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-6 py-2.5 text-xs font-semibold tracking-wider text-neutral-950 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  >
                    Enter 3D Memory
                  </button>
                )}

                <button
                  type="button"
                  tabIndex={0}
                  aria-label="Close milestone detail"
                  onClick={handleClose}
                  onKeyDown={handleCloseKeyDown}
                  className="pointer-events-auto w-full sm:w-auto rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-medium tracking-wider text-neutral-300 transition-all duration-300 hover:bg-white/10 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Chronological Story Journey Stepper */}
      {!activeMilestone && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto max-w-4xl w-[95vw] sm:w-[90vw]"
        >
          <div className="rounded-2xl border border-amber-400/25 bg-neutral-950/80 px-4 py-3 sm:px-6 sm:py-3.5 backdrop-blur-xl shadow-2xl shadow-neutral-950/90 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-serif font-normal tracking-wider text-amber-200">
                Our Story Timeline
              </span>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
              {experienceData.timeline.map((m, idx) => {
                const isActive = activeMilestoneId === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    tabIndex={0}
                    aria-label={`Go to step ${idx + 1}: ${m.label}`}
                    onClick={() => handleStepClick(m.id, m.worldPosition)}
                    className={`pointer-events-auto flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all duration-300 whitespace-nowrap ${
                      isActive
                        ? 'bg-amber-400 text-neutral-950 font-semibold shadow-md shadow-amber-400/30 scale-105'
                        : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 hover:text-amber-200 border border-white/10'
                    }`}
                  >
                    <span className="text-[10px] font-mono opacity-70">{m.date}</span>
                    <span className="hidden sm:inline font-light">{m.label}</span>
                  </button>
                );
              })}

              {/* Final Love Letter Station */}
              <button
                type="button"
                tabIndex={0}
                aria-label="Open Love Letter"
                onClick={handleLetterStepClick}
                className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-rose-500/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
              >
                <span>💌</span>
                <span>Love Letter</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
