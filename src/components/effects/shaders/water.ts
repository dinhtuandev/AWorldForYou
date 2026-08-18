import * as THREE from 'three';

export const WaterVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaveStrength;
  uniform float uQuality;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vWaveHeight;

  void main() {
    vUv = uv;

    // Calculate wave displacement
    vec3 pos = position;
    float dist = length(pos.xz);

    // Multi-octave wave superposition
    float wave1 = sin(dist * 6.0 - uTime * 2.2) * 0.035 * uWaveStrength;
    float wave2 = cos(pos.x * 4.5 + pos.y * 3.0 + uTime * 1.5) * 0.02 * uWaveStrength;
    float wave3 = sin(pos.y * 5.0 - uTime * 1.8) * 0.015 * uWaveStrength;

    float totalWave = (wave1 + wave2 + wave3) * uQuality;
    pos.z += totalWave; // Local Z is surface normal for default plane/circle

    vWaveHeight = totalWave;

    // Approximate normal perturbation from wave derivatives
    vec3 normalMod = normal;
    normalMod.x += cos(dist * 6.0 - uTime * 2.2) * 0.15 * uQuality;
    normalMod.y += sin(pos.x * 4.5 + uTime * 1.5) * 0.15 * uQuality;
    vNormal = normalize(normalMatrix * normalMod);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const WaterFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uDeepColor;
  uniform vec3 uShallowColor;
  uniform vec3 uFresnelColor;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying float vWaveHeight;

  // Simple procedural noise for caustics / ripples
  float ripplePattern(vec2 uv, float time) {
    vec2 p0 = uv * 18.0 + vec2(time * 0.6, time * 0.4);
    vec2 p1 = uv * 24.0 - vec2(time * 0.5, -time * 0.7);
    float n1 = sin(p0.x) * cos(p0.y);
    float n2 = sin(p1.x) * cos(p1.y);
    return (n1 + n2) * 0.5 + 0.5;
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel reflectance computation
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);

    // Base color gradient influenced by wave height
    vec3 waterColor = mix(uDeepColor, uShallowColor, clamp(vWaveHeight * 12.0 + 0.5, 0.0, 1.0));

    // Animated caustics / ripple highlights
    float caustics = ripplePattern(vUv, uTime);
    float shimmer = pow(caustics, 4.0) * 0.45;
    waterColor += vec3(shimmer);

    // Blend in fresnel reflection at grazing angles
    vec3 finalColor = mix(waterColor, uFresnelColor, fresnel * 0.65);

    // Soft edge transparency based on radial UV
    float distFromCenter = length(vUv - vec2(0.5)) * 2.0;
    float edgeAlpha = smoothstep(1.0, 0.85, distFromCenter);

    gl_FragColor = vec4(finalColor, uOpacity * edgeAlpha);
  }
`;

export interface WaterMaterialUniforms {
  uTime: { value: number };
  uWaveStrength: { value: number };
  uQuality: { value: number };
  uDeepColor: { value: THREE.Color };
  uShallowColor: { value: THREE.Color };
  uFresnelColor: { value: THREE.Color };
  uOpacity: { value: number };
}

export const createWaterMaterial = (quality = 1.0) => {
  return new THREE.ShaderMaterial({
    vertexShader: WaterVertexShader,
    fragmentShader: WaterFragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uWaveStrength: { value: 1.0 },
      uQuality: { value: quality },
      uDeepColor: { value: new THREE.Color('#172554') },
      uShallowColor: { value: new THREE.Color('#0284c7') },
      uFresnelColor: { value: new THREE.Color('#bae6fd') },
      uOpacity: { value: 0.92 },
    },
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
};
