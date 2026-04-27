'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import GameHUD from './GameHUD';
import PauseOverlay from './PauseOverlay';

// Dynamically import Phaser game to avoid SSR issues
const PhaserGame = dynamic(() => import('./PhaserGame'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-space-black flex items-center justify-center z-20">
      <div className="text-center">
        <div className="w-16 h-16 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-orbitron text-neon-cyan text-sm tracking-widest">INITIALIZING...</p>
      </div>
    </div>
  ),
});

export default function GameClient() {
  const router = useRouter();
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(100);
  const [level, setLevel] = useState(1);
  const [kills, setKills] = useState(0);
  const [streak, setStreak] = useState(0);
  const [paused, setPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const handleGameOver = useCallback((finalScore: number, finalLevel: number, finalKills: number) => {
    setGameOver(true);
    router.push(`/game-over-screen?score=${finalScore}&level=${finalLevel}&kills=${finalKills}`);
  }, [router]);

  const handlePause = useCallback(() => {
    setPaused((p) => !p);
  }, []);

  const handleHome = useCallback(() => {
    router.push('/home-screen');
  }, [router]);

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-space-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-space-black overflow-hidden">
      {/* Phaser Game Canvas */}
      <PhaserGame
        onScoreUpdate={setScore}
        onHealthUpdate={setHealth}
        onLevelUpdate={setLevel}
        onKillsUpdate={setKills}
        onStreakUpdate={setStreak}
        onGameOver={handleGameOver}
        isPaused={paused}
      />

      {/* HUD Overlay */}
      <GameHUD
        score={score}
        health={health}
        maxHealth={100}
        level={level}
        kills={kills}
        streak={streak}
        paused={paused}
        onPause={handlePause}
      />

      {/* Pause Overlay */}
      {paused && (
        <PauseOverlay
          onResume={() => setPaused(false)}
          onHome={handleHome}
          score={score}
        />
      )}
    </div>
  );
}