(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  function roundRect(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawBackground(ctx, game) {
    const { width, height, worldTime, level, speed } = game;
    const groundY = game.groundY;
    const cycle = 0.5 + Math.sin(worldTime * 0.05) * 0.5;
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, `hsl(${218 + cycle * 24}, 64%, ${10 + cycle * 6}%)`);
    sky.addColorStop(0.54, "#101a2f");
    sky.addColorStop(1, "#111827");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#dbeafe";
    game.stars.forEach((star) => {
      const alpha = 0.25 + Math.sin(worldTime * star.twinkle + star.x) * 0.25;
      ctx.globalAlpha = Math.max(0.12, alpha);
      ctx.fillRect(star.x, star.y, star.s, star.s);
    });
    ctx.restore();

    game.clouds.forEach((cloud, index) => {
      cloud.x -= (speed * 0.006 + cloud.s * 8) * game.deltaScale;
      if (cloud.x < -160) cloud.x = width + game.utils.rand(20, 180);
      ctx.save();
      ctx.globalAlpha = 0.08 + index * 0.015;
      ctx.fillStyle = "#e0f2fe";
      roundRect(ctx, cloud.x, cloud.y, 98 * cloud.s, 22 * cloud.s, 20);
      ctx.fill();
      roundRect(ctx, cloud.x + 28 * cloud.s, cloud.y - 13 * cloud.s, 58 * cloud.s, 28 * cloud.s, 24);
      ctx.fill();
      ctx.restore();
    });

    drawMountainLayer(ctx, game, 0.16, "#17233d", 130 + level * 5);
    drawMountainLayer(ctx, game, 0.28, "#1e2d49", 86 + level * 4);

    const gridOffset = (worldTime * speed * 0.35) % 48;
    ctx.fillStyle = "#0a1222";
    ctx.fillRect(0, groundY, width, height - groundY);
    ctx.strokeStyle = "rgba(82, 224, 255, 0.22)";
    ctx.lineWidth = 1;
    for (let x = -48; x < width + 48; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x - gridOffset, groundY + 6);
      ctx.lineTo(x - gridOffset - 88, height);
      ctx.stroke();
    }
    for (let y = groundY + 20; y < height; y += 28) {
      ctx.globalAlpha = 1 - (y - groundY) / Math.max(1, height - groundY);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#52e0ff";
    ctx.fillRect(0, groundY - 2, width, 3);
  }

  function drawMountainLayer(ctx, game, factor, color, peakHeight) {
    const width = game.width;
    const groundY = game.groundY;
    const offset = (game.worldTime * game.speed * factor) % 280;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-320, groundY);
    for (let x = -320; x < width + 360; x += 140) {
      const peak = groundY - peakHeight - Math.sin((x + game.level * 51) * 0.03) * 28;
      ctx.lineTo(x - offset + 70, peak);
      ctx.lineTo(x - offset + 140, groundY);
    }
    ctx.lineTo(width + 360, groundY);
    ctx.closePath();
    ctx.fill();
  }

  function drawDino(ctx, dino, time) {
    const step = dino.grounded ? Math.sin(time * 18) : 0.35;
    const lean = dino.dash > 0 ? 8 : 0;

    ctx.save();
    if (dino.invulnerable > 0) ctx.globalAlpha = 0.55 + Math.sin(time * 30) * 0.25;
    ctx.shadowColor = dino.shield > 0 ? "#7df29c" : "#52e0ff";
    ctx.shadowBlur = dino.shield > 0 ? 22 : 12;

    ctx.fillStyle = "#79f2ff";
    roundRect(ctx, dino.x + lean, dino.y + 10, 44, 36, 10);
    ctx.fill();
    roundRect(ctx, dino.x + 32 + lean, dino.y, 30, 28, 9);
    ctx.fill();

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#08111f";
    ctx.fillRect(dino.x + 51 + lean, dino.y + 9, 5, 5);

    ctx.fillStyle = "#7df29c";
    roundRect(ctx, dino.x - 12 + lean, dino.y + 22, 20, 10, 5);
    ctx.fill();

    ctx.fillStyle = "#52e0ff";
    roundRect(ctx, dino.x + 9 + step * 4 + lean, dino.y + 42, 9, 21, 4);
    ctx.fill();
    roundRect(ctx, dino.x + 28 - step * 4 + lean, dino.y + 42, 9, 21, 4);
    ctx.fill();

    if (dino.shield > 0) {
      ctx.strokeStyle = "rgba(125, 242, 156, 0.8)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(dino.x + 29, dino.y + 31, 48, 42, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (dino.dash > 0) {
      ctx.globalAlpha = 0.32;
      ctx.fillStyle = "#9d8cff";
      roundRect(ctx, dino.x - 42, dino.y + 17, 34, 14, 8);
      ctx.fill();
      roundRect(ctx, dino.x - 60, dino.y + 35, 44, 9, 8);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawObstacle(ctx, obstacle, time) {
    ctx.save();
    if (obstacle.type === "bird") {
      const flap = Math.sin(time * 16 + obstacle.x * 0.02);
      ctx.fillStyle = "#ff7aa2";
      roundRect(ctx, obstacle.x, obstacle.y + 8, obstacle.w, obstacle.h - 8, 8);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(obstacle.x + 12, obstacle.y + 12, 18, 7 + flap * 5, 0, 0, Math.PI * 2);
      ctx.ellipse(obstacle.x + 34, obstacle.y + 12, 18, 7 - flap * 5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (obstacle.type === "rock") {
      ctx.fillStyle = "#c084fc";
      roundRect(ctx, obstacle.x, obstacle.y, obstacle.w, obstacle.h, 8);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      roundRect(ctx, obstacle.x + 8, obstacle.y + 7, obstacle.w * 0.4, 7, 6);
      ctx.fill();
    } else {
      ctx.fillStyle = "#7df29c";
      ctx.shadowColor = "#7df29c";
      ctx.shadowBlur = 12;
      roundRect(ctx, obstacle.x, obstacle.y, obstacle.w, obstacle.h, 6);
      ctx.fill();
      ctx.shadowBlur = 0;
      roundRect(ctx, obstacle.x - 10, obstacle.y + 13, 13, 8, 4);
      ctx.fill();
      roundRect(ctx, obstacle.x + obstacle.w - 2, obstacle.y + 21, 13, 8, 4);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCollectible(ctx, item, time) {
    const bob = Math.sin(time * 5 + item.x * 0.02) * 5;
    ctx.save();
    if (item.kind === "coin") {
      ctx.fillStyle = "#ffd166";
      ctx.shadowColor = "#ffd166";
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(item.x, item.y + bob, item.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "#7c4d00";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(item.x, item.y + bob, item.r - 4, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      const color = item.kind === "shield" ? "#7df29c" : item.kind === "slow" ? "#52e0ff" : "#ff5d7d";
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(item.x, item.y + bob, item.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#08111f";
      ctx.font = "900 13px system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(item.kind === "shield" ? "S" : item.kind === "slow" ? "T" : "+", item.x, item.y + bob + 1);
    }
    ctx.restore();
  }

  function drawParticles(ctx, particles) {
    particles.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  DinoQuest.Assets = {
    roundRect,
    drawBackground,
    drawDino,
    drawObstacle,
    drawCollectible,
    drawParticles
  };
})();
