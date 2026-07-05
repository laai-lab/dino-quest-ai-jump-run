(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  class BattleSystem {
    constructor(game, ui, questionEngine, audio) {
      this.game = game;
      this.ui = ui;
      this.questionEngine = questionEngine;
      this.audio = audio;
      this.enemy = null;
      this.currentQuestion = null;
      this.questionIndex = 0;
      this.correctCount = 0;
      this.totalQuestions = 1;
      this.deadline = 0;
      this.active = false;
      this.locked = false;
      this.answerHandler = (event) => {
        event.preventDefault();
        this.submit();
      };
      this.ui.answerForm.addEventListener("submit", this.answerHandler);
    }

    start(enemy) {
      this.enemy = enemy;
      this.questionIndex = 0;
      this.correctCount = 0;
      this.totalQuestions = enemy.questionsRequired;
      this.active = true;
      this.locked = false;
      this.audio.beep("battle");
      this.ui.showBattle(enemy, this.totalQuestions);
      this.nextQuestion();
    }

    nextQuestion() {
      this.questionIndex += 1;
      this.currentQuestion = this.questionEngine.getQuestion(this.enemy.topic, this.game.level, this.enemy.type);
      this.deadline = performance.now() + (this.currentQuestion.timeLimit || 30) * 1000;
      this.ui.renderQuestion(this.currentQuestion, this.questionIndex, this.totalQuestions, this.enemy, this.game.player, this.questionEngine);
    }

    update(now) {
      if (!this.active || this.locked || !this.currentQuestion) return;
      const remaining = Math.max(0, Math.ceil((this.deadline - now) / 1000));
      this.ui.updateBattleTimer(remaining, this.enemy, this.game.player);
      if (remaining <= 0) {
        this.timeout();
      }
    }

    submit() {
      if (!this.active || this.locked) return;
      const submitted = this.ui.readAnswer(this.currentQuestion);
      const correct = this.questionEngine.isCorrect(this.currentQuestion, submitted);
      if (correct) {
        this.handleCorrect();
      } else {
        this.handleWrong("Incorrect. The bot counterattacks.");
      }
    }

    handleCorrect() {
      this.locked = true;
      this.correctCount += 1;
      const damage = Math.ceil(this.enemy.maxHealth / this.totalQuestions);
      this.enemy.health = Math.max(0, this.enemy.health - damage);
      const xp = 18 + this.game.level * 8 + (this.enemy.isBoss ? 20 : 0);
      this.game.player.addXp(xp);
      this.game.player.score += 35 + this.game.level * 12;
      this.audio.beep("correct");
      this.ui.flashBattleFeedback(`Correct! ${this.enemy.name} takes ${damage} damage. +${xp} XP`, true);
      this.ui.updateHud(this.game);
      setTimeout(() => {
        this.locked = false;
        if (this.enemy.health <= 0 || this.correctCount >= this.totalQuestions) {
          this.win();
        } else {
          this.nextQuestion();
        }
      }, 850);
    }

    handleWrong(message) {
      this.locked = true;
      this.game.player.damage(this.enemy.damage, performance.now());
      this.audio.beep("wrong");
      this.ui.flashBattleFeedback(`${message} -${this.enemy.damage} health`, false);
      this.ui.updateHud(this.game);
      setTimeout(() => {
        this.locked = false;
        if (this.game.player.health <= 0) {
          this.lose("The dino ran out of health.");
        } else if (this.enemy.isBoss) {
          this.nextQuestion();
        } else {
          this.end(false);
        }
      }, 950);
    }

    timeout() {
      this.locked = true;
      this.audio.beep("hurt");
      this.game.player.damage(this.enemy.damage + 10, performance.now());
      this.ui.flashBattleFeedback("Time expired. The challenge is lost.", false);
      setTimeout(() => {
        if (this.game.player.health <= 0) {
          this.lose("The timer hit zero and the dino fainted.");
        } else {
          this.end(false);
        }
      }, 900);
    }

    win() {
      this.enemy.defeated = true;
      this.game.player.score += this.enemy.isBoss ? 600 : 180;
      this.game.player.addCoins(this.enemy.isBoss ? 8 : 2);
      this.audio.beep("win");
      this.ui.flashBattleFeedback(`${this.enemy.name} defeated!`, true);
      setTimeout(() => this.end(true), 900);
    }

    lose(reason) {
      this.end(false);
      this.game.gameOver(reason);
    }

    end(victory) {
      this.active = false;
      this.locked = false;
      this.ui.hideBattle();
      this.game.endBattle(victory, this.enemy);
      this.enemy = null;
      this.currentQuestion = null;
    }
  }

  DinoQuest.BattleSystem = BattleSystem;
})();
