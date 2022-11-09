import * as THREE from 'three'
import * as dat from 'dat.gui'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { sinusoidal, checkerboard, somePattern} from './textures'
import { MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import { Water } from 'three/examples/jsm/objects/Water2'
import { TextureLoader } from 'three'

export function displayCubes(){
    // In WEBGL 1
    let v_shader = `
    varying vec3 vecNormal;
    void main(){
      vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
      vecNormal = (modelViewMatrix * vec4(normal, 0.0)).xyz;
      gl_Position = projectionMatrix * modelViewPosition;
    }
  `

    let f_shader = `
    uniform vec3 color;
    varying vec3 vecNormal;
    void main(){
      gl_FragColor = vec4(color * vecNormal, .8);
    }
  `
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0x000000)

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    // Objects
    let uniforms = {}
    let cubes = []

    let cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshLambertMaterial())
    cube1.position.x = -2
    cubes.push(cube1)
    scene.add(cube1)

    uniforms.color = {type: 'vec3', value: new THREE.Color(0x00FF00)} // green
    let material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: v_shader,
        fragmentShader: f_shader
    })

    let cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
    cube2.position.x = 2
    cubes.push(cube2)
    scene.add(cube2)


    // Adding light sources
    let ambientLight = new THREE.AmbientLight(0x333333) // Black
    let directionalLight = new THREE.DirectionalLight(0x777777) // Gray
    let pointLight = new THREE.PointLight(0x999999) // Light gray
    pointLight.position.set(0, 6, 0)


    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)

    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })

    camera.position.set(-4, 8, -4)

    function animate() {
        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        cameraControls.update()

        // cubes[0].rotation.y += 0.02
        // cubes[1].rotation.y += 0.02
        // cubes[1].rotation.x += 0.01
        for(let c of cubes){
            c.rotation.y += .02
            c.rotation.x += .01
        }
        requestAnimationFrame(animate)
    }

    animate()
}

export function displaySolar(){
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0x000000)

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    let texLoader = new THREE.TextureLoader()
    let textures = {
        'sun': texLoader.load('./images/sun.jpg', function(){
            renderer.render(scene, camera)
        }),
        'earth': texLoader.load('./images/earth.jpg', function(){
            renderer.render(scene, camera)
        }),
        'moon': texLoader.load('./images/moon.jpg', function(){
            renderer.render(scene, camera)
        })
    }

    // Objects
    let sun = new THREE.Mesh(new THREE.SphereBufferGeometry(50, 40, 40), new THREE.MeshStandardMaterial())
    sun.name = 'sun'
    sun.material.map = textures[sun.name]

    let earth = new THREE.Mesh(new THREE.SphereBufferGeometry(25, 40, 40), new THREE.MeshStandardMaterial())
    earth.name = 'earth'
    earth.material.map = textures[earth.name]
    earth.position.set(150, 0, 0)
    sun.add(earth)

    let moon = new THREE.Mesh(new THREE.SphereBufferGeometry(10, 40, 40), new THREE.MeshStandardMaterial())
    moon.name = 'moon'
    moon.material.map = textures[moon.name]
    moon.position.set(40, 0, 0)
    earth.add(moon)

    scene.add(sun)

    // Adding light sources
    let ambientLight = new THREE.AmbientLight(0x333333)
    let directionalLight = new THREE.DirectionalLight(0x777777)
    let pointLight = new THREE.PointLight(0x999999)
    pointLight.position.set(0, 300, 0)


    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)

    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })

    camera.position.set(-200, 400, -200)

    function animate() {
        sun.rotation.y += .01 // sun contains sun and earth.
        earth.rotation.y += .02 // earth contains earth and moon.

        camera.lookAt(scene.position)
        renderer.render(scene, camera)
        cameraControls.update()

        requestAnimationFrame(animate)
    }

    animate()
}

export function displayCity(){
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setClearColor(0xEEEEEE) // light gray

    let axes = new THREE.AxesHelper(10)
    scene.add(axes)

    // Loading models
    let mtlLoader = new MTLLoader()
    let objLoader = new OBJLoader()
    mtlLoader.load("./models/city.mtl", function(material){
        material.preload()
        objLoader.setMaterials(material)
        objLoader.load("./models/city.obj", function(city){
            for(let o of city.children){
                let c = new THREE.Color(0xFFFFFF) // White color
                c.setHex(Math.random() * 0xFFFFFF) // White color
                o.material = new THREE.MeshStandardMaterial({color: c})
                scene.add(o)
            }

            scene.add(city)

            renderer.render(scene, camera)
        })
    })

    camera.position.set(-200, 400, -200)
    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })


    // Keyboard interactions
    window.onkeyup = function(e){
        let t = cameraControls.target
        switch(e.keyCode){
            case 40: // down
                console.log('down')
                break;
            case 38: //up
                console.log('up')
                // t.position.set(t.x - 5, t.y, t.z)
                break;
            case 39: // right
                console.log('right')
                t.set(t.x - 5, t.y, t.z)
                break;
            case 37: // left
                console.log('left')
                t.set(t.x + 5, t.y, t.z)
                break;
        }
    }


    // Adding light sources
    let ambientLight = new THREE.AmbientLight(0x333333)
    let directionalLight = new THREE.DirectionalLight(0x777777)
    let pointLight = new THREE.PointLight(0x999999)
    pointLight.position.set(0, 300, 0)


    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)

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
    renderer.setClearColor(0xEEEEEE) // light gray

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
    cube.name = 'somePattern' // sinusoidal | checkerboard | somePattern
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
    let ambientLight = new THREE.AmbientLight(0x333333) // Black
    let directionalLight = new THREE.DirectionalLight(0x777777) // light black
    directionalLight.castShadow = true
    let pointLight = new THREE.PointLight(0x999999) // Gray
    pointLight.position.set(0, 200, 0)
    pointLight.castShadow = true
    let spotLight = new THREE.SpotLight(0x999999) // Gray
    spotLight.position.set(0, 200, 0)
    spotLight.target = sphere

    scene.add(ambientLight)
    scene.add(directionalLight)
    scene.add(pointLight)
    scene.add(spotLight)

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

// Main
// displaySolar()
displayCubes() // Create material with shaders
// displayCity() // Adding interactive keys
// displayTexturedScene() // Water texture to Grass