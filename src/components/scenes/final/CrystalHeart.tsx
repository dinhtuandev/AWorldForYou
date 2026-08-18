import { useMemo, useRef, useState, useEffect } from 'react';
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
  const haloRingRef = useRef<THREE.Mesh>(null);

  const [ascensionProgress, setAscensionProgress] = useState(0);

  const isTransmissionSupported = qualityTier !== 'low';

  // Smooth Ascension timeline on mount
  useEffect(() => {
    let start: number | null = null;
    const duration = 5500; // 5.5s graceful ascent into the sky

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      // Smooth cubic ease-in-out
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      setAscensionProgress(eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    const animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Construct a faceted 3D Heart Geometry using ExtrudeGeometry
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
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.14,
      bevelThickness: 0.14,
    };

    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.center();
    return geom;
  }, []);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();

    if (heartGroupRef.current) {
      // Calculate ascension height: from y=1.8 up into the night sky at y=5.8
      const currentY = THREE.MathUtils.lerp(1.8, 5.8, ascensionProgress);
      // Calculate scale: smoothly expanding from 1.0 up to 2.4
      const currentBaseScale = THREE.MathUtils.lerp(1.0, 2.4, ascensionProgress);

      // Realistic rhythmic heartbeat pulse (lub-dub double-beat)
      const beat1 = Math.pow(Math.sin(elapsed * 3.2), 6) * 0.12;
      const beat2 = Math.pow(Math.sin(elapsed * 3.2 + 0.35), 8) * 0.06;
      const pulseScale = currentBaseScale * (1.0 + beat1 + beat2);

      heartGroupRef.current.scale.set(pulseScale, pulseScale, pulseScale);
      heartGroupRef.current.rotation.y = elapsed * 0.45;
      heartGroupRef.current.rotation.z = Math.sin(elapsed * 0.8) * 0.05;
      heartGroupRef.current.position.y = currentY + Math.sin(elapsed * 1.2) * 0.12;
    }

    if (coreOctahedronRef.current) {
      coreOctahedronRef.current.rotation.x = elapsed * 0.8;
      coreOctahedronRef.current.rotation.z = -elapsed * 0.6;
    }

    if (haloRingRef.current) {
      haloRingRef.current.rotation.z = elapsed * 0.3;
      haloRingRef.current.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.5) * 0.15;
    }

    if (coreLightRef.current) {
      const lightPulse = 3.0 + Math.pow(Math.sin(elapsed * 3.2), 4) * 3.5;
      coreLightRef.current.intensity = lightPulse;
    }
  });

  return (
    <group ref={heartGroupRef} position={[0, 1.8, 0]}>
      {/* Outer Faceted Glass Crystal Heart */}
      <mesh
        geometry={heartGeometry}
        rotation={[Math.PI, 0, 0]}
      >
        {isTransmissionSupported ? (
          <MeshTransmissionMaterial
            samples={config.transmissionSamples}
            resolution={config.transmissionResolution}
            transmission={0.95}
            roughness={0.1}
            thickness={0.8}
            ior={1.54}
            chromaticAberration={0.04}
            anisotropy={0.2}
            distortion={0.12}
            distortionScale={0.35}
            color="#f43f5e"
            attenuationColor="#be123c"
            attenuationDistance={0.7}
            transparent
          />
        ) : (
          <meshPhysicalMaterial
            color="#f43f5e"
            emissive="#be123c"
            emissiveIntensity={0.9}
            roughness={0.1}
            metalness={0.1}
            transmission={0.65}
            ior={1.5}
            transparent
            opacity={0.92}
          />
        )}
      </mesh>

      {/* Inner Radiant Glowing Core */}
      <mesh ref={coreOctahedronRef} rotation={[Math.PI, 0, 0]} scale={0.7}>
        <octahedronGeometry args={[0.26, 0]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#fda4af"
          emissiveIntensity={3.5}
          roughness={0.0}
        />
      </mesh>

      {/* Celestial Halo Ring */}
      <mesh ref={haloRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.25, 1.35, 48]} />
        <meshBasicMaterial
          color="#f43f5e"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Heartbeat Core Point Light */}
      <pointLight
        ref={coreLightRef}
        color="#fb7185"
        distance={10.0}
        intensity={3.5}
      />

      {/* Orbiting Stardust Sparkles */}
      <ParticleSystem
        count={70}
        spread={[3.2, 1.8, 3.2]}
        center={[0, 0, 0]}
        color={['#fda4af', '#f43f5e', '#fb7185', '#fff1f2', '#fef08a']}
        size={0.07}
        behavior="float"
        speed={1.4}
        opacity={0.9}
      />
    </group>
  );
};
