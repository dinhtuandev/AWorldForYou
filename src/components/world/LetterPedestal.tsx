import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveObject } from '../interactions/InteractiveObject';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useQualityTier } from '../../hooks/useQualityTier';

export interface LetterPedestalProps {
  position?: [number, number, number];
}

export const LetterPedestal = ({
  position = [1.6, 0.0, 1.6],
}: LetterPedestalProps) => {
  const setPhase = useExperienceStore((state) => state.setPhase);
  const { preset } = useQualityTier();
  const envelopeRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!envelopeRef.current) return;
    const elapsed = clock.getElapsedTime();
    envelopeRef.current.position.y = 0.68 + Math.sin(elapsed * 2.0) * 0.025;
    envelopeRef.current.rotation.y = Math.sin(elapsed * 0.8) * 0.08;
  });

  return (
    <InteractiveObject
      id="world-letter-envelope"
      label="Read Letter"
      position={position}
      affordance="glow"
      cameraSequenceId="letter-approach"
      onInteract={() => setPhase('letter')}
    >
      <group position={[0, 0, 0]}>
        {/* Carved Stone / Wooden Pedestal Stand */}
        <mesh
          position={[0, 0.3, 0]}
          castShadow={preset.shadows}
          receiveShadow={preset.shadows}
        >
          <cylinderGeometry args={[0.3, 0.38, 0.6, 12]} />
          <meshStandardMaterial color="#475569" roughness={0.88} flatShading />
        </mesh>
        <mesh
          position={[0, 0.62, 0]}
          castShadow={preset.shadows}
          receiveShadow={preset.shadows}
        >
          <cylinderGeometry args={[0.42, 0.3, 0.08, 12]} />
          <meshStandardMaterial color="#334155" roughness={0.85} flatShading />
        </mesh>

        {/* Floating Sealed Vintage Envelope */}
        <group ref={envelopeRef} position={[0, 0.68, 0]}>
          {/* Envelope Body */}
          <mesh
            rotation={[-0.4, 0, 0]}
            castShadow={preset.shadows}
            receiveShadow={preset.shadows}
          >
            <boxGeometry args={[0.65, 0.03, 0.45]} />
            <meshStandardMaterial
              color="#fef3c7"
              roughness={0.7}
              emissive="#fde68a"
              emissiveIntensity={0.2}
            />
          </mesh>

          {/* Envelope Flap Triangle */}
          <mesh
            position={[0, 0.02, 0.04]}
            rotation={[-0.4, 0, 0]}
          >
            <coneGeometry args={[0.26, 0.16, 3]} />
            <meshStandardMaterial color="#fde68a" roughness={0.65} />
          </mesh>

          {/* Red Wax Seal */}
          <mesh
            position={[0, 0.03, 0.02]}
            rotation={[-0.4, 0, 0]}
          >
            <cylinderGeometry args={[0.07, 0.07, 0.03, 12]} />
            <meshStandardMaterial
              color="#be123c"
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>

          {/* Soft Golden Halo Light */}
          <pointLight
            color="#fbbf24"
            distance={2.0}
            intensity={1.2}
            position={[0, 0.1, 0]}
          />
        </group>
      </group>
    </InteractiveObject>
  );
};
