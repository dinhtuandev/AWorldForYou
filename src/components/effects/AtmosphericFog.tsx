import { useEffect, useMemo, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperienceStore } from '../../experience/ExperienceState';
import { experienceData } from '../../data/experienceData';
import { useQualityTier } from '../../hooks/useQualityTier';
import { getTargetFogSettings } from './shaders/fog';

export const AtmosphericFog = () => {
  const { scene } = useThree();
  const phase = useExperienceStore((state) => state.phase);
  const activeMemoryId = useExperienceStore((state) => state.activeMemoryId);
  const { qualityTier } = useQualityTier();

  const activeMemory = useMemo(() => {
    return experienceData.memories.find((m) => m.id === activeMemoryId) ?? experienceData.memories[0];
  }, [activeMemoryId]);

  const targetSettings = useMemo(() => {
    return getTargetFogSettings(phase, activeMemory?.scene);
  }, [phase, activeMemory?.scene]);

  const targetColorRef = useRef(new THREE.Color(targetSettings.color));
  const currentColorRef = useRef(new THREE.Color(targetSettings.color));
  const currentNearRef = useRef(targetSettings.near);
  const currentFarRef = useRef(targetSettings.far);

  useEffect(() => {
    targetColorRef.current.set(targetSettings.color);
  }, [targetSettings]);

  // Initialize scene fog
  useEffect(() => {
    if (!scene.fog) {
      scene.fog = new THREE.Fog(
        targetSettings.color,
        targetSettings.near,
        targetSettings.far
      );
    }
  }, [scene, targetSettings]);

  useFrame((_, delta) => {
    if (!scene.fog || !(scene.fog instanceof THREE.Fog)) return;

    // Smooth damp towards target color and distance bounds
    currentColorRef.current.lerp(targetColorRef.current, Math.min(1, delta * 3.5));
    scene.fog.color.copy(currentColorRef.current);

    currentNearRef.current = THREE.MathUtils.damp(
      currentNearRef.current,
      targetSettings.near,
      4,
      delta
    );
    currentFarRef.current = THREE.MathUtils.damp(
      currentFarRef.current,
      targetSettings.far,
      4,
      delta
    );

    scene.fog.near = currentNearRef.current;
    scene.fog.far = currentFarRef.current;

    // Synchronize scene background color if background is color
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(currentColorRef.current);
    }
  });

  return (
    <fog
      attach="fog"
      args={[
        targetSettings.color,
        targetSettings.near,
        qualityTier === 'low' ? targetSettings.far * 1.2 : targetSettings.far,
      ]}
    />
  );
};
