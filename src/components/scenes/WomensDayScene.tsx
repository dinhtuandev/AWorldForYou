import { useCallback, useEffect, useState } from 'react';
import { FloralHeart } from './womensDay/FloralHeart';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useCameraDirector } from '../../experience/CameraDirector';
import { ParticleSystem } from '../effects/ParticleSystem';

const TOTAL_FLOWERS = 18;

export const WomensDayScene = () => {
  const phase = useExperienceStore((state) => state.phase);
  const { playSequence } = useCameraDirector();
  const [plantedCount, setPlantedCount] = useState(1);

  // Reset when entering phase
  useEffect(() => {
    if (phase !== 'womensDay') return;
    setPlantedCount(1);
    playSequence({
      id: 'garden-approach',
      keyframes: [
        { position: [0, 2.5, 4.5], target: [0, 0.2, 0], duration: 0 },
        { position: [0, 2.2, 3.8], target: [0, 0.2, 0], duration: 2.5, ease: 'power2.out' },
      ],
    });
  }, [phase, playSequence]);

  // Synchronize flower updates from DOM overlay
  useEffect(() => {
    const handleFlowerUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ count: number }>;
      if (customEvent.detail?.count) {
        setPlantedCount(customEvent.detail.count);
        if (customEvent.detail.count >= TOTAL_FLOWERS) {
          playSequence('garden-rise');
        }
      }
    };

    window.addEventListener('awfo:womens-flower-updated', handleFlowerUpdate);
    return () => {
      window.removeEventListener('awfo:womens-flower-updated', handleFlowerUpdate);
    };
  }, [playSequence]);

  const handleTerraceClick = useCallback(() => {
    if (plantedCount >= TOTAL_FLOWERS) return;
    const nextCount = Math.min(plantedCount + 1, TOTAL_FLOWERS);
    setPlantedCount(nextCount);
    window.dispatchEvent(new CustomEvent('awfo:womens-plant-flower'));
    if (nextCount >= TOTAL_FLOWERS) {
      playSequence('garden-rise');
    }
  }, [plantedCount, playSequence]);

  return (
    <group position={[0, 0, 0]}>
      {/* Soft Dawn / Golden Hour Atmospheric Light */}
      <ambientLight intensity={0.35} color="#fed7aa" />
      <directionalLight
        position={[3, 8, 4]}
        intensity={2.0}
        color="#ffedd5"
        castShadow
      />
      <pointLight position={[-2, 3, -2]} intensity={1.2} color="#f472b6" />

      {/* Garden Stepping Terrace */}
      <mesh
        position={[0, -0.05, 0]}
        receiveShadow
        onClick={handleTerraceClick}
      >
        <cylinderGeometry args={[2.8, 3.0, 0.2, 32]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>
      {/* Lush Inner Grass Bed */}
      <mesh
        position={[0, 0.06, 0]}
        receiveShadow
        onClick={handleTerraceClick}
      >
        <cylinderGeometry args={[2.6, 2.6, 0.05, 32]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>

      {/* 3D Blooming Floral Heart */}
      <FloralHeart
        plantedCount={plantedCount}
        totalFlowers={TOTAL_FLOWERS}
      />

      {/* Floating Petal Particles */}
      <ParticleSystem
        count={60}
        spread={[5, 3.5, 5]}
        center={[0, 1.8, 0]}
        color={['#fb7185', '#f472b6', '#fbcfe8', '#fda4af']}
        size={0.08}
        behavior="float"
        speed={0.6}
        opacity={0.8}
      />
    </group>
  );
};
