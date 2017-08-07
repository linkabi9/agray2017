import 'phaser';

let stepSize = 256;

export default class Bug {
    constructor(game: Phaser.Game, sprite: Phaser.Sprite, sightSprite: Phaser.Sprite | Phaser.Graphics) {
        this.game = game;
        this.sprite = sprite;
        this.sightSprite = sightSprite;
        this.sprite.addChild(this.sightSprite);
    }

    game: Phaser.Game;
    sprite: Phaser.Sprite;
    sightSprite: Phaser.Sprite | Phaser.Graphics;
    isAttacking = false;
    preAttackPositionX: number;
    preAttackPositionY: number;
    targetAttackPositionX: number;
    targetAttackPositionY: number;
    

    attackPoint(x: number, y: number) {
        if (this.isAttacking === false) {
            this.isAttacking = true;
            this.preAttackPositionX = this.sprite.x;
            this.preAttackPositionY = this.sprite.y;
            this.targetAttackPositionX = x;
            this.targetAttackPositionY = y;
            this.game.physics.arcade.moveToXY(this.sprite, x, y, stepSize);
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
            //@TODO: stop is not always "not attacking"
            if (this.sprite.body.velocity.y === 0) {
                this.isAttacking = false;
            }
		}
	}

	stopY() {
		let delta = this.sprite.body.velocity.y / 2;
		if (delta > stepSize || delta < stepSize * -1) {
			this.sprite.body.velocity.y += -delta;
		} else {
			this.sprite.body.velocity.y = 0;
            //@TODO: stop is not always "not attacking"
            if (this.sprite.body.velocity.x === 0) {
                this.isAttacking = false;
            }
		}
	}
}