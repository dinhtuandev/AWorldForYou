import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveObject } from '../interactions/InteractiveObject';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useQualityTier } from '../../hooks/useQualityTier';
import type { Memory } from '../../types/experience.types';

export interface PhotoFrameProps {
  memory: Memory;
}

export const PhotoFrame = ({ memory }: PhotoFrameProps) => {
  const enterMemory = useExperienceStore((state) => state.enterMemory);
  const { preset } = useQualityTier();
  const floatRef = useRef<THREE.Group>(null);

  // Subtle floating breathing effect
  useFrame(({ clock }) => {
    if (!floatRef.current) return;
    const elapsed = clock.getElapsedTime();
    const hash = memory.id.charCodeAt(memory.id.length - 1) || 1;
    floatRef.current.position.y = Math.sin(elapsed * 1.5 + hash) * 0.04;
  });

  const cameraSeqId = `memory-portal-${memory.scene}`;

  return (
    <InteractiveObject
      id={memory.id}
      label={memory.title}
      position={memory.worldPosition}
      affordance="glow"
      cameraSequenceId={cameraSeqId}
      onInteract={() => enterMemory(memory.id)}
    >
      <group ref={floatRef} position={[0, 0.4, 0]}>
        {/* Wooden Easel / Pedestal Stand */}
        <mesh
          position={[0, -0.2, 0]}
          castShadow={preset.shadows}
          receiveShadow={preset.shadows}
        >
          <cylinderGeometry args={[0.22, 0.28, 0.4, 8]} />
          <meshStandardMaterial color="#451a03" roughness={0.85} flatShading />
        </mesh>

        {/* Outer Golden/Wood Picture Frame */}
        <mesh
          position={[0, 0.3, 0]}
          rotation={[0.1, 0, 0]}
          castShadow={preset.shadows}
          receiveShadow={preset.shadows}
        >
          <boxGeometry args={[0.85, 1.05, 0.08]} />
          <meshStandardMaterial
            color="#d97706"
            metalness={0.65}
            roughness={0.35}
          />
        </mesh>

        {/* Inner Photo Canvas/Matte */}
        <mesh
          position={[0, 0.3, 0.045]}
          rotation={[0.1, 0, 0]}
        >
          <planeGeometry args={[0.68, 0.88]} />
          <meshStandardMaterial
            color="#fffbeb"
            roughness={0.6}
          />
        </mesh>

        {/* Symbolic Memory Art Placeholder / Thumbnail representation */}
        <mesh
          position={[0, 0.35, 0.05]}
          rotation={[0.1, 0, 0]}
        >
          <planeGeometry args={[0.6, 0.65]} />
          <meshStandardMaterial
            color={
              memory.scene === 'beach'
                ? '#38bdf8'
                : memory.scene === 'cafe'
                ? '#fb923c'
                : memory.scene === 'nightWalk'
                ? '#818cf8'
                : '#ec4899'
            }
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>

        {/* Little decorative star / pin icon at top of frame */}
        <mesh position={[0, 0.85, 0.05]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.08, 0.08, 0.04]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#facc15"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>
    </InteractiveObject>
  );
};
