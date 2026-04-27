'use client';
import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  px: number;
  py: number;
}

export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const NUM_STARS = 280;
    const SPEED = 0.8;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function initStars() {
      starsRef.current = Array.from({ length: NUM_STARS }, (_, i) => ({
        x: (Math.random() - 0.5) * (canvas?.width ?? 1920),
        y: (Math.random() - 0.5) * (canvas?.height ?? 1080),
        z: Math.random() * (canvas?.width ?? 1920),
        px: 0,
        py: 0,
      }));
    }

    function drawStars() {
      if (!canvas || !ctx) return;
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep space gradient background
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(canvas.width, canvas.height) * 0.7);
      bg.addColorStop(0, '#0a0a2e');
      bg.addColorStop(0.5, '#07071a');
      bg.addColorStop(1, '#050510');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        star.px = star.x / (star.z * 0.001) + cx;
        star.py = star.y / (star.z * 0.001) + cy;
        star.z -= SPEED;

        if (star.z <= 0 || star.px < 0 || star.px > canvas.width || star.py < 0 || star.py > canvas.height) {
          star.x = (Math.random() - 0.5) * canvas.width;
          star.y = (Math.random() - 0.5) * canvas.height;
          star.z = canvas.width;
          star.px = star.x / (star.z * 0.001) + cx;
          star.py = star.y / (star.z * 0.001) + cy;
        }

        const size = Math.max(0.2, (1 - star.z / canvas.width) * 2.5);
        const brightness = Math.floor((1 - star.z / canvas.width) * 255);
        const hue = star.z < canvas.width * 0.3 ? `rgba(0, 245, 255, ${(1 - star.z / canvas.width) * 0.9})` : `rgba(${brightness}, ${brightness}, ${Math.min(255, brightness + 60)}, ${(1 - star.z / canvas.width) * 0.8})`;

        ctx.beginPath();
        ctx.arc(star.px, star.py, size, 0, Math.PI * 2);
        ctx.fillStyle = hue;
        ctx.fill();

        // Glow for bright stars
        if (size > 1.5) {
          ctx.beginPath();
          ctx.arc(star.px, star.py, size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 245, 255, 0.08)`;
          ctx.fill();
        }
      });

      rafRef.current = requestAnimationFrame(drawStars);
    }

    resize();
    initStars();
    drawStars();

    window.addEventListener('resize', () => { resize(); initStars(); });
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="starfield-canvas"
      aria-hidden="true"
    />
  );
}