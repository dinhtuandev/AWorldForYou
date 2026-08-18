import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { experienceData } from '../../../data/experienceData';

export const LetterOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const mode = useExperienceStore((state) => state.mode);
  const setPhase = useExperienceStore((state) => state.setPhase);
  const letterLineIndex = useExperienceStore((state) => state.letterLineIndex);
  const advanceLetter = useExperienceStore((state) => state.advanceLetter);
  const resetLetter = useExperienceStore((state) => state.resetLetter);

  const [hasStartedReading, setHasStartedReading] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const totalLines = experienceData.letter.length;
  const isLastLine = letterLineIndex >= totalLines - 1;
  const currentLine = experienceData.letter[letterLineIndex] ?? '';

  // Calculate pause duration based on emotional weight of the line
  const getLinePauseDuration = (lineIdx: number, lineText: string): number => {
    // Final climax line
    if (lineIdx >= totalLines - 1) {
      return 3000;
    }
    // Emotional pivot / penultimate build-up line
    if (
      lineIdx === totalLines - 2 ||
      lineText.toLowerCase().includes('choose') ||
      lineText.toLowerCase().includes('thousand lifetimes')
    ) {
      return 4000;
    }
    // Standard reflective line
    return 2500;
  };

  // Reset when entering letter phase
  useEffect(() => {
    if (phase === 'letter') {
      resetLetter();
      setHasStartedReading(false);
    }
  }, [phase, resetLetter]);

  const handleNextPhase = useCallback(() => {
    const activeMode = mode || experienceData.mode;
    if (activeMode === 'birthday' && experienceData.birthday?.enabled !== false) {
      setPhase('birthday');
    } else if (activeMode === 'womensDay' && experienceData.womensDay?.enabled !== false) {
      setPhase('womensDay');
    } else {
      setPhase('final');
    }
  }, [mode, setPhase]);

  const handleNextLine = useCallback(() => {
    if (!hasStartedReading) {
      setHasStartedReading(true);
      return;
    }

    if (isLastLine) {
      handleNextPhase();
      return;
    }

    advanceLetter();
  }, [hasStartedReading, isLastLine, handleNextPhase, advanceLetter]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement | HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
        event.preventDefault();
        handleNextLine();
      }
    },
    [handleNextLine]
  );

  // Emotional auto-progress timer (2.5s normal, 4s pivot, 3s final)
  useEffect(() => {
    if (phase !== 'letter' || !hasStartedReading || !isAutoPlay) return;

    const pauseMs = getLinePauseDuration(letterLineIndex, currentLine);

    const timer = window.setTimeout(() => {
      if (isLastLine) {
        handleNextPhase();
      } else {
        advanceLetter();
      }
    }, pauseMs);

    return () => window.clearTimeout(timer);
  }, [
    phase,
    hasStartedReading,
    isAutoPlay,
    letterLineIndex,
    currentLine,
    isLastLine,
    advanceLetter,
    handleNextPhase,
  ]);

  if (phase !== 'letter') {
    return null;
  }

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Letter reading experience"
      onKeyDown={handleKeyDown}
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 md:p-12 outline-none select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full border border-amber-500/30 bg-neutral-950/60 px-3.5 py-1.5 text-xs font-light tracking-widest text-amber-200 backdrop-blur-md">
            Letter For {experienceData.girlfriendName}
          </div>
          {hasStartedReading && (
            <button
              type="button"
              tabIndex={0}
              aria-label={isAutoPlay ? 'Pause auto reading' : 'Resume auto reading'}
              aria-pressed={isAutoPlay}
              onClick={() => setIsAutoPlay((prev) => !prev)}
              className="pointer-events-auto rounded-full border border-white/15 bg-neutral-950/60 px-3 py-1.5 text-[11px] font-mono text-neutral-300 backdrop-blur-md transition-colors hover:text-white hover:border-amber-400/40 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
            >
              {isAutoPlay ? 'Auto: ON' : 'Auto: OFF'}
            </button>
          )}
        </div>

        {/* Progress indicator dots */}
        {hasStartedReading && (
          <div className="flex items-center gap-1.5">
            {experienceData.letter.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  idx === letterLineIndex
                    ? 'w-6 bg-amber-400'
                    : idx < letterLineIndex
                    ? 'w-1.5 bg-amber-400/50'
                    : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Letter Content Area */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {!hasStartedReading ? (
            <motion.div
              key="start-prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-md w-[90vw] rounded-2xl border border-amber-400/20 bg-neutral-950/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-amber-950/40"
            >
              <div className="mb-4 inline-block rounded-full bg-amber-500/10 p-3 text-amber-400">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-[clamp(1.25rem,4vw,1.75rem)] font-light tracking-wide text-white font-serif">
                A Letter for You
              </h2>
              <p className="mt-2 text-[clamp(0.75rem,2vw,0.875rem)] font-light leading-relaxed text-neutral-300">
                From {experienceData.senderName}
              </p>
              <button
                type="button"
                tabIndex={0}
                aria-label="Open and read letter"
                onClick={handleNextLine}
                className="pointer-events-auto mt-6 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-7 py-2.5 text-xs font-semibold tracking-wider text-neutral-950 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                Open Letter
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={letterLineIndex}
              initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl w-[90vw] px-8 py-7 text-center rounded-3xl border border-amber-400/30 bg-neutral-950/80 backdrop-blur-xl shadow-2xl shadow-neutral-950/90"
            >
              <p className="text-[clamp(1.15rem,3.8vw,2.1rem)] font-light leading-relaxed tracking-wide text-amber-50 font-serif drop-shadow-md">
                "{currentLine}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Controls */}
      {hasStartedReading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center gap-4"
        >
          <button
            type="button"
            tabIndex={0}
            aria-label={isLastLine ? 'Continue to next chapter' : 'Advance to next line'}
            onClick={handleNextLine}
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-amber-400/40 bg-neutral-950/70 px-6 py-2.5 text-xs font-medium tracking-wider text-amber-200 backdrop-blur-md transition-all duration-300 hover:border-amber-300 hover:bg-neutral-900/90 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          >
            <span>{isLastLine ? 'Continue' : 'Next'}</span>
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </motion.div>
      )}
    </div>
  );
};
