import { useEffect } from 'react';
import { useExperienceStore } from '../experience/ExperienceState';
import { audioManager } from '../components/audio/AudioManager';

export const useAudioManager = () => {
  const currentAudioLayer = useExperienceStore((state) => state.currentAudioLayer);
  const audioEnabled = useExperienceStore((state) => state.audioEnabled);
  const userHasInteracted = useExperienceStore((state) => state.userHasInteracted);
  const setAudioEnabled = useExperienceStore((state) => state.setAudioEnabled);

  useEffect(() => {
    audioManager.setInteracted(userHasInteracted);
  }, [userHasInteracted]);

  useEffect(() => {
    audioManager.setMuted(!audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    if (!userHasInteracted) return;
    audioManager.crossfadeTo(currentAudioLayer);
  }, [currentAudioLayer, userHasInteracted]);

  const handleToggleMute = () => {
    setAudioEnabled(!audioEnabled);
  };

  return {
    currentAudioLayer,
    audioEnabled,
    handleToggleMute,
    audioManager,
  };
};
