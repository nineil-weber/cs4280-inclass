import * as THREE from 'three'
import v_shader from '../shaders/v_shader_water.glsl'
import f_shader from '../shaders/f_shader_water.glsl'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import { sinusoidal, checkerboard, somePattern} from './textures'
import { MTLLoader, OBJLoader} from 'three-obj-mtl-loader'
import { Water } from 'three/examples/jsm/objects/Water2'
import { TextureLoader } from 'three'

export function displayOcean() {
  let canvas = document.querySelector('#webgl-scene')
  let scene = new THREE.Scene()
  let renderer = new THREE.WebGLRenderer({canvas})
  let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x000000)

  let axes = new THREE.AxesHelper(10)
  scene.add(axes)

  let clock = new THREE.Clock()

  let uniforms = {
    iGlobalTime : {
      type: 'f',
      value: 0.1
    },
    iResolution: {
      type: 'v2',
      value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight)
    }
  }

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
    uniforms.iGlobalTime.value += clock.getDelta()
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
  let ambientLight = new THREE.AmbientLight(0x333333)
  let directionalLight = new THREE.DirectionalLight(0x777777)
  directionalLight.castShadow = true
  let pointLight = new THREE.PointLight(0x999999)
  pointLight.position.set(0, 200, 0)
  pointLight.castShadow = true
  let spotLight = new THREE.SpotLight(0x999999)
  spotLight.position.set(0, 200, 0)
  spotLight.target = sphere
  
  

  scene.add(ambientLight)
  scene.add(directionalLight)
  scene.add(pointLight)
  scene.add(spotLight)

  let controls = {

  }

  let rayCaster = new THREE.Raycaster()
  let pointerAt = new THREE.Vector2()
  canvas.addEventListener('pointerup', e => {
    let rect = e.target.getBoundingClientRect()

    // x = (2u - w) /w
    pointerAt.x = (2 * (e.clientX - rect.left) - rect.width) / rect.width
    // y = (h - 2v) / h
    pointerAt.y = (rect.height - 2 * (e.clientY - rect.top)) /rect.height

    rayCaster.setFromCamera(pointerAt, camera)
    let intersects = rayCaster.intersectObjects([wall, plane, crate, cube, sphere])
    for(let intersect of intersects){
      let obj = intersect.object
      // obj.material = new THREE.MeshBasicMaterial({color: 0xFF00FF})
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

  // let gui = new dat.GUI()
  // document.querySelector('aside').appendChild(gui.domElement)
  // gui.add(controls, 'radius').min(2).max(900).onChange(animate)
  // gui.add(controls, 'theta').min(-1 * Math.PI).max(Math.PI).onChange(animate)
  // gui.add(controls, 'phi').min(-1 * Math.PI).max(Math.PI).onChange(animate)
}