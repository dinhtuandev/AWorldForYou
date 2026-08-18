import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { AffordanceType } from '../../types/experience.types';
import type { ReactNode } from 'react';

export interface HoverAffordanceProps {
  isHovered: boolean;
  affordance?: AffordanceType;
  children: ReactNode;
}

export const HoverAffordance = ({
  isHovered,
  affordance = 'glow',
  children,
}: HoverAffordanceProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (affordance === 'scale' || affordance === 'glow') {
      const targetScale = isHovered ? 1.06 : 1.0;
      groupRef.current.scale.x = THREE.MathUtils.damp(
        groupRef.current.scale.x,
        targetScale,
        10,
        delta
      );
      groupRef.current.scale.y = THREE.MathUtils.damp(
        groupRef.current.scale.y,
        targetScale,
        10,
        delta
      );
      groupRef.current.scale.z = THREE.MathUtils.damp(
        groupRef.current.scale.z,
        targetScale,
        10,
        delta
      );
    }

    if (lightRef.current) {
      const targetIntensity = isHovered ? 2.5 : 0.0;
      lightRef.current.intensity = THREE.MathUtils.damp(
        lightRef.current.intensity,
        targetIntensity,
        8,
        delta
      );
    }

    if (particlesRef.current && isHovered) {
      particlesRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <group ref={groupRef}>
      {children}

      {(affordance === 'light' || affordance === 'glow') && (
        <pointLight
          ref={lightRef}
          color="#ffeedd"
          distance={4}
          intensity={0}
          position={[0, 0.5, 0]}
        />
      )}

      {affordance === 'particles' && (
        <points ref={particlesRef} visible={isHovered}>
          <sphereGeometry args={[0.8, 12, 12]} />
          <pointsMaterial
            size={0.04}
            color="#fff0cc"
            transparent
            opacity={isHovered ? 0.8 : 0}
          />
        </points>
      )}
    </group>
  );
};
