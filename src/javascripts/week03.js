// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Your name goes here"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

//Then: comes everything else
// Shaders
import vs_script from "../shaders/vertex.glsl"
import fs_script from "../shaders/fragment.glsl"

// JavaScript
import { WebGLHelper } from './webgl_helper'

displayPrimitivesAtClick(vs_script, fs_script)

export function displayPrimitivesAtClick(vs_script, fs_script){
  let canvas = document.querySelector("#webgl-scene")
  let gl = WebGLHelper.initWebGL(canvas)

  let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
  gl.useProgram(program)

  WebGLHelper.initBuffers(gl, program, [{
    name: 'coordinates',
    size: 3,
    data: []
  }])

  let vertices = []
  canvas.onmouseup = (e) => {
    let [x, y] = WebGLHelper.toWebGlCoordinates(e)
    vertices.push(x)
    vertices.push(y)
    vertices.push(0.0)

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)

  }

  WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0])
}

export function displayPointAtClick(vs_script, fs_script) {
  let canvas = document.querySelector("#webgl-scene")
  canvas.width = canvas.getClientRects()[0].width;
  canvas.height = canvas.getClientRects()[0].height;
  let gl = canvas.getContext("webgl2")
  if (!gl) {
    alert("Unable to initialize webgl; your browser may not support it.")
  }

  let v_shader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(v_shader, vs_script)
  gl.compileShader(v_shader)

  let f_shader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(f_shader, fs_script)
  gl.compileShader(f_shader)

  let program = gl.createProgram()
  gl.attachShader(program, v_shader)
  gl.attachShader(program, f_shader)
  gl.linkProgram(program)

  gl.useProgram(program)

  // Sending coordinates to GPU
  let coords = gl.getAttribLocation(program, "coordinates")

  canvas.onmouseup = (e) => {
    let rect = e.target.getBoundingClientRect()
    // x = (2u - w) /w
    // y = (h - 2v)/h

    let x = (2 * (e.clientX -rect.left) - rect.width) / rect.width
    let y = (rect.height - 2 * (e.clientY - rect.top)) / rect.height

    gl.vertexAttrib3f(coords, x, y, .0)
    gl.drawArrays(gl.POINTS, 0, 1)
  }

  // Clear the canvas
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)



}

export function displayTriangle(vs_script, fs_script) {
  let canvas = document.querySelector("#webgl-scene")
  canvas.width = canvas.getClientRects()[0].width;
  canvas.height = canvas.getClientRects()[0].height;
  let gl = canvas.getContext("webgl2")
  if (!gl) {
    alert("Unable to initialize webgl; your browser may not support it.")
  }

  let v_shader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(v_shader, vs_script)
  gl.compileShader(v_shader)

  let f_shader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(f_shader, fs_script)
  gl.compileShader(f_shader)

  let program = gl.createProgram()
  gl.attachShader(program, v_shader)
  gl.attachShader(program, f_shader)
  gl.linkProgram(program)

  gl.useProgram(program)



  // Sending coordinates to GPU
  let coords = gl.getAttribLocation(program, "coordinates")
  gl.enableVertexAttribArray(coords)
  let buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.vertexAttribPointer(coords, 3, gl.FLOAT, false, 0, 0)

  let vertices = [0, .5, 0, .5, .7, 0, -.5, -.7, 0]

  // Clear the canvas
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
  gl.drawArrays(gl.TRIANGLES, 0, 3)
}

export function displayPoint(vs_script, fs_script) {
  let canvas = document.querySelector("#webgl-scene")
  canvas.width = canvas.getClientRects()[0].width;
  canvas.height = canvas.getClientRects()[0].height;
  let gl = canvas.getContext("webgl2")
  if (!gl) {
    alert("Unable to initialize webgl; your browser may not support it.")
  }

  let v_shader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(v_shader, vs_script)
  gl.compileShader(v_shader)

  let f_shader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(f_shader, fs_script)
  gl.compileShader(f_shader)

  let program = gl.createProgram()
  gl.attachShader(program, v_shader)
  gl.attachShader(program, f_shader)
  gl.linkProgram(program)

  gl.useProgram(program)

  // Sending coordinates to GPU
  let coords = gl.getAttribLocation(program, "coordinates")
  gl.vertexAttrib3f(coords, .8, .8, .0)


  // Clear the canvas
  gl.clearColor(1.0, 1.0, 1.0, 1.0)
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)


  gl.drawArrays(gl.POINTS, 0, 1)
}

export function displayColoredTriangles(vs_script, fs_script){
  let canvas = document.querySelector("#webgl-scene")
  let gl = WebGLHelper.initWebGL(canvas)

  let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
  gl.useProgram(program)

  WebGLHelper.initBuffers(gl, program, [{
      name: 'coordinates',
      size: 3,
      data: [0 ,0 , 0, .5, .5, 0, .5, -.5, 0]
    },{
      name: 'color',
      size: 3,
      data: [1,0,0, 0,1,0, 0,0,1]
    }])

  WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0])
  gl.drawArrays(gl.TRIANGLES, 0, 3)

}
