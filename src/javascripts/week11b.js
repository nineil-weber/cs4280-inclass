import * as THREE from 'three'
import v_shader from '../shaders/v_shader_water.glsl'
import f_shader from '../shaders/f_shader_water.glsl'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { sinusoidal, checkerboard, somePattern} from './textures'
import { MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import { Water } from 'three/examples/jsm/objects/Water2'
import { TextureLoader } from 'three'

function get_curve()
{
    let path = new THREE.CurvePath() // https://threejs.org/docs/#api/en/extras/core/CurvePath

    path.add(new THREE.LineCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-1, 0, 0),
    ))

    path.add(new THREE.LineCurve3(
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(-1, 1, 0),
    ))

    path.add(new THREE.CubicBezierCurve3(
        new THREE.Vector3(-1, 1, 0),
        new THREE.Vector3(-.5, .5, 0),
        new THREE.Vector3(1.5, 1.5, 0),
        new THREE.Vector3(0, 0, 0),
    ))

    return path
}

export function displayOcean() {
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0x000000) // Black

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    let clock = new THREE.Clock() // Object to keep track of time
    // https://threejs.org/docs/#api/en/core/Clock

    let uniforms = {
        iGlobalTime : {
            type: 'f',
            value: 0.1 // Change as you animate
        },
        iResolution: {
            type: 'v2',
            value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight)
        }
    } // Variables came from f_shared_water.glsl

    camera.position.set(20, 10, 20)

    camera.lookAt(scene.position)

    let material = new  THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: v_shader,
        fragmentShader: f_shader
    })


    let water = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(canvas.clientWidth, canvas.clientHeight, 40), material)
    scene.add(water)

    function animate(){
        uniforms.iGlobalTime.value += clock.getDelta() // Get the seconds passed since the time .oldTime was set and sets .oldTime to the current time.
        // uniforms.iGlobalTime.value += 0.0001
        // uniforms.iGlobalTime.value = clock.getDelta()
        console.log('value: ' + uniforms.iGlobalTime.value) // to print
        // console.log('delta: ' + clock.getDelta())
        renderer.render(scene, camera)
        requestAnimationFrame(animate)
    }

    animate()
}

export function displayTexturedScene(){
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xEEEEEE)

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    // Loading textures
    let texLoader = new THREE.TextureLoader()
    let textures = {
        crate: texLoader.load('./images/crate0.png', function(){
            renderer.render(scene, camera)
        }),
        crate_bump: texLoader.load('./images/crate0_bump.png', function(){
            renderer.render(scene, camera)
        }),
        crate_normal: texLoader.load('./images/crate0_normal.png', function(){
            renderer.render(scene, camera)
        }),
        earth: texLoader.load('./images/earth.jpg', function(){
            renderer.render(scene, camera)
        }),
        wall: texLoader.load('./images/stone.jpg', function(texture){
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(4, 1)
            renderer.render(scene, camera)
        }),
        floor: texLoader.load('./images/grass.jpg', function(texture){
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(8, 5)
            renderer.render(scene, camera)
        }),
        sinusoidal: sinusoidal(256, 256),
        checkerboard: checkerboard(512, 512),
        somePattern: somePattern(128, 128),
        water1: texLoader.load('./images/water_normal_1.jpg', function(){
            renderer.render(scene, camera)
        }),
        water2: texLoader.load('./images/water_normal_2.jpg', function(){
            renderer.render(scene, camera)
        })

    }

    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })

    // Adding the crate
    let geometry = new THREE.BoxGeometry(100, 100, 100)
    let crate = new THREE.Mesh(geometry)
    crate.materialParams = {}
    crate.position.set(-100, 50, -100)
    crate.name = 'crate'
    scene.add(crate)
    crate.castShadow = true
    crate.material = new THREE.MeshStandardMaterial(crate.materialParams)
    crate.material.map = textures[crate.name]
    crate.material.bumpMap = textures['crate_bump']
    crate.material.bumpScale = .6
    crate.material.normalMap = textures['crate_normal']

    let cube = new THREE.Mesh(geometry)
    cube.materialParams = {}
    cube.position.set(0, 50, 0)
    cube.name = 'checkerboard'
    scene.add(cube)
    cube.castShadow = true
    cube.material = new THREE.MeshStandardMaterial(cube.materialParams)
    cube.material.map = textures[cube.name]


    // Adding the floor
    geometry = new THREE.PlaneGeometry(800, 500)
    let plane = new THREE.Mesh(geometry)
    plane.materialParams = { side: THREE.DoubleSide }
    plane.rotateX(Math.PI / 2)
    plane.name = 'floor'
    plane.receiveShadow = true
    scene.add(plane)
    plane.material = new THREE.MeshStandardMaterial(plane.materialParams)
    plane.material.map = textures[plane.name]


    let waterGeometry = new THREE.PlaneBufferGeometry(500, 300)
    let water = new Water(waterGeometry, {
        color: '#FFFFFF',
        scale: 4,
        flowDirection: new THREE.Vector2(1, 1),
        textureWidth: 1024,
        textureHeight: 1024,
        normalMap0: textures['water1'],
        normalMap1: textures['water2']
    })

    water.position.y = 5
    water.rotation.x = Math.PI * -0.5;
    scene.add(water)

    // Adding a wall
    geometry = new THREE.BoxGeometry(500, 100, 5)
    let wall = new THREE.Mesh(geometry)
    wall.materialParams = {}
    wall.name = 'wall'
    wall.position.set(0, 50, 150)
    wall.castShadow = true
    scene.add(wall)
    wall.material = new THREE.MeshStandardMaterial(wall.materialParams)
    wall.material.map = textures[wall.name]

    //Adding google earth
    geometry = new THREE.SphereGeometry(50, 40, 40)
    let sphere = new THREE.Mesh(geometry)
    sphere.materialParams = {}
    sphere.name = 'earth'
    sphere.position.set(200, 50, -50)
    sphere.castShadow = true
    scene.add(sphere)
    sphere.material = new THREE.MeshStandardMaterial(sphere.materialParams)
    sphere.material.map = textures[sphere.name]

    // Adding light sources
    let ambientLight = new THREE.AmbientLight(0x333333) // light black
    let directionalLight = new THREE.DirectionalLight(0x777777) // Gray
    directionalLight.castShadow = true
    let pointLight = new THREE.PointLight(0x999999) // Black
    pointLight.position.set(0, 200, 0)
    pointLight.castShadow = true
    let spotLight = new THREE.SpotLight(0x999999) // Black
    spotLight.position.set(0, 200, 0)
    spotLight.target = sphere

    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)
    scene.add(spotLight)

    let rayCaster = new THREE.Raycaster() // Find intersections with objects
    let pointerAt = new THREE.Vector2()
    canvas.addEventListener('pointerup', e => {
        // alert('clicked')

        let rect = e.target.getBoundingClientRect()

        // x = (2u - w) /w
        pointerAt.x = (2 * (e.clientX - rect.left) - rect.width) / rect.width
        // y = (h - 2v) / h
        pointerAt.y = (rect.height - 2 * (e.clientY - rect.top)) /rect.height

        rayCaster.setFromCamera(pointerAt, camera)
        let intersects = rayCaster.intersectObjects([wall, plane, crate, cube, sphere])
        for(let intersect of intersects){
            // console.log( intersect.object.name )

            // // change color
            // let obj = intersect.object
            // obj.material = new THREE.MeshBasicMaterial({color: 0xFF00FF})
            // break

            let obj = intersect.object
            obj.rotation.x += 2
            obj.rotation.z += 2
            break
        }
    })

    camera.position.set(-200, 400, -200)

    function animate() {
        renderer.shadowMap.enabled = true

        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        cameraControls.update()

        requestAnimationFrame(animate)
    }

    animate()
}

export function display_scene_path() {
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0x000000)

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    let cube = new THREE.Mesh( new THREE.BoxGeometry(.15, .15, .15), new THREE.MeshNormalMaterial() )
    scene.add(cube)

    let path = get_curve()
    console.log('curves: ' + path.curves)
    console.log('curves[0]: ' + path.curves[0])
    console.log('curves[0][0]: ' + path.curves[0][0])
    let points = path.curves.reduce((p, d) => [...p, ...d.getPoints(40)], [])
    // https://www.w3schools.com/jsref/jsref_reduce.asp
    // https://thecodebarbarian.com/javascript-reduce-in-5-examples.html

    scene.add(new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({color: 0xFFFF00})
    ))

    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })

    camera.position.set(2, -1, 3)

    camera.lookAt(scene.position)

    let fraction = 0
    // const up = new THREE.Vector3(0, 1, 0)
    // const axis = new THREE.Vector3()

    function animate(){
        let new_position = path.getPoint( fraction )
        // let tangent = path.getTangent( fraction )
        cube.position.copy( new_position )

        // axis.crossVectors( up, tangent ).normalize()
        // let angle = Math.acos( up.dot(tangent) )
        // cube.quaternion.setFromAxisAngle( axis, angle )

        renderer.render(scene, camera)
        fraction += 0.001
        if (fraction > 1)
            fraction = 0

        cameraControls.update()
        requestAnimationFrame(animate)
    }

    animate()
}

//Main
// displayOcean() // Ocean animation
// displayTexturedScene() // Adding clicks on objects
display_scene_path() // Move object around a path