import { assetManifest } from '../data/assetManifest';

export type AssetProgressListener = (progress: number, isReady: boolean) => void;

export class AssetManager {
  private loadedAssets: Set<string> = new Set();
  private totalToPreload: number = 0;
  private progress: number = 0;
  private isReady: boolean = false;
  private listeners: Set<AssetProgressListener> = new Set();

  constructor() {
    this.totalToPreload = assetManifest.preload.length;
    if (this.totalToPreload === 0) {
      this.progress = 1;
      this.isReady = true;
    }
  }

  public subscribe(listener: AssetProgressListener): () => void {
    this.listeners.add(listener);
    listener(this.progress, this.isReady);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.progress, this.isReady));
  }

  public async preloadCritical(): Promise<void> {
    const preloadKeys = assetManifest.preload;
    if (preloadKeys.length === 0) {
      this.progress = 1;
      this.isReady = true;
      this.notify();
      return;
    }

    let loadedCount = 0;

    for (const key of preloadKeys) {
      try {
        await this.loadAssetByKey(key);
      } catch (err) {
        console.warn(`[AssetManager] Failed to preload asset ${key}:`, err);
      } finally {
        loadedCount += 1;
        this.loadedAssets.add(key);
        this.progress = loadedCount / preloadKeys.length;
        if (loadedCount >= preloadKeys.length) {
          this.isReady = true;
        }
        this.notify();
      }
    }
  }

  public async loadLazy(id: string): Promise<void> {
    if (this.loadedAssets.has(id)) return;
    await this.loadAssetByKey(id);
    this.loadedAssets.add(id);
  }

  private async loadAssetByKey(key: string): Promise<void> {
    const modelUrl = assetManifest.models[key];
    const textureUrl = assetManifest.textures[key];
    const audioUrl = assetManifest.audio[key];

    const url = modelUrl || textureUrl || audioUrl;
    if (!url) return;

    // Simulate / fetch preload check for assets
    return new Promise((resolve) => {
      // For images/textures
      if (textureUrl) {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Don't fail the whole app on missing assets in dev
        img.src = textureUrl;
        return;
      }

      // For models/audio/others, fetch headers or basic fetch
      fetch(url, { method: 'HEAD' })
        .then(() => resolve())
        .catch(() => resolve());
    });
  }

  public getProgress(): number {
    return this.progress;
  }

  public getIsReady(): boolean {
    return this.isReady;
  }
}

export const assetManager = new AssetManager();
