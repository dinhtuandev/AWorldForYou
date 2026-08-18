import { describe, it, expect } from 'vitest';
import { getQualityConfig, defaultQualityConfig } from './quality';

describe('quality utils', () => {
  it('returns default config for high', () => {
    const config = getQualityConfig('high');
    expect(config.dprMax).toBe(2);
    expect(config.shadows).toBe(true);
    expect(config.particleDensity).toBe(1);
  });

  it('returns appropriate config for low', () => {
    const config = getQualityConfig('low');
    expect(config.dprMax).toBe(1);
    expect(config.shadows).toBe(false);
    expect(config.particleDensity).toBe(0.25);
    expect(config.bloomEnabled).toBe(false);
  });

  it('fallback to default on invalid tier', () => {
    // @ts-expect-error invalid tier
    const config = getQualityConfig('invalid');
    expect(config).toEqual(defaultQualityConfig);
  });
});
