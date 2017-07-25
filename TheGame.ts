import 'pixi';
import 'p2';
import 'phaser';
import map01 from './maps/01';
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
				preload: () => this.preload(), 
				create: () => this.create(),
				update: () => this.update()
			}
		);
		window['theGame'] = this;
	}
	
	width =  640;
	height = 640;
	game: Phaser.Game;
	terrain: Phaser.Sprite[][];
	player: Player;
	
	preload() {
		this.game.load.image('player', 'img/player.png');
		this.game.load.image('dirt', 'img/terrain-dirt.png');
		this.game.load.image('error', 'img/terrain-error.png');
		this.game.load.image('grass', 'img/terrain-grass.png');
		this.game.load.image('water', 'img/terrain-water.png');
	}
	
	create() {
		this.setMap(map01);
		this.setPlayer();
		/*
        let text = "It works!";
        let style = { font: "64px Arial", fill: "#ff0000", align: "center" };
		this.game.add.text(0, 0, text, style);
		*/
	}
	
	update() {
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			this.player.moveLeft()
		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			this.player.moveRight();
		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			this.player.moveUp();
		}
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			this.player.moveDown();
		}
		

	}
	
	setMap(map: any) {
		let sprites = [];
		let terrainArray = map.terrain;
		for (var verticalIndex = 0; verticalIndex < terrainArray.length; verticalIndex++) {
			for (var horizontalIndex = 0; horizontalIndex < terrainArray[verticalIndex].length; horizontalIndex++) {
				let spriteType = terrainArray[verticalIndex][horizontalIndex];
				//console.log('loading sprite', spriteType, terrain[spriteType], horizontalIndex * 64, verticalIndex * 64);
				let sprite = this.game.add.sprite(horizontalIndex * 64, verticalIndex * 64, terrain[spriteType] || terrain.E);
				if (verticalIndex === 0) {
					sprites.push([]);
				}
				sprites[horizontalIndex].push(sprite);
			}
		}
		this.terrain = sprites;
	}
	
	setPlayer() {
		this.player = new Player(this.game.add.sprite(128, 128, 'player'));
	}
}