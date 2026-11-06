import React, { useState } from 'react';
import { CURRICULUM_WORLDS, Topic, World } from '../../data/curriculum';
import { usePlayer } from '../../context/PlayerContext';
import { soundManager } from '../../utils/sound';
import {
  Lock,
  Star,
  Play,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Flame,
  Award,
  Unlock,
} from 'lucide-react';

interface WorldMapProps {
  onStartQuest: (topic: Topic, mode?: 'word_train' | 'time_traveler' | 'grammar_detective') => void;
  onOpenCodex: (topicId?: string) => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onStartQuest, onOpenCodex }) => {
  const { stats, isTopicUnlocked, toggleFreePlay } = usePlayer();
  const [activeWorldId, setActiveWorldId] = useState<1 | 2 | 3>(1);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const activeWorld = CURRICULUM_WORLDS.find((w) => w.id === activeWorldId) || CURRICULUM_WORLDS[0];

  const handleSelectTopic = (topic: Topic) => {
    soundManager.playClick();
    setSelectedTopic(topic);
  };

  const handleLaunchQuest = (mode?: 'word_train' | 'time_traveler' | 'grammar_detective') => {
    if (!selectedTopic) return;
    soundManager.playClick();
    onStartQuest(selectedTopic, mode);
  };

  // Compute World completion stats
  const getWorldStats = (world: World) => {
    const totalTopics = world.topics.length;
    let completedCount = 0;
    let totalStars = 0;

    world.topics.forEach((t) => {
      const p = stats.topicProgress[t.id];
      if (p?.completed) completedCount++;
      if (p?.stars) totalStars += p.stars;
    });

    return { totalTopics, completedCount, totalStars, maxStars: totalTopics * 3 };
  };

  const activeWorldStats = getWorldStats(activeWorld);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* World Map Hero Banner */}
      <div className="relative rounded-3xl bg-linear-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 mb-8 shadow-xl overflow-hidden border border-indigo-800/50">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 text-8xl opacity-10 select-none pointer-events-none">
          🗺️
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/80 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Pearson GSE (Global Scale of English) 30–58 Framework</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Junior High English GSE Adventure
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-5">
            Journey through 3 progressive worlds. Master syntax on the Word Train, command verb forms in the Time Vortex, and solve grammar crimes like a detective!
          </p>

          {/* Quick Stat Highlights */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>Streak: <strong className="text-white">{stats.streak} Days</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>GSE Range: <strong className="text-white">30 – 58 (A1+ to B1)</strong></span>
            </div>
            <button
              onClick={toggleFreePlay}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                stats.freePlayUnlocked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white border-slate-700'
              }`}
              title="Toggle Sandbox / Teacher Mode to preview any stage"
            >
              <Unlock className="w-3.5 h-3.5" />
              <span>{stats.freePlayUnlocked ? 'Sandbox Mode: Active' : 'Teacher Free-Play'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* World Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-8">
        {CURRICULUM_WORLDS.map((world) => {
          const isSelected = activeWorldId === world.id;
          const wStats = getWorldStats(world);
          const isWorldCompleted = wStats.completedCount === wStats.totalTopics;

          return (
            <button
              key={world.id}
              onClick={() => {
                soundManager.playClick();
                setActiveWorldId(world.id);
                setSelectedTopic(null);
              }}
              className={`btn-tactile text-left p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                  : 'bg-white/80 hover:bg-white border-slate-200 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  {world.grade}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {world.gseLabel}
                </span>
              </div>

              <div className="font-extrabold text-base sm:text-lg text-slate-900 mb-1 flex items-center justify-between">
                <span>{world.name}</span>
                {isWorldCompleted && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
                <span>{world.cefrRange}</span>
                <span className="flex items-center gap-1 font-semibold text-amber-600">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {wStats.totalStars}/{wStats.maxStars}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${(wStats.completedCount / wStats.totalTopics) * 100}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* World Map Layout: Pathway Nodes + Active Stage Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Pathway Pathway Stages (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <span>{activeWorld.name} Pathway</span>
              <span className="text-xs font-mono font-medium text-slate-500">
                ({activeWorldStats.completedCount}/{activeWorldStats.totalTopics} Mastered)
              </span>
            </h2>
            <button
              onClick={() => onOpenCodex()}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Open Grammar Codex</span>
            </button>
          </div>

          {/* Stepping Stones / Nodes list */}
          <div className="space-y-3.5 pt-2">
            {activeWorld.topics.map((topic, index) => {
              const unlocked = isTopicUnlocked(topic.id);
              const progress = stats.topicProgress[topic.id];
              const isCompleted = !!progress?.completed;
              const isSelected = selectedTopic?.id === topic.id;
              const stars = progress?.stars || 0;

              return (
                <div
                  key={topic.id}
                  onClick={() => unlocked && handleSelectTopic(topic)}
                  className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-center justify-between gap-4 ${
                    !unlocked
                      ? 'bg-slate-100/70 border-slate-200 opacity-60 cursor-not-allowed'
                      : isSelected
                      ? 'bg-indigo-50/70 border-indigo-600 shadow-md ring-2 ring-indigo-500/20 cursor-pointer'
                      : 'bg-white hover:bg-indigo-50/30 border-slate-200 hover:border-indigo-300 shadow-2xs cursor-pointer'
                  }`}
                >
                  {/* Left: Step Index & Lock/Check */}
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shrink-0 border-b-3 transition-transform ${
                        !unlocked
                          ? 'bg-slate-200 text-slate-400 border-slate-300'
                          : isCompleted
                          ? 'bg-emerald-500 text-white border-emerald-700 shadow-xs'
                          : 'bg-indigo-600 text-white border-indigo-800 shadow-xs'
                      }`}
                    >
                      {!unlocked ? (
                        <Lock className="w-5 h-5 text-slate-400" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-md">
                          GSE {topic.gseRange[0]}–{topic.gseRange[1]} · {topic.cefr}
                        </span>
                        {topic.category === 'text_genre' && (
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                            <span>📜 Text Genre</span>
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-medium">Stage {index + 1}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {topic.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {topic.canDoDescriptor}
                      </p>
                    </div>
                  </div>

                  {/* Right: Stars / Action button */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= stars
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-200 fill-slate-100'
                          }`}
                        />
                      ))}
                    </div>

                    {unlocked && (
                      <span className="text-xs font-bold text-indigo-600 flex items-center gap-0.5 hover:underline">
                        <span>{isSelected ? 'Selected' : 'View Stage'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stage Inspector & Quick Launch Deck (5 Columns) */}
        <div className="lg:col-span-5">
          {selectedTopic ? (
            <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 sm:p-6 shadow-md sticky top-6">
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg">
                    GSE {selectedTopic.gseRange[0]}–{selectedTopic.gseRange[1]} · {selectedTopic.cefr}
                  </span>
                  {selectedTopic.category === 'text_genre' && (
                    <span className="text-xs font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-1 rounded-lg">
                      📜 Text Genre
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-500">{selectedTopic.grade}</span>
              </div>

              <h3 className="text-xl font-black text-slate-900 mb-2">
                {selectedTopic.title}
              </h3>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 mb-5 text-xs text-slate-700 leading-relaxed">
                <div className="font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <span>🎯 Can-Do Objective:</span>
                </div>
                {selectedTopic.canDoDescriptor}
              </div>

              {/* Rule bite snapshot */}
              <div className="border-t border-slate-100 pt-4 mb-5">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Grammar Rule Bite
                </div>
                <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/60 p-3 rounded-xl border border-amber-200/50">
                  {selectedTopic.ruleSummary}
                </p>
              </div>

              {/* Primary CTA: Launch Full Stage Quest */}
              <button
                onClick={() => handleLaunchQuest()}
                className="w-full py-3.5 px-5 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-500 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 mb-4 text-base cursor-pointer"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Start Stage Quest (+100 XP)</span>
              </button>

              {/* Specific Mini-Game Modes Quick Launch */}
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                  Play Specific Mini-Game
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleLaunchQuest('word_train')}
                    className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-center transition-colors cursor-pointer"
                    title="Play Word Train syntax scrambler"
                  >
                    <div className="text-xl mb-1">🚂</div>
                    <div className="text-[11px] font-bold text-amber-900">Word Train</div>
                  </button>
                  <button
                    onClick={() => handleLaunchQuest('time_traveler')}
                    className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-center transition-colors cursor-pointer"
                    title="Play Tense Time-Traveler verb conjugation"
                  >
                    <div className="text-xl mb-1">⏳</div>
                    <div className="text-[11px] font-bold text-sky-900">Time Warp</div>
                  </button>
                  <button
                    onClick={() => handleLaunchQuest('grammar_detective')}
                    className="p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-center transition-colors cursor-pointer"
                    title="Play Grammar Detective error spotter"
                  >
                    <div className="text-xl mb-1">🔍</div>
                    <div className="text-[11px] font-bold text-rose-900">Detective</div>
                  </button>
                </div>
              </div>

              {/* View full rules */}
              <button
                onClick={() => onOpenCodex(selectedTopic.id)}
                className="w-full mt-4 py-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 text-center block cursor-pointer"
              >
                Read Full Grammar Codex & Traps →
              </button>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-slate-500 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-3 text-3xl">
                🧭
              </div>
              <h3 className="font-extrabold text-slate-900 text-base mb-1">
                Select a Stage on the Map
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mb-4">
                Click any unlocked stage node along the pathway to preview the GSE learning objective and launch into a game.
              </p>
              <button
                onClick={() => handleSelectTopic(activeWorld.topics[0])}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                <span>Select First Stage</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
