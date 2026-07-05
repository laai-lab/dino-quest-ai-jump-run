(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});
  const { choice, distance } = DinoQuest.Utils;

  class Enemy {
    constructor(config) {
      this.id = config.id;
      this.name = config.name;
      this.topic = config.topic;
      this.type = config.type || "bot";
      this.isBoss = Boolean(config.isBoss);
      this.tileSize = config.tileSize;
      this.size = this.tileSize * (this.isBoss ? 0.95 : 0.72);
      this.x = config.x * this.tileSize + (this.tileSize - this.size) / 2;
      this.y = config.y * this.tileSize + (this.tileSize - this.size) / 2;
      this.home = { x: this.x, y: this.y };
      this.speed = this.isBoss ? 54 : 44 + config.level * 5;
      this.maxHealth = this.isBoss ? 90 + config.level * 35 : 42 + config.level * 16;
      this.health = this.maxHealth;
      this.damage = this.isBoss ? 22 : 12 + config.level * 2;
      this.questionsRequired = this.isBoss ? 3 + Math.floor(config.level / 2) : 1 + Math.floor(config.level / 3);
      this.palette = config.palette;
      this.state = "patrol";
      this.facing = "right";
      this.dir = choice([[1, 0], [-1, 0], [0, 1], [0, -1]]);
      this.changeAt = 0;
      this.defeated = false;
    }

    bounds() {
      return { x: this.x + 4, y: this.y + 4, w: this.size - 8, h: this.size - 8 };
    }

    update(dt, maze, player, now) {
      if (this.defeated) return;
      const center = { x: this.x + this.size / 2, y: this.y + this.size / 2 };
      const pCenter = { x: player.x + player.size / 2, y: player.y + player.size / 2 };
      const seesPlayer = distance(center, pCenter) < this.tileSize * (this.isBoss ? 7 : 4.4);
      this.state = seesPlayer ? "chase" : "patrol";
      let dx = 0;
      let dy = 0;

      if (this.state === "chase") {
        dx = Math.sign(pCenter.x - center.x);
        dy = Math.sign(pCenter.y - center.y);
        if (Math.abs(pCenter.x - center.x) > Math.abs(pCenter.y - center.y)) dy = 0;
        else dx = 0;
      } else {
        if (now > this.changeAt) {
          this.dir = choice([[1, 0], [-1, 0], [0, 1], [0, -1]]);
          this.changeAt = now + 900 + Math.random() * 1300;
        }
        dx = this.dir[0];
        dy = this.dir[1];
      }

      if (dx < 0) this.facing = "left";
      if (dx > 0) this.facing = "right";
      const moved = this.move(dx * this.speed * dt, dy * this.speed * dt, maze);
      if (!moved && this.state === "patrol") {
        this.changeAt = 0;
      }
    }

    move(dx, dy, maze) {
      if (dx === 0 && dy === 0) return false;
      const next = { x: this.x + dx, y: this.y + dy, w: this.size, h: this.size };
      const corners = [
        [next.x + 4, next.y + 4],
        [next.x + next.w - 4, next.y + 4],
        [next.x + 4, next.y + next.h - 4],
        [next.x + next.w - 4, next.y + next.h - 4]
      ];
      const blocked = corners.some(([px, py]) => {
        const tx = Math.floor(px / this.tileSize);
        const ty = Math.floor(py / this.tileSize);
        return maze.grid[ty] && maze.grid[ty][tx] === 1;
      });
      if (!blocked) {
        this.x = next.x;
        this.y = next.y;
        return true;
      }
      return false;
    }
  }

  DinoQuest.Enemy = Enemy;
})();
