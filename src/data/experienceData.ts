import type { ExperienceData } from '../types/experience.types';

export const experienceData: ExperienceData = {
  girlfriendName: 'My Love',
  senderName: 'Me',
  mode: 'default',

  intro: {
    line1: 'I made a little world for you.',
    line2: 'Come in.',
  },

  loading: {
    building: 'Building your little world...',
    ready: 'Ready.',
  },

  memories: [
    {
      id: 'photo-1',
      objectType: 'photo',
      title: 'Beach Day',
      date: '2024-06-15',
      image: '/assets/images/placeholder-beach.svg',
      description: 'Our first trip to the ocean together.',
      scene: 'beach',
      worldPosition: [-2, 0.5, 1],
    },
    {
      id: 'photo-2',
      objectType: 'camera',
      title: 'Warm Cafe Afternoon',
      date: '2024-09-20',
      image: '/assets/images/placeholder-cafe.svg',
      description: 'Rain outside, warm coffee, and endless talks.',
      scene: 'cafe',
      worldPosition: [2, 0.5, -1],
    },
    {
      id: 'photo-3',
      objectType: 'musicbox',
      title: 'Midnight Walk Under Stars',
      date: '2024-12-24',
      image: '/assets/images/placeholder-night.svg',
      description: 'Quiet street lamps and footsteps in the crisp air.',
      scene: 'nightWalk',
      worldPosition: [0, 0.5, -3],
    },
    {
      id: 'photo-4',
      objectType: 'envelope',
      title: 'The First Spark',
      date: '2024-03-08',
      image: '/assets/images/placeholder-first.svg',
      description: 'Where our story quietly began.',
      scene: 'firstMeeting',
      worldPosition: [-1.5, 0.5, -2],
    },
  ],

  timeline: [
    {
      id: 'm-2024',
      date: '2024',
      label: 'Where it began',
      worldPosition: [3, 1, -2],
      memoryId: 'photo-4',
    },
    {
      id: 'm-2025',
      date: '2025',
      label: 'Growing together',
      worldPosition: [4, 1.5, -3],
      memoryId: 'photo-1',
    },
    {
      id: 'm-2026',
      date: '2026',
      label: 'Our chapter now',
      worldPosition: [5, 2, -4],
      memoryId: 'photo-3',
    },
  ],

  letter: [
    "There are things I don't say often enough.",
    'Thank you for being the gentle light in my life.',
    'For the ordinary days that become extraordinary with you.',
    "For the quiet moments when words aren't needed.",
    'For standing by me through every storm and every sunrise.',
    'And if I were given a thousand lifetimes to choose...',
    'I would still find you, and I would still choose you.',
  ],

  birthday: {
    enabled: true,
    message: 'Happy Birthday',
    wishPrompt: 'Make a Wish',
  },

  womensDay: {
    enabled: true,
    message: "Happy Women's Day",
    gardenPrompt: 'For the person who makes my world brighter and more beautiful every single day.',
  },

  finalScene: {
    line1: 'This little world is mine.',
    line2: "But you're my favorite part of it.",
    line3: 'I love you.',
    closing: 'See you in our next chapter.',
  },

  audio: {
    enabled: true,
    defaultVolume: 0.8,
  },
};
