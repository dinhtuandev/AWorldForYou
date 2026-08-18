import { Suspense, useEffect, useMemo, lazy } from 'react';
import { useExperienceStore } from '../../experience/ExperienceState';
import { experienceData } from '../../data/experienceData';
import { MemoryPortal } from '../interactions/MemoryPortal';
import { useCameraDirector } from '../../experience/CameraDirector';
import type { MemorySceneId } from '../../types/experience.types';

// Lazy loaded individual memory environments
const BeachMemory = lazy(() =>
  import('./memories/BeachMemory').then((m) => ({ default: m.BeachMemory }))
);
const CafeMemory = lazy(() =>
  import('./memories/CafeMemory').then((m) => ({ default: m.CafeMemory }))
);
const NightWalkMemory = lazy(() =>
  import('./memories/NightWalkMemory').then((m) => ({ default: m.NightWalkMemory }))
);
const FirstMeetingMemory = lazy(() =>
  import('./memories/FirstMeetingMemory').then((m) => ({
    default: m.FirstMeetingMemory,
  }))
);

export const MemoryScene = () => {
  const activeMemoryId = useExperienceStore((state) => state.activeMemoryId);
  const phase = useExperienceStore((state) => state.phase);
  const { playSequence } = useCameraDirector();

  const activeMemory = useMemo(() => {
    if (!activeMemoryId) return experienceData.memories[0];
    return (
      experienceData.memories.find((item) => item.id === activeMemoryId) ??
      experienceData.memories[0]
    );
  }, [activeMemoryId]);

  const sceneType: MemorySceneId = activeMemory?.scene ?? 'beach';

  // Play memory-specific entry camera movement on phase enter
  useEffect(() => {
    if (phase !== 'memory') return;

    const cameraSequenceKey = `memory-enter-${sceneType}`;
    playSequence(cameraSequenceKey);
  }, [phase, sceneType, playSequence]);

  const renderActiveMemoryEnvironment = () => {
    switch (sceneType) {
      case 'beach':
        return <BeachMemory />;
      case 'cafe':
        return <CafeMemory />;
      case 'nightWalk':
        return <NightWalkMemory />;
      case 'firstMeeting':
        return <FirstMeetingMemory />;
      default:
        return <BeachMemory />;
    }
  };

  return (
    <group position={[0, 0, 0]}>
      {/* 3D Memory Portal Visual Effect */}
      <MemoryPortal sceneType={sceneType} />

      {/* Selected 3D Memory Environment with smooth fallback */}
      <Suspense fallback={null}>
        {renderActiveMemoryEnvironment()}
      </Suspense>
    </group>
  );
};
