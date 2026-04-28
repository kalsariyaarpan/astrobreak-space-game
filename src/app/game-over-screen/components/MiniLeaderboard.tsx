'use client';

import { getLeaderboard } from '../../../lib/gameStorage';

const RANK_COLORS = ['#ffaa00', '#c0c0c0', '#cd7f32', '#7ab8c8', '#7ab8c8'];

// Fallback mock scores shown when no real scores exist yet
const MOCK_SCORES = [
  { rank: 1, username: 'NOVA_X', score: 98420, level: 8 },
  { rank: 2, username: 'STELLAR7', score: 87150, level: 7 },
  { rank: 3, username: 'VOID_HAWK', score: 74830, level: 6 },
  { rank: 4, username: 'PULSAR_9', score: 63200, level: 5 },
  { rank: 5, username: 'ZENITH', score: 55640, level: 5 },
];

interface MiniLeaderboardProps {
  playerScore: number;
}

export default function MiniLeaderboard({ playerScore }: MiniLeaderboardProps) {
  const stored = getLeaderboard();

  // Use real data if available, otherwise mock
  const baseEntries = stored.length > 0
    ? stored.map((e, i) => ({ rank: i + 1, username: e.username, score: e.score, level: e.level }))
    : MOCK_SCORES;

  // Get current user for highlighting
  const currentUser = typeof window !== 'undefined' ? localStorage.getItem('astrobreak_user') : null;

  // Merge player's current score into display if not already in board
  const playerAlreadyInBoard = stored.some(
    (e) => e.username === currentUser && e.score === playerScore
  );

 let display = [...baseEntries];

if (currentUser && playerScore > 0) {
  const existing = display.find((e) => e.username === currentUser);

  if (!existing || playerScore > existing.score) {
    display.push({
      rank: 0,
      username: currentUser,
      score: playerScore,
      level: 0,
    });
  }
}

// Sort again
display.sort((a, b) => b.score - a.score);

// Reassign ranks
display = display.map((e, i) => ({
  ...e,
  rank: i + 1,
}));

// Keep top 5
display = display.slice(0, 5);

  return (
    <div
      className="w-full rounded-sm p-4"
      style={{
        background: 'rgba(10, 10, 46, 0.6)',
        border: '1px solid rgba(0, 245, 255, 0.15)',
      }}
    >
      <p className="font-orbitron text-xs text-text-muted tracking-widest mb-3 text-center">
        TOP PILOTS
      </p>
      <div className="space-y-1.5">
        {display.map((entry) => {
          const isPlayer = entry.username === currentUser;
          return (
            <div
              key={`${entry.rank}-${entry.username}-${entry.score}`}
              className="flex items-center gap-3 px-3 py-1.5 rounded-sm transition-all"
              style={{
               background:
  entry.rank === 1
    ? 'rgba(255,170,0,0.12)'   // 🥇 gold highlight
    : isPlayer
    ? 'rgba(0, 245, 255, 0.08)' // 👤 player highlight
    : 'rgba(255,255,255,0.02)',
                border: isPlayer ? '1px solid rgba(0, 245, 255, 0.3)' : '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <span
                className="font-orbitron font-bold text-xs w-5 text-center flex-shrink-0"
                style={{
  color: RANK_COLORS[Math.min(entry.rank - 1, 4)],
  textShadow: entry.rank <= 3 ? '0 0 8px currentColor' : 'none',
}}
              >
                {entry.rank}
              </span>
              <span
                className="font-orbitron text-xs flex-1 tracking-wider"
                style={{ color: isPlayer ? '#00f5ff' : '#e0f7ff' }}
              >
                {entry.username}
                {isPlayer && <span className="ml-1 text-xs opacity-60">(you)</span>}
              </span>
              <span
                className="font-orbitron text-xs font-bold tabular-nums"
                style={{ color: isPlayer ? '#00f5ff' : '#7ab8c8' }}
              >
                {entry.score.toLocaleString()}
              </span>
              {entry.level > 0 && (
                <span className="font-sans text-xs text-text-muted">LV{entry.level}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}