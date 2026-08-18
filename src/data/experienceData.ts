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
      id: 'photo-4',
      objectType: 'envelope',
      title: 'The First Spark',
      date: 'March 2024',
      image: '/assets/images/placeholder-first.svg',
      description: 'The day we first met, when a simple conversation became the start of everything.',
      scene: 'firstMeeting',
      worldPosition: [-1.5, 0.5, -2],
    },
    {
      id: 'photo-1',
      objectType: 'photo',
      title: 'Beach Day',
      date: 'June 2024',
      image: '/assets/images/placeholder-beach.svg',
      description: 'Our first trip to the ocean together, walking barefoot as golden waves kissed the shore.',
      scene: 'beach',
      worldPosition: [-2, 0.5, 1],
    },
    {
      id: 'photo-2',
      objectType: 'camera',
      title: 'Warm Cafe Afternoon',
      date: 'September 2024',
      image: '/assets/images/placeholder-cafe.svg',
      description: 'Watching the gentle rain outside with warm coffee and laughter that made time stand still.',
      scene: 'cafe',
      worldPosition: [2, 0.5, -1],
    },
    {
      id: 'photo-3',
      objectType: 'musicbox',
      title: 'Midnight Walk Under Stars',
      date: 'December 2024',
      image: '/assets/images/placeholder-night.svg',
      description: 'Wrapped in a warm scarf, walking side by side under the golden glow of quiet streetlamps.',
      scene: 'nightWalk',
      worldPosition: [0, 0.5, -3],
    },
  ],

  timeline: [
    {
      id: 'm-step-1',
      date: '03.2024',
      label: 'The First Spark',
      worldPosition: [-1.5, 0.9, -2],
      memoryId: 'photo-4',
    },
    {
      id: 'm-step-2',
      date: '06.2024',
      label: 'Summer Ocean Breeze',
      worldPosition: [-2, 0.9, 1],
      memoryId: 'photo-1',
    },
    {
      id: 'm-step-3',
      date: '09.2024',
      label: 'Cozy Cafe Afternoon',
      worldPosition: [2, 0.9, -1],
      memoryId: 'photo-2',
    },
    {
      id: 'm-step-4',
      date: '12.2024',
      label: 'Midnight Walk Under Stars',
      worldPosition: [0, 0.9, -3],
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
