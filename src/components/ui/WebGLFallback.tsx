import { useState, useCallback, type KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { experienceData } from '../../data/experienceData';

export interface WebGLFallbackProps {
  reason?: 'unsupported' | 'contextlost';
  onRetry?: () => void;
}

type TabKey = 'intro' | 'memories' | 'letter' | 'special' | 'final';

export const WebGLFallback = ({
  reason = 'unsupported',
  onRetry,
}: WebGLFallbackProps) => {
  const [activeTab, setActiveTab] = useState<TabKey>('intro');
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);

  const handleNextLetter = useCallback(() => {
    if (letterIndex < experienceData.letter.length - 1) {
      setLetterIndex((prev) => prev + 1);
    }
  }, [letterIndex]);

  const handlePrevLetter = useCallback(() => {
    if (letterIndex > 0) {
      setLetterIndex((prev) => prev - 1);
    }
  }, [letterIndex]);

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, tab: TabKey) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActiveTab(tab);
      }
    },
    []
  );

  return (
    <main
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-900 text-neutral-100 overflow-y-auto"
      role="main"
      aria-label="Accessible 2D Experience Fallback"
    >
      {/* Background Ambience Elements */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"
        aria-hidden="true"
      />
      <div
        className="fixed -top-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="fixed -bottom-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Header Banner */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-b border-white/10 backdrop-blur-md bg-black/30">
        <div>
          <h1 className="text-xl sm:text-2xl font-light tracking-wide text-rose-100">
            A World For {experienceData.girlfriendName}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            {reason === 'contextlost'
              ? 'Graphics context was lost. Displaying 2D experience mode.'
              : 'WebGL is unavailable on this device. Displaying 2D experience mode.'}
          </p>
        </div>

        {onRetry && (
          <button
            type="button"
            tabIndex={0}
            aria-label="Retry 3D mode"
            onClick={onRetry}
            className="px-4 py-2 text-xs font-medium rounded-full bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/20 transition-all"
          >
            Retry 3D Mode
          </button>
        )}
      </header>

      {/* Navigation Tabs */}
      <nav
        className="relative z-10 flex justify-center gap-2 p-4 border-b border-white/5 overflow-x-auto"
        aria-label="Story Chapters"
      >
        {(
          [
            { id: 'intro', label: 'Intro' },
            { id: 'memories', label: 'Memories' },
            { id: 'letter', label: 'Letter' },
            ...(experienceData.mode !== 'default'
              ? [{ id: 'special', label: experienceData.mode === 'birthday' ? 'Birthday' : "Women's Day" }]
              : []),
            { id: 'final', label: 'Message' },
          ] as { id: TabKey; label: string }[]
        ).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              tabIndex={0}
              role="tab"
              aria-selected={isActive}
              aria-label={`View ${tab.label} section`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(e) => handleTabKeyDown(e, tab.id)}
              className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50 shadow-lg shadow-rose-950/40'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* Main Section Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {activeTab === 'intro' && (
              <motion.section
                key="intro"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
              >
                <div className="text-4xl">✨</div>
                <h2 className="text-2xl sm:text-3xl font-light text-rose-100">
                  {experienceData.intro.line1}
                </h2>
                <p className="text-base text-neutral-300 font-light italic">
                  {experienceData.intro.line2}
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    tabIndex={0}
                    aria-label="Begin reading memories"
                    onClick={() => setActiveTab('memories')}
                    className="px-6 py-2.5 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium text-xs tracking-wider shadow-lg hover:scale-105 transition-all"
                  >
                    Open Memories
                  </button>
                </div>
              </motion.section>
            )}

            {activeTab === 'memories' && (
              <motion.section
                key="memories"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Memory selector */}
                <div className="flex gap-2 justify-center flex-wrap">
                  {experienceData.memories.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      tabIndex={0}
                      aria-label={`Select memory ${m.title}`}
                      onClick={() => setSelectedMemoryIndex(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                        selectedMemoryIndex === idx
                          ? 'bg-amber-400/20 text-amber-200 border border-amber-400/40'
                          : 'bg-white/5 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {m.title}
                    </button>
                  ))}
                </div>

                {/* Selected Memory Card */}
                {experienceData.memories[selectedMemoryIndex] && (
                  <div className="bg-black/40 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl space-y-4">
                    <div className="flex items-center justify-between text-xs text-amber-300 font-mono">
                      <span>{experienceData.memories[selectedMemoryIndex].date}</span>
                      <span className="uppercase tracking-widest text-[10px] bg-amber-500/10 px-2 py-0.5 rounded">
                        {experienceData.memories[selectedMemoryIndex].scene}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-light text-white">
                      {experienceData.memories[selectedMemoryIndex].title}
                    </h3>
                    <p className="text-neutral-300 leading-relaxed font-light text-sm sm:text-base">
                      "{experienceData.memories[selectedMemoryIndex].description}"
                    </p>
                  </div>
                )}
              </motion.section>
            )}

            {activeTab === 'letter' && (
              <motion.section
                key="letter"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="bg-black/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl text-center space-y-6"
              >
                <div className="text-xs font-mono tracking-widest text-amber-300/80">
                  PAGE {letterIndex + 1} OF {experienceData.letter.length}
                </div>

                <p className="text-lg sm:text-xl md:text-2xl font-light text-amber-100/95 leading-relaxed min-h-[5rem] flex items-center justify-center italic">
                  "{experienceData.letter[letterIndex]}"
                </p>

                <div className="flex justify-center gap-4 pt-4">
                  <button
                    type="button"
                    tabIndex={0}
                    disabled={letterIndex === 0}
                    aria-label="Previous line"
                    onClick={handlePrevLetter}
                    className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-xs text-neutral-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    tabIndex={0}
                    disabled={letterIndex === experienceData.letter.length - 1}
                    aria-label="Next line"
                    onClick={handleNextLetter}
                    className="px-6 py-2 rounded-full bg-amber-500/90 hover:bg-amber-400 text-xs font-semibold text-neutral-950 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Next
                  </button>
                </div>
              </motion.section>
            )}

            {activeTab === 'special' && (
              <motion.section
                key="special"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="bg-black/40 border border-pink-500/20 rounded-2xl p-8 backdrop-blur-xl text-center space-y-4"
              >
                {experienceData.mode === 'birthday' && (
                  <>
                    <div className="text-4xl">🎂</div>
                    <h2 className="text-2xl font-light text-pink-200">
                      {experienceData.birthday?.message || 'Happy Birthday!'}
                    </h2>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                      {experienceData.birthday?.wishPrompt || 'Wishing you the happiest year ahead.'}
                    </p>
                  </>
                )}
                {experienceData.mode === 'womensDay' && (
                  <>
                    <div className="text-4xl">🌸</div>
                    <h2 className="text-2xl font-light text-pink-200">
                      {experienceData.womensDay?.message || "Happy Women's Day!"}
                    </h2>
                    <p className="text-neutral-300 text-sm leading-relaxed">
                      {experienceData.womensDay?.gardenPrompt || 'For the most special person.'}
                    </p>
                  </>
                )}
              </motion.section>
            )}

            {activeTab === 'final' && (
              <motion.section
                key="final"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="bg-black/40 border border-rose-500/20 rounded-2xl p-8 backdrop-blur-xl text-center space-y-6"
              >
                <div className="text-4xl text-rose-400">💖</div>
                <div className="space-y-3">
                  <p className="text-base sm:text-lg text-rose-100/90 font-light">
                    {experienceData.finalScene.line1}
                  </p>
                  <p className="text-base sm:text-lg text-rose-100/90 font-light">
                    {experienceData.finalScene.line2}
                  </p>
                  <p className="text-base sm:text-lg text-rose-100/90 font-light">
                    {experienceData.finalScene.line3}
                  </p>
                </div>
                <h3 className="text-2xl font-serif text-rose-200 pt-2">
                  "{experienceData.finalScene.closing}"
                </h3>
                <p className="text-xs tracking-widest text-neutral-400 uppercase">
                  Love, {experienceData.senderName}
                </p>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-4 text-xs text-neutral-500 border-t border-white/5">
        Designed with love for {experienceData.girlfriendName}
      </footer>
    </main>
  );
};
