import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { sinusoidal, checkerboard, somePattern} from './textures'
import { MTLLoader, OBJLoader} from 'three-obj-mtl-loader' // material and object loaders

export function displayCity(){
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xEEEEEE)

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    // Loading models
    let mtlLoader = new MTLLoader() // material loader
    let objLoader = new OBJLoader() // object loader
    mtlLoader.load("./models/city.mtl", function(material){
        material.preload()
        objLoader.setMaterials(material)
        objLoader.load("./models/city.obj", function(city){
            for(let o of city.children){
                o.material = new THREE.MeshNormalMaterial()
            }

            scene.add(city)

            renderer.render(scene, camera)
        })
    })


    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })


    // Adding light sources
    let ambientLight = new THREE.AmbientLight(0x333333)
    let directionalLight = new THREE.DirectionalLight(0x777777)
    let pointLight = new THREE.PointLight(0x999999)

    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)

    camera.position.set(-200, 400, -200)

    function animate() {
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        cameraControls.update()
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
        }), // Crate images will be combined
        earth: texLoader.load('./images/earth.jpg', function(){
            renderer.render(scene, camera)
        }),
        wall: texLoader.load('./images/stone.jpg', function(texture){
            texture.wrapS = THREE.RepeatWrapping
            texture.wrapT = THREE.RepeatWrapping
            texture.repeat.set(4, 1)
            renderer.render(scene, camera)
        }),
        floor: texLoader.load('./images/floor.jpg', function(){
            renderer.render(scene, camera)
        }),
        sinusoidal: sinusoidal(256, 256),
        checkerboard: checkerboard(512, 512),
        somePattern: somePattern(128, 128)
    }

    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })

    // Adding the crate
    let geometry = new THREE.BoxGeometry(100, 100, 100)
    let cube = new THREE.Mesh(geometry)
    cube.materialParams = {}
    cube.position.set(-200, 50, -100)
    cube.name = 'crate'
    scene.add(cube)
    cube.material = new THREE.MeshStandardMaterial(cube.materialParams)
    cube.material.map = textures[cube.name] // Step 1
    cube.material.bumpMap = textures['crate_bump'] // Step 2 - Give 3D effect
    cube.material.bumpScale = .6 // Step 3
    cube.material.normalMap = textures['crate_normal'] // Step 4

    // cube = new THREE.Mesh(geometry)
    // cube.materialParams = {}
    // cube.position.set(200, 50, 100)
    // cube.name = 'somePattern'
    // scene.add(cube)
    // cube.material = new THREE.MeshStandardMaterial(cube.materialParams)
    // cube.material.map = textures[cube.name]
    //
    //
    // // Adding the floor
    // geometry = new THREE.PlaneGeometry(500, 300)
    // let plane = new THREE.Mesh(geometry)
    // plane.materialParams = { side: THREE.DoubleSide }
    // plane.rotateX(Math.PI / 2)
    // plane.name = 'floor'
    // scene.add(plane)
    // plane.material = new THREE.MeshStandardMaterial(plane.materialParams)
    // plane.material.map = textures[plane.name]
    //
    //
    // Adding a wall
    geometry = new THREE.BoxGeometry(500, 100, 5)
    let wall = new THREE.Mesh(geometry)
    wall.materialParams = {}
    wall.name = 'wall'
    wall.position.set(0, 50, 150)
    scene.add(wall)
    wall.material = new THREE.MeshStandardMaterial(wall.materialParams)
    wall.material.map = textures[wall.name]
    //
    // //Adding google earth
    // geometry = new THREE.SphereGeometry(50, 40, 40)
    // let sphere = new THREE.Mesh(geometry)
    // sphere.materialParams = {}
    // sphere.name = 'earth'
    // sphere.position.set(200, 50, -50)
    // scene.add(sphere)
    // sphere.material = new THREE.MeshStandardMaterial(sphere.materialParams)
    // sphere.material.map = textures[sphere.name]

    // Adding light sources
    let ambientLight = new THREE.AmbientLight(0x333333) // black
    let directionalLight = new THREE.DirectionalLight(0x777777) // Gray
    let pointLight = new THREE.PointLight(0x999999) // Light gray

    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)

    camera.position.set(-200, 400, -200)

    function animate() {
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        cameraControls.update()
    }

    animate()
}

// Main
displayCity()
// displayTexturedScene()