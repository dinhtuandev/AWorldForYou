import { useMemo } from 'react';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { useQualityTier } from '../../hooks/useQualityTier';

const PINE_TREES: Array<[number, number, number, number, number]> = [
  // [x, y, z, scale, rotY]
  [-3.8, 0.1, -2.8, 1.25, 0.5],
  [-4.2, 0.1, -1.0, 0.95, 1.2],
  [-3.5, 0.1, 0.5, 1.1, 2.1],
  [-2.2, 0.1, -3.8, 0.85, 0.8],
  [2.8, 0.1, -3.6, 1.15, 1.7],
  [3.8, 0.1, -2.2, 1.3, 0.3],
  [4.2, 0.1, -0.5, 0.9, 2.6],
  [4.0, 0.1, 1.2, 1.05, 1.9],
  [-3.2, 0.1, 2.8, 0.8, 0.2],
  [3.0, 0.1, 3.2, 0.75, 1.4],
];

const ROUND_TREES: Array<[number, number, number, number, string]> = [
  // [x, y, z, scale, color]
  [-1.6, 0.1, -3.9, 1.0, '#166534'],
  [1.6, 0.1, -3.8, 0.95, '#15803d'],
  [3.6, 0.1, 2.6, 0.85, '#16a34a'],
  [-3.9, 0.1, 1.8, 0.9, '#15803d'],
  [4.4, 0.1, 0.2, 0.8, '#166534'],
];

const BUSHES: Array<[number, number, number, number, string]> = [
  // [x, y, z, scale, color]
  [-1.2, 0.2, -1.5, 0.55, '#15803d'],
  [1.4, 0.2, -1.2, 0.6, '#16a34a'],
  [-0.6, 0.15, 1.5, 0.45, '#22c55e'],
  [1.8, 0.15, 0.8, 0.5, '#15803d'],
  [-2.4, 0.2, 1.8, 0.65, '#166534'],
  [0.8, 0.15, 2.5, 0.4, '#22c55e'],
  [-1.8, 0.15, -0.5, 0.5, '#16a34a'],
  [2.2, 0.2, -2.4, 0.6, '#15803d'],
];

export const Trees = () => {
  const { config } = useQualityTier();
  const shadows = config.shadows;

  const foliageColor1 = useMemo(() => new THREE.Color('#14532d'), []);
  const foliageColor2 = useMemo(() => new THREE.Color('#166534'), []);
  const foliageColor3 = useMemo(() => new THREE.Color('#15803d'), []);

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Pine Trunks Instanced */}
      <Instances
        limit={PINE_TREES.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <cylinderGeometry args={[0.12, 0.18, 1.2, 7]} />
        <meshStandardMaterial color="#451a03" roughness={0.9} flatShading />
        {PINE_TREES.map(([x, y, z, s, r], idx) => (
          <Instance
            key={`pine-t-${idx}`}
            position={[x, y + 0.6 * s, z]}
            scale={[s, s, s]}
            rotation={[0, r, 0]}
          />
        ))}
      </Instances>

      {/* 2. Pine Bottom Tier Cones */}
      <Instances
        limit={PINE_TREES.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <coneGeometry args={[1.0, 1.3, 7]} />
        <meshStandardMaterial color={foliageColor1} roughness={0.8} flatShading />
        {PINE_TREES.map(([x, y, z, s, r], idx) => (
          <Instance
            key={`pine-b-${idx}`}
            position={[x, y + 1.4 * s, z]}
            scale={[s, s, s]}
            rotation={[0, r, 0]}
          />
        ))}
      </Instances>

      {/* 3. Pine Mid Tier Cones */}
      <Instances
        limit={PINE_TREES.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <coneGeometry args={[0.78, 1.1, 7]} />
        <meshStandardMaterial color={foliageColor2} roughness={0.8} flatShading />
        {PINE_TREES.map(([x, y, z, s, r], idx) => (
          <Instance
            key={`pine-m-${idx}`}
            position={[x, y + 2.0 * s, z]}
            scale={[s, s, s]}
            rotation={[0, r, 0]}
          />
        ))}
      </Instances>

      {/* 4. Pine Top Tier Cones */}
      <Instances
        limit={PINE_TREES.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <coneGeometry args={[0.55, 0.9, 7]} />
        <meshStandardMaterial color={foliageColor3} roughness={0.75} flatShading />
        {PINE_TREES.map(([x, y, z, s, r], idx) => (
          <Instance
            key={`pine-top-${idx}`}
            position={[x, y + 2.55 * s, z]}
            scale={[s, s, s]}
            rotation={[0, r, 0]}
          />
        ))}
      </Instances>

      {/* 5. Round Tree Trunks Instanced */}
      <Instances
        limit={ROUND_TREES.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <cylinderGeometry args={[0.14, 0.2, 1.4, 6]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} flatShading />
        {ROUND_TREES.map(([x, y, z, s], idx) => (
          <Instance
            key={`round-t-${idx}`}
            position={[x, y + 0.7 * s, z]}
            scale={[s, s, s]}
          />
        ))}
      </Instances>

      {/* 6. Round Tree Foliage & Bushes Combined Dodecahedrons */}
      <Instances
        limit={ROUND_TREES.length * 3 + BUSHES.length}
        castShadow={shadows}
        receiveShadow={shadows}
      >
        <dodecahedronGeometry args={[1, 1]} />
        <meshStandardMaterial roughness={0.8} flatShading />

        {/* Round Tree Top Nodes */}
        {ROUND_TREES.map(([x, y, z, s, col], idx) => (
          <group key={`round-foliage-${idx}`}>
            <Instance
              position={[x, y + 1.8 * s, z]}
              scale={[0.9 * s, 0.9 * s, 0.9 * s]}
              color={col}
            />
            <Instance
              position={[x - 0.25 * s, y + 2.2 * s, z + 0.1 * s]}
              scale={[0.65 * s, 0.65 * s, 0.65 * s]}
              color={col}
            />
            <Instance
              position={[x + 0.25 * s, y + 2.1 * s, z - 0.15 * s]}
              scale={[0.6 * s, 0.6 * s, 0.6 * s]}
              color={col}
            />
          </group>
        ))}

        {/* Bushes */}
        {BUSHES.map(([x, y, z, s, col], idx) => (
          <Instance
            key={`bush-${idx}`}
            position={[x, y, z]}
            scale={[0.6 * s, 0.6 * s, 0.6 * s]}
            color={col}
          />
        ))}
      </Instances>
    </group>
  );
};
