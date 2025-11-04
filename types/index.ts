// Student and Player Types
export interface Student {
  id: string;
  name: string;
  avatar: string;
}

export interface Player extends Student {
  score: number;
  correctAnswers: number;
  streak: number;
  isActive: boolean;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  members: Student[];
  color: string;
  score: number;
  correctAnswers: number;
  avatar?: string;
}

// Question Types
export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct option
  subject: string;
  gradeLevel: number;
  points: number;
  timeLimit?: number; // in seconds
}

export interface QuestionSet {
  id: string;
  name: string;
  subject: string;
  gradeLevel: number;
  questions: Question[];
}

// Response Tracking
export interface Response {
  questionId: string;
  playerId: string;
  teamId?: string;
  answer: number;
  correct: boolean;
  timestamp: number;
  timeToAnswer?: number;
  pointsEarned: number;
}

// Game Types
export type GameMode = 'quickMatch' | 'tournament';
export type GameTheme = 'battleArena' | 'quizRace' | 'millionaire' | 'worldCup';
export type TournamentRound = 'roundOf16' | 'quarterFinals' | 'semiFinals' | 'finals';

export interface GameSettings {
  mode: GameMode;
  theme: GameTheme;
  subject: string;
  gradeLevel: number;
  playerCount?: number; // for quick match
  questionCount: number;
  enableTimer: boolean;
  timePerQuestion: number;
}

// Tournament Types
export interface Match {
  id: string;
  matchNumber: number;
  round: TournamentRound;
  participant1: string; // team or player id
  participant2: string;
  winner?: string;
  scores: {
    [participantId: string]: number;
  };
  responses: Response[];
  completed: boolean;
}

export interface TournamentBracket {
  roundOf16?: Match[];
  quarterFinals?: Match[];
  semiFinals?: Match[];
  finals?: Match;
  champion?: string;
}

export interface Tournament {
  id: string;
  name: string;
  theme: GameTheme;
  subject: string;
  gradeLevel: number;
  participantType: 'individual' | 'team';
  participants: (Player | Team)[];
  bracket: TournamentBracket;
  currentMatch?: Match;
  startTime: number;
  endTime?: number;
  questionSet: QuestionSet;
}

// Quick Match Types
export interface QuickMatch {
  id: string;
  theme: GameTheme;
  subject: string;
  gradeLevel: number;
  players: Player[];
  currentQuestionIndex: number;
  questions: Question[];
  responses: Response[];
  startTime: number;
  endTime?: number;
  winner?: string;
}

// Game State
export interface GameState {
  mode: GameMode;
  settings: GameSettings;
  tournament?: Tournament;
  quickMatch?: QuickMatch;
  currentQuestion?: Question;
  isPlaying: boolean;
  isPaused: boolean;
  showResults: boolean;
}

// UI State
export interface LeaderboardEntry {
  id: string;
  name: string;
  score: number;
  correctAnswers: number;
  avatar?: string;
  color?: string;
  isTeam: boolean;
}

export interface AnimationState {
  celebratingPlayerId?: string;
  showConfetti: boolean;
  shakePlayerId?: string;
}

// Storage Types
export interface StoredData {
  students: Student[];
  completedTournaments: Tournament[];
  completedQuickMatches: QuickMatch[];
}

// Export Types
export interface ExportData {
  gameType: 'tournament' | 'quickMatch';
  date: string;
  theme: GameTheme;
  subject: string;
  gradeLevel: number;
  participants: {
    name: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
  }[];
  winner: string;
  responses: Response[];
  duration: number; // in minutes
}
