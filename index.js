import { Particle } from "./Particle.js";
import { MAX_CONNECTION_LENGTH } from "./constants.js";

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

    nearParticles.forEach((nearParticle) => particle.drawLineTo(nearParticle));
    particle.checkedForConnections = true;

    particle.draw();
    particle.requestNewPosition(elapsedSinceLastFrame);
  });
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
