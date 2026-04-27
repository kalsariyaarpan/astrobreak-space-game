'use client';

import { useEffect, useRef, useState } from 'react';

interface ScoreDisplayProps {
  finalScore: number;
  level: number;
  kills: number;
  rank: number;
}

export default function ScoreDisplay({ finalScore, level, kills, rank }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1800;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.floor(eased * finalScore));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finalScore]);

  const RANK_LABELS: Record<number, { label: string; color: string; glow: string }> = {
    1: { label: '🏆 GALACTIC LEGEND', color: '#ffaa00', glow: 'rgba(255, 170, 0, 0.7)' },
    2: { label: '⚡ STAR PILOT', color: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.7)' },
    3: { label: '🔥 VOID HUNTER', color: '#cd7f32', glow: 'rgba(205, 127, 50, 0.7)' },
  };
  const rankInfo = RANK_LABELS[rank] ?? { label: `RANK #${rank}`, color: '#7ab8c8', glow: 'rgba(122, 184, 200, 0.5)' };

  return (
    <div className="text-center">
      {/* Rank badge */}
      <div
        className="inline-block px-4 py-1.5 rounded-sm mb-4 font-orbitron text-xs tracking-widest fade-up"
        style={{
          color: rankInfo.color,
          border: `1px solid ${rankInfo.color}50`,
          background: `${rankInfo.color}10`,
          textShadow: `0 0 10px ${rankInfo.glow}`,
          boxShadow: `0 0 12px ${rankInfo.color}30`,
          animationDelay: '0.5s',
          opacity: 0,
          animationFillMode: 'forwards',
        } as React.CSSProperties}
      >
        {rankInfo.label}
      </div>

      {/* Score */}
      <div
        className="fade-up"
        style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' } as React.CSSProperties}
      >
        <p className="font-orbitron text-xs text-text-muted tracking-widest mb-1">FINAL SCORE</p>
        <p
          className="font-orbitron font-black tabular-nums"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 5rem)',
            color: '#00f5ff',
            textShadow: '0 0 14px rgba(0, 245, 255, 0.8), 0 0 28px rgba(0, 245, 255, 0.4)',
            lineHeight: 1,
            letterSpacing: '0.05em',
          }}
        >
          {displayScore.toLocaleString()}
        </p>
      </div>

      {/* Stats row */}
      <div
        className="flex items-center justify-center gap-6 mt-5 fade-up"
        style={{ animationDelay: '0.9s', opacity: 0, animationFillMode: 'forwards' } as React.CSSProperties}
      >
        {[
          { id: 'stat-level', label: 'LEVEL REACHED', value: level, color: '#9d00ff' },
          { id: 'stat-kills', label: 'ENEMIES DOWN', value: kills, color: '#ff00aa' },
          { id: 'stat-rank', label: 'LEADERBOARD', value: `#${rank}`, color: '#ffaa00' },
        ].map((stat) => (
          <div key={stat.id} className="text-center">
            <p
              className="font-orbitron font-black text-xl tabular-nums"
              style={{ color: stat.color, textShadow: `0 0 10px ${stat.color}80` }}
            >
              {stat.value}
            </p>
            <p className="font-orbitron text-xs text-text-muted tracking-widest mt-0.5 opacity-60">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}