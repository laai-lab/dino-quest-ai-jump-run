(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ui = new window.DinoQuest.UI();
  const game = new window.DinoQuest.Game(canvas, ui);

  document.getElementById("startBtn").addEventListener("click", () => game.start());
  document.getElementById("restartBtn").addEventListener("click", () => game.start());
  document.getElementById("menuBtn").addEventListener("click", () => game.showMenu());
  document.getElementById("pauseBtn").addEventListener("click", () => game.togglePause());
  document.getElementById("resumeBtn").addEventListener("click", () => game.togglePause());
  document.getElementById("restartFromPauseBtn").addEventListener("click", () => game.start());
  document.getElementById("jumpBtn").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    game.jump();
  });
  document.getElementById("dashBtn").addEventListener("pointerdown", (event) => {
    event.preventDefault();
    game.dash();
  });
  document.getElementById("howBtn").addEventListener("click", () => {
    const help = document.getElementById("controlHelp");
    help.hidden = !help.hidden;
  });
  document.getElementById("muteBtn").addEventListener("click", (event) => {
    const muted = event.currentTarget.getAttribute("aria-pressed") === "true";
    event.currentTarget.setAttribute("aria-pressed", String(!muted));
    event.currentTarget.textContent = muted ? "Sound" : "Muted";
    game.audio.setEnabled(muted);
  });
  document.getElementById("quizForm").addEventListener("submit", (event) => {
    event.preventDefault();
    game.submitQuizAnswer(ui.readQuizAnswer());
  });

  game.boot();
  window.DinoQuestGame = game;
})();
