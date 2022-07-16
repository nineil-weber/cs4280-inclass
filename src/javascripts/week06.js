import { WebGLHelper } from './webgl_helper'
import * as dat from 'dat.gui'
import * as THREE from 'three'

class CubeIndexed {
  constructor(){
    this.vertices = [
      -.5, -.5,  .5, // 0
       .5, -.5,  .5, // 1
       .5,  .5,  .5, // 2
      -.5,  .5,  .5, // 3
      -.5, -.5, -.5, // 4
       .5, -.5, -.5, // 5
       .5,  .5, -.5, // 6
      -.5,  .5, -.5  // 7
    ]
  
    this.indices = []

    this.face(0, 1, 2, 3) // front
    this.face(5, 4, 7, 6) // back
    this.face(3, 2, 6, 7) // top
    this.face(1, 0, 4, 5) // bottom
    this.face(4, 0, 3, 7) // left
    this.face(1, 5, 6, 2) // right

    this.colors = [
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
      1, 1, 0,
      1, 0, 1,
      0, 1, 1,
      1, .5, 1,
      .4, .1, 1
    ]
  }

  face(a, b, c , d){
    this.indices.push(a, b, c)
    this.indices.push(a, c, d)
  }
}


export function displayCubeIndexed(){
  const vs_script = `#version 300 es
    in vec3 coordinates;
    in vec3 color;
    out vec4 vColor;
    uniform mat4 transformBy;
    void main(void) {
      gl_Position = transformBy * vec4(coordinates, 1.0);
      vColor = vec4(color, 1.0);
    }  
  `

  const fs_script = `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 fragColor;
    void main(void) {
      fragColor = vColor; 
    }
  `
  let canvas = document.querySelector("#webgl-scene")
  let gl = WebGLHelper.initWebGL(canvas)

  let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
  gl.useProgram(program)

  let cube = new CubeIndexed()

  let buffers = WebGLHelper.initBuffers(gl, program, [{
      name: 'coordinates',
      size: 3,
      data: cube.vertices,
      indices: cube.indices
    }, {
      name: 'color',
      size: 3,
      data: cube.colors
    }])

  let transformByLoc = gl.getUniformLocation(program, 'transformBy')

  let controls = {
    axis: 1,
    theta: 30
  }

  let theta = [0, 0, 0]
  function animate(){
    theta[controls.axis] += .8

    let s = new THREE.Matrix4().makeScale(.5, 1.5, .5)
    let t = new THREE.Matrix4().makeTranslation(-.2, .3, .1)
    let rx  = new THREE.Matrix4().makeRotationX(theta[0] * Math.PI / 180)
    let ry  = new THREE.Matrix4().makeRotationY(theta[1] * Math.PI / 180)
    let rz  = new THREE.Matrix4().makeRotationZ(theta[2] * Math.PI / 180)

    let ryz = new THREE.Matrix4().multiplyMatrices(ry, rz)
    let rxyz = new THREE.Matrix4().multiplyMatrices(rx, ryz)

    let rs = new THREE.Matrix4().multiplyMatrices(rxyz, s)
    let trs = new THREE.Matrix4().multiplyMatrices(t, rs)
    WebGLHelper.clear(gl, [1, 1, 1, 1])
    gl.uniformMatrix4fv(transformByLoc, false, trs.elements)

    gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0)

    requestAnimationFrame(animate)
  }

  animate()

  let gui = new dat.GUI()
  document.querySelector('aside').appendChild(gui.domElement)
  gui.add(controls, 'axis', {x: 0, y: 1, z: 2})
}

class Cube {
  constructor(){
    this.vertices = [
      -.5, -.5,  .5, // 0
       .5, -.5,  .5, // 1
       .5,  .5,  .5, // 2
      -.5,  .5,  .5, // 3
      -.5, -.5, -.5, // 4
       .5, -.5, -.5, // 5
       .5,  .5, -.5, // 6
      -.5,  .5, -.5  // 7
    ]
  
    this.indices = []

    this.face(0, 1, 2, 3) // front
    this.face(5, 4, 7, 6) // back
    this.face(3, 2, 6, 7) // top
    this.face(1, 0, 4, 5) // bottom
    this.face(4, 0, 3, 7) // left
    this.face(1, 5, 6, 2) // right

    this.v_out = []
    for(let i of this.indices){
      this.v_out.push(this.vertices[3 *i],
                      this.vertices[3 *i + 1],
                      this.vertices[3 *i + 2])
    }

    this.colors = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1]
    ]

    this.c_out = []
    for(let c of this.colors){
      for(let i = 0; i < 6; i++){
        this.c_out.push(c[0], c[1], c[2])
      }
    }
  }

  face(a, b, c , d){
    this.indices.push(a, b, c)
    this.indices.push(a, c, d)
  }
}


export function displayCube(){
  const vs_script = `#version 300 es
    in vec3 coordinates;
    in vec3 color;
    out vec4 vColor;
    uniform mat4 transformBy;
    void main(void) {
      gl_Position = transformBy * vec4(coordinates, 1.0);
      vColor = vec4(color, 1.0);
    }  
  `

  const fs_script = `#version 300 es
    precision mediump float;
    in vec4 vColor;
    out vec4 fragColor;
    void main(void) {
      fragColor = vColor; 
    }
  `
  let canvas = document.querySelector("#webgl-scene")
  let gl = WebGLHelper.initWebGL(canvas)

  let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
  gl.useProgram(program)

  let cube = new Cube()

  let buffers = WebGLHelper.initBuffers(gl, program, [{
      name: 'coordinates',
      size: 3,
      data: cube.v_out
    }, {
      name: 'color',
      size: 3,
      data: cube.c_out
    }])

  let transformByLoc = gl.getUniformLocation(program, 'transformBy')

  let controls = {
    axis: 1,
    theta: 30
  }

  let theta = [0, 0, 0]
  function animate(){
    theta[controls.axis] += .8

    let rx  = new THREE.Matrix4().makeRotationX(theta[0] * Math.PI / 180)
    let ry  = new THREE.Matrix4().makeRotationY(theta[1] * Math.PI / 180)
    let rz  = new THREE.Matrix4().makeRotationZ(theta[2] * Math.PI / 180)

    let ryz = new THREE.Matrix4().multiplyMatrices(ry, rz)
    let rxyz = new THREE.Matrix4().multiplyMatrices(rx, ryz)

    WebGLHelper.clear(gl, [1, 1, 1, 1])
    gl.uniformMatrix4fv(transformByLoc, false, rxyz.elements)

    gl.drawArrays(gl.TRIANGLES, 0, cube.v_out.length / 3)

    requestAnimationFrame(animate)
  }

  animate()

  let gui = new dat.GUI()
  document.querySelector('aside').appendChild(gui.domElement)
  gui.add(controls, 'axis', {x: 0, y: 1, z: 2})
}