precision mediump float;

uniform float millis;
uniform float sea_level;
varying vec3 normal;
varying vec3 position;

#define LIGHT_DETAIL 20.0

void main() {
  vec3 light_dir = normalize(vec3(1.0, 1.0, 0.0));
  
  const vec3 water_color = vec3(0.53, 0.89, 1.0);
  const vec3 stone_color = vec3(0.2, 0.8, 0.2);
  
  if (position.y > sea_level) {
    gl_FragColor = vec4(water_color, 1.0);
  } else {    
    float intensity = dot(normal, normalize(-light_dir));
    vec3 color = stone_color * ((LIGHT_DETAIL*intensity-fract(LIGHT_DETAIL*intensity))/LIGHT_DETAIL);
    gl_FragColor = vec4(max(color, vec3(0.1, 0.2, 0.1)), 1.0);
  }
}