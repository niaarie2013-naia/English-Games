import React, { useState, useEffect } from 'react';
import { DetectiveQuestion } from '../../data/curriculum';
import { soundManager, speakText } from '../../utils/sound';
import { shuffleArray } from '../../utils/shuffle';
import { Search, Volume2, ShieldAlert, Sparkles, Check, HelpCircle, Shuffle } from 'lucide-react';

interface GrammarDetectiveGameProps {
  question: DetectiveQuestion;
  onAnswer: (isCorrect: boolean) => void;
  isAnswerSubmitted: boolean;
}

export const GrammarDetectiveGame: React.FC<GrammarDetectiveGameProps> = ({
  question,
  onAnswer,
  isAnswerSubmitted,
}) => {
  const [suspectWordIndex, setSuspectWordIndex] = useState<number | null>(null);
  const [selectedFix, setSelectedFix] = useState<string | null>(null);
  const [shuffledFixes, setShuffledFixes] = useState<string[]>([]);
  const [investigationStep, setInvestigationStep] = useState<'spot' | 'fix'>('spot');

  // Randomize the correction alternatives on mount/reset
  useEffect(() => {
    setSuspectWordIndex(null);
    setSelectedFix(null);
    setShuffledFixes(shuffleArray([...question.correctionOptions]));
    setInvestigationStep('spot');
  }, [question]);

  const handleWordClick = (index: number) => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setSuspectWordIndex(index);

    if (index === question.errorIndex) {
      setInvestigationStep('fix');
    } else {
      setInvestigationStep('spot');
    }
  };

  const handleSelectFix = (fix: string) => {
    if (isAnswerSubmitted) return;
    setSelectedFix(fix);
    soundManager.playClick();
  };

  const handleReshuffleFixes = () => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setShuffledFixes(shuffleArray([...shuffledFixes]));
  };

  const handleSolveCase = () => {
    if (isAnswerSubmitted) return;
    const isWordCorrect = suspectWordIndex === question.errorIndex;
    const isFixCorrect = selectedFix === question.correctFix;
    const isTotalCorrect = isWordCorrect && isFixCorrect;

    if (isTotalCorrect) {
      soundManager.playSuccess();
    } else {
      soundManager.playError();
    }

    onAnswer(isTotalCorrect);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-2">
      {/* Case File Header */}
      <div className="w-full bg-amber-950 text-amber-100 rounded-3xl p-5 sm:p-6 mb-5 shadow-xl border-b-4 border-amber-900 relative overflow-hidden">
        {/* Background badge */}
        <div className="absolute -top-6 -right-6 text-7xl opacity-10 select-none pointer-events-none">
          🔍
        </div>

        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-900 flex items-center justify-center text-amber-300">
              <Search className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-amber-400 font-bold">
                GRAMMAR DETECTIVE BUREAU · CASE CRACKER
              </div>
              <div className="text-sm sm:text-base font-extrabold text-white">
                {question.caseTitle}
              </div>
            </div>
          </div>

          <button
            onClick={() => speakText(question.sentence)}
            className="flex items-center gap-1.5 text-xs text-amber-200 hover:text-white bg-amber-900/60 hover:bg-amber-900 px-3 py-1.5 rounded-xl border border-amber-700/60 transition-colors cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Listen to Sentence</span>
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-amber-900/40 border border-amber-800/60 rounded-xl px-4 py-2 text-xs sm:text-sm text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {investigationStep === 'spot'
                ? 'Step 1: Inspect the sentence and tap the exact incorrect word.'
                : 'Step 2: Suspect pinned! Select the correct grammatical repair below.'}
            </span>
          </div>
          <span className="font-mono text-amber-400 font-bold shrink-0">
            {investigationStep === 'spot' ? '1/2' : '2/2'}
          </span>
        </div>

        {/* Suspect Sentence Examination Board */}
        <div className="mt-4 bg-amber-50 rounded-2xl p-4 sm:p-6 text-slate-900 shadow-inner">
          <div className="text-xs font-bold text-amber-800 tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EVIDENCE TRANSCRIPT (CLICK A WORD TO INVESTIGATE)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 py-2">
            {question.words.map((word, idx) => {
              const isSuspect = suspectWordIndex === idx;
              const isActualError = idx === question.errorIndex;

              let wordClass = 'bg-white hover:bg-amber-100/70 border-slate-300 text-slate-800 hover:border-amber-400';

              if (isAnswerSubmitted) {
                if (isActualError) {
                  wordClass = 'bg-rose-500 text-white border-rose-700 shadow-md animate-pulse-subtle';
                } else if (isSuspect) {
                  wordClass = 'bg-slate-200 text-slate-500 line-through border-slate-300';
                } else {
                  wordClass = 'bg-slate-100 text-slate-600 border-slate-200 opacity-80';
                }
              } else if (isSuspect) {
                wordClass = 'bg-amber-500 text-slate-950 font-black border-amber-600 shadow-sm scale-105';
              }

              return (
                <button
                  key={`${word}-${idx}`}
                  onClick={() => handleWordClick(idx)}
                  disabled={isAnswerSubmitted}
                  className={`btn-tactile px-3.5 py-2 rounded-xl text-base sm:text-lg font-bold border-2 transition-all cursor-pointer shadow-xs disabled:cursor-not-allowed ${wordClass}`}
                >
                  {word}
                </button>
              );
            })}
          </div>

          {suspectWordIndex !== null && !isAnswerSubmitted && (
            <div className="mt-3 text-xs text-slate-600 flex items-center justify-between border-t border-amber-200/60 pt-2">
              <span>
                Inspecting word: <strong className="text-slate-900">&ldquo;{question.words[suspectWordIndex]}&rdquo;</strong>
              </span>
              {suspectWordIndex !== question.errorIndex ? (
                <span className="text-slate-500 italic flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  No grammar crime found here. Try another word!
                </span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Suspect located! Select the correction below.
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shuffled Correction Chamber Options (Step 2) */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs mb-5">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          <span>Randomized Evidence Correction (Shuffled):</span>
          <button
            onClick={handleReshuffleFixes}
            disabled={isAnswerSubmitted}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-bold cursor-pointer"
            title="Shuffle correction choices"
          >
            <Shuffle className="w-3 h-3" />
            <span>Shuffle Fixes</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {shuffledFixes.map((opt) => {
            const isSelected = selectedFix === opt;
            const isCorrectFix = opt === question.correctFix;

            let optClass = 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800 hover:border-indigo-400';

            if (isAnswerSubmitted) {
              if (isCorrectFix) {
                optClass = 'bg-emerald-500 text-white border-emerald-700 font-black';
              } else if (isSelected) {
                optClass = 'bg-rose-500 text-white border-rose-700';
              } else {
                optClass = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
              }
            } else if (isSelected) {
              optClass = 'bg-indigo-600 text-white border-indigo-800 font-bold shadow-sm';
            }

            return (
              <button
                key={opt}
                onClick={() => handleSelectFix(opt)}
                disabled={isAnswerSubmitted}
                className={`btn-tactile p-3.5 rounded-2xl border-2 font-black text-center text-sm sm:text-base transition-all cursor-pointer disabled:cursor-not-allowed ${optClass}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      {!isAnswerSubmitted && (
        <div className="w-full flex items-center justify-end">
          <button
            onClick={handleSolveCase}
            disabled={suspectWordIndex === null || selectedFix === null}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-black text-white bg-amber-600 hover:bg-amber-500 border-b-4 border-amber-800 active:border-b-0 active:translate-y-1 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
          >
            <Search className="w-5 h-5" />
            <span>Submit Detective Report</span>
          </button>
        </div>
      )}
    </div>
  );
};
