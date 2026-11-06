import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { soundManager } from '../../utils/sound';
import { Flame, Heart, Sparkles, Volume2, VolumeX } from 'lucide-react';

export type NavTab = 'world_map' | 'mini_games' | 'codex' | 'profile';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const { stats, estimatedGSE } = usePlayer();
  const [muted, setMuted] = React.useState(soundManager.getIsMuted());

  const handleToggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setMuted(isMuted);
  };

  const navItems: { id: NavTab; label: string }[] = [
    { id: 'world_map', label: 'World Map' },
    { id: 'mini_games', label: 'Mini-Games' },
    { id: 'codex', label: 'Grammar Codex' },
    { id: 'profile', label: 'GSE Report' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => {
            soundManager.playClick();
            onSelectTab('world_map');
          }}
          className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer hover:opacity-90"
        >
          <span className="text-2xl">⚡</span>
          <span>GrammarQuest</span>
        </button>

        {/* Zone 2: Navigation Links (single-line, concise) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                soundManager.playClick();
                onSelectTab(item.id);
              }}
              className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer py-1 ${
                currentTab === item.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Action & Player Status HUD */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Streak Indicator */}
          <div
            className="flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1.5 rounded-xl text-xs font-bold"
            title={`${stats.streak} Day Learning Streak`}
          >
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse-subtle" />
            <span className="tabular-nums">{stats.streak}</span>
          </div>

          {/* Hearts Life Meter */}
          <div
            className="flex items-center gap-1 bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1.5 rounded-xl text-xs font-bold"
            title={`${stats.hearts} of ${stats.maxHearts} Hearts`}
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            <span className="tabular-nums">{stats.hearts}</span>
          </div>

          {/* XP Pill */}
          <button
            onClick={() => {
              soundManager.playClick();
              onSelectTab('profile');
            }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold border-b-2 border-indigo-800 transition-all cursor-pointer shadow-2xs"
            title="View GSE Profile & XP"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="tabular-nums">{stats.xp} XP</span>
            <span className="hidden lg:inline text-indigo-200">· GSE {estimatedGSE}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title={muted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Strip (Zone 2 for small viewports) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 px-2 py-1.5 bg-slate-50 text-xs font-bold">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              soundManager.playClick();
              onSelectTab(item.id);
            }}
            className={`py-1 px-2 rounded-lg transition-colors cursor-pointer ${
              currentTab === item.id
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
