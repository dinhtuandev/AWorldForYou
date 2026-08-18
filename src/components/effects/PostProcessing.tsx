import { EffectComposer, Bloom, DepthOfField, Noise, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useQualityTier } from '../../hooks/useQualityTier';

export const PostProcessing = () => {
  const { qualityTier, config } = useQualityTier();

  if (qualityTier === 'low' || config.postProcessing === 'minimal') {
    return null;
  }

  const isHigh = qualityTier === 'high';
  const caOffset = new THREE.Vector2(0.0006, 0.0006);

  return (
    <EffectComposer
      multisampling={isHigh ? 4 : 0}
      autoClear={false}
    >
      {/* Subtle Atmospheric Bloom */}
      {config.bloomEnabled && (
        <Bloom
          luminanceThreshold={0.82}
          luminanceSmoothing={0.35}
          intensity={config.bloomIntensity}
          mipmapBlur={isHigh}
        />
      )}

      {/* Depth of field on HIGH tier only */}
      {config.dofEnabled && (
        <DepthOfField
          focusDistance={0.025}
          focalLength={0.4}
          bokehScale={2.0}
          height={480}
        />
      )}

      {/* Subtle chromatic aberration on HIGH tier */}
      {config.chromaticAberration && (
        <ChromaticAberration
          offset={caOffset}
        />
      )}

      {/* Subtle Cinematic Film Grain */}
      {config.noiseEnabled && (
        <Noise
          opacity={config.noiseOpacity}
          blendFunction={BlendFunction.OVERLAY}
        />
      )}

      {/* Cinematic Vignette Framing */}
      <Vignette
        eskil={false}
        offset={0.25}
        darkness={0.45}
      />
    </EffectComposer>
  );
};
