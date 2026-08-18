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

// Advanced Cosmic Nebula Spiral Portal Shader
const portalVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const portalFragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 uColorInner;
  uniform vec3 uColorOuter;
  uniform vec3 uColorCore;
  uniform float uNoiseIntensity;

  varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;

  // 2D Simplex noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
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
    float dist = length(centeredUv) * 2.0; // 0 at center, 1 at edge
    float angle = atan(centeredUv.y, centeredUv.x);

    // Multi-octave logarithmic spiral arms
    float spiral = angle * 3.0 + dist * 6.0 - uTime * 2.2;
    float noise1 = snoise(vec2(dist * 3.0 - uTime * 0.8, spiral * 0.5)) * uNoiseIntensity;
    float noise2 = snoise(vec2(dist * 6.0 + uTime * 1.2, angle * 4.0 - uTime * 1.5)) * (uNoiseIntensity * 0.5);

    float combinedDist = dist + noise1 * 0.18 + noise2 * 0.08;

    // Organic non-circular portal threshold driven by progress
    float portalExpansion = smoothstep(0.0, 0.85, uProgress) * 1.35;
    float portalAlpha = smoothstep(portalExpansion + 0.35, portalExpansion - 0.25, combinedDist);

    // Dynamic color gradient from radiant starlight core to outer nebula flare
    vec3 color = mix(uColorCore, uColorInner, smoothstep(0.0, 0.45, combinedDist));
    color = mix(color, uColorOuter, smoothstep(0.35, 1.1, combinedDist));

    // Chromatic spiral energy filaments
    float filaments = pow(max(0.0, sin(spiral * 2.0 + noise1 * 4.0)), 3.0) * 1.8;
    color += filaments * uColorInner * (1.0 - smoothstep(0.2, 0.9, combinedDist));

    // Glowing starlight corona rim
    float rimFlare = smoothstep(portalExpansion - 0.15, portalExpansion + 0.1, combinedDist) *
                     smoothstep(portalExpansion + 0.35, portalExpansion + 0.05, combinedDist);
    color += rimFlare * vec3(1.0, 0.95, 0.85) * 2.5;

    // Master fade out as transition reaches climax
    float fade = 1.0 - smoothstep(0.75, 1.0, uProgress);
    float finalAlpha = portalAlpha * fade;

    if (finalAlpha < 0.01) discard;

    gl_FragColor = vec4(color, finalAlpha);
  }
`;

export const MemoryPortal = ({ sceneType = 'beach', onTransitionEnd }: MemoryPortalProps) => {
  const { camera } = useThree();
  const { config } = useQualityTier();
  const isTransitioning = useExperienceStore((state) => state.isTransitioning);
  const setTransitioning = useExperienceStore((state) => state.setTransitioning);

  const portalMeshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const uniformsRef = useRef({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uColorCore: { value: new THREE.Color('#ffffff') },
    uColorInner: { value: new THREE.Color('#38bdf8') },
    uColorOuter: { value: new THREE.Color('#0284c7') },
    uNoiseIntensity: { value: config.postProcessing === 'minimal' ? 0.4 : 0.85 },
  });

  const portalPalette = useMemo(() => {
    switch (sceneType) {
      case 'beach':
        return {
          core: '#ffffff',
          inner: '#fde047',
          outer: '#ea580c',
          ambient: '#fb923c',
        };
      case 'cafe':
        return {
          core: '#fffbeb',
          inner: '#f59e0b',
          outer: '#b45309',
          ambient: '#d97706',
        };
      case 'nightWalk':
        return {
          core: '#ffffff',
          inner: '#818cf8',
          outer: '#4338ca',
          ambient: '#6366f1',
        };
      case 'firstMeeting':
        return {
          core: '#ffffff',
          inner: '#f472b6',
          outer: '#9333ea',
          ambient: '#ec4899',
        };
      default:
        return {
          core: '#ffffff',
          inner: '#38bdf8',
          outer: '#0284c7',
          ambient: '#0ea5e9',
        };
    }
  }, [sceneType]);

  useEffect(() => {
    uniformsRef.current.uColorCore.value.set(portalPalette.core);
    uniformsRef.current.uColorInner.value.set(portalPalette.inner);
    uniformsRef.current.uColorOuter.value.set(portalPalette.outer);
  }, [portalPalette]);

  // 120 Spiraling Stardust Particles
  const particleCount = Math.max(30, Math.floor(120 * config.particleDensity));
  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);
    const zSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.3 + Math.random() * 2.2;
      const z = (Math.random() - 0.5) * 1.5;

      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius;
      positions[i * 3 + 2] = z;

      scales[i] = Math.random() * 0.08 + 0.03;
      angles[i] = angle;
      radii[i] = radius;
      zSpeeds[i] = Math.random() * 0.8 + 0.4;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    return { geo, angles, radii, zSpeeds };
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
      duration: 2.2,
      ease: 'power2.inOut',
    });

    return () => {
      tl.kill();
    };
  }, [sceneType, onTransitionEnd, setTransitioning]);

  useFrame((_, delta) => {
    uniformsRef.current.uTime.value += delta;

    // Attach portal smoothly in front of camera
    if (portalMeshRef.current) {
      portalMeshRef.current.position.copy(camera.position);
      portalMeshRef.current.quaternion.copy(camera.quaternion);
      portalMeshRef.current.translateZ(-1.8);
      portalMeshRef.current.rotation.z += delta * 0.25;
    }

    if (outerRingRef.current) {
      outerRingRef.current.position.copy(camera.position);
      outerRingRef.current.quaternion.copy(camera.quaternion);
      outerRingRef.current.translateZ(-1.9);
      outerRingRef.current.rotation.z -= delta * 0.4;
      const ringScale = 1.0 + uniformsRef.current.uProgress.value * 0.6;
      outerRingRef.current.scale.set(ringScale, ringScale, ringScale);
    }

    // Swirl particles in 3D vortex towards camera
    if (particlesRef.current) {
      particlesRef.current.position.copy(camera.position);
      particlesRef.current.quaternion.copy(camera.quaternion);
      particlesRef.current.translateZ(-2.0);

      const positions = particleGeo.geo.attributes.position.array as Float32Array;
      const progress = uniformsRef.current.uProgress.value;

      for (let i = 0; i < particleCount; i++) {
        particleGeo.angles[i] += delta * (2.2 + (i % 4) * 0.4);
        const r = particleGeo.radii[i] * (0.6 + progress * 0.8);
        positions[i * 3] = Math.cos(particleGeo.angles[i]) * r;
        positions[i * 3 + 1] = Math.sin(particleGeo.angles[i]) * r;
        // Move towards camera
        positions[i * 3 + 2] += delta * particleGeo.zSpeeds[i] * 1.5;
        if (positions[i * 3 + 2] > 1.2) {
          positions[i * 3 + 2] = -1.5;
        }
      }
      particleGeo.geo.attributes.position.needsUpdate = true;
    }
  });

  const portalMaterial = useMemo(
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
      {/* Dynamic Cosmic Portal Plane */}
      <mesh ref={portalMeshRef} material={portalMaterial}>
        <planeGeometry args={[5.2, 5.2, 48, 48]} />
      </mesh>

      {/* Outer Ethereal Glowing Ring Flare */}
      <mesh ref={outerRingRef}>
        <ringGeometry args={[1.1, 1.35, 48]} />
        <meshBasicMaterial
          color={portalPalette.ambient}
          transparent
          opacity={isTransitioning ? 0.75 : 0.0}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 3D Spiraling Stardust Particles */}
      <points ref={particlesRef} geometry={particleGeo.geo}>
        <pointsMaterial
          size={0.08}
          color={portalPalette.inner}
          transparent
          opacity={isTransitioning ? 0.95 : 0.0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Point Light Flash */}
      <pointLight
        position={[camera.position.x, camera.position.y, camera.position.z]}
        distance={6.0}
        intensity={isTransitioning ? 3.5 : 0}
        color={portalPalette.inner}
      />
    </group>
  );
};
