var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
      default: 'arcade',
      arcade: {
        debug: false,
        gravity: { y: 0 }
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  
  var game = new Phaser.Game(config);
  var jump = 0;
  
  const output = $("#output");
  const messagesend = $("#message");
  const sendButton = $("#send");
  
  function preload() {
    this.load.image("sky", "assets/skytile.png");
    this.load.image("grass", "assets/grasstile.png");
    this.load.image("dirt", "assets/dirttile.png");
    this.load.spritesheet('knight', 'assets/knightsprite.png', {
      frameWidth: 256,
      frameHeight: 256
    });
  
  }
  
  function create() {
  
    // const output = $("#output");
    // const messagesend = $("#message");
    // const sendButton = $("#send");
    const self = this;
    this.socket = io();
    this.otherPlayers = this.physics.add.group();
  
  
    sendButton.click(() => {
      self.socket.emit("chat", {messagesend: $("#message").val()});
      $("#message").val("");
    });
  
    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers('knight', { start: 0, end: 9 }),
      frameRate: 10,
      repeat: -1
    });
  
  
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("knight", { start: 10, end: 18 }),
      frameRate: 25,
      repeat: -1
    });
  
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("knight", {start: 16, end: 17}),
      frameRate: 1,
      repeat: -1
  });
  
    this.socket.on('currentPlayers', function (players) {
  
      Object.keys(players).forEach(function (id) {
  
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id]);
  
        } else {
          addOtherPlayers(self, players[id]);
        }
  
      });
  
    });
  
    this.socket.on('chat', function (data) {
      messagesend.empty();
      output.append($('<p style="color: white; text-align: left;">').text(new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() + " | " + data.messagesend));
      output.scrollTop(output[0].scrollHeight);
    });
  
    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo);
    });
  
    this.socket.on('disconnect', function (playerId) {
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
  
    });
    
    this.socket.on('playerMoved', function (playerInfo) {
  
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
  
    });
  
    this.cursors = this.input.keyboard.createCursorKeys();
  
    this.sky = this.add.tileSprite(0, 0, game.config.width, game.config.height, "sky");
    this.sky.setOrigin(0, 0);
    this.sky.setScrollFactor(0);
  
    this.grass = this.add.tileSprite(0, 0, game.config.width, 96, "grass");
    this.grass.setOrigin(0, 0);
    this.grass.setScrollFactor(0);
    this.grass.y = 528;
  
    this.dirt = this.add.tileSprite(0, 0, game.config.width, 96, "dirt");
    this.dirt.setOrigin(0, 0);
    this.dirt.setScrollFactor(0);
    this.dirt.y = 624;
  
  }
  
  function addPlayer(self, playerInfo) {
  
    self.knight = self.physics.add.sprite(playerInfo.x, playerInfo.y, 'knight').setOrigin(0.5, 0.5).setDisplaySize(256, 256);
    self.knight.play("idle");
    self.myCam = self.cameras.main;
    self.myCam.setBounds(0, 0, game.config.width * 3, game.config.height);
    self.myCam.startFollow(self.knight);
  }
  
  function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add.sprite(playerInfo.x, playerInfo.y, 'knight').setOrigin(0.5, 0.5).setDisplaySize(256, 256);
    otherPlayer.playerId = playerInfo.playerId;
    otherPlayer.play("idle");
    
    self.otherPlayers.add(otherPlayer);
    console.log("Other Player:");
  }
  
  function update() {
  
    if (this.knight) {
  
      if (this.cursors.left.isDown && this.knight.x > 0) {
        this.knight.x -= 9;
        this.knight.scaleX = -1;
        this.knight.play("run", true);
      } else if (this.cursors.right.isDown && this.knight.x < game.config.width * 3) {
        this.knight.x += 9;
        this.knight.scaleX = 1;
        this.knight.play("run", true);
      } else {
        this.knight.play("idle", true);
      }
  
      this.sky.tilePositionX = this.myCam.scrollX * .3;
      this.grass.tilePositionX = this.myCam.scrollX * .6;
      this.dirt.tilePositionX = this.myCam.scrollX;
      
      if(this.cursors.space.isDown) {
        let test = $("#message").val();
        test = test + " ";
        test = test.replace(/  +/g, ' ');
        $("#message").val(test);
      }
  
      if (this.cursors.space.isDown && this.knight.y == 576) {
        jump = -800;
        this.knight.body.setVelocityY(jump);
        this.knight.play("jump", true);
      }
  
      if (jump !== 800 && this.knight.y !== 576) {
        jump += 20;
        this.knight.body.setVelocityY(jump);
        this.knight.play("jump", true);
      }
  
      if (this.knight.y > 576) {
        this.knight.body.setVelocityY(0);
        this.knight.y = 576;
      }
  
      var x = this.knight.x;
      var y = this.knight.y;
  
      if (this.knight.oldPosition && (x !== this.knight.oldPosition.x || y !== this.knight.oldPosition.y)) {
        this.socket.emit('playerMovement', { x: this.knight.x, y: this.knight.y});
      }
  
      // save old position data
      this.knight.oldPosition = {
        x: this.knight.x,
        y: this.knight.y,
      };
    }
  }