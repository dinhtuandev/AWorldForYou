import { useMemo } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useCameraDirector } from '../../experience/CameraDirector';
import { experienceData } from '../../data/experienceData';
import { getDeviceInfo } from '../../utils/device';
import { WorldLighting } from '../world/WorldLighting';
import { Terrain } from '../world/Terrain';
import { House } from '../world/House';
import { Trees } from '../world/Trees';
import { Pond } from '../world/Pond';
import { Clouds } from '../world/Clouds';
import { Fireflies } from '../world/Fireflies';
import { PhotoFrame } from '../world/PhotoFrame';
import { LetterPedestal } from '../world/LetterPedestal';
import { TimelineMilestones } from '../world/TimelineMilestones';

export const WorldScene = () => {
  const phase = useExperienceStore((state) => state.phase);
  const { isPlaying } = useCameraDirector();
  const deviceInfo = useMemo(() => getDeviceInfo(), []);

  // Allow gentle camera orbiting only during interactive world phase when no camera sequence is playing
  const isOrbitEnabled = phase === 'world' && !isPlaying;

  return (
    <group position={[0, 0, 0]}>
      {/* Lighting, Atmospheric Fog, Environment HDR */}
      <WorldLighting />

      {/* Orbit Controls with mobile touch gestures, smooth damping & angle/zoom clamping */}
      <OrbitControls
        enabled={isOrbitEnabled}
        enableDamping
        dampingFactor={0.06}
        rotateSpeed={deviceInfo.isMobile ? 0.8 : 0.65}
        zoomSpeed={deviceInfo.isMobile ? 0.9 : 0.7}
        panSpeed={0.5}
        enablePan={!deviceInfo.isMobile} // Disable pan on mobile to avoid drifting
        minDistance={4.5}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.15} // Prevents looking below terrain horizon
        minPolarAngle={Math.PI / 6}    // Prevents looking directly top-down
        target={[0, 1, 0]}
        touches={{
          ONE: THREE.TOUCH.ROTATE,
          TWO: THREE.TOUCH.DOLLY_PAN,
        }}
      />

      {/* Diorama Environment & Terrain */}
      <Terrain />
      <House position={[0, 0.2, -1.8]} />
      <Trees />
      <Pond position={[2.2, 0.05, 0.6]} />

      {/* Ambient Life */}
      <Clouds />
      <Fireflies />

      {/* Interactive Objects */}
      {experienceData.memories.map((memory) => (
        <PhotoFrame key={memory.id} memory={memory} />
      ))}

      <LetterPedestal position={[1.6, 0.0, 1.6]} />
      <TimelineMilestones />
    </group>
  );
};
