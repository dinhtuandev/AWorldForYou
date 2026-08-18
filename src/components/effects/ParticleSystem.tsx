import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQualityTier } from '../../hooks/useQualityTier';

export type ParticleBehavior = 'float' | 'fall' | 'firefly' | 'wind' | 'fountain';

export interface ParticleSystemProps {
  count?: number;
  spread?: [number, number, number];
  center?: [number, number, number];
  color?: string | string[];
  size?: number;
  behavior?: ParticleBehavior;
  speed?: number;
  qualityScale?: number;
  opacity?: number;
  blending?: THREE.Blending;
  depthWrite?: boolean;
}

export const ParticleSystem = ({
  count = 100,
  spread = [10, 5, 10],
  center = [0, 0, 0],
  color = '#fde047',
  size = 0.08,
  behavior = 'float',
  speed = 1.0,
  qualityScale,
  opacity = 0.85,
  blending = THREE.AdditiveBlending,
  depthWrite = false,
}: ParticleSystemProps) => {
  const { preset } = useQualityTier();
  const pointsRef = useRef<THREE.Points>(null);

  // Compute tier-scaled count
  const effectiveQualityScale = qualityScale ?? preset.particles;
  const actualCount = Math.max(10, Math.floor(count * effectiveQualityScale));

  const [positions, initialPositions, velocities, phases, colors] = useMemo(() => {
    const pos = new Float32Array(actualCount * 3);
    const initPos = new Float32Array(actualCount * 3);
    const vel = new Float32Array(actualCount * 3);
    const phs = new Float32Array(actualCount);
    const cols = new Float32Array(actualCount * 3);

    const colorArray = Array.isArray(color) ? color : [color];
    const parsedColors = colorArray.map((c) => new THREE.Color(c));

    for (let i = 0; i < actualCount; i++) {
      const idx = i * 3;

      let x = center[0] + (Math.random() - 0.5) * spread[0];
      let y = center[1] + (Math.random() - 0.5) * spread[1];
      let z = center[2] + (Math.random() - 0.5) * spread[2];

      if (behavior === 'fountain') {
        x = center[0] + (Math.random() - 0.5) * 0.2;
        y = center[1];
        z = center[2] + (Math.random() - 0.5) * 0.2;

        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * (Math.PI / 3);
        const vSpeed = (Math.random() * 2.0 + 1.5) * speed;

        vel[idx] = Math.sin(phi) * Math.cos(theta) * vSpeed;
        vel[idx + 1] = Math.cos(phi) * vSpeed * 1.5;
        vel[idx + 2] = Math.sin(phi) * Math.sin(theta) * vSpeed;
      }

      pos[idx] = x;
      pos[idx + 1] = y;
      pos[idx + 2] = z;

      initPos[idx] = x;
      initPos[idx + 1] = y;
      initPos[idx + 2] = z;

      phs[i] = Math.random() * Math.PI * 2;

      const chosen = parsedColors[i % parsedColors.length];
      cols[idx] = chosen.r;
      cols[idx + 1] = chosen.g;
      cols[idx + 2] = chosen.b;
    }

    return [pos, initPos, vel, phs, cols];
  }, [actualCount, behavior, center, color, speed, spread]);

  useFrame(({ clock }, delta) => {
    if (!pointsRef.current) return;
    const elapsed = clock.getElapsedTime();
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    const halfSpreadX = spread[0] * 0.5;
    const halfSpreadY = spread[1] * 0.5;

    for (let i = 0; i < actualCount; i++) {
      const idx = i * 3;
      const phase = phases[i];

      let x = posAttr.getX(i);
      let y = posAttr.getY(i);
      let z = posAttr.getZ(i);

      if (behavior === 'float') {
        x = initialPositions[idx] + Math.sin(elapsed * speed * 0.6 + phase) * 0.3;
        y = initialPositions[idx + 1] + Math.cos(elapsed * speed * 0.5 + phase * 1.5) * 0.25;
        z = initialPositions[idx + 2] + Math.sin(elapsed * speed * 0.4 + phase * 2.0) * 0.3;
      } else if (behavior === 'fall') {
        y -= (0.5 + Math.sin(phase) * 0.2) * speed * delta * 2.5;
        x += Math.sin(elapsed * speed + phase) * delta * 0.4;
        z += Math.cos(elapsed * speed * 0.8 + phase) * delta * 0.3;

        if (y < center[1] - halfSpreadY) {
          y = center[1] + halfSpreadY;
          x = center[0] + (Math.random() - 0.5) * spread[0];
          z = center[2] + (Math.random() - 0.5) * spread[2];
        }
      } else if (behavior === 'firefly') {
        x = initialPositions[idx] + Math.sin(elapsed * speed * 0.8 + phase) * 0.5;
        y = initialPositions[idx + 1] + Math.cos(elapsed * speed * 0.6 + phase * 1.2) * 0.35;
        z = initialPositions[idx + 2] + Math.sin(elapsed * speed * 0.7 + phase * 1.8) * 0.5;
      } else if (behavior === 'wind') {
        x += (1.2 + Math.sin(phase) * 0.4) * speed * delta * 2.0;
        y += Math.sin(elapsed * speed * 1.2 + phase) * delta * 0.2;
        z += Math.cos(elapsed * speed + phase) * delta * 0.2;

        if (x > center[0] + halfSpreadX) {
          x = center[0] - halfSpreadX;
          y = center[1] + (Math.random() - 0.5) * spread[1];
          z = center[2] + (Math.random() - 0.5) * spread[2];
        }
      } else if (behavior === 'fountain') {
        x += velocities[idx] * delta;
        y += velocities[idx + 1] * delta;
        z += velocities[idx + 2] * delta;

        // Gravity
        velocities[idx + 1] -= 3.5 * delta;

        if (y < center[1] - 0.2) {
          x = center[0] + (Math.random() - 0.5) * 0.2;
          y = center[1];
          z = center[2] + (Math.random() - 0.5) * 0.2;

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.random() * (Math.PI / 3);
          const vSpeed = (Math.random() * 2.0 + 1.5) * speed;

          velocities[idx] = Math.sin(phi) * Math.cos(theta) * vSpeed;
          velocities[idx + 1] = Math.cos(phi) * vSpeed * 1.5;
          velocities[idx + 2] = Math.sin(phi) * Math.sin(theta) * vSpeed;
        }
      }

      posAttr.setXYZ(i, x, y, z);
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={opacity}
        blending={blending}
        depthWrite={depthWrite}
      />
    </points>
  );
};
