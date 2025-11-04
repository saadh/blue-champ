'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameSettings, GameState, QuickMatch, Question } from '@/types';
import { getStudents } from '@/lib/storage';
import { studentsToPlayers, shuffle } from '@/lib/gameUtils';
import questionsData from '@/data/questions.json';

interface PlayerSetupProps {
  settings: GameSettings;
  onComplete: (gameState: GameState) => void;
  onBack: () => void;
}

export default function PlayerSetup({ settings, onComplete, onBack }: PlayerSetupProps) {
  const students = getStudents();
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

  const toggleStudent = (studentId: string) => {
    setSelectedStudentIds(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        if (prev.length < 6) {
          return [...prev, studentId];
        }
        return prev;
      }
    });
  };

  const handleStartGame = () => {
    if (selectedStudentIds.length < 2) return;

    const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));
    const players = studentsToPlayers(selectedStudents);

    // Get questions for the selected subject
    const subjectKey = settings.subject.toLowerCase() as keyof typeof questionsData;
    const allQuestions = questionsData[subjectKey] || questionsData.math;

    // Filter by grade level (±1 level) and shuffle
    const filteredQuestions = allQuestions.filter(
      q => Math.abs(q.gradeLevel - settings.gradeLevel) <= 1
    );
    const questions = shuffle(filteredQuestions).slice(0, settings.questionCount) as Question[];

    const quickMatch: QuickMatch = {
      id: `qm-${Date.now()}`,
      theme: settings.theme,
      subject: settings.subject,
      gradeLevel: settings.gradeLevel,
      players,
      currentQuestionIndex: 0,
      questions,
      responses: [],
      startTime: Date.now(),
    };

    const gameState: GameState = {
      mode: 'quickMatch',
      settings,
      quickMatch,
      currentQuestion: questions[0],
      isPlaying: true,
      isPaused: false,
      showResults: false,
    };

    onComplete(gameState);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold text-white mb-2">
          Select Players
        </h1>
        <p className="text-2xl text-blue-200 mb-4">
          Choose 2-6 players for the quiz
        </p>
        <div className="text-xl text-yellow-300">
          {selectedStudentIds.length} / 6 players selected
        </div>
      </motion.div>

      {/* Student Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl w-full mb-8">
        {students.map((student, index) => {
          const isSelected = selectedStudentIds.includes(student.id);
          return (
            <motion.button
              key={student.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleStudent(student.id)}
              className={`rounded-2xl p-6 shadow-xl border-4 transition-all ${
                isSelected
                  ? 'bg-gradient-to-br from-green-500 to-green-700 border-green-300 ring-4 ring-white'
                  : 'bg-white/10 backdrop-blur-md border-white/30 hover:bg-white/20'
              }`}
            >
              <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-white/20">
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-white text-center">
                {student.name}
              </h3>
              {isSelected && (
                <div className="text-4xl mt-2">✓</div>
              )}
            </motion.button>
          );
        })}
      </div>

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

        {selectedStudentIds.length >= 2 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartGame}
            className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 rounded-2xl shadow-lg transition-all"
          >
            Start Game! 🎮
          </motion.button>
        )}
      </div>
    </div>
  );
}
