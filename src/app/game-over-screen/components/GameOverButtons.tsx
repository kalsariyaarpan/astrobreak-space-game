'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GameOverButtons() {
  const router = useRouter();
  const [restarting, setRestarting] = useState(false);

  function handleRestart() {
    setRestarting(true);
    router.push('/game-screen');
  }

  function handleHome() {
    router.push('/home-screen');
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={handleRestart}
        disabled={restarting}
        className="neon-btn w-full py-3.5 rounded-sm font-orbitron text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-3"
        style={{
          background: 'rgba(0, 245, 255, 0.08)',
          border: '1px solid rgba(0, 245, 255, 0.5)',
          color: '#00f5ff',
          opacity: restarting ? 0.6 : 1,
        }}
        onMouseEnter={(e) => {
          if (!restarting) {
            (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(0, 245, 255, 0.5)';
            (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
          (e.currentTarget as HTMLButtonElement).style.transform = '';
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
        }}
      >
        {restarting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            LAUNCHING...
          </span>
        ) : (
          <>
            <span>▶</span>
            <span>PLAY AGAIN</span>
          </>
        )}
      </button>

      <button
        onClick={handleHome}
        className="neon-btn w-full py-3.5 rounded-sm font-orbitron text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-3"
        style={{
          background: 'rgba(255, 0, 170, 0.05)',
          border: '1px solid rgba(255, 0, 170, 0.35)',
          color: '#ff00aa',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 20px rgba(255, 0, 170, 0.4)';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
          (e.currentTarget as HTMLButtonElement).style.transform = '';
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(0.97)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.03)';
        }}
      >
        <span>⌂</span>
        <span>MAIN MENU</span>
      </button>
    </div>
  );
}