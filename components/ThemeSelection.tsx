'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameMode, GameTheme } from '@/types';

interface ThemeSelectionProps {
  mode: GameMode;
  onSelect: (theme: GameTheme, subject: string, gradeLevel: number) => void;
  onBack: () => void;
}

interface ThemeOption {
  id: GameTheme;
  name: string;
  icon: string;
  description: string;
  gradient: string;
  borderColor: string;
}

const themes: ThemeOption[] = [
  {
    id: 'battleArena',
    name: 'Battle Arena',
    icon: '⚔️',
    description: 'Street Fighter style combat with health bars and special moves',
    gradient: 'from-red-600 to-red-800',
    borderColor: 'border-red-400'
  },
  {
    id: 'worldCup',
    name: 'World Cup Stadium',
    icon: '⚽',
    description: 'Soccer championship with stadium atmosphere and trophies',
    gradient: 'from-green-600 to-green-800',
    borderColor: 'border-green-400'
  },
  {
    id: 'millionaire',
    name: 'Millionaire Showdown',
    icon: '💰',
    description: 'Game show style with spotlit stage and climbing prizes',
    gradient: 'from-purple-600 to-purple-800',
    borderColor: 'border-purple-400'
  },
  {
    id: 'quizRace',
    name: 'Quiz Race',
    icon: '🏎️',
    description: 'High-speed racing game with vehicles and finish lines',
    gradient: 'from-blue-600 to-blue-800',
    borderColor: 'border-blue-400'
  }
];

const subjects = ['Math', 'Science', 'History', 'Geography', 'English'];
const gradeLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export default function ThemeSelection({ mode, onSelect, onBack }: ThemeSelectionProps) {
  const [selectedTheme, setSelectedTheme] = useState<GameTheme | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('Math');
  const [selectedGrade, setSelectedGrade] = useState<number>(5);

  const handleContinue = () => {
    if (selectedTheme) {
      onSelect(selectedTheme, selectedSubject, selectedGrade);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold text-white mb-2">
          Choose Your Theme
        </h1>
        <p className="text-2xl text-blue-200">
          {mode === 'quickMatch' ? 'Quick Match' : 'Tournament'} Mode
        </p>
      </motion.div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl w-full mb-8">
        {themes.map((theme, index) => (
          <motion.button
            key={theme.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedTheme(theme.id)}
            className={`bg-gradient-to-br ${theme.gradient} rounded-2xl p-8 shadow-xl border-4 ${
              selectedTheme === theme.id
                ? `${theme.borderColor} ring-4 ring-white`
                : 'border-transparent'
            } transition-all`}
          >
            <div className="text-6xl mb-4">{theme.icon}</div>
            <h3 className="text-3xl font-bold text-white mb-2">{theme.name}</h3>
            <p className="text-lg text-gray-100">{theme.description}</p>
          </motion.button>
        ))}
      </div>

      {/* Subject and Grade Selection */}
      {selectedTheme && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-4xl w-full mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject */}
            <div>
              <label className="block text-2xl font-bold text-white mb-4">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full text-2xl p-4 rounded-xl bg-white/20 text-white border-2 border-white/30 focus:border-white focus:outline-none"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject} className="text-black">
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Level */}
            <div>
              <label className="block text-2xl font-bold text-white mb-4">
                Grade Level
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(Number(e.target.value))}
                className="w-full text-2xl p-4 rounded-xl bg-white/20 text-white border-2 border-white/30 focus:border-white focus:outline-none"
              >
                {gradeLevels.map((grade) => (
                  <option key={grade} value={grade} className="text-black">
                    Grade {grade}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="px-12 py-6 text-2xl font-bold text-white bg-gray-600 hover:bg-gray-700 rounded-2xl shadow-lg transition-colors"
        >
          ← Back
        </motion.button>

        {selectedTheme && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleContinue}
            className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-2xl shadow-lg transition-all"
          >
            Continue →
          </motion.button>
        )}
      </div>
    </div>
  );
}
