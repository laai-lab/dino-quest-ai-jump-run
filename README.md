# Dino Quest

A modern educational Chrome Dinosaur-style endless runner built with plain HTML, CSS, and vanilla JavaScript.

## Play

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Replit

Import this folder as a static HTML/CSS/JS project. There is no backend, framework, package install, or build step.

## Controls

- Jump: `Space`, `ArrowUp`, `W`, tap the canvas, or use the mobile Jump button
- Double jump: jump again while airborne
- Dash: `Shift`, `D`, `ArrowDown`, or use the mobile Dash button
- Pause: `P`, `Escape`, or the Pause button

## Gameplay

Run through an endless neon desert, dodge cacti, rocks, and flying obstacles, collect coins and power-ups, and answer quiz gates every few obstacles. Questions cover Maths, Science, History, and Geography up to Class 8 level.

Correct answers award points, unlock the next stage, and increase speed. Incorrect answers cost one life. The HUD tracks score, high score, lives, level, and progress to the next quiz gate.

## Project Structure

- `index.html` - game shell and overlays
- `css/styles.css` - responsive dark UI
- `data/questions.js` - multiple-choice question bank
- `js/` - modular game, UI, audio, question, utility, and canvas asset code
- `assets/` - optional drop-in folder for future image or audio files
