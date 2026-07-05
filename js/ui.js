(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  class UI {
    constructor() {
      this.healthText = document.getElementById("healthText");
      this.healthBar = document.getElementById("healthBar");
      this.xpText = document.getElementById("xpText");
      this.coinsText = document.getElementById("coinsText");
      this.scoreText = document.getElementById("scoreText");
      this.levelText = document.getElementById("levelText");
      this.statusText = document.getElementById("statusText");
      this.toast = document.getElementById("toast");
      this.startScreen = document.getElementById("startScreen");
      this.endScreen = document.getElementById("endScreen");
      this.endTitle = document.getElementById("endTitle");
      this.endMessage = document.getElementById("endMessage");
      this.battlePanel = document.getElementById("battlePanel");
      this.battleTopic = document.getElementById("battleTopic");
      this.battleTitle = document.getElementById("battleTitle");
      this.battleTimer = document.getElementById("battleTimer");
      this.enemyName = document.getElementById("enemyName");
      this.enemyHealthBar = document.getElementById("enemyHealthBar");
      this.dinoBattleHealthBar = document.getElementById("dinoBattleHealthBar");
      this.battleProgress = document.getElementById("battleProgress");
      this.questionType = document.getElementById("questionType");
      this.questionDifficulty = document.getElementById("questionDifficulty");
      this.questionPrompt = document.getElementById("questionPrompt");
      this.answerForm = document.getElementById("answerForm");
      this.answerOptions = document.getElementById("answerOptions");
      this.freeAnswerWrap = document.getElementById("freeAnswerWrap");
      this.freeAnswer = document.getElementById("freeAnswer");
      this.submitAnswerBtn = document.getElementById("submitAnswerBtn");
      this.battleFeedback = document.getElementById("battleFeedback");
      this.toastTimer = 0;
    }

    updateHud(game) {
      const player = game.player;
      const healthPct = Math.max(0, Math.round((player.health / player.maxHealth) * 100));
      this.healthText.textContent = `${Math.ceil(player.health)} / ${player.maxHealth}`;
      this.healthBar.style.width = `${healthPct}%`;
      this.xpText.textContent = player.xp;
      this.coinsText.textContent = player.coins;
      this.scoreText.textContent = player.score;
      this.levelText.textContent = game.level;
    }

    setStatus(text) {
      this.statusText.textContent = text;
    }

    showToast(text) {
      this.toast.textContent = text;
      this.toast.classList.add("is-visible");
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.toast.classList.remove("is-visible"), 1900);
    }

    showStart() {
      this.startScreen.classList.add("is-visible");
      this.endScreen.classList.remove("is-visible");
    }

    hideStart() {
      this.startScreen.classList.remove("is-visible");
      this.endScreen.classList.remove("is-visible");
    }

    showEnd(title, message) {
      this.endTitle.textContent = title;
      this.endMessage.textContent = message;
      this.endScreen.classList.add("is-visible");
    }

    showBattle(enemy, totalQuestions) {
      this.battlePanel.classList.add("is-visible");
      this.battlePanel.setAttribute("aria-hidden", "false");
      this.battleTopic.textContent = enemy.topic;
      this.battleTitle.textContent = enemy.isBoss ? "Boss Knowledge Gate" : "AI Bot Encounter";
      this.enemyName.textContent = enemy.name;
      this.battleProgress.textContent = `Question 1 / ${totalQuestions}`;
      this.battleFeedback.textContent = "";
    }

    hideBattle() {
      this.battlePanel.classList.remove("is-visible");
      this.battlePanel.setAttribute("aria-hidden", "true");
      this.battleFeedback.textContent = "";
    }

    renderQuestion(question, index, total, enemy, player, questionEngine) {
      this.battleProgress.textContent = `Question ${index} / ${total}`;
      this.questionType.textContent = questionEngine.formatType(question.type);
      this.questionDifficulty.textContent = `Difficulty ${question.difficulty}`;
      this.questionPrompt.textContent = question.prompt;
      this.battleFeedback.textContent = "";
      this.enemyHealthBar.style.width = `${Math.max(0, (enemy.health / enemy.maxHealth) * 100)}%`;
      this.dinoBattleHealthBar.style.width = `${Math.max(0, (player.health / player.maxHealth) * 100)}%`;
      this.answerOptions.innerHTML = "";
      this.freeAnswer.value = "";

      if (question.type === "multiple-choice") {
        this.freeAnswerWrap.style.display = "none";
        this.answerOptions.style.display = "grid";
        question.options.forEach((option, index) => {
          const id = `answer-${index}`;
          const label = document.createElement("label");
          label.setAttribute("for", id);
          const input = document.createElement("input");
          input.type = "radio";
          input.name = "answer";
          input.id = id;
          input.value = option;
          if (index === 0) input.checked = true;
          const span = document.createElement("span");
          span.textContent = option;
          label.append(input, span);
          this.answerOptions.append(label);
        });
      } else {
        this.freeAnswerWrap.style.display = "grid";
        this.answerOptions.style.display = "none";
        this.freeAnswer.placeholder = question.placeholder || "Type the exact missing code, query, output, or fix.";
        setTimeout(() => this.freeAnswer.focus(), 30);
      }
    }

    readAnswer(question) {
      if (question.type === "multiple-choice") {
        const checked = this.answerOptions.querySelector("input:checked");
        return checked ? checked.value : "";
      }
      return this.freeAnswer.value;
    }

    updateBattleTimer(seconds, enemy, player) {
      this.battleTimer.textContent = seconds;
      this.enemyHealthBar.style.width = `${Math.max(0, (enemy.health / enemy.maxHealth) * 100)}%`;
      this.dinoBattleHealthBar.style.width = `${Math.max(0, (player.health / player.maxHealth) * 100)}%`;
    }

    flashBattleFeedback(text, good) {
      this.battleFeedback.textContent = text;
      this.battleFeedback.style.color = good ? "#1f7a55" : "#b42318";
    }
  }

  DinoQuest.UI = UI;
})();
