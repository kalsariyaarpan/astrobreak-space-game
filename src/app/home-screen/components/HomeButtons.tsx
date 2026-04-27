'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getLeaderboard } from '../../../lib/gameStorage';

interface NavButton {
  id: string;
  label: string;
  sublabel: string;
  icon: string;
  variant: 'cyan' | 'magenta' | 'amber' | 'ghost';
  action: string;
}

const NAV_BUTTONS: NavButton[] = [
  {
    id: 'btn-start',
    label: 'START GAME',
    sublabel: 'Enter the battle',
    icon: '▶',
    variant: 'cyan',
    action: 'game',
  },
  {
    id: 'btn-leaderboard',
    label: 'LEADERBOARD',
    sublabel: 'Top pilots',
    icon: '◈',
    variant: 'magenta',
    action: 'leaderboard',
  },
  {
    id: 'btn-settings',
    label: 'SETTINGS',
    sublabel: 'Configure controls',
    icon: '⚙',
    variant: 'amber',
    action: 'settings',
  },
  {
    id: 'btn-exit',
    label: 'EXIT',
    sublabel: 'Return to orbit',
    icon: '✕',
    variant: 'ghost',
    action: 'exit',
  },
];

const VARIANT_STYLES: Record<NavButton['variant'], string> = {
  cyan: 'border-neon-cyan/60 text-neon-cyan bg-neon-cyan/5 hover:bg-neon-cyan/15 hover:border-neon-cyan',
  magenta: 'border-neon-magenta/60 text-neon-magenta bg-neon-magenta/5 hover:bg-neon-magenta/15 hover:border-neon-magenta',
  amber: 'border-neon-amber/60 text-neon-amber bg-neon-amber/5 hover:bg-neon-amber/15 hover:border-neon-amber',
  ghost: 'border-white/20 text-text-muted bg-white/3 hover:bg-white/8 hover:border-white/40 hover:text-text-primary',
};

const VARIANT_SHADOWS: Record<NavButton['variant'], string> = {
  cyan: '0 0 20px rgba(0, 245, 255, 0.4), 0 0 40px rgba(0, 245, 255, 0.15)',
  magenta: '0 0 20px rgba(255, 0, 170, 0.4), 0 0 40px rgba(255, 0, 170, 0.15)',
  amber: '0 0 20px rgba(255, 170, 0, 0.4), 0 0 40px rgba(255, 170, 0, 0.15)',
  ghost: '0 0 10px rgba(255, 255, 255, 0.1)',
};

interface HomeButtonsProps {
  username: string;
}

export default function HomeButtons({ username }: HomeButtonsProps) {
  const router = useRouter();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [leaderOpen, setLeaderOpen] = useState(false);

  function handleAction(action: string) {
    switch (action) {
      case 'game': router.push('/game-screen');
        break;
      case 'leaderboard':
        setLeaderOpen(true);
        break;
      case 'settings':
        setSettingsOpen(true);
        break;
      case 'exit':
        // Clear session and go to login
        if (typeof window !== 'undefined') {
          localStorage.removeItem('astrobreak_user');
          router.push('/login');
        }
        break;
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
        {NAV_BUTTONS.map((btn) => (
          <button
            key={btn.id}
            onClick={() => handleAction(btn.action)}
            className={`
              neon-btn w-full px-6 py-3.5 rounded-sm border
              font-orbitron text-sm tracking-widest
              transition-all duration-200
              flex items-center gap-4
              ${VARIANT_STYLES[btn.variant]}
            `}
            style={{ transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = VARIANT_SHADOWS[btn.variant];
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03) translateX(4px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
              (e.currentTarget as HTMLButtonElement).style.transform = '';
            }}
            onMouseDown={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03) translateX(4px)';
            }}
          >
            <span className="text-lg w-6 text-center flex-shrink-0">{btn.icon}</span>
            <span className="flex-1 text-left">
              <span className="block text-sm font-bold">{btn.label}</span>
              <span className="block text-xs opacity-50 font-sans font-normal normal-case tracking-normal mt-0.5">
                {btn.sublabel}
              </span>
            </span>
            <span className="opacity-30 text-xs">›</span>
          </button>
        ))}
      </div>

      {/* Inline Leaderboard Modal */}
      {leaderOpen && (
        <LeaderboardModal currentUser={username} onClose={() => setLeaderOpen(false)} />
      )}

      {/* Inline Settings Modal */}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </>
  );
}

/* ── Leaderboard Modal ── */
const RANK_COLORS = ['#ffaa00', '#c0c0c0', '#cd7f32', '#7ab8c8', '#7ab8c8'];

function LeaderboardModal({ currentUser, onClose }: { currentUser: string; onClose: () => void }) {
  // Load real scores from localStorage, fall back to mock data if empty
  const stored = getLeaderboard();

  const MOCK_SCORES = [
    { rank: 1, username: 'NOVA_X', score: 98420, level: 8 },
    { rank: 2, username: 'STELLAR7', score: 87150, level: 7 },
    { rank: 3, username: 'VOID_HAWK', score: 74830, level: 6 },
    { rank: 4, username: 'PULSAR_9', score: 63200, level: 5 },
    { rank: 5, username: 'ZENITH', score: 55640, level: 5 },
    { rank: 6, username: 'ORION_K', score: 48910, level: 4 },
    { rank: 7, username: 'QUASAR', score: 41270, level: 4 },
    { rank: 8, username: 'NEBULA_5', score: 36580, level: 3 },
  ];

  const entries = stored.length > 0
    ? stored.map((e, i) => ({ rank: i + 1, username: e.username, score: e.score, level: e.level }))
    : MOCK_SCORES;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5, 5, 16, 0.9)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md mx-4 rounded-sm p-6 fade-up"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,46,0.95), rgba(5,5,16,0.98))',
          border: '1px solid rgba(0, 245, 255, 0.3)',
          boxShadow: '0 0 40px rgba(0, 245, 255, 0.15), 0 0 80px rgba(0, 245, 255, 0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-orbitron font-bold text-neon-cyan text-lg tracking-widest"
            style={{ textShadow: '0 0 14px rgba(0, 245, 255, 0.7)' }}
          >
            LEADERBOARD
          </h2>
          <button
            onClick={onClose}
            className="font-orbitron text-text-muted hover:text-neon-cyan text-sm transition-colors"
          >
            [CLOSE]
          </button>
        </div>

        <div className="space-y-2">
          {entries.map((entry) => {
            const isCurrentUser = entry.username === currentUser;
            return (
              <div
                key={`lb-${entry.rank}-${entry.username}`}
                className="flex items-center gap-3 px-3 py-2 rounded-sm transition-all duration-150"
                style={{
                  background: isCurrentUser
                    ? 'rgba(0, 245, 255, 0.08)'
                    : entry.rank <= 3
                    ? 'rgba(255, 170, 0, 0.05)'
                    : 'rgba(255,255,255,0.03)',
                  border: isCurrentUser
                    ? '1px solid rgba(0, 245, 255, 0.35)'
                    : `1px solid ${entry.rank <= 3 ? 'rgba(255,170,0,0.2)' : 'rgba(255,255,255,0.06)'}`,
                }}
              >
                <span
                  className="font-orbitron font-bold text-sm w-6 text-center"
                  style={{ color: RANK_COLORS[Math.min(entry.rank - 1, 4)] }}
                >
                  {entry.rank}
                </span>
                <span
                  className="font-orbitron text-xs flex-1 tracking-wider"
                  style={{ color: isCurrentUser ? '#00f5ff' : '#e0f7ff' }}
                >
                  {entry.username}
                  {isCurrentUser && <span className="ml-1 opacity-60 text-xs">(you)</span>}
                </span>
                <span className="font-orbitron text-sm font-bold text-neon-cyan tabular-nums">
                  {entry.score.toLocaleString()}
                </span>
                <span className="font-sans text-xs text-text-muted">
                  LV{entry.level}
                </span>
              </div>
            );
          })}
        </div>

        {stored.length === 0 && (
          <p className="font-orbitron text-xs text-text-muted text-center mt-3 opacity-40">
            PLAY A GAME TO APPEAR ON THE BOARD
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Settings Modal ── */
function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(5, 5, 16, 0.9)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm mx-4 rounded-sm p-6 fade-up"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,46,0.95), rgba(5,5,16,0.98))',
          border: '1px solid rgba(255, 0, 170, 0.3)',
          boxShadow: '0 0 40px rgba(255, 0, 170, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="font-orbitron font-bold text-neon-magenta text-lg tracking-widest"
            style={{ textShadow: '0 0 14px rgba(255, 0, 170, 0.7)' }}
          >
            SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="font-orbitron text-text-muted hover:text-neon-magenta text-sm transition-colors"
          >
            [CLOSE]
          </button>
        </div>

        <div className="space-y-4">
          {/* Controls reference */}
          <div
            className="p-4 rounded-sm"
            style={{ background: 'rgba(255, 0, 170, 0.04)', border: '1px solid rgba(255, 0, 170, 0.15)' }}
          >
            <p className="font-orbitron text-xs text-neon-magenta tracking-widest mb-3 opacity-80">CONTROLS</p>
            <div className="space-y-2">
              {[
                { key: '← →', action: 'Move ship' },
                { key: 'SPACE', action: 'Fire weapon' },
                { key: 'ESC', action: 'Pause game' },
              ].map((ctrl) => (
                <div key={ctrl.key} className="flex items-center justify-between">
                  <span
                    className="font-orbitron text-xs px-2 py-0.5 rounded"
                    style={{ background: 'rgba(255,255,255,0.08)', color: '#e0f7ff', border: '1px solid rgba(255,255,255,0.15)' }}
                  >
                    {ctrl.key}
                  </span>
                  <span className="font-sans text-xs text-text-muted opacity-70">{ctrl.action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Level info */}
          <div
            className="p-4 rounded-sm"
            style={{ background: 'rgba(157, 0, 255, 0.04)', border: '1px solid rgba(157, 0, 255, 0.15)' }}
          >
            <p className="font-orbitron text-xs text-neon-purple tracking-widest mb-3 opacity-80">DIFFICULTY LEVELS</p>
            <div className="space-y-1.5">
              {[
                { lv: 'LV 1', desc: 'Slow scouts — 10 kills to advance' },
                { lv: 'LV 2', desc: 'Faster enemies — 20 kills to advance' },
                { lv: 'LV 3+', desc: 'All types, max speed, streak bonuses' },
              ].map((info) => (
                <div key={info.lv} className="flex items-start gap-3">
                  <span className="font-orbitron text-xs text-neon-purple opacity-80 w-10 flex-shrink-0">{info.lv}</span>
                  <span className="font-sans text-xs text-text-muted opacity-70">{info.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 font-orbitron text-xs tracking-widest transition-all duration-200"
          style={{
            background: 'rgba(255, 0, 170, 0.06)',
            border: '1px solid rgba(255, 0, 170, 0.3)',
            color: '#ff00aa',
            borderRadius: '2px',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(255, 0, 170, 0.3)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
          }}
        >
          CLOSE
        </button>
      </div>
    </div>
  );
}