export const FPS = 30;
export const TPS = 60;
export const G = relative(36);
export const FRICTION = relative(48);
export const SPEED = relative(108);
export const KNOCKBACK = relative(1800);
export const POWER = 30;
export const HEALTH = 20;
export const DURATION = 120; // in seconds
export const MIN_PLAYERS = 2;
export const LOGGING = false;

// Calculates a value in relation to a single
// tick. Allows us to change the TPS freely without
// altering the speed of the game.
function relative(value: number) {
  return value / TPS;
}

// This means the canvas will be rendered at 1/8 the size
// of the screen and then upscaled, for our retro-pixelation effect.
export const PIXELATION = 6;
