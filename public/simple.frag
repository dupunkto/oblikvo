precision mediump float;

varying vec3 color;

void main() {
//   vec2 nPos = 1.0 - pos;
//   nPos.x = nPos.x + sin(nPos.x * 16.0 + millis/1000.0)/16.0;
  
//   vec4 color = texture2D(background, nPos);
//   gl_FragColor = color;
  
  // vec4 color = vec4(normal, 1.0);
  vec4 color = vec4(color, 1.0);
  gl_FragColor = color;
}