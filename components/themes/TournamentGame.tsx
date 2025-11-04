'use client';

import { motion } from 'framer-motion';
import { Tournament, Question, GameTheme, Player, Team } from '@/types';

interface TournamentGameProps {
  tournament: Tournament;
  currentQuestion: Question;
  theme: GameTheme;
  timeRemaining: number;
  onAnswer: (participantId: string, answerIndex: number) => void;
}

export default function TournamentGame({
  tournament,
  currentQuestion,
  theme,
  timeRemaining,
  onAnswer,
}: TournamentGameProps) {
  if (!tournament.currentMatch) {
    return <div>No current match</div>;
  }

  const match = tournament.currentMatch;
  const participant1 = tournament.participants.find(p => p.id === match.participant1);
  const participant2 = tournament.participants.find(p => p.id === match.participant2);

  if (!participant1 || !participant2) {
    return <div>Invalid match participants</div>;
  }

  const score1 = match.scores[match.participant1] || 0;
  const score2 = match.scores[match.participant2] || 0;

  const getParticipantName = (participant: Player | Team) => {
    if ('members' in participant) {
      return participant.name;
    }
    return participant.name;
  };

  const getParticipantAvatar = (participant: Player | Team) => {
    if ('members' in participant) {
      return participant.members[0]?.avatar || '';
    }
    return participant.avatar;
  };

  const getParticipantColor = (participant: Player | Team) => {
    if ('members' in participant) {
      return participant.color;
    }
    return '#4F46E5';
  };

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

  const getRoundName = () => {
    switch (match.round) {
      case 'roundOf16':
        return 'Round of 16';
      case 'quarterFinals':
        return 'Quarter Finals';
      case 'semiFinals':
        return 'Semi Finals';
      case 'finals':
        return 'GRAND FINALS';
      default:
        return 'Match';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} p-8 relative overflow-hidden`}>
      {/* Stadium/Arena Background Effect */}
      <div className="absolute inset-0 opacity-10">
        {theme === 'worldCup' && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        )}
      </div>

      {/* Header */}
      <div className="relative z-10">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl font-bold text-white mb-2">
            {theme === 'battleArena' && '⚔️ BATTLE ARENA'}
            {theme === 'worldCup' && '🏆 WORLD CUP FINALS'}
            {theme === 'millionaire' && '💰 CHAMPIONSHIP'}
            {theme === 'quizRace' && '🏎️ GRAND PRIX'}
          </h1>
          <p className="text-4xl text-yellow-400 font-bold">
            {getRoundName()}
          </p>
          {match.round !== 'finals' && (
            <p className="text-2xl text-white/80 mt-2">
              Match {match.matchNumber}
            </p>
          )}
        </motion.div>

        {/* VS Section */}
        <div className="grid grid-cols-12 gap-8 mb-8">
          {/* Participant 1 */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="col-span-5 relative"
          >
            <div
              className="rounded-3xl p-8 shadow-2xl border-4 border-white/50 h-full"
              style={{ backgroundColor: getParticipantColor(participant1) + '80' }}
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-white mb-4 shadow-xl">
                  <img
                    src={getParticipantAvatar(participant1)}
                    alt={getParticipantName(participant1)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-4xl font-bold text-white text-center mb-4">
                  {getParticipantName(participant1)}
                </h2>
                <div className="text-7xl font-bold text-white">
                  {score1}
                </div>
                {theme === 'battleArena' && (
                  <div className="w-full mt-4">
                    <div className="bg-gray-800 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${Math.max(0, 100 - (score2 - score1))}%` }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 health-bar"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* VS */}
          <div className="col-span-2 flex items-center justify-center">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-8xl font-bold text-white bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full w-32 h-32 flex items-center justify-center shadow-2xl"
            >
              VS
            </motion.div>
          </div>

          {/* Participant 2 */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="col-span-5 relative"
          >
            <div
              className="rounded-3xl p-8 shadow-2xl border-4 border-white/50 h-full"
              style={{ backgroundColor: getParticipantColor(participant2) + '80' }}
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden border-8 border-white mb-4 shadow-xl">
                  <img
                    src={getParticipantAvatar(participant2)}
                    alt={getParticipantName(participant2)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-4xl font-bold text-white text-center mb-4">
                  {getParticipantName(participant2)}
                </h2>
                <div className="text-7xl font-bold text-white">
                  {score2}
                </div>
                {theme === 'battleArena' && (
                  <div className="w-full mt-4">
                    <div className="bg-gray-800 rounded-full h-6 overflow-hidden">
                      <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: `${Math.max(0, 100 - (score1 - score2))}%` }}
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 health-bar"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timer and Progress */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl text-white font-bold">
            Question {match.responses.length + 1} / {tournament.questionSet.questions.length}
          </div>

          {timeRemaining > 0 && (
            <motion.div
              animate={timeRemaining <= 5 ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: timeRemaining <= 5 ? Infinity : 0, duration: 0.5 }}
              className={`text-6xl font-bold px-8 py-4 rounded-2xl ${
                timeRemaining <= 5 ? 'bg-red-600' : 'bg-white/20'
              }`}
            >
              <span className="text-white">{timeRemaining}s</span>
            </motion.div>
          )}
        </div>

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

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-6">
          {currentQuestion.options.map((option, index) => (
            <div key={index}>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-br ${getThemeAccent()} p-6 rounded-2xl shadow-xl border-4 border-white/50 mb-4`}
              >
                <div className="text-4xl font-bold text-white text-center mb-4">
                  {String.fromCharCode(65 + index)}
                </div>
                <div className="text-3xl font-bold text-white text-center">
                  {option}
                </div>
              </motion.div>

              {/* Participant Answer Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAnswer(participant1.id, index)}
                  className="p-6 rounded-xl border-4 shadow-xl transition-all font-bold text-xl text-white"
                  style={{
                    backgroundColor: getParticipantColor(participant1),
                    borderColor: getParticipantColor(participant1),
                  }}
                >
                  {getParticipantName(participant1).split(' ')[0]}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAnswer(participant2.id, index)}
                  className="p-6 rounded-xl border-4 shadow-xl transition-all font-bold text-xl text-white"
                  style={{
                    backgroundColor: getParticipantColor(participant2),
                    borderColor: getParticipantColor(participant2),
                  }}
                >
                  {getParticipantName(participant2).split(' ')[0]}
                </motion.button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
