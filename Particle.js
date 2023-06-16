import {
  FOREGROUND_COLOR,
  MAX_PARTICLE_SPEED,
  PARTICLE_SIZE,
} from "./constants.js";
import { randomFromArray, randomNumber } from "./helpers.js";

export class Particle {
  constructor({ xBound, yBound, ctx }) {
    this.ctx = ctx;
    this.xBound = xBound;
    this.yBound = yBound;
    this.#setRandomPosition();
    this.#setRandomVelocity();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, PARTICLE_SIZE, 0, Math.PI * 2);
    this.ctx.fillStyle = FOREGROUND_COLOR;
    this.ctx.fill();
    this.ctx.closePath();
  }

  requestNewPosition(elapsedSinceLastFrame) {
    const newX = this.x + elapsedSinceLastFrame * this.velocityX;
    const newY = this.y + elapsedSinceLastFrame * this.velocityY;
    const isXOutOfBounds =
      newX < -PARTICLE_SIZE || newX > this.xBound + PARTICLE_SIZE;
    const isYOutOfBounds =
      newY < -PARTICLE_SIZE || newY > this.yBound + PARTICLE_SIZE;
    if (isXOutOfBounds || isYOutOfBounds) {
      this.#handleOutOfBounds();
    } else {
      this.x = newX;
      this.y = newY;
    }
  }

  #setRandomPosition() {
    this.x = randomNumber(0, this.xBound);
    this.y = randomNumber(0, this.yBound);
  }

  #setRandomVelocity() {
    this.velocityX = randomNumber(-MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
    this.velocityY = randomNumber(-MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
  }

  #handleOutOfBounds() {
    let x = randomNumber(0, this.xBound);
    let y = randomNumber(0, this.yBound);
    let velocityX = randomNumber(0, MAX_PARTICLE_SPEED);
    let velocityY = randomNumber(0, MAX_PARTICLE_SPEED);

    const snapTo = Math.random() > 0.5 ? "x" : "y";

    if (snapTo === "x") x = randomFromArray([0, this.xBound]);
    else if (snapTo === "y") y = randomFromArray([0, this.yBound]);

    if (x === this.xBound) velocityX = -velocityX;
    if (y === this.yBound) velocityY = -velocityY;

    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }
}
