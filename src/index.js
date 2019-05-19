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

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild( renderer.domElement );

const renderer2 = new THREE.WebGLRenderer();
renderer2.setClearColor( 0xf0f0f0, 1 );
renderer2.setSize( 200, 200 );
container2.appendChild( renderer2.domElement );

const loadingManager = new THREE.LoadingManager();
const objLoader = new THREE.OBJLoader(loadingManager);
objLoader.load('src/Tree.obj', (object) => {
  object.scale.x = 0.3;
  object.scale.y = 0.3;
  object.scale.z = 0.3;
  object.rotation.x = -Math.PI / 2;
  object.position.y = -30;
  scene.add(object);
});

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const directionLight = new THREE.DirectionalLight(0xffffff);
directionLight.position.set(0, 100, 100);
scene.add(directionLight);

const axesHelper = new THREE.AxesHelper( 50 );
scene.add( axesHelper );

const axes2 = new THREE.AxisHelper( 100 );
scene2.add( axes2 );

// const localPlane = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 5 ).negate();
const localPlane = new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), 5 );
renderer.clippingPlanes = [ localPlane ];
renderer.localClippingEnabled = true;

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  renderer2.render( scene2, camera2 );
}

render();

const controls = new OrbitControls(camera);
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
