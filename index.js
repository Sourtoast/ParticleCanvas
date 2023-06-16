import { Particle } from "./Particle.js";
import {
  FOREGROUND_COLOR,
  MAX_CONNECTION_LENGTH,
  PARTICLE_SIZE,
} from "./constants.js";

const canvasElement = document.querySelector("#particles");
const ctx = canvasElement.getContext("2d");

function resizeCanvasToMatchParent() {
  canvasElement.width = canvasElement.parentElement.clientWidth;
  canvasElement.height = canvasElement.parentElement.clientHeight;
}

function setup() {
  const pixelRatio = window.devicePixelRatio;
  ctx.scale(pixelRatio, pixelRatio);
  resizeCanvasToMatchParent();
  window.addEventListener("resize", resizeCanvasToMatchParent);
}
setup();

const particles = Array(
  Math.round((canvasElement.width * canvasElement.height) / 15_000)
)
  .fill()
  .map(() => new Particle({ ctx }));

let lastFrameTimestamp = 0;
async function draw(timestamp) {
  const timestampInSeconds = timestamp / 1000;
  const elapsedSinceLastFrame = timestampInSeconds - lastFrameTimestamp;
  lastFrameTimestamp = timestampInSeconds;

  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  particles.forEach((particle) => {
    const nearParticles = particles.filter(
      (testedParticle) =>
        !testedParticle.checkedForConnections &&
        particle.distanceTo(testedParticle) <= MAX_CONNECTION_LENGTH
    );
    nearParticles.forEach((nearParticle) => {
      const distance = particle.distanceTo(nearParticle);
      const magicFactor = MAX_CONNECTION_LENGTH / PARTICLE_SIZE;
      const lineOpacity =
        MAX_CONNECTION_LENGTH / (distance + magicFactor) -
        distance / (MAX_CONNECTION_LENGTH + magicFactor);

      particle.ctx.strokeStyle = FOREGROUND_COLOR;
      particle.ctx.lineWidth = PARTICLE_SIZE * lineOpacity;
      particle.ctx.beginPath();
      particle.ctx.moveTo(particle.x, particle.y);
      particle.ctx.lineTo(nearParticle.x, nearParticle.y);
      particle.ctx.stroke();
    });
    particle.checkedForConnections = true;

    particle.draw();
    particle.requestNewPosition(elapsedSinceLastFrame);
  });
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
