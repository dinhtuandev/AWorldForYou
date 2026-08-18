import type { CameraSequence } from '../types/experience.types';

export const cameraSequences: Record<string, CameraSequence> = {
  'intro-particle-reveal': {
    id: 'intro-particle-reveal',
    keyframes: [
      { position: [0, 0, 8], target: [0, 0, 0], duration: 0 },
      { position: [0, 0, 5], target: [0, 0, 0], duration: 4.0, ease: 'power2.inOut' },
      { position: [0, 1, 3], target: [0, 0.5, -2], duration: 2.0, ease: 'power2.out' },
    ],
  },

  'intro-to-world': {
    id: 'intro-to-world',
    keyframes: [
      { position: [0, 2, 2], target: [0, 0, 0], duration: 0 },
      { position: [0, 3, -5], target: [0, 1, -10], duration: 3.0, ease: 'power3.inOut' },
      { position: [8, 6, 12], target: [0, 2, 0], duration: 4.0, ease: 'power2.out' },
      { position: [6, 4, 10], target: [0, 1.5, 0], duration: 2.0, ease: 'power2.out' },
    ],
  },

  'orbit-world': {
    id: 'orbit-world',
    keyframes: [
      { position: [8, 5, 8], target: [0, 1, 0], duration: 0 },
      { position: [-8, 5, 8], target: [0, 1, 0], duration: 20.0, ease: 'none' },
    ],
  },

  'approach-house': {
    id: 'approach-house',
    keyframes: [
      { position: [6, 4, 10], target: [0, 1, 0], duration: 0 },
      { position: [2, 2.5, 4], target: [0, 2, -1], duration: 3.0, ease: 'power2.inOut' },
      { position: [0.5, 2.2, 2], target: [0, 2, -2], duration: 2.0, ease: 'power2.out' },
    ],
  },

  'memory-portal-beach': {
    id: 'memory-portal-beach',
    keyframes: [
      { position: [-2, 2.2, 3.5], target: [-2, 0.5, 1], duration: 1.2, ease: 'power2.inOut' },
      { position: [-2, 0.7, 1.6], target: [-2, 0.5, 1], duration: 1.5, ease: 'power3.inOut' },
    ],
  },

  'memory-portal-cafe': {
    id: 'memory-portal-cafe',
    keyframes: [
      { position: [2, 2.2, 1.5], target: [2, 0.5, -1], duration: 1.2, ease: 'power2.inOut' },
      { position: [2, 0.7, -0.4], target: [2, 0.5, -1], duration: 1.5, ease: 'power3.inOut' },
    ],
  },

  'memory-portal-nightWalk': {
    id: 'memory-portal-nightWalk',
    keyframes: [
      { position: [0, 2.2, -0.5], target: [0, 0.5, -3], duration: 1.2, ease: 'power2.inOut' },
      { position: [0, 0.7, -2.4], target: [0, 0.5, -3], duration: 1.5, ease: 'power3.inOut' },
    ],
  },

  'memory-portal-firstMeeting': {
    id: 'memory-portal-firstMeeting',
    keyframes: [
      { position: [-1.5, 2.2, 0.5], target: [-1.5, 0.5, -2], duration: 1.2, ease: 'power2.inOut' },
      { position: [-1.5, 0.7, -1.4], target: [-1.5, 0.5, -2], duration: 1.5, ease: 'power3.inOut' },
    ],
  },

  'memory-portal-template': {
    id: 'memory-portal-template',
    keyframes: [
      { position: [0, 2.5, 4], target: [0, 1, 0], duration: 1.2, ease: 'power2.inOut' },
      { position: [0, 1.2, 1.5], target: [0, 1, 0], duration: 1.5, ease: 'power3.inOut' },
    ],
  },

  'memory-enter-beach': {
    id: 'memory-enter-beach',
    keyframes: [
      { position: [0, 3, 8], target: [0, 1.5, -12], duration: 0 },
      { position: [0, 1.8, 5], target: [0, 1.2, -12], duration: 2.5, ease: 'power2.out' },
    ],
  },

  'memory-enter-cafe': {
    id: 'memory-enter-cafe',
    keyframes: [
      { position: [0, 2.5, 5], target: [0, 1.2, 0], duration: 0 },
      { position: [0, 1.6, 3.2], target: [0, 1.1, 0], duration: 2.5, ease: 'power2.out' },
    ],
  },

  'memory-enter-nightWalk': {
    id: 'memory-enter-nightWalk',
    keyframes: [
      { position: [0, 3, 9], target: [0, 1.4, -10], duration: 0 },
      { position: [0, 1.8, 5.5], target: [0, 1.4, -10], duration: 2.5, ease: 'power2.out' },
    ],
  },

  'memory-enter-firstMeeting': {
    id: 'memory-enter-firstMeeting',
    keyframes: [
      { position: [0, 3.5, 8], target: [0, 1.2, 0], duration: 0 },
      { position: [0, 2.2, 5], target: [0, 1.2, 0], duration: 2.5, ease: 'power2.out' },
    ],
  },

  'memory-exit': {
    id: 'memory-exit',
    keyframes: [
      { position: [0, 2, 4], target: [0, 1, 0], duration: 0 },
      { position: [6, 4, 10], target: [0, 1.5, 0], duration: 2.5, ease: 'power2.inOut' },
    ],
  },

  'letter-approach': {
    id: 'letter-approach',
    keyframes: [
      { position: [0, 1.5, 3], target: [0, 1, 0], duration: 0 },
      { position: [0, 1.2, 1.2], target: [0, 1, 0], duration: 3.5, ease: 'power2.inOut' },
      { position: [0, 1.1, 0.8], target: [0, 1, 0], duration: 2.0, ease: 'power2.out' },
    ],
  },

  'birthday-reveal': {
    id: 'birthday-reveal',
    keyframes: [
      { position: [0, 2, 4], target: [0, 1, 0], duration: 0 },
      { position: [0, 1.8, 2.5], target: [0, 1.2, 0], duration: 3.0, ease: 'power2.out' },
    ],
  },

  'birthday-pullback': {
    id: 'birthday-pullback',
    keyframes: [
      { position: [0, 1.8, 2.5], target: [0, 1.2, 0], duration: 0 },
      { position: [0, 8, 15], target: [0, 2, 0], duration: 5.0, ease: 'power2.inOut' },
    ],
  },

  'garden-rise': {
    id: 'garden-rise',
    keyframes: [
      { position: [0, 2, 5], target: [0, 0, 0], duration: 0 },
      { position: [0, 12, 8], target: [0, 0, 0], duration: 6.0, ease: 'power2.inOut' },
    ],
  },

  'final-rise': {
    id: 'final-rise',
    keyframes: [
      { position: [6, 4, 10], target: [0, 1, 0], duration: 0 },
      { position: [0, 14, 12], target: [0, 0, 0], duration: 7.0, ease: 'power2.inOut' },
      { position: [0, 8, 5], target: [0, 1, 0], duration: 4.0, ease: 'power2.out' },
    ],
  },

  'final-heart-focus': {
    id: 'final-heart-focus',
    keyframes: [
      { position: [0, 8, 5], target: [0, 1, 0], duration: 0 },
      { position: [0, 3, 4], target: [0, 1.5, 0], duration: 3.0, ease: 'power2.inOut' },
    ],
  },
};

export const createApproachSequence = (
  id: string,
  targetPos: [number, number, number],
  offset: [number, number, number] = [1.5, 1, 2]
): CameraSequence => ({
  id,
  keyframes: [
    {
      position: [
        targetPos[0] + offset[0],
        targetPos[1] + offset[1],
        targetPos[2] + offset[2],
      ],
      target: targetPos,
      duration: 2.5,
      ease: 'power2.inOut',
    },
  ],
});
