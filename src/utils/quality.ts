import type { QualityTier } from '../types/experience.types';

export interface QualityConfig {
  tier: QualityTier;
  dprMax: number;
  shadows: boolean;
  shadowMapSize: number;
  postProcessing: 'full' | 'partial' | 'minimal';
  bloomEnabled: boolean;
  bloomIntensity: number;
  dofEnabled: boolean;
  chromaticAberration: boolean;
  noiseEnabled: boolean;
  noiseOpacity: number;
  particles: number;
  particleDensity: number;
  firefliesCount: number;
  cloudsCount: number;
  antialias: boolean;
  anisotropy: number;
  waterSubdivisions: number;
  transmissionSamples: number;
  transmissionResolution: number;
  powerPreference: 'high-performance' | 'default' | 'low-power';
}

export const QUALITY_PRESETS: Record<QualityTier, QualityConfig> = {
  high: {
    tier: 'high',
    dprMax: 2.0,
    shadows: true,
    shadowMapSize: 2048,
    postProcessing: 'full',
    bloomEnabled: true,
    bloomIntensity: 0.35,
    dofEnabled: true,
    chromaticAberration: true,
    noiseEnabled: true,
    noiseOpacity: 0.02,
    particles: 1.0,
    particleDensity: 1.0,
    firefliesCount: 45,
    cloudsCount: 3,
    antialias: true,
    anisotropy: 8,
    waterSubdivisions: 48,
    transmissionSamples: 8,
    transmissionResolution: 512,
    powerPreference: 'high-performance',
  },
  medium: {
    tier: 'medium',
    dprMax: 1.5,
    shadows: true,
    shadowMapSize: 1024,
    postProcessing: 'partial',
    bloomEnabled: true,
    bloomIntensity: 0.2,
    dofEnabled: false,
    chromaticAberration: false,
    noiseEnabled: true,
    noiseOpacity: 0.01,
    particles: 0.5,
    particleDensity: 0.5,
    firefliesCount: 20,
    cloudsCount: 2,
    antialias: true,
    anisotropy: 4,
    waterSubdivisions: 32,
    transmissionSamples: 4,
    transmissionResolution: 256,
    powerPreference: 'high-performance',
  },
  low: {
    tier: 'low',
    dprMax: 1.0,
    shadows: false,
    shadowMapSize: 512,
    postProcessing: 'minimal',
    bloomEnabled: false,
    bloomIntensity: 0.0,
    dofEnabled: false,
    chromaticAberration: false,
    noiseEnabled: false,
    noiseOpacity: 0.0,
    particles: 0.25,
    particleDensity: 0.25,
    firefliesCount: 10,
    cloudsCount: 1,
    antialias: false,
    anisotropy: 1,
    waterSubdivisions: 16,
    transmissionSamples: 0,
    transmissionResolution: 128,
    powerPreference: 'default',
  },
};

export const defaultQualityConfig: QualityConfig = QUALITY_PRESETS.high;

/**
 * Returns the QualityConfig object corresponding to the given QualityTier.
 */
export const getQualityConfig = (tier: QualityTier): QualityConfig => {
  return QUALITY_PRESETS[tier] ?? defaultQualityConfig;
};
