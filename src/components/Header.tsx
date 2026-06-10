import { Cpu, HelpCircle, HardDrive, Zap, Info } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  storageSavedStr: string;
  hardwareAcceleration: boolean;
  onToggleHardware: () => void;
}

export default function Header({ storageSavedStr, hardwareAcceleration, onToggleHardware }: HeaderProps) {
  const [showInfo, setShowInfo] = useState(false);

  // Get current mobile time
  const formatTime = () => {
    const d = new Date();
    let hrs = d.getHours().toString().padStart(2, '0');
    let mins = d.getMinutes().toString().padStart(2, '0');
    return `${hrs}:${mins}`;
  };

  return (
    <div className="bg-slate-950 border-b border-slate-900 z-50">
      {/* Immersive Mobile Status Bar */}
      <div className="flex justify-between items-center px-4 pt-1 pb-1 text-[11px] font-mono text-slate-500 font-medium select-none bg-black/40">
        <div className="flex items-center gap-1">
          <span>{formatTime()}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Hardware acceleration badge */}
          {hardwareAcceleration ? (
            <span className="flex items-center gap-0.5 text-teal-500 bg-teal-950/40 px-1 rounded-sm text-[9px] border border-teal-800/20">
              <Zap className="w-2.5 h-2.5 fill-current animate-pulse" />
              HW ACCEL
            </span>
          ) : (
            <span className="text-slate-600 bg-slate-900/40 px-1 rounded-sm text-[9px]">
              CPU ONLY
            </span>
          )}
          <span className="text-slate-600">|</span>
          <span className="flex items-center gap-0.5">5G <span className="text-emerald-500">●●●●</span></span>
          <span className="text-slate-600">|</span>
          <span>98% 🔋</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 py-3 flex justify-between items-center bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(45,212,191,0.3)] border border-teal-400/20">
            <Cpu className="w-5 h-5 text-slate-950 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">AVC Mobile</h1>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-widest bg-teal-500 text-slate-950 uppercase shadow-xs">PRO</span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide">All Video Converter & Compression 4K</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Disk savings pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
            <div className="text-[10px] leading-tight text-left">
              <div className="text-slate-400">Total Hemat</div>
              <div className="font-bold text-teal-400 font-mono">{storageSavedStr}</div>
            </div>
          </div>

          {/* Quick Hardware toggle control */}
          <button
            onClick={onToggleHardware}
            title="Toggle Akselerasi Perangkat Keras GPU"
            className={`w-[34px] h-[34px] rounded-lg border flex items-center justify-center transition-all duration-200 ${
              hardwareAcceleration
                ? 'bg-teal-950/30 border-teal-500/50 text-teal-400 shadow-[0_0_8px_rgba(20,184,166,0.2)]'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            <Zap className={`w-4 h-4 ${hardwareAcceleration ? 'fill-current' : ''}`} />
          </button>

          {/* Help button */}
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-[34px] h-[34px] rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info Dropdown */}
      {showInfo && (
        <div className="bg-slate-900 border-b border-teal-900/30 p-3.5 text-xs text-slate-300 leading-relaxed shadow-inner animate-fade-in">
          <div className="max-w-2xl mx-auto flex gap-3">
            <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-100 mb-1">Dukungan Konverter & Kompresor 4K Pro</p>
              <p className="text-slate-400 text-[11px]">
                Aplikasi ini merekayasa proses pengodean video beresolusi tinggi (hingga 4K Ultra HD) secara mobile. Menggunakan standar codec tercanggih <strong className="text-teal-400">H.265 (HEVC)</strong>, <strong className="text-teal-400">AV1</strong>, dan pengompres berkemampuan <strong className="text-emerald-400">CRF (Constant Rate Factor)</strong> untuk merampingkan file hingga 85% dengan visual lossless (tanpa kehilangan kualitas).
              </p>
              <div className="mt-2 flex gap-4 text-[10px] text-slate-500 font-mono">
                <span>Versi: v2.8.5-Pro</span>
                <span>Mesin: Mobile FFmpeg Core WASM</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
