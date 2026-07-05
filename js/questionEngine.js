(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});
  const { normalizeAnswer, shuffle } = DinoQuest.Utils;

  class QuestionEngine {
    constructor() {
      this.questions = [];
      this.used = new Set();
    }

    async load() {
      this.questions = (window.DINO_QUEST_QUESTIONS && window.DINO_QUEST_QUESTIONS.questions) || [];
      if (location.protocol !== "file:") {
        try {
          const response = await fetch("data/questions.json", { cache: "no-store" });
          if (response.ok) {
            const json = await response.json();
            if (Array.isArray(json.questions) && json.questions.length) {
              this.questions = json.questions;
            }
          }
        } catch (error) {
          console.warn("Using bundled question data.", error);
        }
      }
      return this.questions;
    }

    getQuestion(topic, level, typeHint) {
      const desiredDifficulty = Math.min(5, Math.max(1, Math.ceil(level)));
      let pool = this.questions.filter((question) => {
        const topicMatch = question.topic === topic || Math.random() < 0.3;
        const difficultyMatch = question.difficulty <= desiredDifficulty + 1;
        const typeMatch = !typeHint || question.type === typeHint || Math.random() < 0.22;
        return topicMatch && difficultyMatch && typeMatch && !this.used.has(question.id);
      });

      if (!pool.length) {
        this.used.clear();
        pool = this.questions.filter((question) => question.difficulty <= desiredDifficulty + 1);
      }

      const question = shuffle(pool)[0] || this.questions[0];
      if (question) this.used.add(question.id);
      return question;
    }

    isCorrect(question, submitted) {
      if (!question) return false;
      if (question.type === "multiple-choice") {
        return normalizeAnswer(submitted) === normalizeAnswer(question.answer);
      }
      const accepted = Array.isArray(question.acceptedAnswers) ? question.acceptedAnswers : [question.answer];
      const normalized = normalizeAnswer(submitted);
      return accepted.some((answer) => normalizeAnswer(answer) === normalized);
    }

    formatType(type) {
      return {
        "multiple-choice": "Multiple Choice",
        "code-completion": "Code Completion",
        debugging: "Debugging",
        sql: "SQL Query",
        "output-prediction": "Output Prediction"
      }[type] || "Challenge";
    }
  }

  DinoQuest.QuestionEngine = QuestionEngine;
})();
