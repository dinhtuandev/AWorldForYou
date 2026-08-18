import type { QualityTier } from '../types/experience.types';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isTouch: boolean;
  pixelRatio: number;
  hardwareConcurrency: number;
  deviceMemory: number;
  gpuTier: QualityTier;
}

export const detectGpuTier = (): QualityTier => {
  if (typeof window === 'undefined') return 'high';

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;

  if (isMobile) {
    if (memory <= 3 || cores <= 4) return 'low';
    return 'medium';
  }

  // Desktop checks
  if (memory <= 4 || cores <= 2) {
    return 'low';
  }

  if (memory <= 8 || cores <= 4) {
    return 'medium';
  }

  return 'high';
};

export const getDeviceInfo = (): DeviceInfo => {
  if (typeof window === 'undefined') {
    return {
      isMobile: false,
      isTablet: false,
      isTouch: false,
      pixelRatio: 1,
      hardwareConcurrency: 4,
      deviceMemory: 8,
      gpuTier: 'high',
    };
  }

  const userAgent = navigator.userAgent;
  const isMobile = /Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|tablet|(android(?!.*mobile))/i.test(userAgent);
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const pixelRatio = window.devicePixelRatio || 1;
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const deviceMemory = nav.deviceMemory || 8;
  const gpuTier = detectGpuTier();

  return {
    isMobile,
    isTablet,
    isTouch,
    pixelRatio,
    hardwareConcurrency,
    deviceMemory,
    gpuTier,
  };
};

export const isWebGLAvailable = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ||
          canvas.getContext('webgl') ||
          canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
};

