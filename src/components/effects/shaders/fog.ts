import type { ExperiencePhase, MemorySceneId } from '../../../types/experience.types';

export interface FogSettings {
  color: string;
  near: number;
  far: number;
}

export const SCENE_FOG_PRESETS: Record<ExperiencePhase, FogSettings | ((memoryScene?: MemorySceneId) => FogSettings)> = {
  loading: { color: '#050505', near: 8, far: 30 },
  intro: { color: '#050505', near: 8, far: 30 },
  world: { color: '#120c1f', near: 10, far: 36 },
  timeline: { color: '#120c1f', near: 10, far: 36 },
  memory: (memoryScene = 'beach') => {
    switch (memoryScene) {
      case 'beach':
        return { color: '#2a0c04', near: 8, far: 38 };
      case 'cafe':
        return { color: '#1c1008', near: 6, far: 22 };
      case 'nightWalk':
        return { color: '#050814', near: 6, far: 28 };
      case 'firstMeeting':
        return { color: '#030014', near: 6, far: 30 };
      default:
        return { color: '#120c1f', near: 10, far: 36 };
    }
  },
  letter: { color: '#1a120b', near: 8, far: 28 },
  birthday: { color: '#0f172a', near: 8, far: 28 },
  womensDay: { color: '#2d1b2e', near: 8, far: 32 },
  final: { color: '#030712', near: 12, far: 40 },
};

export const getTargetFogSettings = (
  phase: ExperiencePhase,
  memoryScene?: MemorySceneId
): FogSettings => {
  const presetOrFn = SCENE_FOG_PRESETS[phase];
  if (typeof presetOrFn === 'function') {
    return presetOrFn(memoryScene);
  }
  return presetOrFn ?? { color: '#120c1f', near: 10, far: 36 };
};
