import React, { useState, useEffect } from 'react';
import { ScrambleQuestion } from '../../data/curriculum';
import { soundManager, speakText } from '../../utils/sound';
import { shuffleWordsStrictly, getContextualDecoyWords, shuffleArray, scrambleLetters } from '../../utils/shuffle';
import {
  Volume2,
  RotateCcw,
  CheckCircle2,
  TrainTrack,
  Lightbulb,
  Shuffle,
  Flame,
  AlertTriangle,
  Type,
} from 'lucide-react';

interface WordTrainGameProps {
  question: ScrambleQuestion;
  onAnswer: (isCorrect: boolean) => void;
  isAnswerSubmitted: boolean;
  hardcoreMode?: boolean;
}

export const WordTrainGame: React.FC<WordTrainGameProps> = ({
  question,
  onAnswer,
  isAnswerSubmitted,
  hardcoreMode = false,
}) => {
  // Scrambled pool available in depot
  const [availableWords, setAvailableWords] = useState<{ id: string; word: string; isDecoy?: boolean }[]>([]);
  // Placed words in train cars
  const [trainCars, setTrainCars] = useState<{ id: string; word: string; isDecoy?: boolean }[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [challengeDecoysEnabled, setChallengeDecoysEnabled] = useState(hardcoreMode);
  const [letterJumblePreview, setLetterJumblePreview] = useState(false);

  // Initialize or reset question with dynamic Fisher-Yates randomization
  useEffect(() => {
    initializeDepot(challengeDecoysEnabled);
    setTrainCars([]);
    setShowHint(false);
  }, [question, challengeDecoysEnabled]);

  const initializeDepot = (withDecoys: boolean) => {
    let wordList = [...question.scrambledWords];
    let decoys: string[] = [];

    if (withDecoys) {
      decoys = getContextualDecoyWords(question.correctSentence);
    }

    // Combine and shuffle strictly
    const combinedTokens: { id: string; word: string; isDecoy?: boolean }[] = [];

    wordList.forEach((w, index) => {
      combinedTokens.push({
        id: `target-${w}-${index}-${Math.random()}`,
        word: w,
        isDecoy: false,
      });
    });

    decoys.forEach((d, index) => {
      combinedTokens.push({
        id: `decoy-${d}-${index}-${Math.random()}`,
        word: d,
        isDecoy: true,
      });
    });

    // Fisher-Yates shuffle
    const randomized = shuffleArray(combinedTokens);
    setAvailableWords(randomized);
  };

  const handleReshuffleDepot = () => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setAvailableWords((prev) => shuffleArray([...prev]));
  };

  const handleWordClickFromDepot = (item: { id: string; word: string; isDecoy?: boolean }) => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setAvailableWords((prev) => prev.filter((w) => w.id !== item.id));
    setTrainCars((prev) => [...prev, item]);
  };

  const handleWordClickFromTrain = (item: { id: string; word: string; isDecoy?: boolean }) => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    setTrainCars((prev) => prev.filter((w) => w.id !== item.id));
    setAvailableWords((prev) => [...prev, item]);
  };

  const handleReset = () => {
    if (isAnswerSubmitted) return;
    soundManager.playClick();
    initializeDepot(challengeDecoysEnabled);
    setTrainCars([]);
  };

  const handleCheck = () => {
    if (trainCars.length === 0 || isAnswerSubmitted) return;
    soundManager.playTrainWhistle();
    const constructed = trainCars.map((c) => c.word).join(' ');

    const normalize = (str: string) =>
      str.toLowerCase().replace(/[.,!?;:]/g, '').trim().replace(/\s+/g, ' ');

    const isCorrect = normalize(constructed) === normalize(question.correctSentence);
    onAnswer(isCorrect);
  };

  const currentSentence = trainCars.map((c) => c.word).join(' ');
  const targetWordCount = question.scrambledWords.length;

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-2">
      {/* Game Header / Prompt */}
      <div className="w-full bg-amber-50/90 border border-amber-200 rounded-3xl p-4 sm:p-5 mb-5 shadow-xs">
        <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
          <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
            <span className="text-xl">🚂</span>
            <span>Word Train · Syntax & Order Scramble</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Decoy Trap Words Toggle */}
            <button
              onClick={() => {
                if (isAnswerSubmitted) return;
                soundManager.playClick();
                setChallengeDecoysEnabled(!challengeDecoysEnabled);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                challengeDecoysEnabled
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'bg-amber-100/80 hover:bg-amber-200 text-amber-900'
              }`}
              title="Adds grammatical trap words that do NOT belong in the sentence"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>{challengeDecoysEnabled ? 'Trap Decoys: ON' : '+ Add Trap Words'}</span>
            </button>

            {/* Letter Jumble Preview Toggle */}
            <button
              onClick={() => {
                soundManager.playClick();
                setLetterJumblePreview(!letterJumblePreview);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                letterJumblePreview
                  ? 'bg-indigo-600 text-white'
                  : 'bg-amber-100/80 hover:bg-amber-200 text-amber-900'
              }`}
              title="Scrambles the letters inside words for an anagram challenge"
            >
              <Type className="w-3.5 h-3.5" />
              <span>{letterJumblePreview ? 'Letters Jumbled' : 'Jumble Letters'}</span>
            </button>

            {/* Syntax Hint */}
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-100/70 hover:bg-amber-200/80 px-2.5 py-1 rounded-xl transition-colors cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{showHint ? 'Hide' : 'Hint'}</span>
            </button>
          </div>
        </div>

        <p className="text-base sm:text-lg font-black text-slate-900 text-balance">
          {question.prompt}
        </p>

        {challengeDecoysEnabled && (
          <div className="mt-2.5 flex items-center gap-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>Challenge Mode: Watch out! 1–2 grammatical decoy words do NOT belong in this train!</span>
          </div>
        )}

        {showHint && (
          <div className="mt-2.5 text-xs sm:text-sm text-amber-900 bg-amber-100/60 p-3 rounded-2xl border border-amber-200/80 transition-all">
            <span className="font-bold">Syntax Clue: </span>
            {question.hint}
          </div>
        )}
      </div>

      {/* Train Track & Coupled Cars Canvas */}
      <div className="w-full bg-slate-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border-b-4 border-slate-900 mb-5 relative overflow-hidden">
        {/* Track illustration background */}
        <div className="absolute inset-x-0 bottom-3 h-3 bg-slate-800 border-y border-slate-700 flex items-center justify-around opacity-40 pointer-events-none">
          {Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="w-1.5 h-3 bg-slate-600" />
          ))}
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-400 mb-2">
          <span>COUPLED CARS: {trainCars.length} / {targetWordCount}</span>
          {trainCars.length === targetWordCount && (
            <span className="text-emerald-400 animate-pulse">● FULL TRAIN READY FOR COUPLING CHECK</span>
          )}
        </div>

        {/* Engine and coupled cars */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 min-h-[96px] scrollbar-thin">
          {/* Train Locomotive Head */}
          <div className="shrink-0 flex items-center gap-2 bg-indigo-600 text-white px-3.5 py-2.5 rounded-2xl border-2 border-indigo-400 shadow-md">
            <span className="text-2xl animate-pulse-subtle">🚂</span>
            <div className="text-left text-xs font-bold leading-tight">
              <div>Syntax</div>
              <div className="text-[10px] text-indigo-200 font-mono">EXPRESS</div>
            </div>
          </div>

          <div className="shrink-0 w-3 h-1 bg-amber-400 rounded-full" />

          {/* Cars / Word slots */}
          {trainCars.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs sm:text-sm italic py-4 border-2 border-dashed border-slate-800 rounded-2xl px-4 text-center">
              Click shuffled word wagons from the depot below to couple them onto the track...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {trainCars.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <button
                    onClick={() => handleWordClickFromTrain(item)}
                    disabled={isAnswerSubmitted}
                    title="Click to decouple back to station"
                    className="group shrink-0 flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl border-b-3 border-amber-700 active:border-b-0 active:translate-y-1 transition-all shadow-sm cursor-pointer disabled:cursor-not-allowed"
                  >
                    <span className="text-xs text-amber-950/70 font-mono font-bold mr-0.5">
                      #{idx + 1}
                    </span>
                    <span className="text-sm sm:text-base font-black">
                      {item.word}
                    </span>
                    <span className="text-amber-950/50 group-hover:text-amber-950 text-xs ml-1 font-black">
                      ×
                    </span>
                  </button>
                  {idx < trainCars.length - 1 && (
                    <div className="w-2.5 h-1 bg-amber-300 rounded-full shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>

        {/* Live Audio Preview Bar */}
        <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-400">Current Sentence:</span>
            <span className="font-bold text-amber-300 truncate">
              {currentSentence || '(empty train)'}
            </span>
          </div>

          {currentSentence && (
            <button
              onClick={() => speakText(currentSentence)}
              className="shrink-0 flex items-center gap-1 text-xs text-indigo-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl transition-colors cursor-pointer border border-slate-700"
            >
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Hear Train</span>
            </button>
          )}
        </div>
      </div>

      {/* Shuffled Word Depot (Station) */}
      <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <TrainTrack className="w-4 h-4 text-slate-400" />
            <span>Randomized Word Depot ({availableWords.length} available)</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Acak Ulang / Reshuffle Button */}
            <button
              onClick={handleReshuffleDepot}
              disabled={isAnswerSubmitted || availableWords.length <= 1}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-40 transition-colors cursor-pointer text-xs font-bold"
              title="Re-randomize the arrangement of available word tiles"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Acak Ulang (Shuffle)</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isAnswerSubmitted || trainCars.length === 0}
              className="flex items-center gap-1 text-slate-500 hover:text-slate-800 disabled:opacity-40 transition-colors cursor-pointer text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Train</span>
            </button>
          </div>
        </div>

        {/* Shuffled Word Tokens */}
        <div className="flex flex-wrap gap-2.5 min-h-[64px] items-center p-1">
          {availableWords.length === 0 ? (
            <div className="text-xs text-emerald-700 font-bold py-2 bg-emerald-50 px-3 rounded-xl border border-emerald-200">
              ✓ All words coupled onto the track! Click &apos;Check Syntax Coupling&apos; below.
            </div>
          ) : (
            availableWords.map((item) => {
              const displayWord = letterJumblePreview ? scrambleLetters(item.word) : item.word;
              return (
                <button
                  key={item.id}
                  onClick={() => handleWordClickFromDepot(item)}
                  disabled={isAnswerSubmitted}
                  className="btn-tactile bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-400 text-slate-900 font-bold px-4 py-3 rounded-2xl border border-slate-300 border-b-3 border-b-slate-400 text-base sm:text-lg transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <span>{displayWord}</span>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Action Bar */}
      {!isAnswerSubmitted && (
        <div className="w-full flex items-center justify-end gap-3">
          <button
            onClick={handleCheck}
            disabled={trainCars.length === 0}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>Check Syntax Coupling</span>
          </button>
        </div>
      )}
    </div>
  );
};
