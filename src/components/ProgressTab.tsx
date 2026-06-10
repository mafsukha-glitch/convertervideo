import { useEffect, useState } from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  CheckCircle2, 
  Cpu, 
  AlertCircle,
  Clock, 
  Zap, 
  Loader2,
  ListRestart
} from 'lucide-react';
import { ConversionTask } from '../types';

interface ProgressTabProps {
  tasks: ConversionTask[];
  onUpdateTasks: (updated: ConversionTask[]) => void;
  onClearCompleted: () => void;
  onMockCompleteTask: (id: string, sizeSaved: number, sizeStr: string) => void;
}

export default function ProgressTab({ 
  tasks, 
  onUpdateTasks, 
  onClearCompleted,
  onMockCompleteTask 
}: ProgressTabProps) {
  const [isPausedAll, setIsPausedAll] = useState(false);

  // Simulation engine of transcoding
  useEffect(() => {
    if (isPausedAll) return;

    const interval = setInterval(() => {
      let changed = false;
      const updatedTasks = tasks.map((task) => {
        if (task.status === 'processing') {
          changed = true;
          const nextProgress = task.progress + Math.floor(Math.random() * 8) + 3;
          
          if (nextProgress >= 100) {
            // Calculate outputs size saved
            let divisor = 1.3 + (task.compressionLevel * 0.9); // higher CRF = smaller file sizes
            if (task.targetFormat === 'MP3' || task.targetFormat === 'WAV' || task.targetFormat === 'FLAC') {
              divisor = 45; // huge reduction for audio extracts
            }
            const outputSize = Math.max(Math.floor(task.fileSize / divisor), 421000);
            
            // Format output size string
            const sizeMB = outputSize / (1024 * 1024);
            const outputSizeStr = sizeMB > 1024 
              ? `${(sizeMB / 1024).toFixed(2)} GB` 
              : `${sizeMB.toFixed(1)} MB`;

            // Complete task
            setTimeout(() => {
              onMockCompleteTask(task.id, outputSize, outputSizeStr);
            }, 10);

            return {
              ...task,
              status: 'completed' as const,
              progress: 100,
              elapsedSeconds: task.elapsedSeconds + 1,
              estimatedRemainingSeconds: 0,
              outputSize,
              outputSizeStr,
              completedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            };
          } else {
            // Step forward
            const secondsPassed = task.elapsedSeconds + 1;
            const remainingSteps = 100 - nextProgress;
            const fps = task.targetResolution.includes('4K') ? 28 : (task.targetResolution.includes('2K') ? 56 : 110);
            const remainingSecs = Math.max(Math.ceil(remainingSteps / (Math.random() * 5 + 4)), 1);

            return {
              ...task,
              progress: nextProgress,
              elapsedSeconds: secondsPassed,
              speedFps: Math.floor(fps + (Math.random() * 6 - 3)),
              estimatedRemainingSeconds: remainingSecs
            };
          }
        } else if (task.status === 'waiting') {
          // If no file is currently processing, convert first waiting file to processing
          const currentlyProcessing = tasks.some(t => t.status === 'processing');
          if (!currentlyProcessing) {
            changed = true;
            return {
              ...task,
              status: 'processing' as const,
              speedFps: task.targetResolution.includes('4K') ? 30 : 120
            };
          }
        }
        return task;
      });

      if (changed) {
        onUpdateTasks(updatedTasks);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [tasks, isPausedAll, onUpdateTasks, onMockCompleteTask]);

  // Handle individual actions
  const togglePauseTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: t.status === 'processing' ? 'paused' as const : (t.status === 'paused' ? 'processing' as const : t.status)
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const cancelTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    onUpdateTasks(updated);
  };

  const restartTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: 'waiting' as const,
          progress: 0,
          elapsedSeconds: 0,
          estimatedRemainingSeconds: 0
        };
      }
      return t;
    });
    onUpdateTasks(updated);
  };

  const activeTasks = tasks.filter(t => t.status === 'processing' || t.status === 'waiting' || t.status === 'paused');
  const finishedTasks = tasks.filter(t => t.status === 'completed' || t.status === 'failed');

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 flex-1 overflow-hidden font-sans">
      
      {/* Top dashboard summary and batch stats */}
      <div className="px-4 py-3 bg-slate-900/40 border-b border-slate-900 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Cpu className={`w-5 h-5 text-teal-400 ${activeTasks.some(t => t.status === 'processing') ? 'animate-pulse text-emerald-400' : ''}`} />
            {activeTasks.some(t => t.status === 'processing') && (
              <span className="absolute top-0 right-0 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            )}
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-widest leading-none">Antrean Batch</h3>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              {activeTasks.length} Aktif • {finishedTasks.length} Selesai dalam Sesi
            </p>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="flex items-center gap-2">
            {activeTasks.length > 0 && (
              <button
                onClick={() => setIsPausedAll(!isPausedAll)}
                className={`px-3 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
                  isPausedAll 
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-slate-100'
                }`}
              >
                {isPausedAll ? <Play className="w-3 h-3 fill-current" /> : <Pause className="w-3 h-3 fill-current" />}
                {isPausedAll ? 'Lanjutkan Semua' : 'Jeda Pengode'}
              </button>
            )}

            {finishedTasks.length > 0 && (
              <button
                onClick={onClearCompleted}
                className="px-2 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-rose-400 text-[10px] font-semibold rounded-lg transition"
              >
                Bersihkan Riwayat
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main tasks scrolling block */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
        
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12 px-6 h-full">
            <span className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 mb-4 animate-bounce-slow">
              <Cpu className="w-8 h-8" />
            </span>
            <h4 className="text-sm font-semibold text-slate-300">Belum Ada Proses Konversi</h4>
            <p className="text-xs text-slate-500 max-w-xs mt-1 leading-relaxed">
              Pilih file video atau audio di tab <strong className="text-teal-400 font-medium">Konversi</strong> untuk mendaftarkan antrean transcode batch efisien.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isProcessing = task.status === 'processing';
              const isWaiting = task.status === 'waiting';
              const isPaused = task.status === 'paused';
              const isCompleted = task.status === 'completed';

              return (
                <div 
                  key={task.id}
                  className={`bg-slate-900/60 border rounded-xl overflow-hidden p-3.5 transition-all duration-300 relative ${
                    isProcessing 
                      ? 'border-teal-500/40 bg-slate-900 shadow-[0_4px_12px_rgba(20,184,166,0.1)]' 
                      : 'border-slate-800/80 shadow-xs'
                  }`}
                >
                  {/* Subtle water-glow bar background for processing file */}
                  {isProcessing && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-400 animate-pulse" />
                  )}

                  {/* Header info */}
                  <div className="flex justify-between items-start gap-2.5 mb-2">
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate text-xs font-bold text-slate-200 leading-tight">
                          {task.fileName}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase shrink-0 px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded-sm">
                          {task.originalFormat} → {task.targetFormat}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1 text-[9px] text-slate-500 font-mono">
                        <span>Original: {task.originalResolution} • {task.originalSizeStr}</span>
                        <span className="text-slate-700">•</span>
                        <span>Codec: <span className="text-slate-400">{task.targetCodec.split(' (')[0]}</span></span>
                        <span className="text-slate-700">•</span>
                        <span>Lama: {task.originalDuration}</span>
                      </div>
                    </div>

                    {/* Left corner task visual statuses */}
                    <div className="flex items-center gap-1.5">
                      {isWaiting && (
                        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-950/60 px-1.5 py-0.5 rounded-sm border border-indigo-800/30">
                          ANTRE
                        </span>
                      )}
                      {isPaused && (
                        <span className="text-[9px] font-bold text-amber-500 bg-amber-950/60 px-1.5 py-0.5 rounded-sm border border-amber-900/30">
                          DIJEDA
                        </span>
                      )}
                      {isProcessing && (
                        <span className="text-[9px] font-bold text-teal-400 bg-teal-950/60 px-1.5 py-0.5 rounded-sm border border-teal-800/30 flex items-center gap-1">
                          <Loader2 className="w-2.5 h-2.5 animate-spin" />
                          MEMPROSES
                        </span>
                      )}
                      {isCompleted && (
                        <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded-sm border border-emerald-800/20 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          BERHASIL
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Processing detail metrics row */}
                  {!isCompleted && (
                    <div className="grid grid-cols-3 gap-2 py-1.5 bg-slate-950/40 rounded-lg border border-slate-950 px-2.5 mb-2.5 text-[10px] font-mono text-slate-400">
                      <div>
                        <span className="text-slate-600 block text-[8px] uppercase font-bold">Transcode Speed</span>
                        <span className="font-semibold text-slate-300">
                          {isProcessing ? `${task.speedFps} fps` : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[8px] uppercase font-bold">Waktu Berjalan</span>
                        <span className="font-semibold text-slate-300">{task.elapsedSeconds}s</span>
                      </div>
                      <div>
                        <span className="text-slate-600 block text-[8px] uppercase font-bold">Tersisa (Sisa)</span>
                        <span className="font-semibold text-emerald-400">
                          {isProcessing ? `${task.estimatedRemainingSeconds}s` : '—'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Progressive indicator and numeric percentage */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      {isCompleted ? (
                        <span className="text-emerald-400 font-semibold">
                          Terkompresi ({task.originalSizeStr} → <span className="font-bold underline">{task.outputSizeStr}</span>)
                        </span>
                      ) : (
                        <span className="text-slate-500">Mempersiapkan render multi-sumber</span>
                      )}
                      <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-teal-400'}`}>
                        {task.progress}%
                      </span>
                    </div>

                    {/* Full Interactive beautiful progressbar */}
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900 relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ease-out ${
                          isCompleted 
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                            : (isPaused ? 'bg-amber-600/70' : 'bg-gradient-to-r from-teal-500 via-indigo-500 to-emerald-400')
                        }`}
                        style={{ width: `${task.progress}%` }}
                      >
                        {/* Shimmer animation on active conversion */}
                        {isProcessing && (
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Command Row */}
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/40">
                    <div className="text-[10px] text-slate-500">
                      Target: <span className="text-slate-300 font-mono font-bold text-[9px] bg-slate-950 p-1 rounded-sm">{task.targetResolution}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Toggle play/pause for waiting, processing and paused items */}
                      {!isCompleted && (
                        <button
                          onClick={() => togglePauseTask(task.id)}
                          className="p-1 px-2.5 rounded bg-slate-950 text-slate-400 hover:text-teal-400 border border-slate-800/60 active:scale-95 flex items-center gap-1 text-[10px]"
                        >
                          {isPaused ? (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              Lanjut
                            </>
                          ) : (
                            <>
                              <Pause className="w-3 h-3 fill-current" />
                              Jeda
                            </>
                          )}
                        </button>
                      )}

                      {/* Restart individual file */}
                      {isCompleted && (
                        <button
                          onClick={() => restartTask(task.id)}
                          className="p-1 px-2 rounded bg-slate-950 text-slate-400 hover:text-indigo-400 border border-slate-800/60 active:scale-95 flex items-center gap-1 text-[10px]"
                        >
                          <ListRestart className="w-3 h-3" />
                          Ulangi
                        </button>
                      )}

                      {/* Cancel/Trash option */}
                      <button
                        onClick={() => cancelTask(task.id)}
                        className="p-1.5 rounded-lg bg-rose-950/10 hover:bg-rose-950/40 border border-rose-900/30 text-rose-400 hover:text-rose-300 transition"
                        title="Batalkan entri"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
