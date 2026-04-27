'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StarfieldCanvas from './StarfieldCanvas';
import NeonTitle from './NeonTitle';
import HomeButtons from './HomeButtons';

export default function HomeClient() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('astrobreak_user');
    if (!stored) {
      // No session — redirect to login
      router?.replace('/login');
      return;
    }
    setUsername(stored);
  }, [router]);

  // Don't render until mounted (avoids hydration mismatch)
  if (!mounted || username === null) {
    return (
      <div className="fixed inset-0 bg-space-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-black">
      {/* Animated starfield background */}
      <StarfieldCanvas />

      {/* Scanlines overlay */}
      <div className="fixed inset-0 z-10 scanlines pointer-events-none" />

      {/* Ambient radial glow at center */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 245, 255, 0.04) 0%, transparent 70%)',
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4">
        {/* Decorative top bar */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #00f5ff, #9d00ff, #ff00aa, transparent)' }}
        />

        {/* Pilot badge — top right */}
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-sm fade-up"
          style={{
            background: 'rgba(5, 5, 16, 0.8)',
            border: '1px solid rgba(0, 245, 255, 0.25)',
            backdropFilter: 'blur(8px)',
            animationDelay: '0.1s',
          }}
        >
          <p className="font-orbitron text-xs text-text-muted tracking-widest opacity-60">PILOT</p>
          <p
            className="font-orbitron font-bold text-neon-cyan text-sm tracking-wider"
            style={{ textShadow: '0 0 8px rgba(0, 245, 255, 0.6)' }}
          >
            {username}
          </p>
        </div>

        {/* Ship silhouette decoration */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-10 pointer-events-none select-none">
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
            <polygon points="30,2 50,50 30,42 10,50" fill="#00f5ff" />
            <polygon points="30,42 10,50 14,38" fill="#9d00ff" opacity="0.7" />
            <polygon points="30,42 50,50 46,38" fill="#9d00ff" opacity="0.7" />
          </svg>
        </div>

        {/* Title section */}
        <div className="mb-10 fade-up" style={{ animationDelay: '0.1s' }}>
          <NeonTitle />
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs fade-up" style={{ animationDelay: '0.25s' }}>
          <HomeButtons username={username} />
        </div>

        {/* Bottom decorative info bar */}
        <div
          className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-6 px-8 fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          <span className="font-orbitron text-xs text-text-muted tracking-widest opacity-40">
            ← / → MOVE
          </span>
          <div className="w-px h-4 bg-text-muted opacity-20" />
          <span className="font-orbitron text-xs text-text-muted tracking-widest opacity-40">
            SPACE SHOOT
          </span>
          <div className="w-px h-4 bg-text-muted opacity-20" />
          <span className="font-orbitron text-xs text-text-muted tracking-widest opacity-40">
            ESC PAUSE
          </span>
        </div>

        {/* Corner decorations */}
        <div className="fixed top-4 left-4 opacity-30 pointer-events-none">
          <div className="w-6 h-6 border-t border-l border-neon-cyan" />
        </div>
        <div className="fixed top-4 right-4 opacity-30 pointer-events-none">
          <div className="w-6 h-6 border-t border-r border-neon-cyan" />
        </div>
        <div className="fixed bottom-4 left-4 opacity-30 pointer-events-none">
          <div className="w-6 h-6 border-b border-l border-neon-cyan" />
        </div>
        <div className="fixed bottom-4 right-4 opacity-30 pointer-events-none">
          <div className="w-6 h-6 border-b border-r border-neon-cyan" />
        </div>

        {/* Decorative bottom bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #ff00aa, #9d00ff, #00f5ff, transparent)' }}
        />
      </div>
    </div>
  );
}