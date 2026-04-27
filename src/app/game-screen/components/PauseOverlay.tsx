'use client';

interface PauseOverlayProps {
  onResume: () => void;
  onHome: () => void;
  score: number;
}

export default function PauseOverlay({ onResume, onHome, score }: PauseOverlayProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center"
      style={{ background: 'rgba(5, 5, 16, 0.85)', backdropFilter: 'blur(12px)' }}
    >
      <div
        className="w-full max-w-xs mx-4 rounded-sm p-8 text-center fade-up"
        style={{
          background: 'linear-gradient(135deg, rgba(10,10,46,0.97), rgba(5,5,16,0.99))',
          border: '1px solid rgba(0, 245, 255, 0.3)',
          boxShadow: '0 0 40px rgba(0, 245, 255, 0.15)',
        }}
      >
        <h2
          className="font-orbitron font-black text-2xl text-neon-cyan mb-1 tracking-widest"
          style={{ textShadow: '0 0 14px rgba(0, 245, 255, 0.7)' }}
        >
          PAUSED
        </h2>
        <p className="font-orbitron text-xs text-text-muted tracking-widest mb-6">
          SCORE: <span className="text-neon-amber">{score.toLocaleString()}</span>
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onResume}
            className="neon-btn w-full py-3 rounded-sm font-orbitron text-sm tracking-widest text-neon-cyan transition-all duration-200"
            style={{
              background: 'rgba(0, 245, 255, 0.08)',
              border: '1px solid rgba(0, 245, 255, 0.5)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(0, 245, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
            }}
          >
            ▶ RESUME
          </button>
          <button
            onClick={onHome}
            className="neon-btn w-full py-3 rounded-sm font-orbitron text-sm tracking-widest text-text-muted transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            ⌂ MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
}