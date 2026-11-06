import React, { useState, useEffect } from 'react';
import { TimeTravelerQuestion } from '../../data/curriculum';
import { soundManager, speakText } from '../../utils/sound';
import { shuffleArray } from '../../utils/shuffle';
import { Zap, Volume2, Sparkles, CheckCircle, XCircle, Flame, Clock } from 'lucide-react';

interface TimeTravelerGameProps {
  question: TimeTravelerQuestion;
  onAnswer: (isCorrect: boolean) => void;
  isAnswerSubmitted: boolean;
  timeLimitSeconds?: number;
}

export const TimeTravelerGame: React.FC<TimeTravelerGameProps> = ({
  question,
  onAnswer,
  isAnswerSubmitted,
  timeLimitSeconds = 12, // Default fast-paced 12s
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(timeLimitSeconds);
  const [timerActive, setTimerActive] = useState(true);
  const [comboStreak, setComboStreak] = useState(0);

  // Randomize choices and reset timer on question change
  useEffect(() => {
    setSelectedOption(null);
    setShuffledOptions(shuffleArray([...question.options]));
    setTimeLeft(timeLimitSeconds);
    setTimerActive(true);
    soundManager.playTimeWarp();
  }, [question, timeLimitSeconds]);

  // Countdown timer with urgent ticking
  useEffect(() => {
    if (!timerActive || isAnswerSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setTimerActive(false);
          // Time expired! Auto submit as failed
          if (!isAnswerSubmitted) {
            handleTimeExpired();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isAnswerSubmitted]);

  const handleTimeExpired = () => {
    soundManager.playError();
    setComboStreak(0);
    onAnswer(false);
  };

  const handleSelect = (option: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(option);
    setTimerActive(false);
    soundManager.playClick();

    const isCorrect = option === question.correctAnswer;
    if (isCorrect) {
      setComboStreak((prev) => prev + 1);
    } else {
      setComboStreak(0);
    }
    onAnswer(isCorrect);
  };

  // Identify time era for visual styling
  const getTimeEra = () => {
    const s = (question.timeSignal + ' ' + question.tenseName).toLowerCase();
    if (s.includes('yesterday') || s.includes('ago') || s.includes('last') || s.includes('while') || s.includes('past') || s.includes('recount') || s.includes('narrative')) {
      return { label: 'PAST REALM', color: 'from-amber-600 to-orange-700', icon: '🏛️' };
    }
    if (s.includes('since') || s.includes('now') || s.includes('usually') || s.includes('at') || s.includes('right now') || s.includes('scientific') || s.includes('descriptive')) {
      return { label: 'PRESENT CHRONOS', color: 'from-emerald-600 to-teal-700', icon: '⚡' };
    }
    return { label: 'FUTURE MATRIX', color: 'from-indigo-600 to-violet-800', icon: '🚀' };
  };

  const era = getTimeEra();

  // Highlight blank in sentence
  const renderSentenceWithBlank = () => {
    const parts = question.sentenceWithBlank.split('___');
    return (
      <div className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-relaxed text-balance text-center py-2">
        <span>{parts[0]}</span>
        <span
          className={`inline-block mx-1.5 px-3 py-1 rounded-xl border-2 font-mono text-base sm:text-xl transition-all ${
            selectedOption
              ? selectedOption === question.correctAnswer
                ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                : 'bg-rose-100 border-rose-500 text-rose-800 line-through'
              : 'bg-indigo-50 border-indigo-400 text-indigo-700 border-dashed animate-pulse-subtle'
          }`}
        >
          {selectedOption || ' [ ? ? ? ] '}
        </span>
        <span>{parts[1] || ''}</span>
      </div>
    );
  };

  const timerPercent = (timeLeft / timeLimitSeconds) * 100;
  const isUrgent = timeLeft <= 4;

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-2">
      {/* Temporal Portal HUD */}
      <div className="w-full bg-slate-950 text-white rounded-3xl p-5 sm:p-6 mb-6 shadow-xl border-b-4 border-slate-900 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top HUD: Era badge + Timer bar + Combo */}
        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{era.icon}</span>
            <div>
              <div className="text-[10px] font-mono font-bold tracking-widest text-indigo-300">
                TEMPORAL WARP
              </div>
              <div className="text-xs sm:text-sm font-extrabold text-white">
                {era.label} · {question.tenseName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comboStreak > 1 && (
              <div className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-1 rounded-xl text-xs font-black animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{comboStreak}x COMBO!</span>
              </div>
            )}

            {/* Time Attack Timer */}
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border transition-all ${
                isUrgent
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-white'
              }`}
            >
              <Zap className={`w-4 h-4 ${isUrgent ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
              <span className="font-mono font-black text-sm sm:text-base tabular-nums">
                {timeLeft}s
              </span>
            </div>
          </div>
        </div>

        {/* Time Progress Bar */}
        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-5 border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ${
              isUrgent ? 'bg-rose-500' : 'bg-linear-to-r from-amber-400 to-emerald-400'
            }`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Time Signal Scanner Banner */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-950 text-indigo-300 rounded-xl border border-indigo-800/60">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Temporal Marker Detected</div>
              <div className="text-sm sm:text-base font-bold text-amber-300 tracking-wide">
                &ldquo;{question.timeSignal}&rdquo;
              </div>
            </div>
          </div>

          <button
            onClick={() => speakText(question.sentenceWithBlank.replace('___', question.correctAnswer))}
            className="flex items-center gap-1.5 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-xl border border-slate-700 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-indigo-400" />
            <span className="hidden sm:inline">Listen</span>
          </button>
        </div>

        {/* Interactive Sentence Stage */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-inner">
          {renderSentenceWithBlank()}
        </div>
      </div>

      {/* Randomized Conjugation Options Grid */}
      <div className="w-full">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          <span>Randomized Conjugation Choices (Shuffled):</span>
          <span className="flex items-center gap-1 font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>Fast Reflex Required</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {shuffledOptions.map((option, idx) => {
            const isSelected = selectedOption === option;
            const isCorrectOption = option === question.correctAnswer;

            let buttonStyle = 'bg-white text-slate-800 border-slate-200 border-b-4 border-b-slate-300 hover:border-indigo-400 hover:bg-indigo-50/50';

            if (isAnswerSubmitted) {
              if (isCorrectOption) {
                buttonStyle = 'bg-emerald-500 text-white border-b-4 border-emerald-700 shadow-sm';
              } else if (isSelected) {
                buttonStyle = 'bg-rose-500 text-white border-b-4 border-rose-700 shadow-sm';
              } else {
                buttonStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            }

            return (
              <button
                key={`${option}-${idx}`}
                onClick={() => handleSelect(option)}
                disabled={isAnswerSubmitted}
                className={`btn-tactile flex items-center justify-between p-4 rounded-2xl font-black text-base sm:text-lg transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed ${buttonStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-xl bg-black/10 flex items-center justify-center text-xs font-mono font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{option}</span>
                </div>

                {isAnswerSubmitted && isCorrectOption && (
                  <CheckCircle className="w-5 h-5 text-white" />
                )}
                {isAnswerSubmitted && isSelected && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
