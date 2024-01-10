precision mediump float;

uniform float sea_level;
uniform float player_y;

void main() {
  if (player_y > sea_level) {
    gl_FragColor = vec4(0.0, 0.0, 1.0, 0.2);
  }
}