import 'pixi';
import 'p2';
import 'phaser';
//import map01 from './maps/01';
import Player from './Player';
import Bug from './Bug';

let terrain = {
	D: 'dirt',
	E: 'error',
	G: 'grass',
	W: 'water'
}
let speed = 16;

export default class TheGame {
	constructor() {
		this.game = new Phaser.Game(
			this.width,
			this.height,
			Phaser.AUTO,
			'content', {
				preload: () => { this.preload() },
				create: () => { this.create() },
				update: () => { this.update() }
			}
		);
		window['theGame'] = this;
	}

	width = 640;
	height = 640;
	game: Phaser.Game;
	terrain: Phaser.Sprite[][];
	player: Player;
	map: Phaser.Tilemap;
	terrainLayer: Phaser.TilemapLayer;
	enemies: Bug[];

	preload() {
		this.game.load.image('player', 'img/player.png');
		this.game.load.image('sword', 'img/sword.png');
		this.game.load.image('bug', 'img/bug.png');
		this.game.load.image('terrain', '/img/terrain.png');
		this.game.load.tilemap('world01', 'maps/world01.json', null, Phaser.Tilemap.TILED_JSON);
	}

	create() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.setMap('world01');
		this.setPlayer();
		this.setEnemies();
	}

	update() {
		this.game.physics.arcade.collide(this.player.sprite, this.terrainLayer);
		for (var i = 0; i < this.enemies.length; i++) {
			let enemy = this.enemies[i];
			this.game.physics.arcade.collide(enemy.sprite, this.player.sprite, () => { this.collidedWith(enemy, this.player); });
			this.game.physics.arcade.collide(enemy.sprite, this.terrainLayer);
			this.game.physics.arcade.overlap(enemy.sightSprite, this.player.sprite, () => { this.enemySeesPlayer(enemy, this.player); });
			
			if (enemy.isAttacking && enemy.preAttackPositionX >= enemy.targetAttackPositionX  && enemy.sprite.x <= enemy.targetAttackPositionX) {
				enemy.stopX();
			} else if (enemy.isAttacking && enemy.preAttackPositionX < enemy.targetAttackPositionX  && enemy.sprite.x > enemy.targetAttackPositionX) {
				enemy.stopX();
			}
			if (enemy.isAttacking && enemy.preAttackPositionY >= enemy.targetAttackPositionY  && enemy.sprite.y <= enemy.targetAttackPositionY) {
				enemy.stopY();
			} else if (enemy.isAttacking && enemy.preAttackPositionY < enemy.targetAttackPositionY  && enemy.sprite.y > enemy.targetAttackPositionY) {
				enemy.stopY();
			}
			
			if (i === 0) {
				this.game.debug.bodyInfo(enemy.sightSprite, 32, 32);
			}
		}

		let moveLeft = this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
		let moveRight = this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
		let moveUp = this.game.input.keyboard.isDown(Phaser.Keyboard.UP);
		let moveDown = this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN);
		if (moveLeft) {
			this.player.moveLeft()
		}
		if (moveRight) {
			this.player.moveRight();
		}
		if (moveUp) {
			this.player.moveUp();
		}
		if (moveDown) {
			this.player.moveDown();
		}
		if (!moveLeft && !moveRight && !moveUp && !moveDown) {
			this.player.stop();
		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			//console.log('spacebar is down');
			this.player.attack();
		}
	}

	setMap(mapId: any) {
		this.map = this.game.add.tilemap(mapId);
		this.map.addTilesetImage('terrain', 'terrain');
		this.terrainLayer = this.map.createLayer('Ground');
		this.map.setCollisionBetween(0, 1, true, 'Ground');
		this.terrainLayer.resizeWorld();
	}

	setPlayer() {
		this.player = new Player(this.game, this.game.add.sprite(256, 256, 'player'));
		this.game.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
		this.game.camera.follow(this.player.sprite);
		this.player.sprite.anchor.x = 0.5;
		this.player.sprite.anchor.y = 0.5;
		this.player.sprite.body.setSize(20, 42, 22, 11);
	}

	setEnemies() {
		var enemyOffsetX = 23;
		var enemyOffsetY = 11;
		var enemyHeight = 42;
		var enemyWidth = 18;
		var enemyStartPositions = [
			[128, 576],
			[768, 128]
		];

		this.enemies = enemyStartPositions.map((position) => {
			let [x, y] = position;
			let sprite = this.game.add.sprite(x, y, 'bug');
			let sightSprite = this.game.add.graphics(0, 0);

			sprite.anchor.x = 0.5;
			sprite.anchor.y = 0.5;
			this.game.physics.enable(sprite, Phaser.Physics.ARCADE);
			sprite.body.setSize(18, 42, 23, 11);

			sightSprite.anchor.x = 0.5;
			sightSprite.anchor.y = 0.5;
			sightSprite.alpha = 0.25;
			sightSprite.beginFill(0xFF0000, 1);
			sightSprite.drawCircle(0, 0, 320);
			sightSprite.endFill();
			this.game.physics.enable(sightSprite, Phaser.Physics.ARCADE);
			sightSprite.body.setCircle(160, 80, 80);

			return new Bug(this.game, sprite, sightSprite);
		});
	}

    collidedWith(bug: Bug, player: Player) {
        console.log('you got hit!');
	}
	
	enemySeesPlayer(enemy: Bug, player: Player) {
		console.log('enemy sees player');
		enemy.attackPoint(player.sprite.x, player.sprite.y);
	}
}
