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

// Custom GLSL Portal Shader
const portalVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const portalFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorInner;
  uniform vec3 uColorOuter;
  uniform float uNoiseIntensity;

  varying vec2 vUv;
  varying vec3 vPosition;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
      dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 centeredUv = vUv - vec2(0.5);
    float dist = length(centeredUv);
    float angle = atan(centeredUv.y, centeredUv.x);

    // Swirl noise
    float noise = snoise(vec2(dist * 5.0 - uTime * 0.8, angle * 2.0 + uTime * 0.5)) * uNoiseIntensity;
    float dynamicDist = dist + noise * 0.08;

    // Outer edge softness driven by uProgress
    float portalRadius = smoothstep(0.0, 1.0, uProgress) * 0.75;
    float edgeWidth = 0.15;
    float mask = smoothstep(portalRadius, portalRadius - edgeWidth, dynamicDist);

    // Chromatic rim glow
    float rim = smoothstep(portalRadius - edgeWidth, portalRadius, dynamicDist) * mask;

    vec3 color = mix(uColorInner, uColorOuter, dynamicDist * 1.8);
    color += rim * vec3(1.0, 0.95, 0.8) * 1.5;

    // Fade out as progress approaches completion or 0
    float alpha = mask * (1.0 - smoothstep(0.85, 1.0, uProgress));

    gl_FragColor = vec4(color, alpha);
  }
`;

export const MemoryPortal = ({ sceneType = 'beach', onTransitionEnd }: MemoryPortalProps) => {
  const { camera } = useThree();
  const { config } = useQualityTier();
  const isTransitioning = useExperienceStore((state) => state.isTransitioning);
  const setTransitioning = useExperienceStore((state) => state.setTransitioning);

  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const uniformsRef = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColorInner: { value: new THREE.Color('#ffffff') },
    uColorOuter: { value: new THREE.Color('#38bdf8') },
    uNoiseIntensity: { value: config.postProcessing === 'minimal' ? 0.3 : 0.8 },
  });

  const portalColors = useMemo(() => {
    switch (sceneType) {
      case 'beach':
        return { inner: '#fff7ed', outer: '#f97316' };
      case 'cafe':
        return { inner: '#fffbeb', outer: '#d97706' };
      case 'nightWalk':
        return { inner: '#e0e7ff', outer: '#6366f1' };
      case 'firstMeeting':
        return { inner: '#fdf4ff', outer: '#ec4899' };
      default:
        return { inner: '#ffffff', outer: '#38bdf8' };
    }
  }, [sceneType]);

  useEffect(() => {
    uniformsRef.current.uColorInner.value.set(portalColors.inner);
    uniformsRef.current.uColorOuter.value.set(portalColors.outer);
  }, [portalColors]);

  // Swirling portal particles
  const particleCount = Math.max(15, Math.floor(60 * config.particleDensity));
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;

      scales[i] = Math.random() * 0.05 + 0.02;
      angles[i] = angle;
      radii[i] = radius;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    return { geo, angles, radii };
  }, [particleCount]);

  // Entrance portal expansion animation
  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setTransitioning(false);
        onTransitionEnd?.();
      },
    });

    uniformsRef.current.uProgress.value = 0.05;

    tl.to(uniformsRef.current.uProgress, {
      value: 1.0,
      duration: 1.8,
      ease: 'power2.inOut',
    });

    return () => {
      tl.kill();
    };
  }, [sceneType, onTransitionEnd, setTransitioning]);

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta;

    // Attach portal mesh just in front of camera
    if (meshRef.current) {
      meshRef.current.position.copy(camera.position);
      meshRef.current.quaternion.copy(camera.quaternion);
      meshRef.current.translateZ(-2.0);
    }

    // Swirl particles around portal
    if (particlesRef.current) {
      particlesRef.current.position.copy(camera.position);
      particlesRef.current.quaternion.copy(camera.quaternion);
      particlesRef.current.translateZ(-2.2);

      const positions = particleGeo.geo.attributes.position.array as Float32Array;
      const progress = uniformsRef.current.uProgress.value;

      for (let i = 0; i < particleCount; i++) {
        particleGeo.angles[i] += delta * (1.5 + (i % 3) * 0.5);
        const r = particleGeo.radii[i] * (0.8 + progress * 0.6);
        positions[i * 3] = Math.cos(particleGeo.angles[i]) * r;
        positions[i * 3 + 1] = Math.sin(particleGeo.angles[i]) * r;
      }
      particleGeo.geo.attributes.position.needsUpdate = true;
    }
  });

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: portalVertexShader,
        fragmentShader: portalFragmentShader,
        uniforms: uniformsRef.current,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      }),
    []
  );

  return (
    <group>
      {/* Portal Shader Plane */}
      <mesh ref={meshRef} material={material}>
        <planeGeometry args={[4.2, 4.2, 32, 32]} />
      </mesh>

      {/* Orbiting Stardust Particles */}
      <points ref={particlesRef} geometry={particleGeo.geo}>
        <pointsMaterial
          size={0.06}
          color={portalColors.outer}
          transparent
          opacity={isTransitioning ? 0.9 : 0.0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
};
