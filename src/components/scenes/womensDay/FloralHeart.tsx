import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useQualityTier } from '../../../hooks/useQualityTier';

export interface FloralHeartProps {
  plantedCount: number;
  totalFlowers: number;
}

interface FlowerProps {
  position: [number, number, number];
  isBloomed: boolean;
  color: string;
  index: number;
  stemGeo: THREE.CylinderGeometry;
  calyxGeo: THREE.ConeGeometry;
  petalGeo: THREE.SphereGeometry;
  stamenGeo: THREE.SphereGeometry;
  stemMat: THREE.Material;
  calyxMat: THREE.Material;
  stamenMat: THREE.Material;
  shadows: boolean;
}

const Flower = ({
  position,
  isBloomed,
  color,
  index,
  stemGeo,
  calyxGeo,
  petalGeo,
  stamenGeo,
  stemMat,
  calyxMat,
  stamenMat,
  shadows,
}: FlowerProps) => {
  const flowerRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);

  const petalMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.3,
        metalness: 0.1,
      }),
    [color]
  );

  useFrame(({ clock }, delta) => {
    if (!flowerRef.current) return;
    const targetScale = isBloomed ? 1 : 0;
    flowerRef.current.scale.setScalar(
      THREE.MathUtils.damp(flowerRef.current.scale.x, targetScale, 4.5, delta)
    );

    if (isBloomed && petalsRef.current) {
      const elapsed = clock.getElapsedTime();
      petalsRef.current.rotation.y = Math.sin(elapsed * 0.8 + index) * 0.15;
    }
  });

  return (
    <group ref={flowerRef} position={position} scale={0}>
      {/* Green Stem */}
      <mesh
        position={[0, 0.2, 0]}
        geometry={stemGeo}
        material={stemMat}
        castShadow={shadows}
      />

      {/* Flower Calyx Leaves */}
      <mesh
        position={[0, 0.38, 0]}
        geometry={calyxGeo}
        material={calyxMat}
      />

      {/* Flower Petals Group */}
      <group ref={petalsRef} position={[0, 0.42, 0]}>
        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.1, 0.04, Math.sin(angle) * 0.1]}
              rotation={[0.3, -angle, 0]}
              geometry={petalGeo}
              material={petalMat}
              castShadow={shadows}
            />
          );
        })}

        {/* Central Glowing Stamen */}
        <mesh
          position={[0, 0.06, 0]}
          geometry={stamenGeo}
          material={stamenMat}
        />
      </group>

      {/* Soft Flower Point Light when bloomed */}
      {isBloomed && (
        <pointLight
          color={color}
          intensity={0.4}
          distance={1.2}
          position={[0, 0.5, 0]}
        />
      )}
    </group>
  );
};

export const FloralHeart = ({ plantedCount, totalFlowers }: FloralHeartProps) => {
  const { config } = useQualityTier();
  const shadows = config.shadows;

  // Shared reusable geometries to minimize draw allocations
  const sharedGeometries = useMemo(() => {
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.025, 0.4, 8);
    const calyxGeo = new THREE.ConeGeometry(0.06, 0.08, 5);
    const petalGeo = new THREE.SphereGeometry(0.08, 10, 10);
    const stamenGeo = new THREE.SphereGeometry(0.05, 10, 10);
    return { stemGeo, calyxGeo, petalGeo, stamenGeo };
  }, []);

  // Shared reusable materials
  const sharedMaterials = useMemo(() => {
    const stemMat = new THREE.MeshStandardMaterial({ color: '#22c55e', roughness: 0.7 });
    const calyxMat = new THREE.MeshStandardMaterial({ color: '#16a34a', roughness: 0.6 });
    const stamenMat = new THREE.MeshStandardMaterial({
      color: '#fde047',
      emissive: '#eab308',
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    return { stemMat, calyxMat, stamenMat };
  }, []);

  const flowerData = useMemo(() => {
    const palette = ['#fb7185', '#f43f5e', '#ec4899', '#f472b6', '#fda4af', '#f43f5e'];
    const nodes: { position: [number, number, number]; color: string }[] = [];

    for (let i = 0; i < totalFlowers; i++) {
      const t = (i / totalFlowers) * Math.PI * 2;
      // Mathematical Heart Curve in 3D
      const x = 16 * Math.pow(Math.sin(t), 3) * 0.11;
      const z =
        -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        ) * 0.11;
      const y = 0.05 + Math.sin(t * 2) * 0.02;

      nodes.push({
        position: [x, y, z],
        color: palette[i % palette.length],
      });
    }
    return nodes;
  }, [totalFlowers]);

  return (
    <group position={[0, 0, 0]}>
      {flowerData.map((data, idx) => (
        <Flower
          key={idx}
          index={idx}
          position={data.position}
          color={data.color}
          isBloomed={idx < plantedCount}
          stemGeo={sharedGeometries.stemGeo}
          calyxGeo={sharedGeometries.calyxGeo}
          petalGeo={sharedGeometries.petalGeo}
          stamenGeo={sharedGeometries.stamenGeo}
          stemMat={sharedMaterials.stemMat}
          calyxMat={sharedMaterials.calyxMat}
          stamenMat={sharedMaterials.stamenMat}
          shadows={shadows}
        />
      ))}
    </group>
  );
};
