import 'phaser';

let stepSize = 32;

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
		var velocity = this.sprite.body.velocity.y;
		if ((amount*velocity) < 0) {
			velocity = Math.abs(velocity) > Math.abs(amount) ? velocity / 3 : 0;
			this.sprite.body.velocity.y = velocity;
		} else {
			this.sprite.body.velocity.y += amount;
		}
	}
	
	moveX(amount: number) {
		var velocity = this.sprite.body.velocity.x;
		if ((amount*velocity) < 0) {
			velocity = Math.abs(velocity) > Math.abs(amount) ? velocity / 3 : 0;
			this.sprite.body.velocity.x = velocity;
		} else {
			this.sprite.body.velocity.x += amount;
		}
	}

	stop() {
		this.stopX();
		this.stopY();
	}

	stopX() {
		let delta = this.sprite.body.velocity.x / 2;
		if (delta > stepSize || delta < stepSize * -1) {
			this.sprite.body.velocity.x += -delta;
		} else {
			this.sprite.body.velocity.x = 0;
		}
	}

	stopY() {
		let delta = this.sprite.body.velocity.y / 2;
		if (delta > stepSize || delta < stepSize * -1) {
			this.sprite.body.velocity.y += -delta;
		} else {
			this.sprite.body.velocity.y = 0;
		}
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
