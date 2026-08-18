export type ExperiencePhase =
  | 'loading'
  | 'intro'
  | 'world'
  | 'memory'
  | 'timeline'
  | 'letter'
  | 'birthday'
  | 'womensDay'
  | 'final';

export type QualityTier = 'high' | 'medium' | 'low';

export type ExperienceMode = 'default' | 'birthday' | 'womensDay';

export type MemorySceneId = 'beach' | 'cafe' | 'nightWalk' | 'firstMeeting';

export type AudioLayer =
  | 'intro'
  | 'world'
  | 'memory'
  | 'letter'
  | 'ending'
  | 'birthday'
  | 'none';

export interface Memory {
  id: string;
  objectType: string;
  title: string;
  date: string;
  image: string;
  description: string;
  scene: MemorySceneId;
  worldPosition: [number, number, number];
}

export interface TimelineMilestone {
  id: string;
  date: string;
  label: string;
  worldPosition: [number, number, number];
  memoryId?: string;
}

export interface ExperienceData {
  girlfriendName: string;
  senderName: string;
  mode: ExperienceMode;
  intro: {
    line1: string;
    line2: string;
  };
  loading: {
    building: string;
    ready: string;
  };
  memories: Memory[];
  timeline: TimelineMilestone[];
  letter: string[];
  birthday?: {
    enabled: boolean;
    message: string;
    wishPrompt: string;
  };
  womensDay?: {
    enabled: boolean;
    message: string;
    gardenPrompt: string;
  };
  finalScene: {
    line1: string;
    line2: string;
    line3: string;
    closing: string;
  };
  audio: {
    enabled: boolean;
    defaultVolume: number;
  };
}

export interface CameraDofConfig {
  focusDistance: number;
  bokehScale: number;
  focalLength?: number;
}

export interface CameraKeyframe {
  position: [number, number, number];
  target?: [number, number, number];
  lookAt?: [number, number, number];
  fov?: number;
  duration: number;
  ease?: string;
  dof?: CameraDofConfig;
}

export interface CameraSequence {
  id: string;
  keyframes: CameraKeyframe[];
  onComplete?: () => void;
}

export type AffordanceType = 'glow' | 'scale' | 'light' | 'particles' | 'bounce' | 'none';

export interface InteractiveObjectConfig {
  id: string;
  label?: string;
  position: [number, number, number];
  worldPosition?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  hoverRadius?: number;
  affordance?: AffordanceType;
  cameraSequenceId?: string;
  onInteract?: () => void;
  disabledWhen?: ExperiencePhase[];
}

export interface AssetManifest {
  models: Record<string, string>;
  textures: Record<string, string>;
  audio: Record<string, string>;
  preload: string[];
  lazy: string[];
}

export interface QualityPreset {
  dprMax: number;
  shadows: boolean;
  postProcessing: 'full' | 'partial' | 'minimal';
  particles: number;
}

export interface ExperienceStore {
  // State
  phase: ExperiencePhase;
  previousPhase: ExperiencePhase | null;
  userHasInteracted: boolean;
  isTransitioning: boolean;
  activeMemoryId: string | null;
  visitedMemoryIds: string[];
  activeMilestoneId: string | null;
  visitedMilestoneIds: string[];
  letterLineIndex: number;
  audioEnabled: boolean;
  currentAudioLayer: AudioLayer;
  qualityTier: QualityTier;
  mode: ExperienceMode;

  // Actions
  setPhase: (phase: ExperiencePhase) => void;
  enterMemory: (id: string) => void;
  exitMemory: () => void;
  selectMilestone: (id: string) => void;
  advanceLetter: () => void;
  resetLetter: () => void;
  markUserInteraction: () => void;
  setQualityTier: (tier: QualityTier) => void;
  setTransitioning: (v: boolean) => void;
  setAudioEnabled: (enabled: boolean) => void;
  setAudioLayer: (layer: AudioLayer) => void;
  setMode: (mode: ExperienceMode) => void;
  resetExperience: () => void;
}
