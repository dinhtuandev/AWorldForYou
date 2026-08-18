import { useQualityTier } from '../../hooks/useQualityTier';

const PATH_STONES: Array<[number, number, number, number]> = [
  // [x, y, z, scale]
  [0, 0.02, -0.6, 0.55],
  [-0.2, 0.02, -0.1, 0.45],
  [-0.1, 0.02, 0.5, 0.5],
  [0.3, 0.02, 1.0, 0.6],
  [0.8, 0.02, 1.4, 0.5],
  [1.4, 0.02, 1.5, 0.45],
  [-0.8, 0.02, 0.9, 0.48],
  [-1.4, 0.02, 1.1, 0.52],
  [-1.8, 0.02, 1.5, 0.4],
  [0.2, 0.02, -1.2, 0.4],
  [1.1, 0.02, -1.5, 0.45],
  [1.8, 0.02, -1.3, 0.5],
];

const PERIMETER_ROCKS: Array<[number, number, number, number, number]> = [
  // [x, y, z, scale, rotY]
  [-4.5, 0.2, -1.5, 0.7, 0.4],
  [-4.2, 0.15, 2.0, 0.6, 1.1],
  [4.0, 0.25, -2.5, 0.8, 2.3],
  [4.4, 0.2, 1.8, 0.65, 0.8],
  [-2.2, 0.1, -4.5, 0.55, 1.7],
  [2.5, 0.15, -4.2, 0.75, 0.2],
  [0.5, 0.1, 4.6, 0.6, 2.9],
  [-2.8, 0.1, 3.8, 0.5, 1.4],
];

export const Terrain = () => {
  const { preset } = useQualityTier();

  return (
    <group position={[0, 0, 0]}>
      {/* Upper lush grass platform (top surface of diorama island) */}
      <mesh
        position={[0, 0, 0]}
        receiveShadow={preset.shadows}
      >
        <cylinderGeometry args={[5.8, 6.2, 0.4, 32]} />
        <meshStandardMaterial
          color="#2e6f40"
          roughness={0.85}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Island rim ring with warm mossy tone */}
      <mesh
        position={[0, 0.1, 0]}
        receiveShadow={preset.shadows}
      >
        <cylinderGeometry args={[5.82, 5.82, 0.12, 32]} />
        <meshStandardMaterial
          color="#3c884e"
          roughness={0.9}
          metalness={0.02}
          flatShading
        />
      </mesh>

      {/* Rocky cliff underbelly (tapered floating island base) */}
      <mesh
        position={[0, -1.6, 0]}
        castShadow={preset.shadows}
        receiveShadow={preset.shadows}
      >
        <coneGeometry args={[6.2, 3.0, 16]} />
        <meshStandardMaterial
          color="#3a2e2b"
          roughness={0.95}
          metalness={0.05}
          flatShading
        />
      </mesh>

      {/* Secondary jagged underbelly layers for stylized diorama depth */}
      <mesh
        position={[0, -2.8, 0]}
        rotation={[0, Math.PI / 8, 0]}
        castShadow={preset.shadows}
      >
        <coneGeometry args={[4.2, 2.4, 8]} />
        <meshStandardMaterial
          color="#2a201e"
          roughness={0.98}
          flatShading
        />
      </mesh>

      {/* Gentle grass mounds */}
      <mesh position={[-3.2, 0.25, -2.8]} receiveShadow={preset.shadows}>
        <sphereGeometry args={[1.6, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#357a46" roughness={0.88} flatShading />
      </mesh>

      <mesh position={[3.6, 0.2, 2.4]} receiveShadow={preset.shadows}>
        <sphereGeometry args={[1.4, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d6e3e" roughness={0.88} flatShading />
      </mesh>

      <mesh position={[-2.8, 0.15, 2.6]} receiveShadow={preset.shadows}>
        <sphereGeometry args={[1.2, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#38824b" roughness={0.88} flatShading />
      </mesh>

      {/* Stepping stone pathway */}
      {PATH_STONES.map(([x, y, z, s], idx) => (
        <mesh
          key={`path-stone-${idx}`}
          position={[x, y, z]}
          rotation={[-Math.PI / 2, 0, (idx * 0.7) % Math.PI]}
          receiveShadow={preset.shadows}
        >
          <circleGeometry args={[s * 0.45, 7]} />
          <meshStandardMaterial
            color="#a8a29e"
            roughness={0.9}
            metalness={0.05}
            flatShading
          />
        </mesh>
      ))}

      {/* Natural perimeter rocks */}
      {PERIMETER_ROCKS.map(([x, y, z, s, rotY], idx) => (
        <mesh
          key={`rock-${idx}`}
          position={[x, y, z]}
          rotation={[0.1, rotY, 0.15]}
          scale={[s, s * 0.7, s]}
          castShadow={preset.shadows}
          receiveShadow={preset.shadows}
        >
          <dodecahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#6b7280"
            roughness={0.92}
            metalness={0.08}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
};
