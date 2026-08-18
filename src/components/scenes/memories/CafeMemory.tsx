import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveObject } from '../../interactions/InteractiveObject';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { useQualityTier } from '../../../hooks/useQualityTier';

export const CafeMemory = () => {
  const exitMemory = useExperienceStore((state) => state.exitMemory);
  const { config } = useQualityTier();

  const steamParticlesRef = useRef<THREE.Points>(null);
  const rainParticlesRef = useRef<THREE.Points>(null);
  const candleLightRef = useRef<THREE.PointLight>(null);

  // Rising steam particles for 2 coffee cups
  const steamCount = Math.max(10, Math.floor(50 * config.particleDensity));
  const { steamGeo, steamSeeds } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(steamCount * 3);
    const seeds = new Float32Array(steamCount * 3);

    for (let i = 0; i < steamCount; i++) {
      const isCupTwo = i % 2 === 0;
      const cupOffsetX = isCupTwo ? -0.35 : 0.35;
      const cupOffsetZ = isCupTwo ? 0.05 : -0.05;

      positions[i * 3] = cupOffsetX + (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 1] = 0.95 + Math.random() * 0.4;
      positions[i * 3 + 2] = cupOffsetZ + (Math.random() - 0.5) * 0.08;

      seeds[i * 3] = cupOffsetX;
      seeds[i * 3 + 1] = positions[i * 3 + 1];
      seeds[i * 3 + 2] = cupOffsetZ;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { steamGeo: geo, steamSeeds: seeds };
  }, [steamCount]);

  // Rain outside cafe window
  const rainCount = Math.max(30, Math.floor(150 * config.particleDensity));
  const rainGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = Math.random() * 6;
      positions[i * 3 + 2] = -3 - Math.random() * 3;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [rainCount]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Animate rising steam
    if (steamParticlesRef.current) {
      const positions = steamGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < steamCount; i++) {
        positions[i * 3 + 1] += 0.005;
        positions[i * 3] += Math.sin(elapsed * 2 + i) * 0.001;

        if (positions[i * 3 + 1] > 1.6) {
          positions[i * 3 + 1] = 0.95;
          positions[i * 3] = steamSeeds[i * 3] + (Math.random() - 0.5) * 0.06;
        }
      }
      steamGeo.attributes.position.needsUpdate = true;
    }

    // Animate falling rain
    if (rainParticlesRef.current) {
      const positions = rainGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positions[i * 3 + 1] -= 0.12;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 6;
        }
      }
      rainGeo.attributes.position.needsUpdate = true;
    }

    // Gentle candle flicker
    if (candleLightRef.current) {
      candleLightRef.current.intensity = 1.4 + Math.sin(elapsed * 6) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Warm Ambient & Interior Lighting */}
      <ambientLight intensity={0.4} color="#fef3c7" />
      <pointLight position={[0, 3.5, 0]} intensity={2.5} color="#f59e0b" castShadow={config.shadows} />
      <pointLight ref={candleLightRef} position={[0, 1.1, 0]} intensity={1.5} color="#fbbf24" />

      {/* Cafe Room Walls & Wooden Floor */}
      <mesh position={[0, 0, 0]} receiveShadow={config.shadows}>
        <boxGeometry args={[10, 0.1, 10]} />
        <meshStandardMaterial color="#451a03" roughness={0.75} metalness={0.1} />
      </mesh>

      {/* Back Wall with Window Cutout */}
      <mesh position={[-3.5, 2.5, -2.6]}>
        <boxGeometry args={[3, 5, 0.2]} />
        <meshStandardMaterial color="#27272a" roughness={0.9} />
      </mesh>
      <mesh position={[3.5, 2.5, -2.6]}>
        <boxGeometry args={[3, 5, 0.2]} />
        <meshStandardMaterial color="#27272a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 4.2, -2.6]}>
        <boxGeometry args={[4, 1.6, 0.2]} />
        <meshStandardMaterial color="#27272a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.5, -2.6]}>
        <boxGeometry args={[4, 1.0, 0.2]} />
        <meshStandardMaterial color="#27272a" roughness={0.9} />
      </mesh>

      {/* Cafe Window Glass & Frame */}
      <group position={[0, 2.3, -2.5]}>
        {/* Frame Outer */}
        <mesh>
          <boxGeometry args={[4.1, 2.8, 0.1]} />
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </mesh>
        {/* Glass with soft reflection */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[3.8, 2.5]} />
          <meshStandardMaterial
            color="#38bdf8"
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Outside Rainy Backdrop */}
      <mesh position={[0, 2.5, -6]}>
        <planeGeometry args={[14, 8]} />
        <meshBasicMaterial color="#090d16" />
      </mesh>

      {/* Falling Rain Particles Outside Window */}
      <points ref={rainParticlesRef} geometry={rainGeo}>
        <pointsMaterial
          size={0.04}
          color="#93c5fd"
          transparent
          opacity={0.6}
        />
      </points>

      {/* Overhead Hanging Pendant Lamp */}
      <group position={[0, 3.8, 0]}>
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.8, 8]} />
          <meshStandardMaterial color="#171717" />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <coneGeometry args={[0.35, 0.25, 16, 1, true]} />
          <meshStandardMaterial color="#78350f" metalness={0.7} roughness={0.3} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, -0.9, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      </group>

      {/* Wooden Cafe Table */}
      <group position={[0, 0, 0]}>
        {/* Table Top */}
        <mesh position={[0, 0.8, 0]} castShadow={config.shadows} receiveShadow={config.shadows}>
          <cylinderGeometry args={[1.05, 1.05, 0.08, 32]} />
          <meshStandardMaterial color="#78350f" roughness={0.65} metalness={0.1} />
        </mesh>
        {/* Table Leg & Base */}
        <mesh position={[0, 0.4, 0]} castShadow={config.shadows}>
          <cylinderGeometry args={[0.06, 0.08, 0.8, 16]} />
          <meshStandardMaterial color="#1c1917" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.04, 24]} />
          <meshStandardMaterial color="#1c1917" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* Wooden Cafe Chairs */}
      <group position={[-1.1, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow={config.shadows}>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#592b0e" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, -0.22]} castShadow={config.shadows}>
          <boxGeometry args={[0.5, 0.65, 0.04]} />
          <meshStandardMaterial color="#592b0e" roughness={0.8} />
        </mesh>
      </group>
      <group position={[1.1, 0.45, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh castShadow={config.shadows}>
          <boxGeometry args={[0.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#592b0e" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.35, -0.22]} castShadow={config.shadows}>
          <boxGeometry args={[0.5, 0.65, 0.04]} />
          <meshStandardMaterial color="#592b0e" roughness={0.8} />
        </mesh>
      </group>

      {/* 2 Steaming Coffee Cups on Saucers */}
      {/* Cup 1 */}
      <group position={[-0.35, 0.88, 0.05]}>
        <mesh castShadow={config.shadows}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
          <meshStandardMaterial color="#f5f5f4" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow={config.shadows}>
          <cylinderGeometry args={[0.12, 0.09, 0.14, 24]} />
          <meshStandardMaterial color="#f5f5f4" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 24]} />
          <meshStandardMaterial color="#451a03" roughness={0.4} />
        </mesh>
      </group>

      {/* Cup 2 */}
      <group position={[0.35, 0.88, -0.05]}>
        <mesh castShadow={config.shadows}>
          <cylinderGeometry args={[0.18, 0.18, 0.02, 24]} />
          <meshStandardMaterial color="#f5f5f4" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.08, 0]} castShadow={config.shadows}>
          <cylinderGeometry args={[0.12, 0.09, 0.14, 24]} />
          <meshStandardMaterial color="#f5f5f4" roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.11, 0.11, 0.01, 24]} />
          <meshStandardMaterial color="#d97706" roughness={0.4} />
        </mesh>
      </group>

      {/* Rising Steam Particles */}
      <points ref={steamParticlesRef} geometry={steamGeo}>
        <pointsMaterial
          size={0.05}
          color="#fef3c7"
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Center Table Candle / Return Affordance */}
      <InteractiveObject
        id="cafe-return-candle"
        label="Return to World"
        position={[0, 0.95, 0]}
        affordance="glow"
        cameraSequenceId="memory-exit"
        onInteract={() => exitMemory()}
      >
        <group>
          <mesh castShadow={config.shadows}>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
            <meshStandardMaterial color="#fffbeb" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.09, 0]}>
            <sphereGeometry args={[0.03, 12, 12]} />
            <meshBasicMaterial color="#f59e0b" />
          </mesh>
        </group>
      </InteractiveObject>
    </group>
  );
};
