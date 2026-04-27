'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import StarfieldCanvas from '../../home-screen/components/StarfieldCanvas';
import GameOverTitle from './GameOverTitle';
import ScoreDisplay from './ScoreDisplay';
import MiniLeaderboard from './MiniLeaderboard';
import GameOverButtons from './GameOverButtons';
import { getLeaderboard } from '../../../lib/gameStorage';

// Compute rank from real localStorage leaderboard
function computeRank(score: number): number {
  const board = getLeaderboard();
  if (board.length === 0) return 1;
  return board.filter((e) => e.score > score).length + 1;
}

function GameOverInner() {
  const params = useSearchParams();
  const finalScore = parseInt(params.get('score') ?? '0', 10);
  // Support both 'level' (new) and 'wave' (legacy) query params
  const level = parseInt(params.get('level') ?? params.get('wave') ?? '1', 10);
  const kills = parseInt(params.get('kills') ?? '0', 10);
  const rank = computeRank(finalScore);

  return (
    <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4 py-8 overflow-y-auto">
      {/* Top bar */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #ff00aa, #9d00ff, transparent)' }}
      />

      <div className="w-full max-w-sm mx-auto flex flex-col gap-6">
        {/* Title */}
        <GameOverTitle />

        {/* Score display */}
        <ScoreDisplay
          finalScore={finalScore}
          level={level}
          kills={kills}
          rank={rank}
        />

        {/* Divider */}
        <div
          className="h-px w-full"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0, 245, 255, 0.3), transparent)' }}
        />

        {/* Mini leaderboard */}
        <div
          className="fade-up"
          style={{ animationDelay: '1.1s', opacity: 0, animationFillMode: 'forwards' } as React.CSSProperties}
        >
          <MiniLeaderboard playerScore={finalScore} />
        </div>

        {/* Action buttons */}
        <div
          className="fade-up"
          style={{ animationDelay: '1.3s', opacity: 0, animationFillMode: 'forwards' } as React.CSSProperties}
        >
          <GameOverButtons />
        </div>

        {/* Flavor text */}
        <p
          className="font-orbitron text-xs text-text-muted text-center tracking-widest opacity-30 fade-up"
          style={{ animationDelay: '1.5s', animationFillMode: 'forwards' } as React.CSSProperties}
        >
          THE GALAXY AWAITS YOUR RETURN
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, #9d00ff, transparent)' }}
      />

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 opacity-25 pointer-events-none">
        <div className="w-6 h-6 border-t border-l border-neon-magenta" />
      </div>
      <div className="fixed top-4 right-4 opacity-25 pointer-events-none">
        <div className="w-6 h-6 border-t border-r border-neon-magenta" />
      </div>
      <div className="fixed bottom-4 left-4 opacity-25 pointer-events-none">
        <div className="w-6 h-6 border-b border-l border-neon-magenta" />
      </div>
      <div className="fixed bottom-4 right-4 opacity-25 pointer-events-none">
        <div className="w-6 h-6 border-b border-r border-neon-magenta" />
      </div>
    </div>
  );
}

export default function GameOverClient() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-black">
      <StarfieldCanvas />
      <div className="fixed inset-0 z-10 scanlines pointer-events-none opacity-20" />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(255, 0, 170, 0.04) 0%, transparent 70%)',
        }}
      />
      <Suspense
        fallback={
          <div className="fixed inset-0 z-20 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
          </div>
        }
      >
        <GameOverInner />
      </Suspense>
    </div>
  );
}