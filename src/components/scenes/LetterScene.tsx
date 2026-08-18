import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Envelope3D } from './letter/Envelope3D';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useCameraDirector } from '../../experience/CameraDirector';

const WarmDustParticles = () => {
  const count = 40;
  const meshRef = useRef<THREE.Points>(null);

  const [positions, scales] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sca = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = Math.random() * 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
      sca[i] = Math.random() * 0.04 + 0.01;
    }
    return [pos, sca];
  }, [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const elapsed = clock.getElapsedTime();
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      y += Math.sin(elapsed * 0.5 + i) * 0.002 + 0.001;
      if (y > 3.5) y = 0.2;
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-scale"
          args={[scales, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#fef08a"
        size={0.06}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const LetterScene = () => {
  const phase = useExperienceStore((state) => state.phase);
  const letterLineIndex = useExperienceStore((state) => state.letterLineIndex);
  const { playSequence } = useCameraDirector();

  useEffect(() => {
    if (phase !== 'letter') return;
    playSequence('letter-approach');
  }, [phase, playSequence]);

  const isEnvelopeOpen = letterLineIndex > 0;

  return (
    <group position={[0, 0, 0]}>
      {/* Intimate Dark Atmosphere Lighting */}
      <ambientLight intensity={0.15} color="#1e1b4b" />

      {/* Focused Golden Spotlight */}
      <spotLight
        position={[0, 4.5, 2.5]}
        target-position={[0, 0.9, 0]}
        intensity={3.5}
        color="#fef3c7"
        angle={0.65}
        penumbra={0.8}
        castShadow
      />

      {/* Soft Rim Light */}
      <pointLight position={[2, 2, -2]} intensity={0.8} color="#a5b4fc" />

      {/* Antique Wooden Table Surface */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.2, 32]} />
        <meshStandardMaterial
          color="#382212"
          roughness={0.75}
          metalness={0.1}
        />
      </mesh>

      {/* Floating 3D Envelope */}
      <Envelope3D isOpen={isEnvelopeOpen} />

      {/* Floating Warm Dust Particles */}
      <WarmDustParticles />
    </group>
  );
};
