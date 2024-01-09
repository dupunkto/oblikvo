attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uProjectionMatrix;
uniform mat4 uModelViewMatrix;

uniform float millis;
varying vec3 color;

void main() {
  color = aNormal;
  
  vec4 position = vec4(aPosition, 1.0);
  // position.xy = position.xy * 2.0 - 1.0;
  
  gl_Position = uProjectionMatrix * uModelViewMatrix * position;
}