precision highp float;

uniform vec3 iResolution;
uniform sampler2D iChannel0;
uniform float iGlobalTime;

#pragma glslify: noise = require(glsl-noise/simplex/3d)

void main() {
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  float brightness = noise(texture2D(iChannel0, uv).rgb * 20.0);
  gl_FragColor = vec4(vec3(brightness), 1.);
}
