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
const MOBILE_BUTTON_CONTACT = document.querySelector('.mobile-menu__button-contact');
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
function addHeightVariable() {
   if (HEADER) {
      document.body.style.setProperty('--height-header', `${HEADER.offsetHeight}px`)
   }
   if (MOBILE_BUTTON_CONTACT) {
      document.body.style.setProperty('--padding-for-button-mobile', `${MOBILE_BUTTON_CONTACT.offsetHeight}px`)
   }
}
addHeightVariable();


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



function findNodeByName(rootNode, name) {
   // Если текущий узел — искомый, возвращаем его
   if (rootNode.name === name) {
      return rootNode;
   }

   // Проверяем всех детей текущего узла
   if (rootNode.getChildren) {
      for (const child of rootNode.getChildren()) {
         const found = findNodeByName(child, name);
         if (found) {
            return found;
         }
      }
   }
   return null; // Если ничего не найдено
}

window.addEventListener('DOMContentLoaded', function () {
   const canvas = document.getElementById("container3D");
   if (!canvas) {
      console.log("Canvas not found!");
      return;
   };
   let model;
   let empty;
   let volumeElement;
   let frequency;
   let antenna;
   let cylinder;
   let viewportX;
   let viewportY;
   let progressRotationValue = 0;
   let degRotationValue = -100;
   let degRotationFrequency = 180;
   let progressRotationFrequency = 0;

   function addSizeViewport() {
      viewportX = Math.min(window.innerWidth, 1440);
      viewportY = window.innerHeight;
   }
   addSizeViewport();
   let ratioX = viewportX / 1000;
   let ratioY = viewportY / 1000;
   // отключить анимацию загрузки babylon
   BABYLON.SceneLoader.ShowLoadingScreen = false;
   // Инициализация движка
   const engine = new BABYLON.Engine(canvas, true);
   console.log("WebGL version:", engine.webGLVersion); // 1 или 2
   console.log("WebGL API:", engine.version); // "webgl1" или "webgl2"
   if (engine.webGLVersion < 2) {
      console.warn("WebGL 2.0 не поддерживается, некоторые эффекты могут не работать");
   }
   // Создание сцены
   const scene = new BABYLON.Scene(engine);
   scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
   // Добавление камеры
   let distance = 40;
   if (MIN768.matches) { distance = 20 };
   const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, distance, BABYLON.Vector3.Zero(), scene);
   // camera.attachControl(canvas, true);

   // Добавление света
   const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-1, 1, 5), scene);
   light1.intensity = 0.8;
   light1.diffuse = new BABYLON.Color3(1, 1, 1);
   const light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0, -5), scene);
   light2.intensity = 0.3;
   light2.diffuse = new BABYLON.Color3(1, 1, 1);


   // const spotLight = new BABYLON.SpotLight(
   //    "spotLight",
   //    new BABYLON.Vector3(10, 5, -3),
   //    new BABYLON.Vector3(-10, -4, 2),
   //    Math.PI / 3,
   //    0,
   //    scene);
   // spotLight.intensity = 1500;
   // spotLight.diffuse = new BABYLON.Color3(1, 0.144, 0);
   // console.log(spotLight);


   // const spotLight_1 = new BABYLON.SpotLight(
   //    "spotLight1",
   //    new BABYLON.Vector3(1, 3.3, 2),
   //    new BABYLON.Vector3(0, 0, -2),
   //    Math.PI * 2,
   //    10,
   //    scene);
   // spotLight_1.intensity = 25;
   // spotLight_1.radius = 500;
   // spotLight_1.diffuse = new BABYLON.Color3(1, 0.1, 0);

   // Color3(1, 0.466, 0.302)
   // FF764EFF
   // rgb(255, 144, 0)

   // const shadowGenerator = new BABYLON.ShadowGenerator(
   //    1024, // Размер текстуры теней (чем больше, тем качественнее)
   //    spotLight // Источник света
   // );

   // Загрузка модели
   BABYLON.SceneLoader.Append("https://gorejkoff.github.io/Ural_factories/dist/glb/", "transmitter-5.glb", scene, function (scene) {
      // BABYLON.SceneLoader.Append("../glb/", "transmitter-5.glb", scene, function (scene) {
      scene.animationGroups.forEach(animationGroup => {
         animationGroup.stop();
         animationGroup.dispose();
      });

      model = scene.getMeshByName("__root__");
      if (!model) {
         console.error("Не найден __root__!");
         return;
      }
      console.log(model, "model");

      if (MIN768.matches) {
         model.position = new BABYLON.Vector3(0, -3, 0);
      }
      cylinder = model._children[0];
      console.log(cylinder, 'cylinder')

      empty = model._children[1];
      console.log(empty, "empty");

      antenna = empty._children.filter((e) => { return e.name == "antenna" });
      console.log(antenna[0], 'antenna');

      volumeElement = empty._children.filter((e) => { return e.name == "volume" });
      console.log(volumeElement[0], 'volumeElement');

      frequency = empty._children.filter((e) => { return e.name == "Frequency" });
      console.log(frequency[0], 'frequency');


      // spotLight.parent = empty;
      // spotLight_1.parent = empty;


      let front_frame = empty._children.filter((e) => { return e.name == "front frame" });
      console.log(front_frame[0], 'front_frame');

      let back_cover = empty._children.filter((e) => { return e.name == "back cover" });
      console.log(back_cover[0], 'back_cover');

      let holder = empty._children.filter((e) => { return e.name == "holder" });
      console.log(holder[0], 'holder');

      let glass = empty._children.filter((e) => { return e.name == "glass" });
      console.log(glass[0], 'glass');

      let black_glass = empty._children.filter((e) => { return e.name == "black glass" });
      console.log(black_glass[0], 'black glass');

      let black_glass_primitive0 = black_glass[0]._children.filter((e) => { return e.name == "black glass_primitive0" });
      console.log(black_glass_primitive0[0], 'black glass_primitive0');

      let black_glass_primitive1 = black_glass[0]._children.filter((e) => { return e.name == "black glass_primitive1" });
      console.log(black_glass_primitive1[0], 'black glass_primitive1');

      // spotLight.excludedMeshes.push(black_glass_primitive0[0]);
      // spotLight.excludedMeshes.push(black_glass_primitive1[0]);
      // spotLight.excludedMeshes.push(glass[0]);

      let frame = empty._children.filter((e) => { return e.name == "frame" });
      console.log(frame[0], 'frame');
      let frame_primitive0 = frame[0]._children.filter((e) => { return e.name == "frame_primitive0" });
      console.log(frame_primitive0[0], 'frame_primitive0');

      // spotLight.includedOnlyMeshes = [antenna[0], front_frame[0]];

      // let point = empty._children.filter((e) => { return e.name == "Point" });
      // console.log(point[0], "point");





      // // Настройка качества (опционально)
      // shadowGenerator.useBlurExponentialShadowMap = true;
      // shadowGenerator.blurKernel = 320; // Размытие (если включено)
      // // отбрасывает тень
      // shadowGenerator.addShadowCaster(back_cover[0])
      // shadowGenerator.addShadowCaster(frame_primitive0[0])
      // // shadowGenerator.addShadowCaster(holder[0])
      // // принимает тень
      // holder[0].receiveShadows = true;
      // // frame_primitive0[0].receiveShadows = true;
      // // back_cover[0].receiveShadows = true;



   });


   let circleStart = 0.5;
   let circlePath = 1 - circleStart;
   function rodioAnimation() {

      if (MIN768.matches) {
         empty.position = new BABYLON.Vector3(
            8 * ratioX * (1 - progressRadioAnimation),
            -1 * ratioY * (1 - progressRadioAnimation) - 1,
            0);
         // spotLight.position.x = ratioY * (1 - progressRadioAnimation);
         // console.log(spotLight.position.x);

      } else {
         model.position = new BABYLON.Vector3(progressRadioAnimation * -3, progressRadioAnimation * -2 + 2, 0)
      }
      empty.rotation = new BABYLON.Vector3(0, (Math.PI * 2) * -progressRadioAnimation, 0);
      if (progressRadioAnimation > circleStart) {
         let value = (progressRadioAnimation - circleStart) / circlePath;
         cylinder.scaling.x = value;
         cylinder.scaling.y = value;
         cylinder.scaling.z = value;
      } else {
         cylinder.scaling.x = 0;
         cylinder.scaling.y = 0
         cylinder.scaling.z = 0
      }
      if (progressRadioAnimation >= 0.99) {
         degRotationValue <= progressRotationValue && rotationVolume();
         degRotationFrequency >= progressRotationFrequency && rotationFrequency();
      }
      if (progressRadioAnimation < 0.99) {
         progressRotationValue <= 0 && reverseRotationVolume();
         progressRotationFrequency >= 0 && reverseRotationFrequency();
      }

   }

   // Рендер сцены
   engine.runRenderLoop(function () {
      if (empty) { rodioAnimation() }
      scene.render();
   });

   // Обработка изменения размера окна
   window.addEventListener("resize", function () {
      engine.resize();
   });


   function rotationVolume() {
      progressRotationValue -= 2;
      volumeElement[0].rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * progressRotationValue);
   }
   function reverseRotationVolume() {
      progressRotationValue += 2;
      volumeElement[0].rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * progressRotationValue);
   }
   function rotationFrequency() {
      progressRotationFrequency += 2.5;
      frequency[0].rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * -progressRotationValue);
   }
   function reverseRotationFrequency() {
      progressRotationFrequency -= 2.5;
      frequency[0].rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * -progressRotationValue);
   }
});


var smoother;

function textWpapSpan(elementName) {
   const listText = document.querySelectorAll(elementName);
   listText.forEach(element => {
      const listSpan = element.querySelectorAll('span');
      listSpan.forEach(element => {
         const words = element.innerHTML.trim().split(' ');
         const wordWrap = words.map(item => { return item.split('').map(e => { return `<span class="letter">${e}</span>` }).join('') })
         element.innerHTML = `<span class="word">${wordWrap.join('</span>&#32;<span class="word">')}</span>`
      })
   });
}
textWpapSpan(".js-text-animate")

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
   if (document.getElementById('container3D')) {
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
   }

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

   if (document.querySelector('.about-section__title')) addTextAnimatePin('.about-section__title');

   if (document.querySelector('.services-section__title')) addTextAnimate('.services-section__title')

   let tl_about;
   if (document.querySelector('.about-section__body')) {
      tl_about = gsap.timeline({
         scrollTrigger: {
            trigger: '.about-section__body',
            start: '0% 50%',
            end: '0% 50%',
         }
      })

      const ABOUT_ANIMATION = this.document.querySelectorAll('.js-about-animation');
      if (ABOUT_ANIMATION.length === 0) return;
      ABOUT_ANIMATION.forEach((e) => {
         tl_about.to(e, { opacity: 1, duration: 0.5 })
      })
   }



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


