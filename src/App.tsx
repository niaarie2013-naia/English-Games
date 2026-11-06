/**
 * GrammarQuest: Junior High English GSE Adventure
 * Pearson GSE 30–58 / CEFR A1+ to B1 EdTech Web Application.
 */

import { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Navbar, NavTab } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { WorldMap } from './components/pathway/WorldMap';
import { MiniGamesArena } from './components/arena/MiniGamesArena';
import { GrammarCodex } from './components/codex/GrammarCodex';
import { ProfileView } from './components/profile/ProfileView';
import { GameSessionModal } from './components/games/GameSessionModal';
import { Topic, getTopicById } from './data/curriculum';

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>('world_map');
  const [activeQuestTopic, setActiveQuestTopic] = useState<Topic | null>(null);
  const [activeQuestMode, setActiveQuestMode] = useState<'word_train' | 'time_traveler' | 'grammar_detective' | undefined>(undefined);
  const [activeQuestChallenge, setActiveQuestChallenge] = useState<'normal' | 'hard' | 'blitz'>('normal');
  const [codexInitialTopicId, setCodexInitialTopicId] = useState<string | undefined>(undefined);

  const handleStartQuest = (
    topic: Topic,
    mode?: 'word_train' | 'time_traveler' | 'grammar_detective',
    challengeLevel?: 'normal' | 'hard' | 'blitz'
  ) => {
    setActiveQuestTopic(topic);
    setActiveQuestMode(mode);
    setActiveQuestChallenge(challengeLevel || 'normal');
  };

  const handleCloseQuest = () => {
    setActiveQuestTopic(null);
    setActiveQuestMode(undefined);
    setActiveQuestChallenge('normal');
  };

  const handleOpenCodex = (topicId?: string) => {
    if (topicId) {
      setCodexInitialTopicId(topicId);
    }
    setCurrentTab('codex');
  };

  const handlePracticeFromCodex = (topic: Topic) => {
    setActiveQuestTopic(topic);
    setActiveQuestMode(undefined);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* Top Navigation */}
      <Navbar currentTab={currentTab} onSelectTab={setCurrentTab} />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'world_map' && (
          <WorldMap
            onStartQuest={handleStartQuest}
            onOpenCodex={handleOpenCodex}
          />
        )}

        {currentTab === 'mini_games' && (
          <MiniGamesArena onStartGame={handleStartQuest} />
        )}

        {currentTab === 'codex' && (
          <GrammarCodex
            initialTopicId={codexInitialTopicId}
            onPracticeTopic={handlePracticeFromCodex}
          />
        )}

        {currentTab === 'profile' && <ProfileView />}
      </main>

      {/* Active Quest Modal (Word Train / Time-Traveler / Detective) */}
      {activeQuestTopic && (
        <GameSessionModal
          topic={activeQuestTopic}
          modeOverride={activeQuestMode}
          challengeLevel={activeQuestChallenge}
          onClose={handleCloseQuest}
          onOpenCodex={(topicId) => {
            const found = getTopicById(topicId);
            if (found) {
              setCodexInitialTopicId(topicId);
              setCurrentTab('codex');
            }
          }}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
