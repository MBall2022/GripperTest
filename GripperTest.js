/*
This is a simulation of a Robot Gripper
December 2022


*/

  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: false,
    antialias: false
  });

renderer.shadowMap.enabled = true;

//Creating the Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 5000);

//Adding a Raycaster for interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let INTERSECTED;

var parts = [];

function onPointerMove( event ) {

  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera( pointer, camera );

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects( scene.children, false );

  if ( intersects.length > 0 ) {

  if ( INTERSECTED != intersects[ 0 ].object ) {

            if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

            INTERSECTED = intersects[ 0 ].object;
            if (INTERSECTED.id==cylinder.id){  //Checking if the object is the cylinder part specifically

            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex( 0xff0000 );
            }
          }

        } else {

          if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

          INTERSECTED = null;

        }

}


renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

let controls = {};
let player = {
  height: 60,
  turnSpeed: .05,
  speed: .5,
  jumpHeight: 1,
  gravity: .01,
  velocity: 0,
  
  playerJumps: false
};

let cylinderObject = {
  grabbed: false,
  speed: .5,
  gravity: .01,
  velocity: 0,
  objectFalls: true,
  height: 2,
  insideGripper: false
};

// Camera:Setup
//camera.position.set(-150, player.height, -150);

//camera.lookAt(new THREE.Vector3(0, player.height, 0));


var controls2 = new THREE.OrbitControls(camera, renderer.domElement);
  //controls.minPolarAngle =Math.PI;  
  controls2.maxPolarAngle =Math.PI/2-0.2;
  controls2.minPolarAngle =0;
  controls2.enableDamping = true;
  controls2.dampingFactor = 0.25;
  controls2.enableZoom = true;
  //controls.target.set(0,0,0);
  //controls.update();
    
    
    camera.position.z = 20;
    camera.position.y = 10;
    camera.position.x = 20;
    //camera.rotation.z=Math.PI;
    
    controls2.update();


// Controls:Listeners
document.addEventListener('keydown', ({ keyCode }) => { controls[keyCode] = true });
document.addEventListener('keyup', ({ keyCode }) => { controls[keyCode] = false });

document.addEventListener( 'pointermove', onPointerMove );

// ...
function control() {
  // Controls:Engine 
  if(controls[87]){ // w
    camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
    camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
  }
  if(controls[83]){ // s
    camera.position.x += Math.sin(camera.rotation.y) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
  }
  if(controls[65]){ // a
    camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * player.speed;
  }
  if(controls[68]){ // d
    camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * player.speed;
    camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * player.speed;
  }
  if(controls[37]){ // la
    camera.rotation.y -= player.turnSpeed;
  }
  if(controls[39]){ // ra
    camera.rotation.y += player.turnSpeed;
  }
  
   /*if(controls[38]){ // ua
    camera.rotation.x += Math.sin(camera.rotation.y) * player.turnSpeed;
    camera.rotation.z -= -Math.cos(camera.rotation.y) * player.turnSpeed;
  }
  if(controls[40]){ // da
    camera.rotation.x = Math.sin(camera.rotation.y) * player.turnSpeed;
    camera.rotation.z += -Math.cos(camera.rotation.y) * player.turnSpeed;
  }
  */
  if(controls[32]) { // space
    if(player.jumps) return false;
    player.jumps = true;
    player.velocity = -player.jumpHeight;
  }
}

function ixMovementUpdate() {
  player.velocity += player.gravity;
  camera.position.y -= player.velocity;
  
  if(camera.position.y < player.height) {
    camera.position.y = player.height;
    player.jumps = false;
  }
  
}



//Adding lights to the scene

const spotLight = new THREE.SpotLight( 0xffffff, 0.5);
spotLight.position.set( 80, 50, 20 );
spotLight.castShadow = true;
scene.add( spotLight );


const spotLight2 = new THREE.SpotLight( 0xffffff,0.5 );
spotLight2.position.set( -80, 50, -20 );
spotLight2.castShadow = true;
scene.add( spotLight2 );

{
    const color = 0xFFFFFF;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }
const light3 = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.2 );
light3.position.set( 0.5, 1, 0.75 );
scene.add( light3 );



//adding a floor
//Load the texture
var loader = new THREE.TextureLoader();
loader.setCrossOrigin("anonymous");
const texture = loader.load(
  './pics/tileFloor.jpeg');

  var Fmaterial = new THREE.MeshPhongMaterial({ color:0xFFFFFF, map: texture });
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set( 4, 4 );
  
  //Create a plane with texture as floor
  var Fgeometry = new THREE.PlaneBufferGeometry(500, 500);
  //var material = new THREE.MeshBasicMaterial({ map: texture });
  var plane = new THREE.Mesh(Fgeometry, Fmaterial);
  plane.rotation.x=-Math.PI/2;
  plane.position.y=-20;
  scene.add(plane);


//Adding the  Gripper Model
var Finger1=new THREE.Mesh(); //VARIABLE TO ACCESS INDIVIDUAL OBJECT OUT OF THE JSON OBJECT
var Finger2=new THREE.Mesh();
var Gripper=new THREE.Mesh();

var finger1OpenPos=null;
var finger2OpenPos=null;
  var gripperLoader = new THREE.ObjectLoader();

  gripperLoader.load("models/Gripper.json", function (gripper) {
    //table.position.set(-90, -73, 40);
    //table.scale.set(4, 3, 2);
    Gripper.add(gripper);
    scene.add(Gripper); // Adding the model to the scene

    ////
    //ACCESSING AN INDIVIDUAL OBJECT OUT OF THE JSON OBJECT///// IT WORKS
    Finger1 = gripper.getObjectByName( "Finger1", true );
    Finger2 = gripper.getObjectByName( "Finger2", true );
   
    finger1OpenPos=Finger1.position.z;
    finger2OpenPos=Finger2.position.z;

  });

//adding the Gripper Bounding Box for object detection
//create a bounding box (virtual) on the gripper
  const GripperBox = new THREE.Mesh(
  new THREE.BoxGeometry(2.8,4,2.8),
  new THREE.MeshBasicMaterial({color: 0xEE4B2B, wireframe: true})
);
  Gripper.add(GripperBox);
  GripperBox.position.y=GripperBox.position.y+3.5;
  var currentColor=GripperBox.material.color.getHex();

//adding the cylinder part
const partGeometry = new THREE.CylinderGeometry( 1, 1, cylinderObject.height, 32 );
const blueMaterial = new THREE.MeshPhongMaterial( { color: 0x002aff,  specular: 0xf5e490, wireframe: false, shininess:20} ); //Blue Material

const cylinder = new THREE.Mesh( partGeometry, blueMaterial );
cylinder.geometry.computeBoundingBox();
parts.push(cylinder); //adding the part to the parts array

scene.add( cylinder );
cylinder.position.y=cylinderObject.height/2+0.1;

//Render the scene
  renderer.render(scene, camera);
  document.body.appendChild(renderer.domElement);
      


/// Adding a yellow arrow showing the X Axis direction
/*
const dir = new THREE.Vector3( 1, 0, 0 );
//normalize the direction vector (convert to vector of length 1)
dir.normalize();
const origin = new THREE.Vector3( 0, 2, 0 );
const length = 1;
const hex = 0xffff00;
const arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
scene.add( arrowHelper );
*///



//Options to be added to the GUI
var options = {
  verticalPos: 0,

  open: function() {
 

    //opening the gripper
    Finger1.position.z=finger1OpenPos;
    Finger2.position.z=finger2OpenPos;
    Gripper.remove(cylinder);
    scene.add(cylinder);
    
    if (cylinderObject.grabbed) {
      cylinder.position.y=Gripper.position.y+4;
      cylinderObject.objectFalls=true;
      cylinderObject.grabbed=false;
      cylinderObject.insideGripper=false;
    }
    

  },
  close: function() {
    
    //check the collision before closing the gripper
    //detectCollisions();
    if (cylinderObject.insideGripper) {
        //closing the gripper on the cylinder part
      Finger1.position.z=finger1OpenPos+0.15;
      Finger2.position.z=finger2OpenPos-0.15;
      Gripper.add(cylinder);
      //cylinder.position.y=Finger1.position.y+5;
      cylinder.position.y=GripperBox.position.y
       cylinderObject.objectFalls=false;
      cylinderObject.grabbed=true;
      cylinderObject.velocity=0;
    }
    else {
      Finger1.position.z=finger1OpenPos+0.3;
      Finger2.position.z=finger2OpenPos-0.3;
    }

    //add a condition here for checking the position of the sphere for grabbing

   

    
  }
};

//Creating GUI
var gui = new dat.GUI();

var pendant = gui.addFolder('Gripper Controls');

pendant.add(options, 'verticalPos', -25, 0).name('Vertical Position').listen();

pendant.open();

gui.add(options, 'open');
gui.add(options, 'close');



function detectCollisions() {
  
  var homeBB = new THREE.Box3().setFromObject(GripperBox);

 // Run through each part and detect if there is the part is inside the gripper 
  for ( var index = 0; index < parts.length; index ++ ) { //checking for all the parts
   

    //console.log(GripperBox.position);
    var partBB = new THREE.Box3().setFromObject(parts[index]);
    cylinderObject.insideGripper = homeBB.containsBox(partBB); //Boolean variable
    //console.log(   cylinderObject.insideGripper ); //partIsHome will be true if the part is completely inside gripper.

    if (cylinderObject.insideGripper) { // if object is inside the gripper
        GripperBox.material.color.setHex(0xAAFF00); //box turns to Green when the part is inside the gripper
        
    }
    else {
      GripperBox.material.color.setHex(currentColor); //box turns to red
    }



}
}

//Creating Animations
function animate() {
  
  
    requestAnimationFrame( animate );

  

    var axis = new THREE.Vector3(0, 10, 0).normalize();
    var speed = 0.01;

  renderer.render( scene, camera );

    Gripper.position.y=options.verticalPos;

    if (cylinderObject.objectFalls){
      //add code for falling animation of the object
      
      if(cylinder.position.y > plane.position.y+cylinderObject.height/2) {
        cylinderObject.velocity += cylinderObject.gravity;
        cylinder.position.y -= cylinderObject.velocity; //moving downward
        //stops when reaching the floor
      
        }
        else {
         cylinderObject.objectFalls=false; 
         cylinder.position.y = plane.position.y+cylinderObject.height/2
        }

    }
    detectCollisions() ;




};


 animate();
