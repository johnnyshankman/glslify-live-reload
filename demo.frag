precision highp float;

// Uniforms passed in by the JS in index.js
// You can easily recreate ShaderToy variables this way  if need be
uniform vec3 iResolution;
uniform sampler2D iChannel0;
uniform float iGlobalTime;

// Example glslify import
#pragma glslify: noise = require(glsl-noise/simplex/3d)

void main() {
  // normalize the coordinates
  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
  // Usage of glslify import
  float rgb = noise(texture2D(iChannel0, uv).rgb * 20.0);
  gl_FragColor = vec4(vec3(rgb), 1.);
}
