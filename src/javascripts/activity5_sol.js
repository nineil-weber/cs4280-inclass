// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Nils Murrugarra"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

//Then: comes everything else
// TODO

import { WebGLHelper } from './webgl_helper'
import * as dat from 'dat.gui'
import * as THREE from 'three'
import { Cube } from './cube'

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
        theta: 30,
        front: '#FF0000',
        back: '#00FF00',
        top: '#0000FF',
        bottom: '#FFFF00',
        left: '#FF00FF',
        right: '#00FFFF'
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

 	// Function for setting color of cube
    function setNewColor(){
        let newColors = cube.colors

        newColors[0] = WebGLHelper.getColorFromHex(controls.front)
        newColors[1] = WebGLHelper.getColorFromHex(controls.back)
        newColors[2] = WebGLHelper.getColorFromHex(controls.top)
        newColors[3] = WebGLHelper.getColorFromHex(controls.bottom)
        newColors[4] = WebGLHelper.getColorFromHex(controls.left)
        newColors[5] = WebGLHelper.getColorFromHex(controls.right)

        //changing colors
        cube.fixColors(newColors)

        WebGLHelper.initBuffers(gl, program, [{
            name: 'coordinates',
            size: 3,
            data: cube.v_out
        }, {
            name: 'color',
            size: 3,
            data: cube.c_out
        }])
    }

    let theta = [0, 0, 0]
    WebGLHelper.clear(gl, [1, 1, 1, 1])

    function animate() {
        instantiate(0, 0.8, [.9, .9, .9], [0, 0, 0])
        setNewColor()
        requestAnimationFrame(animate)
    }


    let gui = new dat.GUI()
    document.querySelector('aside').appendChild(gui.domElement)
    gui.add(controls, 'axis', { x: 0, y: 1, z: 2 })
    let sides = gui.addFolder('sides')
    sides.addColor(controls, 'front')
    sides.addColor(controls, 'back')
    sides.addColor(controls, 'top')
    sides.addColor(controls, 'bottom')
    sides.addColor(controls, 'left')
    sides.addColor(controls, 'right')
    sides.open()

    animate()
}

displayCube()