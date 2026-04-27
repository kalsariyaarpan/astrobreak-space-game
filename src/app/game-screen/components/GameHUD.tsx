'use client';

interface GameHUDProps {
  score: number;
  health: number;
  maxHealth: number;
  level: number;
  kills: number;
  streak: number;
  paused: boolean;
  onPause: () => void;
}

export default function GameHUD({
  score,
  health,
  maxHealth,
  level,
  kills,
  streak,
  paused,
  onPause,
}: GameHUDProps) {
  const healthPct = Math.max(0, (health / maxHealth) * 100);
  const isLowHealth = healthPct <= 30;

  // Streak color: white → yellow → orange → red as streak grows
  const streakColor = streak >= 5 ? '#ff4444' : streak >= 3 ? '#ffaa00' : streak >= 2 ? '#ff8800' : '#00f5ff';
  const streakGlow = streak >= 5 ? 'rgba(255,68,68,0.7)' : streak >= 3 ? 'rgba(255,170,0,0.7)' : streak >= 2 ? 'rgba(255,136,0,0.6)' : 'rgba(0,245,255,0.5)';

  return (
    <div className="fixed inset-0 z-30 pointer-events-none select-none">
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines opacity-30" />

      {/* Top-left: Score */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <div
          className="px-4 py-2.5 rounded-sm"
          style={{
            background: 'rgba(5, 5, 16, 0.75)',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="font-orbitron text-xs text-text-muted tracking-widest mb-0.5">SCORE</p>
          <p
            className="font-orbitron font-black text-neon-cyan tabular-nums"
            style={{
              fontSize: '1.5rem',
              textShadow: '0 0 10px rgba(0, 245, 255, 0.7)',
              lineHeight: 1,
            }}
          >
            {score.toLocaleString()}
          </p>
          {/* Streak indicator */}
          {streak >= 2 && (
            <p
              className="font-orbitron text-xs font-bold mt-1 tracking-wider"
              style={{ color: streakColor, textShadow: `0 0 8px ${streakGlow}` }}
            >
              ×{Math.min(streak, 5)} STREAK{streak >= 5 ? ' MAX!' : '!'}
            </p>
          )}
        </div>
      </div>

      {/* Top-center: Level */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <div
          className="px-5 py-2 rounded-sm text-center"
          style={{
            background: 'rgba(5, 5, 16, 0.75)',
            border: '1px solid rgba(157, 0, 255, 0.35)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <p className="font-orbitron text-xs text-text-muted tracking-widest mb-0.5">LEVEL</p>
          <p
            className="font-orbitron font-black text-neon-purple tabular-nums"
            style={{ fontSize: '1.25rem', textShadow: '0 0 10px rgba(157, 0, 255, 0.7)', lineHeight: 1 }}
          >
            {level}
          </p>
        </div>
      </div>

      {/* Top-right: Health */}
      <div className="absolute top-4 right-4 pointer-events-none">
        <div
          className="px-4 py-2.5 rounded-sm min-w-[140px]"
          style={{
            background: 'rgba(5, 5, 16, 0.75)',
            border: `1px solid ${isLowHealth ? 'rgba(255, 68, 68, 0.5)' : 'rgba(0, 255, 136, 0.3)'}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <p className="font-orbitron text-xs text-text-muted tracking-widest">HULL</p>
            <p
              className="font-orbitron text-xs font-bold tabular-nums"
              style={{ color: isLowHealth ? '#ff4444' : '#00ff88' }}
            >
              {health}%
            </p>
          </div>
          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 health-bar-fill ${isLowHealth ? 'low' : ''}`}
              style={{ width: `${healthPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom-left: Kills */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
        <div
          className="px-3 py-2 rounded-sm"
          style={{
            background: 'rgba(5, 5, 16, 0.65)',
            border: '1px solid rgba(255, 170, 0, 0.25)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <p className="font-orbitron text-xs text-text-muted tracking-widest mb-0.5">KILLS</p>
          <p
            className="font-orbitron font-bold text-neon-amber tabular-nums"
            style={{ fontSize: '1rem', textShadow: '0 0 8px rgba(255, 170, 0, 0.6)', lineHeight: 1 }}
          >
            {kills}
          </p>
        </div>
      </div>

      {/* Bottom-center: Controls hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
        <div
          className="px-4 py-1.5 rounded-sm flex gap-4"
          style={{
            background: 'rgba(5, 5, 16, 0.5)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <span className="font-orbitron text-xs text-text-muted opacity-50 tracking-wider">← → MOVE</span>
          <span className="font-orbitron text-xs text-text-muted opacity-50 tracking-wider">SPACE FIRE</span>
        </div>
      </div>

      {/* Pause button */}
      <button
        className="absolute bottom-4 right-4 pointer-events-auto px-4 py-2 rounded-sm font-orbitron text-xs tracking-widest transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: 'rgba(5, 5, 16, 0.75)',
          border: '1px solid rgba(0, 245, 255, 0.3)',
          color: '#00f5ff',
        }}
        onClick={onPause}
        aria-label="Pause game"
      >
        {paused ? '▶ RESUME' : '⏸ PAUSE'}
      </button>

      {/* Low health warning */}
      {isLowHealth && health > 0 && (
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ animation: 'pulse 1s ease-in-out infinite' }}
        >
          <p
            className="font-orbitron font-black text-xs tracking-widest opacity-60"
            style={{ color: '#ff4444', textShadow: '0 0 20px rgba(255, 68, 68, 0.8)' }}
          >
            ⚠ HULL CRITICAL
          </p>
        </div>
      )}

      {/* Corner decorations */}
      <div className="fixed top-0 left-0 w-16 h-16 opacity-20 pointer-events-none">
        <div className="w-6 h-6 border-t border-l border-neon-cyan m-2" />
      </div>
      <div className="fixed top-0 right-0 w-16 h-16 opacity-20 pointer-events-none">
        <div className="w-6 h-6 border-t border-r border-neon-cyan m-2 ml-auto" />
      </div>
    </div>
  );
}