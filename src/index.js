import * as THREE from 'three';
import * as OBJLoader from 'three-obj-loader';
import * as OrbitControls from 'three-orbitcontrols';
OBJLoader(THREE);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth/window.innerHeight, 0.01, 2000);
camera.position.z = 100;

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const loadingManager = new THREE.LoadingManager();
const objLoader = new THREE.OBJLoader(loadingManager);
objLoader.load('src/Tree.obj', (object) => {
  object.scale.x = 0.3;
  object.scale.y = 0.3;
  object.scale.z = 0.3;
  object.rotation.x = -Math.PI / 2;
  object.position.y = -30;
  console.log(object);
  scene.add(object);
});

const ambient = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambient);

const directionLight = new THREE.DirectionalLight(0xffffff);
directionLight.position.set(0, 100, 100);
scene.add(directionLight);

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

render();

const controls = new OrbitControls(camera);
controls.update();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

animate();
