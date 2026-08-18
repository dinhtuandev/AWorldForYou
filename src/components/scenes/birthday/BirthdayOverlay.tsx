import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { experienceData } from '../../../data/experienceData';

const TOTAL_CANDLES = 5;

export const BirthdayOverlay = () => {
  const phase = useExperienceStore((state) => state.phase);
  const setPhase = useExperienceStore((state) => state.setPhase);
  const [isExtinguished, setIsExtinguished] = useState(false);
  const [remainingCandles, setRemainingCandles] = useState(TOTAL_CANDLES);
  const [isListeningMic, setIsListeningMic] = useState(false);
  const [micUnavailable, setMicUnavailable] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Reset when entering birthday phase
  useEffect(() => {
    if (phase === 'birthday') {
      setIsExtinguished(false);
      setRemainingCandles(TOTAL_CANDLES);
    }
  }, [phase]);

  // Synchronize with 3D scene events
  useEffect(() => {
    const handleSceneExtinguished = () => {
      setIsExtinguished(true);
      setRemainingCandles(0);
    };

    const handleCandleTapped = (event: Event) => {
      const customEvent = event as CustomEvent<{ remaining: number; index: number }>;
      if (typeof customEvent.detail?.remaining === 'number') {
        setRemainingCandles(customEvent.detail.remaining);
      }
    };

    window.addEventListener('awfo:birthday-extinguished', handleSceneExtinguished);
    window.addEventListener('awfo:candle-tapped', handleCandleTapped);

    return () => {
      window.removeEventListener('awfo:birthday-extinguished', handleSceneExtinguished);
      window.removeEventListener('awfo:candle-tapped', handleCandleTapped);
    };
  }, []);

  const handleBlowOut = useCallback(() => {
    if (isExtinguished) return;
    setIsExtinguished(true);
    setRemainingCandles(0);
    window.dispatchEvent(new CustomEvent('awfo:blow-out-candles'));
  }, [isExtinguished]);

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

  const handleBlowOutKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleBlowOut();
      }
    },
    [handleBlowOut]
  );

  // Attempt microphone blow detection gracefully
  useEffect(() => {
    if (phase !== 'birthday' || isExtinguished) return;

    let isMounted = true;
    let animationFrameId: number;

    const startMicListening = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          if (isMounted) setMicUnavailable(true);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const AudioContextClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioCtx = new AudioContextClass();
        audioContextRef.current = audioCtx;

        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        setIsListeningMic(true);
        setMicUnavailable(false);

        const detectBlow = () => {
          if (!isMounted) return;
          analyser.getByteFrequencyData(dataArray);
          // Calculate average low-frequency energy (wind/blow produces strong low rumble)
          let lowFreqSum = 0;
          for (let i = 0; i < 16; i++) {
            lowFreqSum += dataArray[i];
          }
          const averageLow = lowFreqSum / 16;

          if (averageLow > 165) {
            handleBlowOut();
            return;
          }

          animationFrameId = requestAnimationFrame(detectBlow);
        };

        detectBlow();
      } catch (err) {
        if (isMounted) {
          setIsListeningMic(false);
          setMicUnavailable(true);
        }
      }
    };

    startMicListening();

    return () => {
      isMounted = false;
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [phase, isExtinguished, handleBlowOut]);

  if (phase !== 'birthday') {
    return null;
  }

  const birthdayTitle = experienceData.birthday?.message || 'Happy Birthday';

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-8 md:p-12 select-none">
      {/* Top Tag Header */}
      <div className="flex items-center justify-between">
        <div className="rounded-full border border-pink-500/30 bg-neutral-950/60 px-4 py-1.5 text-xs font-light tracking-widest text-pink-200 backdrop-blur-md">
          A Special Celebration
        </div>

        <div className="flex items-center gap-3">
          {/* Candle Flames Remaining */}
          {!isExtinguished && (
            <div className="flex items-center gap-1.5 rounded-full border border-pink-400/20 bg-neutral-950/60 px-3.5 py-1 text-xs font-mono text-pink-300 backdrop-blur-sm">
              <span>Candles Lit:</span>
              <span className="font-semibold text-white">{remainingCandles}/{TOTAL_CANDLES}</span>
            </div>
          )}

          {isListeningMic && !isExtinguished && (
            <div className="hidden sm:flex items-center gap-2 rounded-full border border-pink-400/30 bg-neutral-950/60 px-3.5 py-1 text-[11px] text-pink-300 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-pink-400 animate-ping" />
              <span>Mic Active (Blow or Tap)</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Modal */}
      <div className="my-auto flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          {!isExtinguished ? (
            <motion.div
              key="blow-prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8 }}
              className="max-w-md w-[90vw] rounded-2xl border border-pink-500/20 bg-neutral-950/70 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-pink-950/40"
            >
              <h2 className="text-xs font-semibold tracking-widest text-pink-400 uppercase mb-2">
                Make a Wish
              </h2>
              <p className="text-[clamp(1.25rem,4vw,1.875rem)] font-light tracking-wide text-white font-serif">
                {experienceData.birthday?.wishPrompt || 'Make a Wish'}
              </p>
              <p className="mt-3 text-[clamp(0.75rem,2vw,0.875rem)] font-light leading-relaxed text-neutral-300">
                {micUnavailable || !isListeningMic
                  ? 'Tap the candles in the cake or click the button below to blow out your candles.'
                  : 'Blow gently into your microphone, or tap each candle on the cake.'}
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  tabIndex={0}
                  aria-label="Blow out candle flames"
                  onClick={handleBlowOut}
                  onKeyDown={handleBlowOutKeyDown}
                  className="pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-2.5 text-xs font-semibold tracking-wider text-white shadow-lg shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <span>Blow Out Candles</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="wish-granted"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-lg w-[90vw] rounded-2xl border border-pink-400/30 bg-neutral-950/75 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-pink-900/50"
            >
              <div className="mb-3 text-3xl">✨🎂✨</div>
              <h1 className="text-[clamp(1.5rem,4.5vw,2.5rem)] font-light tracking-wide text-white font-serif">
                {birthdayTitle}, {experienceData.girlfriendName}!
              </h1>
              <p className="mt-4 text-[clamp(0.85rem,2.5vw,1rem)] font-light leading-relaxed text-pink-100/90">
                May all your wishes and dreams bloom into the brightest stars this year.
              </p>

              <button
                type="button"
                tabIndex={0}
                aria-label="Proceed to final scene"
                onClick={handleProceedToFinal}
                onKeyDown={handleProceedKeyDown}
                className="pointer-events-auto mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-7 py-3 text-xs font-semibold tracking-wider text-white shadow-xl shadow-pink-500/30 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
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

      <div />
    </div>
  );
};
