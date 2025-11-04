'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { QuickMatch, Question, GameTheme } from '@/types';

interface QuickMatchGameProps {
  quickMatch: QuickMatch;
  currentQuestion: Question;
  theme: GameTheme;
  timeRemaining: number;
  onAnswer: (playerId: string, answerIndex: number) => void;
}

export default function QuickMatchGame({
  quickMatch,
  currentQuestion,
  theme,
  timeRemaining,
  onAnswer,
}: QuickMatchGameProps) {
  const sortedPlayers = [...quickMatch.players].sort((a, b) => b.score - a.score);

  const getThemeBackground = () => {
    switch (theme) {
      case 'battleArena':
        return 'bg-gradient-to-b from-red-900 via-orange-900 to-yellow-900';
      case 'worldCup':
        return 'bg-gradient-to-b from-green-800 via-green-600 to-green-900';
      case 'millionaire':
        return 'bg-gradient-to-b from-purple-900 via-indigo-900 to-blue-900';
      case 'quizRace':
        return 'bg-gradient-to-b from-blue-900 via-cyan-800 to-blue-950';
      default:
        return 'bg-gradient-to-b from-purple-900 to-indigo-900';
    }
  };

  const getThemeAccent = () => {
    switch (theme) {
      case 'battleArena':
        return 'from-red-500 to-orange-600';
      case 'worldCup':
        return 'from-green-500 to-emerald-600';
      case 'millionaire':
        return 'from-purple-500 to-indigo-600';
      case 'quizRace':
        return 'from-blue-500 to-cyan-600';
      default:
        return 'from-purple-500 to-indigo-600';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} p-8 relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        {theme === 'battleArena' && (
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]"></div>
        )}
      </div>

      {/* Header */}
      <div className="relative z-10 mb-8">
        <div className="flex justify-between items-center mb-4">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-5xl font-bold text-white"
          >
            {theme === 'battleArena' && '⚔️ Battle Arena'}
            {theme === 'worldCup' && '⚽ World Cup Quiz'}
            {theme === 'millionaire' && '💰 Millionaire Showdown'}
            {theme === 'quizRace' && '🏎️ Quiz Race'}
          </motion.h1>

          {/* Timer */}
          {timeRemaining > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`text-6xl font-bold px-8 py-4 rounded-2xl ${
                timeRemaining <= 5 ? 'bg-red-600 animate-pulse' : 'bg-white/20'
              }`}
            >
              <span className="text-white">{timeRemaining}s</span>
            </motion.div>
          )}
        </div>

        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-4 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: `${((quickMatch.currentQuestionIndex + 1) / quickMatch.questions.length) * 100}%`,
              }}
              className={`h-full bg-gradient-to-r ${getThemeAccent()}`}
            />
          </div>
          <span className="text-white text-2xl font-bold">
            {quickMatch.currentQuestionIndex + 1} / {quickMatch.questions.length}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 grid grid-cols-12 gap-8 h-[calc(100vh-200px)]">
        {/* Players Sidebar */}
        <div className="col-span-3 space-y-4">
          <h2 className="text-3xl font-bold text-white mb-4">Players</h2>
          <AnimatePresence>
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                layout
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getThemeAccent()} p-4 rounded-2xl shadow-2xl border-4 ${
                  index === 0 ? 'border-yellow-400' : 'border-white/30'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.name}
                      className="w-16 h-16 rounded-full border-4 border-white"
                    />
                    {index === 0 && (
                      <div className="absolute -top-2 -right-2 text-2xl">👑</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-white font-bold text-xl">{player.name}</div>
                    <div className="text-white/80 text-sm">
                      {player.streak > 0 && `🔥 ${player.streak} streak`}
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold text-white text-center">
                  {player.score}
                </div>
                <div className="text-sm text-white/80 text-center">
                  {player.correctAnswers} correct
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Question Area */}
        <div className="col-span-9 flex flex-col">
          {/* Question */}
          <motion.div
            key={currentQuestion.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-12 mb-8 border-4 border-white/30 shadow-2xl"
          >
            <h2 className="text-5xl font-bold text-white text-center leading-relaxed">
              {currentQuestion.text}
            </h2>
          </motion.div>

          {/* Answer Options Grid */}
          <div className="grid grid-cols-2 gap-6 flex-1">
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="space-y-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${getThemeAccent()} p-6 rounded-2xl shadow-xl border-4 border-white/50`}
                >
                  <div className="text-4xl font-bold text-white text-center mb-4">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="text-2xl font-bold text-white text-center">
                    {option}
                  </div>
                </motion.div>

                {/* Player Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  {quickMatch.players.map((player) => (
                    <motion.button
                      key={player.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onAnswer(player.id, index)}
                      className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-xl border-2 border-white/40 transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="text-white font-bold text-sm truncate">
                          {player.name.split(' ')[0]}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
