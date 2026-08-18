import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useQualityTier } from '../../../hooks/useQualityTier';
import { ParticleSystem } from '../../effects/ParticleSystem';

export const CrystalHeart = () => {
  const { qualityTier, config } = useQualityTier();
  const heartGroupRef = useRef<THREE.Group>(null);
  const coreLightRef = useRef<THREE.PointLight>(null);
  const coreOctahedronRef = useRef<THREE.Mesh>(null);

  const isTransmissionSupported = qualityTier !== 'low';

  // Construct a faceted 3D Heart Geometry using ExtrudeGeometry with heart curve
  const heartGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const x = 0;
    const y = 0;

    // Heart shape bezier contour
    shape.moveTo(x + 0.25, y + 0.25);
    shape.bezierCurveTo(x + 0.25, y + 0.25, x + 0.2, y, x, y);
    shape.bezierCurveTo(x - 0.3, y, x - 0.3, y + 0.35, x - 0.3, y + 0.35);
    shape.bezierCurveTo(x - 0.3, y + 0.55, x - 0.1, y + 0.77, x + 0.25, y + 1.0);
    shape.bezierCurveTo(x + 0.6, y + 0.77, x + 0.8, y + 0.55, x + 0.8, y + 0.35);
    shape.bezierCurveTo(x + 0.8, y + 0.35, x + 0.8, y, x + 0.5, y);
    shape.bezierCurveTo(x + 0.35, y, x + 0.25, y + 0.25, x + 0.25, y + 0.25);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: 0.32,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.12,
      bevelThickness: 0.12,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (heartGroupRef.current) {
      // Realistic rhythmic heartbeat pulse (lub-dub)
      const beat1 = Math.pow(Math.sin(elapsed * 3.2), 6) * 0.12;
      const beat2 = Math.pow(Math.sin(elapsed * 3.2 + 0.35), 8) * 0.06;
      const pulseScale = 1.0 + beat1 + beat2;

      heartGroupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      heartGroupRef.current.rotation.y = elapsed * 0.4;
      heartGroupRef.current.rotation.z = Math.sin(elapsed * 0.8) * 0.04;
      heartGroupRef.current.position.y = 1.8 + Math.sin(elapsed * 1.2) * 0.08;
    }

    if (coreOctahedronRef.current) {
      coreOctahedronRef.current.rotation.x = elapsed * 0.8;
      coreOctahedronRef.current.rotation.z = -elapsed * 0.6;
    }

    if (coreLightRef.current) {
      const lightPulse = 2.2 + Math.pow(Math.sin(elapsed * 3.2), 4) * 2.8;
      coreLightRef.current.intensity = lightPulse;
    }
  });

  return (
    <group ref={heartGroupRef} position={[0, 1.8, 0]}>
      {/* Outer Faceted Glass Crystal Heart */}
      <mesh
        geometry={heartGeometry}
        rotation={[Math.PI, 0, 0]}
        scale={1.2}
      >
        {isTransmissionSupported ? (
          <MeshTransmissionMaterial
            samples={config.transmissionSamples}
            resolution={config.transmissionResolution}
            transmission={0.94}
            roughness={0.12}
            thickness={0.75}
            ior={1.52}
            chromaticAberration={0.03}
            anisotropy={0.15}
            distortion={0.1}
            distortionScale={0.3}
            color="#f43f5e"
            attenuationColor="#be123c"
            attenuationDistance={0.6}
            transparent
          />
        ) : (
          <meshPhysicalMaterial
            color="#f43f5e"
            emissive="#be123c"
            emissiveIntensity={0.8}
            roughness={0.1}
            metalness={0.1}
            transmission={0.6}
            ior={1.5}
            transparent
            opacity={0.9}
          />
        )}
      </mesh>

      {/* Inner Radiant Glowing Core */}
      <mesh ref={coreOctahedronRef} rotation={[Math.PI, 0, 0]} scale={0.7}>
        <octahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fda4af"
          emissiveIntensity={3.2}
          roughness={0.0}
        />
      </mesh>

      {/* Heartbeat Core Point Light */}
      <pointLight
        ref={coreLightRef}
        color="#fb7185"
        distance={5.0}
        intensity={2.5}
      />

      {/* Orbiting Stardust Sparkles */}
      <ParticleSystem
        count={50}
        spread={[2.4, 1.2, 2.4]}
        center={[0, 0, 0]}
        color={['#fda4af', '#f43f5e', '#fb7185', '#fff1f2']}
        size={0.06}
        behavior="float"
        speed={1.2}
        opacity={0.85}
      />
    </group>
  );
};
