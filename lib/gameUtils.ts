import {
  Player,
  Team,
  Question,
  Match,
  TournamentBracket,
  TournamentRound,
  Student
} from '@/types';

// Convert students to players
export function studentsToPlayers(students: Student[]): Player[] {
  return students.map(student => ({
    ...student,
    score: 0,
    correctAnswers: 0,
    streak: 0,
    isActive: true
  }));
}

// Calculate score with bonuses
export function calculateScore(
  isCorrect: boolean,
  basePoints: number,
  streak: number,
  timeBonus: number = 0
): number {
  if (!isCorrect) return 0;

  let score = basePoints;

  // Streak multiplier (max 3x)
  const streakMultiplier = Math.min(1 + (streak * 0.1), 3);
  score *= streakMultiplier;

  // Time bonus
  score += timeBonus;

  return Math.round(score);
}

// Shuffle array
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create tournament bracket
export function createBracket(participantCount: number, participants: (Player | Team)[]): TournamentBracket {
  const shuffledParticipants = shuffle(participants);

  if (participantCount === 16) {
    return createBracketFor16(shuffledParticipants);
  } else if (participantCount === 8) {
    return createBracketFor8(shuffledParticipants);
  } else if (participantCount === 4) {
    return createBracketFor4(shuffledParticipants);
  }

  throw new Error('Invalid participant count. Must be 4, 8, or 16');
}

function createBracketFor16(participants: (Player | Team)[]): TournamentBracket {
  const roundOf16: Match[] = [];

  for (let i = 0; i < 8; i++) {
    roundOf16.push({
      id: `r16-${i + 1}`,
      matchNumber: i + 1,
      round: 'roundOf16',
      participant1: participants[i * 2].id,
      participant2: participants[i * 2 + 1].id,
      scores: {},
      responses: [],
      completed: false
    });
  }

  return {
    roundOf16,
    quarterFinals: createEmptyMatches('quarterFinals', 4),
    semiFinals: createEmptyMatches('semiFinals', 2),
    finals: createEmptyMatch('finals', 1)
  };
}

function createBracketFor8(participants: (Player | Team)[]): TournamentBracket {
  const quarterFinals: Match[] = [];

  for (let i = 0; i < 4; i++) {
    quarterFinals.push({
      id: `qf-${i + 1}`,
      matchNumber: i + 1,
      round: 'quarterFinals',
      participant1: participants[i * 2].id,
      participant2: participants[i * 2 + 1].id,
      scores: {},
      responses: [],
      completed: false
    });
  }

  return {
    quarterFinals,
    semiFinals: createEmptyMatches('semiFinals', 2),
    finals: createEmptyMatch('finals', 1)
  };
}

function createBracketFor4(participants: (Player | Team)[]): TournamentBracket {
  const semiFinals: Match[] = [];

  for (let i = 0; i < 2; i++) {
    semiFinals.push({
      id: `sf-${i + 1}`,
      matchNumber: i + 1,
      round: 'semiFinals',
      participant1: participants[i * 2].id,
      participant2: participants[i * 2 + 1].id,
      scores: {},
      responses: [],
      completed: false
    });
  }

  return {
    semiFinals,
    finals: createEmptyMatch('finals', 1)
  };
}

function createEmptyMatches(round: TournamentRound, count: number): Match[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${round}-${i + 1}`,
    matchNumber: i + 1,
    round,
    participant1: '',
    participant2: '',
    scores: {},
    responses: [],
    completed: false
  }));
}

function createEmptyMatch(round: TournamentRound, matchNumber: number): Match {
  return {
    id: `${round}-${matchNumber}`,
    matchNumber,
    round,
    participant1: '',
    participant2: '',
    scores: {},
    responses: [],
    completed: false
  };
}

// Get next match in bracket
export function getNextMatch(bracket: TournamentBracket): Match | null {
  // Check roundOf16 first
  if (bracket.roundOf16) {
    const nextMatch = bracket.roundOf16.find(m => !m.completed);
    if (nextMatch) return nextMatch;
  }

  // Then quarterFinals
  if (bracket.quarterFinals) {
    const nextMatch = bracket.quarterFinals.find(m => !m.completed && m.participant1 && m.participant2);
    if (nextMatch) return nextMatch;
  }

  // Then semiFinals
  if (bracket.semiFinals) {
    const nextMatch = bracket.semiFinals.find(m => !m.completed && m.participant1 && m.participant2);
    if (nextMatch) return nextMatch;
  }

  // Finally finals
  if (bracket.finals && !bracket.finals.completed && bracket.finals.participant1 && bracket.finals.participant2) {
    return bracket.finals;
  }

  return null;
}

// Advance winner to next round
export function advanceWinner(bracket: TournamentBracket, match: Match, winnerId: string): TournamentBracket {
  const newBracket = { ...bracket };

  if (match.round === 'roundOf16' && newBracket.quarterFinals) {
    const qfIndex = Math.floor((match.matchNumber - 1) / 2);
    const position = (match.matchNumber - 1) % 2;

    if (position === 0) {
      newBracket.quarterFinals[qfIndex].participant1 = winnerId;
    } else {
      newBracket.quarterFinals[qfIndex].participant2 = winnerId;
    }
  } else if (match.round === 'quarterFinals' && newBracket.semiFinals) {
    const sfIndex = Math.floor((match.matchNumber - 1) / 2);
    const position = (match.matchNumber - 1) % 2;

    if (position === 0) {
      newBracket.semiFinals[sfIndex].participant1 = winnerId;
    } else {
      newBracket.semiFinals[sfIndex].participant2 = winnerId;
    }
  } else if (match.round === 'semiFinals' && newBracket.finals) {
    const position = match.matchNumber - 1;

    if (position === 0) {
      newBracket.finals.participant1 = winnerId;
    } else {
      newBracket.finals.participant2 = winnerId;
    }
  } else if (match.round === 'finals') {
    newBracket.champion = winnerId;
  }

  return newBracket;
}

// Format time
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Generate team colors
export const TEAM_COLORS = [
  '#FF0000', // Red
  '#0000FF', // Blue
  '#00FF00', // Green
  '#FFD700', // Gold
  '#FF00FF', // Magenta
  '#00FFFF', // Cyan
  '#FF8C00', // Dark Orange
  '#8B00FF', // Purple
  '#FF1493', // Deep Pink
  '#00FF7F', // Spring Green
  '#FF4500', // Orange Red
  '#4169E1', // Royal Blue
  '#32CD32', // Lime Green
  '#FF69B4', // Hot Pink
  '#1E90FF', // Dodger Blue
  '#FFD700', // Gold
];

export function getTeamColor(index: number): string {
  return TEAM_COLORS[index % TEAM_COLORS.length];
}
