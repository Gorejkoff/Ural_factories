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
   light1.intensity = 1;
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
   BABYLON.SceneLoader.Append("https://gorejkoff.github.io/Ural_factories/dist/glb/", "transmitter-8.glb", scene, function (scene) {
      // BABYLON.SceneLoader.Append("../glb/", "radio-texture-1.glb", scene, function (scene) {
      // BABYLON.SceneLoader.Append("../glb/", "transmitter-8.glb", scene, function (scene) {
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
      // console.log(cylinder, 'cylinder')

      empty = model._children[1];
      // console.log(empty, "empty");

      // antenna = empty._children.filter((e) => { return e.name == "antenna" });
      // console.log(antenna[0], 'antenna');

      volumeElement = empty._children.filter((e) => { return e.name == "volume" });
      // console.log(volumeElement[0], 'volumeElement');

      frequency = empty._children.filter((e) => { return e.name == "Frequency" });
      // console.log(frequency[0], 'frequency');


      // spotLight.parent = empty;
      // spotLight_1.parent = empty;


      // let front_frame = empty._children.filter((e) => { return e.name == "front frame" });
      // console.log(front_frame[0], 'front_frame');

      let back_cover = scene.getMeshByName("back cover");
      // console.log(back_cover[0], 'back_cover');

      let holder = scene.getMeshByName("holder");
      // console.log(holder[0], 'holder');

      // let glass = empty._children.filter((e) => { return e.name == "glass" });
      // console.log(glass[0], 'glass');

      // let black_glass = empty._children.filter((e) => { return e.name == "black glass" });
      // console.log(black_glass[0], 'black glass');

      // let black_glass_primitive0 = black_glass[0]._children.filter((e) => { return e.name == "black glass_primitive0" });
      // console.log(black_glass_primitive0[0], 'black glass_primitive0');

      // let black_glass_primitive1 = black_glass[0]._children.filter((e) => { return e.name == "black glass_primitive1" });
      // console.log(black_glass_primitive1[0], 'black glass_primitive1');

      // spotLight.excludedMeshes.push(black_glass_primitive0[0]);
      // spotLight.excludedMeshes.push(black_glass_primitive1[0]);
      // spotLight.excludedMeshes.push(glass[0]);

      // let frame = empty._children.filter((e) => { return e.name == "frame" });
      // console.log(frame[0], 'frame');
      // let frame_primitive0 = frame[0]._children.filter((e) => { return e.name == "frame_primitive0" });
      // console.log(frame_primitive0[0], 'frame_primitive0');


      const mesh_primitive0 = scene.getMeshByName("frame_primitive0");
      console.log(mesh_primitive0, " - mash frame_primitive0");




      function addTexture() {
         // *******************************************************************************************************
         // Создаём новый материал
         const new_material = new BABYLON.StandardMaterial("custom_mat", scene);

         // Загружаем текстуру
         const new_texture = new BABYLON.Texture("../textures/mud.png", scene); // 🚨 Укажите правильный путь!
         // Проверка ошибок загрузки текстуры
         new_texture.onLoadObservable.add(() => {
            console.log("Текстура успешно загружена!");
         });
         // new_texture.onErrorObservable.add(() => {
         //    console.error("Ошибка загрузки текстуры!");
         // });

         // new_material.diffuseTexture = new_texture;

         // ********************************************************************************************************
         // PBR texture
         // Основные текстуры
         const pbr = new BABYLON.PBRMaterial("pbr", scene);
         pbr.albedoTexture = new BABYLON.Texture("../textures/columned-lava-rock-bl/columned-lava-rock_albedo.png", scene); // Albedo
         pbr.normalTexture = new BABYLON.Texture("../textures/columned-lava-rock-bl/columned-lava-rock_normal-ogl.png", scene);    // Normal Map
         pbr.metallicTexture = new BABYLON.Texture("../textures/columned-lava-rock-bl/columned-lava-rock_metallic.png", scene); // Metallic
         pbr.roughnessTexture = new BABYLON.Texture("../textures/columned-lava-rock-bl/columned-lava-rock_roughness.png", scene); // Roughness
         pbr.emissiveTexture = new BABYLON.Texture("../textures/columned-lava-rock-bl/columned-lava-rock_emissive.png", scene)
         pbr.ambientTexture = new BABYLON.Texture("../textures/columned-lava-rock-bl/columned-lava-rock_ao.png", scene); // имитирует мягкие тени в углах и складках 3D-модели, добавляя реалистичность без увеличения количества источников света
         // pbr.ambientTextureStrength = 2.0; // Усиливаем эффект
         pbr.heightTexture = new BABYLON.Texture("../textures/columned-lava-rock-bl/columned-lava-rock_height.png", scene);
         pbr.useParallax = true; // Включить параллакс
         pbr.useParallaxOcclusion = true; // Более точный эффект
         pbr.parallaxScaleBias = 0.1; // Сила эффекта (0.01–0.1)

         pbr.albedoTexture.uScale = 1; // Горизонтальный масштаб
         pbr.albedoTexture.vScale = 1; // Вертикальный масштаб

         pbr.metallic = 1.0;       // Полная металличность
         pbr.roughness = 0.3;      // Гладкая поверхность
         // pbr.subSurface.isRefractionEnabled = true; // Прозрачность (для стекла/воды)
         // Применяем материал к мешу

         // mesh_primitive0.material = pbr;
         back_cover.material = pbr;
         holder.material = pbr;
         // Настраиваем материал (опционально)

         // new_material.specularColor = new BABYLON.Color3(0.2, 0.2, 0.2); // Можно настроить блики
         // new_material.emissiveColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Лёгкое свечение
         // new_material.ambientColor = new BABYLON.Color3(0.1, 0.1, 0.1); // Затемнение. Серый оттенок (0-1)

         // Применяем материал к мешу
         // mesh_primitive0.material = new_material;
         // ********************************************************************************************************
      }


      function testTexture() {
         if (mesh_primitive0 && mesh_primitive0.material) {
            const material = mesh_primitive0.material;
            console.log(material, " - material");

            // Проверка диффузной текстуры(albedo)
            if (material.diffuseTexture) {
               console.log("Diffuse Texture:", material.diffuseTexture.name);
            }

            // Проверка нормал-мапа
            if (material.bumpTexture) {
               console.log("Bump Texture:", material.bumpTexture.name);
            }

            // Проверка других текстур (в зависимости от типа материала)
            if (material instanceof BABYLON.PBRMaterial) {
               if (material.albedoTexture) {
                  console.log("Albedo Texture:", material.albedoTexture.name);
               }
               // if (material.normalTexture) {
               //    console.log("Normal Texture:", material.normalTexture.name);
               // }
               if (material.metallicRoughnessTexture) {
                  console.log("MetallicRoughness Texture:", material.metallicRoughnessTexture.name);
               }
            }
         }
      }


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

   //!!! Inspector 
   // scene.debugLayer.show();


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

