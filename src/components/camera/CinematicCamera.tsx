import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { CameraDirectorProvider } from '../../experience/CameraDirector';
import type { ReactNode } from 'react';

export interface CinematicCameraProps {
  children?: ReactNode;
}

export const CinematicCamera = ({ children }: CinematicCameraProps) => {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return <CameraDirectorProvider>{children}</CameraDirectorProvider>;
};
