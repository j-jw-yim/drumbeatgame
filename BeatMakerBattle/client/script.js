console.log("script.js loaded");

let score = 0;
let lives = 3;
let level = 1;
let sequenceLength = 4; // Starting sequence length
let beatTimeline = [];
let currentSequence = [];
let timerDuration = 10; // Timer duration in seconds
let timerInterval;
let timerRemaining = timerDuration;
let activeKeys = new Set(); // Tracks keys currently pressed

const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const sequenceDisplay = document.getElementById("sequence-display");
const timerDisplay = document.getElementById("timer");
const drumPad = document.getElementById("drum-pad");

function updateStats() {
  scoreDisplay.textContent = `Score: ${score}`;
  livesDisplay.textContent = `Lives: ${lives}`;
}

function generateSequence(length) {
  const sounds = ["kick", "snare", "hihat", "clap", "cowbell", "tom"];
  let doubleCount = 0;
  const maxDoubles = 2;

  return Array.from({ length }, (_, index) => {
    if (index >= 6 && Math.random() < 0.3 && doubleCount < maxDoubles) {
      let sound1 = sounds[Math.floor(Math.random() * sounds.length)];
      let sound2;
      do {
        sound2 = sounds[Math.floor(Math.random() * sounds.length)];
      } while (sound1 === sound2); // Avoid duplicates in pairs

      doubleCount++;
      return [sound1, sound2];
    }

    return [sounds[Math.floor(Math.random() * sounds.length)]];
  });
}

function displaySequence() {
  sequenceDisplay.innerHTML = ""; // Clear previous sequence display
  beatTimeline.forEach((beat) => {
    const cue = document.createElement("div");
    cue.classList.add("sequence-item");
    cue.innerText = beat.map((sound) => sound.toUpperCase()).join(" + ");
    sequenceDisplay.appendChild(cue);
  });
}

function startLevel() {
  beatTimeline = generateSequence(sequenceLength);
  currentSequence = [...beatTimeline]; // Copy sequence for tracking
  displaySequence();
  startTimer(); // Start the timer for the level
}

function handleCorrectHit(inputSounds) {
  if (currentSequence.length > 0) {
    const expectedSounds = currentSequence[0];
    if (
      expectedSounds.length === inputSounds.length &&
      expectedSounds.every((sound) => inputSounds.includes(sound))
    ) {
      currentSequence.shift(); // Remove matched sequence
      if (currentSequence.length === 0) {
        score++; // Increment score
        level++; // Increase level
        sequenceLength += 2; // Increase sequence length
        clearInterval(timerInterval); // Stop the timer
        updateStats();
        setTimeout(startLevel, 1000); // Start next level after 1 second
      }
    } else {
      // Incorrect input
      lives--;
      updateStats();
      if (lives <= 0) {
        clearInterval(timerInterval); // Stop the timer
        alert(`Game Over! Final Score: ${score}`);
        resetGame();
      } else {
        alert("Wrong input! Try again.");
        regenerateCurrentLevel(); // Regenerate the current level
      }
    }
  }
}

function regenerateCurrentLevel() {
  currentSequence = [...beatTimeline]; // Reset the sequence
  displaySequence();
  startTimer(); // Restart the timer
}

function attachPadListeners() {
  drumPad.addEventListener("click", (event) => {
    const pad = event.target.closest(".pad"); // Ensure the click is on a valid pad
    if (pad) {
      const sound = pad.dataset.sound;
      if (sound && window.chuckManager && chuckManager.isInitialized) {
        chuckManager.playSound(sound);
        handleCorrectHit([sound]);
      } else {
        console.error("chuckManager is not initialized or sound is invalid.");
      }
    }
  });
}

function attachKeyboardListeners() {
  const keyToSoundMap = {
    d: "kick",
    f: "snare",
    j: "hihat",
    k: "clap",
    i: "cowbell",
    e: "tom",
  };

  document.addEventListener("keydown", (event) => {
    activeKeys.add(event.key.toLowerCase());
  });

  document.addEventListener("keyup", (event) => {
    const sound = keyToSoundMap[event.key.toLowerCase()];
    if (sound && window.chuckManager && chuckManager.isInitialized) {
      chuckManager.playSound(sound);
      handleCorrectHit([...activeKeys].map((key) => keyToSoundMap[key] || ""));
    }
    activeKeys.delete(event.key.toLowerCase());
  });
}

function resetGame() {
  score = 0;
  lives = 3;
  level = 1;
  sequenceLength = 4;
  clearInterval(timerInterval); // Stop any existing timer
  updateStats();
  startLevel();
}

function startTimer() {
  timerRemaining = timerDuration; // Reset timer
  clearInterval(timerInterval); // Clear any previous interval
  timerDisplay.innerText = `Time: ${timerRemaining}s`; // Update initial display

  timerInterval = setInterval(() => {
    timerRemaining--;
    timerDisplay.innerText = `Time: ${timerRemaining}s`;
    if (timerRemaining <= 0) {
      clearInterval(timerInterval); // Stop the timer
      alert("Time's up!"); // Notify the player
      regenerateCurrentLevel(); // Regenerate the current level
    }
  }, 1000); // Update every second
}

// Game initialization
document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!window.chuckManager || !window.chuckManager.isInitialized) {
      console.log("Initializing chuckManager...");
      await window.chuckManager.initialize();
    }
    console.log("chuckManager initialized and ready.");

    resetGame();
    attachPadListeners();
    attachKeyboardListeners();
  } catch (error) {
    console.error("Error initializing chuckManager:", error);
  }
});

