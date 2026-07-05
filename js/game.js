(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});
  const { randInt, choice, rectsOverlap } = DinoQuest.Utils;

  class Game {
    constructor(canvas, ui) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.ctx.imageSmoothingEnabled = false;
      this.tileSize = 32;
      this.level = 1;
      this.maxLevel = 5;
      this.ui = ui;
      this.player = new DinoQuest.Player(this.tileSize);
      this.questionEngine = new DinoQuest.QuestionEngine();
      this.audio = new DinoQuest.AudioManager();
      this.battleSystem = new DinoQuest.BattleSystem(this, ui, this.questionEngine, this.audio);
      this.input = { left: false, right: false, up: false, down: false, jump: false };
      this.world = null;
      this.platforms = [];
      this.hazards = [];
      this.collectibles = [];
      this.enemies = [];
      this.checkpoints = [];
      this.finishGate = null;
      this.camera = { x: 0, y: 0 };
      this.state = "loading";
      this.lastTime = 0;
      this.trapCooldown = 0;
      this.topics = ["Data Science", "Machine Learning", "Coding", "Generative AI", "LLMs", "Prompt Engineering", "RAG", "Python", "SQL", "Deep Learning"];
      this.bindKeys();
    }

    async boot() {
      await this.questionEngine.load();
      this.resize();
      this.newLevel(1, false);
      this.state = "menu";
      this.ui.showStart();
      this.ui.updateHud(this);
      requestAnimationFrame((time) => this.loop(time));
    }

    bindKeys() {
      window.addEventListener("keydown", (event) => {
        const isEditorTarget = this.isEditorTarget(event.target);
        if (!isEditorTarget && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)) {
          event.preventDefault();
        }
        if (!isEditorTarget) {
          this.setKey(event.key, true);
        }
        if (!isEditorTarget && (event.key === "Enter" || event.key === " ") && this.state === "menu") {
          this.startNewGame();
        }
      });
      window.addEventListener("keyup", (event) => {
        if (!this.isEditorTarget(event.target)) {
          this.setKey(event.key, false);
        }
      });
      window.addEventListener("resize", () => {
        this.resize();
        if (this.world) this.world.groundY = Math.max(280, this.canvas.height - 82);
      });
    }

    isEditorTarget(target) {
      if (!target || !target.closest) return false;
      return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
    }

    setKey(key, pressed) {
      const map = {
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right",
        ArrowUp: "up",
        w: "up",
        W: "up",
        " ": "jump",
        Enter: "jump",
        ArrowDown: "down",
        s: "down",
        S: "down"
      };
      if (map[key]) {
        this.input[map[key]] = pressed;
      }
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const width = Math.max(480, Math.floor(rect.width));
      const height = Math.max(320, Math.floor(rect.height));
      if (this.canvas.width !== width || this.canvas.height !== height) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.imageSmoothingEnabled = false;
      }
    }

    startNewGame() {
      this.audio.ensure();
      this.level = 1;
      this.player = new DinoQuest.Player(this.tileSize);
      this.newLevel(1, false);
      this.state = "playing";
      this.ui.hideStart();
      this.ui.setStatus("Run right, double-jump hazards, and solve AI puzzle gates.");
      this.ui.updateHud(this);
    }

    newLevel(level, keepPlayer) {
      this.level = level;
      this.resize();
      const groundY = Math.max(280, this.canvas.height - 82);
      this.world = {
        width: Math.max(2600 + level * 720, this.canvas.width + 1400),
        groundY,
        autoRunSpeed: 104 + level * 12,
        skyColor: ["#8bd3ff", "#95e2cc", "#f7d98c", "#b7a6ff", "#89c2ff"][Math.min(level - 1, 4)]
      };
      this.platforms = [];
      this.hazards = [];
      this.collectibles = [];
      this.enemies = [];
      this.checkpoints = [];
      this.finishGate = {
        x: this.world.width - 180,
        y: groundY - 104,
        w: 54,
        h: 104,
        active: false
      };
      this.buildRunnerCourse();
      if (!keepPlayer) {
        this.player.resetForWorld(this.world);
      } else {
        this.player.resetForWorld(this.world);
      }
      this.ui.updateHud(this);
    }

    buildRunnerCourse() {
      const groundY = this.world.groundY;
      const palettes = ["#6fb6ff", "#44d39d", "#f6bd3a", "#7056d8", "#ef5d58"];
      const segments = 8 + this.level * 2;
      const segmentWidth = Math.floor((this.world.width - 520) / segments);

      for (let i = 1; i <= segments; i += 1) {
        const baseX = 260 + i * segmentWidth;
        const topic = this.topics[(i + this.level) % this.topics.length];

        if (i % 2 === 0) {
          const platform = {
            x: baseX - 80,
            y: groundY - randInt(132, 225),
            w: randInt(170, 250),
            h: 22,
            label: choice(["DS", "ML", "AI", "SQL", "GEN"])
          };
          this.platforms.push(platform);
          this.createCoinArc(platform.x + 24, platform.y - 36, 5);
          if (Math.random() < 0.7) {
            this.collectibles.push({
              type: choice(["xp", "shield", "heart"]),
              x: platform.x + platform.w - 44,
              y: platform.y - 52,
              w: 28,
              h: 28,
              collected: false
            });
          }
        }

        this.hazards.push({
          type: choice(["spike", "bug", "spike"]),
          x: baseX + randInt(-20, 52),
          y: groundY - 30,
          w: randInt(22, 36),
          h: 28,
          damage: 10 + this.level * 3
        });

        if (i % 3 === 0) {
          this.checkpoints.push({
            x: baseX + 120,
            y: groundY - 76,
            w: 34,
            h: 76,
            reached: false
          });
        }

        if (i % 2 === 1) {
          this.enemies.push(this.createPuzzleGate({
            id: i,
            x: baseX + 170,
            y: groundY - 76,
            topic,
            type: choice(["multiple-choice", "code-completion", "debugging", "sql", "output-prediction"]),
            palette: palettes[i % palettes.length],
            isBoss: false
          }));
        }
      }

      this.enemies.push(this.createPuzzleGate({
        id: 900 + this.level,
        x: this.finishGate.x - 130,
        y: groundY - 112,
        topic: this.topics[(this.level * 2) % this.topics.length],
        type: null,
        palette: "#ef5d58",
        isBoss: true
      }));

      for (let x = 150; x < this.world.width - 240; x += 180) {
        this.createCoinArc(x, groundY - randInt(72, 132), 3);
      }
    }

    createPuzzleGate(config) {
      const isBoss = Boolean(config.isBoss);
      return {
        id: config.id,
        name: isBoss ? `AI Core Gate ${this.level}` : `${config.topic} Gate`,
        topic: config.topic,
        type: config.type,
        isBoss,
        x: config.x,
        y: config.y,
        size: isBoss ? 64 : 46,
        w: isBoss ? 68 : 50,
        h: isBoss ? 92 : 68,
        maxHealth: isBoss ? 100 + this.level * 34 : 48 + this.level * 14,
        health: isBoss ? 100 + this.level * 34 : 48 + this.level * 14,
        damage: isBoss ? 24 : 12 + this.level * 2,
        questionsRequired: isBoss ? 3 + Math.floor(this.level / 2) : 1,
        defeated: false,
        palette: config.palette,
        facing: "left"
      };
    }

    createCoinArc(x, y, count) {
      for (let i = 0; i < count; i += 1) {
        this.collectibles.push({
          type: "coin",
          x: x + i * 26,
          y: y - Math.sin((i / Math.max(1, count - 1)) * Math.PI) * 28,
          w: 22,
          h: 22,
          collected: false
        });
      }
    }

    loop(time) {
      const dt = Math.min(0.05, (time - this.lastTime) / 1000 || 0);
      this.lastTime = time;
      this.update(dt, time);
      this.draw(time / 1000);
      requestAnimationFrame((next) => this.loop(next));
    }

    update(dt, now) {
      if (this.state === "battle") {
        this.battleSystem.update(now);
        return;
      }
      if (this.state !== "playing") return;

      this.player.update(dt, this.input, this.world, this.platforms, now);
      this.checkHazards(now);
      this.checkCollectibles(now);
      this.checkCheckpoints(now);
      this.checkEnemyCollision();
      this.checkFinish();
      this.updateCamera();
      this.player.score += Math.floor(dt * (this.level + 1) * 4);
      this.ui.updateHud(this);
    }

    checkHazards(now) {
      if (now < this.trapCooldown) return;
      const playerBounds = this.player.bounds();
      const hazard = this.hazards.find((item) => rectsOverlap(playerBounds, item));
      if (hazard && this.player.damage(hazard.damage, now)) {
        this.audio.beep("hurt");
        this.trapCooldown = now + 950;
        this.ui.showToast("Ouch! Jump earlier next time.");
      }
      if (this.player.health <= 0) {
        this.gameOver("The dino crashed before solving the next puzzle.");
      }
    }

    checkCollectibles(now) {
      const playerBounds = this.player.bounds();
      this.collectibles.forEach((item) => {
        if (item.collected) return;
        if (rectsOverlap(playerBounds, item)) {
          item.collected = true;
          if (item.type === "coin") {
            this.player.addCoins(1);
            this.audio.beep("coin");
          } else if (item.type === "heart") {
            this.player.heal(22);
            this.audio.beep("checkpoint");
          } else if (item.type === "xp") {
            this.player.addXp(12 + this.level * 3);
            this.audio.beep("correct");
          } else if (item.type === "shield") {
            this.player.activateShield(9000, now);
            this.audio.beep("checkpoint");
          }
          this.ui.showToast(`${item.type.toUpperCase()} collected.`);
        }
      });
    }

    checkCheckpoints(now) {
      const playerBounds = this.player.bounds();
      this.checkpoints.forEach((checkpoint) => {
        if (!checkpoint.reached && rectsOverlap(playerBounds, checkpoint)) {
          checkpoint.reached = true;
          this.player.checkpoint = { x: checkpoint.x - 50, y: this.world.groundY - this.player.height };
          this.save();
          this.audio.beep("checkpoint");
          this.ui.showToast("Checkpoint saved.");
        }
      });
    }

    checkEnemyCollision() {
      const playerBounds = this.player.bounds();
      const enemy = this.enemies.find((target) => !target.defeated && rectsOverlap(playerBounds, this.enemyBounds(target)));
      if (enemy) {
        this.state = "battle";
        this.input = { left: false, right: false, up: false, down: false, jump: false };
        this.battleSystem.start(enemy);
      }
    }

    enemyBounds(enemy) {
      return { x: enemy.x + 5, y: enemy.y + 8, w: enemy.w - 10, h: enemy.h - 12 };
    }

    checkFinish() {
      const boss = this.enemies.find((enemy) => enemy.isBoss && !enemy.defeated);
      this.finishGate.active = !boss;
      if (this.finishGate.active && rectsOverlap(this.player.bounds(), this.finishGate)) {
        this.advanceLevel();
      }
    }

    endBattle(victory, enemy) {
      if (this.state === "gameover" || this.state === "victory") return;
      this.state = "playing";
      if (victory) {
        this.player.x = Math.max(this.player.x, enemy.x + enemy.w + 24);
        this.ui.showToast(`${enemy.name} solved.`);
        this.save();
      } else {
        this.player.respawn();
        this.ui.showToast("Puzzle failed. Respawned at checkpoint.");
      }
      this.ui.updateHud(this);
    }

    advanceLevel() {
      if (this.level >= this.maxLevel) {
        this.victory();
        return;
      }
      this.level += 1;
      this.player.heal(35);
      this.player.score += 450;
      this.newLevel(this.level, true);
      this.save();
      this.audio.beep("win");
      this.ui.showToast(`Level ${this.level}: faster gates, sharper puzzles.`);
    }

    gameOver(reason) {
      this.state = "gameover";
      this.ui.showEnd("Run Failed", reason);
      this.ui.setStatus("Start a new run or load a checkpoint.");
      this.audio.beep("hurt");
    }

    victory() {
      this.state = "victory";
      this.player.score += 1600;
      this.ui.updateHud(this);
      this.ui.showEnd("AI Run Complete", `Final score: ${this.player.score}. The dino outran the whole curriculum.`);
      this.ui.setStatus("Victory saved locally.");
      this.save();
      this.audio.beep("win");
    }

    updateCamera() {
      const target = this.player.x - this.canvas.width * 0.28;
      this.camera.x += (target - this.camera.x) * 0.12;
      this.camera.x = Math.max(0, Math.min(this.world.width - this.canvas.width, this.camera.x));
      this.camera.y = 0;
    }

    draw(time) {
      const ctx = this.ctx;
      this.resize();
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (!this.world) return;
      this.updateCamera();
      this.drawBackground(ctx, time);
      ctx.save();
      ctx.translate(-Math.floor(this.camera.x), 0);
      this.drawCourse(ctx, time);
      this.collectibles.forEach((item) => {
        if (!item.collected) {
          DinoQuest.Assets.drawCollectible(ctx, item, item.x, item.y, 32, time);
        }
      });
      this.enemies.forEach((enemy) => {
        if (!enemy.defeated) {
          DinoQuest.Assets.drawEnemy(ctx, enemy, enemy.x, enemy.y, enemy.size, time);
          this.drawGateLabel(ctx, enemy);
        }
      });
      DinoQuest.Assets.drawPlayer(ctx, this.player.x, this.player.y, this.player.size, this.player.direction, time, this.player.shieldUntil > performance.now());
      ctx.restore();
      this.drawProgress(ctx);
      if (this.state === "menu") {
        this.drawTitleBackdrop(ctx, time);
      }
    }

    drawBackground(ctx, time) {
      const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, this.world.skyColor);
      gradient.addColorStop(0.58, "#dff8ff");
      gradient.addColorStop(1, "#203048");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      ctx.fillStyle = "rgba(246, 189, 58, 0.9)";
      ctx.beginPath();
      ctx.arc(this.canvas.width - 94, 76, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255, 248, 222, 0.45)";
      ctx.beginPath();
      ctx.arc(this.canvas.width - 94, 76, 52, 0, Math.PI * 2);
      ctx.fill();

      for (let layer = 0; layer < 3; layer += 1) {
        const speed = 0.12 + layer * 0.08;
        const offset = -(this.camera.x * speed) % 360;
        ctx.fillStyle = [`rgba(255,255,255,0.75)`, `rgba(68,211,157,0.24)`, `rgba(112,86,216,0.16)`][layer];
        for (let x = offset - 80; x < this.canvas.width + 360; x += 360) {
          const y = 58 + layer * 54 + Math.sin(time + layer + x) * 4;
          ctx.fillRect(x, y, 96 + layer * 42, 18 + layer * 9);
          ctx.fillRect(x + 28, y - 12, 72, 18);
        }
      }

      const hillOffset = -(this.camera.x * 0.32) % 520;
      for (let x = hillOffset - 180; x < this.canvas.width + 540; x += 520) {
        ctx.fillStyle = "rgba(47, 155, 103, 0.3)";
        ctx.beginPath();
        ctx.moveTo(x, this.world.groundY);
        ctx.lineTo(x + 160, this.world.groundY - 118);
        ctx.lineTo(x + 340, this.world.groundY);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "rgba(112, 86, 216, 0.18)";
        ctx.beginPath();
        ctx.moveTo(x + 170, this.world.groundY);
        ctx.lineTo(x + 330, this.world.groundY - 88);
        ctx.lineTo(x + 510, this.world.groundY);
        ctx.closePath();
        ctx.fill();
      }
    }

    drawCourse(ctx, time) {
      const groundY = this.world.groundY;
      ctx.fillStyle = "#263447";
      ctx.fillRect(0, groundY, this.world.width, this.canvas.height - groundY);
      ctx.fillStyle = "rgba(15, 23, 42, 0.18)";
      ctx.fillRect(0, groundY + 18, this.world.width, 10);
      for (let x = 0; x < this.world.width; x += 32) {
        ctx.fillStyle = x % 64 === 0 ? "#334155" : "#3e4e66";
        ctx.fillRect(x, groundY, 32, 18);
      }
      ctx.fillStyle = "#44d39d";
      ctx.fillRect(0, groundY - 8, this.world.width, 8);

      this.platforms.forEach((platform) => {
        ctx.fillStyle = "#17202a";
        ctx.fillRect(platform.x - 4, platform.y + platform.h - 2, platform.w + 8, 8);
        const platformGradient = ctx.createLinearGradient(0, platform.y, 0, platform.y + platform.h);
        platformGradient.addColorStop(0, "#ffe08a");
        platformGradient.addColorStop(1, "#f6bd3a");
        ctx.fillStyle = platformGradient;
        ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
        ctx.fillStyle = "rgba(255,255,255,0.45)";
        ctx.fillRect(platform.x + 6, platform.y + 4, platform.w - 12, 4);
        ctx.fillStyle = "#fff8de";
        ctx.font = "bold 13px Trebuchet MS";
        ctx.fillText(platform.label, platform.x + 12, platform.y + 16);
      });

      this.hazards.forEach((hazard) => this.drawHazard(ctx, hazard, time));
      this.checkpoints.forEach((checkpoint) => this.drawCheckpoint(ctx, checkpoint));
      this.drawFinishGate(ctx);
    }

    drawHazard(ctx, hazard, time) {
      if (hazard.type === "bug") {
        ctx.fillStyle = "#ef5d58";
        ctx.fillRect(hazard.x, hazard.y + 9 + Math.sin(time * 12) * 2, hazard.w, hazard.h - 9);
        ctx.fillStyle = "#17202a";
        ctx.fillRect(hazard.x + 5, hazard.y + 15, 5, 5);
        ctx.fillRect(hazard.x + hazard.w - 10, hazard.y + 15, 5, 5);
        return;
      }
      ctx.fillStyle = "#b42318";
      const spikeCount = Math.max(1, Math.round(hazard.w / 16));
      const spikeWidth = hazard.w / spikeCount;
      for (let i = 0; i < spikeCount; i += 1) {
        const x = hazard.x + i * spikeWidth;
        ctx.beginPath();
        ctx.moveTo(x, hazard.y + hazard.h);
        ctx.lineTo(x + spikeWidth / 2, hazard.y + 2);
        ctx.lineTo(x + spikeWidth, hazard.y + hazard.h);
        ctx.closePath();
        ctx.fill();
      }
    }

    drawCheckpoint(ctx, checkpoint) {
      ctx.fillStyle = checkpoint.reached ? "#44d39d" : "#6fb6ff";
      ctx.fillRect(checkpoint.x, checkpoint.y, 10, checkpoint.h);
      ctx.fillRect(checkpoint.x + 10, checkpoint.y, 28, 20);
      ctx.fillStyle = "#fff8de";
      ctx.fillText("CP", checkpoint.x + 13, checkpoint.y + 15);
    }

    drawFinishGate(ctx) {
      const gate = this.finishGate;
      ctx.fillStyle = gate.active ? "#44d39d" : "#536179";
      ctx.fillRect(gate.x, gate.y, gate.w, gate.h);
      ctx.fillStyle = "#17202a";
      ctx.fillRect(gate.x + 10, gate.y + 16, gate.w - 20, gate.h - 26);
      ctx.fillStyle = gate.active ? "#f6bd3a" : "#94a3b8";
      ctx.fillRect(gate.x + 16, gate.y + 26, gate.w - 32, 12);
    }

    drawGateLabel(ctx, enemy) {
      ctx.fillStyle = "rgba(255, 248, 222, 0.92)";
      ctx.fillRect(enemy.x - 12, enemy.y - 24, enemy.w + 24, 20);
      ctx.fillStyle = "#17202a";
      ctx.font = "bold 12px Trebuchet MS";
      ctx.fillText(enemy.isBoss ? "BOSS" : enemy.topic.split(" ")[0], enemy.x - 5, enemy.y - 10);
    }

    drawProgress(ctx) {
      const pad = 14;
      const w = Math.min(360, this.canvas.width - 28);
      const pct = Math.max(0, Math.min(1, this.player.x / Math.max(1, this.world.width - this.canvas.width * 0.4)));
      ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
      ctx.fillRect(pad, pad, w, 12);
      ctx.fillStyle = "#f6bd3a";
      ctx.fillRect(pad, pad, w * pct, 12);
      ctx.fillStyle = "#58d68d";
      ctx.fillRect(pad + w * pct - 3, pad - 4, 6, 20);
    }

    drawTitleBackdrop(ctx, time) {
      ctx.fillStyle = `rgba(16, 24, 39, ${0.18 + Math.sin(time * 2) * 0.03})`;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    save() {
      const payload = {
        version: 2,
        savedAt: Date.now(),
        level: this.level,
        player: this.player.serialize()
      };
      localStorage.setItem("dinoQuestSave", JSON.stringify(payload));
      this.ui.setStatus("Progress saved locally.");
      return payload;
    }

    load() {
      const raw = localStorage.getItem("dinoQuestSave");
      if (!raw) {
        this.ui.showToast("No saved run found.");
        return false;
      }
      try {
        const data = JSON.parse(raw);
        this.player = new DinoQuest.Player(this.tileSize);
        this.newLevel(data.level || 1, true);
        this.player.restore(data.player);
        this.player.respawn();
        this.state = "playing";
        this.ui.hideStart();
        this.ui.updateHud(this);
        this.ui.showToast("Run loaded.");
        return true;
      } catch (error) {
        console.error(error);
        this.ui.showToast("Save file could not be loaded.");
        return false;
      }
    }
  }

  DinoQuest.Game = Game;
})();
