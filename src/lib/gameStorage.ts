// ─────────────────────────────────────────────────────────────────────────────
// ASTRO-BREAK: Game Storage Utilities
// Handles localStorage for user session, leaderboard, and high scores
// ─────────────────────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  username: string;
  score: number;
  level: number;
  kills: number;
  date: string;
}

const KEYS = {
  USER: 'astrobreak_user',
  LEADERBOARD: 'astrobreak_leaderboard',
} as const;

// ── User Session ──────────────────────────────────────────────────────────────

export function getUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEYS.USER);
}

export function setUser(username: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.USER, username);
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.USER);
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export function getLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEYS.LEADERBOARD);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardEntry[];
  } catch {
    return [];
  }
}


export function saveScore(entry: Omit<LeaderboardEntry, 'date'>): void {
  if (typeof window === 'undefined') return;

  const board = getLeaderboard();

  const existingIndex = board.findIndex(
    (e) => e.username === entry.username
  );

  if (existingIndex !== -1) {
    // Replace ONLY if new score is higher
    if (entry.score > board[existingIndex].score) {
      board[existingIndex] = {
        ...entry,
        date: new Date().toISOString(),
      };
    }
  } else {
    board.push({
      ...entry,
      date: new Date().toISOString(),
    });
  }

  // Sort and keep top 10
  board.sort((a, b) => b.score - a.score);
  localStorage.setItem(KEYS.LEADERBOARD, JSON.stringify(board.slice(0, 10)));
}

export function getPlayerRank(score: number): number {
  const board = getLeaderboard();
  return board.filter((e) => e.score > score).length + 1;
}
