import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InteractiveObject } from '../../interactions/InteractiveObject';
import { useExperienceStore } from '../../../experience/ExperienceState';
import { useQualityTier } from '../../../hooks/useQualityTier';
import { ParticleSystem } from '../../effects/ParticleSystem';

export const BeachMemory = () => {
  const exitMemory = useExperienceStore((state) => state.exitMemory);
  const { config } = useQualityTier();

  const oceanMeshRef = useRef<THREE.Mesh>(null);
  const sunMeshRef = useRef<THREE.Mesh>(null);

  const segs = config.waterSubdivisions;

  // Ocean wave geometry & initial vertex positions
  const { oceanGeo, origPositions } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(50, 40, segs, segs);
    geo.rotateX(-Math.PI / 2);
    const orig = new Float32Array(geo.attributes.position.array);
    return { oceanGeo: geo, origPositions: orig };
  }, [segs]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    // Undulating waves
    if (oceanMeshRef.current) {
      const posAttr = oceanGeo.attributes.position;
      const posArray = posAttr.array as Float32Array;

      for (let i = 0; i < posAttr.count; i++) {
        const x = origPositions[i * 3];
        const z = origPositions[i * 3 + 2];
        const wave1 = Math.sin(x * 0.35 + elapsed * 1.6) * 0.14;
        const wave2 = Math.cos(z * 0.45 + elapsed * 1.2) * 0.12;
        const wave3 = Math.sin((x + z) * 0.25 + elapsed * 2.0) * 0.06;
        posArray[i * 3 + 1] = origPositions[i * 3 + 1] + wave1 + wave2 + wave3;
      }
      posAttr.needsUpdate = true;
      oceanGeo.computeVertexNormals();
    }

    // Sun gentle pulse
    if (sunMeshRef.current) {
      const scale = 1 + Math.sin(elapsed * 0.8) * 0.04;
      sunMeshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sunset Golden Hour Lighting */}
      <ambientLight intensity={0.55} color="#fed7aa" />
      <directionalLight
        position={[0, 6, -20]}
        intensity={2.8}
        color="#fb923c"
        castShadow={config.shadows}
      />
      <pointLight position={[0, 2, -10]} intensity={1.5} color="#fdba74" />

      {/* Atmospheric Horizon Sunset Glow Sky Dome */}
      <mesh position={[0, 0, -25]}>
        <sphereGeometry args={[35, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial
          color="#c2410c"
          side={THREE.BackSide}
          fog={false}
        />
      </mesh>

      {/* Radiant Sun Disc */}
      <group position={[0, 5, -22]}>
        <mesh ref={sunMeshRef}>
          <circleGeometry args={[3.2, 32]} />
          <meshBasicMaterial color="#ffedd5" />
        </mesh>
        <mesh position={[0, 0, -0.1]}>
          <circleGeometry args={[4.8, 32]} />
          <meshBasicMaterial color="#f97316" transparent opacity={0.6} />
        </mesh>
      </group>

      {/* Undulating Ocean Mesh */}
      <mesh
        ref={oceanMeshRef}
        geometry={oceanGeo}
        position={[0, 0, -10]}
        receiveShadow={config.shadows}
      >
        <meshStandardMaterial
          color="#0369a1"
          roughness={0.15}
          metalness={0.6}
          emissive="#0c4a6e"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* Sandy Beach Shore */}
      <mesh
        position={[0, 0.2, 6]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow={config.shadows}
      >
        <planeGeometry args={[40, 16, 16, 16]} />
        <meshStandardMaterial
          color="#d97706"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Wet Shoreline Ribbon */}
      <mesh
        position={[0, 0.15, -0.5]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[40, 2.5]} />
        <meshStandardMaterial
          color="#b45309"
          roughness={0.2}
          metalness={0.4}
        />
      </mesh>

      {/* Beach Rocks & Driftwood Elements */}
      <group position={[-4, 0.3, 3]}>
        <mesh castShadow={config.shadows} receiveShadow={config.shadows}>
          <dodecahedronGeometry args={[0.65, 1]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
        <mesh position={[0.7, -0.15, 0.4]} castShadow={config.shadows}>
          <dodecahedronGeometry args={[0.4, 1]} />
          <meshStandardMaterial color="#57534e" roughness={0.9} />
        </mesh>
      </group>

      <group position={[4.5, 0.3, 2]}>
        <mesh castShadow={config.shadows} receiveShadow={config.shadows}>
          <dodecahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial color="#78716c" roughness={0.9} />
        </mesh>
      </group>

      {/* Driftwood Log */}
      <mesh
        position={[2, 0.3, 4]}
        rotation={[0.1, 0.8, 0.05]}
        castShadow={config.shadows}
      >
        <cylinderGeometry args={[0.15, 0.18, 2.4, 8]} />
        <meshStandardMaterial color="#713f12" roughness={0.95} />
      </mesh>

      {/* Floating Wind Breeze Particles */}
      <ParticleSystem
        count={80}
        spread={[30, 4, 25]}
        center={[0, 2, 0]}
        color={['#fef08a', '#fdba74', '#fde047']}
        size={0.07}
        behavior="wind"
        speed={0.8}
        opacity={0.75}
      />

      {/* In-World Luminous Return Seashell / Beacon */}
      <InteractiveObject
        id="beach-return-beacon"
        label="Return to World"
        position={[0, 0.5, 4.5]}
        affordance="glow"
        cameraSequenceId="memory-exit"
        onInteract={() => exitMemory()}
      >
        <group>
          <mesh>
            <octahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color="#fbbf24"
              emissive="#f59e0b"
              emissiveIntensity={1.8}
              roughness={0.2}
            />
          </mesh>
          <pointLight intensity={1.6} color="#fef08a" distance={3.5} />
        </group>
      </InteractiveObject>
    </group>
  );
};
