'use client';

import { useEffect, useRef } from 'react';

export default function GameOverTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let t = 0;
    let raf: number;
    const el = titleRef.current;
    if (!el) return;

    function animate() {
      t += 0.025;
      const flicker = Math.random() > 0.97 ? 0.6 : 1;
      const intensity = (0.7 + Math.sin(t) * 0.3) * flicker;
      if (el) {
        el.style.textShadow = `
          0 0 ${8 * intensity}px #ff00aa,
          0 0 ${16 * intensity}px #ff00aa,
          0 0 ${32 * intensity}px #ff00aa,
          0 0 ${64 * intensity}px rgba(255, 0, 170, ${0.4 * intensity})
        `;
      }
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="text-center glitch-in">
      <h1
        ref={titleRef}
        className="font-orbitron font-black text-neon-magenta tracking-widest"
        style={{
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          letterSpacing: '0.2em',
          lineHeight: 1,
        }}
      >
        GAME
        <span
          className="block"
          style={{
            fontSize: '0.75em',
            letterSpacing: '0.4em',
            color: '#ffffff',
            textShadow: '0 0 16px rgba(255,255,255,0.4)',
          }}
        >
          OVER
        </span>
      </h1>
      {/* Decorative line */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div
          className="h-px flex-1 max-w-20"
          style={{ background: 'linear-gradient(90deg, transparent, #ff00aa)' }}
        />
        <div
          className="w-1.5 h-1.5 rotate-45"
          style={{ background: '#ff00aa', boxShadow: '0 0 8px #ff00aa' }}
        />
        <div
          className="h-px flex-1 max-w-20"
          style={{ background: 'linear-gradient(90deg, #ff00aa, transparent)' }}
        />
      </div>
    </div>
  );
}