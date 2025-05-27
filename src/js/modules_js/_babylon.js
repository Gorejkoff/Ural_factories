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
   camera.setTarget(BABYLON.Vector3.Zero());
   // Добавление света 
   const light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(-1, 1, 5), scene);
   light1.intensity = 0.2;
   light1.diffuse = new BABYLON.Color3(1, 1, 1);
   const light2 = new BABYLON.HemisphericLight("light2", new BABYLON.Vector3(0, 0, -5), scene);
   light2.intensity = 0.1;
   light2.diffuse = new BABYLON.Color3(1, 1, 1);
   // Загрузка модели
   BABYLON.SceneLoader.Append("https://gorejkoff.github.io/Ural_factories/dist/glb/", "edit-7.glb", scene, function (scene) {
      // подгрузка модели локально для разработки
      // BABYLON.SceneLoader.Append("../glb/", "radio-texture-1.glb", scene, function (scene) {
      // BABYLON.SceneLoader.Append("../glb/", "edit-7.glb", scene, function (scene) {
      // scene.animationGroups.forEach(animationGroup => {
      //    animationGroup.stop();
      //    animationGroup.dispose();
      // });
      model = scene.getMeshByName("__root__");
      if (!model) {
         console.error("Не найден __root__!");
         return;
      }
      // console.log(model, "model");
      if (MIN768.matches) {
         model.position = new BABYLON.Vector3(0, -3, 0);
      }
      cylinder = model._children[0];
      // console.log(cylinder, 'cylinder')
      transmitter = model._children[1];
      // console.log(transmitter, "transmitter");
      volumeElement = transmitter._children.filter((e) => { return e.name == "volume" });
      // console.log(volumeElement[0], 'volumeElement');
      frequency = transmitter._children.filter((e) => { return e.name == "frequency" });
      // console.log(frequency[0], 'frequency');

      let glass = transmitter._children.filter((e) => { return e.name == "glass" });
      // console.log(glass[0], 'glass');

      // let frame = transmitter._children.filter((e) => { return e.name == "frame" });
      const front_frame = scene.getMeshByName("front frame");
      // console.log(front_frame, 'front frame');


      const mesh_primitive0 = scene.getMeshByName("frame_primitive0");
      // console.log(mesh_primitive0, " - mash frame_primitive0");

      // Добавление света 
      light_screen = scene.getLightByName("light_screen");
      // light_screen.intensity = 8;
      // light_screen.position.y = -3.5;
      // light_screen.range = 5;
      // light_screen.diffuse = new BABYLON.Color3(1, 0.065, 0);
      // console.log(light_screen, " - light_screen");

      light_side = scene.getLightByName("light_side");
      // light_side.intensity = 1500;
      light_side.shadowEnabled = true;
      // console.log(light_side, " - light_side");

      const shadowGenerator = new BABYLON.ShadowGenerator(1024, light_side);
      shadowGenerator.useBlurExponentialShadowMap = true; // Для мягких теней
      shadowGenerator.blurKernel = 32;

      // Добавляем объекты, которые должны отбрасывать тени
      shadowGenerator.addShadowCaster(mesh_primitive0, front_frame);
      // свет игнорирует указанные модели
      light_side.excludedMeshes.push(front_frame, glass[0]);
   });

   // Inspector 
   // scene.debugLayer.show();

   let circleStart = 0.5;
   let circlePath = 1 - circleStart;
   function rodioAnimation() {

      if (MIN768.matches) {
         transmitter.position = new BABYLON.Vector3(
            8 * ratioX * (1 - progressRadioAnimation),
            -1 * ratioY * (1 - progressRadioAnimation) - 1,
            0);
         light_side.position = new BABYLON.Vector3(
            8 * ratioX * (1 - progressRadioAnimation),
            -1 * ratioY * (1 - progressRadioAnimation) - 1,
            0);
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
   engine.runRenderLoop(function () {
      if (transmitter) { rodioAnimation() }
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

