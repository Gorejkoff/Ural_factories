
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

   // console.log("WebGL version:", engine.webGLVersion); // 1 или 2
   // console.log("WebGL API:", engine.version); // "webgl1" или "webgl2"
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


   // Добавление камеры
   let distance = 40;
   const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, distance, BABYLON.Vector3.Zero(), scene);

   // camera.minZ = 0.1;   // Ближняя плоскость отсечения
   // camera.maxZ = 1000;  // Дальняя плоскость отсечения
   // camera.collisionRetryCount = 1;
   // Включаем ортографический режим
   if (MIN768.matches) { camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA; };

   const updateRatio = throttle(() => {
      setTimeout(() => {
         updateOrthographicSize();
      }, 500)
   }, 500)

   const orthoSize = 12;
   function updateOrthographicSize() {
      if (camera.mode === BABYLON.Camera.ORTHOGRAPHIC_CAMERA) {
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
      }
      camera.getProjectionMatrix(true);
      engine.resize();
   }
   updateOrthographicSize();







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

   const URL = "http://localhost:3000/glb/";
   // const URL = "https://gorejkoff.github.io/Ural_factories/dist/glb/";
   const modelName = "model_radio.glb";
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
      transmitter = model._children[1];
      volumeElement = transmitter._children.filter((e) => { return e.name == "volume" });
      // console.log(volumeElement);
      frequency = transmitter._children.filter((e) => { return e.name == "frequency" });
      // let glass = transmitter._children.filter((e) => { return e.name == "glass" });
      // const front_frame = scene.getMeshByName("front frame");
      // const mesh_primitive0 = scene.getMeshByName("frame_primitive0");
      // Добавление света
      light_screen = scene.getLightByName('light_screen');
      light_side = scene.getLightByName('light_side');
      light_side.shadowEnabled = true;
   }

   // Inspector 
   // scene.debugLayer.show();
   let yVar;
   function rider() { yVar = 4.8 - (1440 / viewportX - 1) }
   rider()

   let circleStart = 0.5;
   let circlePath = 1 - circleStart;
   let valueStartY;

   function calcValueStartY() {
      valueStartY = 1.4 + (window.innerWidth - 1440) / (1920 - 1440) * (2.4 - 1.4)
   }
   calcValueStartY();

   function rodioAnimation() {
      if (MIN768.matches) {
         transmitter.position = new BABYLON.Vector3(
            yVar * ratioX * (1 - progressRadioAnimation),
            -1 * ratioY * (1 - progressRadioAnimation) + valueStartY,
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
   let resizeHeppening = false; // происходит resize

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
         if (transmitter && renderStrart || resizeHeppening) {
            if (resizeHeppening) {
               rider();
               calcValueStartY();
               updateRatio();
            }
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
   const resizeHeppeningFun = debounce(() => { resizeHeppening = false }, 3000)

   window.addEventListener('scroll', () => {
      scrollHeppening = true;
      scrollHeppeningFun();
   })


   window.addEventListener("resize", () => {
      // Обработка изменения размера окна
      resizeHeppening = true;
      resizeHeppeningFun();

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


