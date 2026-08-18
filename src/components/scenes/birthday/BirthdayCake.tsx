import { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface BirthdayCakeProps {
  isExtinguished: boolean;
  onBlowOut?: () => void;
  onCandleExtinguished?: (remainingCount: number) => void;
}

interface CandleFlameProps {
  position: [number, number, number];
  isLit: boolean;
  index: number;
  onExtinguishSingle?: () => void;
}

const CandleFlame = ({ position, isLit, index, onExtinguishSingle }: CandleFlameProps) => {
  const flameRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (!isLit) return;
    const elapsed = clock.getElapsedTime();
    if (flameRef.current) {
      const flicker = Math.sin(elapsed * 12 + index * 3) * 0.15 + 1.0;
      flameRef.current.scale.set(flicker, flicker * 1.2, flicker);
      flameRef.current.rotation.y = elapsed * 2 + index;
    }
    if (lightRef.current) {
      lightRef.current.intensity = 1.2 + Math.sin(elapsed * 10 + index * 2) * 0.3;
    }
  });

  if (!isLit) return null;

  return (
    <group
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onExtinguishSingle?.();
      }}
    >
      {/* Candle Wick */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.1, 8]} />
        <meshBasicMaterial color="#1f2937" />
      </mesh>

      {/* Flame Geometry */}
      <mesh ref={flameRef} position={[0, 0.14, 0]}>
        <sphereGeometry args={[0.045, 12, 12]} />
        <meshStandardMaterial
          color="#f59e0b"
          emissive="#ef4444"
          emissiveIntensity={2.5}
          roughness={0.1}
          metalness={0.0}
        />
      </mesh>

      {/* Flame Glow Light */}
      <pointLight
        ref={lightRef}
        color="#fbbf24"
        distance={2.5}
        intensity={1.2}
        position={[0, 0.15, 0]}
      />
    </group>
  );
};

const SmokeParticles = ({ active }: { active: boolean }) => {
  const count = 30;
  const meshRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.4;
      pos[i * 3 + 1] = 1.5 + Math.random() * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return [pos];
  }, [count]);

  useFrame(({ clock }) => {
    if (!active || !meshRef.current) return;
    const elapsed = clock.getElapsedTime();
    const geo = meshRef.current.geometry;
    const posAttr = geo.attributes.position;
    if (!posAttr) return;

    for (let i = 0; i < count; i++) {
      let y = posAttr.getY(i);
      let x = posAttr.getX(i);
      y += 0.015;
      x += Math.sin(elapsed * 2 + i) * 0.003;
      if (y > 3.0) {
        y = 1.5;
        x = (Math.random() - 0.5) * 0.3;
      }
      posAttr.setY(i, y);
      posAttr.setX(i, x);
    }
    posAttr.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#9ca3af"
        size={0.08}
        transparent
        opacity={0.4}
        depthWrite={false}
      />
    </points>
  );
};

export const BirthdayCake = ({ isExtinguished, onBlowOut, onCandleExtinguished }: BirthdayCakeProps) => {
  const cakeRef = useRef<THREE.Group>(null);
  const [candlesLit, setCandlesLit] = useState<boolean[]>([true, true, true, true, true]);

  // Synchronize when outer scene triggers global extinguish
  useEffect(() => {
    if (isExtinguished) {
      setCandlesLit([false, false, false, false, false]);
    } else {
      setCandlesLit([true, true, true, true, true]);
    }
  }, [isExtinguished]);

  useFrame(({ clock }) => {
    if (!cakeRef.current) return;
    cakeRef.current.rotation.y = clock.getElapsedTime() * 0.15;
  });

  // Candle positions on the top tier
  const candleOffsets: [number, number, number][] = [
    [0, 1.25, 0],
    [-0.22, 1.25, 0],
    [0.22, 1.25, 0],
    [0, 1.25, -0.22],
    [0, 1.25, 0.22],
  ];

  const handleExtinguishCandle = (index: number) => {
    if (!candlesLit[index]) return;
    const nextState = [...candlesLit];
    nextState[index] = false;
    setCandlesLit(nextState);

    const remaining = nextState.filter(Boolean).length;
    onCandleExtinguished?.(remaining);
    window.dispatchEvent(
      new CustomEvent('awfo:candle-tapped', { detail: { remaining, index } })
    );

    if (remaining === 0) {
      onBlowOut?.();
    }
  };

  const isAllExtinguished = isExtinguished || candlesLit.every((lit) => !lit);

  return (
    <group
      ref={cakeRef}
      position={[0, 0, 0]}
      onClick={() => {
        if (!isAllExtinguished) {
          onBlowOut?.();
        }
      }}
    >
      {/* Cake Stand Base */}
      <mesh position={[0, 0.1, 0]} receiveShadow>
        <cylinderGeometry args={[1.5, 1.6, 0.15, 32]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.22, 0]} receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.15, 16]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.5} />
      </mesh>

      {/* Tier 1 - Bottom Cake Layer */}
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.5, 32]} />
        <meshStandardMaterial color="#fdf2f8" roughness={0.6} />
      </mesh>
      {/* Tier 1 Frosting Trim */}
      <mesh position={[0, 0.78, 0]}>
        <torusGeometry args={[1.2, 0.04, 16, 32]} />
        <meshStandardMaterial color="#f472b6" roughness={0.4} />
      </mesh>

      {/* Tier 2 - Top Cake Layer */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.75, 0.75, 0.45, 32]} />
        <meshStandardMaterial color="#fff1f2" roughness={0.6} />
      </mesh>
      {/* Tier 2 Frosting Trim */}
      <mesh position={[0, 1.22, 0]}>
        <torusGeometry args={[0.75, 0.035, 16, 32]} />
        <meshStandardMaterial color="#f472b6" roughness={0.4} />
      </mesh>

      {/* Cream Dollops on top layer */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 0.6;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * radius, 1.24, Math.sin(angle) * radius]}
          >
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color="#fb7185" roughness={0.3} />
          </mesh>
        );
      })}

      {/* Candles & Flames */}
      {candleOffsets.map((pos, i) => (
        <group
          key={i}
          position={pos}
          onClick={(e) => {
            e.stopPropagation();
            handleExtinguishCandle(i);
          }}
        >
          {/* Candle stick */}
          <mesh position={[0, -0.05, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#f43f5e' : '#fbbf24'}
              roughness={0.5}
            />
          </mesh>
          <CandleFlame
            position={[0, 0.06, 0]}
            isLit={candlesLit[i] && !isExtinguished}
            index={i}
            onExtinguishSingle={() => handleExtinguishCandle(i)}
          />
        </group>
      ))}

      {/* Smoke from extinguished candles */}
      <SmokeParticles active={isAllExtinguished} />
    </group>
  );
};
