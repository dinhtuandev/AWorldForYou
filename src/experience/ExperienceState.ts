import { create } from 'zustand';
import { experienceData } from '../data/experienceData';
import type {
  AudioLayer,
  ExperienceMode,
  ExperiencePhase,
  ExperienceStore,
  QualityTier,
} from '../types/experience.types';

const getInitialAudioLayerForPhase = (phase: ExperiencePhase): AudioLayer => {
  switch (phase) {
    case 'loading':
    case 'intro':
      return 'intro';
    case 'world':
    case 'timeline':
      return 'world';
    case 'memory':
      return 'memory';
    case 'letter':
      return 'letter';
    case 'birthday':
      return 'birthday';
    case 'womensDay':
    case 'final':
      return 'ending';
    default:
      return 'intro';
  }
};

export const useExperienceStore = create<ExperienceStore>((set) => ({
  // State
  phase: 'loading',
  previousPhase: null,
  userHasInteracted: false,
  isTransitioning: false,
  activeMemoryId: null,
  visitedMemoryIds: [],
  activeMilestoneId: null,
  visitedMilestoneIds: [],
  letterLineIndex: 0,
  audioEnabled: experienceData.audio.enabled,
  currentAudioLayer: 'intro',
  qualityTier: 'high',
  mode: experienceData.mode,

  // Actions
  setPhase: (nextPhase: ExperiencePhase) =>
    set((state) => {
      if (state.phase === nextPhase) return state;
      return {
        previousPhase: state.phase,
        phase: nextPhase,
        currentAudioLayer: getInitialAudioLayerForPhase(nextPhase),
      };
    }),

  enterMemory: (id: string) =>
    set((state) => ({
      previousPhase: state.phase,
      phase: 'memory',
      activeMemoryId: id,
      visitedMemoryIds: state.visitedMemoryIds.includes(id)
        ? state.visitedMemoryIds
        : [...state.visitedMemoryIds, id],
      currentAudioLayer: 'memory',
      isTransitioning: true,
    })),

  exitMemory: () =>
    set((state) => ({
      previousPhase: state.phase,
      phase: 'world',
      activeMemoryId: null,
      currentAudioLayer: 'world',
      isTransitioning: true,
    })),

  selectMilestone: (id: string) =>
    set((state) => ({
      activeMilestoneId: id,
      visitedMilestoneIds: state.visitedMilestoneIds.includes(id)
        ? state.visitedMilestoneIds
        : [...state.visitedMilestoneIds, id],
    })),

  advanceLetter: () =>
    set((state) => ({
      letterLineIndex: state.letterLineIndex + 1,
    })),

  resetLetter: () =>
    set(() => ({
      letterLineIndex: 0,
    })),

  markUserInteraction: () =>
    set((state) => {
      if (state.userHasInteracted) return state;
      return { userHasInteracted: true };
    }),

  setQualityTier: (tier: QualityTier) =>
    set(() => ({
      qualityTier: tier,
    })),

  setTransitioning: (isTransitioning: boolean) =>
    set(() => ({
      isTransitioning,
    })),

  setAudioEnabled: (audioEnabled: boolean) =>
    set(() => ({
      audioEnabled,
    })),

  setAudioLayer: (layer: AudioLayer) =>
    set(() => ({
      currentAudioLayer: layer,
    })),

  setMode: (mode: ExperienceMode) =>
    set(() => ({
      mode,
    })),

  resetExperience: () =>
    set(() => ({
      phase: 'intro',
      previousPhase: null,
      activeMemoryId: null,
      visitedMemoryIds: [],
      activeMilestoneId: null,
      visitedMilestoneIds: [],
      letterLineIndex: 0,
      isTransitioning: false,
      currentAudioLayer: 'intro',
    })),
}));
