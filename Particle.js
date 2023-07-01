import {
  FOREGROUND_COLOR,
  MAX_CONNECTION_LENGTH,
  MAX_PARTICLE_SPEED,
  PARTICLE_SIZE,
} from "./constants.js";
import {
  calculateLineOpacity,
  randomFromArray,
  randomNumber,
} from "./helpers.js";

export class Particle {
  constructor({ ctx }) {
    this.ctx = ctx;
    this.checkedForConnections = false;
    this.#setRandomPosition();
    this.#setRandomVelocity();
  }

  get leftBound() {
    return -MAX_CONNECTION_LENGTH;
  }

  get topBound() {
    return -MAX_CONNECTION_LENGTH;
  }

  get rightBound() {
    return this.ctx.canvas.width + MAX_CONNECTION_LENGTH;
  }

  get bottomBound() {
    return this.ctx.canvas.height + MAX_CONNECTION_LENGTH;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, PARTICLE_SIZE, 0, Math.PI * 2);
    this.ctx.fillStyle = FOREGROUND_COLOR;
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawLineTo(particle) {
    const distance = this.distanceTo(particle);
    const opacity = calculateLineOpacity(distance);
    this.ctx.globalAlpha = opacity;
    this.ctx.strokeStyle = FOREGROUND_COLOR;
    this.ctx.lineWidth = PARTICLE_SIZE * opacity;
    this.ctx.beginPath();
    this.ctx.moveTo(this.x, this.y);
    this.ctx.lineTo(particle.x, particle.y);
    this.ctx.stroke();
    this.ctx.globalAlpha = 1;
  }

  requestNewPosition(elapsedSinceLastFrame) {
    const newX = this.x + elapsedSinceLastFrame * this.velocityX;
    const newY = this.y + elapsedSinceLastFrame * this.velocityY;
    const isXOutOfBounds = newX < this.leftBound || newX > this.rightBound;
    const isYOutOfBounds = newY < this.topBound || newY > this.bottomBound;

    if (isXOutOfBounds || isYOutOfBounds) {
      this.#handleOutOfBounds();
    } else {
      this.x = newX;
      this.y = newY;
    }
    this.checkedForConnections = false;
  }

  distanceTo(particle) {
    return Math.sqrt((particle.x - this.x) ** 2 + (particle.y - this.y) ** 2);
  }

  #setRandomPosition() {
    this.x = randomNumber(this.leftBound, this.rightBound);
    this.y = randomNumber(this.topBound, this.bottomBound);
  }

  #setRandomVelocity() {
    this.velocityX = randomNumber(-MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
    this.velocityY = randomNumber(-MAX_PARTICLE_SPEED, MAX_PARTICLE_SPEED);
  }

  #handleOutOfBounds() {
    let x = randomNumber(this.leftBound, this.rightBound);
    let y = randomNumber(this.topBound, this.bottomBound);
    let velocityX = randomNumber(0, MAX_PARTICLE_SPEED);
    let velocityY = randomNumber(0, MAX_PARTICLE_SPEED);

    const snapTo = Math.random() > 0.5 ? "x" : "y";

    if (snapTo === "x") {
      x = randomFromArray([this.leftBound, this.rightBound]);
    } else if (snapTo === "y") {
      y = randomFromArray([this.topBound, this.bottomBound]);
    }

    if (x === this.rightBound) velocityX = -velocityX;
    if (y === this.bottomBound) velocityY = -velocityY;

    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
  }
}
