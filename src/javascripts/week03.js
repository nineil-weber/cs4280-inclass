// Required by Webpack - do not touch
require.context('../', true, /\.(html|json|txt|dat)$/i)
require.context('../images/', true, /\.(gif|jpg|png|svg|eot|ttf|woff|woff2)$/i)
require.context('../stylesheets/', true, /\.(css|scss)$/i)

// First: Set up your name
let std_name = "Nils Murrugarra-Llerena"
document.querySelector('#std_name').innerHTML = `<strong>${std_name}</strong>`

// Shaders
// https://learnopengl.com/Getting-started/Shaders
import vs_script from "../shaders/vertex.glsl"
import fs_script from "../shaders/fragment.glsl"

import vs_color_script from "../shaders/vertex-color.glsl"
import fs_color_script from "../shaders/fragment-color.glsl"


// JavaScript
import { WebGLHelper } from './webgl_helper'
// https://www.tutorialspoint.com/webgl/webgl_graphics_pipeline.htm
// https://medium.com/trabe/a-brief-introduction-to-webgl-5b584db3d6d6 [++]


displayPoint(vs_script, fs_script)
// displayPointAtClick(vs_script, fs_script) //Display point at click
// displayPrimitivesAtClick(vs_script, fs_script) // Draw Triangles with clicks

// displayTriangle(vs_script, fs_script)
// displayColoredTriangles(vs_color_script, fs_color_script)

// Functions
export function displayPoint(vs_script, fs_script) {
    console.log('displayPoint')
    let canvas = document.querySelector("#webgl-scene")
    canvas.width = canvas.getClientRects()[0].width;
    canvas.height = canvas.getClientRects()[0].height;
    let gl = canvas.getContext("webgl2")
    if (!gl) {
        alert("Unable to initialize webgl; your browser may not support it.")
    }

    // Shaders
    let v_shader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(v_shader, vs_script)
    gl.compileShader(v_shader)

    let f_shader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(f_shader, fs_script)
    gl.compileShader(f_shader)

    // Attach shaders
    let program = gl.createProgram()
    gl.attachShader(program, v_shader)
    gl.attachShader(program, f_shader)
    gl.linkProgram(program)

    gl.useProgram(program)

    // Sending coordinates to GPU
    let coords = gl.getAttribLocation(program, "coordinates")
    gl.vertexAttrib3f(coords, .8, .8, .0)

    // Clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0) // white color
    // gl.clearColor(1.0, 0.0, 0.0, 1.0) // red color
    // gl.clearColor(0.0, 1.0, 0.0, 1.0) // green color
    // gl.clearColor(0.0, 0.0, 1.0, 1.0) // blue color
    gl.enable(gl.DEPTH_TEST) // Allow 3D depth. Determine which objects are closer to the camera
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT) // clean buffers


    gl.drawArrays(gl.POINTS, 0, 1) // draw function
}

export function displayPointAtClick(vs_script, fs_script) {
    console.log('displayPointAtClick')
    let canvas = document.querySelector("#webgl-scene")
    canvas.width = canvas.getClientRects()[0].width;
    canvas.height = canvas.getClientRects()[0].height;

    console.log('canvas.width: ' + canvas.width);
    console.log('canvas.height: ' + canvas.height);

    let gl = canvas.getContext("webgl2")
    if (!gl) {
        alert("Unable to initialize webgl; your browser may not support it.")
    }

    // Shaders
    let v_shader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(v_shader, vs_script)
    gl.compileShader(v_shader)

    let f_shader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(f_shader, fs_script)
    gl.compileShader(f_shader)

    // Attach shaders
    let program = gl.createProgram()
    gl.attachShader(program, v_shader)
    gl.attachShader(program, f_shader)
    gl.linkProgram(program)

    gl.useProgram(program)

    // Sending coordinates to GPU
    let coords = gl.getAttribLocation(program, "coordinates")

    // Mouse Click event
    canvas.onmouseup = (e) => {
        let rect = e.target.getBoundingClientRect() // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
        // x = (2u - w) /w
        // y = (h - 2v)/h

        // Coordinate from canvas container
        let u = (e.clientX - rect.left)
        let v = (e.clientY - rect.top)
        let w = rect.width
        let h = rect.height

        let x = (2 * u - w) / w
        let y = (h - 2 * v) / h

        // // (x, y) are coordinates in usual plane
        // console.log('e.clientX: ' + e.clientX)
        // console.log('e.clientY: ' + e.clientY)
        // console.log('rect.left: ' + rect.left)
        // console.log('rect.top: ' + rect.top)
        // console.log('u: ' + u)
        // console.log('v: ' + v)

        // Sending coordinates to GPU
        gl.vertexAttrib3f(coords, x, y, .0)
        gl.drawArrays(gl.POINTS, 0, 1)
    }

    // Clear the canvas
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}

export function displayPrimitivesAtClick(vs_script, fs_script){
    console.log('displayPrimitivesAtClick')
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
        gl.drawArrays(gl.POINTS, 0, vertices.length / 3)
        // gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 3)
    }

    WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0])
}

export function displayTriangle(vs_script, fs_script) {
    console.log('displayTriangle')
    let canvas = document.querySelector("#webgl-scene")
    canvas.width = canvas.getClientRects()[0].width;
    canvas.height = canvas.getClientRects()[0].height;
    let gl = canvas.getContext("webgl2")
    if (!gl) {
        alert("Unable to initialize webgl; your browser may not support it.")
    }

    // Shaders
    let v_shader = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(v_shader, vs_script)
    gl.compileShader(v_shader)

    let f_shader = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(f_shader, fs_script)
    gl.compileShader(f_shader)

    // Attach shaders
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

export function displayColoredTriangles(vs_script, fs_script){
    console.log('displayColoredTriangles')
    let canvas = document.querySelector("#webgl-scene")
    let gl = WebGLHelper.initWebGL(canvas)

    let program = WebGLHelper.initShaders(gl, vs_script, fs_script)
    gl.useProgram(program)

    WebGLHelper.initBuffers(gl, program, [{
        name: 'coordinates',
        size: 3,
        data: [0 ,0 , 0,
            .5, .5, 0,
            .5, -.5, 0]
    },{
        name: 'color',
        size: 3,
        data: [1,0,0, 0,1,0, 0,0,1]
    }])

    WebGLHelper.clear(gl, [1.0, 1.0, 1.0, 1.0]) // background color: white
    // WebGLHelper.clear( gl, [1.0, 0.0, 0.0, 1.0] ) // background color: red
    gl.drawArrays( gl.TRIANGLES, 0, 3 )
}
