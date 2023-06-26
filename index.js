import { Particle } from "./Particle.js";
import { MAX_CONNECTION_LENGTH, PARTICLE_PER_PIXELS } from "./constants.js";

const canvasElement = document.querySelector("#particles");
const ctx = canvasElement.getContext("2d");

function resizeCanvasToMatchParent() {
  canvasElement.width = canvasElement.parentElement.clientWidth;
  canvasElement.height = canvasElement.parentElement.clientHeight;
}

function handleMouseMove(e) {
  mousePosition.x = e.offsetX;
  mousePosition.y = e.offsetY;
}

function handleMouseOut() {
  mousePosition.x = undefined;
  mousePosition.y = undefined;
}

function setup() {
  const pixelRatio = window.devicePixelRatio;
  ctx.scale(pixelRatio, pixelRatio);
  resizeCanvasToMatchParent();
  window.addEventListener("resize", resizeCanvasToMatchParent);
  canvasElement.addEventListener("mousemove", handleMouseMove);
  canvasElement.addEventListener("mouseout", handleMouseOut);
}

setup();

const particles = Array(
  Math.round((canvasElement.width * canvasElement.height) / PARTICLE_PER_PIXELS)
)
  .fill()
  .map(() => new Particle({ ctx }));

const mousePosition = { x: null, y: null };

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

    const distanceToMouse = particle.distanceTo(mousePosition);
    // This check can be confusing. If any of coordinates for mouse position is null (mouse is not on canvas) distanceToMouse is NaN which is falsy.
    // Zero is also falsy, but it's an edge case which is not relevant
    if (!!distanceToMouse && distanceToMouse <= MAX_CONNECTION_LENGTH)
      particle.drawLineTo(mousePosition);

    particle.checkedForConnections = true;

    particle.draw();
    particle.requestNewPosition(elapsedSinceLastFrame);
  });

  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);
