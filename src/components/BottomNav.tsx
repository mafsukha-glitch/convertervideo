import { TabType } from '../types';
import { RefreshCw, Cpu, FolderArchive, Settings as SettingsIcon } from 'lucide-react';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  batchCount: number;
  libraryCount: number;
}

export default function BottomNav({ activeTab, setActiveTab, batchCount, libraryCount }: BottomNavProps) {
  const tabs = [
    {
      id: 'convert' as TabType,
      label: 'Konversi',
      icon: RefreshCw,
      badge: 0,
    },
    {
      id: 'batch' as TabType,
      label: 'Batch Proses',
      icon: Cpu,
      badge: batchCount,
    },
    {
      id: 'library' as TabType,
      label: 'Pustaka',
      icon: FolderArchive,
      badge: libraryCount,
    },
    {
      id: 'settings' as TabType,
      label: 'Pengaturan',
      icon: SettingsIcon,
      badge: 0,
    },
  ];

  return (
    <div className="bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-md px-1 py-1 pb-safe-bottom flex justify-around items-center w-full shadow-2xl z-40 h-[72px]">
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            id={`nav-tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[72px] rounded-2xl transition-all duration-300 group ${
              isActive
                ? 'text-teal-400 bg-teal-950/40 font-semibold scale-105'
                : 'text-slate-400 hover:text-slate-200 active:scale-95'
            }`}
          >
            {/* Status indicator glow */}
            {isActive && (
              <span className="absolute -top-1 w-8 h-1 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
            )}

            <div className="relative">
              <IconComponent
                className={`w-[22px] h-[22px] transition-transform duration-300 ${
                  isActive ? 'stroke-[2.5] scale-110 drop-shadow-[0_0_4px_rgba(45,212,191,0.3)]' : 'group-hover:scale-105'
                } ${tab.id === 'convert' && isActive ? 'animate-spin-slow' : ''}`}
              />

              {tab.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-rose-500 to-amber-500 text-[10px] text-white font-bold h-4 min-w-4 px-1 rounded-full flex items-center justify-center border border-slate-900 animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>

            <span className="text-[11px] mt-1.5 tracking-wider truncate max-w-[80px]">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
