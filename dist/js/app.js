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
function debounce(func, delay) {
   let timeoutId;
   return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
         func.apply(this, args);
      }, delay);
   };
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
window.addEventListener('load', (event) => {
   addHeightVariable();
});



// ** ======================= RESIZE ======================  ** //
window.addEventListener('resize', () => {
   //  addHeightVariable();
   closeHeaderMenu();
   setMenuEffectSize();
   setTimeout(setMarginCustomSwiper, 1000)
})


// ** ======================= CLICK ======================  ** //
document.documentElement.addEventListener("click", (event) => {
   if (event.target.closest('.open-menu')) { openHeaderMenu() };
   if (event.target.closest('.js-sort-menu-filter')) {
      setValueSortMenu(event.target.closest('.js-sort-menu-filter'));
   }
})

function openHeaderMenu() {
   document.body.classList.toggle('menu-is-open')
}
function closeHeaderMenu() {
   document.body.classList.remove('menu-is-open')
}


const CUSTOM_SWIPER = document.getElementById('custom-swiper');
const CUSTOM_SWIPER_BODY = document.getElementById('custom-swiper-body');
function setMarginCustomSwiper() {
   if (CUSTOM_SWIPER && CUSTOM_SWIPER_BODY) {
      const getOffset = parseInt(getComputedStyle(CUSTOM_SWIPER_BODY).marginTop);
      const setOffset = -CUSTOM_SWIPER_BODY.offsetHeight + CUSTOM_SWIPER.offsetHeight + getOffset + "px";
      CUSTOM_SWIPER_BODY.style.setProperty("--margin-bottom", setOffset);
   }
}
setTimeout(setMarginCustomSwiper, 500)

function setValueSortMenu(element) {
   const sortMenu = element.closest('.sort-menu');
   if (!sortMenu) return;
   const selectedValue = sortMenu.querySelector('.js-selected-value');
   if (!selectedValue) return;
   selectedValue.innerHTML = element.innerHTML;
}


const INFO_GRID = document.querySelectorAll('.js-quantity-child');

function calcCildElementInfo(element) {
   const quantity = element.children.length;
   element.style.setProperty('--quantity', quantity);
}
INFO_GRID.forEach(e => {
   calcCildElementInfo(e)
})
// принудительный перенос строки после слова. Номер по порядку указать в аттрибуте data-line_break="2", присвоить класс js-text-transfer
function textTransfer(element) {
   let text = '';
   const line_break = element.dataset.line_break;
   const arrayText = element.innerHTML.trim().split(' ');
   if (!line_break) {
      console.error('Нет аттрибута с порядковым номером слова для переноса. (прим:data-line_break="2")', element);
      return;
   };
   if (arrayText.length == 0) return;
   for (let i = 0; i < arrayText.length; i++) {
      if (line_break == i) {
         text = text + '<br>'
      }
      text = text + arrayText[i] + ' ';
   }
   element.innerHTML = text;
}
function inittextTransfer() {
   document.querySelectorAll('.js-text-transfer').forEach((element) => {
      textTransfer(element)
   })
}
setTimeout(inittextTransfer, 0);

// анимация текста, появляются слова снизу вверх (js-text-animate-grow). Класс у родителя text-animate-grow-show запускает анимацию.
function wrapWordsSpan(animateGrow) {
   const tempDiv = document.createElement('div');
   tempDiv.innerHTML = animateGrow.innerHTML;
   function processNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
         const text = node.textContent.replace(/\s{2,}/g, ' ').trim();
         if (text) {
            const words = text.split(/\s+/);
            const fragment = document.createDocumentFragment();
            words.forEach((word, index) => {
               const spanWrapper = document.createElement('span');
               spanWrapper.className = 'word-wrap';
               const spanWord = document.createElement('span');
               spanWord.className = 'word';
               spanWord.textContent = word;
               spanWrapper.append(spanWord);
               fragment.append(spanWrapper, ' ');
               if (index < words.length - 1) { fragment.append(document.createTextNode(' ')) }
            });
            node.parentNode.replaceChild(fragment, node);
         }
      } else if (node.nodeType === Node.ELEMENT_NODE && node.childNodes) {
         Array.from(node.childNodes).forEach(processNode);
      }
   }
   Array.from(tempDiv.childNodes).forEach(processNode);
   animateGrow.innerHTML = tempDiv.innerHTML;
   if (animateGrow.dataset.duration) {
      animateGrow.style.setProperty('--tr', animateGrow.dataset.duration + 's');
   }
}
const listAnimateGrow = document.querySelectorAll('.js-text-animate-grow');
listAnimateGrow.forEach(e => wrapWordsSpan(e))


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




window.addEventListener('DOMContentLoaded', function () {
   const canvas = document.getElementById('container3D');
   if (!canvas) {
      console.log('Canvas not found!');
      return;
   };
   let model;
   let transmitter;
   let light_side;
   let light_screen;
   let volumeElement;
   let frequency;
   let cylinder;
   let viewportX;
   let viewportY;
   let progressRotationValue = 0;
   let degRotationValue = -100;
   let degRotationFrequency = 180;
   let progressRotationFrequency = 0;
   const orthoSize = 11;
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

   const engine = new BABYLON.Engine(canvas, true, null, true);
   // console.log('WebGL version:', engine.webGLVersion); // 1 или 2
   // console.log('WebGL API:', engine.version); // 'webgl1' или 'webgl2'
   // if (engine.webGLVersion < 2) {
   //    console.warn('WebGL 2.0 не поддерживается, некоторые эффекты могут не работать');
   // }
   // Создание сцены
   const scene = new BABYLON.Scene(engine);
   scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
   scene.skipPointerMovePicking = true;
   scene.skipFrustumClipping = true; // Упростить вычисления освещения
   scene.freezeActiveMeshes();
   scene.freezeMaterials();
   // Отключить автоматическую очистку для ненужных буферов
   // scene.autoClear = false;
   // scene.autoClearDepthAndStencil = false;
   // scene.forceWireframe = false; // Не принуждать к каркасному режиму
   // scene.forcePointsCloud = false; // Не принуждать к точкам
   // scene.fogEnabled = false;
   // scene.particlesEnabled = false; // Полное отключение системы частиц
   // scene.forceShowBoundingBoxes = false;// Оптимизировать вычисления
   // Основная группа рендеринга - очищаем только один раз
   // scene.setRenderingAutoClearDepthStencil(0, true, true, true);
   // Остальные группы - отключаем очистку
   // scene.setRenderingAutoClearDepthStencil(1, false, false, false);
   // scene.setRenderingAutoClearDepthStencil(2, false, false, false);
   // scene.setRenderingAutoClearDepthStencil(3, false, false, false);

   // Добавление камеры
   let distance = 40;
   const camera = new BABYLON.ArcRotateCamera('camera', Math.PI / 2, Math.PI / 2, distance, BABYLON.Vector3.Zero(), scene);
   // camera.minZ = 0.1;   // Ближняя плоскость отсечения
   // camera.maxZ = 1000;  // Дальняя плоскость отсечения
   // camera.collisionRetryCount = 1;
   // Включаем ортографический режим
   if (MIN768.matches) { camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA; };
   const aspectRatio = engine.getAspectRatio(camera);
   if (aspectRatio < 1) {
      camera.orthoTop = orthoSize;
      camera.orthoBottom = -orthoSize;
      camera.orthoLeft = -orthoSize * aspectRatio;
      camera.orthoRight = orthoSize * aspectRatio;
   }
   else {
      camera.orthoLeft = -orthoSize;
      camera.orthoRight = orthoSize;
      camera.orthoTop = orthoSize / aspectRatio;
      camera.orthoBottom = -orthoSize / aspectRatio;
   }

   camera.setTarget(BABYLON.Vector3.Zero());


   // Добавление света 
   const light1 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(-1, 1, 5), scene);
   light1.intensity = 0.4;
   // light1.shadowEnabled = false;
   light1.diffuse = new BABYLON.Color3(1, 1, 1);
   const light2 = new BABYLON.HemisphericLight('light2', new BABYLON.Vector3(0, 0, -5), scene);
   light2.intensity = 0.5;
   // light2.shadowEnabled = false;
   light2.diffuse = new BABYLON.Color3(1, 1, 1);
   const backLight = new BABYLON.DirectionalLight('backLight', new BABYLON.Vector3(0, 0, -1), scene);
   backLight.intensity = 0.9;
   // backLight.shadowEnabled = false;

   const URL = 'https://gorejkoff.github.io/Ural_factories/dist/glb/';
   // const modelName = 'radio.glb';
   // const modelName = 'edit-7.glb';
   const modelName = 'radio_optimized.glb';
   const cacheName = '3d-models-v1';

   async function cacheModel(modelUrl) {
      try {
         const cache = await caches.open(cacheName);
         const response = await fetch(modelUrl);
         if (response.ok) {
            await cache.put(modelUrl, response);
            console.log('3D модель закеширована!');
         }
      } catch (error) {
         console.error('Ошибка кеширования модели:', error);
      }
   }

   async function loadModel() {
      //Проверка наличия cahe API
      const isSecure = window.location.protocol === 'https:';
      if (!isSecure) {
         console.error('Требуется HTTPS для работы Cache API');
      }

      if (!('caches' in window)) {
         console.error('Cache API не поддерживается');
         downloadingFromServer();
         return;
      }

      const cache = await caches.open(cacheName);
      const searchModel = await cache.match(URL + modelName);

      if (searchModel) {
         // очистка от прошлой модели при замене
         const list = await cache.keys();
         const listURL = list.filter(e => {
            console.log(e.url);

            return e.url !== URL + modelName
         })
         if (listURL.length > 0) {
            console.log('Очистка cache name:3d-models-v1');
            listURL.forEach(e => cache.delete(e.url));
         }
         // Получаем данные как Blob
         const modelBlob = await searchModel.blob();
         // Создаем URL для Blob
         const blobUrl = window.URL.createObjectURL(modelBlob);
         // Загрузка из сервера
         downloadingFromCache(blobUrl);
         // Не забудьте освободить URL после загрузки, для предотвращения утечки памяти
         window.URL.revokeObjectURL(blobUrl);
      } else {
         downloadingFromServer();
         cacheModel(URL + modelName);
      }
   }

   async function deleteCache(cacheName) {
      // Удалить кеш с именем ...
      const result = await caches.delete(cacheName);
      if (result) {
         console.log(`Cache '${cacheName}' успешно удален`);
      } else {
         console.log(`Cache '${cacheName}' не найден`);
      }
   }

   // deleteCache(cacheName);
   const loadingOptions = {
      retryLoading: true, // Повторять попытку загрузки при ошибке (опционально)
      maxRetries: 2,      // Максимальное количество попыток (опционально)
      timeout: 30000      // Время ожидания в миллисекундах (30 секунд)
   };
   loadModel()
   // Загрузка из сервера
   function downloadingFromServer() {
      BABYLON.SceneLoader.Append(
         URL,
         modelName,
         scene,
         function (meshes) {
            console.log('Модель загружена из сервера');
            actionModel(meshes);
         }, // onSuccess (успех)
         null, // onProgress (прогресс)
         null, // onError (ошибка)
         '.glb',
         loadingOptions);
   }
   // Загрузка из cache
   async function downloadingFromCache(blobUrl) {
      BABYLON.SceneLoader.Append('',
         blobUrl,
         scene,
         function (meshes) {
            console.log('Модель загружена из cache успешно');
            actionModel(meshes);
         },
         null,
         null,
         '.glb',
         loadingOptions);
   }

   // подгрузка модели локально для разработки
   // BABYLON.SceneLoader.Append('../glb/', 'edit-7.glb', scene, actionModel);
   // scene.animationGroups.forEach(animationGroup => {
   //    animationGroup.stop();
   //    animationGroup.dispose();
   // });


   async function actionModel() {
      model = await scene.getMeshByName('__root__');
      if (!model) {
         console.error('Не найден __root__ в модели!');
         return;
      }

      if (MIN768.matches) {
         model.position = new BABYLON.Vector3(0, -3, 0);
         const scale = 1 + (window.innerWidth - 1440) / (1920 - 1440) * (0.8 - 1);
         model.scaling.x = scale;
         model.scaling.y = scale;
      }


      cylinder = (model._children.filter((e) => { return e.name == 'Cylinder' }))[0];
      console.log('cylinder', cylinder); // ! comment
      cylinder.position.y = 5.3;
      backLight.includedOnlyMeshes = [cylinder]


      transmitter = new BABYLON.TransformNode('transmitter', scene);

      const elenentsTransmitter = model._children.filter((e) => { return !(['Cylinder', 'light_side'].includes(e.name)) });
      elenentsTransmitter.forEach(e => e.parent = transmitter);
      console.log('elenentsTransmitter', elenentsTransmitter);
      transmitter.scaling = new BABYLON.Vector3(1, 1, -1);

      volumeElement = (transmitter._children.filter((e) => { return e.name == 'volume' }))[0];
      console.log('volumeElement', volumeElement); // ! comment
      frequency = (transmitter._children.filter((e) => { return e.name == 'frequency' }))[0];
      console.log('frequency', frequency); // ! comment
      // let glass = transmitter._children.filter((e) => { return e.name == 'glass' });
      // const front_frame = scene.getMeshByName('front frame');
      // const mesh_primitive0 = scene.getMeshByName('frame_primitive0');
      // Добавление света
      light_screen = scene.getLightByName('light_screen');
      light_side = scene.getLightByName('light_side');
      light_side.shadowEnabled = true;
      // const shadowGenerator = new BABYLON.ShadowGenerator(1024, light_side);
      // shadowGenerator.useBlurExponentialShadowMap = true; // Для мягких теней
      // shadowGenerator.blurKernel = 32;
      // Добавляем объекты, которые должны отбрасывать тени
      // shadowGenerator.addShadowCaster(mesh_primitive0, front_frame);
      // свет игнорирует указанные модели
      // light_side.excludedMeshes.push(front_frame, glass[0]);
   }

   // Inspector 
   // scene.debugLayer.show();

   let circleStart = 0.5;
   let circlePath = 1 - circleStart;
   let valueStartY;
   function calcValueStartY() { valueStartY = -3 + (window.innerWidth - 1440) / (1920 - 1440) * (2.4 - 1.4) }
   calcValueStartY();
   function rodioAnimation() {
      if (MIN768.matches) {
         transmitter.position = new BABYLON.Vector3(
            -4.5 * ratioX * (1 - progressRadioAnimation),
            0.2 * ratioY * (1 - progressRadioAnimation) + valueStartY,
            0);
         light_side.position = new BABYLON.Vector3(
            -1 * ratioX * (1 - progressRadioAnimation),
            0,
            3);
      } else {
         model.position = new BABYLON.Vector3(progressRadioAnimation * -3, progressRadioAnimation * -2 + 2, 0)
      }
      transmitter.rotation.y = (Math.PI * 1) + (Math.PI * 2) * progressRadioAnimation;
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
         if (degRotationValue <= progressRotationValue) rotationVolume();
         if (degRotationFrequency >= progressRotationFrequency) rotationFrequency();
      }
      if (progressRadioAnimation < 0.99) {
         progressRotationValue <= 0 && reverseRotationVolume();
         progressRotationFrequency >= 0 && reverseRotationFrequency();
      }
   }
   // Рендер сцены
   let renderRun = true; // происходит рендер
   let renderStrart = true; // запустить рендер
   let scrollHeppening = true; // происходит скролл
   const renderStop = throttle(() => {
      renderRun = false;
      setTimeout(() => { renderStrart = false }, 1500);
   }, 1500)

   engine.stopRenderLoop();

   let targetFPS = 24; // Целевая частота кадров
   let lastTime = 0;

   function customRenderLoop() {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 1000 / targetFPS) {
         if (![1, 0].includes(Number(progressRadioAnimation)) && scrollHeppening) {
            renderRun = true;
            renderStrart = true;
         }
         if (([1, 0].includes(Number(progressRadioAnimation)) && renderRun || !scrollHeppening && renderRun) && transmitter) {
            renderStop();
         }
         if (transmitter && renderStrart) {
            rodioAnimation();
            // console.log('render test');
            scene.render();
         }
         lastTime = currentTime;
      }
      requestAnimationFrame(customRenderLoop);
   }
   requestAnimationFrame(customRenderLoop);

   // engine.runRenderLoop(function () {
   //    if (![1, 0].includes(Number(progressRadioAnimation)) && scrollHeppening) {
   //       renderRun = true;
   //       renderStrart = true;
   //    }
   //    if (([1, 0].includes(Number(progressRadioAnimation)) && renderRun || !scrollHeppening && renderRun) && transmitter) {
   //       renderStop();
   //    }
   //    if (transmitter && renderStrart) {
   //       rodioAnimation();
   //       scene.render();
   //    }
   // });


   const scrollHeppeningFun = debounce(() => { scrollHeppening = false }, 500)

   window.addEventListener('scroll', () => {
      scrollHeppening = true;
      scrollHeppeningFun();
   })

   // Обработка изменения размера окна
   window.addEventListener('resize', function () {
      calcValueStartY();
      engine.resize();
   });

   function rotationVolume() {
      progressRotationValue -= 2;
      volumeElement.rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * progressRotationValue);
   }
   function reverseRotationVolume() {
      progressRotationValue += 2;
      volumeElement.rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * progressRotationValue);
   }
   function rotationFrequency() {
      progressRotationFrequency += 2.5;
      frequency.rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * -progressRotationValue);
   }
   function reverseRotationFrequency() {
      progressRotationFrequency -= 2.5;
      frequency.rotation = new BABYLON.Vector3(Math.PI / 2, 0, (Math.PI / 180) * -progressRotationValue);
   }
});





var smoother;

function textWpapSpan(element) {
   const listSpan = element.querySelectorAll('span');
   listSpan.forEach(element => {
      const words = element.innerHTML.trim().split(' ');
      const wordWrap = words.map(item => { return item.split('').map(e => { return `<span class="letter">${e}</span>` }).join('') })
      element.innerHTML = `<span class="word">${wordWrap.join('</span>&#32;<span class="word"> ')}</span> `
      element.after(' ');
   })
}

function addTextAnimatePin(name) {
   textWpapSpan(element)
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

function addTextAnimate(element) {
   textWpapSpan(element)
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: element,
         start: "0% 90%",
         end: `0% 5%`,
         scrub: true,
      }
   })
   const text = element.querySelectorAll(`.letter`);
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

   if (document.querySelector('main')) {
      const paddingHeader = document.createElement('div');
      paddingHeader.classList.add('padding-header')
      paddingHeader.style.height = 'var(--height-header)';
      const main = document.querySelector('main');
      const parentHeader = HEADER.parentElement;
      gsap.to(main, {
         scrollTrigger: {
            trigger: main,
            start: '0% 0%',
            end: '0% 0%',
            onEnter: () => { moveHeader() },
            onLeaveBack: () => { moveHeaderBack() },
         }
      })

      function moveHeader() {
         document.body.prepend(HEADER);
         parentHeader.prepend(paddingHeader)
      }
      function moveHeaderBack() {
         parentHeader.prepend(HEADER);
         document.querySelector('.padding-header').remove();
      }

   }

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

   const LIST_DESCRIPTION_BLOCK = document.querySelectorAll('.description__block');

   LIST_DESCRIPTION_BLOCK.forEach((element, index) => {
      gsap.to(element, {
         scrollTrigger: {
            trigger: element,
            start: "top 60%",
            toggleClass: { targets: element, className: "text-animate-grow-show" }
         }
      }
      )
   })


   const ANIMATE_PIN = document.querySelectorAll('.js-text-animate-pin');
   ANIMATE_PIN.forEach(element => { addTextAnimate(element) });

   const ANIMATE_FREE = document.querySelectorAll('.js-text-animate-free');
   ANIMATE_FREE.forEach(element => { addTextAnimate(element) });

   let tl_about;
   if (document.querySelector('.about-section__body')) {
      tl_about = gsap.timeline({
         scrollTrigger: {
            trigger: '.about-section__body',
            start: '0% 50%',
            end: '0% 50%',
         }
      });

      const ABOUT_ANIMATION = this.document.querySelectorAll('.js-about-animation');
      if (ABOUT_ANIMATION.length === 0) return;
      ABOUT_ANIMATION.forEach((e) => {
         tl_about.to(e, { opacity: 1, duration: 0.5 })
      });
   };


   if (document.querySelector('.benefit__body') && MIN768.matches) {
      gsap.to('.benefit__progress', {
         "--progress": "100%",
         duration: 5,
         scrollTrigger: {
            trigger: '.benefit__body',
            start: '80% 100%',
            end: '40% 0%',
            scrub: MIN768.matches ? true : false,
            // markers: {
            //    startColor: "red",
            //    endColor: "green",
            //    fontSize: "18px",
            //    fontWeight: "bold",
            //    indent: 20
            // }
         }
      })
   }

   if (document.querySelector('.benefit__block') && !MIN768.matches) {

      const paddingX = getComputedStyle(document.querySelector('.benefit__container')).paddingLeft;
      const scrollWidth = document.querySelector('.benefit__body').offsetWidth - window.innerWidth + parseInt(paddingX) * 2;
      const benefitScroll = document.querySelector('.benefit__scroll');
      let scrollValue = 0;
      const benefitProgress = document.querySelector('.benefit__progress');

      benefitScroll.addEventListener('scroll', (event) => {
         benefitProgress.style.setProperty('--progress', benefitScroll.scrollLeft / scrollWidth * 100 + "%")
      })

      function scrollElement() {
         scrollValue += 2;
         benefitScroll.scrollLeft = scrollValue;
         if (scrollValue < scrollWidth) {
            requestAnimationFrame(scrollElement)
         }
      }

      function scrollToBeginning() {
         scrollValue = 0;
         benefitScroll.scrollLeft = 0;
      }

      gsap.to('.benefit__body ', {
         duration: 5,
         scrollTrigger: {
            trigger: '.benefit__body',
            start: '100% 100%',
            end: '0% 0%',
            onEnter: () => { if (scrollElement) scrollElement() },
            onLeaveBack: () => { if (scrollToBeginning) scrollToBeginning() },
            // scrub: true,
            // markers: {
            //    startColor: "red",
            //    endColor: "green",
            //    fontSize: "18px",
            //    fontWeight: "bold",
            //    indent: 20
            // }
         }
      })
   }

   // прокрутка по якорям
   document.body.addEventListener('click', (event) => {
      if (event.target.closest('[href^="#"]')) {
         event.preventDefault();
         let getName = event.target.closest('[href^="#"]').getAttribute('href');
         closeHeaderMenu();
         gsap.to(window, { scrollTo: getName, ease: "power2" })
      }
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
      if (smoother) smoother.paused(true);
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



// инициализация слайдеров
class AnimateBackground {
   constructor(elementName, duration) {
      this.duration = duration || 1;
      this.background = document.querySelector(elementName);
      (() => { this.background.style.transitionDuration = this.duration + "s" })()
   }

   backgroundMove = (value) => {
      this.background.style.transform = `translateX(${value}px)`;
      setTimeout(() => { this.background.style.transform = `translateX(0)` }, this.duration * 1000)
   }
}

if (document.querySelector('.services-section__swiper')) {
   const swiper = new Swiper('.services-section__swiper', {
      keyboard: {
         enabled: true,
         onlyInViewport: true,
      },
      spaceBetween: 8,
      speed: 300,
      slidesPerView: 1.08,
      navigation: {
         nextEl: ".services-section__swiper-button-next",
         prevEl: ".services-section__swiper-button-prev",
      },
      pagination: {
         el: '.services-section__pagination',
         type: 'fraction',
      },
      breakpoints: {
         1024: {
            slidesPerView: 3,
         }
      },
   });
}

if (document.querySelector('.product-card__top-swiper')) {
   const swiper = new Swiper('.product-card__top-swiper', {
      keyboard: {
         enabled: true,
         onlyInViewport: true,
      },
      spaceBetween: 10,
      speed: 300,
      slidesPerView: 1,
      grabCursor: true,
      breakpoints: {
         1024: {
            pagination: {
               type: 'fraction',
            },
         },
      },
      navigation: {
         nextEl: ".product-card__top-swiper-button-next",
         prevEl: ".product-card__top-swiper-button-prev",
      },
      pagination: {
         el: '.product-card__top-pagination',
         type: 'bullets',
         clickable: true,
      },
   });
}

if (document.querySelector('.block-swiper__swiper')) {
   const list = document.querySelectorAll('.block-swiper__swiper');
   list.forEach((element) => { addSwiper(element) });
   function addSwiper(element) {
      const blockSwiper = element.closest('.block-swiper');
      const quantity = Number(blockSwiper.dataset.quantity);
      const swiper = new Swiper(element, {
         allowTouchMove: true,
         spaceBetween: 8,
         speed: 300,
         slidesPerView: quantity > 1 ? 1.3 : 1,
         navigation: {
            nextEl: element.parentElement.querySelector('.block-swiper__swiper-button-next'),
            prevEl: element.parentElement.querySelector('.block-swiper__swiper-button-prev')
         },
         pagination: {
            el: element.parentElement.querySelector('.block-swiper__pagination'),
            type: 'bullets',
         },
         breakpoints: {
            768: {
               slidesPerView: quantity > 1 ? 2 : quantity,
            },
            1024: {
               slidesPerView: quantity > 2 ? 3 : quantity,
               pagination: {
                  type: 'fraction',
               },
            },
            1200: {
               slidesPerView: quantity > 3 ? 4 : quantity,
               pagination: {
                  type: 'fraction',
               },
            }
         },
      });
      if (element.querySelectorAll('.swiper-slide').length <= quantity) {
         blockSwiper.classList.add('swiper-nav-hidden');
      }
   }
}

if (document.querySelector('.custom-swiper__swiper')) {
   function setSpaceBetweenCustomSwiperSlide() {
      const CUSTOM_SWIPER = document.getElementById('custom-swiper');
      if (!CUSTOM_SWIPER) return false;
      return (document.body.offsetWidth - CUSTOM_SWIPER.offsetWidth) / 2;
   }

   const animate = new AnimateBackground('.custom-swiper__background');

   const swiper = new Swiper('.custom-swiper__swiper', {
      allowTouchMove: true,
      grabCursor: true,
      spaceBetween: setSpaceBetweenCustomSwiperSlide() || window.innerWidth / 2,
      speed: 2000,
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
         nextEl: ".custom-swiper__next",
         prevEl: ".custom-swiper__prev",
      },
      freeMode: false,
      on: {
         slideNextTransitionStart: function () {
            animate.backgroundMove(-50)
         },
         slidePrevTransitionStart: function () {
            animate.backgroundMove(50)
         },
      },
   });
}

if (document.querySelector('.custom-swiper-benefit__swiper')) {

   const animate = new AnimateBackground('.custom-swiper-benefit__background');
   const benefitSwiper = document.querySelector('.custom-swiper-benefit__swiper');
   const quantitySlide = benefitSwiper.querySelectorAll('.swiper-slide');
   const thumbList = document.querySelector('.custom-swiper-benefit__swiper-thumb-list');
   for (let i = 1; i < quantitySlide.length; i++) {
      const thumbLi = thumbList.querySelector('li').cloneNode(true);
      thumbList.append(thumbLi)
   }

   const swiper_tumb = new Swiper('.custom-swiper-benefit__swiper-thumb', {
      allowTouchMove: true,
      spaceBetween: 8,
      speed: 2000,
      slidesPerView: 3.5,
      grabCursor: true,
   });

   const swiper = new Swiper('.custom-swiper-benefit__swiper', {
      keyboard: {
         enabled: true,
         onlyInViewport: true,
      },
      allowTouchMove: true,
      loop: true,
      spaceBetween: 100,
      speed: 2000,
      slidesPerView: 1,
      grabCursor: true,
      thumbs: {
         swiper: swiper_tumb,
      },
      on: {
         slideNextTransitionStart: function () {
            animate.backgroundMove(-50)
         },
         slidePrevTransitionStart: function () {
            animate.backgroundMove(50)
         },
      },
   });
}

/* пример инициализации слайдера */
// if (document.querySelector('.swiper')) {
//    const swiper = new Swiper('.swiper', {
//       keyboard: {
//          enabled: true,
//          onlyInViewport: true,
//       },
//       allowTouchMove: false,
//       loop: true,
//       spaceBetween: 10,
//       speed: 300,
//       slidesPerView: 2.5,
//       grabCursor: true,
//       initialSlide: 2,
//       centeredSlides: true,
//       breakpoints: {
//          1024: {
//             spaceBetween: 20,
//             slidesPerView: 3
//          },
//          768: {
//             slidesPerView: 2
//          }
//       },
//       navigation: {
//          nextEl: ".next",
//          prevEl: ".prev",
//       },
//       pagination: {
//          el: '.pagination__body',
//          type: 'bullets',
//          type: 'fraction',
//          clickable: true,
//       },
//       autoplay: {
//          delay: 2000,
//       },
//       virtual: {
//          enabled: true,
//       },
//    });
// }


/* создание и ликвидация состояния слайдера в зависимости от ширины вьюпорта */
// if (document.querySelector('.swiper')) {
//    let swiperState;
//    let swiper;
//    changeStateSlider();
//    window.addEventListener('resize', () => {
//       changeStateSlider();
//    })
//    function initswiper() {
//       swiper = new Swiper('.swiper', {
//          keyboard: {
//             enabled: true,
//             onlyInViewport: true,
//          },
//          allowTouchMove: true,
//          loop: false,
//          speed: 300,
//          slidesPerView: 1.3,
//          spaceBetween: 24,
//       });
//    }
//    function changeStateSlider() {
//       if (!MIN768.matches) {
//          if (!swiperState) {
//             swiperState = true;
//             initswiper();
//          }
//       } else {
//          if (swiperState) {
//             swiperState = false;
//             swiper.destroy(true, true);
//          }
//       }
//    }
// }




// js-tabs-body - тело вкладки, в открытом состоянии добавляется класс js-tabs-open.
// js-tabs-hover - работает hover на ПК, отключает клик на ПК, для touchscreen надо раставить js-tabs-click или js-tabs-toggle
// js-tabs-closing - вместе с js-tabs-bod закрыть вкладку при событии вне данной вкладки
// js-tabs-click - открыть при клике (зона клика)
// js-tabs-toggle - открыть или закрыть при клике (зона клика)
// js-tabs-shell - оболочка скрывающая js-tabs-inner
// js-tabs-inner - оболочка контента
// 
// 
//  работает в связке с определением touchscreen  (isPC)


class Tabs {
   constructor() {
      this.listClosingTabs = document.querySelectorAll('.js-tabs-closing');
      this.listHover = document.querySelectorAll('.js-tabs-hover');
      this.listTabsBody = document.querySelectorAll('.js-tabs-body');
   };
   init = () => {
      document.body.addEventListener('click', this.eventClick);
      if (isPC) document.body.addEventListener('mouseover', this.eventMouseOver)
      window.addEventListener('resize', this.resize);
   };
   eventMouseOver = (event) => {
      if (event.target.closest('.js-tabs-hover')) this.openTabs(event);
      this.closeAllHover(event);
   };
   eventClick = (event) => {
      if (isPC && event.target.closest('.js-tabs-hover')) return;
      this.closeAll(event);
      if (event.target.closest('.js-tabs-click')) this.openTabs(event);
      if (event.target.closest('.js-tabs-toggle')) this.toggleTabs(event);
   };
   openTabs = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (!body) return;
      body.classList.add('js-tabs-open');
      this.setHeight(body);
   };
   closeTabs = (body) => {
      body.classList.remove('js-tabs-open');
      this.clearHeight(body);
   };
   closeAll = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (this.listClosingTabs.length == 0 && body) return;
      this.listClosingTabs.forEach((e) => { if (e !== body) this.closeTabs(e); })
   };
   closeAllHover = (event) => {
      const body = event.target.closest('.js-tabs-hover');
      if (this.listHover.length == 0 && body) return;
      this.listHover.forEach((e) => { if (e !== body) this.closeTabs(e) })
   };
   setHeight = (body) => {
      const heightValue = body.querySelector('.js-tabs-inner').offsetHeight;
      body.querySelector('.js-tabs-shell').style.height = heightValue + "px";
   };
   clearHeight = (body) => { body.querySelector('.js-tabs-shell').style.height = "" }
   toggleTabs = (event) => {
      const body = event.target.closest('.js-tabs-body');
      if (body.classList.contains('js-tabs-open')) {
         this.closeTabs(body);
         return;
      }
      this.openTabs(event);
   };
   throttle = () => {
      let timer = null;
      return () => {
         if (timer) return;
         timer = setTimeout(() => {
            const unlocked = document.querySelectorAll('.js-tabs-open');
            unlocked.forEach((e) => { this.setHeight(e) })
            clearTimeout(timer);
            timer = null;
         }, 100)
      }
   };
   resize = this.throttle();
}
const tabs = new Tabs();
tabs.init();







class TabsSwitching {
   constructor(body__buttons, button, tab, execute) {
      this.name_button = button;
      this.body__buttons = document.querySelector(body__buttons);
      this.button = document.querySelectorAll(button);
      this.tab = document.querySelectorAll(tab);
      this.execute = execute;
   }
   init = () => {
      this.body__buttons.addEventListener('click', (event) => {
         if (event.target.closest(this.name_button)) {
            let n = event.target.closest(this.name_button).dataset.button;
            this.button.forEach((e) => { e.classList.toggle('active', e.dataset.button == n) });
            if (this.tab.length > 0) { this.tab.forEach((e) => { e.classList.toggle('active', e.dataset.tab == n) }) }
            if (this.execute) { this.execute(event) };
         }
      })
   }
}

if (document.querySelector('.documents-certificates')) {
   let tab = new TabsSwitching('.documents-certificates__tab-buttons', '.documents-certificates__tab-button', '.documents-certificates__tab-page');
   tab.init();
}
if (document.querySelector('.js-map-button')) {
   let tab = new TabsSwitching('.js-map-buttons', '.js-map-button', '.js-map-tab');
   tab.init();
}
if (document.querySelector('.js-form')) {
   let tab = new TabsSwitching('.js-form-tab-button', '.js-form-tab-button', '.js-form-tab');
   tab.init();
   const firstTab = document.querySelector('.js-form');
   const formTabs = firstTab.querySelectorAll('.js-form-tab')
   const inputs = formTabs[0].querySelectorAll('[required]');
   function back() {
      formTabs.forEach(e => e.classList.remove('active'))
      formTabs[0].classList.add('active');
   }
   inputs.forEach(e => e.addEventListener('invalid', back))
}



