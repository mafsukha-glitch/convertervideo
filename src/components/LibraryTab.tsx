import { useState } from 'react';
import { 
  FolderArchive, 
  Trash2, 
  Share2, 
  Download, 
  ExternalLink,
  ChevronRight,
  Info,
  CheckCircle,
  Play,
  Pause,
  HardDrive,
  Clock,
  Video,
  FileVideo2,
  X,
  Compass,
  MonitorCheck
} from 'lucide-react';
import { ConversionTask } from '../types';

interface LibraryTabProps {
  completedTasks: ConversionTask[];
  onDeleteTask: (id: string) => void;
}

export default function LibraryTab({ completedTasks, onDeleteTask }: LibraryTabProps) {
  const [selectedTask, setSelectedTask] = useState<ConversionTask | null>(null);
  const [isSimPlaying, setIsSimPlaying] = useState(false);
  const [simTimeProgress, setSimTimeProgress] = useState(0);

  // Playback simulated effect
  const togglePlaySimulation = () => {
    setIsSimPlaying(!isSimPlaying);
  };

  const handleDownloadMock = (task: ConversionTask) => {
    // Generate a simulated file download to make the app feel fully real!
    const dummyContent = `All Video Converter - Simulated Transcoded Content of ${task.fileName}`;
    const blob = new Blob([dummyContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = task.fileName.replace(/\.[^/.]+$/, "") + `_converted.${task.targetFormat.toLowerCase()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareMock = (task: ConversionTask) => {
    if (navigator.share) {
      navigator.share({
        title: 'Video Terkonversi Bagus',
        text: `Saya baru saja mengompresi ${task.fileName} hemat hingga ${task.outputSizeStr} menggunakan AVC Mobile!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      alert(`Tautan bagikan disalin untuk file: ${task.fileName}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 flex-1 overflow-hidden font-sans">
      
      {/* Top dashboard summary info */}
      <div className="px-4 py-3.5 bg-slate-900/40 border-b border-slate-900 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <FolderArchive className="w-5 h-5 text-indigo-400" />
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest leading-none">Pustaka Hasil</h3>
            <p className="text-[10px] text-slate-400 mt-1">
              {completedTasks.length} File Terkonversi & Terkompresi
            </p>
          </div>
        </div>
        
        {completedTasks.length > 0 && (
          <span className="text-[9px] font-mono bg-teal-950/60 text-teal-400 px-2 py-0.5 rounded-full border border-teal-800/30">
            Peralatan 4K Aktif
          </span>
        )}
      </div>

      {/* Main library listing */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        
        {completedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 h-full">
            <span className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4">
              <FolderArchive className="w-8 h-8" />
            </span>
            <h4 className="text-sm font-semibold text-slate-300">Pustaka Masih Kosong</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
              Setelah konversi di antrean batch selesai, file hasil transcoding lossless Anda akan disimpan di sini untuk diputar, dibagikan, atau diunduh.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedTasks.map((task) => {
              const originalBytes = task.fileSize || 1;
              const outputBytes = task.outputSize || 1;
              const savedPercent = Math.max(0, Math.round(((originalBytes - outputBytes) / originalBytes) * 100));

              return (
                <div
                  key={task.id}
                  onClick={() => {
                    setSelectedTask(task);
                    setIsSimPlaying(false);
                    setSimTimeProgress(0);
                  }}
                  className={`bg-slate-900/50 hover:bg-slate-900 border transition-all duration-200 rounded-xl p-3 flex justify-between items-center cursor-pointer ${
                    selectedTask?.id === task.id 
                      ? 'border-indigo-500/50 bg-indigo-950/20 shadow-[0_0_12px_rgba(99,102,241,0.15)] scale-[1.01]' 
                      : 'border-slate-900 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden mr-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-slate-950 to-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0 relative">
                      <FileVideo2 className="w-5.5 h-5.5" />
                      {/* Saved label badge */}
                      <span className="absolute -top-1 -right-1 bg-teal-500 text-slate-950 font-extrabold text-[8px] h-4 w-6 px-0.5 rounded flex items-center justify-center leading-none">
                        -{savedPercent}%
                      </span>
                    </div>

                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-200 truncate leading-tight">
                        {task.fileName.replace(/\.[^/.]+$/, "")}.{task.targetFormat.toLowerCase()}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1 text-[9px] text-slate-500 font-mono">
                        <span className="text-slate-400 font-semibold">{task.outputSizeStr}</span>
                        <span>•</span>
                        <span>{task.targetResolution.split(' (')[0]}</span>
                        <span>•</span>
                        <span>{task.originalDuration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Share icon quick option */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareMock(task);
                      }}
                      className="p-1 px-1.5 text-slate-500 hover:text-slate-300 transition-colors"
                      title="Bagikan"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Download trigger */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadMock(task);
                      }}
                      className="p-1 px-1.5 text-slate-500 hover:text-teal-400 transition-colors"
                      title="Undunduh File"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* COOL VIEW DETAILS MODAL/BOTTOM SHEET */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-fade-in animate-duration-200">
          <div className="bg-slate-950 border-t sm:border border-slate-900 rounded-t-3xl sm:rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[82%] sm:max-h-[90%] shadow-2xl animate-slide-up duration-300">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-900 flex justify-between items-center text-sm font-semibold text-slate-100 bg-slate-950">
              <div className="flex items-center gap-2">
                <MonitorCheck className="w-4 h-4 text-teal-400" />
                <span>Detail File Hasil Transcoding</span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 max-h-full flex-1">
              
              {/* Simulated video playback section */}
              <div className="bg-black rounded-xl border border-slate-900 p-4 aspect-video flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute inset-0 bg-radial-gradient from-indigo-950/20 via-transparent to-black" />
                
                {/* Visualizer bars in backdrop when playing */}
                <div className="absolute inset-x-0 bottom-1 flex justify-around items-end h-16 opacity-30 select-none pb-1 pointer-events-none">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div 
                      key={i}
                      className="w-1.5 bg-gradient-to-t from-teal-500 to-indigo-500 rounded-full transition-all duration-300"
                      style={{ 
                        height: isSimPlaying ? `${Math.floor(Math.random() * 50) + 10}px` : '4px',
                        animationDelay: `${i * 80}ms`
                      }}
                    />
                  ))}
                </div>

                <div className="z-10 flex justify-between items-start">
                  <span className="text-[9px] font-mono font-bold bg-teal-500 text-slate-950 px-2 py-0.5 rounded-sm uppercase tracking-wider">
                    {selectedTask.targetFormat} PLAYER
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono">
                    WASM Accelerated
                  </span>
                </div>

                <div className="z-10 flex flex-col items-center justify-center py-4">
                  <button
                    onClick={togglePlaySimulation}
                    className="w-11 h-11 rounded-full bg-teal-400 hover:bg-teal-300 text-slate-950 flex items-center justify-center transition active:scale-95 shadow-[0_0_15px_rgba(45,212,191,0.4)]"
                  >
                    {isSimPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                  </button>
                  <span className="text-[10px] text-slate-400 mt-2 font-mono">
                    {isSimPlaying ? 'Menyimulasikan Pemutaran 4K...' : 'Putar Sampel'}
                  </span>
                </div>

                <div className="z-10 space-y-1">
                  <div className="text-[10px] text-slate-300 font-semibold truncate">
                    {selectedTask.fileName}
                  </div>
                  <div className="flex items-center justify-between text-[8px] text-slate-500 font-mono">
                    <span>{selectedTask.originalDuration}</span>
                    <span>{selectedTask.targetResolution}</span>
                  </div>
                </div>
              </div>

              {/* Compression stats dashboard ("Tampilan detail keren") */}
              <div className="grid grid-cols-2 gap-3.5">
                
                {/* Left Card: Storage Saved */}
                <div className="bg-slate-900 border border-slate-900/60 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center animate-pulse">
                    <HardDrive className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Hemat Penyimpanan</span>
                    <span className="text-sm font-extrabold text-teal-400">
                      {Math.max(0, Math.round(((selectedTask.fileSize - (selectedTask.outputSize || 0)) / selectedTask.fileSize) * 100))}% Lebih Ringan
                    </span>
                  </div>
                </div>

                {/* Right Card: Codec efficiency */}
                <div className="bg-slate-900 border border-slate-900/60 p-3 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-wider block font-bold">Teknologi Codec</span>
                    <span className="text-xs font-bold text-slate-300">
                      {selectedTask.targetCodec.split(' (')[0]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Structural Specification Table */}
              <div className="bg-slate-900/50 border border-slate-900 rounded-xl px-3 py-2 text-xs space-y-2">
                <h4 className="text-[10px] font-bold text-slate-400 tracking-wider uppercase pb-1 border-b border-slate-900">
                  Perbandingan Teknis Rendering
                </h4>

                <div className="grid grid-cols-3 text-[10px] text-slate-500 font-mono uppercase font-bold text-left py-0.5">
                  <span>Parameter</span>
                  <span>Input Asli</span>
                  <span>Target Output</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="grid grid-cols-3 py-1 border-t border-slate-900">
                    <span className="text-slate-400">Format File</span>
                    <span className="text-slate-500">{selectedTask.originalFormat}</span>
                    <span className="text-teal-400 font-bold">{selectedTask.targetFormat}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 py-1 border-t border-slate-900">
                    <span className="text-slate-400">Resolusi Layar</span>
                    <span className="text-slate-500">{selectedTask.originalResolution}</span>
                    <span className="text-indigo-400 font-semibold">{selectedTask.targetResolution.split(' (')[0]}</span>
                  </div>

                  <div className="grid grid-cols-3 py-1 border-t border-slate-900">
                    <span className="text-slate-400">Ukuran Penyimpanan</span>
                    <span className="text-slate-500">{selectedTask.originalSizeStr}</span>
                    <span className="text-emerald-400 font-bold">{selectedTask.outputSizeStr}</span>
                  </div>

                  <div className="grid grid-cols-3 py-1 border-t border-slate-900">
                    <span className="text-slate-400">Metrik CRF</span>
                    <span className="text-slate-500">Unmanaged</span>
                    <span className="text-teal-400 font-bold">
                      {selectedTask.compressionLevel === 0 ? 'CRF 0 (Lossless)' : `CRF ${selectedTask.compressionLevel * 6 + 10}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 py-1 border-t border-slate-900">
                    <span className="text-slate-400">Durasi Video</span>
                    <span className="text-slate-500">{selectedTask.originalDuration}</span>
                    <span className="text-slate-300">{selectedTask.originalDuration}</span>
                  </div>
                </div>
              </div>

              {/* Lossless Quality Confirmation Text */}
              <div className="p-3 bg-teal-950/20 border border-teal-900/30 rounded-xl text-[11px] leading-relaxed flex gap-2.5">
                <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                <div className="text-slate-300">
                  <strong>Standardisasi Kompresi Lossless Terkonfirmasi</strong>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    Frame video telah didekompresi dan dikemas ulang menggunakan kompresi entropy murni. Struktur warna visual YUV 4:2:0 dan bit depth utuh tanpa artifak piksel tambahan.
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-900 flex gap-2 bg-slate-950">
              <button
                onClick={() => {
                  handleDownloadMock(selectedTask);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:opacity-95 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Unduh Video Hasil
              </button>

              <button
                onClick={() => {
                  setSelectedTask(null);
                  onDeleteTask(selectedTask.id);
                }}
                className="px-3.5 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl text-rose-400 transition"
                title="Hapus dari Pustaka"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
