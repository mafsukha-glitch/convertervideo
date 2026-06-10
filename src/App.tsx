import { useState, useMemo } from 'react';
import { TabType, ConversionTask } from './types';
import { INITIAL_LIBRARY_TASKS } from './data';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ConvertTab from './components/ConvertTab';
import ProgressTab from './components/ProgressTab';
import LibraryTab from './components/LibraryTab';
import SettingsTab from './components/SettingsTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('convert');
  
  // Load tasks: start with completed library tasks to populate the list immediately
  const [tasks, setTasks] = useState<ConversionTask[]>(INITIAL_LIBRARY_TASKS as ConversionTask[]);
  
  // Settings shared states
  const [hardwareAcceleration, setHardwareAcceleration] = useState(true);
  const [outputPath, setOutputPath] = useState('Internal Storage/AVC/Lossless_Conversions/');

  // Split tasks into active queue vs completed library
  const activeQueue = useMemo(() => {
    return tasks.filter(t => t.status !== 'completed' && t.status !== 'failed');
  }, [tasks]);

  const libraryCompleted = useMemo(() => {
    return tasks.filter(t => t.status === 'completed');
  }, [tasks]);

  // Recalculate total storage space saved
  const storageSavedStr = useMemo(() => {
    let savedBytes = 0;
    
    tasks.forEach((t) => {
      if (t.status === 'completed' && t.outputSize) {
        const diff = t.fileSize - t.outputSize;
        if (diff > 0) {
          savedBytes += diff;
        }
      }
    });

    const savedMB = savedBytes / (1024 * 1024);
    if (savedMB > 1024) {
      return `${(savedMB / 1024).toFixed(2)} GB`;
    }
    return `${savedMB.toFixed(1)} MB`;
  }, [tasks]);

  const handleAddTasks = (newTasksData: Omit<ConversionTask, 'id' | 'status' | 'progress' | 'elapsedSeconds' | 'speedFps' | 'estimatedRemainingSeconds'>[]) => {
    const tasksToAdd: ConversionTask[] = newTasksData.map((t, index) => {
      // First item immediately is 'processing' if there isn't anything already processing, others 'waiting'
      const isFirstAndNoActive = index === 0 && !tasks.some(existing => existing.status === 'processing');
      
      return {
        id: `task-${Date.now()}-${index}`,
        fileName: t.fileName,
        fileSize: t.fileSize,
        fileType: t.fileType,
        originalDuration: t.originalDuration,
        originalResolution: t.originalResolution,
        originalFormat: t.originalFormat,
        originalSizeStr: t.originalSizeStr,
        targetFormat: t.targetFormat,
        targetResolution: t.targetResolution,
        targetCodec: t.targetCodec,
        compressionLevel: t.compressionLevel,
        status: isFirstAndNoActive ? 'processing' as const : 'waiting' as const,
        progress: 0,
        elapsedSeconds: 0,
        speedFps: 0,
        estimatedRemainingSeconds: 0
      };
    });

    setTasks((prev) => [...tasksToAdd, ...prev]);
    
    // Smoothly redirect to 'batch' (Proses) tab so user sees active state
    setActiveTab('batch');
  };

  const handleUpdateTasks = (updated: ConversionTask[]) => {
    // Merge updated tasks but preserve original structure
    setTasks(updated);
  };

  const handleClearCompleted = () => {
    // Keep only active/unfinished convert tasks
    setTasks((prev) => prev.filter(t => t.status !== 'completed' && t.status !== 'failed'));
  };

  const handleMockCompleteTask = (id: string, outputSize: number, outputSizeStr: string) => {
    setTasks((prev) => prev.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          status: 'completed' as const,
          progress: 100,
          outputSize,
          outputSizeStr,
          completedAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        };
      }
      return t;
    }));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter(t => t.id !== id));
  };

  const toggleHardware = () => {
    setHardwareAcceleration((prev) => !prev);
  };

  return (
    <div className="min-h-[100dvh] h-[100dvh] w-full bg-slate-950 flex flex-col justify-center overflow-hidden">
      
      {/* Immersive Mobile Device Container: Centers nicely on wide screens, full screen on mobile */}
      <div className="w-full max-w-lg mx-auto h-full flex flex-col bg-slate-950 relative shadow-2xl overflow-hidden border-x border-slate-900/60">
        
        {/* Top Header Section */}
        <Header 
          storageSavedStr={storageSavedStr}
          hardwareAcceleration={hardwareAcceleration}
          onToggleHardware={toggleHardware}
        />

        {/* Dynamic Display Tab Space with single view constraint */}
        <main className="flex-1 overflow-hidden relative flex flex-col">
          {activeTab === 'convert' && (
            <ConvertTab 
              onAddTasks={handleAddTasks}
              hardwareAcceleration={hardwareAcceleration}
            />
          )}

          {activeTab === 'batch' && (
            <ProgressTab 
              tasks={activeQueue}
              onUpdateTasks={handleUpdateTasks}
              onClearCompleted={handleClearCompleted}
              onMockCompleteTask={handleMockCompleteTask}
            />
          )}

          {activeTab === 'library' && (
            <LibraryTab 
              completedTasks={libraryCompleted}
              onDeleteTask={handleDeleteTask}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab 
              hardwareAcceleration={hardwareAcceleration}
              onToggleHardware={toggleHardware}
              outputPath={outputPath}
              onChangeOutputPath={setOutputPath}
            />
          )}
        </main>

        {/* Bottom tab navigator */}
        <BottomNav 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          batchCount={activeQueue.length}
          libraryCount={libraryCompleted.length}
        />

      </div>

    </div>
  );
}
