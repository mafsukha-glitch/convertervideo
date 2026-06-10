import { PresetOption, VideoFormat, VideoCodec, AudioCodec, ResolutionType, ConversionSettings } from './types';

export const SUPPORTED_FORMATS: VideoFormat[] = ['MP4', 'MKV', 'AVI', 'WEBM', 'MOV', 'FLV', 'MP3', 'WAV', 'M4A', 'FLAC'];

export const VIDEO_CODECS: VideoCodec[] = [
  'H.264 (AVC)',
  'H.265 (HEVC)',
  'AV1 (Ultra Premium)',
  'VP9 (Google Ecosystem)'
];

export const AUDIO_CODECS: AudioCodec[] = [
  'AAC (Advanced Audio)',
  'MP3 (MPEG Audio)',
  'Opus (Lossless Quality)',
  'FLAC (Lossless)'
];

export const RESOLUTIONS: { label: string; value: ResolutionType }[] = [
  { label: 'Keep Original', value: 'Keep Original' },
  { label: '4K Ultra HD (3840x2160)', value: '4K UHD (2160p)' },
  { label: '2K Quad HD (2560x1440)', value: '2K QHD (1440p)' },
  { label: 'Full HD (1920x1080)', value: 'FHD (1080p)' },
  { label: 'HD (1280x720)', value: 'HD (720p)' }
];

export const DEFAULT_SETTINGS: ConversionSettings = {
  format: 'MP4',
  codec: 'H.265 (HEVC)',
  resolution: 'FHD (1080p)',
  compressionLevel: 2, // Low compression = High Quality (Closer to Lossless)
  fpsValue: 0, // Original
  audioCodec: 'AAC (Advanced Audio)',
  audioBitrate: '192kbps',
  keepMetadata: true,
  hardwareAcceleration: true
};

export const PRESETS: PresetOption[] = [
  {
    id: 'preset-4k-lossless',
    name: 'Arsip Utama 4K Tanpa Kehilangan',
    description: 'Kompresi lossless CRF 0 terbaik dengan resolusi 4K asli, kualitas 100% utuh.',
    icon: 'HardDrive',
    settings: {
      format: 'MKV',
      codec: 'H.265 (HEVC)',
      resolution: '4K UHD (2160p)',
      compressionLevel: 0, // Pure Lossless
      audioCodec: 'FLAC (Lossless)',
      audioBitrate: 'Lossless'
    }
  },
  {
    id: 'preset-fast-web',
    name: 'Optimasi Web Cepat (H.264)',
    description: 'Format MP4 universal, ukuran file seimbang, kompatibel dengan semua website dan browser.',
    icon: 'Share2',
    settings: {
      format: 'MP4',
      codec: 'H.264 (AVC)',
      resolution: 'FHD (1080p)',
      compressionLevel: 4,
      audioCodec: 'AAC (Advanced Audio)',
      audioBitrate: '192kbps'
    }
  },
  {
    id: 'preset-high-av1',
    name: 'Codec Efisiensi Tinggi AV1',
    description: 'Standar masa depan. Kompresi file ekstrim hingga 50% lebih kecil dibanding HEVC tanpa penurunan kualitas.',
    icon: 'Zap',
    settings: {
      format: 'WEBM',
      codec: 'AV1 (Ultra Premium)',
      resolution: 'FHD (1080p)',
      compressionLevel: 3,
      audioCodec: 'Opus (Lossless Quality)',
      audioBitrate: '192kbps'
    }
  },
  {
    id: 'preset-audio-only',
    name: 'Ekstrak Audio Saja (MP3)',
    description: 'Melepas trek audio dari sumber video dan mengonversinya ke format MP3 320kbps audio HD.',
    icon: 'Music',
    settings: {
      format: 'MP3',
      codec: 'H.264 (AVC)', // Not used for audio, but kept for default
      resolution: 'Keep Original',
      compressionLevel: 2,
      audioCodec: 'MP3 (MPEG Audio)',
      audioBitrate: '320kbps'
    }
  }
];

export const INITIAL_LIBRARY_TASKS = [
  {
    id: 'lib-1',
    fileName: 'Cinematic_Vlog_Bali_4K.mp4',
    fileSize: 4528994304, // 4.22 GB
    fileType: 'video/mp4',
    originalDuration: '08:42',
    originalResolution: '3840x2160',
    originalFormat: 'MP4',
    originalSizeStr: '4.22 GB',
    targetFormat: 'WEBM' as VideoFormat,
    targetResolution: '4K UHD (2160p)' as ResolutionType,
    targetCodec: 'AV1 (Ultra Premium)' as VideoCodec,
    compressionLevel: 0,
    status: 'completed' as const,
    progress: 100,
    elapsedSeconds: 312,
    speedFps: 58,
    estimatedRemainingSeconds: 0,
    outputSize: 1395864371, // 1.30 GB (huge saving!)
    outputSizeStr: '1.30 GB',
    completedAt: '9 Jun, 19:42'
  },
  {
    id: 'lib-2',
    fileName: 'Screencast_Tutorial_Android.mov',
    fileSize: 345000000, // 345 MB
    fileType: 'video/quicktime',
    originalDuration: '15:10',
    originalResolution: '1920x1080',
    originalFormat: 'MOV',
    originalSizeStr: '345.0 MB',
    targetFormat: 'MP4' as VideoFormat,
    targetResolution: 'FHD (1080p)' as ResolutionType,
    targetCodec: 'H.265 (HEVC)' as VideoCodec,
    compressionLevel: 2,
    status: 'completed' as const,
    progress: 100,
    elapsedSeconds: 42,
    speedFps: 120,
    estimatedRemainingSeconds: 0,
    outputSize: 68400000, // 68.4 MB (lossless compression)
    outputSizeStr: '68.4 MB',
    completedAt: '9 Jun, 15:30'
  },
  {
    id: 'lib-3',
    fileName: 'Conference_Keynote_Speech.avi',
    fileSize: 1890000000, // 1.89 GB
    fileType: 'video/x-msvideo',
    originalDuration: '45:00',
    originalResolution: '1280x720',
    originalFormat: 'AVI',
    originalSizeStr: '1.89 GB',
    targetFormat: 'MP4' as VideoFormat,
    targetResolution: 'HD (720p)' as ResolutionType,
    targetCodec: 'H.264 (AVC)' as VideoCodec,
    compressionLevel: 5,
    status: 'completed' as const,
    progress: 100,
    elapsedSeconds: 154,
    speedFps: 180,
    estimatedRemainingSeconds: 0,
    outputSize: 398000000, // 398 MB
    outputSizeStr: '398.0 MB',
    completedAt: '8 Jun, 10:15'
  }
];
