precision highp float;

// Uniforms passed in by the JS in index.js
// You can easily recreate ShaderToy variables this way  if need be
uniform vec3 iResolution;
uniform sampler2D iChannel0;
uniform float iGlobalTime;

vec2 doModel(vec3 p);
// Example glslify import
#pragma glslify: square   = require('glsl-square-frame')
#pragma glslify: camera   = require('glsl-camera-ray')
#pragma glslify: noise = require(glsl-noise/simplex/3d)
#pragma glslify: raytrace = require('glsl-raytrace', map = doModel, steps = 90)
#pragma glslify: getNormal = require('glsl-sdf-normal', map = doModel)
// import some operators

#pragma glslify: opU 	= require('glsl-sdf-ops/union')
#pragma glslify: opTwist 	= require('glsl-sdf-ops/twist')
// import some primitives
#pragma glslify: sdTorus 	= require('glsl-sdf-primitives/sdTorus')
#pragma glslify: sdTriPrism = require('glsl-sdf-primitives/sdTriPrism')

vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
  return a + b * cos(6.28318 * (c * t + d));
}

float sdLink( vec3 p, float le, float r1, float r2 )
{
  vec3 q = vec3(p.x, max(abs(p.y) - le, 0.0), p.z );
  return length(vec2(length(q.xy) - r1,q.z)) - r2;
}

float opDisplace(float d1, in vec3 p )
{
  float d2 = sin(20.*p.x)*sin(20.*p.y)*sin(20.*p.z);
  return d1+d2;
}


vec2 doModel(vec3 p) {
  // return max(
  //   vec2(
  //     sdTriPrism(
  //       p,
  //       vec2( 0.90, 0.2 )
  //     ),
  //     0.0
  //   ),
  //   vec2(
  //     sdLink(
  //       p,
  //       0.3, 0.3, 0.2
  //     ),
  //     0.0
  //   )
  // );

  return vec2(
    opDisplace(sdLink(
      p,
      0.5, 0.3, 0.125
    ), p),
    0.0
  );
}

void main() {
  // Bootstrap a Shadertoy-style raytracing scene:
  float cameraAngle  = 0.8 * iGlobalTime;
  vec3  rayOrigin    = vec3(3.5 * sin(cameraAngle), 3.0, 3.5 * cos(cameraAngle));
  vec3  rayTarget    = vec3(0, 0, 0);
  vec2  screenPos    = square(iResolution.xy);
  float lensLength   = 2.0;
  vec3  rayDirection = camera(rayOrigin, rayTarget, screenPos, lensLength);

  vec2 collision = raytrace(rayOrigin, rayDirection);

  vec3 color = vec3(0);

  // If the ray collides, draw the surface
  if (collision.x > -0.5) {
    // Determine the point of collision
    vec3 pos = rayOrigin + rayDirection * collision.x;
    color = getNormal(pos);
  }

  gl_FragColor = vec4(vec3(color.x), 1.0);
}

// void main() {
//   vec2 fragCoord = gl_FragCoord.xy;

//   // convert to clip space [-1, 1] with origin at center and aspect ratio accounted for
//   vec2 uv = (fragCoord * 2.0 - iResolution.xy) / iResolution.y;
//   vec2 uvOG = uv;
//   vec3 finalColor = vec3(0.0);

//   for (float i = 0.0; i < 4.0; i++) {
//     // set to 2x clip space [-2, 2] with origin at center
//     uv *= 2.0;
//     // take only the fractional part, creating repetition because of the previous step
//     uv = fract(uv);
//     // move uv so that origin is at the center of each repetition, not bottom left
//     uv -= 0.5;

//     // represents the length to the uv within its own repetition now
//     float d = length(uv);
//     vec3 col = palette(length(uvOG) + iGlobalTime, vec3(0.639, 0.571, 0.882), vec3(0.230, 0.239, 0.221), vec3(1.156, 0.187, 0.829), vec3(2.379, 1.533, 5.785));

//     d = sin(d * 8. + iGlobalTime) / 8.;
//     d = abs(d);

//     d = 0.02 / d;

//     finalColor += col * d;
//     finalColor *= noise(vec3(col));
//   }

//   float rgb = noise(vec3(uv.yx, uvOG.y));


//   gl_FragColor = vec4(finalColor * rgb, 1.0);
// }

// void main() {
//   normalize the coordinates
//   vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);
//   // Usage of glslify import
//   float rgb = noise(texture2D(iChannel0, uv).rgb * 20.0);
//   gl_FragColor = vec4(vec3(0.0), 1.0);
// }
