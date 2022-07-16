import * as THREE from 'three'
window.THREE = THREE
require('./physi')
Physijs.scripts.worker = '/models/physijs_worker.js'
Physijs.scripts.ammo = '/models/ammo.js'

function getBoard(){
  let material = new Physijs.createMaterial(
    new THREE.MeshPhongMaterial({
      map: new THREE.TextureLoader().load('./images/floor.jpg')
    }), .9, .1)

  let floor = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 60), material, 0)
  let left = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), material, 0)
  left.position.x = -31
  left.position.y = 2
  floor.add(left)


  return floor
}

export function displayScene(){
  let canvas = document.querySelector('#webgl-scene')
  let scene = new Physijs.Scene()
  scene.setGravity(new THREE.Vector3(0, -50, 0))

  let renderer = new THREE.WebGLRenderer({canvas})
  let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x000000)

  let spotLight = new THREE.SpotLight(0xFFFFFF)
  spotLight.position.set(20, 100, 50)
  scene.add(spotLight)

  let board = getBoard()
  scene.add(board)

  function animate(){
    scene.simulate()

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  animate()
}
