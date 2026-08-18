import { useEffect, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { CinematicCamera } from '../components/camera/CinematicCamera';
import { SceneManager } from './SceneManager';
import { InteractionManager } from './InteractionManager';
import { AtmosphericFog } from '../components/effects/AtmosphericFog';
import { PostProcessing } from '../components/effects/PostProcessing';
import { PerformanceMonitor } from '../components/effects/PerformanceMonitor';
import { DevTools } from '../components/ui/DevTools';
import { AudioControl } from '../components/audio/AudioControl';
import { LoadingScene } from '../components/scenes/LoadingScene';
import { IntroOverlay } from '../components/scenes/IntroOverlay';
import { TimelineOverlay } from '../components/scenes/TimelineOverlay';
import { MemoryOverlay } from '../components/scenes/memories/MemoryOverlay';
import { LetterOverlay } from '../components/scenes/letter/LetterOverlay';
import { BirthdayOverlay } from '../components/scenes/birthday/BirthdayOverlay';
import { WomensDayOverlay } from '../components/scenes/womensDay/WomensDayOverlay';
import { FinalOverlay } from '../components/scenes/final/FinalOverlay';
import { WebGLFallback } from '../components/ui/WebGLFallback';
import { useQualityTier } from '../hooks/useQualityTier';
import { useAssetProgress } from '../hooks/useAssetProgress';
import { getDeviceInfo, isWebGLAvailable } from '../utils/device';

export const Experience = () => {
  const { config } = useQualityTier();
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [contextLost, setContextLost] = useState<boolean>(false);
  const [isMobileDevice, setIsMobileDevice] = useState<boolean>(false);

  useAssetProgress();

  useEffect(() => {
    const supported = isWebGLAvailable();
    setHasWebGL(supported);

    const info = getDeviceInfo();
    setIsMobileDevice(info.isMobile);

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      setContextLost(true);
    };

    const handleContextRestored = () => {
      setContextLost(false);
    };

    window.addEventListener('webglcontextlost', handleContextLost, false);
    window.addEventListener('webglcontextrestored', handleContextRestored, false);

    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost);
      window.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  const handleRetryWebGL = useCallback(() => {
    setContextLost(false);
    setHasWebGL(isWebGLAvailable());
  }, []);

  if (!hasWebGL) {
    return <WebGLFallback reason="unsupported" onRetry={handleRetryWebGL} />;
  }

  if (contextLost) {
    return <WebGLFallback reason="contextlost" onRetry={handleRetryWebGL} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-neutral-950 select-none">
      <Canvas
        camera={{ position: [0, 2, 8], fov: isMobileDevice ? 75 : 60 }}
        dpr={[1, config.dprMax]}
        shadows={config.shadows}
        gl={{
          antialias: config.antialias,
          powerPreference: config.powerPreference,
          alpha: false,
        }}
      >
        <color attach="background" args={['#050505']} />
        <AtmosphericFog />

        <CinematicCamera>
          <InteractionManager>
            <SceneManager />
          </InteractionManager>
        </CinematicCamera>

        {/* Real-time FPS & Quality Auto-Downgrade Controller */}
        <PerformanceMonitor />

        {/* Cinematic PostProcessing Pipeline */}
        <PostProcessing />
      </Canvas>

      {/* DOM UI Overlays */}
      <LoadingScene />
      <IntroOverlay />
      <TimelineOverlay />
      <MemoryOverlay />
      <LetterOverlay />
      <BirthdayOverlay />
      <WomensDayOverlay />
      <FinalOverlay />
      <AudioControl />
      <DevTools />
    </div>
  );
};
