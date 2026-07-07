(function () {
  "use strict";

  const DinoQuest = window.DinoQuest || (window.DinoQuest = {});

  class AudioManager {
    constructor() {
      this.enabled = true;
      this.ctx = null;
    }

    ensure() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) this.ctx = new AudioContext();
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    }

    setEnabled(enabled) {
      this.enabled = enabled;
    }

    beep(type, frequency, duration, volume) {
      if (!this.enabled) return;
      this.ensure();
      if (!this.ctx) return;
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gain.gain.value = volume;
      oscillator.connect(gain);
      gain.connect(this.ctx.destination);
      oscillator.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      oscillator.stop(this.ctx.currentTime + duration);
    }

    jump() {
      this.beep("triangle", 620, 0.08, 0.08);
    }

    dash() {
      this.beep("sawtooth", 230, 0.09, 0.09);
    }

    collect() {
      this.beep("sine", 940, 0.05, 0.07);
    }

    power() {
      this.beep("square", 520, 0.1, 0.09);
    }

    correct() {
      this.beep("triangle", 760, 0.1, 0.1);
      setTimeout(() => this.beep("triangle", 980, 0.1, 0.08), 90);
    }

    wrong() {
      this.beep("sawtooth", 150, 0.18, 0.1);
    }

    hit() {
      this.beep("square", 110, 0.12, 0.09);
    }
  }

  DinoQuest.AudioManager = AudioManager;
})();
