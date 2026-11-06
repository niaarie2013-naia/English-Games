import React, { useState } from 'react';
import { CURRICULUM_WORLDS, Topic } from '../../data/curriculum';
import { soundManager, speakText } from '../../utils/sound';
import {
  Search,
  Volume2,
  BookOpen,
  CheckCircle,
  XCircle,
  Play,
  Sparkles,
  FileText,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface GrammarCodexProps {
  initialTopicId?: string;
  onPracticeTopic: (topic: Topic) => void;
}

export const GrammarCodex: React.FC<GrammarCodexProps> = ({ initialTopicId, onPracticeTopic }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorldId, setSelectedWorldId] = useState<number | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'grammar' | 'text_genre'>('all');
  const [activeTopicId, setActiveTopicId] = useState<string>(
    initialTopicId || CURRICULUM_WORLDS[0].topics[0].id
  );

  const allTopics = CURRICULUM_WORLDS.flatMap((w) => w.topics);

  const filteredTopics = allTopics.filter((topic) => {
    const matchesWorld = selectedWorldId === 'all' || topic.worldId === selectedWorldId;
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      topic.title.toLowerCase().includes(query) ||
      topic.ruleSummary.toLowerCase().includes(query) ||
      topic.canDoDescriptor.toLowerCase().includes(query) ||
      (topic.genreDetails?.socialFunction.toLowerCase().includes(query) ?? false);
    return matchesWorld && matchesCategory && matchesQuery;
  });

  const activeTopic = allTopics.find((t) => t.id === activeTopicId) || filteredTopics[0] || allTopics[0];

  const handleSelectTopic = (id: string) => {
    soundManager.playClick();
    setActiveTopicId(id);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-3">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          <span>Junior High English Rulebook & Text Genres</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Grammar & Text Genre Codex
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          Complete syllabus references covering both grammar mechanics and standard junior high text genres: 
          <strong> Descriptive Text (Y7)</strong>, <strong>Recount &amp; Narrative Text (Y8)</strong>, and <strong>Procedure &amp; Report Text (Y9)</strong>.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search grammar rules, text genres (Descriptive, Recount, Report...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* World Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto scrollbar-none">
            <button
              onClick={() => setSelectedWorldId('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                selectedWorldId === 'all'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Grades
            </button>
            {CURRICULUM_WORLDS.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelectedWorldId(w.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedWorldId === w.id
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {w.grade}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter: Grammar vs Text Genre */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Content Type:</span>
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl text-xs font-bold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Content ({allTopics.length})
            </button>
            <button
              onClick={() => setSelectedCategory('grammar')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedCategory === 'grammar' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Grammar Mechanics (15)
            </button>
            <button
              onClick={() => setSelectedCategory('text_genre')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                selectedCategory === 'text_genre' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600 hover:text-purple-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Text Genres (5)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Codex 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Topic List Sidebar (4 Columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-3 max-h-[680px] overflow-y-auto divide-y divide-slate-100 shadow-xs">
          {filteredTopics.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No matching topics found for &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isSelected = activeTopic.id === topic.id;
              const isGenre = topic.category === 'text_genre';
              return (
                <button
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic.id)}
                  className={`w-full text-left p-3 rounded-xl transition-all cursor-pointer ${
                    isSelected
                      ? isGenre
                        ? 'bg-purple-50 text-purple-950 font-bold border border-purple-200/80 shadow-2xs'
                        : 'bg-indigo-50 text-indigo-950 font-bold border border-indigo-200/80 shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span className="font-semibold">{topic.grade}</span>
                    <span
                      className={`font-semibold px-1.5 py-0.5 rounded border ${
                        isGenre
                          ? 'text-purple-700 bg-purple-50 border-purple-200'
                          : 'text-indigo-600 bg-white border-indigo-100'
                      }`}
                    >
                      {isGenre ? 'Text Genre' : `GSE ${topic.gseRange[0]}–${topic.gseRange[1]}`}
                    </span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 leading-snug">
                    {topic.title}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Detailed Topic Article (8 Columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          {activeTopic && (
            <div>
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                      GSE {activeTopic.gseRange[0]}–{activeTopic.gseRange[1]} · CEFR {activeTopic.cefr}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        activeTopic.category === 'text_genre'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {activeTopic.category === 'text_genre' ? 'Text Genre Module' : 'Grammar Core'}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{activeTopic.grade}</span>
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {activeTopic.title}
                  </h2>
                </div>

                <button
                  onClick={() => onPracticeTopic(activeTopic)}
                  className="px-4 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 border-b-3 border-indigo-800 active:border-b-0 active:translate-y-1 transition-all shadow-xs flex items-center gap-1.5 text-xs cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Practice Quest</span>
                </button>
              </div>

              {/* Can-Do Descriptor */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 mb-6">
                <div className="text-xs font-bold text-indigo-900 flex items-center gap-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pearson GSE Can-Do Descriptor</span>
                </div>
                <p className="text-xs sm:text-sm text-indigo-950 font-medium">
                  {activeTopic.canDoDescriptor}
                </p>
              </div>

              {/* Text Genre Special Dossier (If topic is a text genre) */}
              {activeTopic.genreDetails && (
                <div className="mb-6 space-y-5 bg-purple-50/50 border border-purple-200/80 rounded-2xl p-5">
                  <div className="flex items-center gap-2 text-purple-900 font-extrabold text-sm uppercase tracking-wider">
                    <FileText className="w-4 h-4 text-purple-700" />
                    <span>Genre Blueprint &amp; Generic Structure</span>
                  </div>

                  {/* Social Function */}
                  <div>
                    <div className="text-xs font-bold text-purple-950 uppercase tracking-wide mb-1">
                      Social Function (Tujuan Teks):
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-xl border border-purple-100">
                      {activeTopic.genreDetails.socialFunction}
                    </p>
                  </div>

                  {/* Generic Structure */}
                  <div>
                    <div className="text-xs font-bold text-purple-950 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-purple-700" />
                      <span>Generic Structure (Struktur Teks):</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {activeTopic.genreDetails.genericStructure.map((step, idx) => (
                        <div
                          key={idx}
                          className="bg-white border border-purple-100 rounded-xl p-2.5 text-xs text-slate-800 font-medium"
                        >
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Language Features */}
                  <div>
                    <div className="text-xs font-bold text-purple-950 uppercase tracking-wide mb-2">
                      Key Language Features (Unsur Kebahasaan):
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {activeTopic.genreDetails.languageFeatures.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-white/70 p-2 rounded-lg border border-purple-100/60">
                          <CheckCircle className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Model Text Showcase */}
                  {activeTopic.genreDetails.modelText && (
                    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-3 border-b border-purple-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📖</span>
                          <span className="font-extrabold text-sm text-purple-950">
                            Model Text: &ldquo;{activeTopic.genreDetails.modelText.title}&rdquo;
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const fullText = activeTopic.genreDetails?.modelText?.paragraphs
                              .map((p) => p.text)
                              .join(' ');
                            if (fullText) speakText(fullText);
                          }}
                          className="flex items-center gap-1 text-xs font-bold text-purple-700 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg border border-purple-200 transition-colors cursor-pointer"
                          title="Listen to full model text"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Read Full Text</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {activeTopic.genreDetails.modelText.paragraphs.map((para, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/80 text-xs text-slate-800 leading-relaxed"
                          >
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <span className="font-bold text-[11px] font-mono uppercase text-purple-700 bg-purple-100/60 px-2 py-0.5 rounded">
                                [{para.stage}]
                              </span>
                              <button
                                onClick={() => speakText(para.text)}
                                className="text-slate-400 hover:text-purple-700 p-1 rounded transition-colors cursor-pointer"
                                title="Listen to this paragraph"
                              >
                                <Volume2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p>{para.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Rule Summary */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Grammar &amp; Writing Blueprint
                </h3>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  {activeTopic.ruleSummary}
                </p>
              </div>

              {/* Examples & Common Junior High Pitfalls */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-3">
                  Examples &amp; Common Student Pitfalls
                </h3>

                <div className="space-y-3">
                  {activeTopic.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-2.5"
                    >
                      {/* Correct sentence */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                              Correct English
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {ex.correct}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => speakText(ex.correct)}
                          className="shrink-0 p-2 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg border border-slate-200 transition-colors cursor-pointer"
                          title="Listen to pronunciation"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Incorrect sentence / Trap */}
                      <div className="flex items-start gap-2.5 pt-2 border-t border-slate-200/60">
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider block">
                            Common Student Mistake
                          </span>
                          <span className="text-sm text-slate-600 line-through">
                            {ex.incorrect}
                          </span>
                        </div>
                      </div>

                      {/* Explanation note */}
                      <div className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/80">
                        <strong className="text-slate-800">Why? </strong>
                        {ex.note}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
