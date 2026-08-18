import type { AssetManifest } from '../types/experience.types';

export const assetManifest: AssetManifest = {
  models: {
    // World Diorama
    'world-terrain': '/assets/models/world-terrain.glb',
    'world-house': '/assets/models/world-house.glb',
    'world-trees': '/assets/models/world-trees.glb',
    'world-flowers': '/assets/models/world-flowers.glb',
    'world-bridge': '/assets/models/world-bridge.glb',
    'world-lamp': '/assets/models/world-lamp.glb',
    'world-pond': '/assets/models/world-pond.glb',
    'world-mountains': '/assets/models/world-mountains.glb',
    'world-clouds': '/assets/models/world-clouds.glb',

    // Interactive Objects
    'obj-camera': '/assets/models/obj-camera.glb',
    'obj-musicbox': '/assets/models/obj-musicbox.glb',
    'obj-photo-frame': '/assets/models/obj-photo-frame.glb',
    'obj-envelope': '/assets/models/obj-envelope.glb',
    'obj-giftbox': '/assets/models/obj-giftbox.glb',
    'obj-clock': '/assets/models/obj-clock.glb',
    'obj-crystal': '/assets/models/obj-crystal.glb',

    // Memory Environments
    'mem-beach': '/assets/models/mem-beach.glb',
    'mem-cafe': '/assets/models/mem-cafe.glb',
    'mem-nightwalk': '/assets/models/mem-nightwalk.glb',
    'mem-symbolic': '/assets/models/mem-symbolic.glb',

    // Special Scenes
    'birthday-cake': '/assets/models/birthday-cake.glb',
    'final-heart': '/assets/models/final-heart.glb',
    'womens-flowers': '/assets/models/womens-flowers.glb',
  },
  textures: {
    'tex-ground': '/assets/textures/ground.webp',
    'tex-house-walls': '/assets/textures/house-walls.jpg',
    'tex-house-roof': '/assets/textures/house-roof.jpg',
    'tex-water-normal': '/assets/textures/water-normal.png',
    'tex-noise': '/assets/textures/noise.png',
    'tex-hdri-sunset': '/assets/textures/hdri-sunset.hdr',
    'tex-hdri-night': '/assets/textures/hdri-night.hdr',
  },
  audio: {
    'audio-ambient-space': '/assets/audio/ambient-space.mp3',
    'audio-world-atmosphere': '/assets/audio/world-atmosphere.mp3',
    'audio-memory-emotional': '/assets/audio/memory-emotional.mp3',
    'audio-letter-piano': '/assets/audio/letter-piano.mp3',
    'audio-ending-crescendo': '/assets/audio/ending-crescendo.mp3',
    'audio-birthday-music': '/assets/audio/birthday-music.mp3',
    'sfx-envelope-open': '/assets/audio/sfx-envelope-open.mp3',
    'sfx-candle-blow': '/assets/audio/sfx-candle-blow.mp3',
    'sfx-fireworks': '/assets/audio/sfx-fireworks.mp3',
    'sfx-flower-grow': '/assets/audio/sfx-flower-grow.mp3',
    'sfx-interact-hover': '/assets/audio/sfx-interact-hover.mp3',
  },
  preload: [
    'world-terrain',
    'world-house',
    'world-trees',
    'audio-ambient-space',
    'audio-world-atmosphere',
  ],
  lazy: [
    'mem-beach',
    'mem-cafe',
    'mem-nightwalk',
    'birthday-cake',
    'womens-flowers',
    'final-heart',
  ],
};
