import { Particle } from "./Particle.js";

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

const particles = Array(100)
  .fill()
  .map(
    () =>
      new Particle({
        ctx: ctx,
        xBound: canvasElement.clientWidth,
        yBound: canvasElement.clientHeight,
      })
  );

let lastFrameTimestamp = 0;
async function draw(timestamp) {
  const timestampInSeconds = timestamp / 1000;
  const elapsedSinceLastFrame = timestampInSeconds - lastFrameTimestamp;
  lastFrameTimestamp = timestampInSeconds;

  ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);

  particles.forEach((particle) => {
    particle.draw();
    particle.requestNewPosition(elapsedSinceLastFrame);
  });
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
