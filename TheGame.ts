import 'pixi';
import 'p2';
import 'phaser';
//import map01 from './maps/01';
import Player from './Player'

let terrain = {
	D: 'dirt',
	E: 'error',
	G: 'grass',
	W: 'water'
}
let speed = 16;

export default class TheGame {
	constructor(){
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
	
	width =  640;
	height = 640;
	game: Phaser.Game;
	terrain: Phaser.Sprite[][];
	player: Player;
	map: Phaser.Tilemap;
	terrainLayer;
	
	preload() {
		this.game.load.image('player', 'img/player.png');
		this.game.load.image('dirt', 'img/terrain-dirt.png');
		this.game.load.image('error', 'img/terrain-error.png');
		this.game.load.image('grass', 'img/terrain-grass.png');
		this.game.load.image('water', 'img/terrain-water.png');
		this.game.load.image('sword', 'img/sword.png');
		this.game.load.tilemap('world01', 'maps/world01.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('terrain', '/img/terrain.png');
	}
	
	create() {
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.setMap('world01');
		this.setPlayer();
	}
	
	update() {
		this.game.physics.arcade.collide(this.player.sprite, this.terrainLayer)
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
		this.player = new Player(this.game, this.game.add.sprite(128, 128, 'player'));
		this.game.physics.enable(this.player.sprite, Phaser.Physics.ARCADE);
		this.game.camera.follow(this.player.sprite);
		this.player.sprite.body.setSize(32, 32, 16, 16);

	}
}
