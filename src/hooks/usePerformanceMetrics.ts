import { create } from 'zustand';

export interface PerformanceStats {
  fps: number;
  drawCalls: number;
  triangles: number;
  points: number;
  geometries: number;
  textures: number;
  autoDowngraded: boolean;
  lowFpsDuration: number;
}

export interface PerformanceStore extends PerformanceStats {
  setStats: (stats: Partial<PerformanceStats>) => void;
}

export const usePerformanceStore = create<PerformanceStore>((set) => ({
  fps: 60,
  drawCalls: 0,
  triangles: 0,
  points: 0,
  geometries: 0,
  textures: 0,
  autoDowngraded: false,
  lowFpsDuration: 0,
  setStats: (stats) => set((state) => ({ ...state, ...stats })),
}));
