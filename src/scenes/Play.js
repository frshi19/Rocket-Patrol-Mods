class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload(){
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('supership', './assets/supership.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('asteroids', './assets/asteroids.png');
        this.load.image('city', './assets/city.png');
        this.load.spritesheet('explosion','./assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        this.load.audio('bgm','./assets/bgm.wav')        
    }

    create(){
        // play music
        let bgmConfig = {
            volume: 0.2,
            loop: true
        }

        this.bgm = this.sound.add('bgm', bgmConfig);
        this.bgm.play()

        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0,0);
        this.asteroids = this.add.tileSprite(0, 0, 640, 480, 'asteroids').setOrigin(0,0);
        this.city = this.add.tileSprite(0, 0, 640, 480, 'city').setOrigin(0,0);


        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0);
        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // add rocket (p1)
        this.p1Rocket = new Rocket (this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5,0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30, 2000).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20, 1000).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10, 1000).setOrigin(0,0);

        // add supership
        this.ship04 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 8, 'supership', 0, 40, 0).setOrigin(0,0);
        if (game.settings.spaceshipSpeed == 3){
            this.ship04.moveSpeed += 1
        }else{
            this.ship04.moveSpeed += 2
        }
        

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end : 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        //display score
        scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        // set timer
        this.timer = game.settings.gameTimer;
        //display timer
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timerRight = this.add.text( game.config.width - borderUISize - borderPadding - timerConfig.fixedWidth, borderUISize + borderPadding * 2, this.timer / 1000, timerConfig);

        //display fire
        let fireConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.fire = this.add.text(game.config.width/2 - fireConfig.fixedWidth/2, borderUISize + borderPadding * 2, 'FIRE', fireConfig);
        this.fire.alpha = 0;

        // GAME OVER flag
        this.gameOver = false;
        // 60-second play clock
        scoreConfig.fixedWidth = 0;

        // 30-second speed increase
        this.clock2 = this.time.delayedCall(30000, () => {
            this.ship01.moveSpeed += 3;
            this.ship02.moveSpeed += 2;
            this.ship03.moveSpeed += 1;
            this.ship04.moveSpeed += 4;
        }, null, this);

        // lower timer
        this.clock3 = this.time.addEvent({
            delay: 1000, 
            callback: () => {
                this.timer -= 1000,
                this.timerRight.text = this.timer / 1000
            },
            callbackScope:this,
            loop: true
        });
        // create flag for gameover
        this.flag = 0
    }

    update(){
        // check if timer = 0 for GAME OVER
        if (this.flag == 0 && this.timer <= 0){
            this.flag = 1
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
            this.clock3.paused = true;
        }
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.sound.play('sfx_select');
            this.bgm.stop();
            this.anims.remove('explode');
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.bgm.stop();
            this.anims.remove('explode');
            this.scene.start('menuScene');
        }

        this.starfield.tilePositionX -= 0.5;
        this.asteroids.tilePositionX -= 1;
        this.city.tilePositionX -= 4;

        if(!this.gameOver){
            this.p1Rocket.update();             // update rocket sprite
            this.ship01.update();               // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }

        // fire mod
        if (this.p1Rocket.isFiring) {
            this.fire.alpha = 1;
        }else{
            this.fire.alpha = 0;
        }
        
        //check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)){
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
          }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }

    checkCollision(rocket, ship){
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
        rocket.x + rocket.width > ship.x &&
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship){
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');                // play explode animation
        boom.on('animationcomplete', () => {       // callback after anim compeltes
            ship.reset();                          // reset ship position
            ship.alpha = 1;                        // make ship visible again
            boom.destroy();                        // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.timer += ship.time;
        this.scoreLeft.text = this.p1Score;
        this.timerRight.text = this.timer / 1000
        
        this.sound.play('sfx_explosion');
    }
}