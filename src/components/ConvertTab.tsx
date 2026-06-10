import React, { useState, useRef } from 'react';
import { 
  FileVideo, 
  Upload, 
  Sparkles, 
  Sliders, 
  Volume2, 
  Layers, 
  FolderOpen,
  Plus, 
  X, 
  Info, 
  Check, 
  Zap, 
  Video,
  Settings as SettingsIcon,
  Play
} from 'lucide-react';
import { ConversionSettings, VideoFormat, VideoCodec, AudioCodec, ResolutionType, ConversionTask } from '../types';
import { SUPPORTED_FORMATS, VIDEO_CODECS, AUDIO_CODECS, RESOLUTIONS, DEFAULT_SETTINGS, PRESETS } from '../data';

interface ConvertTabProps {
  onAddTasks: (newTasks: Omit<ConversionTask, 'id' | 'status' | 'progress' | 'elapsedSeconds' | 'speedFps' | 'estimatedRemainingSeconds'>[]) => void;
  hardwareAcceleration: boolean;
}

interface SelectedFile {
  name: string;
  size: number;
  sizeStr: string;
  type: string;
  duration: string;
  resolution: string;
  format: string;
}

export default function ConvertTab({ onAddTasks, hardwareAcceleration }: ConvertTabProps) {
  // Local settings based on default
  const [settings, setSettings] = useState<ConversionSettings>(DEFAULT_SETTINGS);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Hover or selected preset state
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Helper files for quick testing simulation
  const mockSampleFiles: SelectedFile[] = [
    {
      name: 'Vlog_Liburan_Bali_4K_Master.mov',
      size: 2147483648, // 2.0 GB
      sizeStr: '2.00 GB',
      type: 'video/quicktime',
      duration: '05:12',
      resolution: '4K UHD (3840x2160)',
      format: 'MOV'
    },
    {
      name: 'Dokumenter_Kuliner_Jalanan.mp4',
      size: 471859200, // 450 MB
      sizeStr: '450.0 MB',
      type: 'video/mp4',
      duration: '12:35',
      resolution: 'FHD (1920x1080)',
      format: 'MP4'
    },
    {
      name: 'Drone_Footage_Forest_Cinema_Raw.mkv',
      size: 3650722201, // 3.4 GB
      sizeStr: '3.40 GB',
      type: 'video/x-matroska',
      duration: '03:45',
      resolution: '4K UHD (3840x2160)',
      format: 'MKV'
    }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processUploadedFiles = (filesList: FileList) => {
    const newFiles: SelectedFile[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const sizeMB = file.size / (1024 * 1024);
      const sizeStr = sizeMB > 1024 
        ? `${(sizeMB / 1024).toFixed(2)} GB` 
        : `${sizeMB.toFixed(1)} MB`;
      
      const formatExt = file.name.split('.').pop()?.toUpperCase() || 'MP4';
      
      // Determine simulated resolution based on file size
      let simRes = 'FHD (1920x1080)';
      if (file.size > 1.5 * 1024 * 1024 * 1024) {
        simRes = '4K UHD (3840x2160)';
      } else if (file.size < 100 * 1024 * 1024) {
        simRes = 'HD (1280x720)';
      }

      // Simulate a duration based on file name length or size
      const minVal = Math.floor(Math.random() * 8) + 1;
      const secVal = Math.floor(Math.random() * 60).toString().padStart(2, '0');
      const simDuration = `0${minVal}:${secVal}`;

      newFiles.push({
        name: file.name,
        size: file.size,
        sizeStr,
        type: file.type || 'video/mp4',
        duration: simDuration,
        resolution: simRes,
        format: formatExt
      });
    }

    setSelectedFiles((prev) => [...prev, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFiles(e.target.files);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addSampleFile = (sample: SelectedFile) => {
    setSelectedFiles((prev) => [...prev, sample]);
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setSettings((prev) => ({
      ...prev,
      ...preset.settings
    }));
    setActivePresetId(preset.id);
  };

  const handleStartConversion = () => {
    if (selectedFiles.length === 0) return;

    const tasksToAdd = selectedFiles.map((file) => ({
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      originalDuration: file.duration,
      originalResolution: file.resolution,
      originalFormat: file.format,
      originalSizeStr: file.sizeStr,
      targetFormat: settings.format,
      targetResolution: settings.resolution === 'Keep Original' ? file.resolution as ResolutionType : settings.resolution,
      targetCodec: settings.codec,
      compressionLevel: settings.compressionLevel
    }));

    onAddTasks(tasksToAdd);
    // Reset selections
    setSelectedFiles([]);
    setActivePresetId(null);
  };

  // CRF (Compression Quality descriptions)
  const getCRFDescription = (level: number) => {
    switch (level) {
      case 0:
        return {
          title: 'Lossless Murni (Pristine)',
          desc: 'Kualitas video 100% sama utuh tanpa penurunan visual bitwise sedikit pun (CRF 0). Ukuran file sedikit lebih besar dibanding kompresi biasa.',
          color: 'text-teal-400 bg-teal-950/60 border-teal-500/30'
        };
      case 1:
        return {
          title: 'Kualitas Ekstra Tinggi v2 (Sempurna)',
          desc: 'Kompresi premium visual tak terdeteksi mata normal (CRF 12). Sangat disarankan untuk konten Master 4K.',
          color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30'
        };
      case 2:
        return {
          title: 'Kompresi Ringan Seimbang',
          desc: 'Kualitas bioskop standar tinggi (CRF 18). Ukuran berkurang sekitar 40-50% tanpa kehilangan ketajaman piksel.',
          color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30'
        };
      case 3:
      case 4:
        return {
          title: 'Kompresi Standar Web & Sosial',
          desc: 'Keseimbangan prima (CRF 23). Ukuran file ditekan hingga 70% lebih kecil untuk pemutaran lancar di Instagram, YouTube & TikTok.',
          color: 'text-yellow-400 bg-yellow-950/60 border-yellow-500/30'
        };
      default:
        return {
          title: 'Kompresi Ekstrim (Hemat Kuota)',
          desc: 'Mengurangi ukuran hingga 85%+ untuk video berdurasi panjang, cocok untuk pengiriman WhatsApp cepat atau arsip hemat server.',
          color: 'text-rose-400 bg-rose-950/60 border-rose-500/30'
        };
    }
  };

  const crfInfo = getCRFDescription(settings.compressionLevel);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 pb-2 flex-1 overflow-hidden">
      
      {/* Scrollable Sub-container to lock everything inside outer height perfect */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        
        {/* Drag and Drop Zone + Upload Selector */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-300 ${
            dragActive 
              ? 'border-teal-400 bg-teal-950/20 shadow-[0_0_20px_rgba(45,212,191,0.15)] scale-[0.99]' 
              : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
          }`}
          style={{ minHeight: '120px' }}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={handleFileChange}
          />
          
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-400/10 to-indigo-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 shadow-inner">
              <Upload className="w-5 h-5 animate-bounce-slow" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Seret & letakkan video di sini, atau <span className="text-teal-400 underline">buka galeri</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Dukungan format 4K Master, MOV, MP4, MKV, AVI, WEBM, FLV
              </p>
            </div>
          </div>
        </div>

        {/* Selected queues or dynamic mock buttons */}
        {selectedFiles.length > 0 ? (
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-3">
            <div className="flex justify-between items-center mb-2 pb-1.5 border-b border-slate-800">
              <span className="text-[11px] font-bold text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
                <FileVideo className="w-3.5 h-3.5" />
                Antrean File ({selectedFiles.length})
              </span>
              <button 
                onClick={() => setSelectedFiles([])}
                className="text-[10px] text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
              >
                Hapus Semua
              </button>
            </div>
            
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-900/60 text-xs">
                  <div className="flex items-center gap-2 overflow-hidden mr-2">
                    <Video className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-slate-200 truncate">{file.name}</p>
                      <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                        <span>{file.resolution}</span>
                        <span>•</span>
                        <span>{file.duration}</span>
                        <span>•</span>
                        <span className="text-teal-500">{file.sizeStr}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSelectedFile(idx);
                    }}
                    className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Sample File Seeker Buttons */
          <div className="space-y-1.5">
            <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1">
              Gunakan File Sampel Cepat (Uji Coba 4K)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {mockSampleFiles.map((sample, index) => (
                <button
                  key={index}
                  onClick={() => addSampleFile(sample)}
                  className="flex items-center justify-between p-2.5 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 active:scale-95 text-left border border-slate-800 rounded-xl transition"
                >
                  <div className="overflow-hidden pr-2">
                    <p className="text-[11px] font-medium text-slate-200 truncate">{sample.name}</p>
                    <p className="text-[9px] text-slate-500 font-mono mt-0.5">{sample.resolution} | {sample.sizeStr}</p>
                  </div>
                  <span className="p-1 rounded bg-teal-500/10 text-teal-400 shrink-0">
                    <Plus className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Presets / Templates */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              Template Preset Khusus
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-teal-950/40 border-teal-500/50 shadow-[0_0_12px_rgba(45,212,191,0.15)] ring-1 ring-teal-500/40'
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`p-1 rounded-md text-[10px] ${isActive ? 'bg-teal-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                      {preset.settings.format}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 truncate">{preset.name.split(' (')[0]}</span>
                    {isActive && <Check className="w-3 h-3 text-teal-400 stroke-[3] ml-auto" />}
                  </div>
                  <p className="text-[9px] text-slate-500 leading-snug line-clamp-2">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configurations Parameters */}
        <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
                Metrik Target Transcoding
              </h3>
            </div>
            <span className="text-[10px] text-slate-500">Konfigurasi Format Output</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Format Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Format Output</label>
              <select
                value={settings.format}
                onChange={(e) => setSettings({ ...settings, format: e.target.value as VideoFormat })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
              >
                {SUPPORTED_FORMATS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Video Codec Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Video Codec</label>
              <select
                value={settings.codec}
                onChange={(e) => setSettings({ ...settings, codec: e.target.value as VideoCodec })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
              >
                {VIDEO_CODECS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Resolution dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Metrik Resolusi</label>
              <select
                value={settings.resolution}
                onChange={(e) => setSettings({ ...settings, resolution: e.target.value as ResolutionType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
              >
                {RESOLUTIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Audio Dropdown */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Audio Codec</label>
              <select
                value={settings.audioCodec}
                onChange={(e) => setSettings({ ...settings, audioCodec: e.target.value as AudioCodec })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs focus:ring-1 focus:ring-teal-500 focus:outline-hidden"
              >
                {AUDIO_CODECS.map((ac) => (
                  <option key={ac} value={ac}>{ac}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lossless Factor Constant Rate Range (CRF) */}
          <div className="space-y-2 pt-1 border-t border-slate-800/60">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[11px] font-bold uppercase text-slate-300 tracking-wider block">
                  Kompresi Tanpa Kehilangan Kualitas (Lossless CRF)
                </span>
              </div>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${crfInfo.color.split(' ')[0]} ${crfInfo.color.split(' ')[1]} ${crfInfo.color.split(' ')[2]}`}>
                CRF {settings.compressionLevel === 0 ? '0 (Lossless)' : settings.compressionLevel * 6 + 10}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-teal-400 font-bold">CRF 0 (Lossless)</span>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={settings.compressionLevel}
                onChange={(e) => setSettings({ ...settings, compressionLevel: parseInt(e.target.value) })}
                className="flex-1 accent-teal-400 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono text-slate-500">Hemat Maksimum</span>
            </div>

            {/* Ambient Explanatory Notification representing crisp lossless engine */}
            <div className={`p-2.5 rounded-xs border text-[10px] leading-relaxed flex items-start gap-2.5 transition-all duration-300 ${crfInfo.color}`}>
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold mb-0.5">{crfInfo.title}</strong>
                <span>{crfInfo.desc}</span>
              </div>
            </div>
          </div>

          {/* Metadata preference & speed indicators */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-800/40 text-[11px] text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={settings.keepMetadata}
                onChange={(e) => setSettings({ ...settings, keepMetadata: e.target.checked })}
                className="accent-teal-400 rounded-sm border-slate-800"
              />
              <span>Pertahankan Metadata Asli</span>
            </label>

            <span className="text-slate-600">|</span>

            <div className="flex items-center gap-1 text-slate-400">
              <span>Kecepatan Preset:</span>
              <span className="text-teal-400 font-semibold font-mono">Medium</span>
            </div>

            <span className="text-slate-600">|</span>

            <div className="flex items-center gap-1 text-teal-400 font-medium">
              <Zap className="w-3.5 h-3.5" />
              <span>GPU Accelerated</span>
            </div>
          </div>
        </div>

      </div>

      {/* Persistent Button Bottom-pinned zone with Android premium layout */}
      <div className="p-4 pt-2 bg-slate-950 border-t border-slate-900">
        <button
          id="btn-trigger-conversion"
          disabled={selectedFiles.length === 0}
          onClick={handleStartConversion}
          className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition active:scale-[0.99] cursor-pointer ${
            selectedFiles.length > 0
              ? 'bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 text-slate-950 hover:opacity-90 shadow-[0_4px_16px_rgba(45,212,191,0.25)] border border-teal-300/10'
              : 'bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Play className={`w-4 h-4 ${selectedFiles.length > 0 ? 'fill-slate-950 text-slate-950' : ''}`} />
          {selectedFiles.length > 0
            ? `Konversi Sekarang (${selectedFiles.length} File ke Batch)`
            : 'Pilih File untuk Memulai'}
        </button>
      </div>

    </div>
  );
}
