import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveObject } from '../interactions/InteractiveObject';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useQualityTier } from '../../hooks/useQualityTier';
import type { Memory } from '../../types/experience.types';

export interface PhotoFrameProps {
  memory: Memory;
}

const PhotoImage = ({ imageSrc, fallbackColor }: { imageSrc: string; fallbackColor: string }) => {
  try {
    const texture = useTexture(imageSrc);
    return (
      <mesh position={[0, 0.35, 0.05]} rotation={[0.08, 0, 0]}>
        <planeGeometry args={[0.62, 0.72]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.3}
          metalness={0.05}
          emissive="#ffffff"
          emissiveIntensity={0.06}
        />
      </mesh>
    );
  } catch {
    return (
      <mesh position={[0, 0.35, 0.05]} rotation={[0.08, 0, 0]}>
        <planeGeometry args={[0.62, 0.72]} />
        <meshStandardMaterial
          color={fallbackColor}
          roughness={0.4}
          metalness={0.2}
          emissive={fallbackColor}
          emissiveIntensity={0.25}
        />
      </mesh>
    );
  }
};

const FallbackColorMesh = ({ color }: { color: string }) => (
  <mesh position={[0, 0.35, 0.05]} rotation={[0.08, 0, 0]}>
    <planeGeometry args={[0.62, 0.72]} />
    <meshStandardMaterial
      color={color}
      roughness={0.4}
      metalness={0.2}
      emissive={color}
      emissiveIntensity={0.25}
    />
  </mesh>
);

export const PhotoFrame = ({ memory }: PhotoFrameProps) => {
  const enterMemory = useExperienceStore((state) => state.enterMemory);
  const { preset } = useQualityTier();
  const floatRef = useRef<THREE.Group>(null);
  const starSparkRef = useRef<THREE.Mesh>(null);

  // Subtle floating breathing effect
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    const hash = memory.id.charCodeAt(memory.id.length - 1) || 1;
    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(elapsed * 1.5 + hash) * 0.04;
    }
    if (starSparkRef.current) {
      starSparkRef.current.rotation.z = elapsed * 0.8;
    }
  });

  const cameraSeqId = `memory-portal-${memory.scene}`;

  const sceneColor =
    memory.scene === 'beach'
      ? '#f97316'
      : memory.scene === 'cafe'
      ? '#f59e0b'
      : memory.scene === 'nightWalk'
      ? '#6366f1'
      : '#ec4899';

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
          rotation={[0.08, 0, 0]}
          castShadow={preset.shadows}
          receiveShadow={preset.shadows}
        >
          <boxGeometry args={[0.88, 1.08, 0.08]} />
          <meshStandardMaterial
            color="#d97706"
            metalness={0.7}
            roughness={0.3}
            emissive="#b45309"
            emissiveIntensity={0.15}
          />
        </mesh>

        {/* Inner Photo Canvas/Matte */}
        <mesh
          position={[0, 0.3, 0.044]}
          rotation={[0.08, 0, 0]}
        >
          <planeGeometry args={[0.72, 0.92]} />
          <meshStandardMaterial
            color="#fffdf5"
            roughness={0.6}
          />
        </mesh>

        {/* Real Demo Memory Image with Suspense */}
        <Suspense fallback={<FallbackColorMesh color={sceneColor} />}>
          <PhotoImage imageSrc={memory.image} fallbackColor={sceneColor} />
        </Suspense>

        {/* Decorative Golden Star Spark / Crest at top of frame */}
        <mesh
          ref={starSparkRef}
          position={[0, 0.88, 0.05]}
        >
          <octahedronGeometry args={[0.06, 0]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#facc15"
            emissiveIntensity={2.0}
            roughness={0.1}
          />
        </mesh>

        {/* Subtle Ambient Glow Light */}
        <pointLight
          position={[0, 0.35, 0.3]}
          distance={2.5}
          intensity={1.2}
          color={sceneColor}
        />
      </group>
    </InteractiveObject>
  );
};
