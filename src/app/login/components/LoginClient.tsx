'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import StarfieldCanvas from '../../home-screen/components/StarfieldCanvas';

export default function LoginClient() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-login if session exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('astrobreak_user');
      if (stored) {
        router.replace('/home-screen');
      }
    }
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = username.trim().toUpperCase().replace(/[^A-Z0-9_]/g, '');
    if (!trimmed || trimmed.length < 2) {
      setError('PILOT NAME MUST BE AT LEAST 2 CHARACTERS');
      return;
    }
    if (trimmed.length > 12) {
      setError('PILOT NAME MAX 12 CHARACTERS');
      return;
    }
    setLoading(true);
    setError('');
    // Store user session
    localStorage.setItem('astrobreak_user', trimmed);
    setTimeout(() => {
      router.push('/home-screen');
    }, 400);
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-black">
      <StarfieldCanvas />
      <div className="fixed inset-0 z-10 scanlines pointer-events-none" />
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(157, 0, 255, 0.06) 0%, transparent 70%)',
        }}
      />

      {/* Top bar */}
      <div
        className="fixed top-0 left-0 right-0 h-px z-20"
        style={{ background: 'linear-gradient(90deg, transparent, #9d00ff, #00f5ff, #ff00aa, transparent)' }}
      />

      {/* Corner decorations */}
      <div className="fixed top-4 left-4 opacity-30 pointer-events-none z-20">
        <div className="w-6 h-6 border-t border-l border-neon-cyan" />
      </div>
      <div className="fixed top-4 right-4 opacity-30 pointer-events-none z-20">
        <div className="w-6 h-6 border-t border-r border-neon-cyan" />
      </div>
      <div className="fixed bottom-4 left-4 opacity-30 pointer-events-none z-20">
        <div className="w-6 h-6 border-b border-l border-neon-cyan" />
      </div>
      <div className="fixed bottom-4 right-4 opacity-30 pointer-events-none z-20">
        <div className="w-6 h-6 border-b border-r border-neon-cyan" />
      </div>

      <div className="relative z-20 flex flex-col items-center justify-center w-full h-full px-4">
        {/* Logo */}
        <div className="mb-8 text-center fade-up" style={{ animationDelay: '0.05s' }}>
          <p
            className="font-orbitron text-xs tracking-[0.4em] text-neon-magenta mb-2 opacity-80"
            style={{ textShadow: '0 0 10px rgba(255, 0, 170, 0.7)' }}
          >
            ✦ GALACTIC COMBAT ✦
          </p>
          <h1
            className="font-orbitron font-black text-neon-cyan"
            style={{
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              letterSpacing: '0.15em',
              textShadow: '0 0 10px #00f5ff, 0 0 20px #00f5ff, 0 0 40px rgba(0,245,255,0.4)',
            }}
          >
            ASTRO-BREAK
          </h1>
        </div>

        {/* Login card */}
        <div
          className="w-full max-w-sm fade-up"
          style={{
            animationDelay: '0.15s',
            background: 'linear-gradient(135deg, rgba(10,10,46,0.95), rgba(5,5,16,0.98))',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            boxShadow: '0 0 40px rgba(0, 245, 255, 0.1), 0 0 80px rgba(0, 245, 255, 0.04)',
            borderRadius: '2px',
            padding: '2rem',
          }}
        >
          <div className="text-center mb-6">
            {/* Ship icon */}
            <div className="flex justify-center mb-4 opacity-70">
              <svg width="40" height="40" viewBox="0 0 60 60" fill="none">
                <polygon points="30,2 50,50 30,42 10,50" fill="#00f5ff" opacity="0.9" />
                <polygon points="30,42 10,50 14,38" fill="#9d00ff" opacity="0.7" />
                <polygon points="30,42 50,50 46,38" fill="#9d00ff" opacity="0.7" />
              </svg>
            </div>
            <h2
              className="font-orbitron font-bold text-neon-cyan text-base tracking-widest"
              style={{ textShadow: '0 0 10px rgba(0, 245, 255, 0.6)' }}
            >
              PILOT IDENTIFICATION
            </h2>
            <p className="font-orbitron text-xs text-text-muted tracking-wider mt-1 opacity-60">
              ENTER YOUR CALLSIGN TO BEGIN
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="font-orbitron text-xs text-text-muted tracking-widest block mb-2 opacity-70">
                PILOT NAME
              </label>
              <input
                ref={inputRef}
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
                }}
                placeholder="E.G. NOVA_X"
                maxLength={12}
                autoFocus
                className="w-full px-4 py-3 font-orbitron text-sm tracking-widest outline-none transition-all duration-200"
                style={{
                  background: 'rgba(0, 245, 255, 0.04)',
                  border: error ? '1px solid rgba(255, 68, 68, 0.7)' : '1px solid rgba(0, 245, 255, 0.3)',
                  color: '#00f5ff',
                  borderRadius: '2px',
                  caretColor: '#00f5ff',
                }}
                onFocus={(e) => {
                  if (!error) e.currentTarget.style.border = '1px solid rgba(0, 245, 255, 0.7)';
                  e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 245, 255, 0.15)';
                }}
                onBlur={(e) => {
                  if (!error) e.currentTarget.style.border = '1px solid rgba(0, 245, 255, 0.3)';
                  e.currentTarget.style.boxShadow = '';
                }}
              />
              {error && (
                <p className="font-orbitron text-xs mt-1.5" style={{ color: '#ff4444' }}>
                  ⚠ {error}
                </p>
              )}
              <p className="font-orbitron text-xs text-text-muted mt-1 opacity-40 tracking-wider">
                LETTERS, NUMBERS & UNDERSCORE ONLY
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="neon-btn w-full py-3.5 font-orbitron text-sm tracking-widest transition-all duration-200 flex items-center justify-center gap-3"
              style={{
                background: loading ? 'rgba(0, 245, 255, 0.04)' : 'rgba(0, 245, 255, 0.08)',
                border: '1px solid rgba(0, 245, 255, 0.5)',
                color: '#00f5ff',
                borderRadius: '2px',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(0, 245, 255, 0.5)';
                  (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '';
                (e.currentTarget as HTMLButtonElement).style.transform = '';
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                  LAUNCHING...
                </span>
              ) : (
                <>
                  <span>▶</span>
                  <span>ENTER COCKPIT</span>
                </>
              )}
            </button>
          </form>
        </div>

        <p
          className="font-orbitron text-xs text-text-muted text-center mt-6 opacity-30 tracking-widest fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          NO PASSWORD REQUIRED — CALLSIGN IS YOUR IDENTITY
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 h-px z-20"
        style={{ background: 'linear-gradient(90deg, transparent, #ff00aa, #9d00ff, #00f5ff, transparent)' }}
      />
    </div>
  );
}
