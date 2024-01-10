attribute vec3 aPosition;
attribute vec3 aNormal;

void main() {
  vec4 projPosition = vec4(aPosition, 1.0) * 2.0 - 1.0;
  gl_Position = projPosition;
}