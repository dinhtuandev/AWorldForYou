import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import * as THREE from 'three';
import { useExperienceStore } from '../../experience/ExperienceState';
import { useQualityTier } from '../../hooks/useQualityTier';
import type { MemorySceneId } from '../../types/experience.types';

export interface MemoryPortalProps {
  sceneType?: MemorySceneId;
  onTransitionEnd?: () => void;
}

// Ultra-fast 60fps GPU analytic vortex shader (zero heavy per-pixel simplex loops)
const portalVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorCore;
  uniform vec3 uColorInner;
  uniform vec3 uColorOuter;

  varying vec2 vUv;

  void main() {
    vec2 p = (vUv - 0.5) * 2.0;
    float r = length(p);
    float a = atan(p.y, p.x);

    // Fast analytic logarithmic spiral warp
    float spiral = a * 2.0 + r * 5.0 - uTime * 2.5;
    float wave1 = sin(spiral) * 0.5 + 0.5;
    float wave2 = sin(a * 4.0 - r * 3.0 + uTime * 1.8) * 0.5 + 0.5;
    float warp = (wave1 * 0.7 + wave2 * 0.3);

    float distortedR = r + (warp - 0.5) * 0.12;

    // Portal expansion window
    float expansion = smoothstep(0.0, 0.8, uProgress) * 1.25;
    float mask = smoothstep(expansion + 0.25, expansion - 0.15, distortedR);

    // Dynamic chromatic colors
    vec3 col = mix(uColorCore, uColorInner, smoothstep(0.0, 0.4, distortedR));
    col = mix(col, uColorOuter, smoothstep(0.3, 1.0, distortedR));

    // Luminous spiral energy arms
    col += uColorInner * pow(wave1, 3.0) * 1.2 * (1.0 - smoothstep(0.1, 0.8, distortedR));

    // Outer starlight rim flare
    float rim = smoothstep(expansion - 0.1, expansion, distortedR) * mask;
    col += rim * vec3(1.0, 0.95, 0.9) * 2.0;

    // Fade out as progress finishes
    float fade = 1.0 - smoothstep(0.75, 1.0, uProgress);
    float alpha = mask * fade;

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(col, alpha);
  }
`;

// GPU particle vertex shader (calculates motion entirely on GPU, zero CPU overhead)
const particleVertexShader = `
  uniform float uTime;
  uniform float uProgress;
  attribute float aAngle;
  attribute float aRadius;
  attribute float aSpeed;
  attribute float aSize;

  varying float vAlpha;

  void main() {
    float angle = aAngle + uTime * (aSpeed * 1.5);
    float r = aRadius * (0.4 + uProgress * 0.8);
    float z = mod(uTime * aSpeed * 2.0, 3.0) - 1.5;

    vec3 pos = vec3(cos(angle) * r, sin(angle) * r, z);
    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPos;

    gl_PointSize = aSize * (150.0 / -mvPos.z) * (0.8 + uProgress * 0.4);
    vAlpha = (1.0 - smoothstep(0.8, 1.0, uProgress)) * smoothstep(1.5, 0.0, abs(z));
  }
`;

const particleFragmentShader = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    vec2 p = gl_PointCoord - vec2(0.5);
    float dist = length(p);
    if (dist > 0.5) discard;
    float strength = pow(1.0 - dist * 2.0, 2.0) * vAlpha;
    gl_FragColor = vec4(uColor, strength);
  }
`;

export const MemoryPortal = ({ sceneType = 'beach', onTransitionEnd }: MemoryPortalProps) => {
  const { camera } = useThree();
  const { config } = useQualityTier();
  const isTransitioning = useExperienceStore((state) => state.isTransitioning);
  const setTransitioning = useExperienceStore((state) => state.setTransitioning);

  const portalMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const portalPalette = useMemo(() => {
    switch (sceneType) {
      case 'beach':
        return {
          core: '#ffffff',
          inner: '#fde047',
          outer: '#ea580c',
          particle: '#f97316',
        };
      case 'cafe':
        return {
          core: '#fffbeb',
          inner: '#f59e0b',
          outer: '#b45309',
          particle: '#d97706',
        };
      case 'nightWalk':
        return {
          core: '#ffffff',
          inner: '#818cf8',
          outer: '#4338ca',
          particle: '#6366f1',
        };
      case 'firstMeeting':
        return {
          core: '#ffffff',
          inner: '#f472b6',
          outer: '#9333ea',
          particle: '#ec4899',
        };
      default:
        return {
          core: '#ffffff',
          inner: '#38bdf8',
          outer: '#0284c7',
          particle: '#38bdf8',
        };
    }
  }, [sceneType]);

  const portalUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColorCore: { value: new THREE.Color(portalPalette.core) },
      uColorInner: { value: new THREE.Color(portalPalette.inner) },
      uColorOuter: { value: new THREE.Color(portalPalette.outer) },
    }),
    [portalPalette]
  );

  const particleUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color(portalPalette.particle) },
    }),
    [portalPalette]
  );

  // 80 GPU-driven particles
  const particleCount = Math.max(25, Math.floor(80 * config.particleDensity));
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;

      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 0.3 + Math.random() * 1.8;
      speeds[i] = Math.random() * 0.8 + 0.4;
      sizes[i] = Math.random() * 0.08 + 0.04;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aAngle', new THREE.BufferAttribute(angles, 1));
    geo.setAttribute('aRadius', new THREE.BufferAttribute(radii, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [particleCount]);

  // Entrance portal expansion animation
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTransitioning(false);
        onTransitionEnd?.();
      },
    });

    portalUniforms.uProgress.value = 0.05;
    particleUniforms.uProgress.value = 0.05;

    tl.to(
      [portalUniforms.uProgress, particleUniforms.uProgress],
      {
        value: 1.0,
        duration: 1.8,
        ease: 'power2.inOut',
      }
    );

    return () => {
      tl.kill();
    };
  }, [sceneType, onTransitionEnd, setTransitioning, portalUniforms, particleUniforms]);

  useFrame((_, delta) => {
    portalUniforms.uTime.value += delta;
    particleUniforms.uTime.value += delta;

    // Attach portal seamlessly in front of camera with zero lag
    if (portalMeshRef.current) {
      portalMeshRef.current.position.copy(camera.position);
      portalMeshRef.current.quaternion.copy(camera.quaternion);
      portalMeshRef.current.translateZ(-1.8);
      portalMeshRef.current.rotation.z += delta * 0.3;
    }

    if (particlesRef.current) {
      particlesRef.current.position.copy(camera.position);
      particlesRef.current.quaternion.copy(camera.quaternion);
      particlesRef.current.translateZ(-1.8);
    }
  });

  const portalMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
        uniforms: portalUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    [portalUniforms]
  );

  const particleMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms: particleUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [particleUniforms]
  );

  return (
    <group>
      {/* 60fps GPU Cosmic Portal Mesh */}
      <mesh ref={portalMeshRef} material={portalMaterial}>
        <planeGeometry args={[4.5, 4.5, 16, 16]} />
      </mesh>

      {/* 60fps GPU Spiraling Stardust Particles */}
      <points ref={particlesRef} geometry={particleGeo} material={particleMaterial} />

      {/* Point Light Flash */}
      <pointLight
        position={[camera.position.x, camera.position.y, camera.position.z]}
        distance={5.0}
        intensity={isTransitioning ? 3.0 : 0}
        color={portalPalette.particle}
      />
    </group>
  );
};
