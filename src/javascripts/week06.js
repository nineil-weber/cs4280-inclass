import { WebGLHelper } from './webgl_helper'
import * as dat from 'dat.gui'
import * as THREE from 'three'

import { Cube } from './cube'
import { Sphere } from './sphere'

// Helpers
function getTRSTransformation(controls){
    let e = new THREE.Euler(
        controls.r_x * Math.PI / 180,
        controls.r_y * Math.PI / 180,
        controls.r_z * Math.PI / 180
    )

    let t = new THREE.Matrix4().makeTranslation(controls.t_x, controls.t_y, controls.t_z)
    let r = new THREE.Matrix4().makeRotationFromEuler(e)
    let s = new THREE.Matrix4().makeScale(controls.s_x, controls.s_y, controls.s_z)
    // let s = new THREE.Matrix4().makeTranslation(controls.s_x, controls.s_y, controls.s_z)

    return new THREE.Matrix4().multiplyMatrices(t, new THREE.Matrix4().multiplyMatrices(r, s))

}

function getQuaternionTransformation(controls){
    let e = new THREE.Euler(
        controls.r_x * Math.PI / 180,
        controls.r_y * Math.PI / 180,
        controls.r_z * Math.PI / 180
    )
    let q = new THREE.Quaternion()
    q.setFromEuler(e)
    return new THREE.Matrix4().makeRotationFromQuaternion(q)
}

// Functions and classes
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

        // let s = new THREE.Matrix4().makeScale(.5, 1.5, .5)
        // let t = new THREE.Matrix4().makeTranslation(-.2, .3, .1)
        let rx  = new THREE.Matrix4().makeRotationX(theta[0] * Math.PI / 180)
        let ry  = new THREE.Matrix4().makeRotationY(theta[1] * Math.PI / 180)
        let rz  = new THREE.Matrix4().makeRotationZ(theta[2] * Math.PI / 180)

        let ryz = new THREE.Matrix4().multiplyMatrices(ry, rz)
        let rxyz = new THREE.Matrix4().multiplyMatrices(rx, ryz)

        // let rs = new THREE.Matrix4().multiplyMatrices(rxyz, s)
        // let trs = new THREE.Matrix4().multiplyMatrices(t, rs)
        WebGLHelper.clear(gl, [1, 1, 1, 1])
        gl.uniformMatrix4fv(transformByLoc, false, rxyz.elements)

        gl.drawElements(gl.TRIANGLES, cube.indices.length, gl.UNSIGNED_SHORT, 0)

        requestAnimationFrame(animate)
    }

    animate()

    let gui = new dat.GUI()
    document.querySelector('aside').appendChild(gui.domElement)
    gui.add(controls, 'axis', {x: 0, y: 1, z: 2})
}

export function displayCubeOperations(){
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
        t_x: 0,
        t_y: 0,
        t_z: 0,

        r_x: 0,
        r_y: 0,
        r_z: 0,

        s_x: 0,
        s_y: 0,
        s_z: 0,
    }

    function animate(){
        WebGLHelper.clear(gl, [1, 1, 1, 1])

        // Cube 1: Big cube
        gl.uniformMatrix4fv(transformByLoc, false, getTRSTransformation(controls).elements)
        gl.drawArrays(gl.TRIANGLES, 0, cube.v_out.length / 3)

        // Cube 2: Small cube
        let s = new THREE.Matrix4().makeScale(1, .2, 1) // Individual, without using controls
        let q = getQuaternionTransformation(controls) // Apply rotation only
        gl.uniformMatrix4fv(transformByLoc, false, new THREE.Matrix4().multiplyMatrices(q, s).elements)

        gl.drawArrays(gl.TRIANGLES, 0, cube.v_out.length / 3)
    }

    animate()

    let gui = new dat.GUI()
    document.querySelector('aside').appendChild(gui.domElement)

    gui.add(controls, 't_x').min(-1).max(1).onChange(animate)
    gui.add(controls, 't_y').min(-1).max(1).onChange(animate)
    gui.add(controls, 't_z').min(-1).max(1).onChange(animate)

    gui.add(controls, 'r_x').min(0).max(360).onChange(animate)
    gui.add(controls, 'r_y').min(0).max(360).onChange(animate)
    gui.add(controls, 'r_z').min(0).max(360).onChange(animate)

    gui.add(controls, 's_x').min(0.1).max(2).onChange(animate)
    gui.add(controls, 's_y').min(0.1).max(2).onChange(animate)
    gui.add(controls, 's_z').min(0.1).max(2).onChange(animate)
}

export function displayMultipleCubes(){
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
        theta: 30,
        // front: '#FF0000',
        // back: '#00FF00',
        // top: '#0000FF',
        // bottom: '#FFFF00',
        // left: '#FF00FF',
        // right: '#00FFFF'
    }

    function instantiate(i, thetaIncrement, scaleBy, translateTo){
        theta[controls.axis] += .2

        let rx = new THREE.Matrix4().makeRotationX(theta[0] * Math.PI / 180)
        let ry = new THREE.Matrix4().makeRotationY(theta[1] * Math.PI / 180)
        let rz = new THREE.Matrix4().makeRotationZ(theta[2] * Math.PI / 180)
        let ryz = new THREE.Matrix4().multiplyMatrices(ry, rz)
        let r = new THREE.Matrix4().multiplyMatrices(rx, ryz)

        let s = new THREE.Matrix4().makeScale(...scaleBy)
        let t = new THREE.Matrix4().makeTranslation(...translateTo)

        // TRS transformation
        let m = new THREE.Matrix4().multiplyMatrices(t, new THREE.Matrix4().multiplyMatrices(r, s))
        gl.uniformMatrix4fv(transformByLoc, false, m.elements)

        gl.drawArrays(gl.TRIANGLES, 0, cube.v_out.length / 3)
    }

    let theta = [0, 0, 0]
    WebGLHelper.clear(gl, [1, 1, 1, 1])
    function animate() {
        instantiate(0, 0.8, [.9, .9, .9], [0, 0, 0])
        instantiate(1, 1, [.3, .3, .3], [-.7, -.7, .4])
        instantiate(2, 1.5, [.3, .6, .3], [.6, .6, .4])
        instantiate(3, 0.8, [.2, .2, .2], [-.6, .7, -.4])
        instantiate(3, 0.8, [.2, .6, .1], [.6, -.6, .1])

        requestAnimationFrame(animate)
        // setNewColor()
    }
    animate()

    let gui = new dat.GUI()
    document.querySelector('aside').appendChild(gui.domElement)
    gui.add(controls, 'axis', { x: 0, y: 1, z: 2 })

    // let sides = gui.addFolder('sides')
    // sides.addColor(controls, 'front')
    // sides.addColor(controls, 'back')
    // sides.addColor(controls, 'top')
    // sides.addColor(controls, 'bottom')
    // sides.addColor(controls, 'left')
    // sides.addColor(controls, 'right')
    // sides.open()

    // // Function for setting color of cube
    // function setNewColor(){
    //     let newColors = cube.colors
    //
    //     newColors[0] = WebGLHelper.getColorFromHex(controls.front)
    //     newColors[1] = WebGLHelper.getColorFromHex(controls.back)
    //     newColors[2] = WebGLHelper.getColorFromHex(controls.top)
    //     newColors[3] = WebGLHelper.getColorFromHex(controls.bottom)
    //     newColors[4] = WebGLHelper.getColorFromHex(controls.left)
    //     newColors[5] = WebGLHelper.getColorFromHex(controls.right)
    //
    //     cube.colors = newColors
    //     // cube.fixColors()
    //     cube.fixColors
    //
    //     WebGLHelper.initBuffers(gl, program, [{
    //         name: 'coordinates',
    //         size: 3,
    //         data: cube.v_out
    //     }, {
    //         name: 'color',
    //         size: 3,
    //         data: cube.c_out
    //     }])
    // }
}

export function displaySphere() {
    const vs_script = `#version 300 es
    in vec3 coordinates;
    in vec3 color;
    out vec4 vColor;
    uniform mat4 transformBy;
    void main(void) {
      gl_Position = transformBy * vec4(coordinates, 1.0);
      gl_PointSize = 3.0;
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

    let sphere = new Sphere(.9, 69)
    let buffers = WebGLHelper.initBuffers(gl, program, [{
        name: 'coordinates',
        size: 3,
        data: sphere.vertices
    }])

    let transformByLoc = gl.getUniformLocation(program, 'transformBy')

    let controls = {
        axis: 1,
        theta: 30
    }

    let theta = [30, 0, 30]
    function animate() {
        theta[controls.axis] += 0.5

        let rx = new THREE.Matrix4().makeRotationX(theta[0] * Math.PI / 180)
        let ry = new THREE.Matrix4().makeRotationY(theta[1] * Math.PI / 180)
        let rz = new THREE.Matrix4().makeRotationZ(theta[2] * Math.PI / 180)

        let ryz = new THREE.Matrix4().multiplyMatrices(ry, rz)
        let rxyz = new THREE.Matrix4().multiplyMatrices(rx, ryz)

        WebGLHelper.loadAttributeF(gl, program, 'color', 1, 0, 0)
        gl.uniformMatrix4fv(transformByLoc, false, rxyz.elements)

        gl.drawArrays(gl.POINTS, 0, sphere.vertices.length / 3)
        requestAnimationFrame(animate)
    }
    animate()

    let gui = new dat.GUI()
    document.querySelector('aside').appendChild(gui.domElement)
    gui.add(controls, 'axis', { x: 0, y: 1, z: 2 })
}

// Main
// displayCubeIndexed()
// displayMultipleCubes()
// displayCubeOperations()
displaySphere()

// Notes
// * WebGL coordinates: https://www.tutorialspoint.com/webgl/webgl_basics.htm

// [Matlab Code] Transformations - Exercise 1
// tm = [1 0 0 -20; 0 1 0 -30; 0 0 1 30; 0 0 0 1]
// rm = [1 0 0 0; 0 cos(45 * pi / 180) -sin(45 * pi / 180) 0; 0 sin(45 * pi / 180) cos(45 * pi / 180) 0; 0 0 0 1]
// trans_m = rm * tm
// pm = [0 0 0 1; 0 60 0 1; 0 60 40 1; 90 0 0 1; 90 60 0 1; 90 60 40 1]'
// rm = trans_m * pm

// [Point Connections]
// Base
// p0	p1
// p1	p4
// p4	p3
// p3	p0
//
// Pyramid
// p4	p5
// p3	p5
// p0	p2
// p1	p2
// p2	p5


// // [Init plot]
// points = pm(1:3 ,:);
// lines = [points(:,1) points(:,2) points(:,5) points(:,4) points(:,5) points(:,4) points(:,1) points(:,2) points(:,3);
//          points(:,2) points(:,5) points(:,4) points(:,1) points(:,6) points(:,6) points(:,3) points(:,3) points(:,6)];
// X = [lines(1,:)' lines(4,:)'];
// Y = [lines(2,:)' lines(5,:)'];
// Z = [lines(3,:)' lines(6,:)'];
// plot3(X',Y',Z')
// hold on
// plot3(X',Y',Z','.')
// xlabel('X');
// ylabel('Y');
// zlabel('Z');
// grid;

// // [Results plot]
// figure();
// new_points = rm(1:3, :);
// lines = [new_points(:,1) new_points(:,2) new_points(:,5) new_points(:,4) new_points(:,5) new_points(:,4) new_points(:,1) new_points(:,2) new_points(:,3);
//          new_points(:,2) new_points(:,5) new_points(:,4) new_points(:,1) new_points(:,6) new_points(:,6) new_points(:,3) new_points(:,3) new_points(:,6)];
// X = [lines(1,:)' lines(4,:)'];
// Y = [lines(2,:)' lines(5,:)'];
// Z = [lines(3,:)' lines(6,:)'];
// plot3(X',Y',Z')
// hold on
// plot3(X',Y',Z','.')
// xlabel('X');
// ylabel('Y');
// zlabel('Z');
// grid;
