export type TabType = 'convert' | 'batch' | 'library' | 'settings';

export type VideoFormat = 'MP4' | 'MKV' | 'AVI' | 'WEBM' | 'MOV' | 'FLV' | 'MP3' | 'WAV' | 'M4A' | 'FLAC';
export type VideoCodec = 'H.264 (AVC)' | 'H.265 (HEVC)' | 'AV1 (Ultra Premium)' | 'VP9 (Google Ecosystem)';
export type AudioCodec = 'AAC (Advanced Audio)' | 'MP3 (MPEG Audio)' | 'Opus (Lossless Quality)' | 'FLAC (Lossless)';
export type ResolutionType = '4K UHD (2160p)' | '2K QHD (1440p)' | 'FHD (1080p)' | 'HD (720p)' | 'Keep Original';

export interface ConversionSettings {
  format: VideoFormat;
  codec: VideoCodec;
  resolution: ResolutionType;
  compressionLevel: number; // 0 = Pure Lossless (CRF 0), 10 = Best Speed (Higher CRF)
  fpsValue: number; // 24, 30, 60 or 0 for Original
  audioCodec: AudioCodec;
  audioBitrate: string; // "128kbps", "192kbps", "320kbps", "Lossless"
  keepMetadata: boolean;
  hardwareAcceleration: boolean;
}

export type QueueStatus = 'waiting' | 'processing' | 'completed' | 'failed' | 'paused';

export interface ConversionTask {
  id: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  originalDuration: string; // e.g. "02:45"
  originalResolution: string; // e.g. "3840x2160" or "1920x1080"
  originalFormat: string;
  originalSizeStr: string;
  
  // Target setup
  targetFormat: VideoFormat;
  targetResolution: ResolutionType;
  targetCodec: VideoCodec;
  compressionLevel: number;
  
  // Processing metric
  status: QueueStatus;
  progress: number; // 0 to 100
  elapsedSeconds: number;
  speedFps: number; // e.g., 45 fps
  estimatedRemainingSeconds: number;
  outputSize?: number; // compressed size
  outputSizeStr?: string;
  errorMsg?: string;
  completedAt?: string;
}

export interface PresetOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  settings: Partial<ConversionSettings>;
}

export interface VideoStats {
  totalProcessed: number;
  totalStorageSaved: number; // in bytes
  averageTime: number; // seconds
}
