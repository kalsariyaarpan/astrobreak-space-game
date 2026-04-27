'use client';
import { useEffect, useRef } from 'react';

export default function NeonTitle() {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Subtle pulsing glow animation via JS for performance
    let t = 0;
    let raf: number;
    const el = titleRef.current;
    if (!el) return;

    function animate() {
      t += 0.02;
      const intensity = 0.7 + Math.sin(t) * 0.3;
      if (el) {
        el.style.textShadow = `
          0 0 ${7 * intensity}px #00f5ff,
          0 0 ${14 * intensity}px #00f5ff,
          0 0 ${28 * intensity}px #00f5ff,
          0 0 ${56 * intensity}px rgba(0, 245, 255, ${0.4 * intensity}),
          0 0 ${100 * intensity}px rgba(0, 245, 255, ${0.15 * intensity})
        `;
      }
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="text-center select-none">
      {/* Subtitle above */}
      <p
        className="font-orbitron text-xs tracking-[0.4em] text-neon-magenta mb-3 opacity-80"
        style={{
          textShadow: '0 0 10px rgba(255, 0, 170, 0.7)',
        }}
      >
        ✦ GALACTIC COMBAT ✦
      </p>

      {/* Main title */}
      <h1
        ref={titleRef}
        className="font-orbitron font-black text-neon-cyan flicker select-none"
        style={{
          fontSize: 'clamp(2.5rem, 7vw, 6rem)',
          letterSpacing: '0.15em',
          lineHeight: 1,
        }}
      >
        ASTRO
        <span
          className="block"
          style={{
            color: '#ffffff',
            textShadow: '0 0 20px rgba(255,255,255,0.3)',
            fontSize: '0.7em',
            letterSpacing: '0.4em',
          }}
        >
          BREAK
        </span>
      </h1>

      {/* Decorative line */}
      <div className="flex items-center justify-center gap-3 mt-4">
        <div
          className="h-px flex-1 max-w-24"
          style={{ background: 'linear-gradient(90deg, transparent, #00f5ff)' }}
        />
        <div
          className="w-2 h-2 rotate-45"
          style={{ background: '#00f5ff', boxShadow: '0 0 8px #00f5ff' }}
        />
        <div
          className="h-px flex-1 max-w-24"
          style={{ background: 'linear-gradient(90deg, #00f5ff, transparent)' }}
        />
      </div>

      <p className="font-orbitron text-xs tracking-widest text-text-muted mt-3 opacity-60">
        v2.4.1 — SEASON III
      </p>
    </div>
  );
}