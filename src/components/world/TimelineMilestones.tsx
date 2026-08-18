import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { experienceData } from '../../data/experienceData';
import { InteractiveObject } from '../interactions/InteractiveObject';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useCameraDirector } from '../../experience/CameraDirector';
import { createApproachSequence } from '../../data/cameraSequences';
import type { TimelineMilestone } from '../../types/experience.types';

interface MilestoneCrystalProps {
  milestone: TimelineMilestone;
  index: number;
}

const MilestoneCrystal = ({ milestone, index }: MilestoneCrystalProps) => {
  const selectMilestone = useExperienceStore((state) => state.selectMilestone);
  const activeMilestoneId = useExperienceStore((state) => state.activeMilestoneId);
  const { playSequence } = useCameraDirector();
  const crystalRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const isSelected = activeMilestoneId === milestone.id;

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    if (crystalRef.current) {
      crystalRef.current.rotation.y = elapsed * 0.7 + index;
      crystalRef.current.rotation.x = Math.sin(elapsed * 0.6 + index) * 0.2;
      crystalRef.current.position.y =
        milestone.worldPosition[1] + Math.sin(elapsed * 1.8 + index * 1.2) * 0.06;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = -elapsed * 0.8;
      ringRef.current.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.5) * 0.1;
    }
  });

  const handleInteract = () => {
    selectMilestone(milestone.id);
    const cameraSequence = createApproachSequence(
      `approach-${milestone.id}`,
      milestone.worldPosition,
      [1.4, 1.0, 2.0]
    );
    playSequence(cameraSequence);
  };

  return (
    <InteractiveObject
      id={milestone.id}
      label={`${milestone.date}: ${milestone.label}`}
      position={milestone.worldPosition}
      affordance="glow"
      onInteract={handleInteract}
    >
      <group position={[0, 0, 0]}>
        {/* Floating Glowing Octahedron Crystal Beacon */}
        <mesh ref={crystalRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={isSelected ? '#f43f5e' : '#fbbf24'}
            emissive={isSelected ? '#e11d48' : '#d97706'}
            emissiveIntensity={isSelected ? 3.2 : 2.0}
            roughness={0.1}
            metalness={0.8}
            transparent
            opacity={0.95}
          />
        </mesh>

        {/* Orbiting Resonant Ring */}
        <mesh ref={ringRef} position={[0, 0, 0]}>
          <torusGeometry args={[0.3, 0.01, 16, 32]} />
          <meshBasicMaterial
            color={isSelected ? '#fda4af' : '#fef08a'}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Soft point glow */}
        <pointLight
          color={isSelected ? '#f43f5e' : '#f59e0b'}
          distance={2.5}
          intensity={isSelected ? 2.2 : 1.2}
        />
      </group>
    </InteractiveObject>
  );
};

const LuminousLightPath = () => {
  const curve = useMemo(() => {
    const points = [
      ...experienceData.timeline.map((m) => new THREE.Vector3(m.worldPosition[0], 0.25, m.worldPosition[2])),
      new THREE.Vector3(1.6, 0.25, 1.6), // Leads to Letter Pedestal
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.2);
  }, []);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 64, 0.02, 8, false);
  }, [curve]);

  const pulseBeadRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulseBeadRef.current) return;
    const progress = (clock.getElapsedTime() * 0.15) % 1.0;
    const pos = curve.getPoint(progress);
    pulseBeadRef.current.position.copy(pos);
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Luminous Glowing Tube Trail across the Island */}
      <mesh geometry={tubeGeometry}>
        <meshBasicMaterial
          color="#fde047"
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Traveling Energy Pulse Bead */}
      <mesh ref={pulseBeadRef}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
        <pointLight color="#fef08a" intensity={1.8} distance={1.8} />
      </mesh>
    </group>
  );
};

export const TimelineMilestones = () => {
  return (
    <group position={[0, 0, 0]}>
      <LuminousLightPath />
      {experienceData.timeline.map((milestone, idx) => (
        <MilestoneCrystal
          key={milestone.id}
          milestone={milestone}
          index={idx}
        />
      ))}
    </group>
  );
};
