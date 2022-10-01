import { WebGLHelper } from './webgl_helper'
import * as dat from 'dat.gui'
import * as THREE from 'three'

// Matrix operations
export function vector_matrix_operations()
{
    // Doc: https://threejs.org/docs/#api/en/math/Matrix4
    // Code: https://github.com/mrdoob/three.js/blob/master/src/math/Matrix4.js

    // // Init
    // const m = new THREE.Matrix4();
    //
    // m.set( 11, 12, 13, 14,
    //     21, 22, 23, 24,
    //     31, 32, 33, 34,
    //     41, 42, 43, 44 ); // Row-major order
    //
    // console.log( m ) // Column-major order

    // m.elements = [ 11, 21, 31, 41,
    //     12, 22, 32, 42,
    //     13, 23, 33, 43,
    //     14, 24, 34, 44 ];

    // Matrix Transformations
    let trans_matrix = new THREE.Matrix4().makeTranslation(2,3,4)
    let scale_matrix = new THREE.Matrix4().makeScale(0.5, 0.5, 0.5)
    let rot_matrix_z = new THREE.Matrix4().makeRotationZ(90 * Math.PI / 180)
    let rot_matrix_y = new THREE.Matrix4().makeRotationY(90 * Math.PI / 180)
    let rot_matrix_x = new THREE.Matrix4().makeRotationX(90 * Math.PI / 180)
    // Table: https://byjus.com/maths/sin-90-degrees/

    console.log( 'trans_matrix' )
    console.log( trans_matrix.transpose() )

    console.log( 'scale_matrix' )
    console.log( scale_matrix.transpose() )

    console.log( 'rot_matrix_z' )
    console.log( rot_matrix_z.transpose() )

    console.log( 'rot_matrix_y' )
    console.log( rot_matrix_y.transpose() )

    console.log( 'rot_matrix_x' )
    console.log( rot_matrix_x.transpose() )

    // // Matrix Operations
    // let matrix_A = new THREE.Matrix4();
    // matrix_A.set(1, 2, -3, 5,
    //     0, 4, 1, 3,
    //     2, 0, 0, -1,
    //     4, -2, -1, 0
    // );
    //
    // let matrix_B = new THREE.Matrix4();
    // matrix_B.set(1, 2, -1, 0,
    //     0, 5, 3, 0,
    //     -2, 1, 1, 4,
    //     0, 6, -4, -3  );
    //
    // // Matrix Operations
    // let mul_matrix = new THREE.Matrix4().multiplyMatrices(matrix_A, matrix_B);
    //
    // //Report
    // console.log('matrix_A')
    // console.log( matrix_A.transpose() )
    // console.log('matrix_B')
    // console.log( matrix_B.transpose() )
    // console.log('mul_matrix')
    // console.log( mul_matrix.transpose() )

}

// Functions and classes
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

        // Anti-clock wise
        this.face(0, 1, 2, 3) // front [ok]
        this.face(5, 4, 7, 6) // back [ok] - Look outside the back face.
        this.face(3, 2, 6, 7) // top [ok]
        this.face(1, 0, 4, 5) // bottom [ok] - Look outside the bottom face.
        this.face(4, 0, 3, 7) // left [ok] - Look outside of left face.
        this.face(1, 5, 6, 2) // right [ok]

        this.v_out = []

        // console.log('size.indices: ')
        // console.log( this.indices.length )
        // console.log('indices: ')
        // console.log(this.indices)

        for(let i of this.indices){
            this.v_out.push(this.vertices[3 *i],
                this.vertices[3 *i + 1],
                this.vertices[3 *i + 2])
        }

        // console.log('size.v_out: ')
        // console.log( this.v_out.length )
        // console.log('v_out: ')
        // console.log(this.v_out)

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

        // console.log('theta')
        // console.log(theta)
        // console.log('rx')
        // console.log( rx.transpose() )
        // console.log('ry')
        // console.log( ry.transpose() )
        // console.log('rz')
        // console.log( rz.transpose() )
        // setTimeout(() => { console.log("World!"); }, 5000);

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

// Main
// vector_matrix_operations()
displayCube()