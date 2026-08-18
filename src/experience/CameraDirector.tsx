import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { cameraSequences } from '../data/cameraSequences';
import type { CameraKeyframe, CameraSequence } from '../types/experience.types';

export interface CameraDirectorPlayOptions {
  onComplete?: () => void;
  overrideKeyframes?: CameraKeyframe[];
  onStart?: () => void;
}

export interface CameraDirectorContextValue {
  playSequence: (sequenceInput: string | CameraSequence, options?: CameraDirectorPlayOptions) => void;
  stopSequence: () => void;
  isPlaying: boolean;
  currentSequenceId: string | null;
  lookAtTarget: THREE.Vector3;
}

const CameraDirectorContext = createContext<CameraDirectorContextValue | null>(null);

export interface CameraDirectorProviderProps {
  children: ReactNode;
}

export const CameraDirectorProvider = ({ children }: CameraDirectorProviderProps) => {
  const { camera } = useThree();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSequenceId, setCurrentSequenceId] = useState<string | null>(null);

  const lookAtTargetRef = useRef(new THREE.Vector3(0, 0, 0));
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  const stopSequence = () => {
    if (!activeTimelineRef.current) {
      setIsPlaying(false);
      setCurrentSequenceId(null);
      return;
    }

    activeTimelineRef.current.kill();
    activeTimelineRef.current = null;
    setIsPlaying(false);
    setCurrentSequenceId(null);
  };

  const playSequence = (
    sequenceInput: string | CameraSequence,
    options?: CameraDirectorPlayOptions
  ) => {
    stopSequence();

    const sequence: CameraSequence | undefined =
      typeof sequenceInput === 'string' ? cameraSequences[sequenceInput] : sequenceInput;

    if (!sequence) {
      console.warn(`[CameraDirector] Sequence not found: ${String(sequenceInput)}`);
      return;
    }

    const keyframes = options?.overrideKeyframes ?? sequence.keyframes;
    if (keyframes.length === 0) return;

    setIsPlaying(true);
    setCurrentSequenceId(sequence.id);
    options?.onStart?.();

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsPlaying(false);
        setCurrentSequenceId(null);
        sequence.onComplete?.();
        options?.onComplete?.();
      },
    });

    activeTimelineRef.current = timeline;

    keyframes.forEach((kf, index) => {
      const targetPos = kf.position;
      const targetLook = kf.target ?? kf.lookAt ?? [0, 0, 0];

      if (index === 0 && kf.duration === 0) {
        camera.position.set(targetPos[0], targetPos[1], targetPos[2]);
        lookAtTargetRef.current.set(targetLook[0], targetLook[1], targetLook[2]);
        camera.lookAt(lookAtTargetRef.current);
        if (kf.fov && 'fov' in camera && typeof (camera as THREE.PerspectiveCamera).fov === 'number') {
          (camera as THREE.PerspectiveCamera).fov = kf.fov;
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        }
        return;
      }

      const ease = kf.ease ?? 'power2.inOut';
      const duration = kf.duration;

      const posProxy = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z,
      };

      const lookProxy = {
        x: lookAtTargetRef.current.x,
        y: lookAtTargetRef.current.y,
        z: lookAtTargetRef.current.z,
      };

      timeline.to(
        posProxy,
        {
          x: targetPos[0],
          y: targetPos[1],
          z: targetPos[2],
          duration,
          ease,
          onUpdate: () => {
            camera.position.set(posProxy.x, posProxy.y, posProxy.z);
          },
        },
        index === 0 ? 0 : '>'
      );

      timeline.to(
        lookProxy,
        {
          x: targetLook[0],
          y: targetLook[1],
          z: targetLook[2],
          duration,
          ease,
          onUpdate: () => {
            lookAtTargetRef.current.set(lookProxy.x, lookProxy.y, lookProxy.z);
          },
        },
        '<'
      );

      if (kf.fov && 'fov' in camera) {
        const persCam = camera as THREE.PerspectiveCamera;
        timeline.to(
          persCam,
          {
            fov: kf.fov,
            duration,
            ease,
            onUpdate: () => persCam.updateProjectionMatrix(),
          },
          '<'
        );
      }
    });
  };

  useFrame(() => {
    camera.lookAt(lookAtTargetRef.current);
  });

  useEffect(() => {
    const handleCustomEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ sequenceId: string }>;
      if (customEvent.detail?.sequenceId) {
        playSequence(customEvent.detail.sequenceId);
      }
    };

    window.addEventListener('awfo:play-camera-sequence', handleCustomEvent);

    return () => {
      window.removeEventListener('awfo:play-camera-sequence', handleCustomEvent);
      if (activeTimelineRef.current) {
        activeTimelineRef.current.kill();
      }
    };
  }, []);

  const value: CameraDirectorContextValue = {
    playSequence,
    stopSequence,
    isPlaying,
    currentSequenceId,
    lookAtTarget: lookAtTargetRef.current,
  };

  return (
    <CameraDirectorContext.Provider value={value}>
      {children}
    </CameraDirectorContext.Provider>
  );
};

export const useCameraDirector = () => {
  const context = useContext(CameraDirectorContext);
  if (!context) {
    throw new Error('useCameraDirector must be used within a CameraDirectorProvider');
  }
  return context;
};
