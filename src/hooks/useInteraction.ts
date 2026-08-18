import { useInteractionManager } from '../experience/InteractionManager';

export const useInteraction = () => {
  const manager = useInteractionManager();
  return {
    hoveredId: manager.hoveredId,
    isInteractive: manager.isInteractive,
    triggerInteract: manager.handleInteract,
  };
};
