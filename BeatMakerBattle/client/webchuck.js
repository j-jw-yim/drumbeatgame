class WebChucKManager {
  constructor() {
    this.chuck = null;
    this.isInitialized = false;

    // Initialize WebChucK
    Chuck.init([])
      .then((chuck) => {
        this.chuck = chuck;
        this.isInitialized = true;
        console.log("ChucK initialized successfully!");
      })
      .catch((error) => {
        console.error("Error initializing ChucK:", error);
      });
  }

  async initialize() {
    if (this.isInitialized) {
      console.log("ChucK is already initialized.");
      return;
    }

    try {
      this.chuck = await Chuck.init([]);
      this.isInitialized = true;
      console.log("ChucK initialized successfully!");
    } catch (error) {
      console.error("Error initializing ChucK:", error);
    }
  }

  playSound(sound) {
    if (!this.isInitialized || !this.chuck) {
      console.error("ChucK is not initialized. Cannot play sound.");
      return;
    }

    if (this.chuck.context.state === "suspended") {
      this.chuck.context.resume().then(() => {
        console.log("AudioContext resumed.");
      });
    }

    const chuckCode = `
      SndBuf buf => dac;
      buf.read("./sounds/${sound}.wav");
      1 => buf.gain;
      0 => buf.pos;
      buf.play();
    `;

    try {
      console.log(`Playing sound: ${sound}`);
      this.chuck.runCode(chuckCode);
    } catch (error) {
      console.error("Error running ChucK code:", error);
    }
  }
}

// Attach WebChucKManager to window
window.chuckManager = new WebChucKManager();
await window.chuckManager.initialize();
console.log("WebChucKManager initialized:", window.chuckManager);
