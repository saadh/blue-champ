'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GameState, Player, Team, ExportData } from '@/types';
import { exportToCSV, generatePrintableReport, exportDetailedReport } from '@/lib/storage';

interface VictoryScreenProps {
  gameState: GameState;
  onExit: () => void;
}

export default function VictoryScreen({ gameState, onExit }: VictoryScreenProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const getWinner = (): { name: string; score: number; avatar?: string } => {
    if (gameState.mode === 'quickMatch' && gameState.quickMatch) {
      const sortedPlayers = [...gameState.quickMatch.players].sort((a, b) => b.score - a.score);
      return {
        name: sortedPlayers[0].name,
        score: sortedPlayers[0].score,
        avatar: sortedPlayers[0].avatar,
      };
    } else if (gameState.mode === 'tournament' && gameState.tournament) {
      const champion = gameState.tournament.participants.find(
        p => p.id === gameState.tournament!.bracket.champion
      );
      if (champion) {
        const name = 'members' in champion ? champion.name : champion.name;
        const avatar = 'members' in champion ? champion.members[0]?.avatar : champion.avatar;
        const finalMatch = gameState.tournament.bracket.finals;
        const score = finalMatch?.scores[champion.id] || 0;
        return { name, score, avatar };
      }
    }
    return { name: 'Unknown', score: 0 };
  };

  const getLeaderboard = () => {
    if (gameState.mode === 'quickMatch' && gameState.quickMatch) {
      return [...gameState.quickMatch.players].sort((a, b) => b.score - a.score);
    } else if (gameState.mode === 'tournament' && gameState.tournament) {
      // Get all participants with their final scores
      return gameState.tournament.participants.map(p => {
        const allMatches = [
          ...(gameState.tournament!.bracket.roundOf16 || []),
          ...(gameState.tournament!.bracket.quarterFinals || []),
          ...(gameState.tournament!.bracket.semiFinals || []),
          ...(gameState.tournament!.bracket.finals ? [gameState.tournament!.bracket.finals] : []),
        ];

        const participantMatches = allMatches.filter(
          m => m.participant1 === p.id || m.participant2 === p.id
        );

        const totalScore = participantMatches.reduce((sum, match) => {
          return sum + (match.scores[p.id] || 0);
        }, 0);

        return {
          ...p,
          score: totalScore,
        };
      }).sort((a, b) => b.score - a.score);
    }
    return [];
  };

  const handleExport = () => {
    const winner = getWinner();
    const leaderboard = getLeaderboard();

    const exportData: ExportData = {
      gameType: gameState.mode === 'quickMatch' ? 'quickMatch' : 'tournament',
      date: new Date().toLocaleDateString(),
      theme: gameState.settings.theme,
      subject: gameState.settings.subject,
      gradeLevel: gameState.settings.gradeLevel,
      participants: leaderboard.map(p => ({
        name: 'members' in p ? p.name : p.name,
        score: p.score,
        correctAnswers: 'correctAnswers' in p ? p.correctAnswers : 0,
        totalQuestions: gameState.mode === 'quickMatch'
          ? gameState.quickMatch!.questions.length
          : gameState.settings.questionCount,
      })),
      winner: winner.name,
      responses: gameState.mode === 'quickMatch'
        ? gameState.quickMatch!.responses
        : [],
      duration: gameState.mode === 'quickMatch' && gameState.quickMatch
        ? Math.round((gameState.quickMatch.endTime! - gameState.quickMatch.startTime) / 60000)
        : gameState.tournament
        ? Math.round((gameState.tournament.endTime! - gameState.tournament.startTime) / 60000)
        : 0,
    };

    exportToCSV(exportData);
  };

  const winner = getWinner();
  const leaderboard = getLeaderboard();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-8 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={i}
              className="confetti absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                backgroundColor: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'][
                  Math.floor(Math.random() * 5)
                ],
              }}
              initial={{ y: -10, opacity: 1 }}
              animate={{
                y: '100vh',
                opacity: 0,
                rotate: Math.random() * 720,
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Victory Header */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1 }}
          className="text-center mb-12"
        >
          <div className="text-9xl mb-4">🏆</div>
          <h1 className="text-7xl font-bold text-yellow-400 mb-4 celebration">
            {gameState.mode === 'tournament' ? 'CHAMPION!' : 'VICTORY!'}
          </h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-md rounded-3xl p-8 inline-block"
          >
            {winner.avatar && (
              <img
                src={winner.avatar}
                alt={winner.name}
                className="w-32 h-32 rounded-full border-8 border-yellow-400 mx-auto mb-4"
              />
            )}
            <h2 className="text-5xl font-bold text-white mb-2">{winner.name}</h2>
            <p className="text-4xl text-yellow-300">Final Score: {winner.score}</p>
          </motion.div>
        </motion.div>

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white/10 backdrop-blur-md rounded-3xl p-8 mb-8"
        >
          <h2 className="text-4xl font-bold text-white mb-6 text-center">
            Final Standings
          </h2>

          <div className="space-y-4">
            {leaderboard.map((participant, index) => {
              const name = 'members' in participant ? participant.name : participant.name;
              const avatar = 'members' in participant
                ? participant.members[0]?.avatar
                : participant.avatar;
              const correctAnswers = 'correctAnswers' in participant ? participant.correctAnswers : 0;

              return (
                <motion.div
                  key={participant.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className={`flex items-center gap-6 p-6 rounded-2xl ${
                    index === 0
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-600 to-orange-700'
                      : 'bg-white/20'
                  }`}
                >
                  <div className="text-5xl font-bold text-white w-16 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>

                  {avatar && (
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 rounded-full border-4 border-white"
                    />
                  )}

                  <div className="flex-1">
                    <div className="text-2xl font-bold text-white">{name}</div>
                    {correctAnswers > 0 && (
                      <div className="text-lg text-white/80">{correctAnswers} correct answers</div>
                    )}
                  </div>

                  <div className="text-4xl font-bold text-white">
                    {participant.score}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-6"
        >
          <button
            onClick={handleExport}
            className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-2xl shadow-lg transition-all"
          >
            📊 Export Results
          </button>

          <button
            onClick={onExit}
            className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-2xl shadow-lg transition-all"
          >
            🏠 Back to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}
