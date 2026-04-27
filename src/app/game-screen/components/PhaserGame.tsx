'use client';

import { useEffect, useRef, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// ASTRO-BREAK: PhaserGame Component
// Full game logic: levels, streak bonuses, health system, leaderboard save
// ─────────────────────────────────────────────────────────────────────────────

interface PhaserGameProps {
  onScoreUpdate: (score: number) => void;
  onHealthUpdate: (health: number) => void;
  onLevelUpdate: (level: number) => void;
  onKillsUpdate: (kills: number) => void;
  onStreakUpdate: (streak: number) => void;
  onGameOver: (finalScore: number, finalLevel: number, finalKills: number) => void;
  isPaused: boolean;
}

export default function PhaserGame({
  onScoreUpdate,
  onHealthUpdate,
  onLevelUpdate,
  onKillsUpdate,
  onStreakUpdate,
  onGameOver,
  isPaused,
}: PhaserGameProps) {
  const gameRef = useRef<unknown>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(isPaused);
  const gameOverFiredRef = useRef(false);

  isPausedRef.current = isPaused;

  const startGame = useCallback(async () => {
    if (gameRef.current || !containerRef.current) return;

    const Phaser = (await import('phaser')).default;

    // ─────────────────────────────────────────────
    // SCENE: GameScene
    // ─────────────────────────────────────────────
    class GameScene extends Phaser.Scene {
      // Player
      private player!: Phaser.GameObjects.Container;
      private playerBody!: Phaser.GameObjects.Graphics;
      private playerHitbox!: Phaser.GameObjects.Rectangle;
      private playerX = 0;
      private playerY = 0;
      private playerSpeed = 320;
      private playerInvincible = false;
      private playerInvincibleTimer = 0;

      // Bullets
      private bullets!: Phaser.GameObjects.Group;
      private bulletCooldown = 0;
      private readonly BULLET_COOLDOWN = 180; // ms

      // Enemies
      private enemies!: Phaser.GameObjects.Group;
      private enemyBullets!: Phaser.GameObjects.Group;
      private spawnTimer = 0;
      private spawnInterval = 1800;

      // State
      private score = 0;
      private health = 100;       // 100-point health system
      private maxHealth = 100;
      private level = 1;
      private kills = 0;
      private streak = 0;         // consecutive kills without taking damage
      private streakTimer = 0;    // streak reset timer (ms)
      private readonly STREAK_TIMEOUT = 3000; // streak resets after 3s no kill

      // Level thresholds: kills needed to advance each level
      private readonly LEVEL_THRESHOLDS = [0, 10, 25, 45, 70, 100, 140, 185, 240, 300];

      // Level-up display
      private levelUpText: Phaser.GameObjects.Text | null = null;
      private levelUpTimer = 0;

      // Input
      private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
      private spaceKey!: Phaser.Input.Keyboard.Key;
      private escKey!: Phaser.Input.Keyboard.Key;
      private isTouchingLeft = false;
      private isTouchingRight = false;

      // Particles & effects
      private stars: Array<{ x: number; y: number; speed: number; size: number; brightness: number }> = [];
      private explosionParticles: Array<{
        x: number; y: number; vx: number; vy: number;
        life: number; maxLife: number; color: number; size: number;
      }> = [];

      // Persistent graphics
      private _bgGfx: Phaser.GameObjects.Graphics | null = null;
      private _particleGfx: Phaser.GameObjects.Graphics | null = null;

      constructor() {
        super({ key: 'GameScene' });
      }

      create() {
        const W = this.scale.width;
        const H = this.scale.height;

        gameOverFiredRef.current = false;

        // ── Starfield ──
        for (let i = 0; i < 180; i++) {
          this.stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            speed: 0.3 + Math.random() * 1.2,
            size: Math.random() * 1.8 + 0.3,
            brightness: 0.3 + Math.random() * 0.7,
          });
        }

        // ── Input ──
        this.cursors = this.input.keyboard!.createCursorKeys();
        this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);

        // ── Groups ──
        this.bullets = this.add.group();
        this.enemies = this.add.group();
        this.enemyBullets = this.add.group();

        // ── Player ──
        this.playerX = W / 2;
        this.playerY = H - 80;
        this.player = this.add.container(this.playerX, this.playerY);
        this.playerBody = this.add.graphics();
        this.drawPlayerShip(this.playerBody);
        this.player.add(this.playerBody);
        this.playerHitbox = this.add.rectangle(0, 0, 32, 32, 0x000000, 0);
        this.player.add(this.playerHitbox);


                // ── Touch Controls ──
        this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
          if (pointer.x < this.scale.width / 2) {
            this.isTouchingLeft = true;
          } else {
            this.isTouchingRight = true;
          }
        });

        this.input.on("pointerup", () => {
          this.isTouchingLeft = false;
          this.isTouchingRight = false;
        });


        // Initial HUD values
        onScoreUpdate(0);
        onHealthUpdate(100);
        onLevelUpdate(1);
        onKillsUpdate(0);
        onStreakUpdate(0);
      }

      // ── Draw player ship ──────────────────────────────────────────────────
      drawPlayerShip(g: Phaser.GameObjects.Graphics) {
        g.clear();
        g.fillStyle(0xff00aa, 0.4);
        g.fillEllipse(0, 22, 18, 10);
        g.fillStyle(0xff6600, 0.9);
        g.fillTriangle(-6, 18, 6, 18, 0, 30);
        g.fillStyle(0xffaa00, 0.7);
        g.fillTriangle(-3, 18, 3, 18, 0, 26);
        g.fillStyle(0x0055aa, 1);
        g.fillTriangle(-16, 10, -4, -10, -4, 14);
        g.fillTriangle(16, 10, 4, -10, 4, 14);
        g.fillStyle(0x0088ff, 0.5);
        g.fillTriangle(-12, 8, -4, -6, -4, 8);
        g.fillTriangle(12, 8, 4, -6, 4, 8);
        g.fillStyle(0x0033cc, 1);
        g.fillTriangle(0, -22, -10, 14, 10, 14);
        g.fillStyle(0x4488ff, 0.6);
        g.fillTriangle(0, -18, -5, 8, 5, 8);
        g.fillStyle(0x00f5ff, 0.9);
        g.fillEllipse(0, -6, 10, 14);
        g.fillStyle(0xffffff, 0.4);
        g.fillEllipse(-2, -9, 4, 6);
        g.fillStyle(0x00f5ff, 1);
        g.fillRect(-1.5, -24, 3, 8);
        g.lineStyle(1, 0x00f5ff, 0.6);
        g.strokeTriangle(0, -22, -10, 14, 10, 14);
      }

      // ── Spawn enemy ───────────────────────────────────────────────────────
      spawnEnemy() {
        const W = this.scale.width;

        // Level-based type weights
        let typeWeights: [number, number, number];
        if (this.level <= 1) typeWeights = [0.8, 0.2, 0];
        else if (this.level <= 2) typeWeights = [0.5, 0.4, 0.1];
        else if (this.level <= 4) typeWeights = [0.35, 0.4, 0.25];
        else typeWeights = [0.2, 0.4, 0.4];

        const rand = Math.random();
        let type: string;
        if (rand < typeWeights[0]) type = 'scout';
        else if (rand < typeWeights[0] + typeWeights[1]) type = 'fighter';
        else type = 'heavy';

        const x = 40 + Math.random() * (W - 80);
        const container = this.add.container(x, -50);
        const g = this.add.graphics();

        // Level-based speed multiplier
        const speedMult = 1 + (this.level - 1) * 0.18;

        let hp = 1;
        let speed = 0;
        let points = 100;
        let size = 20;

        if (type === 'scout') {
          g.fillStyle(0xff2244, 1);
          g.fillTriangle(0, 14, -12, -10, 12, -10);
          g.fillStyle(0xff6688, 0.6);
          g.fillTriangle(0, 10, -6, -6, 6, -6);
          g.fillStyle(0xff0000, 0.9);
          g.fillEllipse(0, -4, 6, 6);
          g.lineStyle(1, 0xff4466, 0.7);
          g.strokeTriangle(0, 14, -12, -10, 12, -10);
          hp = 1; speed = Math.round((90 + this.level * 12) * speedMult); points = 100; size = 14;
        } else if (type === 'fighter') {
          g.fillStyle(0x9900cc, 1);
          g.fillTriangle(0, 18, -16, 0, 0, -18);
          g.fillTriangle(0, 18, 16, 0, 0, -18);
          g.fillStyle(0xcc44ff, 0.5);
          g.fillTriangle(0, 10, -8, 0, 0, -10);
          g.fillTriangle(0, 10, 8, 0, 0, -10);
          g.fillStyle(0xff00ff, 0.8);
          g.fillEllipse(0, 0, 8, 8);
          g.lineStyle(1, 0xcc00ff, 0.8);
          g.strokeTriangle(0, 18, -16, 0, 0, -18);
          g.strokeTriangle(0, 18, 16, 0, 0, -18);
          hp = 2; speed = Math.round((60 + this.level * 8) * speedMult); points = 250; size = 18;
        } else {
          // heavy
          for (let i = 0; i < 6; i++) {
            const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
            g.fillStyle(0xff6600, 1);
            g.fillTriangle(0, 0, Math.cos(a1) * 22, Math.sin(a1) * 22, Math.cos(a2) * 22, Math.sin(a2) * 22);
          }
          for (let i = 0; i < 6; i++) {
            const a1 = (i / 6) * Math.PI * 2 - Math.PI / 2;
            const a2 = ((i + 1) / 6) * Math.PI * 2 - Math.PI / 2;
            g.fillStyle(0xff9933, 0.5);
            g.fillTriangle(0, 0, Math.cos(a1) * 14, Math.sin(a1) * 14, Math.cos(a2) * 14, Math.sin(a2) * 14);
          }
          g.fillStyle(0xffcc00, 0.9);
          g.fillEllipse(0, 0, 10, 10);
          g.lineStyle(1.5, 0xff8800, 0.8);
          g.strokeCircle(0, 0, 22);
          hp = 3; speed = Math.round((40 + this.level * 5) * speedMult); points = 500; size = 24;
        }

        container.add(g);
        const hitbox = this.add.rectangle(0, 0, size * 2, size * 2, 0x000000, 0);
        container.add(hitbox);

        type EnemyContainer = Phaser.GameObjects.Container & {
          hp: number; maxHp: number; speed: number; points: number; enemyType: string;
          hitbox: Phaser.GameObjects.Rectangle; shootTimer: number; shootInterval: number;
        };

        const ec = container as EnemyContainer;
        ec.hp = hp;
        ec.maxHp = hp;
        ec.speed = speed;
        ec.points = points;
        ec.enemyType = type;
        ec.hitbox = hitbox;
        ec.shootTimer = Math.random() * 2000;
        ec.shootInterval = type === 'heavy' ? 1800 : type === 'fighter' ? 2500 : 9999;

        this.enemies.add(container);
      }

      // ── Fire player bullet ────────────────────────────────────────────────
      fireBullet() {
        const g = this.add.graphics();
        g.fillStyle(0x00f5ff, 1);
        g.fillRect(-2, -10, 4, 12);
        g.fillStyle(0xffffff, 0.9);
        g.fillEllipse(0, -10, 4, 5);
        g.fillStyle(0x00f5ff, 0.3);
        g.fillEllipse(0, -6, 8, 16);
        g.setPosition(this.playerX, this.playerY - 24);
        (g as Phaser.GameObjects.Graphics & { vy: number }).vy = -600;
        this.bullets.add(g);
      }

      // ── Fire enemy bullet ─────────────────────────────────────────────────
      fireEnemyBullet(enemy: Phaser.GameObjects.Container) {
        const g = this.add.graphics();
        g.fillStyle(0xff4466, 1);
        g.fillRect(-2, -6, 4, 10);
        g.fillStyle(0xff8899, 0.9);
        g.fillEllipse(0, -6, 5, 5);
        g.fillStyle(0xff0033, 0.3);
        g.fillEllipse(0, 0, 8, 14);
        g.setPosition(enemy.x, enemy.y + 20);
        (g as Phaser.GameObjects.Graphics & { vy: number }).vy = 260 + this.level * 15;
        this.enemyBullets.add(g);
      }

      // ── Explosion particles ───────────────────────────────────────────────
      spawnExplosion(x: number, y: number, color: number, count: number) {
        for (let i = 0; i < count; i++) {
          const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
          let speed = 60 + Math.random() * 140;
          this.explosionParticles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0.6 + Math.random() * 0.5,
            maxLife: 0.6 + Math.random() * 0.5,
            color,
            size: 1.5 + Math.random() * 3.5,
          });
        }
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          this.explosionParticles.push({
            x, y,
            vx: Math.cos(angle) * 40,
            vy: Math.sin(angle) * 40,
            life: 0.3,
            maxLife: 0.3,
            color: 0xffffff,
            size: 2,
          });
        }
      }

      // ── Show level-up text ────────────────────────────────────────────────
      showLevelUp() {
        const W = this.scale.width;
        const H = this.scale.height;

        if (this.levelUpText) {
          this.levelUpText.destroy();
          this.levelUpText = null;
        }

        this.levelUpText = this.add.text(W / 2, H / 2 - 40, `LEVEL ${this.level}`, {
          fontFamily: 'Orbitron, monospace',
          fontSize: '36px',
          color: '#00f5ff',
          stroke: '#000000',
          strokeThickness: 4,
          shadow: { offsetX: 0, offsetY: 0, color: '#00f5ff', blur: 20, fill: true },
        }).setOrigin(0.5).setDepth(100).setAlpha(0);

        const subText = this.add.text(W / 2, H / 2 + 10, 'LEVEL UP!', {
          fontFamily: 'Orbitron, monospace',
          fontSize: '18px',
          color: '#ffaa00',
          stroke: '#000000',
          strokeThickness: 3,
          shadow: { offsetX: 0, offsetY: 0, color: '#ffaa00', blur: 14, fill: true },
        }).setOrigin(0.5).setDepth(100).setAlpha(0);

        // Animate in
        this.tweens.add({
          targets: [this.levelUpText, subText],
          alpha: 1,
          y: '-=20',
          duration: 400,
          ease: 'Power2',
          onComplete: () => {
            this.time.delayedCall(1200, () => {
              this.tweens.add({
                targets: [this.levelUpText, subText],
                alpha: 0,
                y: '-=20',
                duration: 500,
                ease: 'Power2',
                onComplete: () => {
                  this.levelUpText?.destroy();
                  subText.destroy();
                  this.levelUpText = null;
                },
              });
            });
          },
        });
      }

      // ── Main update loop ──────────────────────────────────────────────────
      update(time: number, delta: number) {
        if (isPausedRef.current) return;
        if (this.health <= 0) return;

        const dt = delta / 1000;
        const W = this.scale.width;
        const H = this.scale.height;

        // ── Streak timeout ──
        if (this.streak > 0) {
          this.streakTimer += delta;
          if (this.streakTimer >= this.STREAK_TIMEOUT) {
            this.streak = 0;
            this.streakTimer = 0;
            onStreakUpdate(0);
          }
        }

        // ── Starfield scroll ──
        for (const star of this.stars) {
          star.y += star.speed;
          if (star.y > H) { star.y = 0; star.x = Math.random() * W; }
        }

        // ── Player movement ──
       if (this.cursors.left.isDown || this.isTouchingLeft) {
  this.playerX -= this.playerSpeed * dt;
} 
else if (this.cursors.right.isDown || this.isTouchingRight) {
  this.playerX += this.playerSpeed * dt;
}
        this.playerX = Phaser.Math.Clamp(this.playerX, 30, W - 30);
        this.player.setPosition(this.playerX, this.playerY);

        if (this.cursors.left.isDown) this.player.setRotation(-0.12);
        else if (this.cursors.right.isDown) this.player.setRotation(0.12);
        else this.player.setRotation(0);

        // ── Shooting ──
        this.bulletCooldown -= delta;
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) || (this.spaceKey.isDown && this.bulletCooldown <= 0)) {
          this.fireBullet();
          this.bulletCooldown = this.BULLET_COOLDOWN;
        }

        // ── Move player bullets ──
        const bulletsToRemove: Phaser.GameObjects.Graphics[] = [];
        this.bullets.getChildren().forEach((b) => {
          const bullet = b as Phaser.GameObjects.Graphics & { vy: number };
          bullet.y += bullet.vy * dt;
          if (bullet.y < -20) bulletsToRemove.push(bullet);
        });
        bulletsToRemove.forEach((b) => { b.destroy(); this.bullets.remove(b); });

        // ── Move enemy bullets ──
        const eBulletsToRemove: Phaser.GameObjects.Graphics[] = [];
        this.enemyBullets.getChildren().forEach((b) => {
          const bullet = b as Phaser.GameObjects.Graphics & { vy: number };
          bullet.y += bullet.vy * dt;
          if (bullet.y > H + 20) eBulletsToRemove.push(bullet);
        });
        eBulletsToRemove.forEach((b) => { b.destroy(); this.enemyBullets.remove(b); });

        // ── Spawn enemies ──
        this.spawnTimer += delta;
        // Spawn interval decreases with level (min 400ms)
        const baseInterval = Math.max(400, 1800 - (this.level - 1) * 160);
        if (this.spawnTimer >= baseInterval) {
          this.spawnEnemy();
          // Higher levels spawn multiple enemies at once
          if (this.level >= 4 && Math.random() < 0.3) this.spawnEnemy();
          if (this.level >= 6 && Math.random() < 0.2) this.spawnEnemy();
          this.spawnTimer = 0;
        }

        // ── Move enemies ──
        type EnemyContainer = Phaser.GameObjects.Container & {
          hp: number; maxHp: number; speed: number; points: number; enemyType: string;
          hitbox: Phaser.GameObjects.Rectangle; shootTimer: number; shootInterval: number;
        };

        const enemiesToRemove: EnemyContainer[] = [];
        this.enemies.getChildren().forEach((e) => {
          const enemy = e as EnemyContainer;
          enemy.y += enemy.speed * dt;
          enemy.x += Math.sin(time * 0.001 + enemy.y * 0.01) * 1.2;
          enemy.shootTimer -= delta;
          if (enemy.shootTimer <= 0 && enemy.enemyType !== 'scout') {
            this.fireEnemyBullet(enemy);
            enemy.shootTimer = enemy.shootInterval + Math.random() * 500;
          }
          if (enemy.y > H + 60) enemiesToRemove.push(enemy);
        });
        enemiesToRemove.forEach((e) => { e.destroy(); this.enemies.remove(e); });

        // ── Bullet ↔ Enemy collisions ──
        const hitBullets: Phaser.GameObjects.Graphics[] = [];
        const hitEnemies: EnemyContainer[] = [];

        this.bullets.getChildren().forEach((b) => {
          const bullet = b as Phaser.GameObjects.Graphics;
          this.enemies.getChildren().forEach((e) => {
            const enemy = e as EnemyContainer;
            const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, enemy.x, enemy.y);
            const hitRadius = enemy.enemyType === 'heavy' ? 28 : enemy.enemyType === 'fighter' ? 22 : 16;
            if (dist < hitRadius) {
              hitBullets.push(bullet);
              enemy.hp -= 1;
              if (enemy.hp <= 0) {
                hitEnemies.push(enemy);

                // ── Streak bonus ──
                this.streak += 1;
                this.streakTimer = 0;
                onStreakUpdate(this.streak);

                // Base points + streak multiplier (capped at 5x)
                const streakMult = Math.min(this.streak, 5);
                const earned = enemy.points * streakMult;
                this.score += earned;
                this.kills += 1;
                onScoreUpdate(this.score);
                onKillsUpdate(this.kills);

                // Explosion
                const exColor = enemy.enemyType === 'heavy' ? 0xff6600 : enemy.enemyType === 'fighter' ? 0xcc00ff : 0xff2244;
                this.spawnExplosion(enemy.x, enemy.y, exColor, enemy.enemyType === 'heavy' ? 24 : 16);

                // ── Level progression ──
                const nextThreshold = this.LEVEL_THRESHOLDS[this.level] ?? 9999;
                if (this.kills >= nextThreshold) {
                  this.level += 1;
                  onLevelUpdate(this.level);
                  this.showLevelUp();
                }
              } else {
                this.spawnExplosion(bullet.x, bullet.y, 0xffffff, 4);
              }
            }
          });
        });
        hitBullets.forEach((b) => { b.destroy(); this.bullets.remove(b); });
        hitEnemies.forEach((e) => { e.destroy(); this.enemies.remove(e); });

        // ── Enemy bullet ↔ Player ──
        if (!this.playerInvincible) {
          const hitPlayerBullets: Phaser.GameObjects.Graphics[] = [];
          this.enemyBullets.getChildren().forEach((b) => {
            const bullet = b as Phaser.GameObjects.Graphics;
            const dist = Phaser.Math.Distance.Between(bullet.x, bullet.y, this.playerX, this.playerY);
            if (dist < 22) {
              hitPlayerBullets.push(bullet);
              this.takeDamage(20); // -20 HP per bullet hit
            }
          });
          hitPlayerBullets.forEach((b) => { b.destroy(); this.enemyBullets.remove(b); });

          // ── Enemy body ↔ Player ──
          this.enemies.getChildren().forEach((e) => {
            const enemy = e as EnemyContainer;
            const dist = Phaser.Math.Distance.Between(enemy.x, enemy.y, this.playerX, this.playerY);
            if (dist < 36) {
              enemy.hp = 0;
              this.enemies.remove(enemy);
              enemy.destroy();
              this.spawnExplosion(enemy.x, enemy.y, 0xff4400, 18);
              this.takeDamage(35); // -35 HP per body collision
            }
          });
        }

        // ── Invincibility blink ──
        if (this.playerInvincible) {
          this.playerInvincibleTimer -= delta;
          this.player.setAlpha(Math.sin(time * 0.02) * 0.5 + 0.5);
          if (this.playerInvincibleTimer <= 0) {
            this.playerInvincible = false;
            this.player.setAlpha(1);
          }
        }

        // ── Update explosion particles ──
        this.explosionParticles = this.explosionParticles.filter((p) => {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 60 * dt;
          p.vx *= 0.97;
          p.life -= dt;
          return p.life > 0;
        });

        this.drawFrame();
      }

      // ── Take damage ───────────────────────────────────────────────────────
      takeDamage(amount: number) {
        if (this.playerInvincible) return;
        this.health = Math.max(0, this.health - amount);
        onHealthUpdate(this.health);
        this.spawnExplosion(this.playerX, this.playerY, 0x00f5ff, 12);
        this.playerInvincible = true;
        this.playerInvincibleTimer = 2000;

        // Reset streak on damage
        this.streak = 0;
        this.streakTimer = 0;
        onStreakUpdate(0);

        if (this.health <= 0 && !gameOverFiredRef.current) {
          gameOverFiredRef.current = true;

          // Save score to localStorage leaderboard
          if (typeof window !== 'undefined') {
            const username = localStorage.getItem('astrobreak_user') || 'UNKNOWN';
            const board = JSON.parse(localStorage.getItem('astrobreak_leaderboard') || '[]');
            board.push({
              username,
              score: this.score,
              level: this.level,
              kills: this.kills,
              date: new Date().toISOString(),
            });
            board.sort((a: { score: number }, b: { score: number }) => b.score - a.score);
            localStorage.setItem('astrobreak_leaderboard', JSON.stringify(board.slice(0, 10)));
          }

          this.time.delayedCall(800, () => {
            onGameOver(this.score, this.level, this.kills);
          });
        }
      }

      // ── Draw frame ────────────────────────────────────────────────────────
      drawFrame() {
        const W = this.scale.width;
        const H = this.scale.height;

        if (!this._bgGfx) {
          this._bgGfx = this.add.graphics();
          this._bgGfx.setDepth(-10);
        }
        const bg = this._bgGfx;
        bg.clear();
        bg.fillGradientStyle(0x050510, 0x050510, 0x0a0a2e, 0x0a0a2e, 1);
        bg.fillRect(0, 0, W, H);

        for (const star of this.stars) {
          const alpha = star.brightness;
          bg.fillStyle(0xffffff, alpha * 0.7);
          bg.fillCircle(star.x, star.y, star.size * 0.5);
          if (star.size > 1.2) {
            bg.fillStyle(0x00f5ff, alpha * 0.15);
            bg.fillCircle(star.x, star.y, star.size * 1.5);
          }
        }

        if (!this._particleGfx) {
          this._particleGfx = this.add.graphics();
          this._particleGfx.setDepth(5);
        }
        const pg = this._particleGfx;
        pg.clear();
        for (const p of this.explosionParticles) {
          const lifeRatio = p.life / p.maxLife;
          pg.fillStyle(p.color, lifeRatio * 0.9);
          pg.fillCircle(p.x, p.y, p.size * lifeRatio);
          pg.fillStyle(p.color, lifeRatio * 0.2);
          pg.fillCircle(p.x, p.y, p.size * 2.5 * lifeRatio);
        }
      }
    }

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      parent: containerRef.current ?? undefined,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: '#050510',
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      render: {
        antialias: true,
        pixelArt: false,
      },
    };

    gameRef.current = new Phaser.Game(config);
  }, [onScoreUpdate, onHealthUpdate, onLevelUpdate, onKillsUpdate, onStreakUpdate, onGameOver]);

  useEffect(() => {
    startGame();
    return () => {
      if (gameRef.current) {
        (gameRef.current as { destroy: (b: boolean) => void }).destroy(true);
        gameRef.current = null;
      }
    };
  }, [startGame]);

  return (
    <div
      ref={containerRef}
      id="game-container"
      className="fixed inset-0 z-20"
      aria-label="AstroBreak game canvas"
    />
  );
}