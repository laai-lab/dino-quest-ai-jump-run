(function () {
  "use strict";

  const canvas = document.getElementById("gameCanvas");
  const ui = new window.DinoQuest.UI();
  const game = new window.DinoQuest.Game(canvas, ui);

  document.getElementById("newGameBtn").addEventListener("click", () => game.startNewGame());
  document.getElementById("continueBtn").addEventListener("click", () => game.load());
  document.getElementById("restartBtn").addEventListener("click", () => game.startNewGame());
  document.getElementById("saveBtn").addEventListener("click", () => {
    game.audio.ensure();
    game.save();
    ui.showToast("Quest saved.");
  });
  document.getElementById("loadBtn").addEventListener("click", () => {
    game.audio.ensure();
    game.load();
  });
  document.getElementById("muteBtn").addEventListener("click", (event) => {
    const enabled = event.currentTarget.getAttribute("aria-pressed") !== "true";
    event.currentTarget.setAttribute("aria-pressed", String(enabled));
    event.currentTarget.textContent = enabled ? "Muted" : "Sound";
    game.audio.setEnabled(!enabled);
  });

  game.boot();
  window.DinoQuestGame = game;
})();
