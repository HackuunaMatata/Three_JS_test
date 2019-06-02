import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbitcontrols';
OBJLoader(THREE);

const container = document.getElementById( 'container' );
const container2 = document.getElementById('inset');

const scene = new THREE.Scene();
const scene2 = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth/window.innerHeight, 0.01, 2000);
camera.position.z = 100;

const camera2 = new THREE.PerspectiveCamera(
  45, 200 / 200, 0.01, 2000 );
camera2.up = camera.up;

// {antialias: true} for beautiful displaying
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

const renderer2 = new THREE.WebGLRenderer({antialias: true});
renderer2.setClearColor( 0xf0f0f0, 1 );
renderer2.setSize( 200, 200 );
container2.appendChild( renderer2.domElement );

const loadingManager = new THREE.LoadingManager();
const objLoader = new THREE.OBJLoader(loadingManager);

const ambient = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambient);

const directionLight = new THREE.DirectionalLight(0xffffff);
directionLight.position.set(0, 100, 100);
scene.add(directionLight);

const axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

const axes2 = new THREE.AxisHelper( 100 );
scene2.add( axes2 );

/*
// const localPlane = new THREE.Plane( new THREE.Vector3( 1, 0.4, 0.7 ), 5  ).negate();
const localPlane = new THREE.Plane( new THREE.Vector3( 1, 0.4, 0.7 ), 5 );
// renderer.clippingPlanes = [ localPlane ];
// renderer.localClippingEnabled = true;


var geometry = new THREE.PlaneGeometry( 70, 70 );
geometry.lookAt(new THREE.Vector3( 1, 0.4, 0.7 ));
var material = new THREE.MeshBasicMaterial( {
  color: 0xffff00,
  side: THREE.DoubleSide,
  // opacity: 0.3,
  transparent: true,
} );
var plane = new THREE.Mesh( geometry, material );
scene.add( plane );
plane.position.x = -5;
plane.position.y = -2;
plane.position.z = -3.5;
*/


function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  renderer2.render( scene2, camera2 );
}

render();

// renderer.domElement for enabling editing inputs
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  camera2.position.copy( camera.position );
  camera2.position.sub( controls.target );
  camera2.position.setLength( 300 );
  camera2.lookAt( scene2.position );

  render();
}

animate();


// working with form

let fileURL;
let fileObj;
const inputElement = document.getElementById('file');
inputElement.addEventListener('change', handleFiles, false);
function handleFiles() {
  fileObj = this.files[0];
  fileURL = window.URL.createObjectURL(fileObj);
}

let prevObjName;
const settingsForm = document.getElementById('settings-form');
settingsForm.addEventListener('submit', applySettings);

let scale;
let positionX;
let positionY;
let positionZ;
let rotationX;
let rotationY;
let rotationZ;

function applySettings(e) {
  e.preventDefault();

  scale = +this.elements['scale'].value || 1;

  positionX = this.elements['positionX'].value || 0;
  positionY = this.elements['positionY'].value || 0;
  positionZ = this.elements['positionZ'].value || 0;

  rotationX = this.elements['rotationX'].value || 0;
  rotationY = this.elements['rotationY'].value || 0;
  rotationZ = this.elements['rotationZ'].value || 0;

  fileURL && objLoader.load(fileURL, (object) => {

    // need to clean up previous object
    prevObjName && scene.remove(scene.getObjectByName(prevObjName));
    object.name = 'model';
    prevObjName = object.name;

    object.scale.x = scale;
    object.scale.y = scale;
    object.scale.z = scale;

    object.position.x = positionX;
    object.position.y = positionY;
    object.position.z = positionZ;

    object.rotation.x = rotationX * Math.PI;
    object.rotation.y = rotationY * Math.PI;
    object.rotation.z = rotationZ * Math.PI;

    scene.add(object);
    render();
  });
}


// planes

let chosen;

function selected() {
  chosen = this.value;
  const paramsForNormalAndConst = document.getElementById('paramsForNormalAndConst');
  const paramsForCoordinates = document.getElementById('paramsForCoordinates');
  const paramsForEquation = document.getElementById('paramsForEquation');

  if (chosen === 'Normal and constant') {
    paramsForNormalAndConst.style.display = 'block';
    paramsForCoordinates.style.display = 'none';
    paramsForEquation.style.display = 'none';
    return;
  }

  if (chosen === 'Coordinates') {
    paramsForNormalAndConst.style.display = 'none';
    paramsForCoordinates.style.display = 'block';
    paramsForEquation.style.display = 'none';
    return;
  }

  if (chosen === 'Equation') {
    paramsForNormalAndConst.style.display = 'none';
    paramsForCoordinates.style.display = 'none';
    paramsForEquation.style.display = 'block';
    return;
  }
}

const radios = document.getElementsByName("plane");
radios.forEach(elem => elem.addEventListener('change', selected));

const planeForm = document.getElementById('plane-form');
planeForm.addEventListener('submit', applyPlaneSettings);

function applyPlaneSettings(e) {
  e.preventDefault();

  let localPlane;
  let constant;
  let normalX;
  let normalY;
  let normalZ;
  
  scene.getObjectByName('plane') && scene.remove(scene.getObjectByName('plane'));
  let geometry = new THREE.PlaneGeometry( 70, 70 );
  let material = new THREE.MeshBasicMaterial( {
    color: 0xffff00,
    side: THREE.DoubleSide,
    // opacity: 0.3,
    transparent: true,
  } );
  let plane = new THREE.Mesh( geometry, material );
  plane.name = 'plane';
  scene.add( plane );

  if (chosen === 'Normal and constant') {
    constant = this.elements['constant'].value;
    normalX = this.elements['normalX'].value;
    normalY = this.elements['normalY'].value;
    normalZ = this.elements['normalZ'].value;
  }

  if (chosen === 'Coordinates') {
    let x1 = this.elements['x'].value;
    let y2 = this.elements['y'].value;
    let z3 = this.elements['z'].value;

    let a = y2 * z3;
    let b = x1 * z3;
    let c = y2 * x1;
    let d = -x1 * y2 * z3;

    let divider = Math.sqrt(a * a + b * b + c * c);

    normalX = a / divider;
    normalY = b / divider;
    normalZ = c / divider;
    constant = d / divider;
  }

  localPlane = new THREE.Plane( new THREE.Vector3( normalX, normalY, normalZ ), constant );
  // renderer.clippingPlanes = [ localPlane ];
  // renderer.localClippingEnabled = true;

  geometry.lookAt(new THREE.Vector3( normalX, normalY, normalZ ));

  plane.position.x = -(normalX * constant);
  plane.position.y = -(normalY * constant);
  plane.position.z = -(normalZ * constant);
}
