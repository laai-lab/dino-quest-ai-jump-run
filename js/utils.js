(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  DinoQuest.Utils = {
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    choice(items) {
      return items[Math.floor(Math.random() * items.length)];
    },

    shuffle(items) {
      const copy = items.slice();
      for (let i = copy.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },

    distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy);
    },

    rectsOverlap(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    },

    normalizeAnswer(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/;$/, "");
    },

    tileKey(x, y) {
      return `${x},${y}`;
    },

    seededName(prefix, level, index) {
      const names = ["Tensor", "Query", "Prompt", "Vector", "Kernel", "Token", "Circuit", "Schema"];
      return `${DinoQuest.Utils.choice(names)} ${prefix}-${level}.${index + 1}`;
    }
  };
})();
