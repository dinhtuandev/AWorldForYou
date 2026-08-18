import { useEffect, useState } from 'react';
import { assetManager } from '../experience/AssetManager';

export const useAssetProgress = () => {
  const [progress, setProgress] = useState(assetManager.getProgress());
  const [isReady, setIsReady] = useState(assetManager.getIsReady());

  useEffect(() => {
    const unsubscribe = assetManager.subscribe((nextProgress, nextIsReady) => {
      setProgress(nextProgress);
      setIsReady(nextIsReady);
    });

    assetManager.preloadCritical();

    return () => {
      unsubscribe();
    };
  }, []);

  const handlePreloadCritical = async () => {
    await assetManager.preloadCritical();
  };

  const handleLoadLazy = async (id: string) => {
    await assetManager.loadLazy(id);
  };

  return {
    progress,
    isReady,
    handlePreloadCritical,
    handleLoadLazy,
  };
};
