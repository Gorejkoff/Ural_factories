window.addEventListener('DOMContentLoaded', function () {
   let model;
   let empty;
   let cylinder;
   let viewportX;
   let viewportY;
   let canvasSiseX;
   let canvasSiseY;
   function addSizeViewport() {
      canvasSiseX = window.innerWidth;
      canvasSiseY = window.innerHeight + 100;
      viewportX = Math.min(window.innerWidth, 1440);
      viewportY = window.innerHeight;
   }
   addSizeViewport();
   let ratioX = viewportX / 1000;
   let ratioY = viewportY / 1000;


   // Инициализация движка
   const canvas = document.getElementById("container3D");
   const engine = new BABYLON.Engine(canvas, true);

   // Создание сцены

   const scene = new BABYLON.Scene(engine);
   scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
   // Добавление камеры
   const camera = new BABYLON.ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2, 20, BABYLON.Vector3.Zero(), scene);
   camera.attachControl(canvas, true);

   // Добавление света
   const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 1), scene);

   // Загрузка модели
   BABYLON.SceneLoader.Append("../glb/", "transmitter-2.glb", scene, function (scene) {
      // console.log("Модель загружена!");
      scene.animationGroups.forEach(animationGroup => {
         animationGroup.stop(); // Остановка анимации
         animationGroup.dispose(); // Удаление анимации из памяти
      });
      // console.log("Все анимации удалены!");
      // список имен
      // const models = scene.meshes;
      // console.log(models);
      // models.forEach(mesh => console.log(mesh.name));

      model = scene.getMeshByName("__root__");

      model.position = new BABYLON.Vector3(0, -3, 0);

      cylinder = model._children[0];
      // const empty = model.getChildMeshes().find((mesh) => { mesh.name === "Empty" });
      empty = model._children[1];
      // console.log(empty);

      empty.rotation = new BABYLON.Vector3(0, 0, 0)
      empty.position = new BABYLON.Vector3(10, 0, 0)

      // console.log(empty);

   });

   let k = 0.4;
   let path = 1 - k;
   function rodioAnimation() {
      empty.position = new BABYLON.Vector3(
         8 * ratioX * (1 - progressRadioAnimation),
         -1 * ratioY * (1 - progressRadioAnimation) - 1,
         0)
      empty.rotation = new BABYLON.Vector3(0, (Math.PI * 2) * -progressRadioAnimation, 0);
      if (progressRadioAnimation > k) {
         let value = (progressRadioAnimation - k) / path;
         cylinder.scaling.x = value;
         cylinder.scaling.y = value;
         cylinder.scaling.z = value;
      } else {
         cylinder.scaling.x = 0;
         cylinder.scaling.y = 0
         cylinder.scaling.z = 0
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
});

