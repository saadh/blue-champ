'use client';

import { useState, useEffect } from 'react';
import { GameMode, GameTheme, GameSettings, GameState } from '@/types';
import GameModeSelection from '@/components/GameModeSelection';
import ThemeSelection from '@/components/ThemeSelection';
import PlayerSetup from '@/components/PlayerSetup';
import TeamSetup from '@/components/TeamSetup';
import GamePlay from '@/components/GamePlay';
import { getStudents, saveStudents } from '@/lib/storage';
import studentsData from '@/data/students.json';

type Screen = 'mode' | 'theme' | 'setup' | 'game';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('mode');
  const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
  const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);

  // Initialize students data on first load
  useEffect(() => {
    const students = getStudents();
    if (students.length === 0) {
      saveStudents(studentsData);
    }
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    setSelectedMode(mode);
    setCurrentScreen('theme');
  };

  const handleThemeSelect = (theme: GameTheme, subject: string, gradeLevel: number) => {
    setGameSettings({
      mode: selectedMode!,
      theme,
      subject,
      gradeLevel,
      questionCount: selectedMode === 'tournament' ? 10 : 10,
      enableTimer: true,
      timePerQuestion: 30
    });
    setCurrentScreen('setup');
  };

  const handleSetupComplete = (state: GameState) => {
    setGameState(state);
    setCurrentScreen('game');
  };

  const handleGameEnd = () => {
    setCurrentScreen('mode');
    setSelectedMode(null);
    setGameSettings(null);
    setGameState(null);
  };

  const handleBack = () => {
    if (currentScreen === 'theme') {
      setCurrentScreen('mode');
      setSelectedMode(null);
    } else if (currentScreen === 'setup') {
      setCurrentScreen('theme');
      setGameSettings(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {currentScreen === 'mode' && (
        <GameModeSelection onSelect={handleModeSelect} />
      )}

      {currentScreen === 'theme' && gameSettings === null && (
        <ThemeSelection
          mode={selectedMode!}
          onSelect={handleThemeSelect}
          onBack={handleBack}
        />
      )}

      {currentScreen === 'setup' && gameSettings && (
        <>
          {selectedMode === 'quickMatch' ? (
            <PlayerSetup
              settings={gameSettings}
              onComplete={handleSetupComplete}
              onBack={handleBack}
            />
          ) : (
            <TeamSetup
              settings={gameSettings}
              onComplete={handleSetupComplete}
              onBack={handleBack}
            />
          )}
        </>
      )}

      {currentScreen === 'game' && gameState && (
        <GamePlay
          gameState={gameState}
          onGameEnd={handleGameEnd}
        />
      )}
    </main>
  );
}
