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
const menuEffectList = document.querySelectorAll('.js-menu-effect');
function setMenuEffectSize() {
   menuEffectList.forEach(e => {
      e.style.setProperty('--height-effect', e.querySelector('*').offsetHeight + 'px');
   })
}
queueMicrotask(setMenuEffectSize)
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
   setMenuEffectSize();
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



/* объвертка текста для анимации */
function wrapText(elementName) {
   const text = document.querySelectorAll(elementName);
   text.forEach((e) => {
      const list = e.children;
      for (const el of list) {
         let className;
         if (el.classList.contains('color-text')) { className = 'color-text' };
         const words = el.innerHTML.trim().split(' ');
         const wordWrap = words.map(item => { return item.split('').map(e => { return `<span class="letter">${e}</span>` }).join('') })
         el.innerHTML = `<span class="word">${wordWrap.join('</span>&#32;<span class="word">')}</span>`
      }
   })
}
wrapText('.js-text-animate');


import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
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
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(18, canvasSiseX / canvasSiseY, 0.1, 100);

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
   `../dist/glb/transmitter-2.glb`,
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
      // прогресс загрузки модели
      console.log((xhr.loaded / xhr.total * 100) + '% loaded');
   },
   function (error) {
      //Если есть ошибка
      console.error(error);
   }
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

// перемещение блоков при адаптиве
// data-da=".class,3,768" 
// класс родителя куда перемещать
// порядковый номер в родительском блоке куда перемещается начиная с 0 как индексы массива
// ширина экрана min-width
// два перемещения: data-da=".class,3,768,.class2,1,1024"
const ARRAY_DATA_DA = document.querySelectorAll('[data-da]');
ARRAY_DATA_DA.forEach(function (e) {
   const dataArray = e.dataset.da.split(',');
   const addressMove = searchDestination(e, dataArray[0]);
   const addressMoveSecond = dataArray[3] && searchDestination(e, dataArray[3]);
   const addressParent = e.parentElement;
   const listChildren = addressParent.children;
   const mediaQuery = window.matchMedia(`(min-width: ${dataArray[2]}px)`);
   const mediaQuerySecond = dataArray[5] && window.matchMedia(`(min-width: ${dataArray[5]}px)`);
   for (let i = 0; i < listChildren.length; i++) { !listChildren[i].dataset.n && listChildren[i].setAttribute('data-n', `${i}`) };
   mediaQuery.matches && startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   if (mediaQuerySecond && mediaQuerySecond.matches) moving(e, dataArray[4], addressMoveSecond);
   mediaQuery.addEventListener('change', () => { startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) });
   if (mediaQuerySecond) mediaQuerySecond.addEventListener('change', () => {
      if (mediaQuerySecond.matches) { moving(e, dataArray[4], addressMoveSecond); return; };
      startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray);
   });
});

function startChange(mediaQuery, addressMove, e, listChildren, addressParent, dataArray) {
   if (mediaQuery.matches) { moving(e, dataArray[1], addressMove); return; }
   if (listChildren.length > 0) {
      for (let z = 0; z < listChildren.length; z++) {
         if (listChildren[z].dataset.n > e.dataset.n) {
            listChildren[z].before(e);
            break;
         } else if (z == listChildren.length - 1) {
            addressParent.append(e);
         }
      }
      return;
   }
   addressParent.prepend(e);
};

function searchDestination(e, n) {
   if (e.classList.contains(n.slice(1))) { return e }
   if (e.parentElement.querySelector(n)) { return e.parentElement.querySelector(n) };
   return searchDestination(e.parentElement, n);
}

function moving(e, order, addressMove) {
   if (order == "first") { addressMove.prepend(e); return; };
   if (order == "last") { addressMove.append(e); return; };
   if (addressMove.children[order]) { addressMove.children[order].before(e); return; }
   addressMove.append(e);
}



var smoother;
function addTextAnimatePin(name) {
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: `${name}`,
         start: "0% 0%",
         end: `100% 0%`,
         pin: true,
         scrub: true,
      }
   })
   const text = document.querySelectorAll(`${name} .letter`);
   text && text.forEach((e) => {
      tl.to(e, 1, { opacity: 1 })
   })
}

function addTextAnimate(name) {
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: `${name}`,
         start: "0% 90%",
         end: `0% 5%`,
         scrub: true,
      }
   })
   const text = document.querySelectorAll(`${name} .letter`);
   text && text.forEach((e) => {
      tl.to(e, { opacity: 1 })
   })
}


window.addEventListener('load', function (event) {
   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
   smoother = ScrollSmoother.create({
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

   // pin: true,
   // scrub: true,

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
      let xValue = 400;
      if (index % 2 == 0) { xValue *= -1 };
      gsap.fromTo(element, {
         x: xValue,
         scale: 0,
         opacity: 0,
         duration: durationValue,
      },
         {
            x: 0,
            scale: 1,
            opacity: 1,
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

   addTextAnimatePin('.about-section__title');
   addTextAnimate('.services-section__title')


   let tl_about = gsap.timeline({
      scrollTrigger: {
         trigger: '.about-section__body',
         start: '0% 50%',
         end: '0% 50%',
         // markers: {
         //    startColor: "red",
         //    endColor: "green",
         //    fontSize: "18px",
         //    fontWeight: "bold",
         //    indent: 20
         // },
      }
   })

   const ABOUT_ANIMATION = this.document.querySelectorAll('.js-about-animation');
   ABOUT_ANIMATION.forEach((e) => {
      tl_about.to(e, { opacity: 1, duration: 0.5 })
   })

})
/* открывает, закрывает модальные окна. */
/*
добавить классы
js-modal-hidden - родительский контейнер модального окна который скрывается и показывается, задать стили скрытия
js-modal-visible - задать стили открытия
js-modal-close - кнопка закрытия модального окна находится внутри js-modal-hidde
кнопка открытия, любая:
js-modal-open - кнопка открытия модального окна
data-modal_open="id" - id модального окна
если надо что бы окно закрывалось при клике на пустое место (фон), добавляется атрибут js-modal-stop-close.
js-modal-stop-close - атрибут указывает на поле, при клике на которое не должно происходить закрытие окна, 
т.е. контейнер контента, при этом внешний родительский контейнет помечается атрибутом js-modal-close.
допускается дополнительно кнопка закрытия внутри js-modal-stop-close.
*/

document.addEventListener('click', (event) => {
   if (event.target.closest('.js-modal-open')) { openModal(event) }
   if (event.target.closest('.js-modal-close')) { testModalStopClose(event) }
})
function openModal(event) {
   let id = event.target.closest('.js-modal-open').dataset.modal_open;
   if (typeof id !== "undefined") { initOpenModal(id) };
}
function testModalStopClose(event) {
   if (event.target.closest('.js-modal-stop-close') &&
      event.target.closest('.js-modal-stop-close') !==
      event.target.closest('.js-modal-close').closest('.js-modal-stop-close')) {
      return
   }
   closeModal(event);
}
function closeModal(event) {
   event.target.closest('.js-modal-hidden').classList.remove('js-modal-visible');
   setTimeout(() => { event.target.closest('.js-modal-hidden').style.removeProperty('--opacity-effect') }, 400);
   activeScrollCloseModal();
}
// функция закрытия модального окна (передать id модального окна)
function initCloseModal(id) {
   if (document.querySelector(`#${id}`)) {
      document.querySelector(`#${id}`).classList.remove('js-modal-visible');
      setTimeout(() => { document.querySelector(`#${id}`).style.removeProperty('--opacity-effect') }, 400);
   }
   activeScrollCloseModal();
}
// функция открытия модального окна (передать id модального окна)
function initOpenModal(id) {
   if (document.querySelector(`#${id}`)) {
      document.querySelector(`#${id}`).classList.add('js-modal-visible');
      // document.body.classList.add('body-overflow');
      smoother.paused(true);
      document.querySelector(`#${id}`).style.setProperty('--opacity-effect', 1);
      menuIsOpen();
   }
}
function activeScrollCloseModal() {
   if (!document.querySelector('.js-modal-visible')) {
      // document.body.classList.remove('body-overflow');
      smoother.paused(false);
      menuIsClose();
   }
}

function menuIsOpen() {
   document.body.classList.add('menu-open');
}
function menuIsClose() {
   document.body.classList.remove('menu-open');
}


