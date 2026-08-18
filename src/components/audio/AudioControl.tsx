import { useState, useEffect, useCallback, type KeyboardEvent } from 'react';
import { useAudioManager } from '../../hooks/useAudioManager';

export const AudioControl = () => {
  const { audioEnabled, handleToggleMute } = useAudioManager();
  const [isIdle, setIsIdle] = useState(false);

  // Idle timer to dim the audio icon when user is not moving the pointer
  useEffect(() => {
    let timeoutId: number;

    const resetIdleTimer = () => {
      setIsIdle(false);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsIdle(true);
      }, 3500);
    };

    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('touchstart', resetIdleTimer);

    resetIdleTimer();

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('touchstart', resetIdleTimer);
    };
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      handleToggleMute();
    },
    [handleToggleMute]
  );

  const handleClick = useCallback(() => {
    handleToggleMute();
  }, [handleToggleMute]);

  return (
    <div
      className={`fixed top-5 right-5 z-40 transition-opacity duration-700 ${
        isIdle ? 'opacity-30 hover:opacity-100 focus-within:opacity-100' : 'opacity-100'
      }`}
    >
      <button
        type="button"
        tabIndex={0}
        aria-label={audioEnabled ? 'Mute background audio' : 'Unmute background audio'}
        aria-pressed={audioEnabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="group relative flex items-center justify-center w-10 h-10 rounded-full bg-neutral-950/60 backdrop-blur-md border border-neutral-700/40 text-neutral-300 hover:text-amber-200 hover:border-amber-400/40 hover:bg-neutral-900/80 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400/50"
      >
        {audioEnabled ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 transition-transform group-hover:scale-110"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-neutral-500 transition-transform group-hover:scale-110 group-hover:text-neutral-400"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-3.75l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
