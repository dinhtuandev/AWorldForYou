import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQualityTier } from '../../hooks/useQualityTier';

interface IntroParticlesProps {
  count?: number;
}

export const IntroParticles = ({ count = 600 }: IntroParticlesProps) => {
  const { preset } = useQualityTier();
  const pointsRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  const actualCount = Math.max(100, Math.floor(count * preset.particles));

  const [positions, initialPositions, colors] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const initPos = new Float32Array(actualCount * 3);
    const col = new Float32Array(actualCount * 3);

    const colorWarm = new THREE.Color('#fef3c7');
    const colorAmber = new THREE.Color('#f59e0b');
    const colorSoft = new THREE.Color('#e0f2fe');

    for (let i = 0; i < actualCount; i++) {
      const idx = i * 3;
      // Spherical distribution with random distance
      const radius = 0.2 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const targetX = radius * Math.sin(phi) * Math.cos(theta);
      const targetY = radius * Math.sin(phi) * Math.sin(theta);
      const targetZ = radius * Math.cos(phi);

      pos[idx] = 0;
      pos[idx + 1] = 0;
      pos[idx + 2] = 0;

      initPos[idx] = targetX;
      initPos[idx + 1] = targetY;
      initPos[idx + 2] = targetZ;

      const randomColor = Math.random();
      const chosenColor =
        randomColor > 0.6 ? colorWarm : randomColor > 0.25 ? colorAmber : colorSoft;
      col[idx] = chosenColor.r;
      col[idx + 1] = chosenColor.g;
      col[idx + 2] = chosenColor.b;
    }

    return [pos, initPos, col];
  }, [actualCount]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const progress = Math.min(1, timeRef.current / 4.0);
    // Smooth ease-out expansion factor
    const easeProgress = 1 - Math.pow(1 - progress, 3);

    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
      const array = positionAttr.array as Float32Array;

      for (let i = 0; i < actualCount; i++) {
        const idx = i * 3;
        const targetX = initialPositions[idx];
        const targetY = initialPositions[idx + 1];
        const targetZ = initialPositions[idx + 2];

        // Float drift
        const driftX = Math.sin(timeRef.current * 0.5 + i) * 0.15;
        const driftY = Math.cos(timeRef.current * 0.4 + i) * 0.15;
        const driftZ = Math.sin(timeRef.current * 0.3 + i) * 0.15;

        array[idx] = targetX * easeProgress + driftX;
        array[idx + 1] = targetY * easeProgress + driftY;
        array[idx + 2] = targetZ * easeProgress + driftZ;
      }

      positionAttr.needsUpdate = true;
      pointsRef.current.rotation.y = timeRef.current * 0.04;
      pointsRef.current.rotation.x = Math.sin(timeRef.current * 0.02) * 0.05;
    }

    if (coreRef.current) {
      const scale = 1 + Math.sin(timeRef.current * 2) * 0.15;
      coreRef.current.scale.set(scale, scale, scale);
      coreRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group>
      {/* Central glowing starlight core */}
      <mesh ref={coreRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#fffbeb" />
      </mesh>

      {/* Particle field */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
