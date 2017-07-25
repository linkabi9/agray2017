import 'phaser';

let stepSize = 16;

export default class Player {
	constructor(sprite: Phaser.Sprite) {
		this.sprite = sprite;
	}
	
	sprite: Phaser.Sprite;
	
	moveUp(){
		this.moveY(-stepSize);
	}
	
	moveDown(){
		this.moveY(stepSize);
	}
	
	moveLeft(){
		this.moveX(-stepSize);
	}
	
	moveRight(){
		this.moveX(stepSize);
	}
	
	moveY(amount: number) {
		this.sprite.y += amount;
	}
	
	moveX(amount: number) {
		this.sprite.x += amount;
	}
}
