import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  HardDrive, 
  Cpu, 
  Info, 
  Users, 
  Sliders, 
  FileText, 
  ToggleLeft,
  Smartphone,
  ShieldAlert,
  Moon,
  FolderOpen,
  VolumeX,
  HelpCircle
} from 'lucide-react';

interface SettingsTabProps {
  hardwareAcceleration: boolean;
  onToggleHardware: () => void;
  outputPath: string;
  onChangeOutputPath: (path: string) => void;
}

export default function SettingsTab({ 
  hardwareAcceleration, 
  onToggleHardware,
  outputPath,
  onChangeOutputPath
}: SettingsTabProps) {
  const [defaultFormat, setDefaultFormat] = useState('MP4');
  const [useVulkan, setUseVulkan] = useState(true);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [isToastOpen, setIsToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setIsToastOpen(true);
    setTimeout(() => {
      setIsToastOpen(false);
    }, 2500);
  };

  const resetAllPreferences = () => {
    setDefaultFormat('MP4');
    setUseVulkan(true);
    setLowPowerMode(false);
    onChangeOutputPath('Internal Storage/AVC/Lossless_Conversions/');
    if (!hardwareAcceleration) {
      onToggleHardware();
    }
    triggerToast('Semua preferensi telah direset ke setelan pabrik!');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 flex-1 overflow-hidden font-sans">
      
      {/* Scrollable container for Android styles */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        
        {/* Storage location configuration */}
        <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3.5 space-y-3">
          <h3 className="text-[11px] font-bold text-teal-400 tracking-wider uppercase flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5" />
            Penyimpanan & Output Android
          </h3>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-300 font-medium block">
              Folder Output Penyimpanan Internal
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={outputPath}
                onChange={(e) => onChangeOutputPath(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 font-mono focus:border-teal-500 focus:outline-hidden"
              />
              <button
                onClick={() => triggerToast('Dialihkan ke Explorer Android Berkas')}
                className="px-3 bg-slate-800 text-slate-300 hover:text-slate-100 border border-slate-700/60 text-xs font-semibold rounded-lg flex items-center gap-1 transition"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                Ubah
              </button>
            </div>
            <span className="text-[9px] text-slate-500 block leading-snug">
              *Aplikasi akan membuat sub-folder baru jika belum terdaftar pada system storage.
            </span>
          </div>
        </div>

        {/* Technical Transcoding Acceleration Engine Settings */}
        <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3.5 space-y-3.5">
          <h3 className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" />
            Akselerasi & Pemrosesan Perangkat Keras
          </h3>

          {/* Toggle Acceleration */}
          <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <div>
              <span className="text-xs font-semibold block text-slate-200">Akselerasi GPU (OpenCL/WASM)</span>
              <span className="text-[10px] text-slate-500 block max-w-[280px]">
                Gunakan core grafis GPU untuk mempercepat proses rendering video 4K berkekuatan tinggi.
              </span>
            </div>
            <button
              onClick={onToggleHardware}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-hidden ${
                hardwareAcceleration ? 'bg-teal-500' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-lg ring-0 transition duration-200 ease-in-out ${
                  hardwareAcceleration ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Vulkan configuration */}
          <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <div>
              <span className="text-xs font-semibold block text-slate-200">Dukungan API Vulkan Driver</span>
              <span className="text-[10px] text-slate-500 block max-w-[280px]">
                Mengatur kompatibilitas frame parallel pada chipset Snapdragon / MediaTek.
              </span>
            </div>
            <input
              type="checkbox"
              checked={useVulkan}
              onChange={(e) => setUseVulkan(e.target.checked)}
              disabled={!hardwareAcceleration}
              className="accent-emerald-400 h-4 w-4 rounded-sm"
            />
          </div>

          {/* Low power converter toggle */}
          <div className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-lg border border-slate-900">
            <div>
              <span className="text-xs font-semibold block text-slate-200">Mode Hemat Daya Baterai (Low Power)</span>
              <span className="text-[10px] text-slate-500 block max-w-[280px]">
                Membatasi penggunaan core CPU utama pada background proses konversi.
              </span>
            </div>
            <input
              type="checkbox"
              checked={lowPowerMode}
              onChange={(e) => setLowPowerMode(e.target.checked)}
              className="accent-indigo-400 h-4 w-4 rounded-sm"
            />
          </div>
        </div>

        {/* Quick FAQ / Cara Kerja */}
        <div className="bg-slate-900/60 border border-slate-900 rounded-xl p-3.5 space-y-3">
          <h3 className="text-[11px] font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            Petunjuk Singkat & Cara Kerja
          </h3>

          <div className="space-y-2 text-[10px] leading-relaxed text-slate-400 pr-1 max-h-[140px] overflow-y-auto">
            <div>
              <strong className="text-slate-200 block font-medium">1. Apa arti CRF (Constant Rate Factor)?</strong>
              <span>
                CRF adalah pengontrol kualitas video default untuk pengonversi x264 dan x265. Rentang nilainya 0-51. Nilai <strong className="text-teal-400">0 adalah Lossless Murni</strong> yang tidak memangkas kualitas piksel murni demi ukuran file.
              </span>
            </div>

            <div className="pt-1.5 border-t border-slate-900">
              <strong className="text-slate-200 block font-medium">2. Mengapa memilih H.265 (HEVC) atau AV1?</strong>
              <span>
                HEVC memberikan tingkat kompresi dua kali lipat lebih efisien dibanding H.264 standar. AV1 merupakan standar modern yang mampu mengompresi file hingga 50% lebih kecil lagi, namun memerlukan kemampuan dekode hardware yang lebih siap.
              </span>
            </div>

            <div className="pt-1.5 border-t border-slate-900">
              <strong className="text-slate-200 block font-medium">3. Pemrosesan Batch Sekaligus</strong>
              <span>
                Anda dapat menambahkan file sampel sebanyak mungkin di tab pertama. Semua file ini akan diproses secara runtut dan cerdas di tab Batch Proses yang dipantau melalui progressbar visual.
              </span>
            </div>
          </div>
        </div>

        {/* Global actions: Reset Preferences */}
        <div className="space-y-2">
          <button
            onClick={resetAllPreferences}
            className="w-full py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 hover:bg-slate-900 text-xs font-bold uppercase tracking-wider rounded-xl transition"
          >
            Reset Semua Preferensi
          </button>
          
          <div className="text-center text-[9px] text-slate-600 font-mono">
            All Video Converter Pro v2.8.5-Android • Crafted with Antigravity Agent
          </div>
        </div>

      </div>

      {/* Floating Animated Toast */}
      {isToastOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-teal-500 text-slate-950 font-semibold text-xs px-4 py-2.5 rounded-full shadow-[0_4px_15px_rgba(45,212,191,0.4)] z-50 flex items-center gap-1.5 animate-bounce-slow">
          <Info className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
