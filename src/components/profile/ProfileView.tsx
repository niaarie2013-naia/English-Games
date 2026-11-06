import React from 'react';
import { usePlayer } from '../../context/PlayerContext';
import { CURRICULUM_WORLDS, getAllTopics } from '../../data/curriculum';
import { soundManager } from '../../utils/sound';
import {
  Award,
  Flame,
  Heart,
  Sparkles,
  Star,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { stats, estimatedGSE, cefrLevel, refillHearts, resetProgress } = usePlayer();

  const handleRefill = () => {
    soundManager.playSuccess();
    refillHearts();
  };

  const handleReset = () => {
    if (window.confirm('Reset all saved player progress and restart the GSE adventure?')) {
      resetProgress();
      soundManager.playClick();
    }
  };

  // Compute breakdown per world
  const worldsSummary = CURRICULUM_WORLDS.map((w) => {
    const total = w.topics.length;
    let completed = 0;
    let stars = 0;
    w.topics.forEach((t) => {
      const p = stats.topicProgress[t.id];
      if (p?.completed) completed++;
      if (p?.stars) stars += p.stars;
    });
    return {
      ...w,
      completed,
      total,
      stars,
      percent: Math.round((completed / total) * 100),
    };
  });

  const totalMasteredTopics = Object.values(stats.topicProgress).filter((t) => t.completed).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* GSE Score Master Banner */}
      <div className="bg-linear-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-indigo-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/80 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Pearson GSE Scale Standard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1">
              GSE Proficiency Diagnostic
            </h1>
            <p className="text-sm text-slate-300 max-w-lg">
              Dynamic language scale score calibrated between GSE 30 (A1+) and GSE 58 (B1) for junior high students.
            </p>
          </div>

          {/* GSE Score Badge Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 text-center min-w-[200px]">
            <div className="text-xs font-mono font-bold tracking-widest text-indigo-300 uppercase mb-1">
              Estimated GSE Score
            </div>
            <div className="text-4xl sm:text-5xl font-black text-amber-400 tabular-nums">
              {estimatedGSE}
            </div>
            <div className="mt-1 text-xs font-bold text-white bg-indigo-600/60 py-0.5 px-2.5 rounded-full inline-block border border-indigo-400/30">
              CEFR Level: {cefrLevel}
            </div>
          </div>
        </div>

        {/* Global Progress Strip */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Total XP</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums mt-0.5">
              {stats.xp}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400 fill-orange-400" />
              <span>Day Streak</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums mt-0.5">
              {stats.streak} Days
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="text-[11px] text-slate-400 font-semibold uppercase flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>Mastered Topics</span>
            </div>
            <div className="text-2xl font-black text-white tabular-nums mt-0.5">
              {totalMasteredTopics} / {getAllTopics().length}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex flex-col justify-between">
            <div className="text-[11px] text-slate-400 font-semibold uppercase flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                <span>Hearts</span>
              </span>
              <span className="text-rose-400 font-bold">{stats.hearts}/{stats.maxHearts}</span>
            </div>
            <button
              onClick={handleRefill}
              disabled={stats.hearts === stats.maxHearts}
              className="mt-1 text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-40 disabled:hover:bg-rose-600 px-2 py-1 rounded-lg transition-colors cursor-pointer"
            >
              {stats.hearts === stats.maxHearts ? 'Hearts Full' : 'Refill Potion'}
            </button>
          </div>
        </div>
      </div>

      {/* World Mastery Breakdown */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 mb-2">
          Curriculum World Progression
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Junior high school scope and sequence mapping across grades:
        </p>

        <div className="space-y-5">
          {worldsSummary.map((w) => (
            <div
              key={w.id}
              className="border border-slate-200 rounded-2xl p-4 sm:p-5 bg-slate-50/50"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                      {w.grade}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {w.gseLabel} ({w.cefrRange})
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                    {w.name}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{w.stars} Stars</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {w.completed} / {w.total} Done
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full rounded-full transition-all duration-700"
                  style={{ width: `${w.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 mb-8 shadow-xs">
        <h2 className="text-xl font-black text-slate-900 mb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>Badges & Achievements</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mb-6">
          Milestones unlocked during your English grammar voyage:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.badges.map((b) => {
            const isUnlocked = !!b.unlockedAt;
            return (
              <div
                key={b.id}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-amber-50/50 border-amber-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-50'
                }`}
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-2xl mb-3 shadow-2xs">
                    {b.icon}
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mb-1">
                    {b.title}
                  </h4>
                  <p className="text-xs text-slate-500 leading-snug">
                    {b.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 text-[11px] font-mono font-semibold">
                  {isUnlocked ? (
                    <span className="text-emerald-700 font-bold">● Unlocked</span>
                  ) : (
                    <span className="text-slate-400">Locked</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Admin / Reset Progress option */}
      <div className="flex items-center justify-between p-4 bg-slate-100 rounded-2xl border border-slate-200 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-800">Learning Records Management:</span> Resetting progress clears XP and stars.
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-1 font-bold text-rose-600 hover:text-rose-800 hover:bg-white px-3 py-1.5 rounded-lg border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Progress</span>
        </button>
      </div>
    </div>
  );
};
