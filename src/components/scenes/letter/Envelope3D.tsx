import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface Envelope3DProps {
  isOpen: boolean;
  onOpen?: () => void;
}

export const Envelope3D = ({ isOpen, onOpen }: Envelope3DProps) => {
  const envelopeGroupRef = useRef<THREE.Group>(null);
  const flapRef = useRef<THREE.Mesh>(null);
  const parchmentRef = useRef<THREE.Group>(null);
  const sealRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (envelopeGroupRef.current) {
      // Gentle hovering float
      envelopeGroupRef.current.position.y = 0.9 + Math.sin(Date.now() * 0.0015) * 0.03;
      envelopeGroupRef.current.rotation.y = Math.sin(Date.now() * 0.0008) * 0.05;
    }

    if (flapRef.current) {
      // Animate flap opening
      const targetFlapAngle = isOpen ? -Math.PI * 0.85 : 0;
      flapRef.current.rotation.x = THREE.MathUtils.damp(
        flapRef.current.rotation.x,
        targetFlapAngle,
        4,
        delta
      );
    }

    if (parchmentRef.current) {
      // Animate parchment rising up
      const targetParchmentY = isOpen ? 0.35 : 0.0;
      const targetParchmentZ = isOpen ? 0.15 : 0.0;
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
    }

    if (sealRef.current) {
      const targetSealScale = isOpen ? 0 : 1;
      sealRef.current.scale.setScalar(
        THREE.MathUtils.damp(sealRef.current.scale.x, targetSealScale, 6, delta)
      );
    }
  });

  return (
    <group ref={envelopeGroupRef} position={[0, 0.9, 0]} onClick={onOpen}>
      {/* Back Plate */}
      <mesh position={[0, 0, -0.01]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 1.0, 0.02]} />
        <meshStandardMaterial
          color="#f5e6d3"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      {/* Front Fold Left/Right Wings */}
      <mesh position={[-0.38, 0, 0.01]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.75, 0.85, 0.015]} />
        <meshStandardMaterial color="#ebd5be" roughness={0.85} />
      </mesh>
      <mesh position={[0.38, 0, 0.01]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.75, 0.85, 0.015]} />
        <meshStandardMaterial color="#ebd5be" roughness={0.85} />
      </mesh>

      {/* Front Fold Bottom Flap */}
      <mesh position={[0, -0.18, 0.02]} castShadow>
        <coneGeometry args={[0.75, 0.55, 3]} />
        <meshStandardMaterial color="#dfc5aa" roughness={0.85} />
      </mesh>

      {/* Interactive Top Flap Pivot */}
      <group position={[0, 0.5, 0.02]}>
        <mesh ref={flapRef} position={[0, -0.28, 0]} castShadow>
          <coneGeometry args={[0.75, 0.56, 3]} />
          <meshStandardMaterial color="#e8d0b5" roughness={0.8} />

          {/* Red Wax Seal */}
          <mesh
            ref={sealRef}
            position={[0, -0.26, 0.03]}
            castShadow
          >
            <cylinderGeometry args={[0.13, 0.13, 0.04, 16]} />
            <meshStandardMaterial
              color="#be123c"
              roughness={0.35}
              metalness={0.15}
              emissive="#881337"
              emissiveIntensity={0.25}
            />
          </mesh>
        </mesh>
      </group>

      {/* Inside Letter Parchment Sheet */}
      <group ref={parchmentRef} position={[0, 0, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.35, 0.9, 0.01]} />
          <meshStandardMaterial
            color="#fffbf0"
            roughness={0.9}
            emissive="#fef08a"
            emissiveIntensity={isOpen ? 0.25 : 0.05}
          />
        </mesh>

        {/* Parchment Subtle Texture Lines */}
        {[-0.25, -0.1, 0.05, 0.2].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset, 0.007]}>
            <planeGeometry args={[1.0, 0.015]} />
            <meshBasicMaterial color="#d4b996" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      {/* Warm Ambient Focused Light */}
      <pointLight
        position={[0, 0.2, 0.8]}
        intensity={isOpen ? 2.5 : 1.2}
        distance={3.5}
        color="#fef08a"
      />
    </group>
  );
};
