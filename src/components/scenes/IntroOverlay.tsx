import React, { useEffect, useState, useCallback } from 'react';
import { useExperienceStore } from '../../experience/ExperienceState';
import { experienceData } from '../../data/experienceData';
import { audioManager } from '../audio/AudioManager';

export const IntroOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const setPhase = useExperienceStore((state) => state.setPhase);
  const markUserInteraction = useExperienceStore((state) => state.markUserInteraction);
  const setTransitioning = useExperienceStore((state) => state.setTransitioning);

  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [isEntering, setIsEntering] = useState(false);

  useEffect(() => {
    if (phase !== 'intro') {
      setShowLine1(false);
      setShowLine2(false);
      setIsEntering(false);
      return;
    }

    const timerLine1 = setTimeout(() => {
      setShowLine1(true);
    }, 1200);

    const timerLine2 = setTimeout(() => {
      setShowLine2(true);
    }, 4500);

    return () => {
      clearTimeout(timerLine1);
      clearTimeout(timerLine2);
    };
  }, [phase]);

  const handleEnterWorld = useCallback(() => {
    if (isEntering) return;

    setIsEntering(true);
    markUserInteraction();
    audioManager.setInteracted(true);
    audioManager.playLayer('intro');

    // Trigger camera choreography sequence
    window.dispatchEvent(
      new CustomEvent('awfo:play-camera-sequence', {
        detail: { sequenceId: 'intro-to-world' },
      })
    );

    setTransitioning(true);

    // Switch phase to world to initiate world scene reveal
    setTimeout(() => {
      setPhase('world');
    }, 400);
  }, [isEntering, markUserInteraction, setPhase, setTransitioning]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleEnterWorld();
      }
    },
    [handleEnterWorld]
  );

  if (phase !== 'intro' && !isEntering) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-40 flex flex-col items-center justify-center pointer-events-none select-none transition-opacity duration-1000 ${
        isEntering ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center text-center px-6 max-w-xl w-[90vw] mx-auto space-y-8">
        {/* Line 1: Emotional introduction */}
        <p
          className={`text-[clamp(1.15rem,3.8vw,1.85rem)] font-light text-neutral-200 tracking-wide leading-relaxed font-serif transition-all duration-1000 ease-out ${
            showLine1
              ? 'opacity-100 translate-y-0 filter drop-shadow-[0_2px_12px_rgba(255,255,255,0.15)]'
              : 'opacity-0 translate-y-4'
          }`}
        >
          {experienceData.intro.line1}
        </p>

        {/* Line 2: Subtle invitation affordance */}
        <div
          tabIndex={showLine2 ? 0 : -1}
          role="button"
          aria-label="Enter little world"
          onClick={handleEnterWorld}
          onKeyDown={handleKeyDown}
          className={`pointer-events-auto group cursor-pointer flex flex-col items-center gap-3 transition-all duration-1000 ease-out outline-none focus-visible:ring-1 focus-visible:ring-amber-200/50 rounded-full px-6 py-3 sm:px-8 ${
            showLine2
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
          }`}
        >
          <span className="text-[clamp(0.85rem,2.2vw,1.1rem)] font-light tracking-[0.2em] text-neutral-300 group-hover:text-amber-100 transition-colors duration-300">
            {experienceData.intro.line2}
          </span>

          {/* Delicate breathing pulse indicator */}
          <div className="relative flex items-center justify-center w-6 h-6">
            <span className="absolute w-6 h-6 rounded-full bg-amber-200/10 animate-ping opacity-75" />
            <span className="w-1.5 h-1.5 rounded-full bg-amber-200 group-hover:bg-amber-100 shadow-[0_0_10px_#fde68a] transition-all duration-300 group-hover:scale-125" />
          </div>
        </div>
      </div>
    </div>
  );
};
