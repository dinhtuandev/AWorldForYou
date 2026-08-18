import { Howl, Howler } from 'howler';
import { assetManifest } from '../../data/assetManifest';
import { experienceData } from '../../data/experienceData';
import type { AudioLayer } from '../../types/experience.types';

const layerToAudioKey: Record<Exclude<AudioLayer, 'none'>, string> = {
  intro: 'audio-ambient-space',
  world: 'audio-world-atmosphere',
  memory: 'audio-memory-emotional',
  letter: 'audio-letter-piano',
  ending: 'audio-ending-crescendo',
  birthday: 'audio-birthday-music',
};

const layerCrossfadeDurations: Record<AudioLayer, number> = {
  none: 1000,
  intro: 2000,
  world: 2000,
  memory: 2000,
  letter: 2500,
  birthday: 2000,
  ending: 3000,
};

export class AudioManager {
  private sounds: Map<AudioLayer, Howl> = new Map();
  private currentLayer: AudioLayer = 'none';
  private targetLayer: AudioLayer = 'none';
  private isMuted: boolean = !experienceData.audio.enabled;
  private masterVolume: number = experienceData.audio.defaultVolume;
  private hasInteracted: boolean = false;
  private isTabHidden: boolean = false;

  constructor() {
    if (this.isMuted) {
      Howler.mute(true);
    }
    Howler.volume(this.masterVolume);
    this.initSounds();
    this.initVisibilityListener();
  }

  private initSounds() {
    (Object.keys(layerToAudioKey) as Array<Exclude<AudioLayer, 'none'>>).forEach((layer) => {
      const assetKey = layerToAudioKey[layer];
      const src = assetManifest.audio[assetKey];
      if (!src) return;

      const sound = new Howl({
        src: [src],
        loop: true,
        volume: 0,
        html5: false,
        onloaderror: (_id, err) => {
          // Graceful fallback for missing local files in development
          console.warn(`[AudioManager] Note: audio track for layer "${layer}" could not be loaded (${src}):`, err);
        },
      });

      this.sounds.set(layer, sound);
    });
  }

  private initVisibilityListener() {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      this.isTabHidden = document.hidden;
      if (this.isTabHidden) {
        // Pause active sounds when tab is backgrounded
        this.sounds.forEach((sound) => {
          if (sound.playing()) {
            sound.pause();
          }
        });
      } else {
        // Resume target layer when tab returns to foreground
        if (this.hasInteracted && !this.isMuted && this.currentLayer !== 'none') {
          const sound = this.sounds.get(this.currentLayer);
          if (sound && !sound.playing()) {
            sound.play();
            sound.fade(0, this.masterVolume, 1000);
          }
        }
      }
    });
  }

  public setInteracted(interacted: boolean) {
    this.hasInteracted = interacted;
    if (this.hasInteracted && this.targetLayer !== 'none' && this.currentLayer === 'none') {
      this.playLayer(this.targetLayer);
    }
  }

  public playLayer(layer: AudioLayer) {
    this.targetLayer = layer;
    if (!this.hasInteracted) return;
    if (layer === this.currentLayer) return;

    const duration = layerCrossfadeDurations[layer] ?? 2000;

    if (this.currentLayer !== 'none') {
      this.crossfadeTo(layer, duration);
      return;
    }

    if (layer === 'none') {
      this.currentLayer = 'none';
      return;
    }

    const sound = this.sounds.get(layer);
    if (!sound) {
      this.currentLayer = layer;
      return;
    }

    if (!this.isTabHidden) {
      sound.volume(0);
      sound.play();
      sound.fade(0, this.masterVolume, duration);
    }
    this.currentLayer = layer;
  }

  public crossfadeTo(nextLayer: AudioLayer, duration?: number) {
    this.targetLayer = nextLayer;
    if (!this.hasInteracted) return;
    if (nextLayer === this.currentLayer) return;

    const fadeDuration = duration ?? layerCrossfadeDurations[nextLayer] ?? 2000;

    const previousSound = this.sounds.get(this.currentLayer);
    if (previousSound && previousSound.playing()) {
      previousSound.fade(previousSound.volume(), 0, fadeDuration);
      setTimeout(() => {
        if (this.currentLayer !== nextLayer) {
          previousSound.pause();
        }
      }, fadeDuration);
    }

    if (nextLayer !== 'none') {
      const nextSound = this.sounds.get(nextLayer);
      if (nextSound) {
        if (!this.isTabHidden) {
          if (!nextSound.playing()) {
            nextSound.volume(0);
            nextSound.play();
          }
          nextSound.fade(nextSound.volume(), this.masterVolume, fadeDuration);
        }
      }
    }

    this.currentLayer = nextLayer;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    Howler.mute(muted);
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = volume;
    Howler.volume(volume);
  }

  public playSfx(sfxKey: string) {
    if (!this.hasInteracted || this.isTabHidden) return;
    const src = assetManifest.audio[sfxKey];
    if (!src) return;

    const sfx = new Howl({
      src: [src],
      loop: false,
      volume: this.masterVolume,
      onloaderror: (_id, err) => {
        console.warn(`[AudioManager] SFX failed to load (${src}):`, err);
      },
    });
    sfx.play();
  }

  public getCurrentLayer(): AudioLayer {
    return this.currentLayer;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }
}

export const audioManager = new AudioManager();
