(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  function pixel(ctx, x, y, size, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), size, size);
  }

  function spriteFromGrid(ctx, x, y, scale, grid, palette, flip) {
    ctx.save();
    if (flip) {
      ctx.translate(x + grid[0].length * scale, y);
      ctx.scale(-1, 1);
      x = 0;
      y = 0;
    }
    for (let row = 0; row < grid.length; row += 1) {
      for (let col = 0; col < grid[row].length; col += 1) {
        const key = grid[row][col];
        if (key !== "." && palette[key]) {
          pixel(ctx, x + col * scale, y + row * scale, scale, palette[key]);
        }
      }
    }
    ctx.restore();
  }

  const dinoGrid = [
    ".....gggg.......",
    "....ggGGgg......",
    "...ggGGGGg..ww..",
    "..ggGGGGGg..wk..",
    ".ggGGGGGGgg.....",
    ".gGGGGGGGGgg....",
    ".gGGGGGGGGGGg...",
    "..ggGppGGGGGg...",
    "...ggggGGGGgg...",
    "....g..g..g.....",
    "...gg..gg.gg....",
    "...g...g...g...."
  ];

  const botGrid = [
    "...bbbbbb...",
    "..bBBBBBBb..",
    ".bBBcBBcBBb.",
    ".bBBBBBBBBb.",
    ".bBrrrrrrBb.",
    "..bBBBBBBb..",
    "...bBbbBb...",
    "..mm....mm..",
    ".mm......mm."
  ];

  const bossGrid = [
    "...rrrrrrrr...",
    "..rRRRRRRRRr..",
    ".rRRyRRRRyRRr.",
    ".rRRRRRRRRRRr.",
    ".rRbbbbbbbbRr.",
    "..rRRRRRRRRr..",
    ".vv.rRRRRr.vv.",
    "vv...rrrr...vv",
    "v............v"
  ];

  DinoQuest.Assets = {
    drawTile(ctx, tile, x, y, size, time) {
      if (tile === 1) {
        ctx.fillStyle = "#334155";
        ctx.fillRect(x, y, size, size);
        ctx.fillStyle = "#475569";
        ctx.fillRect(x + 3, y + 3, size - 6, size - 6);
        ctx.fillStyle = "rgba(255,255,255,0.08)";
        ctx.fillRect(x + 3, y + 3, size - 6, 3);
        return;
      }

      ctx.fillStyle = "#203048";
      ctx.fillRect(x, y, size, size);
      ctx.fillStyle = "#263958";
      ctx.fillRect(x + 1, y + 1, size - 2, size - 2);
      if ((Math.floor(x / size) + Math.floor(y / size)) % 2 === 0) {
        ctx.fillStyle = "rgba(111,182,255,0.06)";
        ctx.fillRect(x + 5, y + 5, size - 10, size - 10);
      }
      if (tile === 2) {
        const pulse = 0.55 + Math.sin(time * 8) * 0.2;
        ctx.fillStyle = `rgba(239, 93, 88, ${pulse})`;
        ctx.beginPath();
        ctx.moveTo(x + size * 0.5, y + 6);
        ctx.lineTo(x + size - 6, y + size - 6);
        ctx.lineTo(x + 6, y + size - 6);
        ctx.closePath();
        ctx.fill();
      }
      if (tile === 3) {
        ctx.fillStyle = "#44d39d";
        ctx.fillRect(x + 8, y + 8, size - 16, size - 16);
        ctx.fillStyle = "#fff8de";
        ctx.fillRect(x + 12, y + 12, size - 24, size - 24);
      }
      if (tile === 4) {
        ctx.fillStyle = "#f6bd3a";
        ctx.fillRect(x + 8, y + 8, size - 16, size - 16);
        ctx.fillStyle = "#fff8de";
        ctx.fillRect(x + 12, y + 12, size - 24, 5);
      }
    },

    drawPlayer(ctx, x, y, size, direction, time, shield) {
      const bob = Math.sin(time * 10) * 1.6;
      const scale = Math.max(2, Math.round(size / 14));
      if (shield) {
        ctx.strokeStyle = "rgba(111, 182, 255, 0.78)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size * 0.72, 0, Math.PI * 2);
        ctx.stroke();
      }
      spriteFromGrid(ctx, x - 2, y - 2 + bob, scale, dinoGrid, {
        g: "#2f9b67",
        G: "#58d68d",
        p: "#f6bd3a",
        w: "#f8fafc",
        k: "#17202a"
      }, direction === "left");
    },

    drawEnemy(ctx, enemy, x, y, size, time) {
      const pulse = Math.sin(time * 7 + enemy.id) * 2;
      const grid = enemy.isBoss ? bossGrid : botGrid;
      const palette = enemy.isBoss ? {
        r: "#9b2c2c",
        R: "#ef5d58",
        y: "#f6bd3a",
        b: "#17202a",
        v: "#7056d8"
      } : {
        b: "#263447",
        B: enemy.palette || "#6fb6ff",
        c: "#44d39d",
        r: "#ef5d58",
        m: "#f6bd3a"
      };
      spriteFromGrid(ctx, x + 2, y + 4 + pulse, enemy.isBoss ? 2.2 : 2.3, grid, palette, enemy.facing === "left");
    },

    drawCollectible(ctx, item, x, y, size, time) {
      const cy = y + size / 2 + Math.sin(time * 5 + item.x) * 2;
      ctx.save();
      ctx.translate(x + size / 2, cy);
      if (item.type === "coin") {
        ctx.fillStyle = "#f6bd3a";
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff8de";
        ctx.fillRect(-2, -5, 4, 10);
      } else if (item.type === "heart") {
        ctx.fillStyle = "#ef5d58";
        ctx.fillRect(-7, -3, 14, 12);
        ctx.fillRect(-4, -7, 8, 16);
      } else if (item.type === "xp") {
        ctx.fillStyle = "#7056d8";
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-7, -7, 14, 14);
      } else if (item.type === "shield") {
        ctx.fillStyle = "#6fb6ff";
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(9, -3);
        ctx.lineTo(5, 9);
        ctx.lineTo(0, 12);
        ctx.lineTo(-5, 9);
        ctx.lineTo(-9, -3);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  };
})();
