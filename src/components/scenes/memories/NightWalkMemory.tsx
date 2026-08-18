import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { InteractiveObject } from '../../interactions/InteractiveObject';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { useQualityTier } from '../../../hooks/useQualityTier';
import { ParticleSystem } from '../../effects/ParticleSystem';

export const NightWalkMemory = () => {
  const exitMemory = useExperienceStore((state) => state.exitMemory);
  const { config } = useQualityTier();
  const shadows = config.shadows;

  // Lamppost locations along the avenue
  const lamppostPositions: [number, number, number][] = useMemo(
    () => [
      [-1.6, 0, 3],
      [1.6, 0, 0],
      [-1.6, 0, -3],
      [1.6, 0, -6],
    ],
    []
  );

  const treePositions: [number, number, number][] = useMemo(
    () => [
      [-3.5, 0, -6],
      [-3.5, 0, -1],
      [-3.5, 0, 4],
      [3.5, 0, -6],
      [3.5, 0, -1],
      [3.5, 0, 4],
    ],
    []
  );

  return (
    <group position={[0, 0, 0]}>
      {/* Deep Twilight Night Lighting */}
      <ambientLight intensity={0.25} color="#1e1b4b" />
      <directionalLight
        position={[5, 12, 5]}
        intensity={0.4}
        color="#818cf8"
        castShadow={shadows}
      />

      {/* Atmospheric Twilight Sky Mesh */}
      <mesh position={[0, 5, -15]}>
        <sphereGeometry args={[30, 24, 16]} />
        <meshBasicMaterial color="#050814" side={THREE.BackSide} />
      </mesh>

      {/* Stars in Sky - using instanced ParticleSystem */}
      <ParticleSystem
        count={150}
        spread={[35, 15, 35]}
        center={[0, 10, 0]}
        color="#ffffff"
        size={0.06}
        behavior="float"
        speed={0.2}
        opacity={0.85}
      />

      {/* Ground Grass / Verge Planes */}
      <mesh position={[0, 0, 0]} receiveShadow={shadows}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#061c14" roughness={0.95} />
      </mesh>

      {/* Cobblestone Promenade Path */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={shadows}>
        <planeGeometry args={[2.4, 26, 16, 32]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.8}
          metalness={0.15}
        />
      </mesh>

      {/* Stone Curbs on Left & Right */}
      <mesh position={[-1.25, 0.06, 0]}>
        <boxGeometry args={[0.15, 0.1, 26]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <mesh position={[1.25, 0.06, 0]}>
        <boxGeometry args={[0.15, 0.1, 26]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Instanced Lamppost Bases */}
      <Instances limit={lamppostPositions.length} castShadow={shadows}>
        <cylinderGeometry args={[0.16, 0.22, 0.3, 8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.7} />
        {lamppostPositions.map((pos, idx) => (
          <Instance key={`lamp-base-${idx}`} position={[pos[0], pos[1] + 0.15, pos[2]]} />
        ))}
      </Instances>

      {/* Instanced Lamppost Poles */}
      <Instances limit={lamppostPositions.length} castShadow={shadows}>
        <cylinderGeometry args={[0.04, 0.06, 2.3, 10]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.7} />
        {lamppostPositions.map((pos, idx) => (
          <Instance key={`lamp-pole-${idx}`} position={[pos[0], pos[1] + 1.4, pos[2]]} />
        ))}
      </Instances>

      {/* Instanced Lantern Heads */}
      <Instances limit={lamppostPositions.length} castShadow={shadows}>
        <coneGeometry args={[0.2, 0.3, 6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.6} metalness={0.8} />
        {lamppostPositions.map((pos, idx) => (
          <Instance key={`lamp-head-${idx}`} position={[pos[0], pos[1] + 2.5, pos[2]]} />
        ))}
      </Instances>

      {/* Instanced Glowing Lantern Glass */}
      <Instances limit={lamppostPositions.length}>
        <boxGeometry args={[0.18, 0.22, 0.18]} />
        <meshStandardMaterial
          color="#fef08a"
          emissive="#facc15"
          emissiveIntensity={2.4}
          transparent
          opacity={0.9}
        />
        {lamppostPositions.map((pos, idx) => (
          <Instance key={`lamp-glass-${idx}`} position={[pos[0], pos[1] + 2.35, pos[2]]} />
        ))}
      </Instances>

      {/* Lamppost Point Lights */}
      {lamppostPositions.map((pos, idx) => (
        <pointLight
          key={`lamp-light-${idx}`}
          position={[pos[0], pos[1] + 2.3, pos[2]]}
          intensity={2.4}
          distance={5.5}
          color="#fbbf24"
          castShadow={shadows && idx < 2}
        />
      ))}

      {/* Instanced Tree Trunks */}
      <Instances limit={treePositions.length} castShadow={shadows}>
        <cylinderGeometry args={[0.15, 0.2, 2.4, 6]} />
        <meshStandardMaterial color="#090d16" roughness={0.95} />
        {treePositions.map((pos, idx) => (
          <Instance key={`tree-trunk-${idx}`} position={[pos[0], pos[1] + 1.2, pos[2]]} />
        ))}
      </Instances>

      {/* Instanced Tree Lower Canopy */}
      <Instances limit={treePositions.length} castShadow={shadows}>
        <coneGeometry args={[1.2, 2.2, 7]} />
        <meshStandardMaterial color="#031510" roughness={0.9} />
        {treePositions.map((pos, idx) => (
          <Instance key={`tree-bottom-${idx}`} position={[pos[0], pos[1] + 2.8, pos[2]]} />
        ))}
      </Instances>

      {/* Instanced Tree Upper Canopy */}
      <Instances limit={treePositions.length} castShadow={shadows}>
        <coneGeometry args={[0.9, 1.6, 7]} />
        <meshStandardMaterial color="#031510" roughness={0.9} />
        {treePositions.map((pos, idx) => (
          <Instance key={`tree-top-${idx}`} position={[pos[0], pos[1] + 3.8, pos[2]]} />
        ))}
      </Instances>

      {/* Floating Fireflies Along Promenade */}
      <ParticleSystem
        count={40}
        spread={[7, 3, 14]}
        center={[0, 1.5, 0]}
        color={['#fde047', '#fef08a', '#facc15']}
        size={0.09}
        behavior="firefly"
        speed={0.75}
        opacity={0.85}
      />

      {/* In-World Luminous Milestone Lantern / Return Beacon */}
      <InteractiveObject
        id="nightwalk-return-lantern"
        label="Return to World"
        position={[0, 0.4, 4.0]}
        affordance="glow"
        cameraSequenceId="memory-exit"
        onInteract={() => exitMemory()}
      >
        <group>
          <mesh castShadow={shadows}>
            <cylinderGeometry args={[0.15, 0.2, 0.4, 8]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.8}
              roughness={0.3}
            />
          </mesh>
          <pointLight intensity={1.6} color="#fde047" distance={3.5} />
        </group>
      </InteractiveObject>
    </group>
  );
};
