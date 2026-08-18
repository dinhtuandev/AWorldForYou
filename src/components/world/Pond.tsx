import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Instances, Instance } from '@react-three/drei';
import * as THREE from 'three';
import { useQualityTier } from '../../hooks/useQualityTier';
import { createWaterMaterial } from '../effects/shaders/water';

const POND_STONES: Array<[number, number, number, number]> = [
  // [angle, radius, scale, rotY]
  [0, 1.4, 0.28, 0.4],
  [0.6, 1.38, 0.32, 1.2],
  [1.2, 1.45, 0.25, 2.1],
  [1.8, 1.4, 0.35, 0.8],
  [2.4, 1.36, 0.3, 1.7],
  [3.0, 1.42, 0.28, 2.9],
  [3.6, 1.38, 0.34, 0.3],
  [4.2, 1.44, 0.26, 1.5],
  [4.8, 1.39, 0.32, 2.4],
  [5.4, 1.41, 0.29, 0.9],
  [6.0, 1.37, 0.31, 1.8],
];

const LILY_PADS: Array<[number, number, number]> = [
  [-0.4, 0.3, 0.35],
  [0.3, -0.4, 0.28],
  [0.5, 0.3, 0.24],
  [-0.2, -0.5, 0.2],
];

export interface PondProps {
  position?: [number, number, number];
}

export const Pond = ({ position = [2.2, 0.05, 0.6] }: PondProps) => {
  const { qualityTier, config } = useQualityTier();
  const waterMeshRef = useRef<THREE.Mesh>(null);
  const lilyGroupRef = useRef<THREE.Group>(null);

  const isShaderSupported = qualityTier !== 'low';
  const qualityMultiplier = qualityTier === 'high' ? 1.0 : 0.6;

  // Create custom water shader material for high/medium tiers
  const waterShaderMat = useMemo(() => {
    if (!isShaderSupported) return null;
    return createWaterMaterial(qualityMultiplier);
  }, [isShaderSupported, qualityMultiplier]);

  useEffect(() => {
    return () => {
      waterShaderMat?.dispose();
    };
  }, [waterShaderMat]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Update custom shader uniforms
    if (waterShaderMat) {
      waterShaderMat.uniforms.uTime.value = elapsed;
    } else if (waterMeshRef.current) {
      // Fallback low-tier subtle pulsation
      const material = waterMeshRef.current.material as THREE.MeshStandardMaterial;
      if (material && material.roughness !== undefined) {
        material.roughness = 0.15 + Math.sin(elapsed * 1.2) * 0.05;
      }
    }

    // Floating bob for lily pads
    if (lilyGroupRef.current) {
      lilyGroupRef.current.position.y = 0.04 + Math.sin(elapsed * 1.5) * 0.008;
      lilyGroupRef.current.rotation.y = Math.sin(elapsed * 0.3) * 0.04;
    }
  });

  return (
    <group position={position}>
      {/* Pond Basin Depression */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.04, 0]}
        receiveShadow={config.shadows}
      >
        <circleGeometry args={[1.42, 24]} />
        <meshStandardMaterial color="#172554" roughness={0.9} />
      </mesh>

      {/* Animated Shader Water Disc / Fallback Material */}
      <mesh
        ref={waterMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.02, 0]}
        receiveShadow={config.shadows}
        material={waterShaderMat ?? undefined}
      >
        <circleGeometry args={[1.35, isShaderSupported ? config.waterSubdivisions : 16]} />
        {!waterShaderMat && (
          <meshStandardMaterial
            color="#1e3a8a"
            roughness={0.12}
            metalness={0.65}
            transparent
            opacity={0.88}
          />
        )}
      </mesh>

      {/* Water Surface Deep Underglow */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
      >
        <circleGeometry args={[1.1, 24]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Perimeter Stones Instanced */}
      <Instances
        limit={POND_STONES.length}
        castShadow={config.shadows}
        receiveShadow={config.shadows}
      >
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#64748b" roughness={0.9} flatShading />
        {POND_STONES.map(([angle, rad, scale, rotY], idx) => {
          const x = Math.cos(angle) * rad;
          const z = Math.sin(angle) * rad;
          return (
            <Instance
              key={`pond-stone-${idx}`}
              position={[x, 0.04, z]}
              rotation={[0.1, rotY, 0.1]}
              scale={[scale, scale * 0.6, scale]}
            />
          );
        })}
      </Instances>

      {/* Floating Lily Pads & Glowing Water Lotus */}
      <group ref={lilyGroupRef} position={[0, 0.04, 0]}>
        {LILY_PADS.map(([x, z, s], idx) => (
          <group key={`lily-${idx}`} position={[x, 0, z]}>
            {/* Lily Pad Disc */}
            <mesh rotation={[-Math.PI / 2, 0, idx * 1.5]}>
              <circleGeometry args={[s, 12, 0, Math.PI * 1.85]} />
              <meshStandardMaterial
                color="#15803d"
                roughness={0.6}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Lotus Flower on center pad */}
            {idx === 0 && (
              <mesh position={[0, 0.04, 0]}>
                <dodecahedronGeometry args={[0.08, 0]} />
                <meshStandardMaterial
                  color="#f472b6"
                  emissive="#ec4899"
                  emissiveIntensity={1.4}
                  roughness={0.3}
                />
              </mesh>
            )}
          </group>
        ))}
      </group>
    </group>
  );
};
