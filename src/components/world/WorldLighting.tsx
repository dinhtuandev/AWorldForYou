import { useQualityTier } from '../../hooks/useQualityTier';
import { Environment } from '@react-three/drei';

export const WorldLighting = () => {
  const { config } = useQualityTier();

  return (
    <>
      {/* Warm evening environment map */}
      <Environment preset="sunset" background={false} environmentIntensity={0.65} />

      {/* Ambient & hemisphere fill lights */}
      <ambientLight intensity={0.45} color="#fed7aa" />
      <hemisphereLight
        args={['#ffd8a8', '#1a102f', 0.55]}
        position={[0, 20, 0]}
      />

      {/* Key warm directional sun/moon light */}
      <directionalLight
        position={[10, 14, 8]}
        intensity={1.8}
        color="#fff1d6"
        castShadow={config.shadows}
        shadow-mapSize={config.shadows ? [config.shadowMapSize, config.shadowMapSize] : [256, 256]}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.0005}
      />

      {/* Subtle blue accent backlight for depth */}
      <directionalLight
        position={[-8, 6, -8]}
        intensity={0.4}
        color="#818cf8"
      />
    </>
  );
};
