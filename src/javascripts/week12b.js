import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';

var keyboard = {};

export function displayPokemon(){
  let canvas = document.querySelector('#webgl-scene')
  let scene = new THREE.Scene()
  let renderer = new THREE.WebGLRenderer({canvas})
  let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

  renderer.setSize(canvas.clientWidth, canvas.clientHeight)

  let axes = new THREE.AxesHelper(10)
  scene.add(axes)

  let cameraControls = new OrbitControls(camera, renderer.domElement)
  cameraControls.addEventListener("change", function(){
    renderer.render(scene, camera)
  })

  let mtl_file = './models/charizar.mtl';
  let obj_file = './models/charizar.obj';

  // // Model created from scratch
  // let mtl_file = './models/pokemon/charizar.mtl';
  // let obj_file = './models/pokemon/charizar.obj';

  var mtlLoader = new MTLLoader();
  mtlLoader.load(mtl_file,
      function(materials){

        materials.preload()

        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials)
        objLoader.load(
            obj_file,
            function (object){
              object.name = 'charizard'
              scene.add(object);
            });
      });

  let ambientLight = new THREE.AmbientLight(0x333333)
  let directionalLight = new THREE.DirectionalLight(0x777777)
  let pointLight = new THREE.PointLight(0x999999)

  scene.add(ambientLight)
  scene.add(directionalLight)
  scene.add(pointLight)
  pointLight.position.set(0, 200, 0)
  camera.position.set(-5, 5, 7)

  function animate() {
    const object = scene.getObjectByName('charizard')

    // How to find key codes: https://keyjs.dev/
    if(keyboard[87]){ // W key
      object.position.y += 0.001
    }
    if(keyboard[83]){ // S key
      object.position.y -= 0.001
    }
    if(keyboard[65]){ // A key
      object.rotation.y += 0.001
    }
    if(keyboard[68]){ // D key
      object.rotation.y -= 0.001
    }

    renderer.shadowMap.enabled = true

    camera.lookAt(scene.position)
    renderer.render(scene, camera)
    cameraControls.update()

    requestAnimationFrame(animate)
  }
  animate()
}

function keyDown(event){
  keyboard[event.keyCode] = true;
}

function keyUp(event){
  keyboard[event.keyCode] = false;
}

window.addEventListener('keydown', keyDown);
window.addEventListener('keyup', keyUp);

// Main
displayPokemon()