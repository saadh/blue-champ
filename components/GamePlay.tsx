'use client';

import { useState, useEffect } from 'react';
import { GameState, Response, Player, Team } from '@/types';
import { calculateScore, advanceWinner, getNextMatch } from '@/lib/gameUtils';
import { saveCompletedQuickMatch, saveCompletedTournament } from '@/lib/storage';
import QuickMatchGame from '@/components/themes/QuickMatchGame';
import TournamentGame from '@/components/themes/TournamentGame';
import VictoryScreen from '@/components/VictoryScreen';

interface GamePlayProps {
  gameState: GameState;
  onGameEnd: () => void;
}

export default function GamePlay({ gameState: initialState, onGameEnd }: GamePlayProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [timeRemaining, setTimeRemaining] = useState<number>(
    initialState.settings.enableTimer ? initialState.settings.timePerQuestion : 0
  );
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

  // Timer logic
  useEffect(() => {
    if (!gameState.settings.enableTimer || gameState.isPaused || gameState.showResults) {
      return;
    }

    if (timeRemaining <= 0) {
      // Time's up - auto-skip to next question
      handleTimeout();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, gameState.isPaused, gameState.showResults, gameState.settings.enableTimer]);

  const handleTimeout = () => {
    // Move to next question without awarding points
    if (gameState.mode === 'quickMatch') {
      nextQuestion();
    } else {
      nextQuestion();
    }
  };

  const handleAnswer = (participantId: string, answerIndex: number) => {
    if (!gameState.currentQuestion || gameState.isPaused) return;

    const isCorrect = answerIndex === gameState.currentQuestion.correctAnswer;
    const timeToAnswer = Date.now() - questionStartTime;
    const timeBonusPoints = gameState.settings.enableTimer
      ? Math.max(0, Math.floor((timeRemaining / gameState.settings.timePerQuestion) * 50))
      : 0;

    if (gameState.mode === 'quickMatch' && gameState.quickMatch) {
      const player = gameState.quickMatch.players.find(p => p.id === participantId);
      if (!player) return;

      const streak = isCorrect ? player.streak + 1 : 0;
      const points = calculateScore(
        isCorrect,
        gameState.currentQuestion.points,
        streak,
        timeBonusPoints
      );

      // Update player
      const updatedPlayers = gameState.quickMatch.players.map(p => {
        if (p.id === participantId) {
          return {
            ...p,
            score: p.score + points,
            correctAnswers: p.correctAnswers + (isCorrect ? 1 : 0),
            streak,
          };
        }
        return p;
      });

      // Record response
      const response: Response = {
        questionId: gameState.currentQuestion.id,
        playerId: participantId,
        answer: answerIndex,
        correct: isCorrect,
        timestamp: Date.now(),
        timeToAnswer: timeToAnswer / 1000,
        pointsEarned: points,
      };

      setGameState({
        ...gameState,
        quickMatch: {
          ...gameState.quickMatch,
          players: updatedPlayers,
          responses: [...gameState.quickMatch.responses, response],
        },
      });

      // Show answer feedback then move to next
      setTimeout(() => {
        nextQuestion();
      }, 2000);
    } else if (gameState.mode === 'tournament' && gameState.tournament && gameState.tournament.currentMatch) {
      const match = gameState.tournament.currentMatch;
      const participant = gameState.tournament.participants.find(p => p.id === participantId);
      if (!participant) return;

      const isTeam = 'members' in participant;
      const streak = 0; // Simplified for tournament
      const points = calculateScore(
        isCorrect,
        gameState.currentQuestion.points,
        streak,
        timeBonusPoints
      );

      // Update match scores
      const currentScore = match.scores[participantId] || 0;
      const updatedScores = {
        ...match.scores,
        [participantId]: currentScore + points,
      };

      // Record response
      const response: Response = {
        questionId: gameState.currentQuestion.id,
        playerId: isTeam ? '' : participantId,
        teamId: isTeam ? participantId : undefined,
        answer: answerIndex,
        correct: isCorrect,
        timestamp: Date.now(),
        timeToAnswer: timeToAnswer / 1000,
        pointsEarned: points,
      };

      const updatedMatch = {
        ...match,
        scores: updatedScores,
        responses: [...match.responses, response],
      };

      // Update tournament bracket
      let updatedBracket = { ...gameState.tournament.bracket };
      if (match.round === 'roundOf16' && updatedBracket.roundOf16) {
        updatedBracket.roundOf16 = updatedBracket.roundOf16.map(m =>
          m.id === match.id ? updatedMatch : m
        );
      } else if (match.round === 'quarterFinals' && updatedBracket.quarterFinals) {
        updatedBracket.quarterFinals = updatedBracket.quarterFinals.map(m =>
          m.id === match.id ? updatedMatch : m
        );
      } else if (match.round === 'semiFinals' && updatedBracket.semiFinals) {
        updatedBracket.semiFinals = updatedBracket.semiFinals.map(m =>
          m.id === match.id ? updatedMatch : m
        );
      } else if (match.round === 'finals' && updatedBracket.finals) {
        updatedBracket.finals = updatedMatch;
      }

      setGameState({
        ...gameState,
        tournament: {
          ...gameState.tournament,
          currentMatch: updatedMatch,
          bracket: updatedBracket,
        },
      });

      setTimeout(() => {
        nextQuestion();
      }, 2000);
    }
  };

  const nextQuestion = () => {
    if (gameState.mode === 'quickMatch' && gameState.quickMatch) {
      const nextIndex = gameState.quickMatch.currentQuestionIndex + 1;

      if (nextIndex >= gameState.quickMatch.questions.length) {
        // Game over
        finishQuickMatch();
      } else {
        setGameState({
          ...gameState,
          quickMatch: {
            ...gameState.quickMatch,
            currentQuestionIndex: nextIndex,
          },
          currentQuestion: gameState.quickMatch.questions[nextIndex],
        });
        resetTimer();
      }
    } else if (gameState.mode === 'tournament' && gameState.tournament && gameState.tournament.currentMatch) {
      const match = gameState.tournament.currentMatch;
      const matchQuestions = gameState.tournament.questionSet.questions.slice(
        match.responses.length,
        match.responses.length + gameState.settings.questionCount
      );

      if (match.responses.length >= gameState.settings.questionCount) {
        // Match complete
        finishMatch();
      } else {
        const nextQuestion = matchQuestions[0];
        setGameState({
          ...gameState,
          currentQuestion: nextQuestion,
        });
        resetTimer();
      }
    }
  };

  const finishQuickMatch = () => {
    if (!gameState.quickMatch) return;

    const sortedPlayers = [...gameState.quickMatch.players].sort((a, b) => b.score - a.score);
    const winner = sortedPlayers[0];

    const completedMatch = {
      ...gameState.quickMatch,
      endTime: Date.now(),
      winner: winner.id,
    };

    saveCompletedQuickMatch(completedMatch);

    setGameState({
      ...gameState,
      quickMatch: completedMatch,
      isPlaying: false,
      showResults: true,
    });
  };

  const finishMatch = () => {
    if (!gameState.tournament || !gameState.tournament.currentMatch) return;

    const match = gameState.tournament.currentMatch;
    const scores = match.scores;

    // Determine winner
    const participant1Score = scores[match.participant1] || 0;
    const participant2Score = scores[match.participant2] || 0;
    const winnerId = participant1Score > participant2Score ? match.participant1 : match.participant2;

    const completedMatch = {
      ...match,
      winner: winnerId,
      completed: true,
    };

    // Update bracket with winner
    let updatedBracket = advanceWinner(gameState.tournament.bracket, match, winnerId);

    // Update the completed match in bracket
    if (match.round === 'roundOf16' && updatedBracket.roundOf16) {
      updatedBracket.roundOf16 = updatedBracket.roundOf16.map(m =>
        m.id === match.id ? completedMatch : m
      );
    } else if (match.round === 'quarterFinals' && updatedBracket.quarterFinals) {
      updatedBracket.quarterFinals = updatedBracket.quarterFinals.map(m =>
        m.id === match.id ? completedMatch : m
      );
    } else if (match.round === 'semiFinals' && updatedBracket.semiFinals) {
      updatedBracket.semiFinals = updatedBracket.semiFinals.map(m =>
        m.id === match.id ? completedMatch : m
      );
    } else if (match.round === 'finals' && updatedBracket.finals) {
      updatedBracket.finals = completedMatch;
    }

    // Get next match
    const nextMatch = getNextMatch(updatedBracket);

    if (!nextMatch) {
      // Tournament complete
      const completedTournament = {
        ...gameState.tournament,
        bracket: updatedBracket,
        currentMatch: undefined,
        endTime: Date.now(),
      };

      saveCompletedTournament(completedTournament);

      setGameState({
        ...gameState,
        tournament: completedTournament,
        isPlaying: false,
        showResults: true,
      });
    } else {
      // Continue to next match
      const roundOf16Responses = gameState.tournament.bracket.roundOf16?.reduce((sum, m) => sum + m.responses.length, 0) || 0;
      const quarterFinalsResponses = gameState.tournament.bracket.quarterFinals?.reduce((sum, m) => sum + m.responses.length, 0) || 0;
      const semiFinalsResponses = gameState.tournament.bracket.semiFinals?.reduce((sum, m) => sum + m.responses.length, 0) || 0;
      const totalResponses = roundOf16Responses + quarterFinalsResponses + semiFinalsResponses;
      const nextQuestion = gameState.tournament.questionSet.questions[totalResponses];

      setGameState({
        ...gameState,
        tournament: {
          ...gameState.tournament,
          bracket: updatedBracket,
          currentMatch: nextMatch,
        },
        currentQuestion: nextQuestion,
      });
      resetTimer();
    }
  };

  const resetTimer = () => {
    setTimeRemaining(gameState.settings.timePerQuestion);
    setQuestionStartTime(Date.now());
  };

  if (gameState.showResults) {
    return <VictoryScreen gameState={gameState} onExit={onGameEnd} />;
  }

  return (
    <>
      {gameState.mode === 'quickMatch' && gameState.quickMatch && (
        <QuickMatchGame
          quickMatch={gameState.quickMatch}
          currentQuestion={gameState.currentQuestion!}
          theme={gameState.settings.theme}
          timeRemaining={timeRemaining}
          onAnswer={handleAnswer}
        />
      )}

      {gameState.mode === 'tournament' && gameState.tournament && (
        <TournamentGame
          tournament={gameState.tournament}
          currentQuestion={gameState.currentQuestion!}
          theme={gameState.settings.theme}
          timeRemaining={timeRemaining}
          onAnswer={handleAnswer}
        />
      )}
    </>
  );
}
