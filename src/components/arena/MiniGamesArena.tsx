import React, { useState } from 'react';
import { CURRICULUM_WORLDS, Topic } from '../../data/curriculum';
import { soundManager } from '../../utils/sound';
import {
  Play,
  Sparkles,
  Flame,
  Zap,
  Shuffle,
  Clock,
  AlertTriangle,
  HelpCircle,
  Dices,
} from 'lucide-react';

interface MiniGamesArenaProps {
  onStartGame: (
    topic: Topic,
    mode: 'word_train' | 'time_traveler' | 'grammar_detective',
    challengeLevel?: 'normal' | 'hard' | 'blitz'
  ) => void;
}

export const MiniGamesArena: React.FC<MiniGamesArenaProps> = ({ onStartGame }) => {
  const [selectedGrade, setSelectedGrade] = useState<'all' | 'Grade 7' | 'Grade 8' | 'Grade 9'>('all');
  const [challengeLevel, setChallengeLevel] = useState<'normal' | 'hard' | 'blitz'>('hard'); // Default to hard/challenging per user request!

  const allTopics = CURRICULUM_WORLDS.flatMap((w) => w.topics);
  const filteredTopics = selectedGrade === 'all'
    ? allTopics
    : allTopics.filter((t) => t.grade === selectedGrade);

  const handleLaunch = (topic: Topic, mode: 'word_train' | 'time_traveler' | 'grammar_detective') => {
    soundManager.playClick();
    onStartGame(topic, mode, challengeLevel);
  };

  const handleRandomDrill = () => {
    soundManager.playClick();
    const randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
    const modes: ('word_train' | 'time_traveler' | 'grammar_detective')[] = [
      'word_train',
      'time_traveler',
      'grammar_detective',
    ];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    onStartGame(randomTopic, randomMode, challengeLevel);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Arena Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Specific Drill &amp; Skill Accelerator</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Specific Drill &amp; Training Arena
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Drill syntax with dynamic word/letter scrambling, race the temporal clock with randomized verb choices, and solve crime scenes with shuffled evidence!
        </p>
      </div>

      {/* Challenge Control Deck (Mekanisme Drill Lebih Menantang & Diacak) */}
      <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-slate-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                  DRILL MECHANICS
                </span>
                <span className="text-xs bg-rose-950/80 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-md font-bold">
                  {challengeLevel === 'blitz' ? 'Extreme Blitz' : challengeLevel === 'hard' ? 'Challenging (Menantang)' : 'Standard'}
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                Customize Drill Difficulty &amp; Shuffling
              </h3>
            </div>

            {/* Surprise Random Exam Button */}
            <button
              onClick={handleRandomDrill}
              className="btn-tactile px-5 py-3 rounded-2xl font-black text-white bg-linear-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 shadow-md flex items-center justify-center gap-2 cursor-pointer text-sm whitespace-nowrap"
            >
              <Dices className="w-4 h-4 animate-spin" />
              <span>🎲 Quick Random Topic Drill (Acak)</span>
            </button>
          </div>

          {/* Difficulty Modes Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5">
            {/* Standard Mode */}
            <button
              onClick={() => {
                soundManager.playClick();
                setChallengeLevel('normal');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                challengeLevel === 'normal'
                  ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">🌱</span>
                <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  STANDARD
                </span>
              </div>
              <div className="text-sm font-black text-white mb-1">Standard Drill</div>
              <p className="text-xs text-slate-400 leading-snug">
                15s timer. Shuffled words without decoys. Great for initial concept practice.
              </p>
            </button>

            {/* Challenging Mode (Recommended) */}
            <button
              onClick={() => {
                soundManager.playClick();
                setChallengeLevel('hard');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer relative overflow-hidden ${
                challengeLevel === 'hard'
                  ? 'bg-slate-900 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">🔥</span>
                <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
                  CHALLENGING ★
                </span>
              </div>
              <div className="text-sm font-black text-white mb-1">Challenging + Trap Words</div>
              <p className="text-xs text-slate-300 leading-snug">
                9s timer. <strong>Trap decoy words</strong> in Word Train + strict Fisher-Yates word &amp; choice shuffling!
              </p>
            </button>

            {/* Blitz Mode */}
            <button
              onClick={() => {
                soundManager.playClick();
                setChallengeLevel('blitz');
              }}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                challengeLevel === 'blitz'
                  ? 'bg-slate-900 border-rose-500 ring-2 ring-rose-500/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">⚡</span>
                <span className="text-[11px] font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                  BLITZ SPEED
                </span>
              </div>
              <div className="text-sm font-black text-white mb-1">Speed Blitz 6s</div>
              <p className="text-xs text-slate-400 leading-snug">
                Urgent 6s time-attack, jumbled letters preview, trap words, and double XP combo!
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Game Showcases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Game 1: Word Train */}
        <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl mb-4 border border-amber-200 shadow-xs">
              🚂
            </div>
            <div className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider mb-1">
              Dynamic Scramble &amp; Decoys
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Word Train</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Couple scrambled word wagons on the track. In Challenging Mode, beware of <strong>grammatical trap words</strong> that do not belong in the sentence! Includes letter-jumble option.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Challenging Elements:
            </div>
            <div className="text-xs text-slate-700 font-medium mb-4 flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5 text-amber-600" />
              <span>Full Fisher-Yates word shuffle + Decoy filtering</span>
            </div>
            <button
              onClick={() => handleLaunch(filteredTopics[0], 'word_train')}
              className="w-full py-3 px-4 rounded-xl font-black text-white bg-amber-600 hover:bg-amber-500 border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Play Word Train ({challengeLevel.toUpperCase()})</span>
            </button>
          </div>
        </div>

        {/* Game 2: Tense Time-Traveler */}
        <div className="bg-white border-2 border-sky-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-sky-100 flex items-center justify-center text-3xl mb-4 border border-sky-200 shadow-xs">
              ⏳
            </div>
            <div className="text-xs font-mono font-bold text-sky-700 uppercase tracking-wider mb-1">
              Reflex Time Attack
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Tense Time-Traveler</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Race against the countdown timer! The 4 verb conjugation options are freshly randomized on every round, testing your automatic tense-signal reflexes.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Challenging Elements:
            </div>
            <div className="text-xs text-slate-700 font-medium mb-4 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Urgent timer ({challengeLevel === 'blitz' ? '6s' : challengeLevel === 'hard' ? '9s' : '15s'}) + Streak combo multiplier</span>
            </div>
            <button
              onClick={() => handleLaunch(filteredTopics[0], 'time_traveler')}
              className="w-full py-3 px-4 rounded-xl font-black text-white bg-sky-600 hover:bg-sky-500 border-b-4 border-sky-800 active:border-b-0 active:translate-y-1 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Enter Time Portal ({challengeLevel.toUpperCase()})</span>
            </button>
          </div>
        </div>

        {/* Game 3: Grammar Detective */}
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-rose-100 flex items-center justify-center text-3xl mb-4 border border-rose-200 shadow-xs">
              🔍
            </div>
            <div className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider mb-1">
              Error Hunt &amp; Randomized Fixes
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Grammar Detective</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Inspect suspect sentences with your magnifying glass. Pinpoint the faulty word, and choose from shuffled grammatical repairs to solve the case!
            </p>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Challenging Elements:
            </div>
            <div className="text-xs text-slate-700 font-medium mb-4 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Plausible distractors &amp; randomized fix choices</span>
            </div>
            <button
              onClick={() => handleLaunch(filteredTopics[0], 'grammar_detective')}
              className="w-full py-3 px-4 rounded-xl font-black text-white bg-rose-600 hover:bg-rose-500 border-b-4 border-rose-800 active:border-b-0 active:translate-y-1 transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Investigation ({challengeLevel.toUpperCase()})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Curriculum Topic Directory for Mini-Games */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              Specific Drill Topic Directory
            </h3>
            <p className="text-xs text-slate-500">
              Launch a drill for any of the 20 topics with your selected difficulty ({challengeLevel.toUpperCase()}):
            </p>
          </div>

          {/* Grade filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            {(['all', 'Grade 7', 'Grade 8', 'Grade 9'] as const).map((grade) => (
              <button
                key={grade}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedGrade(grade);
                }}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedGrade === grade
                    ? 'bg-white text-indigo-700 shadow-xs ring-1 ring-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {grade === 'all' ? 'All' : grade}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50 px-2 rounded-xl transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                    GSE {topic.gseRange[0]}–{topic.gseRange[1]} · {topic.cefr}
                  </span>
                  {topic.category === 'text_genre' && (
                    <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                      📜 Text Genre
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium">{topic.grade}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{topic.title}</h4>
              </div>

              {/* Game Mode Launcher Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleLaunch(topic, 'word_train')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Drill Word Train (Scrambled Words + Decoys)"
                >
                  <span>🚂</span>
                  <span className="hidden md:inline">Word Train</span>
                </button>
                <button
                  onClick={() => handleLaunch(topic, 'time_traveler')}
                  className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Drill Tense Time-Traveler (Shuffled Choices + Speed)"
                >
                  <span>⏳</span>
                  <span className="hidden md:inline">Time Warp</span>
                </button>
                <button
                  onClick={() => handleLaunch(topic, 'grammar_detective')}
                  className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 font-bold text-xs border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                  title="Drill Grammar Detective (Shuffled Fixes)"
                >
                  <span>🔍</span>
                  <span className="hidden md:inline">Detective</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
