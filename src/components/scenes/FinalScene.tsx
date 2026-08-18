import { useEffect } from 'react';
import { CrystalHeart } from './final/CrystalHeart';
import { Terrain } from '../world/Terrain';
import { House } from '../world/House';
import { Trees } from '../world/Trees';
import { Pond } from '../world/Pond';
import { Fireflies } from '../world/Fireflies';
import { ParticleSystem } from '../effects/ParticleSystem';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useCameraDirector } from '../../experience/CameraDirector';

export const FinalScene = () => {
  const phase = useExperienceStore((state) => state.phase);
  const { playSequence } = useCameraDirector();

  useEffect(() => {
    if (phase !== 'final') return;
    playSequence('final-rise');
  }, [phase, playSequence]);

  return (
    <group position={[0, 0, 0]}>
      {/* Night Celestial Environment Lighting */}
      <ambientLight intensity={0.25} color="#172554" />
      <directionalLight
        position={[5, 12, 6]}
        intensity={1.2}
        color="#bfdbfe"
        castShadow
      />
      <pointLight position={[0, 8, 0]} intensity={1.5} color="#fda4af" />

      {/* Nocturnal Miniature Diorama */}
      <Terrain />
      <House position={[0, 0.2, -1.8]} />
      <Trees />
      <Pond position={[2.2, 0.05, 0.6]} />
      <Fireflies />

      {/* Floating Luminous Crystal Heart */}
      <CrystalHeart />

      {/* Celestial Sky Stars using ParticleSystem */}
      <ParticleSystem
        count={200}
        spread={[35, 20, 35]}
        center={[0, 10, 0]}
        color={['#ffffff', '#bae6fd', '#fbcfe8']}
        size={0.09}
        behavior="float"
        speed={0.15}
        opacity={0.85}
      />
    </group>
  );
};
