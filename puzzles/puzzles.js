// Constants

const SCALE = 2;

const SCREEN_WIDTH = 240 * SCALE;
const SCREEN_HEIGHT = 300 * SCALE;

function drawTitle(scene) {
  const titleStyle = {
    fontFamily: "monospace",
    fontSize: 30 * SCALE,
    color: "black",
    padding: {
      bottom: 2,
    },
  };
  scene.add.text(SCREEN_WIDTH / 2, 40, "PUZZLES", titleStyle).setOrigin(0.5);
}

class IndexScene extends Phaser.Scene {
  constructor() {
    super({ key: "IndexScene" });
  }

  preload() {
    this.load.image("reflect", "reflect.png");
    this.load.image("polarize", "polarize.png");
  }

  create() {
    // Title
    drawTitle(this);

    // Puzzle images
    const reflect = this.add
      .image(SCREEN_WIDTH / 2, 200, "reflect")
      .setInteractive();
    reflect.setScale(1 / 3);

    reflect.on("pointerup", (e) => {
      window.location = "https://tom-e-white.com/reflect/";
    });

    const polarize = this.add
      .image(SCREEN_WIDTH / 2, 440, "polarize")
      .setInteractive();
    polarize.setScale(1 / 3);

    polarize.on("pointerup", (e) => {
      window.location = "https://tom-e-white.com/polarize/";
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  scale: {
    parent: "phaser-game",
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  backgroundColor: "#FFFFFF",
  scene: [IndexScene],
};

const game = new Phaser.Game(config);
