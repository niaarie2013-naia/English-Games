import React, { useState } from 'react';
import { Topic, TopicQuestion } from '../../data/curriculum';
import { usePlayer } from '../../context/PlayerContext';
import { soundManager, speakText } from '../../utils/sound';
import { WordTrainGame } from './WordTrainGame';
import { TimeTravelerGame } from './TimeTravelerGame';
import { GrammarDetectiveGame } from './GrammarDetectiveGame';
import {
  X,
  Heart,
  Volume2,
  VolumeX,
  Star,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  RotateCcw,
  BookOpen,
  Flame,
} from 'lucide-react';
import { shuffleArray } from '../../utils/shuffle';

interface GameSessionModalProps {
  topic: Topic;
  modeOverride?: 'word_train' | 'time_traveler' | 'grammar_detective';
  challengeLevel?: 'normal' | 'hard' | 'blitz';
  onClose: () => void;
  onOpenCodex?: (topicId: string) => void;
}

export const GameSessionModal: React.FC<GameSessionModalProps> = ({
  topic,
  modeOverride,
  challengeLevel = 'normal',
  onClose,
  onOpenCodex,
}) => {
  const { stats, loseHeart, refillHearts, recordStageCompletion, addXP } = usePlayer();

  // Filter or arrange questions based on modeOverride or full topic sequence, with dynamic randomization
  const [questions] = useState<TopicQuestion[]>(() => {
    let base = topic.questions;
    if (modeOverride) {
      const filtered = topic.questions.filter((q) => q.type === modeOverride);
      base = filtered.length > 0 ? filtered : topic.questions;
    }
    // Randomize question sequence so drills are never in fixed order
    return shuffleArray([...base]);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundManager.getIsMuted());
  const [showHeartRefillModal, setShowHeartRefillModal] = useState(false);

  const currentQuestion = questions[currentIndex];

  const handleToggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setSoundMuted(isMuted);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setIsAnswerSubmitted(true);
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      soundManager.playSuccess();
      setSessionScore((prev) => prev + 100);
      addXP(20);
    } else {
      soundManager.playError();
      setMistakesCount((prev) => prev + 1);
      const stillAlive = loseHeart();
      if (!stillAlive) {
        setShowHeartRefillModal(true);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
      setLastAnswerCorrect(null);
    } else {
      // Completed round!
      soundManager.playFanfare();
      setSessionCompleted(true);
      recordStageCompletion(topic.id, sessionScore + (mistakesCount === 0 ? 50 : 20), mistakesCount);
    }
  };

  // Get explanation text from question
  const getExplanation = () => {
    if (!currentQuestion) return '';
    if (currentQuestion.type === 'word_train') return currentQuestion.explanation;
    if (currentQuestion.type === 'time_traveler') return currentQuestion.explanation;
    if (currentQuestion.type === 'grammar_detective') return currentQuestion.ruleExplanation;
    return '';
  };

  const getCanonicalSentence = () => {
    if (!currentQuestion) return '';
    if (currentQuestion.type === 'word_train') return currentQuestion.correctSentence;
    if (currentQuestion.type === 'time_traveler')
      return currentQuestion.sentenceWithBlank.replace('___', currentQuestion.correctAnswer);
    if (currentQuestion.type === 'grammar_detective') {
      const fixedWords = [...currentQuestion.words];
      fixedWords[currentQuestion.errorIndex] = currentQuestion.correctFix.replace(/[()]/g, '');
      return fixedWords.filter((w) => !w.includes('remove')).join(' ');
    }
    return '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-50 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Top Session Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Quit Session"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                  GSE {topic.gseRange[0]}–{topic.gseRange[1]} · {topic.cefr}
                </span>
                <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                  {topic.grade}
                </span>
                {challengeLevel !== 'normal' && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Flame className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>{challengeLevel === 'blitz' ? 'Blitz 5s Challenge' : 'Hard Challenge'}</span>
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                {topic.title}
              </h2>
            </div>
          </div>

          {/* Right Status (Hearts & Sound) */}
          <div className="flex items-center gap-3">
            {/* Hearts Counter */}
            <div className="flex items-center gap-1.5 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse-subtle" />
              <span className="font-bold text-rose-700 text-sm">{stats.hearts}</span>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title={soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {soundMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Question Progress Dots */}
        <div className="w-full bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span className="font-medium">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="flex items-center gap-1.5">
            {questions.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'w-6 bg-indigo-600'
                    : idx < currentIndex
                    ? 'w-2 bg-emerald-500'
                    : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col justify-between">
          {!sessionCompleted ? (
            <>
              {currentQuestion?.type === 'word_train' && (
                <WordTrainGame
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  isAnswerSubmitted={isAnswerSubmitted}
                  hardcoreMode={challengeLevel !== 'normal'}
                />
              )}
              {currentQuestion?.type === 'time_traveler' && (
                <TimeTravelerGame
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  isAnswerSubmitted={isAnswerSubmitted}
                  timeLimitSeconds={challengeLevel === 'blitz' ? 6 : challengeLevel === 'hard' ? 9 : 14}
                />
              )}
              {currentQuestion?.type === 'grammar_detective' && (
                <GrammarDetectiveGame
                  question={currentQuestion}
                  onAnswer={handleAnswer}
                  isAnswerSubmitted={isAnswerSubmitted}
                />
              )}
            </>
          ) : (
            /* Session Victory Summary */
            <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center text-4xl mb-4 border-4 border-amber-300 animate-float">
                🏆
              </div>

              <div className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-widest mb-1">
                STAGE COMPLETED!
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                Spectacular Mastery!
              </h2>
              <p className="text-sm text-slate-600 mb-6 text-balance">
                You advanced your Pearson GSE English mastery in{' '}
                <strong className="text-slate-800">{topic.title}</strong>.
              </p>

              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((starIndex) => {
                  const starsEarned = mistakesCount === 0 ? 3 : mistakesCount <= 2 ? 2 : 1;
                  const isEarned = starIndex <= starsEarned;
                  return (
                    <Star
                      key={starIndex}
                      className={`w-10 h-10 ${
                        isEarned
                          ? 'text-amber-400 fill-amber-400 filter drop-shadow-md'
                          : 'text-slate-300'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Score summary cards */}
              <div className="grid grid-cols-3 gap-3 w-full mb-8">
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Accuracy</div>
                  <div className="text-lg font-black text-emerald-600 tabular-nums">
                    {Math.round(((questions.length - mistakesCount) / questions.length) * 100)}%
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">Total XP</div>
                  <div className="text-lg font-black text-indigo-600 tabular-nums">
                    +{mistakesCount === 0 ? 115 : 90}
                  </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs">
                  <div className="text-[11px] text-slate-400 font-semibold uppercase">GSE Target</div>
                  <div className="text-lg font-black text-amber-600 tabular-nums">
                    {topic.gseRange[1]}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                {onOpenCodex && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCodex(topic.id);
                    }}
                    className="w-full py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-slate-600" />
                    <span>Review Topic Codex</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all shadow-md text-base cursor-pointer"
                >
                  Return to Learning Pathway
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Immediate Feedback Drawer */}
        {isAnswerSubmitted && !sessionCompleted && (
          <div
            className={`p-4 sm:p-5 border-t-2 shrink-0 transition-all ${
              lastAnswerCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : 'bg-rose-50 border-rose-400 text-rose-950'
            }`}
          >
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                {lastAnswerCorrect ? (
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-7 h-7 text-rose-600 shrink-0 mt-0.5" />
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base sm:text-lg">
                      {lastAnswerCorrect ? 'Splendid Work!' : 'Not Quite!'}
                    </span>
                    <button
                      onClick={() => speakText(getCanonicalSentence())}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-2xs cursor-pointer transition-colors"
                      title="Listen to full correct sentence"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Hear Sentence</span>
                    </button>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed text-slate-700">
                    <strong className="text-slate-900">Grammar Rule: </strong>
                    {getExplanation()}
                  </p>
                </div>
              </div>

              <button
                onClick={handleNextQuestion}
                className={`w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-extrabold text-white transition-all shadow-md cursor-pointer ${
                  lastAnswerCorrect
                    ? 'bg-emerald-600 hover:bg-emerald-500 border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1'
                    : 'bg-rose-600 hover:bg-rose-500 border-b-4 border-rose-800 active:border-b-0 active:translate-y-1'
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Heart Refill Modal Overlay */}
        {showHeartRefillModal && (
          <div className="absolute inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-slate-200">
              <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3 text-3xl">
                💔
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Out of Hearts!</h3>
              <p className="text-xs sm:text-sm text-slate-600 mb-5">
                Every explorer stumbles while learning. Refill your energy potion to continue your GSE quest!
              </p>

              <button
                onClick={() => {
                  refillHearts();
                  setShowHeartRefillModal(false);
                }}
                className="w-full py-3.5 px-4 rounded-xl font-extrabold text-white bg-rose-500 hover:bg-rose-400 border-b-4 border-rose-700 active:border-b-0 active:translate-y-1 transition-all shadow-md mb-2 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Drink Heart Refill Potion (+5 Hearts)</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
              >
                Return to World Map
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
