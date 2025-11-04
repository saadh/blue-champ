'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GameSettings, GameState, Tournament, Team, Question, Player } from '@/types';
import { getStudents } from '@/lib/storage';
import { createBracket, shuffle, studentsToPlayers, getTeamColor } from '@/lib/gameUtils';
import questionsData from '@/data/questions.json';

interface TeamSetupProps {
  settings: GameSettings;
  onComplete: (gameState: GameState) => void;
  onBack: () => void;
}

type ParticipantMode = 'individual' | 'team';

export default function TeamSetup({ settings, onComplete, onBack }: TeamSetupProps) {
  const students = getStudents();
  const [participantMode, setParticipantMode] = useState<ParticipantMode>('team');
  const [participantCount, setParticipantCount] = useState<4 | 8 | 16>(8);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([]);
  const [currentTeam, setCurrentTeam] = useState<number>(0);

  // Auto-create teams when mode or count changes
  const initializeTeams = () => {
    if (participantMode === 'team') {
      const newTeams: Team[] = [];
      for (let i = 0; i < participantCount; i++) {
        newTeams.push({
          id: `team-${i + 1}`,
          name: `Team ${i + 1}`,
          members: [],
          color: getTeamColor(i),
          score: 0,
          correctAnswers: 0,
        });
      }
      setTeams(newTeams);
      setCurrentTeam(0);
    } else {
      // Individual mode - convert students to players
      const availablePlayers = studentsToPlayers(students.slice(0, participantCount));
      setSelectedPlayers(availablePlayers);
    }
  };

  const addPlayerToTeam = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    // Check if already in a team
    const alreadyAssigned = teams.some(team => team.members.some(m => m.id === studentId));
    if (alreadyAssigned) return;

    const updatedTeams = [...teams];
    updatedTeams[currentTeam].members.push(student);
    setTeams(updatedTeams);

    // Move to next team if current team has 2+ members
    if (updatedTeams[currentTeam].members.length >= 2) {
      const nextIncompleteTeam = updatedTeams.findIndex(t => t.members.length < 2);
      if (nextIncompleteTeam !== -1) {
        setCurrentTeam(nextIncompleteTeam);
      }
    }
  };

  const removePlayerFromTeam = (teamIndex: number, studentId: string) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].members = updatedTeams[teamIndex].members.filter(m => m.id !== studentId);
    setTeams(updatedTeams);
  };

  const updateTeamName = (teamIndex: number, name: string) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].name = name;
    setTeams(updatedTeams);
  };

  const handleStartTournament = () => {
    // Get questions
    const subjectKey = settings.subject.toLowerCase() as keyof typeof questionsData;
    const allQuestions = questionsData[subjectKey] || questionsData.math;
    const filteredQuestions = allQuestions.filter(
      q => Math.abs(q.gradeLevel - settings.gradeLevel) <= 1
    );
    const questions = shuffle(filteredQuestions).slice(0, settings.questionCount * 4) as Question[];

    // Create participants
    const participants = participantMode === 'team' ? teams : selectedPlayers;

    // Create bracket
    const bracket = createBracket(participantCount, participants);
    const firstMatch = bracket.roundOf16?.[0] || bracket.quarterFinals?.[0] || bracket.semiFinals?.[0];

    const tournament: Tournament = {
      id: `tour-${Date.now()}`,
      name: `${settings.subject} Championship`,
      theme: settings.theme,
      subject: settings.subject,
      gradeLevel: settings.gradeLevel,
      participantType: participantMode,
      participants,
      bracket,
      currentMatch: firstMatch,
      startTime: Date.now(),
      questionSet: {
        id: `qs-${Date.now()}`,
        name: `${settings.subject} Questions`,
        subject: settings.subject,
        gradeLevel: settings.gradeLevel,
        questions,
      },
    };

    const gameState: GameState = {
      mode: 'tournament',
      settings,
      tournament,
      currentQuestion: questions[0],
      isPlaying: true,
      isPaused: false,
      showResults: false,
    };

    onComplete(gameState);
  };

  const canStartTournament = () => {
    if (participantMode === 'team') {
      return teams.every(t => t.members.length >= 2);
    }
    return selectedPlayers.length === participantCount;
  };

  const assignedStudentIds = teams.flatMap(t => t.members.map(m => m.id));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-6xl font-bold text-white mb-2">
          Tournament Setup
        </h1>
        <p className="text-2xl text-blue-200">
          Configure your championship bracket
        </p>
      </motion.div>

      {/* Configuration */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-6xl w-full mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Participant Mode */}
          <div>
            <label className="block text-xl font-bold text-white mb-3">
              Mode
            </label>
            <select
              value={participantMode}
              onChange={(e) => {
                setParticipantMode(e.target.value as ParticipantMode);
                setTeams([]);
                setSelectedPlayers([]);
              }}
              className="w-full text-xl p-3 rounded-xl bg-white/20 text-white border-2 border-white/30 focus:border-white focus:outline-none"
            >
              <option value="team" className="text-black">Teams</option>
              <option value="individual" className="text-black">Individual</option>
            </select>
          </div>

          {/* Participant Count */}
          <div>
            <label className="block text-xl font-bold text-white mb-3">
              Participants
            </label>
            <select
              value={participantCount}
              onChange={(e) => {
                setParticipantCount(Number(e.target.value) as 4 | 8 | 16);
                setTeams([]);
                setSelectedPlayers([]);
              }}
              className="w-full text-xl p-3 rounded-xl bg-white/20 text-white border-2 border-white/30 focus:border-white focus:outline-none"
            >
              <option value={4} className="text-black">4 (Semi-finals)</option>
              <option value={8} className="text-black">8 (Quarter-finals)</option>
              <option value={16} className="text-black">16 (Round of 16)</option>
            </select>
          </div>

          {/* Initialize Button */}
          <div className="flex items-end">
            <button
              onClick={initializeTeams}
              className="w-full px-6 py-3 text-xl font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
            >
              {teams.length > 0 || selectedPlayers.length > 0 ? 'Reset' : 'Initialize'}
            </button>
          </div>
        </div>

        {/* Team Setup */}
        {participantMode === 'team' && teams.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Assign Players to Teams (2+ per team)
            </h2>

            {/* Team Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {teams.map((team, index) => (
                <div
                  key={team.id}
                  className={`rounded-xl p-4 border-4 transition-all ${
                    currentTeam === index
                      ? 'border-yellow-400 ring-4 ring-yellow-200'
                      : 'border-white/30'
                  }`}
                  style={{ backgroundColor: team.color + '40' }}
                >
                  <input
                    type="text"
                    value={team.name}
                    onChange={(e) => updateTeamName(index, e.target.value)}
                    className="w-full px-3 py-2 mb-2 text-lg font-bold text-white bg-black/30 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={() => setCurrentTeam(index)}
                  />
                  <div className="space-y-1">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between bg-black/30 rounded px-2 py-1"
                      >
                        <span className="text-white text-sm">{member.name}</span>
                        <button
                          onClick={() => removePlayerFromTeam(index, member.id)}
                          className="text-red-400 hover:text-red-300 font-bold"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  {team.members.length === 0 && (
                    <div className="text-white/50 text-sm italic">
                      Click student below to add
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Available Students */}
            <div>
              <h3 className="text-xl font-bold text-white mb-3">
                Available Students
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {students.filter(s => !assignedStudentIds.includes(s.id)).map((student) => (
                  <button
                    key={student.id}
                    onClick={() => addPlayerToTeam(student.id)}
                    className="bg-white/20 hover:bg-white/30 rounded-lg p-3 transition-all"
                  >
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden">
                      <img src={student.avatar} alt={student.name} className="w-full h-full" />
                    </div>
                    <div className="text-white text-sm text-center">{student.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
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

        {canStartTournament() && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartTournament}
            className="px-12 py-6 text-2xl font-bold text-white bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-2xl shadow-lg transition-all"
          >
            Start Tournament! 🏆
          </motion.button>
        )}
      </div>
    </div>
  );
}
