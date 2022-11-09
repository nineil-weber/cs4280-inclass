import * as THREE from 'three'
window.THREE = THREE
require('./physi')
Physijs.scripts.worker = '/models/physijs_worker.js'
Physijs.scripts.ammo = '/models/ammo.js'

function get_points()
{
  let points = []
  let r=27, cx=0, cz=0
  let circle_offset = 0

  for(let i=0; i<1000; i+=6+circle_offset)
  {
    // https://xaktly.com/MathPolarCoordinates.html
    circle_offset = 4.5 * (i/360)
    let y = 0
    let x = (r/1400) * (1400 -i) * Math.cos(i * Math.PI / 180) + cx
    let z = (r/1400) * (1400 -i) * Math.sin(i * Math.PI / 180) + cz

    points.push(new THREE.Vector3(x, y, z))
  }

  return points
}

function getBoard(){
  console.log('getBoard - start')
  let material = new Physijs.createMaterial(
      new THREE.MeshPhongMaterial({
        map: new THREE.TextureLoader().load('./images/floor.jpg')
      }), .9, .1)

  let floor = new Physijs.BoxMesh(new THREE.BoxGeometry(60, 1, 60), material, 0)
  let left = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), material, 0)
  left.position.x = -31
  left.position.y = 2
  floor.add(left)

  let right = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 3, 60), material, 0)
  right.position.x = 31
  right.position.y = 2
  floor.add(right)

  let top = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), material, 0)
  top.position.z = -30
  top.position.y = 2
  floor.add(top)

  let bottom = new Physijs.BoxMesh(new THREE.BoxGeometry(64, 3, 2), material, 0)
  bottom.position.z = 30
  bottom.position.y = 2
  floor.add(bottom)

  console.log('getBoard - end')

  return floor
}

export function displayScene(){
  console.log('displayScene - start')
  let canvas = document.querySelector('#webgl-scene')
  let scene = new Physijs.Scene()
  scene.setGravity(new THREE.Vector3(0, -50, 0))

  let renderer = new THREE.WebGLRenderer({canvas})
  let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)
  camera.position.set(50, 30, 50)
  camera.lookAt(scene.position)

  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setClearColor(0x000000)

  let spotLight = new THREE.SpotLight(0xFFFFFF)
  spotLight.position.set(20, 100, 50)
  scene.add(spotLight)

  let board = getBoard()
  scene.add(board)

  let ball = new Physijs.BoxMesh(new THREE.SphereGeometry(4, 40, 40),
      Physijs.createMaterial(new THREE.MeshStandardMaterial()), 0.1, 0.9) // friction = 0.1, restitution = 0.9
  scene.add( ball )

  let points = get_points()
  let pieces = []
  let c = new THREE.Color(0xFFFFFF)

  for(let p of points)
  {
    let geometry = new THREE.BoxGeometry(.6, 6, 2)
    c.setHex(Math.random() * 0xFFFFFF)

    let piece = new Physijs.BoxMesh(geometry, Physijs.createMaterial(new THREE.MeshPhongMaterial({color: c.getHex()})))
    piece.position.copy(p)
    piece.lookAt(scene.position)
    piece.__dirtyRotation = true // Rotate animation
    // piece.position.y = 3.5 // To stay quite, no move
    scene.add(piece)
    pieces.push(piece)
  }

  let rayCaster = new THREE.Raycaster()
  let pointerAt = new THREE.Vector2()
  canvas.addEventListener('pointerup', e => {
    let rect = e.target.getBoundingClientRect()

    // x = (2u - w) /w
    pointerAt.x = (2 * (e.clientX - rect.left) - rect.width) / rect.width
    // y = (h - 2v) / h
    pointerAt.y = (rect.height - 2 * (e.clientY - rect.top)) / rect.height

    rayCaster.setFromCamera(pointerAt, camera)
    let intersects = rayCaster.intersectObjects(scene.children)
    for (let intersect of intersects) {
      let obj = intersect.object

      if (obj != board) {
        obj.rotation.x += 2
        obj.__dirtyRotation = true
      }

      if (obj == ball) {
        obj.position.y -= -30
        obj.position.x += Math.random() * 5
        obj.position.x += Math.random() * 7
        obj.__dirtyPosition = true
      }

      break
    }
  })

  function animate(){
    scene.simulate()

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }

  animate()
  console.log('displayScene - end')
}

// Main
displayScene()