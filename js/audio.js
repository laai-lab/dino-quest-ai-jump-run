(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  class AudioManager {
    constructor() {
      this.context = null;
      this.enabled = true;
      this.master = null;
    }

    ensure() {
      if (!this.context) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        this.context = new AudioContext();
        this.master = this.context.createGain();
        this.master.gain.value = 0.08;
        this.master.connect(this.context.destination);
      }
      if (this.context.state === "suspended") {
        this.context.resume();
      }
    }

    setEnabled(enabled) {
      this.enabled = enabled;
      if (this.master) {
        this.master.gain.value = enabled ? 0.08 : 0;
      }
    }

    beep(type) {
      if (!this.enabled) return;
      this.ensure();
      if (!this.context || !this.master) return;
      const now = this.context.currentTime;
      const osc = this.context.createOscillator();
      const gain = this.context.createGain();
      const notes = {
        coin: [880, 1175, 0.08],
        hurt: [160, 90, 0.16],
        correct: [523, 784, 0.14],
        wrong: [220, 165, 0.18],
        battle: [330, 196, 0.2],
        win: [659, 988, 0.22],
        checkpoint: [392, 659, 0.16]
      };
      const [start, end, length] = notes[type] || notes.coin;
      osc.type = type === "hurt" || type === "wrong" ? "sawtooth" : "square";
      osc.frequency.setValueAtTime(start, now);
      osc.frequency.exponentialRampToValueAtTime(Math.max(40, end), now + length);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.45, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + length);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now);
      osc.stop(now + length + 0.02);
    }
  }

  DinoQuest.AudioManager = AudioManager;
})();
