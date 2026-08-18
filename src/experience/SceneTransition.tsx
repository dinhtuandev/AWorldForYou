import { useEffect, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface SceneTransitionProps {
  isActive: boolean;
  fadeDuration?: number;
  children: ReactNode;
}

export const SceneTransition = ({
  isActive,
  children,
}: SceneTransitionProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const opacityRef = useRef(isActive ? 1 : 0);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.visible = true;
    }
  }, [isActive]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const targetOpacity = isActive ? 1 : 0;
    opacityRef.current = THREE.MathUtils.damp(
      opacityRef.current,
      targetOpacity,
      6,
      delta
    );

    if (!isActive && opacityRef.current < 0.01) {
      groupRef.current.visible = false;
    } else {
      groupRef.current.visible = true;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};
