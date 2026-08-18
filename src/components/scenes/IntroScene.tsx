import { useEffect } from 'react';
import { useCameraDirector } from '../../experience/CameraDirector';
import { useExperienceStore } from '../../experience/ExperienceState';
import { IntroParticles } from './IntroParticles';

export const IntroScene = () => {
  const cameraDirector = useCameraDirector();
  const phase = useExperienceStore((state) => state.phase);

  useEffect(() => {
    if (phase !== 'intro') return;
    cameraDirector.playSequence('intro-particle-reveal');
  }, [phase, cameraDirector]);

  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={2.5} color="#fef3c7" distance={15} />
      <IntroParticles count={700} />
    </group>
  );
};
