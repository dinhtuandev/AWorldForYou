import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { experienceData } from '../../../data/experienceData';

const TOTAL_FLOWERS = 18;

export const WomensDayOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const setPhase = useExperienceStore((state) => state.setPhase);
  const [plantedCount, setPlantedCount] = useState(1);

  const isComplete = plantedCount >= TOTAL_FLOWERS;

  // Reset when entering phase
  useEffect(() => {
    if (phase === 'womensDay') {
      setPlantedCount(1);
    }
  }, [phase]);

  // Synchronize with 3D scene garden taps
  useEffect(() => {
    const handlePlantFlower = () => {
      setPlantedCount((prev) => Math.min(prev + 1, TOTAL_FLOWERS));
    };
    window.addEventListener('awfo:womens-plant-flower', handlePlantFlower);
    return () => {
      window.removeEventListener('awfo:womens-plant-flower', handlePlantFlower);
    };
  }, []);

  const handlePlantClick = useCallback(() => {
    if (isComplete) return;
    const nextCount = Math.min(plantedCount + 1, TOTAL_FLOWERS);
    setPlantedCount(nextCount);
    window.dispatchEvent(
      new CustomEvent('awfo:womens-flower-updated', {
        detail: { count: nextCount },
      })
    );
  }, [isComplete, plantedCount]);

  const handleBloomAll = useCallback(() => {
    setPlantedCount(TOTAL_FLOWERS);
    window.dispatchEvent(
      new CustomEvent('awfo:womens-flower-updated', {
        detail: { count: TOTAL_FLOWERS },
      })
    );
  }, []);

  const handleProceedToFinal = useCallback(() => {
    setPhase('final');
  }, [setPhase]);

  const handleProceedKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleProceedToFinal();
      }
    },
    [handleProceedToFinal]
  );

  const handlePlantKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handlePlantClick();
      }
    },
    [handlePlantClick]
  );

  if (phase !== 'womensDay') {
    return null;
  }

  const celebrationMsg = experienceData.womensDay?.message || "Happy Women's Day";

  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="Women's Day garden experience"
      className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none outline-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="rounded-full border border-pink-400/30 bg-neutral-950/60 px-4 py-1.5 text-xs font-light tracking-widest text-pink-200 backdrop-blur-md">
          Women's Day Special
        </div>

        {/* Flower Count Progress */}
        <div className="flex items-center gap-2 rounded-full border border-pink-400/20 bg-neutral-950/60 px-3.5 py-1.5 text-xs font-mono text-pink-300 backdrop-blur-sm">
          <span>Floral Heart:</span>
          <span className="font-semibold text-white">
            {plantedCount}/{TOTAL_FLOWERS}
          </span>
        </div>
      </div>

      {/* Center Celebration Content on Complete */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-lg w-[90vw] rounded-2xl border border-pink-400/30 bg-neutral-950/75 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-pink-900/50"
            >
              <div className="mb-3 text-3xl">🌸💖🌸</div>
              <h1 className="text-[clamp(1.5rem,4.5vw,2.25rem)] font-light tracking-wide text-white font-serif">
                {celebrationMsg}, {experienceData.girlfriendName}!
              </h1>
              <p className="mt-4 text-[clamp(0.85rem,2.5vw,1rem)] font-light leading-relaxed text-pink-100/90 font-serif">
                "{experienceData.womensDay?.gardenPrompt || 'For the person who makes my world brighter and more beautiful every single day.'}"
              </p>

              <button
                type="button"
                tabIndex={0}
                aria-label="Proceed to final chapter"
                onClick={handleProceedToFinal}
                onKeyDown={handleProceedKeyDown}
                className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-7 py-3 text-xs font-semibold tracking-wider text-white shadow-xl shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                <span>To Our Final Chapter</span>
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Interactive Controls */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <button
            type="button"
            tabIndex={0}
            aria-label={`Plant flower ${plantedCount + 1} of ${TOTAL_FLOWERS}`}
            onClick={handlePlantClick}
            onKeyDown={handlePlantKeyDown}
            className="pointer-events-auto flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2.5 text-xs font-semibold tracking-wider text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <span>🌸 Plant Flower ({plantedCount + 1}/{TOTAL_FLOWERS})</span>
          </button>

          <button
            type="button"
            tabIndex={0}
            aria-label="Bloom all remaining flowers at once"
            onClick={handleBloomAll}
            className="pointer-events-auto rounded-full border border-white/20 bg-neutral-950/60 px-4 py-2.5 text-xs font-medium tracking-wider text-neutral-300 backdrop-blur-sm transition-all hover:bg-neutral-900 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/40"
          >
            Bloom All
          </button>
        </motion.div>
      )}
    </div>
  );
};
