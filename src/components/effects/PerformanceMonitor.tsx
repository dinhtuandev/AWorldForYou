import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useExperienceStore } from '../../experience/ExperienceState';
import { usePerformanceStore } from '../../hooks/usePerformanceMetrics';

const LOW_FPS_THRESHOLD = 30;
const DOWNSHIFT_TIME_SECONDS = 3.0;
const GRACE_PERIOD_SECONDS = 3.0; // Wait after phase change before measuring for auto-downgrade

export const PerformanceMonitor = () => {
  const { gl } = useThree();
  const phase = useExperienceStore((state) => state.phase);
  const qualityTier = useExperienceStore((state) => state.qualityTier);
  const setQualityTier = useExperienceStore((state) => state.setQualityTier);
  const setStats = usePerformanceStore((state) => state.setStats);

  const fpsRef = useRef(60);
  const lowFpsAccumulator = useRef(0);
  const timeSincePhaseChange = useRef(0);
  const lastSampleTime = useRef(0);
  const currentTierRef = useRef(qualityTier);
  currentTierRef.current = qualityTier;

  useEffect(() => {
    timeSincePhaseChange.current = 0;
    lowFpsAccumulator.current = 0;
  }, [phase]);

  useFrame(({ clock }, delta) => {
    const elapsed = clock.getElapsedTime();
    timeSincePhaseChange.current += delta;

    // Instant & smoothed FPS calculation
    const instantFps = 1 / Math.max(delta, 0.0001);
    fpsRef.current = Math.round(fpsRef.current * 0.9 + instantFps * 0.1);

    // Only consider auto-downgrading if we've passed the grace period after phase changes
    if (timeSincePhaseChange.current > GRACE_PERIOD_SECONDS && currentTierRef.current !== 'low') {
      if (fpsRef.current < LOW_FPS_THRESHOLD) {
        lowFpsAccumulator.current += delta;
        if (lowFpsAccumulator.current >= DOWNSHIFT_TIME_SECONDS) {
          const nextTier = currentTierRef.current === 'high' ? 'medium' : 'low';
          setQualityTier(nextTier);
          setStats({ autoDowngraded: true });
          lowFpsAccumulator.current = 0;
          timeSincePhaseChange.current = 0; // reset grace period for newly adjusted tier
        }
      } else {
        lowFpsAccumulator.current = Math.max(0, lowFpsAccumulator.current - delta * 0.5);
      }
    }

    // Sample rendering metrics roughly every 500ms
    if (elapsed - lastSampleTime.current > 0.5) {
      lastSampleTime.current = elapsed;
      const renderInfo = gl.info.render;
      const memoryInfo = gl.info.memory;

      setStats({
        fps: fpsRef.current,
        drawCalls: renderInfo.calls,
        triangles: renderInfo.triangles,
        points: renderInfo.points,
        geometries: memoryInfo.geometries,
        textures: memoryInfo.textures,
        lowFpsDuration: Math.round(lowFpsAccumulator.current * 10) / 10,
      });
    }
  });

  return null;
};
