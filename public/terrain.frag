precision mediump float;

uniform float sea_level;
varying vec3 normal;
varying vec3 position;

void main() {
  if (position.y > sea_level) {
    gl_FragColor = vec4(0.53, 0.89, 1.0, 1.0);
  } else {
    gl_FragColor = vec4(0.98, 0.95, 0.76, 1.0);
  }
  // gl_FragColor = mix(vec4(1.0), vec4(vec3(0.0), 1.0), normal.x);
}