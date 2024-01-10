attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

varying vec3 normal;
varying vec3 position;

void main() {
  vec4 projPosition = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
  normal = aNormal;
  position = aPosition;
  
  gl_Position = projPosition;
}