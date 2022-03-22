# GLSLify Live Reloading Template or Sandbox

Live reloading sandbox for playing with shaders. This can also be used as a strating template for a GLSL shader demo. Leverages browserify, watchify, glslify, and imgurify.

## How to use

Just run `npm run start` to see the example I've laid out. It shows you how to:
* Import a fragment and vertex shader
* Use glslify to compile those shaders
* Use glslify to import and use custom GLSLify ecosystem utilities from NPM
* Define uniforms in your shader and update them from the JS
* Resize the canvas according to screen resize
* Run a render animation frame loop
* Import and render any image data as a 2D texture

This should be enough to get you off the ground so you can start tweaking away and using your own shaders as well as installing and importing glslify ecosystem packages.
