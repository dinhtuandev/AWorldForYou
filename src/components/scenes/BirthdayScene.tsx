import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { BirthdayCake } from './birthday/BirthdayCake';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useCameraDirector } from '../../experience/CameraDirector';

const FireworksParticles = ({ active }: { active: boolean }) => {
  const count = 120;
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorPalette = [
      new THREE.Color('#f43f5e'),
      new THREE.Color('#fbbf24'),
      new THREE.Color('#ec4899'),
      new THREE.Color('#38bdf8'),
      new THREE.Color('#fcd34d'),
    ];

    for (let i = 0; i < count; i++) {
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 1.5;
      pos[i * 3 + 2] = 0;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = Math.random() * 2.5 + 1.2;

      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 1.0;
      vel[i * 3 + 2] = Math.cos(phi) * speed;

      const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, vel, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!active || !pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    for (let i = 0; i < count; i++) {
      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      x += velocities[i * 3] * delta;
      y += velocities[i * 3 + 1] * delta;
      z += velocities[i * 3 + 2] * delta;

      // Gravity and air drag
      velocities[i * 3 + 1] -= 2.0 * delta;
      velocities[i * 3] *= 0.98;
      velocities[i * 3 + 2] *= 0.98;

      posAttr.setXYZ(i, x, y, z);
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

export const BirthdayScene = () => {
  const phase = useExperienceStore((state) => state.phase);
  const { playSequence } = useCameraDirector();
  const [isExtinguished, setIsExtinguished] = useState(false);

  useEffect(() => {
    if (phase !== 'birthday') return;
    setIsExtinguished(false);
    playSequence('birthday-reveal');
  }, [phase, playSequence]);

  const handleBlowOut = useCallback(() => {
    if (isExtinguished) return;
    setIsExtinguished(true);
    playSequence('birthday-pullback');
    window.dispatchEvent(new CustomEvent('awfo:birthday-extinguished'));
  }, [isExtinguished, playSequence]);

  // Listen to external DOM trigger event
  useEffect(() => {
    const handleExtinguishEvent = () => {
      handleBlowOut();
    };
    window.addEventListener('awfo:blow-out-candles', handleExtinguishEvent);
    return () => {
      window.removeEventListener('awfo:blow-out-candles', handleExtinguishEvent);
    };
  }, [handleBlowOut]);

  return (
    <group position={[0, 0, 0]}>
      {/* Dynamic Lighting */}
      <ambientLight intensity={isExtinguished ? 0.35 : 0.15} color="#1e1b4b" />

      {/* Warm Cake Spotlight */}
      <spotLight
        position={[0, 5, 2.5]}
        target-position={[0, 0.8, 0]}
        intensity={isExtinguished ? 2.0 : 4.5}
        color={isExtinguished ? '#fbcfe8' : '#fef3c7'}
        angle={0.6}
        penumbra={0.7}
        castShadow
      />

      {/* Colorful Celebration Rim Lights */}
      {isExtinguished && (
        <>
          <pointLight position={[-3, 4, 2]} intensity={2.5} color="#f472b6" />
          <pointLight position={[3, 4, 2]} intensity={2.5} color="#38bdf8" />
          <pointLight position={[0, 5, -3]} intensity={2.0} color="#fbbf24" />
        </>
      )}

      {/* Diorama Pedestal Table */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2.5, 2.6, 0.2, 32]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>

      {/* 3D Birthday Cake */}
      <BirthdayCake
        isExtinguished={isExtinguished}
        onBlowOut={handleBlowOut}
      />

      {/* Particle Fireworks Explosions */}
      <FireworksParticles active={isExtinguished} />
    </group>
  );
};
