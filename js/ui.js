(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  class UI {
    constructor() {
      this.scoreText = document.getElementById("scoreText");
      this.highScoreText = document.getElementById("highScoreText");
      this.livesText = document.getElementById("livesText");
      this.levelText = document.getElementById("levelText");
      this.progressFill = document.getElementById("progressFill");
      this.statusText = document.getElementById("statusText");
      this.startScreen = document.getElementById("startScreen");
      this.pauseScreen = document.getElementById("pauseScreen");
      this.quizScreen = document.getElementById("quizScreen");
      this.gameOverScreen = document.getElementById("gameOverScreen");
      this.quizForm = document.getElementById("quizForm");
      this.quizSubject = document.getElementById("quizSubject");
      this.quizLevel = document.getElementById("quizLevel");
      this.quizQuestion = document.getElementById("quizQuestion");
      this.quizOptions = document.getElementById("quizOptions");
      this.quizFeedback = document.getElementById("quizFeedback");
      this.submitQuizBtn = document.getElementById("submitQuizBtn");
      this.endEyebrow = document.getElementById("endEyebrow");
      this.endTitle = document.getElementById("endTitle");
      this.endMessage = document.getElementById("endMessage");
      this.leaderboardList = document.getElementById("leaderboardList");
    }

    updateHud(game) {
      this.scoreText.textContent = Math.floor(game.score);
      this.highScoreText.textContent = game.highScore;
      this.livesText.textContent = `x ${Math.max(0, game.lives)}`;
      this.levelText.textContent = game.level;
      this.progressFill.style.width = `${Math.round(game.progressRatio() * 100)}%`;
    }

    setStatus(text) {
      this.statusText.textContent = text;
    }

    showOnly(screen) {
      [this.startScreen, this.pauseScreen, this.quizScreen, this.gameOverScreen].forEach((item) => {
        const visible = item === screen;
        item.classList.toggle("is-visible", visible);
        item.setAttribute("aria-hidden", String(!visible));
      });
    }

    hideOverlays() {
      this.showOnly(null);
    }

    showStart() {
      this.showOnly(this.startScreen);
      this.setStatus("Ready.");
    }

    showPause() {
      this.showOnly(this.pauseScreen);
      this.setStatus("Paused.");
    }

    showQuiz(question, level) {
      this.showOnly(this.quizScreen);
      this.quizSubject.textContent = question.subject;
      this.quizLevel.textContent = `Level ${level}`;
      this.quizQuestion.textContent = question.question;
      this.quizFeedback.textContent = "";
      this.submitQuizBtn.disabled = false;
      this.quizOptions.innerHTML = "";
      question.options.forEach((option, index) => {
        const id = `quiz-option-${index}`;
        const label = document.createElement("label");
        const input = document.createElement("input");
        const span = document.createElement("span");
        input.type = "radio";
        input.name = "answer";
        input.id = id;
        input.value = option;
        if (index === 0) input.checked = true;
        span.textContent = option;
        label.setAttribute("for", id);
        label.append(input, span);
        this.quizOptions.append(label);
      });
      this.setStatus("Knowledge gate opened.");
    }

    readQuizAnswer() {
      const checked = this.quizOptions.querySelector("input:checked");
      return checked ? checked.value : "";
    }

    showQuizFeedback(text, good) {
      this.quizFeedback.textContent = text;
      this.quizFeedback.style.color = good ? "#7df29c" : "#ff8aa3";
      this.submitQuizBtn.disabled = true;
    }

    showGameOver(game, won) {
      this.showOnly(this.gameOverScreen);
      this.endEyebrow.textContent = won ? "Quest Complete" : "Run Ended";
      this.endTitle.textContent = won ? "You Cleared Dino Quest!" : "Game Over";
      this.endMessage.textContent = `Score ${Math.floor(game.score)} | Level ${game.level} | Best ${game.highScore}`;
      this.renderLeaderboard(game.leaderboard);
      this.setStatus(won ? "Quest complete." : "Run ended.");
    }

    renderLeaderboard(entries) {
      this.leaderboardList.innerHTML = "";
      const list = entries.length ? entries : [{ score: 0, level: 1, date: "No runs yet" }];
      list.forEach((entry) => {
        const li = document.createElement("li");
        li.textContent = `${entry.score} points | Level ${entry.level} | ${entry.date}`;
        this.leaderboardList.append(li);
      });
    }
  }

  DinoQuest.UI = UI;
})();
