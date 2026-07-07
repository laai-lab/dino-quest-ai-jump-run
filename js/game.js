(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});
  const { rand, randInt, choice, clamp, rectsOverlap, circleRectOverlap } = DinoQuest.Utils;
  const Assets = DinoQuest.Assets;

  class Game {
    constructor(canvas, ui) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ui = ui;
      this.audio = new DinoQuest.AudioManager();
      this.questions = new DinoQuest.QuestionEngine();
      this.utils = DinoQuest.Utils;

      this.width = 960;
      this.height = 420;
      this.groundY = 330;
      this.deltaScale = 1;
      this.state = "menu";
      this.lastTime = 0;
      this.worldTime = 0;
      this.score = 0;
      this.highScore = Number(localStorage.getItem("dinoQuestHighScore") || 0);
      this.leaderboard = this.loadLeaderboard();
      this.level = 1;
      this.maxLevel = 8;
      this.lives = 3;
      this.baseSpeed = 285;
      this.speed = this.baseSpeed;
      this.obstaclesPassed = 0;
      this.obstaclesForGate = 4;
      this.currentQuestion = null;
      this.input = { jumpHeld: false };
      this.stars = [];
      this.clouds = [];
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.spawnTimer = 0;
      this.invulnerableTimer = 0;
      this.dino = this.createDino();

      this.bindEvents();
    }

    boot() {
      this.resize();
      this.resetWorld();
      this.ui.showStart();
      this.ui.updateHud(this);
      requestAnimationFrame((time) => this.loop(time));
    }

    createDino() {
      return {
        x: 115,
        y: 0,
        w: 58,
        h: 62,
        vy: 0,
        grounded: true,
        canDouble: true,
        dash: 0,
        dashCooldown: 0,
        shield: 0,
        slow: 0,
        invulnerable: 0
      };
    }

    bindEvents() {
      window.addEventListener("resize", () => this.resize());
      window.addEventListener("keydown", (event) => this.onKey(event, true));
      window.addEventListener("keyup", (event) => this.onKey(event, false));
      this.canvas.addEventListener("pointerdown", () => {
        if (this.state === "menu" || this.state === "over") this.start();
        else if (this.state === "playing") this.jump();
      });
    }

    onKey(event, pressed) {
      const key = event.key;
      if ([" ", "ArrowUp", "ArrowDown"].includes(key)) event.preventDefault();
      if (!pressed) {
        if (key === " " || key === "ArrowUp" || key.toLowerCase() === "w") this.input.jumpHeld = false;
        return;
      }

      if (key === "Enter" && (this.state === "menu" || this.state === "over")) this.start();
      if (key === " " || key === "ArrowUp" || key.toLowerCase() === "w") this.jump();
      if (key === "Shift" || key.toLowerCase() === "d" || key === "ArrowDown") this.dash();
      if (key.toLowerCase() === "p" || key === "Escape") this.togglePause();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      this.width = Math.max(360, rect.width || 960);
      this.height = Math.max(320, rect.height || 420);
      this.canvas.width = Math.floor(this.width * dpr);
      this.canvas.height = Math.floor(this.height * dpr);
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.groundY = Math.max(238, this.height - 88);
      this.dino.y = Math.min(this.dino.y || this.groundY - this.dino.h, this.groundY - this.dino.h);
      this.rebuildBackdrop();
    }

    rebuildBackdrop() {
      this.stars = Array.from({ length: 88 }, () => ({
        x: rand(0, this.width),
        y: rand(12, Math.max(140, this.groundY - 120)),
        s: rand(1, 2.4),
        twinkle: rand(0.8, 2)
      }));
      this.clouds = Array.from({ length: 6 }, () => ({
        x: rand(0, this.width),
        y: rand(28, Math.max(110, this.groundY - 190)),
        s: rand(0.65, 1.45)
      }));
    }

    resetWorld() {
      this.worldTime = 0;
      this.score = 0;
      this.level = 1;
      this.lives = 3;
      this.speed = this.baseSpeed;
      this.obstaclesPassed = 0;
      this.obstaclesForGate = 4;
      this.obstacles = [];
      this.collectibles = [];
      this.particles = [];
      this.spawnTimer = 0.55;
      this.dino = this.createDino();
      this.dino.y = this.groundY - this.dino.h;
      this.ui.updateHud(this);
    }

    start() {
      this.audio.ensure();
      this.resetWorld();
      this.state = "playing";
      this.ui.hideOverlays();
      this.ui.setStatus("Run started. Jump over hazards and collect power-ups.");
    }

    togglePause() {
      if (this.state === "playing") {
        this.state = "paused";
        this.ui.showPause();
      } else if (this.state === "paused") {
        this.state = "playing";
        this.ui.hideOverlays();
        this.ui.setStatus("Back on the trail.");
      }
    }

    jump() {
      if (this.state === "menu" || this.state === "over") {
        this.start();
        return;
      }
      if (this.state !== "playing" || this.input.jumpHeld) return;
      this.input.jumpHeld = true;
      if (this.dino.grounded) {
        this.dino.vy = -690;
        this.dino.grounded = false;
        this.dino.canDouble = true;
        this.emitDust(this.dino.x + 20, this.groundY - 4, "#52e0ff", 14);
        this.audio.jump();
      } else if (this.dino.canDouble) {
        this.dino.vy = -610;
        this.dino.canDouble = false;
        this.emitDust(this.dino.x + 18, this.dino.y + this.dino.h, "#9d8cff", 10);
        this.audio.jump();
      }
    }

    dash() {
      if (this.state !== "playing" || this.dino.dashCooldown > 0) return;
      this.dino.dash = 0.24;
      this.dino.dashCooldown = 1.25;
      this.emitDust(this.dino.x - 8, this.dino.y + 35, "#9d8cff", 14);
      this.audio.dash();
    }

    loop(time) {
      const dt = Math.min(0.033, (time - this.lastTime || 16) / 1000);
      this.lastTime = time;
      this.deltaScale = dt * 60;
      if (this.state === "playing") this.update(dt);
      this.draw();
      requestAnimationFrame((nextTime) => this.loop(nextTime));
    }

    update(dt) {
      const slowFactor = this.dino.slow > 0 ? 0.55 : 1;
      const runSpeed = this.speed * slowFactor;
      this.worldTime += dt;
      this.score += dt * this.level * 7;
      this.spawnTimer -= dt;
      if (this.spawnTimer <= 0) this.spawnPattern();

      this.updateDino(dt);
      this.updateObstacles(dt, runSpeed);
      this.updateCollectibles(dt, runSpeed);
      this.updateParticles(dt);

      this.dino.shield = Math.max(0, this.dino.shield - dt);
      this.dino.slow = Math.max(0, this.dino.slow - dt);
      this.dino.dash = Math.max(0, this.dino.dash - dt);
      this.dino.dashCooldown = Math.max(0, this.dino.dashCooldown - dt);
      this.dino.invulnerable = Math.max(0, this.dino.invulnerable - dt);

      this.highScore = Math.max(this.highScore, Math.floor(this.score));
      localStorage.setItem("dinoQuestHighScore", String(this.highScore));
      this.ui.updateHud(this);
    }

    updateDino(dt) {
      const gravity = this.dino.vy < 0 ? 1780 : 2050;
      this.dino.vy += gravity * dt;
      this.dino.y += this.dino.vy * dt;
      if (this.dino.y >= this.groundY - this.dino.h) {
        if (!this.dino.grounded) this.emitDust(this.dino.x + 22, this.groundY - 4, "#52e0ff", 8);
        this.dino.y = this.groundY - this.dino.h;
        this.dino.vy = 0;
        this.dino.grounded = true;
        this.dino.canDouble = true;
      }
    }

    updateObstacles(dt, runSpeed) {
      const playerBox = {
        x: this.dino.x + 8,
        y: this.dino.y + 7,
        w: this.dino.w - 16,
        h: this.dino.h - 9
      };

      this.obstacles.forEach((obstacle) => {
        obstacle.x -= runSpeed * dt;
        if (!obstacle.counted && obstacle.x + obstacle.w < this.dino.x) {
          obstacle.counted = true;
          this.obstaclesPassed += 1;
          this.score += 18;
          if (this.obstaclesPassed >= this.obstaclesForGate) this.openQuizGate();
        }
        if (!obstacle.hit && rectsOverlap(playerBox, obstacle)) {
          obstacle.hit = true;
          this.handleObstacleHit(obstacle);
        }
      });

      this.obstacles = this.obstacles.filter((obstacle) => obstacle.x > -140 && !obstacle.remove);
    }

    updateCollectibles(dt, runSpeed) {
      const playerBox = { x: this.dino.x, y: this.dino.y, w: this.dino.w, h: this.dino.h };
      this.collectibles.forEach((item) => {
        item.x -= runSpeed * dt;
        if (circleRectOverlap(item, playerBox)) {
          this.applyCollectible(item);
          item.remove = true;
        }
      });
      this.collectibles = this.collectibles.filter((item) => item.x > -80 && !item.remove);
    }

    updateParticles(dt) {
      this.particles.forEach((particle) => {
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.vy += 520 * dt;
        particle.life -= dt * particle.decay;
      });
      this.particles = this.particles.filter((particle) => particle.life > 0);
    }

    spawnPattern() {
      const level = this.level;
      const gap = clamp(1.1 - level * 0.055, 0.58, 1.1);
      const patternPool = level < 2
        ? ["cactus", "rock"]
        : level < 4
          ? ["cactus", "rock", "bird", "double"]
          : ["cactus", "rock", "bird", "double", "stagger", "lowHigh"];
      const pattern = choice(patternPool);
      const startX = this.width + rand(30, 120);

      if (pattern === "double") {
        this.addObstacle("cactus", startX, 0);
        this.addObstacle("rock", startX + rand(74, 96), 0);
      } else if (pattern === "stagger") {
        this.addObstacle("rock", startX, 0);
        this.addObstacle("bird", startX + rand(125, 160), -rand(80, 125));
      } else if (pattern === "lowHigh") {
        this.addObstacle("bird", startX, -rand(55, 85));
        this.addObstacle("cactus", startX + rand(132, 176), 0);
      } else {
        this.addObstacle(pattern, startX, pattern === "bird" ? -rand(70, 132) : 0);
      }

      if (Math.random() < 0.7) this.spawnCoinArc(startX + rand(70, 150));
      if (Math.random() < 0.17) this.spawnPowerup(startX + rand(210, 290));
      this.spawnTimer = gap + rand(0.14, 0.35);
    }

    addObstacle(type, x, yOffset) {
      const sizes = {
        cactus: { w: randInt(28, 38), h: randInt(48, 68) },
        rock: { w: randInt(36, 52), h: randInt(30, 42) },
        bird: { w: 56, h: 30 }
      };
      const size = sizes[type];
      const y = type === "bird" ? this.groundY - 85 + yOffset : this.groundY - size.h;
      this.obstacles.push({ type, x, y, w: size.w, h: size.h, counted: false, hit: false });
    }

    spawnCoinArc(x) {
      const count = randInt(3, 5);
      for (let i = 0; i < count; i += 1) {
        this.collectibles.push({
          kind: "coin",
          x: x + i * 28,
          y: this.groundY - 90 - Math.sin(i / Math.max(1, count - 1) * Math.PI) * 48,
          r: 10,
          remove: false
        });
      }
    }

    spawnPowerup(x) {
      this.collectibles.push({
        kind: choice(["shield", "slow", "heart"]),
        x,
        y: this.groundY - rand(118, 170),
        r: 13,
        remove: false
      });
    }

    applyCollectible(item) {
      if (item.kind === "coin") {
        this.score += 10;
        this.audio.collect();
        this.emitDust(item.x, item.y, "#ffd166", 7);
      } else if (item.kind === "shield") {
        this.dino.shield = 7;
        this.score += 30;
        this.audio.power();
        this.ui.setStatus("Shield active.");
      } else if (item.kind === "slow") {
        this.dino.slow = 5.5;
        this.score += 30;
        this.audio.power();
        this.ui.setStatus("Time boost active.");
      } else if (item.kind === "heart") {
        this.lives = Math.min(5, this.lives + 1);
        this.score += 35;
        this.audio.power();
        this.ui.setStatus("Extra life collected.");
      }
    }

    handleObstacleHit(obstacle) {
      if (this.dino.dash > 0 || this.dino.shield > 0) {
        obstacle.remove = true;
        this.dino.shield = Math.max(0, this.dino.shield - 2);
        this.score += 14;
        this.emitDust(obstacle.x + obstacle.w / 2, obstacle.y + obstacle.h / 2, "#7df29c", 18);
        this.audio.power();
        return;
      }
      if (this.dino.invulnerable > 0) return;
      this.lives -= 1;
      this.dino.invulnerable = 1.4;
      obstacle.remove = true;
      this.emitDust(this.dino.x + 30, this.dino.y + 35, "#ff5d7d", 22);
      this.audio.hit();
      this.ui.setStatus("Ouch. One life lost.");
      if (this.lives <= 0) this.end(false);
    }

    openQuizGate() {
      if (this.state !== "playing") return;
      this.state = "quiz";
      this.obstaclesPassed = 0;
      this.obstacles = [];
      this.collectibles = [];
      this.currentQuestion = this.questions.next(this.level);
      this.ui.showQuiz(this.currentQuestion, this.level);
    }

    submitQuizAnswer(answer) {
      if (this.state !== "quiz" || !this.currentQuestion) return;
      const correct = this.questions.check(this.currentQuestion, answer);
      if (correct) {
        this.score += 120 + this.level * 30;
        this.level += 1;
        this.speed = Math.min(520, this.speed + 24);
        this.obstaclesForGate = Math.min(7, 3 + Math.ceil(this.level / 2));
        this.audio.correct();
        this.emitDust(this.dino.x + 35, this.dino.y + 10, "#7df29c", 24);
        this.ui.showQuizFeedback(`Correct. ${this.currentQuestion.explanation}`, true);
        setTimeout(() => {
          if (this.level > this.maxLevel) this.end(true);
          else this.resumeAfterQuiz("Stage unlocked. Speed increased.");
        }, 1200);
      } else {
        this.lives -= 1;
        this.audio.wrong();
        this.ui.showQuizFeedback(`Not quite. ${this.currentQuestion.explanation}`, false);
        setTimeout(() => {
          if (this.lives <= 0) this.end(false);
          else this.resumeAfterQuiz("Wrong answer. One life lost, but the gate opens.");
        }, 1300);
      }
      this.highScore = Math.max(this.highScore, Math.floor(this.score));
      localStorage.setItem("dinoQuestHighScore", String(this.highScore));
      this.ui.updateHud(this);
    }

    resumeAfterQuiz(message) {
      this.currentQuestion = null;
      this.spawnTimer = 0.8;
      this.state = "playing";
      this.ui.hideOverlays();
      this.ui.setStatus(message);
      this.ui.updateHud(this);
    }

    progressRatio() {
      return clamp(this.obstaclesPassed / this.obstaclesForGate, 0, 1);
    }

    emitDust(x, y, color, count) {
      for (let i = 0; i < count; i += 1) {
        this.particles.push({
          x,
          y,
          vx: rand(-155, 115),
          vy: rand(-260, -40),
          r: rand(1.5, 4.2),
          color,
          life: rand(0.42, 1),
          decay: rand(1.3, 2.4)
        });
      }
    }

    draw() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      Assets.drawBackground(ctx, this);
      this.collectibles.forEach((item) => Assets.drawCollectible(ctx, item, this.worldTime));
      this.obstacles.forEach((obstacle) => Assets.drawObstacle(ctx, obstacle, this.worldTime));
      Assets.drawParticles(ctx, this.particles);
      Assets.drawDino(ctx, this.dino, this.worldTime);

      if (this.dino.slow > 0) {
        ctx.save();
        ctx.globalAlpha = 0.13;
        ctx.fillStyle = "#52e0ff";
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.restore();
      }
    }

    end(won) {
      this.state = "over";
      this.saveLeaderboard();
      this.ui.updateHud(this);
      this.ui.showGameOver(this, won);
      if (!won) this.audio.wrong();
    }

    loadLeaderboard() {
      try {
        return JSON.parse(localStorage.getItem("dinoQuestLeaderboard") || "[]");
      } catch (error) {
        return [];
      }
    }

    saveLeaderboard() {
      const entry = {
        score: Math.floor(this.score),
        level: this.level,
        date: new Date().toLocaleDateString()
      };
      this.leaderboard = [entry, ...this.loadLeaderboard()]
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);
      localStorage.setItem("dinoQuestLeaderboard", JSON.stringify(this.leaderboard));
    }

    showMenu() {
      this.state = "menu";
      this.resetWorld();
      this.ui.showStart();
    }
  }

  DinoQuest.Game = Game;
})();
