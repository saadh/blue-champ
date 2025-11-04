'use client';

import { motion } from 'framer-motion';
import { GameMode } from '@/types';

interface GameModeSelectionProps {
  onSelect: (mode: GameMode) => void;
}

export default function GameModeSelection({ onSelect }: GameModeSelectionProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-7xl font-bold text-white mb-4">
          🏆 Blue Champ 🏆
        </h1>
        <p className="text-3xl text-blue-200">
          Educational Quiz Gaming Platform
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full"
      >
        {/* Quick Match */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('quickMatch')}
          className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-12 shadow-2xl border-4 border-blue-300 hover:border-blue-100 transition-all"
        >
          <div className="text-8xl mb-6">⚡</div>
          <h2 className="text-5xl font-bold text-white mb-4">Quick Match</h2>
          <p className="text-xl text-blue-100 mb-6">
            Fast-paced quiz battle with 2-6 players
          </p>
          <ul className="text-left text-lg text-blue-200 space-y-2">
            <li>✓ Single game session</li>
            <li>✓ 5-10 questions</li>
            <li>✓ Instant results</li>
            <li>✓ Perfect for quick practice</li>
          </ul>
        </motion.button>

        {/* Tournament Mode */}
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(234, 179, 8, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect('tournament')}
          className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl p-12 shadow-2xl border-4 border-yellow-300 hover:border-yellow-100 transition-all"
        >
          <div className="text-8xl mb-6">🏆</div>
          <h2 className="text-5xl font-bold text-white mb-4">Tournament</h2>
          <p className="text-xl text-yellow-100 mb-6">
            Championship bracket competition
          </p>
          <ul className="text-left text-lg text-yellow-200 space-y-2">
            <li>✓ Elimination rounds</li>
            <li>✓ 4, 8, or 16 participants</li>
            <li>✓ Team or individual play</li>
            <li>✓ Trophy for the champion</li>
          </ul>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-12 text-center"
      >
        <p className="text-xl text-purple-200">
          Select a game mode to begin your quiz adventure!
        </p>
      </motion.div>
    </div>
  );
}
