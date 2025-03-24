// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/DRACOLoader.js";


let viewportX;
let viewportY;
let canvasSiseX;
let canvasSiseY;

function addSizeViewport() {
   canvasSiseX = document.documentElement.clientWidth;
   canvasSiseY = window.innerHeight + 100;
   viewportX = Math.min(window.innerWidth, 1440);
   viewportY = window.innerHeight;
}
addSizeViewport();

//Создать создание нового рендеринга и установить его размер
const screen3D = document.getElementById('container3D');
const renderer = new THREE.WebGLRenderer({
   alpha: true, // прозрачный фон
   canvas: screen3D,
})
renderer.setSize(canvasSiseX, canvasSiseY);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(18, canvasSiseX / canvasSiseY, 0.1, 100);
//Установите, как далеко будет камера от 3D -модели
camera.position.z = 90;
if (MIN768.matches) {
   camera.position.z = 50;
}

let ratioX = viewportX / 1000;
let ratioY = viewportY / 1000;

let object;
let empty;
let cylinder;
let volume;
let frequency;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(' https://www.gstatic.com/draco/versioned/decoders/1.5.6/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(
   `https://gorejkoff.github.io/Ural_factories/dist/glb/transmitter-2.glb`,
   // `../dist/glb/transmitter-2.glb`,
   // `../glb/transmitter-2.glb`,
   function (glb) {
      object = glb.scene;
      scene.add(object);
      empty = object.getObjectByProperty('name', 'Empty');
      cylinder = object.getObjectByProperty('name', 'Cylinder');
      volume = object.getObjectByProperty('name', 'volume');
      frequency = object.getObjectByProperty('name', 'Frequency');
   },
   function (xhr) {
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
   },
   function (error) {
      console.error(error);
   }
);
function moveRadio() {
   if (typeof object !== "undefined") {
      if (!MIN768.matches) {
         object.scale.set(0.7, 0.7, 0.7);
      }
      object.position.x = -7 * ratioX * (1 - progressRadioAnimation) + 3;
      object.position.y = 1 + ratioY * (1 - progressRadioAnimation);
      empty.rotation.y = (Math.PI * 2) * -progressRadioAnimation;

      if (MIN768.matches) {
         object.position.x = ratioX * 3.8 * (1 - progressRadioAnimation);
         object.position.y = -3.3 + ratioY * -1.2 * (1 - progressRadioAnimation);
         empty.rotation.y = (Math.PI * 2) * -progressRadioAnimation;
      }
      cylinder.scale.x = progressRadioAnimation;
      cylinder.scale.y = progressRadioAnimation;
      cylinder.scale.z = progressRadioAnimation;

      if (progressRadioAnimation >= 0.9) {
         degRotationValue <= progressRotationValue && rotationVolume();
         degRotationFrequency >= progressRotationFrequency && rotationFrequency();
      }
      if (progressRadioAnimation < 0.9) {
         progressRotationValue <= 0 && reverseRotationVolume();
         progressRotationFrequency >= 0 && reverseRotationFrequency();
      }
   }
}


let progressRotationValue = 0;
let degRotationValue = -100;
let degRotationFrequency = 180;
let progressRotationFrequency = 0;

function rotationVolume() {
   progressRotationValue -= 2;
   volume.rotation.z = (Math.PI / 180) * progressRotationValue;
}
function reverseRotationVolume() {
   progressRotationValue += 2;
   volume.rotation.z = (Math.PI / 180) * progressRotationValue;
}
function rotationFrequency() {
   progressRotationFrequency += 2.5;
   frequency.rotation.z = (Math.PI / 180) * progressRotationFrequency;
}
function reverseRotationFrequency() {
   progressRotationFrequency -= 2.5;
   frequency.rotation.z = (Math.PI / 180) * progressRotationFrequency;
}


//Добавьте свет в сцену, чтобы мы могли увидеть 3D -модель
const color_light = 0x3b3b3b;
// const color_light = 0x404040;
const leftLight = new THREE.DirectionalLight(color_light, 18);
leftLight.position.set(3, 5, 1.5);
scene.add(leftLight);
const helper = new THREE.DirectionalLightHelper(leftLight, 1);
// scene.add(helper);
const leftLight2 = new THREE.DirectionalLight(color_light, 18);
leftLight2.position.set(-3, -5, 1.5);
scene.add(leftLight2);
const helper2 = new THREE.DirectionalLightHelper(leftLight2, 1);
// scene.add(helper2);
const leftLight3 = new THREE.DirectionalLight(color_light, 18);
leftLight3.position.set(-3, 5, 1.5);
scene.add(leftLight3);
const leftLight4 = new THREE.DirectionalLight(color_light, 18);
leftLight4.position.set(3, -5, 1.5);
scene.add(leftLight4);


const ambientLight = new THREE.AmbientLight(0x404040, 5);
// scene.add(ambientLight);


//Это добавляет элементы управления в камеру, поэтому мы можем повернуть / масштабировать ее с помощью мыши
// const controls = new OrbitControls(camera, renderer.domElement);


//Render the scene
function animate() {
   renderer.render(scene, camera);
   moveRadio();
   requestAnimationFrame(animate);
}

//Добавить слушателя в окно, чтобы мы могли изменить размер окна и камеры
window.addEventListener("resize", function () {
   addSizeViewport();
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(canvasSiseX, canvasSiseY);
});

animate();
