import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { useCameraDirector } from '../../experience/CameraDirector';
import { useInteractionManager } from '../../experience/InteractionManager';
import { getDeviceInfo } from '../../utils/device';
import { HoverAffordance } from './HoverAffordance';
import type {
  AffordanceType,
  ExperiencePhase,
} from '../../types/experience.types';

export interface InteractiveObjectProps {
  id: string;
  label?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number] | number;
  hoverRadius?: number;
  affordance?: AffordanceType;
  cameraSequenceId?: string;
  onInteract?: () => void;
  disabledWhen?: ExperiencePhase[];
  children: ReactNode;
}

export const InteractiveObject = ({
  id,
  label,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  hoverRadius = 1.0,
  affordance = 'glow',
  cameraSequenceId,
  onInteract,
  disabledWhen,
  children,
}: InteractiveObjectProps) => {
  const {
    registerObject,
    unregisterObject,
    setHoveredObject,
    handleInteract,
    hoveredId,
    isInteractive,
  } = useInteractionManager();

  const [touchActive, setTouchActive] = useState(false);
  const deviceInfo = useMemo(() => getDeviceInfo(), []);
  const isTouchDevice = deviceInfo.isTouch || deviceInfo.isMobile;

  let cameraDirector: ReturnType<typeof useCameraDirector> | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    cameraDirector = useCameraDirector();
  } catch {
    // Fallback if camera director is not in parent tree
  }

  const isHovered = hoveredId === id || touchActive;
  const onInteractRef = useRef(onInteract);
  onInteractRef.current = onInteract;

  useEffect(() => {
    registerObject({
      id,
      label,
      position,
      affordance,
      cameraSequenceId,
      disabledWhen,
      onInteract: () => {
        if (cameraSequenceId && cameraDirector) {
          cameraDirector.playSequence(cameraSequenceId);
        }
        onInteractRef.current?.();
      },
    });

    return () => {
      unregisterObject(id);
    };
  }, [id, label, position, affordance, cameraSequenceId, disabledWhen, registerObject, unregisterObject, cameraDirector]);

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (!isInteractive(id)) return;
    setHoveredObject(id);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (hoveredId === id) {
      setHoveredObject(null);
    }
    setTouchActive(false);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    if (isTouchDevice && isInteractive(id)) {
      setTouchActive(true);
    }
  };

  const handlePointerUp = () => {
    if (touchActive) {
      setTimeout(() => setTouchActive(false), 300);
    }
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (!isInteractive(id)) return;
    setTouchActive(true);
    setTimeout(() => setTouchActive(false), 400);
    handleInteract(id);
  };

  const normalizedScale: [number, number, number] = Array.isArray(scale)
    ? scale
    : [scale, scale, scale];

  // Magnified hit area for mobile/touch devices (1.5x)
  const hitScale = isTouchDevice ? hoverRadius * 1.5 : hoverRadius;

  return (
    <group
      position={position}
      rotation={rotation}
      scale={normalizedScale}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={handleClick}
    >
      <HoverAffordance isHovered={isHovered} affordance={affordance}>
        {children}
      </HoverAffordance>

      {/* Invisible Expanded Hit Target for Touch & Precision click */}
      <mesh visible={false}>
        <sphereGeometry args={[hitScale, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
};
