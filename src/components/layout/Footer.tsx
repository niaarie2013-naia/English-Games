import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-800">GrammarQuest EdTech</span>
          <span aria-hidden="true">·</span>
          <span>Aligned with Pearson Global Scale of English (GSE 30–58)</span>
        </div>

        <div className="flex items-center gap-4 text-slate-500">
          <span>Grades 7–9 Curriculum</span>
          <span aria-hidden="true">·</span>
          <span>CEFR A1+ to B1 Standards</span>
          <span aria-hidden="true">·</span>
          <span>Web Speech API SpeechSynthesis</span>
        </div>
      </div>
    </footer>
  );
};
