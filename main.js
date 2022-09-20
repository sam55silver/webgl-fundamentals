import './style.css';
import { InitShaders } from './shaders';
import { setUpUISlider } from './utility';

const main = () => {
  // Get A WebGL context
  const canvas = document.querySelector('#canvas');
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    return;
  }

  const program = InitShaders(gl);

  // look up where the vertex data needs to go.
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');

  const resolutionUniformLocation = gl.getUniformLocation(
    program,
    'u_resolution'
  );

  const colorLocation = gl.getUniformLocation(program, 'u_color');

  // Create a buffer and put three 2d clip space points in it
  const positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  const vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  let translate = [0, 0];
  const color = [Math.random(), Math.random(), Math.random()];

  drawScene(
    gl,
    program,
    vao,
    resolutionUniformLocation,
    positionBuffer,
    colorLocation,
    translate,
    color
  );

  const callback = (pos, value) => {
    translate[pos] = value;
    drawScene(
      gl,
      program,
      vao,
      resolutionUniformLocation,
      positionBuffer,
      colorLocation,
      translate,
      color
    );
  };
  setUpUISlider('x', [0, gl.canvas.width], 0, (value) => callback(0, value));
  setUpUISlider('y', [0, gl.canvas.height], 0, (value) => callback(1, value));
};

const drawScene = (
  gl,
  program,
  vao,
  resolutionUniformLocation,
  positionBuffer,
  colorLocation,
  translate,
  color
) => {
  // Resize canvas here

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // Bind the attribute/buffer set we want.
  gl.bindVertexArray(vao);

  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

  // Put a rectangle in the position buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setRectangle(gl, translate[0], translate[1], 60, 60);

  // Set a random color.
  gl.uniform4f(colorLocation, color[0], color[1], color[2], 1);

  // Draw the rectangle.
  gl.drawArrays(gl.TRIANGLES, 0, 6);
};

// Fill the buffer with the values that define a rectangle.
const setRectangle = (gl, x, y, width, height) => {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
    gl.STATIC_DRAW
  );
};

main();
