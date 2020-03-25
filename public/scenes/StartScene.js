var jump = 0;
var message = "Try Sending a Message!";
var length = 0;
var runDirection = 1;

var players = [
    {
        username: "CornerGuy",
        userId: 32,
        message: "Hello! :)",
        x: 100,
        y: 577
    },
    {
        username: "waddup",
        userId: 56,
        message: "yo!",
        x: 780,
        y: 576
    },
    {
        username: "Fancypants",
        userId: 708,
        message: "How is it hangin'?",
        x: 1000,
        y: 576
    },
    {
        username: "MrRunsLeft",
        userId: 547,
        message: "<----",
        x: 3700,
        y: 576
    },
];

function sendMsg() {
    message = document.getElementById('msgBx').value;
    document.getElementById('msgBx').value = "";
}

function getMsg() {
    return message;
}

function getPlyrs() {
    return players;
}

class StartScene extends Phaser.Scene {
    constructor() {
        super("StartScene");
    }

    preload() {
        this.load.image("sky", "img/skytile.png");
        this.load.image("grass", "img/grasstile.png");
        this.load.image("dirt", "img/dirttile.png");
        this.load.spritesheet("player", "img/knightsprite.png",{
            frameWidth: 256,
            frameHeight: 256
        });
    }

    create() {

        this.sky = this.add.tileSprite(0,0, game.config.width, game.config.height, "sky");
        this.sky.setOrigin(0, 0);
        this.sky.setScrollFactor(0);

        this.grass = this.add.tileSprite(0,0, game.config.width, 96, "grass");
        this.grass.setOrigin(0, 0);
        this.grass.setScrollFactor(0);
        this.grass.y = 528;

        this.dirt = this.add.tileSprite(0,0, game.config.width, 96, "dirt");
        this.dirt.setOrigin(0, 0);
        this.dirt.setScrollFactor(0);
        this.dirt.y = 624;

        this.player = this.physics.add.sprite(game.config.width * 1.5, game.config.height / 2, "player");
        this.player.y = 576;

        this.anims.create({
            key: "idle",
            frames: this.anims.generateFrameNumbers("player", {start: 0, end: 9}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers("player", {start: 10, end: 18}),
            frameRate: 25,
            repeat: -1
        });

        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNumbers("player", {start: 16, end: 17}),
            frameRate: 1,
            repeat: -1
        });

        this.anims.create({
            key: "crouch",
            frames: this.anims.generateFrameNumbers("player", {start: 19, end: 19}),
            frameRate: 1,
            repeat: -1
        });

        this.player.play("idle");

        var curPlayers = getPlyrs();

        for(var i = 0; i < curPlayers.length; i++) {

            this[`${curPlayers[i].userId}`] = this.add.sprite(game.config.width * 1.5, game.config.height / 2, "player");
            this[`${curPlayers[i].userId}`].y = curPlayers[i].y;
            this[`${curPlayers[i].userId}`].x = curPlayers[i].x;
            this[`${curPlayers[i].userId}`].play("idle");

            this[`${curPlayers[i].userId}message`] = this.add.text(0,0,`${curPlayers[i].message}`,{
                fontSize:'20px',backgroundColor:'#00000080',
            });

            this[`${curPlayers[i].userId}username`] = this.add.text(0,0,`${curPlayers[i].username}`,{
                fontSize:'25px',backgroundColor:'#000000',
            });

            this[`${curPlayers[i].userId}username`].x = curPlayers[i].x - 50;
            this[`${curPlayers[i].userId}username`].y = curPlayers[i].y - 175;
            this[`${curPlayers[i].userId}message`].x = curPlayers[i].x - 50;
            this[`${curPlayers[i].userId}message`].y = curPlayers[i].y - 125;

        }

        this.cursors = this.input.keyboard.createCursorKeys();
        this.myCam = this.cameras.main;
        this.myCam.setBounds(0, 0, game.config.width * 3, game.config.height);
        this.myCam.startFollow(this.player);

        this.username = this.add.text(0,0,"Username",{
            fontSize:'25px',backgroundColor:'#000000',
        });

        this.message = this.add.text(0,0,"message",{
            fontSize:'20px',backgroundColor:'#00000080',
        });

    }

    update() {

        var curPlayers = getPlyrs();

        if (curPlayers.length !== length && length !== 0) {
            window.location.reload(true);
        }

        length = curPlayers.length;

        for (var i = 0; i < curPlayers.length; i++) {

            if (curPlayers[i].x > this[`${curPlayers[i].userId}`].x) {
                this[`${curPlayers[i].userId}`].scaleX = 1;
                this[`${curPlayers[i].userId}`].play("run", true);

            } else if (curPlayers[i].x < this[`${curPlayers[i].userId}`].x) {
                this[`${curPlayers[i].userId}`].scaleX = -1;
                this[`${curPlayers[i].userId}`].play("run", true);

            } else {
                this[`${curPlayers[i].userId}`].play("idle", true);
            }

            if (curPlayers[i].y < 576) {
                this[`${curPlayers[i].userId}`].play("jump", true);
            }

            if (curPlayers[i].y > 576) {
                this[`${curPlayers[i].userId}`].play("crouch", true);
            }

            this[`${curPlayers[i].userId}`].y = curPlayers[i].y;
            this[`${curPlayers[i].userId}`].x = curPlayers[i].x;
            this[`${curPlayers[i].userId}username`].x = curPlayers[i].x - 50;
            this[`${curPlayers[i].userId}username`].y = curPlayers[i].y - 175;
            this[`${curPlayers[i].userId}message`].x = curPlayers[i].x - 50;
            this[`${curPlayers[i].userId}message`].y = curPlayers[i].y - 125;
            this[`${curPlayers[i].userId}message`].text = curPlayers[i].message;
        }

        if (players[1].x <  game.config.width * 3 -100 && players[1].x > 512){
            players[1].x += 9*runDirection;

        } else {
            runDirection = -runDirection;
            players[1].x += runDirection*9;
        }

        if (players[3].x > 276) { players[3].x -= 10; }

        players[2].y -= 4;

        if(players[2].y <= 0) {
            players[2].y = 576;
        }

        if (this.cursors.left.isDown && this.player.x > 0) {
            this.player.x -= 9;
            this.player.scaleX = -1;
            if (this.player.y == 576) { this.player.play("run", true); }

        } else if (this.cursors.right.isDown && this.player.x < game.config.width * 3) {
            this.player.x += 9;
            this.player.scaleX = 1;
            if (this.player.y == 576) { this.player.play("run", true); }

        } else if (this.cursors.down.isUp && this.player.y == 577) {
            this.player.y = 576;

        } else if (this.cursors.down.isDown && this.player.y == 576) {
            this.player.play("crouch", true);
            this.player.y = 577;

        } else if (this.player.y == 576) {
            this.player.play("idle",true);
        }

        this.sky.tilePositionX = this.myCam.scrollX * .3;
        this.grass.tilePositionX = this.myCam.scrollX * .6;
        this.dirt.tilePositionX = this.myCam.scrollX;
        this.username.x = this.player.x - 50;
        this.username.y = this.player.y - 175;
        this.message.x = this.player.x - 50;
        this.message.y = this.player.y - 125;
        this.message.text = getMsg();

        if (this.cursors.space.isDown && this.player.y == 576) {
            jump = -800;
            this.player.body.setVelocityY(jump);
            this.player.play("jump",true);
        }

        if (jump !== 800 && this.player.y !== 576) {
            jump += 20;
            this.player.body.setVelocityY(jump);
        }

        if (this.player.y > 576) {
            this.player.body.setVelocityY(0);
            this.player.y = 576;
        }

        let val = document.getElementById('msgBx').value;

        if(this.cursors.space.isDown) {
            document.getElementById('msgBx').value = val + " ";
            document.getElementById('msgBx').value = document.getElementById('msgBx').value.replace(/  +/g, ' ');
        }

    }
    
    startGame() {
        console.log('start');
    }
}