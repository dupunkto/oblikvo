export function randomID(): string {
  return (Math.random() + 1).toString(36).substring(7);
}

export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomFromArray<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomColor(min: number, max: number): string {
  const r = randomBetween(min, max);
  const g = randomBetween(min, max);
  const b = randomBetween(min, max);

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function toHex(c: number): string {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
