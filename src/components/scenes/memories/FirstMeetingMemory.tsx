import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveObject } from '../../interactions/InteractiveObject';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { useQualityTier } from '../../../hooks/useQualityTier';

export const FirstMeetingMemory = () => {
  const exitMemory = useExperienceStore((state) => state.exitMemory);
  const { config } = useQualityTier();

  const crystalRef = useRef<THREE.Mesh>(null);
  const orbitRing1Ref = useRef<THREE.Group>(null);
  const orbitRing2Ref = useRef<THREE.Group>(null);
  const stardustRef = useRef<THREE.Points>(null);

  // Floating stardust particles within the spotlight beam
  const particleCount = Math.max(25, Math.floor(150 * config.particleDensity));
  const stardustGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const radius = Math.random() * 2.8;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.random() * 4.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [particleCount]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Central Spark / Crystal rotation & floating
    if (crystalRef.current) {
      crystalRef.current.rotation.y = elapsed * 0.6;
      crystalRef.current.rotation.x = Math.sin(elapsed * 0.4) * 0.2;
      crystalRef.current.position.y = 1.2 + Math.sin(elapsed * 1.5) * 0.08;
    }

    // Floating orbital rings
    if (orbitRing1Ref.current) {
      orbitRing1Ref.current.rotation.y = elapsed * 0.3;
      orbitRing1Ref.current.rotation.z = Math.sin(elapsed * 0.2) * 0.15;
    }
    if (orbitRing2Ref.current) {
      orbitRing2Ref.current.rotation.y = -elapsed * 0.25;
      orbitRing2Ref.current.rotation.x = Math.cos(elapsed * 0.3) * 0.2;
    }

    // Swirling stardust
    if (stardustRef.current) {
      const positions = stardustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += 0.006;
        if (positions[i * 3 + 1] > 4.5) {
          positions[i * 3 + 1] = 0.1;
        }
      }
      stardustGeo.attributes.position.needsUpdate = true;
      stardustRef.current.rotation.y = elapsed * 0.08;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Intimate Symbolic Lighting */}
      <ambientLight intensity={0.2} color="#fdf4ff" />

      {/* Dramatic Theatrical Spotlight Beam on Center Stage */}
      <spotLight
        position={[0, 7, 0]}
        intensity={5.0}
        angle={0.5}
        penumbra={0.7}
        color="#fdf4ff"
        castShadow={config.shadows}
      />
      <pointLight position={[0, 1.2, 0]} intensity={2.0} color="#ec4899" distance={4} />

      {/* Deep Cosmos Backdrop Sphere */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[25, 24, 16]} />
        <meshBasicMaterial color="#030014" side={THREE.BackSide} />
      </mesh>

      {/* Floating Crystalline Starlit Terrace Platform */}
      <group position={[0, 0, 0]}>
        {/* Main Upper Terrace Disc */}
        <mesh position={[0, 0, 0]} receiveShadow={config.shadows}>
          <cylinderGeometry args={[2.8, 2.9, 0.2, 32]} />
          <meshStandardMaterial
            color="#fdf2f8"
            roughness={0.15}
            metalness={0.3}
          />
        </mesh>

        {/* Outer Inlay Ring */}
        <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[2.4, 2.6, 32]} />
          <meshBasicMaterial color="#f472b6" />
        </mesh>

        {/* Inner Geometric Star Inlay */}
        <mesh position={[0, 0.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.2, 1.35, 24]} />
          <meshBasicMaterial color="#e879f9" />
        </mesh>

        {/* Lower Floating Foundation Tier */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[2.3, 2.0, 0.3, 24]} />
          <meshStandardMaterial color="#831843" roughness={0.5} metalness={0.5} />
        </mesh>
      </group>

      {/* Orbital Celestial Glow Rings */}
      <group ref={orbitRing1Ref} position={[0, 1.2, 0]} rotation={[0.4, 0, 0]}>
        <mesh>
          <torusGeometry args={[2.1, 0.02, 16, 64]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#db2777"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      <group ref={orbitRing2Ref} position={[0, 1.2, 0]} rotation={[-0.5, 0, 0.3]}>
        <mesh>
          <torusGeometry args={[1.7, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#9333ea"
            emissiveIntensity={1.5}
          />
        </mesh>
      </group>

      {/* Floating Center Crystal / Spark of Meeting */}
      <group position={[0, 0, 0]}>
        <mesh ref={crystalRef} castShadow={config.shadows}>
          <octahedronGeometry args={[0.38, 0]} />
          <meshStandardMaterial
            color="#f43f5e"
            roughness={0.1}
            metalness={0.8}
            emissive="#be123c"
            emissiveIntensity={0.8}
          />
        </mesh>
      </group>

      {/* Floating Stardust Particles */}
      <points ref={stardustRef} geometry={stardustGeo}>
        <pointsMaterial
          size={0.05}
          color="#fdf4ff"
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* In-World Return Affordance Beacon */}
      <InteractiveObject
        id="firstmeeting-return-beacon"
        label="Return to World"
        position={[0, 0.3, 2.2]}
        affordance="glow"
        cameraSequenceId="memory-exit"
        onInteract={() => exitMemory()}
      >
        <group>
          <mesh castShadow={config.shadows}>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial
              color="#f472b6"
              emissive="#ec4899"
              emissiveIntensity={1.4}
              roughness={0.2}
            />
          </mesh>
          <pointLight intensity={1.2} color="#f472b6" distance={2.5} />
        </group>
      </InteractiveObject>
    </group>
  );
};
