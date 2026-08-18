import { useCallback } from 'react';
import { useCameraDirector, type CameraDirectorPlayOptions } from '../experience/CameraDirector';
import { cameraSequences, createApproachSequence } from '../data/cameraSequences';
import type { CameraSequence } from '../types/experience.types';

export const useCinematicCamera = () => {
  const director = useCameraDirector();

  const playSequence = useCallback(
    (sequence: string | CameraSequence, options?: CameraDirectorPlayOptions) => {
      director.playSequence(sequence, options);
    },
    [director]
  );

  const stopSequence = useCallback(() => {
    director.stopSequence();
  }, [director]);

  const approachTarget = useCallback(
    (id: string, targetPos: [number, number, number], options?: CameraDirectorPlayOptions) => {
      const seq = createApproachSequence(`approach-${id}`, targetPos);
      director.playSequence(seq, options);
    },
    [director]
  );

  return {
    playSequence,
    stopSequence,
    approachTarget,
    isPlaying: director.isPlaying,
    currentSequenceId: director.currentSequenceId,
    lookAtTarget: director.lookAtTarget,
    availableSequences: Object.keys(cameraSequences),
  };
};
