import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { calculateEstimatedGSE, getAllTopics } from '../data/curriculum';
import confetti from 'canvas-confetti';
import { soundManager } from '../utils/sound';

export interface StageProgress {
  stars: number; // 0 - 3
  bestScore: number;
  completed: boolean;
  timesPlayed: number;
}

export interface PlayerBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number | null;
}

export interface PlayerStats {
  xp: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  hearts: number;
  maxHearts: number;
  topicProgress: Record<string, StageProgress>;
  badges: PlayerBadge[];
  soundEnabled: boolean;
  freePlayUnlocked: boolean; // Teacher / Sandbox override
}

const INITIAL_BADGES: PlayerBadge[] = [
  { id: 'first_quest', title: 'First Steps', description: 'Complete your first grammar quest', icon: '🌱', unlockedAt: null },
  { id: 'syntax_conductor', title: 'Syntax Conductor', description: 'Complete 3 Word Train syntax games', icon: '🚂', unlockedAt: null },
  { id: 'time_master', title: 'Time Chronomancer', description: 'Conquer 3 Tense Time-Traveler challenges', icon: '⏳', unlockedAt: null },
  { id: 'ace_detective', title: 'Ace Detective', description: 'Spot and solve 3 grammar mysteries', icon: '🔍', unlockedAt: null },
  { id: 'flawless_run', title: 'Flawless Master', description: 'Complete a stage without losing a single heart', icon: '💎', unlockedAt: null },
  { id: 'world1_master', title: 'Foundation Hero', description: 'Complete all Grade 7 (GSE 30-42) quests', icon: '🛡️', unlockedAt: null },
  { id: 'world2_master', title: 'Grammar Adventurer', description: 'Complete all Grade 8 (GSE 40-50) quests', icon: '⚔️', unlockedAt: null },
  { id: 'world3_master', title: 'Language Legend', description: 'Master all Grade 9 (GSE 48-58) quests', icon: '👑', unlockedAt: null },
  { id: 'genre_master', title: 'Genre Scribe', description: 'Master all 5 Junior High Text Types (Descriptive, Recount, Narrative, Procedure, Report)', icon: '📜', unlockedAt: null },
];

const DEFAULT_STATS: PlayerStats = {
  xp: 120,
  streak: 1,
  lastActiveDate: new Date().toISOString().split('T')[0],
  hearts: 5,
  maxHearts: 5,
  topicProgress: {
    'w1-t1': { stars: 1, bestScore: 90, completed: true, timesPlayed: 1 },
  },
  badges: INITIAL_BADGES,
  soundEnabled: true,
  freePlayUnlocked: false,
};

interface PlayerContextType {
  stats: PlayerStats;
  estimatedGSE: number;
  cefrLevel: string;
  addXP: (amount: number) => void;
  loseHeart: () => boolean; // returns true if still has hearts
  refillHearts: () => void;
  recordStageCompletion: (topicId: string, score: number, mistakes: number) => void;
  unlockBadge: (badgeId: string) => void;
  toggleFreePlay: () => void;
  isTopicUnlocked: (topicId: string) => boolean;
  resetProgress: () => void;
  triggerCelebration: () => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

const STORAGE_KEY = 'grammarquest_player_v1';

export const PlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<PlayerStats>(() => {
    if (typeof window === 'undefined') return DEFAULT_STATS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to ensure all keys exist
        return {
          ...DEFAULT_STATS,
          ...parsed,
          badges: INITIAL_BADGES.map((b) => {
            const saved = parsed.badges?.find((pb: PlayerBadge) => pb.id === b.id);
            return saved || b;
          }),
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_STATS;
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch {
      // ignore
    }
  }, [stats]);

  // Streak check on day change
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate !== today) {
      const last = new Date(stats.lastActiveDate);
      const curr = new Date(today);
      const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        // Kept the streak
        setStats((prev) => ({
          ...prev,
          streak: prev.streak + 1,
          lastActiveDate: today,
        }));
      } else if (diffDays > 1) {
        // Reset streak
        setStats((prev) => ({
          ...prev,
          streak: 1,
          lastActiveDate: today,
        }));
      }
    }
  }, [stats.lastActiveDate]);

  const addXP = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const loseHeart = (): boolean => {
    let stillAlive = true;
    setStats((prev) => {
      const newHearts = Math.max(0, prev.hearts - 1);
      stillAlive = newHearts > 0;
      return {
        ...prev,
        hearts: newHearts,
      };
    });
    return stillAlive;
  };

  const refillHearts = () => {
    setStats((prev) => ({
      ...prev,
      hearts: prev.maxHearts,
    }));
    soundManager.playSuccess();
  };

  const unlockBadge = (badgeId: string) => {
    setStats((prev) => {
      const existing = prev.badges.find((b) => b.id === badgeId);
      if (existing && existing.unlockedAt) return prev; // already unlocked
      return {
        ...prev,
        badges: prev.badges.map((b) =>
          b.id === badgeId ? { ...b, unlockedAt: Date.now() } : b
        ),
      };
    });
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'],
      });
    } catch {
      // ignore
    }
  };

  const recordStageCompletion = (topicId: string, score: number, mistakes: number) => {
    const stars = mistakes === 0 ? 3 : mistakes <= 2 ? 2 : 1;
    const xpGain = stars * 30 + (mistakes === 0 ? 25 : 10);

    setStats((prev) => {
      const curr = prev.topicProgress[topicId] || { stars: 0, bestScore: 0, completed: false, timesPlayed: 0 };
      const updated: StageProgress = {
        stars: Math.max(curr.stars, stars),
        bestScore: Math.max(curr.bestScore, score),
        completed: true,
        timesPlayed: curr.timesPlayed + 1,
      };

      const newTopicProgress = {
        ...prev.topicProgress,
        [topicId]: updated,
      };

      // Check badges
      const newBadges = [...prev.badges];
      const unlock = (id: string) => {
        const b = newBadges.find((x) => x.id === id);
        if (b && !b.unlockedAt) b.unlockedAt = Date.now();
      };

      unlock('first_quest');
      if (mistakes === 0) unlock('flawless_run');

      // Check World masters and Genre master
      const w1Topics = ['w1-t1', 'w1-t2', 'w1-t3', 'w1-t4', 'w1-t5', 'w1-t6'];
      if (w1Topics.every((id) => newTopicProgress[id]?.completed)) unlock('world1_master');

      const w2Topics = ['w2-t1', 'w2-t2', 'w2-t3', 'w2-t4', 'w2-t5', 'w2-t6', 'w2-t7'];
      if (w2Topics.every((id) => newTopicProgress[id]?.completed)) unlock('world2_master');

      const w3Topics = ['w3-t1', 'w3-t2', 'w3-t3', 'w3-t4', 'w3-t5', 'w3-t6', 'w3-t7'];
      if (w3Topics.every((id) => newTopicProgress[id]?.completed)) unlock('world3_master');

      const genreTopics = ['w1-t6', 'w2-t6', 'w2-t7', 'w3-t6', 'w3-t7'];
      if (genreTopics.every((id) => newTopicProgress[id]?.completed)) unlock('genre_master');

      return {
        ...prev,
        xp: prev.xp + xpGain,
        topicProgress: newTopicProgress,
        badges: newBadges,
      };
    });

    triggerCelebration();
  };

  const toggleFreePlay = () => {
    setStats((prev) => ({
      ...prev,
      freePlayUnlocked: !prev.freePlayUnlocked,
    }));
  };

  const resetProgress = () => {
    setStats(DEFAULT_STATS);
  };

  // Determine if a topic is unlocked for play
  const isTopicUnlocked = (topicId: string): boolean => {
    if (stats.freePlayUnlocked) return true;
    const allTopics = getAllTopics();
    const idx = allTopics.findIndex((t) => t.id === topicId);
    if (idx <= 0) return true; // first topic always unlocked

    // Check if the previous topic has been completed
    const prevTopic = allTopics[idx - 1];
    return !!stats.topicProgress[prevTopic.id]?.completed;
  };

  const completedTopicIds = Object.keys(stats.topicProgress).filter(
    (id) => stats.topicProgress[id]?.completed
  );

  const estimatedGSE = calculateEstimatedGSE(completedTopicIds);

  let cefrLevel = 'A1+';
  if (estimatedGSE >= 51) cefrLevel = 'B1';
  else if (estimatedGSE >= 43) cefrLevel = 'A2+';
  else if (estimatedGSE >= 36) cefrLevel = 'A2';

  return (
    <PlayerContext.Provider
      value={{
        stats,
        estimatedGSE,
        cefrLevel,
        addXP,
        loseHeart,
        refillHearts,
        recordStageCompletion,
        unlockBadge,
        toggleFreePlay,
        isTopicUnlocked,
        resetProgress,
        triggerCelebration,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
