import { MAX_CONNECTION_LENGTH, PARTICLE_SIZE } from "./constants.js";

export function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomFromArray(array) {
  const lastIndex = array.length - 1;
  const randomIndex = Math.round((Math.random() * lastIndex) % lastIndex);
  return array[randomIndex];
}

export function calculateLineOpacity(distance) {
  const magicFactor = MAX_CONNECTION_LENGTH / PARTICLE_SIZE;
  return (
    MAX_CONNECTION_LENGTH / (distance + magicFactor) -
    distance / (MAX_CONNECTION_LENGTH + magicFactor)
  );
}
