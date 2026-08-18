import { ParticleSystem } from '../effects/ParticleSystem';
import { useQualityTier } from '../../hooks/useQualityTier';

export interface FirefliesProps {
  count?: number;
  spread?: [number, number, number];
  center?: [number, number, number];
}

export const Fireflies = ({
  count,
  spread = [8.5, 3.5, 8.5],
  center = [0, 1.8, 0],
}: FirefliesProps) => {
  const { config } = useQualityTier();
  const effectiveCount = count ?? config.firefliesCount;

  return (
    <ParticleSystem
      count={effectiveCount}
      spread={spread}
      center={center}
      color={['#fde047', '#fef08a', '#facc15', '#fed7aa']}
      size={0.11}
      behavior="firefly"
      speed={0.8}
      opacity={0.88}
      qualityScale={1}
    />
  );
};
