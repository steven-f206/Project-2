var gameSettings = {
    playerSpeed: 200,
}

var config = {
    width: 1280,
    height: 720,
    backgroundColor: 0x000000,
    scene: [StartScene],
    pixelArt: true,
    physics: { 
        default: "arcade",
        arcade:{
            debug: false,
        }
    }
}

var game = new Phaser.Game(config);