import 'phaser';

let stepSize = 16;

export default class Player {
	constructor(game: Phaser.Game, sprite: Phaser.Sprite) {
		this.game = game;
		this.sprite = sprite;
		this.currentWeaponType = WeaponType.Sword;
		this.initWeapons();
	}
	
	game: Phaser.Game;
	sprite: Phaser.Sprite;
	currentWeaponType: WeaponType;
	weapons: Phaser.Sprite[];
	isAttacking = false;
	currentAttackDirection = AttackDirection.Down;
	
	initWeapons() {
		this.weapons = [this.game.make.sprite(32, 32, 'sword')];
		
		for (var weapon of this.weapons) {
			weapon.alpha = 0;
			weapon.anchor.x = 0.5;
			weapon.anchor.y = 0.5;
			this.sprite.addChild(weapon);
		}
	}
	
	attack() {
		var weapon = this.weapons[this.currentWeaponType];
		console.log('player attack', 
			//this.currentWeaponType, 
			this.currentAttackDirection, 
			// weapon, 
			(Phaser.Math.PI2 * -0.15) + this.currentAttackDirection);
		if (weapon != null && this.isAttacking == false) {
			this.isAttacking = true;
			weapon.rotation = Phaser.Math.PI2 * (-0.15 + this.currentAttackDirection);
			var tweenSwing = this.game.add.tween(weapon)
				.to({ rotation: Phaser.Math.PI2 * (0.05 + this.currentAttackDirection) }, 150, Phaser.Easing.Linear.None);
			var tweenFlash = this.game.add.tween(weapon)
				.to({ alpha: 1 }, 50, Phaser.Easing.Linear.None)
				.to({ alpha: 0 }, 50, Phaser.Easing.Linear.None, false, 250);
			tweenSwing.start();
			tweenFlash.start();
			tweenFlash.onComplete.add(() => { this.isAttacking = false; });
		}
	}
	
	moveDown(){
		this.currentAttackDirection = AttackDirection.Down;
		this.moveY(stepSize);
	}
	
	moveLeft(){
		this.currentAttackDirection = AttackDirection.Left;
		this.moveX(-stepSize);
	}
	
	moveRight(){
		this.currentAttackDirection = AttackDirection.Right;
		this.moveX(stepSize);
	}
	
	moveUp(){
		this.currentAttackDirection = AttackDirection.Up;
		this.moveY(-stepSize);
	}
	
	moveY(amount: number) {
		this.sprite.y += amount;
	}
	
	moveX(amount: number) {
		this.sprite.x += amount;
	}
}

enum AttackDirection {
	Down = 0.5,
	Left = 0.75,
	Right = 0.25,
	Up = 0
}

enum WeaponType {
	Sword = 0
}
