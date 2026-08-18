import { useState, type ChangeEvent, type KeyboardEvent } from 'react';
import { useExperienceStore } from '../../experience/ExperienceState';
import { usePerformanceStore } from '../../hooks/usePerformanceMetrics';
import { cameraSequences } from '../../data/cameraSequences';
import type {
  AudioLayer,
  ExperienceMode,
  ExperiencePhase,
  QualityTier,
} from '../../types/experience.types';

const allPhases: ExperiencePhase[] = [
  'loading',
  'intro',
  'world',
  'memory',
  'timeline',
  'letter',
  'birthday',
  'womensDay',
  'final',
];

const allModes: ExperienceMode[] = ['default', 'birthday', 'womensDay'];

const allTiers: QualityTier[] = ['high', 'medium', 'low'];

const allAudioLayers: AudioLayer[] = [
  'intro',
  'world',
  'memory',
  'letter',
  'ending',
  'birthday',
  'none',
];

export const DevTools = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSequence, setSelectedSequence] = useState<string>('intro-to-world');

  const phase = useExperienceStore((state) => state.phase);
  const setPhase = useExperienceStore((state) => state.setPhase);
  const mode = useExperienceStore((state) => state.mode);
  const setMode = useExperienceStore((state) => state.setMode);
  const qualityTier = useExperienceStore((state) => state.qualityTier);
  const setQualityTier = useExperienceStore((state) => state.setQualityTier);
  const currentAudioLayer = useExperienceStore((state) => state.currentAudioLayer);
  const setAudioLayer = useExperienceStore((state) => state.setAudioLayer);
  const userHasInteracted = useExperienceStore((state) => state.userHasInteracted);
  const markUserInteraction = useExperienceStore((state) => state.markUserInteraction);
  const isTransitioning = useExperienceStore((state) => state.isTransitioning);
  const activeMemoryId = useExperienceStore((state) => state.activeMemoryId);
  const resetExperience = useExperienceStore((state) => state.resetExperience);

  // Performance metrics from store
  const { fps, drawCalls, triangles, geometries, textures, autoDowngraded, lowFpsDuration } =
    usePerformanceStore();

  const isDevMode =
    import.meta.env.DEV ||
    (typeof window !== 'undefined' && window.location.search.includes('dev=1'));

  if (!isDevMode) return null;

  const handleToggleExpanded = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleToggleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    handleToggleExpanded();
  };

  const handlePhaseChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setPhase(event.target.value as ExperiencePhase);
  };

  const handleModeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setMode(event.target.value as ExperienceMode);
  };

  const handleTierChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setQualityTier(event.target.value as QualityTier);
  };

  const handleAudioLayerChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setAudioLayer(event.target.value as AudioLayer);
  };

  const handleSequenceSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedSequence(event.target.value);
  };

  const handlePlaySequence = () => {
    window.dispatchEvent(
      new CustomEvent('awfo:play-camera-sequence', { detail: { sequenceId: selectedSequence } })
    );
  };

  const handleSkipToWorld = () => {
    markUserInteraction();
    setPhase('world');
  };

  const handleReset = () => {
    resetExperience();
  };

  const fpsColor =
    fps >= 50 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="fixed bottom-4 left-4 z-50 font-mono text-xs select-none">
      {!isExpanded ? (
        <button
          type="button"
          tabIndex={0}
          aria-label="Open DevTools HUD"
          onClick={handleToggleExpanded}
          onKeyDown={handleToggleKeyDown}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900/80 backdrop-blur-md border border-neutral-700/60 text-amber-300 hover:text-amber-200 hover:bg-neutral-800 hover:border-amber-400/50 shadow-xl transition-all"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {fps} FPS | {phase} ({qualityTier.toUpperCase()})
          </span>
        </button>
      ) : (
        <div className="w-80 max-h-[90vh] overflow-y-auto rounded-xl bg-neutral-950/95 backdrop-blur-md border border-neutral-800 p-4 shadow-2xl text-neutral-200 space-y-3">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
              <span className="font-semibold text-white tracking-wider">AWFO DEVTOOLS</span>
            </div>
            <button
              type="button"
              tabIndex={0}
              aria-label="Close DevTools HUD"
              onClick={handleToggleExpanded}
              onKeyDown={handleToggleKeyDown}
              className="text-neutral-400 hover:text-white px-1 py-0.5 rounded text-sm hover:bg-neutral-800"
            >
              ✕
            </button>
          </div>

          {/* Realtime Performance Monitor */}
          <div className="bg-neutral-900/80 rounded-lg p-2.5 space-y-1 text-[11px] text-neutral-300 border border-neutral-800/80">
            <div className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1">
              Performance Monitor
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Framerate:</span>
              <span className={`font-bold ${fpsColor}`}>{fps} FPS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Draw Calls:</span>
              <span className="text-white font-medium">{drawCalls}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Triangles:</span>
              <span className="text-white font-medium">{triangles.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Geometries / Textures:</span>
              <span className="text-white font-medium">
                {geometries} / {textures}
              </span>
            </div>
            {autoDowngraded && (
              <div className="flex justify-between text-amber-400">
                <span>Auto-Downgraded:</span>
                <span className="font-bold">Active</span>
              </div>
            )}
            {lowFpsDuration > 0 && (
              <div className="flex justify-between text-rose-400">
                <span>Low FPS Warning:</span>
                <span>{lowFpsDuration}s &lt; 30fps</span>
              </div>
            )}
          </div>

          {/* State Inspector */}
          <div className="bg-neutral-900/60 rounded-lg p-2.5 space-y-1 text-[11px] text-neutral-300 border border-neutral-800/80">
            <div className="flex justify-between">
              <span className="text-neutral-500">Phase:</span>
              <span className="text-amber-300 font-bold">{phase}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Mode:</span>
              <span className="text-pink-300 font-bold">{mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Interacted:</span>
              <span className={userHasInteracted ? 'text-emerald-400' : 'text-rose-400'}>
                {String(userHasInteracted)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Transitioning:</span>
              <span className={isTransitioning ? 'text-amber-400' : 'text-neutral-400'}>
                {String(isTransitioning)}
              </span>
            </div>
            {activeMemoryId && (
              <div className="flex justify-between">
                <span className="text-neutral-500">Active Memory:</span>
                <span className="text-sky-300">{activeMemoryId}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-500">Audio Layer:</span>
              <span className="text-indigo-300">{currentAudioLayer}</span>
            </div>
          </div>

          {/* Phase Switcher */}
          <div className="space-y-1">
            <label htmlFor="dev-phase-select" className="text-neutral-400 text-[10px] uppercase font-semibold">
              Jump Phase
            </label>
            <select
              id="dev-phase-select"
              aria-label="Select Experience Phase"
              value={phase}
              onChange={handlePhaseChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-1 text-white focus:outline-none focus:border-amber-400"
            >
              {allPhases.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher */}
          <div className="space-y-1">
            <label htmlFor="dev-mode-select" className="text-neutral-400 text-[10px] uppercase font-semibold">
              Experience Mode
            </label>
            <select
              id="dev-mode-select"
              aria-label="Select Experience Mode"
              value={mode}
              onChange={handleModeChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-1 text-white focus:outline-none focus:border-amber-400"
            >
              {allModes.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Quality Tier Switcher */}
          <div className="space-y-1">
            <label htmlFor="dev-tier-select" className="text-neutral-400 text-[10px] uppercase font-semibold">
              Quality Tier
            </label>
            <select
              id="dev-tier-select"
              aria-label="Select Quality Tier"
              value={qualityTier}
              onChange={handleTierChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-1 text-white focus:outline-none focus:border-amber-400"
            >
              {allTiers.map((t) => (
                <option key={t} value={t}>
                  {t.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Layer Switcher */}
          <div className="space-y-1">
            <label htmlFor="dev-audio-select" className="text-neutral-400 text-[10px] uppercase font-semibold">
              Audio Layer
            </label>
            <select
              id="dev-audio-select"
              aria-label="Select Audio Layer"
              value={currentAudioLayer}
              onChange={handleAudioLayerChange}
              className="w-full bg-neutral-900 border border-neutral-700 rounded-md px-2.5 py-1 text-white focus:outline-none focus:border-amber-400"
            >
              {allAudioLayers.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          {/* Camera Sequence Player */}
          <div className="space-y-1">
            <label htmlFor="dev-seq-select" className="text-neutral-400 text-[10px] uppercase font-semibold">
              Camera Sequence
            </label>
            <div className="flex gap-2">
              <select
                id="dev-seq-select"
                aria-label="Select Camera Sequence"
                value={selectedSequence}
                onChange={handleSequenceSelectChange}
                className="flex-1 bg-neutral-900 border border-neutral-700 rounded-md px-2 py-1 text-white focus:outline-none focus:border-amber-400 text-[11px]"
              >
                {Object.keys(cameraSequences).map((seqId) => (
                  <option key={seqId} value={seqId}>
                    {seqId}
                  </option>
                ))}
              </select>
              <button
                type="button"
                aria-label="Play selected camera sequence"
                onClick={handlePlaySequence}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-colors"
              >
                Play
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleSkipToWorld}
              className="px-2 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-center font-sans text-xs transition-colors"
            >
              Skip to World
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-center font-sans text-xs transition-colors"
            >
              Reset Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
