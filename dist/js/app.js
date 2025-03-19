"use strict"

// window.addEventListener('load', (event) => {});

// desktop or mobile (mouse or touchscreen)
const isMobile = {
   Android: function () { return navigator.userAgent.match(/Android/i) },
   BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i) },
   iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i) },
   Opera: function () { return navigator.userAgent.match(/Opera Mini/i) },
   Windows: function () { return navigator.userAgent.match(/IEMobile/i) },
   any: function () {
      return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
   }
};
const isPC = !isMobile.any();
if (isPC) { document.body.classList.add('_pc') } else { document.body.classList.add('_touch') };

// media queries
const MIN1024 = window.matchMedia('(min-width: 1024px)');
const MIN768 = window.matchMedia('(min-width: 768px)');

// variables
const HEADER = document.getElementById('header');
let progressRadioAnimation = 0;


function throttle(callee, timeout) {
   let timer = null;
   return function perform(...args) {
      if (timer) return;
      timer = setTimeout(() => {
         callee(...args);
         clearTimeout(timer);
         timer = null;
      }, timeout)
   }
}



/* запись переменных высоты элементов */
// function addHeightVariable() {
//    if (typeof HEADER !== "undefined") {
//       document.body.style.setProperty('--height-header', `${HEADER.offsetHeight}px`)
//    }
// }
// addHeightVariable();


// ** ======================= RESIZE ======================  ** //
window.addEventListener('resize', () => {
   //  addHeightVariable();
   closeHeaderMenu();
})


// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('.open-menu')) { openHeaderMenu() }
})

function openHeaderMenu() {
   document.body.classList.toggle('menu-is-open')
}
function closeHeaderMenu() {
   document.body.classList.remove('menu-is-open')
}




import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";


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
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(18, canvasSiseX / canvasSiseY, 0.1, 100);

let ratioX = viewportX / 1000;
let ratioY = viewportY / 1000;


let object;
let empty;
let cylinder;
let volume;
let frequency;




const loader = new GLTFLoader();

loader.load(
   `../glb/transmitter.glb`,
   function (glb) {
      object = glb.scene;
      scene.add(object);

      // object.position.x = ratioX * 5;
      // object.position.y = ratioY * -5;

      empty = object.getObjectByProperty('name', 'Empty');
      cylinder = object.getObjectByProperty('name', 'Cylinder');
      volume = object.getObjectByProperty('name', 'volume');
      frequency = object.getObjectByProperty('name', 'Frequency');
      console.log(cylinder);

   },
   // function (xhr) {
   //    // прогресс загрузки модели
   //    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
   // },
   // function (error) {
   //    //Если есть ошибка
   //    console.error(error);
   // }
);

function moveRadio() {
   if (typeof object !== "undefined") {
      object.position.x = ratioX * 3.8 * (1 - progressRadioAnimation);
      object.position.y = -3.3 + ratioY * -1.2 * (1 - progressRadioAnimation);
      empty.rotation.y = (Math.PI * 2) * -progressRadioAnimation;
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



//Создать создание нового рендеринга и установить его размер
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true позволяет transparent background
renderer.setSize(canvasSiseX, canvasSiseY);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Установите, как далеко будет камера от 3D -модели
camera.position.z = 50;


//Добавьте свет в сцену, чтобы мы могли увидеть 3D -модель
const topLight = new THREE.DirectionalLight(0xffffff, 3); // (color, intensity)
topLight.position.set(5, 5, 10);

// topLight.castShadow = true;

// console.log(topLight);


scene.add(topLight);

// const helper = new THREE.DirectionalLightHelper(topLight, 5);
// scene.add(helper);


const leftLight = new THREE.DirectionalLight(0xffffff, 0); // (color, intensity)
leftLight.position.set(-5, 5, 10);
leftLight.castShadow = true;
// scene.add(leftLight);

const color = 0xFFFFFF;
const intensity = 10;
const light = new THREE.AmbientLight(color, intensity);
// scene.add(light);


const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);


//Это добавляет элементы управления в камеру, поэтому мы можем повернуть / масштабировать ее с помощью мыши
// controls = new OrbitControls(camera, renderer.domElement);


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




// Cylinder
// Empty  

window.addEventListener('load', function (event) {
   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
   let smoother = ScrollSmoother.create({
      smooth: 1,
      // effects: true
   });

   // document.body.addEventListener('click', (event) => {
   //    if (event.target.closest('[href^="#"]')) {
   //       event.preventDefault();
   //       let getName = event.target.closest('[href^="#"]').getAttribute('href');
   //       closeHeaderMenu();
   //       gsap.to(window, { scrollTo: getName, ease: "power2" })
   //    }
   // })


   // gsap.to('.scroll-animation', {
   //    scrollTrigger: {
   //       trigger: '.scroll-animation',

   //       start: '0% 0%',
   //       end: '100% 100%',

   //       // pin: true,
   //       // scrub: true,

   //       markers: {
   //          startColor: "red",
   //          endColor: "green",
   //          fontSize: "18px",
   //          fontWeight: "bold",
   //          indent: 20
   //       },
   //    }
   // })






   gsap.to('#container3D', {
      scrollTrigger: {
         trigger: '.scroll-animation-trigger',
         start: '0% 0%',
         end: '100% 100%',
         pin: true,
         scrub: true,
         onUpdate: (self) => {
            progressRadioAnimation = self.progress.toFixed(4);
         },
      }
   })

   const LIST_DESCRIPTION_BLOCK = this.document.querySelectorAll('.description__block');

   LIST_DESCRIPTION_BLOCK.forEach((element, index) => {
      let durationValue = 0.7;
      let xValue = window.innerWidth;
      if (index % 2 == 0) { xValue *= -1 };
      gsap.fromTo(element, {
         x: xValue,
         duration: durationValue,
      },
         {
            x: 0,
            duration: durationValue,
            scrollTrigger: {
               trigger: element,
               start: '0% 70%',
               end: '0% 70%',
               toggleActions: 'play none reverse none',
            }
         }
      )
   })







})