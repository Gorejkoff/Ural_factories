
window.addEventListener('DOMContentLoaded', function () {
   const canvas = document.getElementById("container3D");
   if (!canvas) {
      console.log("Canvas not found!");
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
   const engine = new BABYLON.Engine(canvas, true);
   // console.log("WebGL version:", engine.webGLVersion); // 1 или 2
   // console.log("WebGL API:", engine.version); // "webgl1" или "webgl2"
   // if (engine.webGLVersion < 2) {
   //    console.warn("WebGL 2.0 не поддерживается, некоторые эффекты могут не работать");
   // }
   // Создание сцены
   const scene = new BABYLON.Scene(engine);
   scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
   // Добавление камеры
   let distance = 40;
   const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, distance, BABYLON.Vector3.Zero(), scene);

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
   const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-1, 1, 5), scene);
   light1.intensity = 0.4;
   light1.diffuse = new BABYLON.Color3(1, 1, 1);
   const light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0, -5), scene);
   light2.intensity = 0.5;
   light2.diffuse = new BABYLON.Color3(1, 1, 1);
   const backLight = new BABYLON.DirectionalLight("backLight", new BABYLON.Vector3(0, 0, -1), scene);
   backLight.intensity = 0.9;

   const URL = "https://gorejkoff.github.io/Ural_factories/dist/glb/";
   const modelName = "edit-7.glb";





   //! ===================================================================================



   async function cacheModel(modelUrl) {
      try {
         const cache = await caches.open('3d-models-v1');
         const response = await fetch(modelUrl);

         if (response.ok) {
            await cache.put(modelUrl, response);
            console.log('3D модель закеширована!');
         }
      } catch (error) {
         console.error('Ошибка кеширования модели:', error);
      }
   }

   // const searchModel = await cache.match(modelUrl);
   //          console.log(searchModel);
   //          if (searchModel) {
   //             const blob = await searchModel.blob();
   //             const size = blob.size;
   //             console.log(size);


   //          }
   async function loadModel() {
      if (!('caches' in window)) {
         console.error('Cache API не поддерживается');
         downloadingFromServer();
         return;
      }

      const cache = await caches.open('3d-models-v1');
      const searchModel = await cache.match(URL + modelName);
      if (searchModel) {
         console.log("есть модель к кэше");
         // Получаем данные как Blob
         const modelBlob = await searchModel.blob();
         // Создаем URL для Blob
         const blobUrl = window.URL.createObjectURL(modelBlob);
         console.log(blobUrl);
         downloadingFromCache(blobUrl);
         // Не забудьте освободить URL после загрузки, для предотвращения утечки памяти
         // URL.revokeObjectURL(blobUrl);
      }
   }

   loadModel()

   function downloadingFromServer() {
      BABYLON.SceneLoader.Append(URL, modelName, scene, actionModel);
   }
   async function downloadingFromCache(blobUrl) {
      console.log('Загрузка из cache');
      BABYLON.SceneLoader.Append("", blobUrl, scene, function (meshes) {
         console.log("Модель загружена успешно");
         actionModel(meshes);
      }, null, null, ".glb");
   }

   // Использование
   // cacheModel(URL + modelName);


   //! ===================================================================================
   // Загрузка модели



   // подгрузка модели локально для разработки

   // BABYLON.SceneLoader.Append("../glb/", "edit-7.glb", scene, actionModel);
   // scene.animationGroups.forEach(animationGroup => {
   //    animationGroup.stop();
   //    animationGroup.dispose();
   // });

   async function actionModel() {
      model = scene.getMeshByName("__root__");



      if (!model) {
         console.error("Не найден __root__!");
         return;
      }
      if (MIN768.matches) {
         model.position = new BABYLON.Vector3(0, -3, 0);
         const scale = 1 + (window.innerWidth - 1440) / (1920 - 1440) * (0.8 - 1);
         model.scaling.x = scale;
         model.scaling.y = scale;
      }
      cylinder = model._children[0];
      cylinder.position.y = 5.3;
      backLight.includedOnlyMeshes = [cylinder]
      transmitter = model._children[1];
      volumeElement = transmitter._children.filter((e) => { return e.name == "volume" });
      frequency = transmitter._children.filter((e) => { return e.name == "frequency" });
      let glass = transmitter._children.filter((e) => { return e.name == "glass" });
      const front_frame = scene.getMeshByName("front frame");
      const mesh_primitive0 = scene.getMeshByName("frame_primitive0");
      // Добавление света
      light_screen = scene.getLightByName("light_screen");
      light_side = scene.getLightByName("light_side");
      light_side.shadowEnabled = true;
      const shadowGenerator = new BABYLON.ShadowGenerator(1024, light_side);
      shadowGenerator.useBlurExponentialShadowMap = true; // Для мягких теней
      shadowGenerator.blurKernel = 32;
      // Добавляем объекты, которые должны отбрасывать тени
      shadowGenerator.addShadowCaster(mesh_primitive0, front_frame);
      // свет игнорирует указанные модели
      light_side.excludedMeshes.push(front_frame, glass[0]);
   }


   // Inspector 
   // scene.debugLayer.show();

   let circleStart = 0.5;
   let circlePath = 1 - circleStart;
   function rodioAnimation() {


      if (MIN768.matches) {
         const valueStartY = 1.4 + (window.innerWidth - 1440) / (1920 - 1440) * (2.4 - 1.4)
         transmitter.position = new BABYLON.Vector3(
            4.5 * ratioX * (1 - progressRadioAnimation),
            -1 * ratioY * (1 - progressRadioAnimation) + valueStartY,
            0);
         light_side.position = new BABYLON.Vector3(
            4.5 * ratioX * (1 - progressRadioAnimation),
            -1 * ratioY * (1 - progressRadioAnimation) + 1,
            2);
      } else {
         model.position = new BABYLON.Vector3(progressRadioAnimation * -3, progressRadioAnimation * -2 + 2, 0)
      }
      transmitter.rotation = new BABYLON.Vector3(0, (Math.PI * 2) * -progressRadioAnimation, 0);
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
   let renderRun = true;
   let renderStrart = true;
   const renderStop = throttle(() => {
      renderRun = false;
      this.setTimeout(() => { renderStrart = false }, 2000);
   }, 1500)
   engine.runRenderLoop(function () {
      if (Number(progressRadioAnimation) !== 1) {
         renderRun = true;
      }
      if (Number(progressRadioAnimation) == 1 && renderRun) {
         renderStop();
      }
      if (transmitter && (renderRun || renderStrart)) {
         // console.log("render Babylon");
         rodioAnimation();
         scene.render();
      }
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


//! ==========================================================================================================================








