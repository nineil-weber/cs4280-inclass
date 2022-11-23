import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {OBJLoader} from 'three/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'three/examples/jsm/loaders/MTLLoader.js';

var keyboard = {};


export function displayWork(){
    let canvas = document.querySelector('#webgl-scene')
    let scene = new THREE.Scene()
    let renderer = new THREE.WebGLRenderer({canvas})
    let camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, .1, 1000)

    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    let cameraControls = new OrbitControls(camera, renderer.domElement)
    cameraControls.addEventListener("change", function(){
        renderer.render(scene, camera)
    })

    let object_url = './models/pokemon/charizar.obj'
    let material_url = './models/pokemon/charizar.mtl'

    var mtlLoader = new MTLLoader();
    mtlLoader.load(material_url,
        function(materials){
            materials.preload()

            var objLoader = new OBJLoader();
            objLoader.setMaterials(materials)
            objLoader.load(
                object_url,
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

    function checkBottom(val, rad)
    { // attibutes: value and radius
        if(val+4 <= rad)
            return true;
        return false;
    }

    function checkCollision(r = 0.5, x, y) // x and y denote cube centroids array
    {
        let flag = false;
        for (var i = 0;i <x.length;i++)
        {
            for (var j = i+1;j <x.length;j++)
            {
                let d = Math.hypot(x[i] - x[j], y[i] - y[j]); //euclidean distance
                if (d <= 3*r) // space between cubes
                    flag =true
            }
        }
        return flag
    }


    function generateRandomIntegerInRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    let cnt = 0
    let box_size = 0.5

    let u = [] // array to store random generated asteroids
    let q_ast= [] // this array will help us to simulate a queue

    let box_obj = []

    // Flags
    let move_on = false
    let computed_bounding_boxes =false

    function intersectsBoxes( box_ast, minx, miny, minz, maxx, maxy, maxz ) {
        // https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection
        return maxx >= box_ast.min.x && minx <= box_ast.max.x &&
        maxy >= box_ast.min.y && miny <= box_ast.max.y &&
        maxz >= box_ast.min.z && minz<= box_ast.max.z ? true : false;
    }

    function animate(time=0) {
        cnt+=1;
        if(cnt % 200 ==0 || q_ast.isEmpty <1)
        {
            let  ast = generateRandomIntegerInRange(1, 5); // max, 5 asteroids per row
            let x = []
            let y_i = []

            // create a valid asteroids setup [1 row]
            do
            {
                for (var i = 0;i <ast;i++)
                    u[i] =  Math.random() // used to generate random asteroids

                for (var i = 0;i <ast;i++)
                    x[i] = u[i]*8.0 - 4.0 // range -4 to 4

                for (var i = 0;i <ast;i++)
                    y_i[i] = 4;

            }while( checkCollision(box_size, x, y_i) ); //verifying collisions between asteroids

            for (var i = 0;i <ast;i++)
            {
                //creating boxes
                let geometry = new THREE.BoxGeometry(box_size, box_size, box_size)
                let cube = new THREE.Mesh( geometry );
                cube.materialParams = {}
                cube.position.set(x[i], y_i[i], 0)
                scene.add(cube)

                cube.material = new THREE.MeshStandardMaterial(cube.materialParams)
                cube.material.color = new THREE.Color("rgb(135, 206, 235)")
                q_ast.push(cube)
            }
        }

        let sz = q_ast.length
        let y = [] // its size is the number of cubes
        for (var i = 0; i <sz; i++)
        {
            q_ast[i].position.y -= 0.01 // Update cube position
            y[i] = q_ast[i].position.y //  get y position of all asteroids
        }

        for (var i = 0; i <sz; i++)
        {
            if( checkBottom(y[i],box_size/2.0) )
            {
                scene.remove(q_ast.shift()) // remove first element - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift
            }
        }

        const object = scene.getObjectByName('charizard')
        if(keyboard[87]){ // W key
            object.position.y += 0.1
            move_on = true
        }
        if(keyboard[83]){ // S key
            object.position.y -= 0.1
            move_on =true
        }
        if(keyboard[65]){ // A key
            object.position.x -= 0.1
            move_on =true
        }
        if(keyboard[68]){ // D key
            object.position.x += 0.1
            move_on = true
        }

        // just enter one time to calculate our charizard bounding boxes positions
        if(move_on == true && computed_bounding_boxes ==false)
        {
            let idx = 0

            for (var i = 0;i <object.children.length;i++)
            {
                //initial bounding boxes of our object, without any move
                object.children[i].geometry.computeBoundingBox()
                box_obj[idx] = object.children[i].geometry.boundingBox

                idx++
            }
            computed_bounding_boxes = true
        }

        //collision detection between object and cubes
        if(object!=undefined)
        {
            for (var i = 0;i <q_ast.length;i++)
            {
                const boundingBox = new THREE.Box3().setFromObject(q_ast[i]) //bounding box of our cubes

                //check collision
                for (var j = 0;j <box_obj.length;j++)
                {
                    let box=box_obj[j]
                    if(intersectsBoxes(boundingBox, box.min.x+object.position.x ,box.min.y + object.position.y ,box.min.z ,box.max.x + object.position.x  ,box.max.y + object.position.y  ,box.max.z  ))
                    {
                        alert('GAME OVER')
                        return
                    }
                }
            }

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

function sum_loop(arr)
{
    let sum = 0;
    for (const val of arr) {
        sum = sum + val;
    }
    return sum;
}

function sum(arr)
{
    const reducer = (sum, val) => sum + val;
    const initialValue = 0;
    return arr.reduce(reducer, initialValue);
}

function sum_even(arr)
{
    // const reducer = (sum, val) =>  (val % 2 == 0) ? (sum + val) : sum; // https://www.codingem.com/javascript-if-else-on-one-line/
    const reducer = (sum, val) =>
    {
        if (val % 2 == 0)
            return (sum + val)
        else
            return sum;
    }
    const initialValue = 0;
    return arr.reduce(reducer, initialValue);
}

function test_reducer()
{
    // sum_loop
    let sl = sum_loop([1, 3, 4, 2]);
    console.log('sum_loop: ' + sl);

    // sum
    let s = sum([1, 3, 4, 2]);
    console.log('sum: ' + s);

    // sum_even
    let se = sum_even([1, 3, 4, 2]);
    console.log('sum_even: ' + se);
}

//main
displayWork()
// test_reducer()

// [Relevant links]
// https://dev.to/ritza/building-a-3d-obstacle-avoiding-game-with-threejs-19da
// https://developer.mozilla.org/en-US/docs/Games/Techniques/3D_collision_detection