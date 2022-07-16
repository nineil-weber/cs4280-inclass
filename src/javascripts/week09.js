import * as THREE from 'three'
import * as dat from 'dat.gui'
import { data256 } from './honolulu'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

function sombrero(R, C) {
  let data = []
  let x0 = -2, z0 = -2, dx = 4 / R, dz = 4 / C
  for(let i = 0 ;i < R; i++){
    let x = x0 + dx * i
    for(let j = 0; j < C; j++){
      let z = z0 + dz * j
      let r =  Math.sqrt(x * x + z * z)
      let y = Math.sign(Math.PI * r) / (Math.PI * r) * 300

      data.push(y)
    }
  }

  return data
}
function loadMeshGeometry(geometry, data, R, C, yscale=.1){
  let x0 = 0, y0=0, z0=0
  let dx = 2, dz=2

  // Vertices
  for(let i = 0; i < R; i++){
    for(let j = 0; j < C; j++){
      geometry.vertices.push(new THREE.Vector3(
        x0 + i * dx,
        y0 + data[i * R + j] * yscale,
        z0 + j * dz
      ))
    }
  }

  // Faces
  for(let i = 0; i < R-1; i++){
    for(let j = 0; j < C-1; j++){
      geometry.faces.push(new THREE.Face3(
        i * R + j,
        i * R + j + 1,
        (i + 1) * R + j + 1
      ))

      geometry.faces.push(new THREE.Face3(
        i * R + j,
        (i + 1) * R + j + 1,
        (i + 1) * R + j
      ))
    }
  }

}

export function displayMeshes(){
  let canvas = document.querySelector('#webgl-scene')
  let scene = new THREE.Scene()
  let renderer = new THREE.WebGLRenderer({canvas})
  let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0xEEEEEE)

  let axes = new THREE.AxesHelper(10)
  scene.add(axes)

  // Adding the mesh
  let geometry = new THREE.Geometry()

  //loadMeshGeometry(geometry, data256, 256, 256)
  loadMeshGeometry(geometry, sombrero(64, 64), 64, 64, .1)

  geometry.computeFaceNormals()
  let material = new THREE.MeshNormalMaterial()
  let mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  let cameraControls = new OrbitControls(camera, renderer.domElement)
  cameraControls.addEventListener("change", function(){
    renderer.render(scene, camera)
  })

  let controls = {
    radius: 400,
    theta: 1,
    phi: 1
  }

  function animate() {
    camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
    camera.position.y = controls.radius * Math.cos(controls.theta)
    camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)

    camera.lookAt(scene.position)
    renderer.render(scene, camera)
    cameraControls.update()
  }

  animate()

  let gui = new dat.GUI()
  document.querySelector('aside').appendChild(gui.domElement)
  gui.add(controls, 'radius').min(2).max(900).onChange(animate)
  gui.add(controls, 'theta').min(-1 * Math.PI).max(Math.PI).onChange(animate)
  gui.add(controls, 'phi').min(-1 * Math.PI).max(Math.PI).onChange(animate)
}


export function displayLightedScene(){
  let canvas = document.querySelector('#webgl-scene')
  let scene = new THREE.Scene()
  let renderer = new THREE.WebGLRenderer({canvas})
  let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0xEEEEEE)

  let axes = new THREE.AxesHelper(10)
  scene.add(axes)

  let cameraControls = new OrbitControls(camera, renderer.domElement)
  cameraControls.addEventListener("change", function(){
    renderer.render(scene, camera)
  })

  let controls = {
    radius: 400,
    theta: 1,
    phi: 1,
    ambient: false,
    directional: false,
    point: false,
    spotlight: false,
    material: 'basic',
    intensity: 1,
    spotlight_target: "Cube"
  }

  // Add a plane
  let geometry = new THREE.PlaneGeometry(500, 300)
  let plane = new THREE.Mesh(geometry)
  plane.materialParams = { color: 0x777777, side: THREE.DoubleSide}
  plane.rotateX(Math.PI / 2)
  scene.add(plane)

  // Add a cube
  geometry = new THREE.BoxGeometry(40, 40, 40)
  let cube = new THREE.Mesh(geometry)
  cube.materialParams = { color: 0x00FF00 }
  cube.position.set(100, 50, 50)
  scene.add(cube)

  // more objects to come






  // Add light sources
  let ambientLight = new THREE.AmbientLight(0x3333FF)
  let directionalLight = new THREE.DirectionalLight(0x777777)
  let pointLight = new THREE.PointLight(0x888888)
  pointLight.position.set(0, 100, 0)
  let spotLight = new THREE.SpotLight(0x999999)
  spotLight.position.set(100, 150, 100)


  function animate(){
    if(controls.material === "Lambert"){
      for(let obj of scene.children){
        if(obj.materialParams !== undefined){
          obj.material = new THREE.MeshLambertMaterial(obj.materialParams)
        }
      }
    }else if(controls.material === "Phong"){
      for(let obj of scene.children){
        if(obj.materialParams !== undefined){
          obj.material = new THREE.MeshPhongMaterial(obj.materialParams)
        }
      }
    }else{
      for(let obj of scene.children){
        if(obj.materialParams !== undefined){
          obj.material = new THREE.MeshBasicMaterial(obj.materialParams)
        }
      }
    }

    if(controls.ambient){
      ambientLight.intensity = controls.intensity
      scene.add(ambientLight)
    }else{
      scene.remove(ambientLight)
    }

    if(controls.directional){
      directionalLight.intensity = controls.intensity
      scene.add(directionalLight)
    }else{
      scene.remove(directionalLight)
    }

    if(controls.point){
      pointLight.intensity = controls.intensity
      scene.add(pointLight)
    }else{
      scene.remove(pointLight)
    }

    if(controls.spotlight){
      spotLight.intensity = controls.intensity
      spotLight.target = cube
      scene.add(spotLight)
    }else{
      scene.remove(spotLight)
    }

    camera.position.x = controls.radius * Math.sin(controls.theta) * Math.cos(controls.phi)
    camera.position.y = controls.radius * Math.cos(controls.theta)
    camera.position.z = controls.radius * Math.sin(controls.theta) * Math.sin(controls.phi)

    camera.lookAt(scene.position)
    renderer.render(scene, camera)
    cameraControls.update()
  }

  animate()

  let gui = new dat.GUI()
  document.querySelector('aside').appendChild(gui.domElement)

  let f = gui.addFolder("Camera")
  f.add(controls, 'radius').min(50).max(900).onChange(animate)
  f.add(controls, 'theta').min(-1 * Math.PI).max(Math.PI).onChange(animate)
  f.add(controls, 'phi').min(-1 * Math.PI).max(Math.PI).onChange(animate)
  f.open()

  f = gui.addFolder("Material")
  f.add(controls, 'material', ["Basic", "Lambert", "Phong"]).onChange(animate)
  f.open()

  f = gui.addFolder("Light Sources")
  f.add(controls, 'ambient').onChange(animate)
  f.add(controls, 'directional').onChange(animate)
  f.add(controls, 'point').onChange(animate)
  f.add(controls, 'spotlight').onChange(animate)
  f.add(controls, 'intensity').min(0).max(10).onChange(animate)

  f.open()

}



