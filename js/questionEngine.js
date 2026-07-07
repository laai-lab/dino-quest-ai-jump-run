(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});
  const { shuffle } = DinoQuest.Utils;

  class QuestionEngine {
    constructor(questions) {
      this.questions = questions || window.DINO_QUEST_QUESTIONS || [];
      this.used = new Set();
    }

    next(level) {
      const maxDifficulty = Math.min(3, Math.max(1, Math.ceil(level / 2)));
      let pool = this.questions.filter((question) => question.difficulty <= maxDifficulty && !this.used.has(question.question));
      if (pool.length === 0) {
        this.used.clear();
        pool = this.questions.filter((question) => question.difficulty <= maxDifficulty);
      }
      const picked = pool[Math.floor(Math.random() * pool.length)];
      this.used.add(picked.question);
      return {
        ...picked,
        options: shuffle(picked.options)
      };
    }

    check(question, answer) {
      return String(answer).trim().toLowerCase() === String(question.answer).trim().toLowerCase();
    }
  }

  DinoQuest.QuestionEngine = QuestionEngine;
})();
