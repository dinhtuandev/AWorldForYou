import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useExperienceStore } from './ExperienceState';
import type { InteractiveObjectConfig } from '../types/experience.types';

export interface RegisteredInteractiveItem extends InteractiveObjectConfig {
  meshRef?: React.RefObject<unknown>;
}

export interface InteractionContextValue {
  registerObject: (item: RegisteredInteractiveItem) => void;
  unregisterObject: (id: string) => void;
  setHoveredObject: (id: string | null) => void;
  handleInteract: (id: string) => void;
  hoveredId: string | null;
  isInteractive: (id: string) => boolean;
}

const InteractionContext = createContext<InteractionContextValue | null>(null);

export interface InteractionManagerProps {
  children?: ReactNode;
}

export const InteractionManager = ({ children }: InteractionManagerProps) => {
  const registryRef = useRef<Map<string, RegisteredInteractiveItem>>(new Map());
  const [hoveredId, setHoveredIdState] = useState<string | null>(null);

  const phase = useExperienceStore((state) => state.phase);
  const isTransitioning = useExperienceStore((state) => state.isTransitioning);
  const markUserInteraction = useExperienceStore((state) => state.markUserInteraction);

  const isInteractive = useCallback(
    (id: string) => {
      if (isTransitioning) return false;
      const item = registryRef.current.get(id);
      if (!item) return false;
      if (item.disabledWhen && item.disabledWhen.includes(phase)) {
        return false;
      }
      return true;
    },
    [isTransitioning, phase]
  );

  const registerObject = useCallback((item: RegisteredInteractiveItem) => {
    registryRef.current.set(item.id, item);
  }, []);

  const unregisterObject = useCallback((id: string) => {
    registryRef.current.delete(id);
    setHoveredIdState((current) => (current === id ? null : current));
  }, []);

  const setHoveredObject = useCallback(
    (id: string | null) => {
      if (id && !isInteractive(id)) {
        setHoveredIdState(null);
        document.body.style.cursor = 'auto';
        return;
      }

      setHoveredIdState(id);
      document.body.style.cursor = id ? 'pointer' : 'auto';
    },
    [isInteractive]
  );

  const handleInteract = useCallback(
    (id: string) => {
      if (!isInteractive(id)) return;

      markUserInteraction();

      const item = registryRef.current.get(id);
      if (!item) return;

      item.onInteract?.();
    },
    [isInteractive, markUserInteraction]
  );

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  const contextValue: InteractionContextValue = {
    registerObject,
    unregisterObject,
    setHoveredObject,
    handleInteract,
    hoveredId,
    isInteractive,
  };

  return (
    <InteractionContext.Provider value={contextValue}>
      {children}
    </InteractionContext.Provider>
  );
};

export const useInteractionManager = () => {
  const context = useContext(InteractionContext);
  if (!context) {
    throw new Error('useInteractionManager must be used within an InteractionManager');
  }
  return context;
};
