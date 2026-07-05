(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});
  const { clamp } = DinoQuest.Utils;

  class Player {
    constructor(tileSize) {
      this.tileSize = tileSize;
      this.width = 46;
      this.height = 42;
      this.size = 42;
      this.runSpeed = 235;
      this.airSpeed = 205;
      this.jumpVelocity = 640;
      this.gravity = 1800;
      this.maxFallSpeed = 980;
      this.maxHealth = 100;
      this.health = this.maxHealth;
      this.xp = 0;
      this.coins = 0;
      this.score = 0;
      this.direction = "right";
      this.shieldUntil = 0;
      this.invulnerableUntil = 0;
      this.checkpoint = { x: 80, y: 0 };
      this.resetForWorld({ groundY: 420 });
    }

    resetForWorld(world) {
      this.x = 80;
      this.y = world.groundY - this.height;
      this.vx = 0;
      this.vy = 0;
      this.onGround = true;
      this.wasOnGround = true;
      this.jumpsLeft = 1;
      this.ducking = false;
      this.checkpoint = { x: this.x, y: this.y };
    }

    setPosition(x, y) {
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
    }

    setTile(tileX, tileY) {
      this.setPosition(tileX * this.tileSize, tileY * this.tileSize);
    }

    tilePosition() {
      return {
        x: Math.floor(this.x / this.tileSize),
        y: Math.floor(this.y / this.tileSize)
      };
    }

    bounds() {
      const h = this.ducking && this.onGround ? this.height * 0.72 : this.height;
      const y = this.y + this.height - h;
      return { x: this.x + 7, y: y + 4, w: this.width - 14, h: h - 8 };
    }

    update(dt, input, world, platforms, now) {
      const left = input.left;
      const right = input.right;
      const wantsJump = input.jump || input.up;
      this.ducking = Boolean(input.down && this.onGround);

      let targetSpeed = world.autoRunSpeed;
      if (right) targetSpeed += 90;
      if (left) targetSpeed -= this.onGround ? 175 : 115;
      if (this.ducking) targetSpeed *= 0.65;
      this.vx = targetSpeed;
      this.direction = "right";

      if (wantsJump && !this.jumpHeld && this.jumpsLeft > 0 && !this.ducking) {
        this.vy = -this.jumpVelocity;
        this.onGround = false;
        this.jumpsLeft -= 1;
      }
      this.jumpHeld = wantsJump;

      this.wasOnGround = this.onGround;
      this.onGround = false;
      const previousY = this.y;
      this.x += this.vx * dt;
      this.vy = clamp(this.vy + this.gravity * dt, -this.jumpVelocity, this.maxFallSpeed);
      this.y += this.vy * dt;

      if (this.y + this.height >= world.groundY) {
        this.y = world.groundY - this.height;
        this.vy = 0;
        this.onGround = true;
        this.jumpsLeft = 1;
      }

      platforms.forEach((platform) => {
        const playerBottom = this.y + this.height;
        const previousBottom = previousY + this.height;
        const horizontal = this.x + this.width > platform.x && this.x < platform.x + platform.w;
        const fallingOnto = this.vy >= 0 && previousBottom <= platform.y + 6 && playerBottom >= platform.y;
        if (horizontal && fallingOnto) {
          this.y = platform.y - this.height;
          this.vy = 0;
          this.onGround = true;
          this.jumpsLeft = 1;
        }
      });

      this.x = clamp(this.x, 0, world.width - this.width);
      if (this.y > world.groundY + 180) {
        this.damage(18, now);
        this.respawn();
      }

      if (now > this.shieldUntil) {
        this.shieldUntil = 0;
      }
    }

    heal(amount) {
      this.health = clamp(this.health + amount, 0, this.maxHealth);
    }

    damage(amount, now) {
      if (now && now < this.invulnerableUntil) return false;
      const blocked = this.shieldUntil && now < this.shieldUntil;
      const finalAmount = blocked ? Math.ceil(amount * 0.35) : amount;
      this.health = clamp(this.health - finalAmount, 0, this.maxHealth);
      this.invulnerableUntil = now + 950;
      return true;
    }

    addXp(amount) {
      this.xp += amount;
      this.score += amount * 8;
      if (this.xp > 0 && this.xp % 120 < amount) {
        this.maxHealth += 5;
        this.health = this.maxHealth;
      }
    }

    addCoins(amount) {
      this.coins += amount;
      this.score += amount * 25;
    }

    activateShield(durationMs, now) {
      this.shieldUntil = now + durationMs;
    }

    respawn() {
      this.setPosition(this.checkpoint.x, this.checkpoint.y);
      this.onGround = false;
      this.jumpsLeft = 1;
    }

    serialize() {
      return {
        health: this.health,
        maxHealth: this.maxHealth,
        xp: this.xp,
        coins: this.coins,
        score: this.score,
        checkpoint: this.checkpoint
      };
    }

    restore(data) {
      if (!data) return;
      this.maxHealth = data.maxHealth || 100;
      this.health = data.health || this.maxHealth;
      this.xp = data.xp || 0;
      this.coins = data.coins || 0;
      this.score = data.score || 0;
      this.checkpoint = data.checkpoint || this.checkpoint;
    }
  }

  DinoQuest.Player = Player;
})();
