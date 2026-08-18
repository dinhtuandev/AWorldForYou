import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQualityTier } from '../../hooks/useQualityTier';

interface CloudClusterProps {
  initialPosition: [number, number, number];
  speed: number;
  scale?: number;
}

const CloudCluster = ({
  initialPosition,
  speed,
  scale = 1,
}: CloudClusterProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const positionXRef = useRef(initialPosition[0]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    positionXRef.current += speed * delta;
    // Wrap around boundaries between -18 and 18
    if (positionXRef.current > 18) {
      positionXRef.current = -18;
    } else if (positionXRef.current < -18) {
      positionXRef.current = 18;
    }

    groupRef.current.position.x = positionXRef.current;
    groupRef.current.position.y =
      initialPosition[1] + Math.sin(positionXRef.current * 0.4) * 0.2;
  });

  return (
    <group
      ref={groupRef}
      position={initialPosition}
      scale={scale}
    >
      {/* Cluster of soft low-poly puff spheres */}
      <mesh position={[0, 0, 0]}>
        <dodecahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial
          color="#fdf4ff"
          roughness={0.95}
          metalness={0.0}
          flatShading
          transparent
          opacity={0.88}
        />
      </mesh>
      <mesh position={[0.9, -0.15, 0.2]}>
        <dodecahedronGeometry args={[0.9, 1]} />
        <meshStandardMaterial
          color="#fce7f3"
          roughness={0.95}
          flatShading
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[-0.8, -0.2, -0.1]}>
        <dodecahedronGeometry args={[0.85, 1]} />
        <meshStandardMaterial
          color="#fae8ff"
          roughness={0.95}
          flatShading
          transparent
          opacity={0.85}
        />
      </mesh>
      <mesh position={[0.3, 0.45, -0.2]}>
        <dodecahedronGeometry args={[0.75, 1]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.95}
          flatShading
          transparent
          opacity={0.9}
        />
      </mesh>
    </group>
  );
};

const ALL_CLOUDS: CloudClusterProps[] = [
  { initialPosition: [-12, 7.5, -6], speed: 0.35, scale: 1.3 },
  { initialPosition: [-2, 6.0, -10], speed: 0.22, scale: 1.5 },
  { initialPosition: [6, 8.2, 5], speed: 0.28, scale: 1.1 },
];

export const Clouds = () => {
  const { config } = useQualityTier();
  const visibleClouds = ALL_CLOUDS.slice(0, config.cloudsCount);

  return (
    <group position={[0, 0, 0]}>
      {visibleClouds.map((cloud, idx) => (
        <CloudCluster
          key={`cloud-${idx}`}
          initialPosition={cloud.initialPosition}
          speed={cloud.speed}
          scale={cloud.scale}
        />
      ))}
    </group>
  );
};
