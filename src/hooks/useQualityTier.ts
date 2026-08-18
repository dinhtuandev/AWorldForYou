import { useCallback, useEffect } from 'react';
import { useExperienceStore } from '../experience/ExperienceState';
import { getDeviceInfo } from '../utils/device';
import { getQualityConfig, type QualityConfig } from '../utils/quality';
import type { QualityTier } from '../types/experience.types';

export const useQualityTier = () => {
  const qualityTier = useExperienceStore((state) => state.qualityTier);
  const setQualityTier = useExperienceStore((state) => state.setQualityTier);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('quality') as QualityTier | null;
      if (qParam && ['high', 'medium', 'low'].includes(qParam)) {
        setQualityTier(qParam);
        return;
      }
    }
    const deviceInfo = getDeviceInfo();
    setQualityTier(deviceInfo.gpuTier);
  }, [setQualityTier]);

  const config = getQualityConfig(qualityTier);

  const downgradeQuality = useCallback(() => {
    setQualityTier(
      qualityTier === 'high' ? 'medium' : qualityTier === 'medium' ? 'low' : 'low'
    );
  }, [qualityTier, setQualityTier]);

  return {
    qualityTier,
    config,
    preset: config,
    setQualityTier,
    downgradeQuality,
  };
};

export { getQualityConfig };
export type { QualityConfig };
