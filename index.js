var triangle = require('a-big-triangle');
var createShader = require('gl-shader');
var glslify = require('glslify');
var renderAnimationFrameLoop = require('raf-loop');
var texture2d = require('gl-texture2d');
var baboonImage = require('baboon-image').transpose(2, 0, 2);
var webGLContext = require('webgl-context')

/*
 * Initialize WebGL context as canvas
 */
var gl = webGLContext({
  width: window.innerWidth,
  height: window.innerHeight
});

/*
 * Append canvas to the DOM
 */
document.body.appendChild(gl.canvas);

/*
 * Track the time in JS and in GL
 */
var time = 0

/*
 * Create the global shader with uniforms
 */
var shader = createShader(
  gl,
  glslify('./demo.vert'),
  glslify('./demo.frag')
);
shader.bind();
shader.uniforms.iResolution = [
  gl.drawingBufferWidth,
  gl.drawingBufferHeight,
  0 // TOOD: z doesn't matter so why this is a vec3?
];
shader.uniforms.iGlobalTime = 0;
shader.uniforms.iChannel0 = 0;

/*
 * Create any global textures you may need access to
 */
var texture = texture2d(gl, baboonImage);
texture.wrapS = texture.wrapT = gl.REPEAT;

/*
 * Let's go!
 */
start();

function start() {
  renderAnimationFrameLoop(render).start();

  function render(dt) {
    var width = gl.drawingBufferWidth;
    var height = gl.drawingBufferHeight;

    gl.viewport(0, 0, width, height);

    // bind textures and shader
    texture.bind();
    shader.bind();

    // update uniforms
    shader.uniforms.iGlobalTime = (time += dt) / 1000;

    // render
    triangle(gl);
  }
}
