(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});
  const { randInt, shuffle, tileKey } = DinoQuest.Utils;

  class MazeGenerator {
    constructor(level, minCols, minRows) {
      this.level = level;
      this.cols = Math.max(31 + level * 6, minCols || 0);
      this.rows = Math.max(21 + level * 4, minRows || 0);
      if (this.cols % 2 === 0) this.cols += 1;
      if (this.rows % 2 === 0) this.rows += 1;
      this.grid = Array.from({ length: this.rows }, () => Array(this.cols).fill(1));
      this.floorCells = [];
    }

    generate() {
      this.carve(1, 1);
      this.openExtraPaths();
      this.collectFloorCells();
      const start = { x: 1, y: 1 };
      const exit = this.findFarthest(start);
      this.grid[exit.y][exit.x] = 4;
      const checkpoint = this.findCheckpoint(start, exit);
      this.grid[checkpoint.y][checkpoint.x] = 3;
      this.placeTraps();
      return {
        cols: this.cols,
        rows: this.rows,
        grid: this.grid,
        floorCells: this.floorCells,
        start,
        exit,
        checkpoint
      };
    }

    carve(x, y) {
      this.grid[y][x] = 0;
      const directions = shuffle([
        [2, 0],
        [-2, 0],
        [0, 2],
        [0, -2]
      ]);
      directions.forEach(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        if (nx > 0 && ny > 0 && nx < this.cols - 1 && ny < this.rows - 1 && this.grid[ny][nx] === 1) {
          this.grid[y + dy / 2][x + dx / 2] = 0;
          this.carve(nx, ny);
        }
      });
    }

    openExtraPaths() {
      const openings = Math.floor(this.cols * this.rows * (0.025 + this.level * 0.004));
      for (let i = 0; i < openings; i += 1) {
        const x = randInt(2, this.cols - 3);
        const y = randInt(2, this.rows - 3);
        if (this.grid[y][x] === 1) {
          const horizontal = this.grid[y][x - 1] === 0 && this.grid[y][x + 1] === 0;
          const vertical = this.grid[y - 1][x] === 0 && this.grid[y + 1][x] === 0;
          if (horizontal || vertical || Math.random() < 0.18) {
            this.grid[y][x] = 0;
          }
        }
      }
    }

    collectFloorCells() {
      this.floorCells = [];
      for (let y = 1; y < this.rows - 1; y += 1) {
        for (let x = 1; x < this.cols - 1; x += 1) {
          if (this.grid[y][x] === 0) {
            this.floorCells.push({ x, y });
          }
        }
      }
    }

    findFarthest(start) {
      const seen = new Set([tileKey(start.x, start.y)]);
      const queue = [{ ...start, d: 0 }];
      let farthest = queue[0];
      while (queue.length) {
        const cell = queue.shift();
        if (cell.d > farthest.d) farthest = cell;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const nx = cell.x + dx;
          const ny = cell.y + dy;
          const key = tileKey(nx, ny);
          if (!seen.has(key) && this.isFloor(nx, ny)) {
            seen.add(key);
            queue.push({ x: nx, y: ny, d: cell.d + 1 });
          }
        });
      }
      return { x: farthest.x, y: farthest.y };
    }

    findCheckpoint(start, exit) {
      let best = this.floorCells[0];
      let bestScore = Infinity;
      this.floorCells.forEach((cell) => {
        const fromStart = Math.abs(cell.x - start.x) + Math.abs(cell.y - start.y);
        const fromExit = Math.abs(cell.x - exit.x) + Math.abs(cell.y - exit.y);
        const score = Math.abs(fromStart - fromExit);
        if (fromStart > 6 && fromExit > 6 && score < bestScore) {
          best = cell;
          bestScore = score;
        }
      });
      return { ...best };
    }

    placeTraps() {
      const trapCount = Math.min(8 + this.level * 3, Math.floor(this.floorCells.length * 0.08));
      const reserved = new Set(["1,1"]);
      let placed = 0;
      while (placed < trapCount) {
        const cell = this.floorCells[randInt(0, this.floorCells.length - 1)];
        const key = tileKey(cell.x, cell.y);
        if (!reserved.has(key) && this.grid[cell.y][cell.x] === 0 && Math.abs(cell.x - 1) + Math.abs(cell.y - 1) > 5) {
          this.grid[cell.y][cell.x] = 2;
          reserved.add(key);
          placed += 1;
        }
      }
    }

    isFloor(x, y) {
      return y >= 0 && x >= 0 && y < this.rows && x < this.cols && this.grid[y][x] !== 1;
    }
  }

  DinoQuest.MazeGenerator = MazeGenerator;
})();
