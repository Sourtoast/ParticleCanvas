export function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

export function randomFromArray(array) {
  const lastIndex = array.length - 1;
  const randomIndex = Math.round((Math.random() * lastIndex) % lastIndex);
  return array[randomIndex];
}
