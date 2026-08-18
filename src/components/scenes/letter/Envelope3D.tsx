import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface Envelope3DProps {
  isOpen: boolean;
  onOpen?: () => void;
}

export const Envelope3D = ({ isOpen, onOpen }: Envelope3DProps) => {
  const envelopeGroupRef = useRef<THREE.Group>(null);
  const flapPivotRef = useRef<THREE.Group>(null);
  const parchmentRef = useRef<THREE.Group>(null);
  const sealRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (envelopeGroupRef.current) {
      // Gentle subtle breathing float on the desk
      envelopeGroupRef.current.position.y = 0.35 + Math.sin(Date.now() * 0.0015) * 0.015;
    }

    if (flapPivotRef.current) {
      // Animate top flap opening smoothly
      const targetFlapAngle = isOpen ? -Math.PI * 0.85 : 0;
      flapPivotRef.current.rotation.x = THREE.MathUtils.damp(
        flapPivotRef.current.rotation.x,
        targetFlapAngle,
        4.5,
        delta
      );
    }

    if (parchmentRef.current) {
      // Animate parchment sheet sliding up and hovering above envelope
      const targetParchmentY = isOpen ? 0.35 : 0.0;
      const targetParchmentZ = isOpen ? 0.08 : 0.005;
      const targetParchmentRotX = isOpen ? -0.1 : 0.0;

      parchmentRef.current.position.y = THREE.MathUtils.damp(
        parchmentRef.current.position.y,
        targetParchmentY,
        3.5,
        delta
      );
      parchmentRef.current.position.z = THREE.MathUtils.damp(
        parchmentRef.current.position.z,
        targetParchmentZ,
        3.5,
        delta
      );
      parchmentRef.current.rotation.x = THREE.MathUtils.damp(
        parchmentRef.current.rotation.x,
        targetParchmentRotX,
        3.5,
        delta
      );
    }

    if (sealRef.current) {
      const targetSealScale = isOpen ? 0.001 : 1;
      sealRef.current.scale.setScalar(
        THREE.MathUtils.damp(sealRef.current.scale.x, targetSealScale, 6, delta)
      );
    }
  });

  return (
    <group
      ref={envelopeGroupRef}
      position={[0, 0.35, 0]}
      rotation={[-0.45, 0, 0]} // Tilted naturally towards camera on the desk
      onClick={onOpen}
    >
      {/* Envelope Main Body Back Plate */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.0, 0.012]} />
        <meshStandardMaterial
          color="#f5e8d7"
          roughness={0.7}
          metalness={0.05}
        />
      </mesh>

      {/* Envelope Pocket Front Face (Clean flat quad layer) */}
      <mesh position={[0, -0.05, 0.012]} castShadow receiveShadow>
        <planeGeometry args={[1.48, 0.88]} />
        <meshStandardMaterial
          color="#ebd5be"
          roughness={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Decorative Fold Seams (Subtle diagonal line accents) */}
      <mesh position={[-0.37, -0.05, 0.014]} rotation={[0, 0, 0.52]}>
        <planeGeometry args={[0.85, 0.01]} />
        <meshBasicMaterial color="#d4b996" transparent opacity={0.6} />
      </mesh>
      <mesh position={[0.37, -0.05, 0.014]} rotation={[0, 0, -0.52]}>
        <planeGeometry args={[0.85, 0.01]} />
        <meshBasicMaterial color="#d4b996" transparent opacity={0.6} />
      </mesh>

      {/* Top Triangular Flap Pivot */}
      <group ref={flapPivotRef} position={[0, 0.48, 0.014]}>
        {/* Flap Plane (flat triangle facing down when closed) */}
        <mesh position={[0, -0.25, 0]} rotation={[0, 0, Math.PI]} castShadow>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[
                new Float32Array([
                  -0.74, 0.25, 0,
                   0.74, 0.25, 0,
                   0.0, -0.25, 0,
                ]),
                3,
              ]}
            />
          </bufferGeometry>
          <meshStandardMaterial
            color="#dfc5aa"
            roughness={0.75}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Golden-Rimmed Red Wax Seal */}
        <group position={[0, -0.24, 0.01]}>
          <mesh ref={sealRef} castShadow>
            <cylinderGeometry args={[0.11, 0.12, 0.025, 20]} />
            <meshStandardMaterial
              color="#be123c"
              roughness={0.3}
              metalness={0.2}
              emissive="#881337"
              emissiveIntensity={0.3}
            />
          </mesh>
          <mesh position={[0, 0, 0.012]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.07, 0.09, 16]} />
            <meshStandardMaterial
              color="#fbbf24"
              metalness={0.8}
              roughness={0.2}
              emissive="#f59e0b"
              emissiveIntensity={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* Inside Letter Parchment Sheet */}
      <group ref={parchmentRef} position={[0, 0, 0.006]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.88, 0.008]} />
          <meshStandardMaterial
            color="#fffdf5"
            roughness={0.85}
            emissive="#fef08a"
            emissiveIntensity={isOpen ? 0.12 : 0.02}
          />
        </mesh>

        {/* Written Lines Impression (Subtle vintage script lines) */}
        {[-0.22, -0.08, 0.06, 0.2].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset, 0.005]}>
            <planeGeometry args={[1.05, 0.012]} />
            <meshBasicMaterial color="#cbb194" transparent opacity={0.5} />
          </mesh>
        ))}
      </group>

      {/* Warm Ambient Focused Point Light */}
      <pointLight
        position={[0, 0.4, 0.6]}
        intensity={isOpen ? 3.2 : 1.5}
        distance={4.0}
        color="#fef08a"
      />
    </group>
  );
};
