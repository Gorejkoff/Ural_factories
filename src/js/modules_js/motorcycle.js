// 1. Инициализация движка
const canvas = document.getElementById("container3D");
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);

// 2. Настройка камеры и света
const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 1.5, Math.PI / 2, 15, BABYLON.Vector3.Zero(), scene);
camera.attachControl(canvas, true);
new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

// 3. Загрузка модели с полной обработкой
BABYLON.SceneLoader.Append(
   "../glb/",
   "Covered-wagon.glb",
   scene,
   (loadedScene) => {
      try {
         // Проверка outline renderer
         if (!scene.outlineRenderer) {
            scene.outlineRenderer = new BABYLON.OutlineRenderer(scene);
         }

         // Поиск модели
         const model = scene.getMeshByName("__root__");
         if (!model) {
            throw new Error("Root mesh not found");
         }

         console.log("Model hierarchy:");
         model.getChildMeshes().forEach(m => {
            console.log(`- ${m.name} (${m.getClassName()})`);
         });

         // Проверка типа модели
         if (!(model instanceof BABYLON.AbstractMesh)) {
            throw new Error("Model is not a mesh");
         }

         // Настройка позиций
         model.position = new BABYLON.Vector3(0, -5, 0);

         // Поиск дочернего элемента
         const node3 = model.getChildMeshes().find(m => m.name === "node2");
         if (node3) {
            node3.position = new BABYLON.Vector3(0, 3, 0);
         }

         // Добавление контура
         // scene.outlineRenderer.addMesh(model, new BABYLON.Color3(1, 0, 0));
         console.log("Outline applied successfully");

      } catch (e) {
         console.error("Processing error:", e);
      }
   },
   undefined,
   (error) => {
      console.error("Load failed:", error);
      // Показать сообщение пользователю
      const errorDiv = document.createElement("div");
      errorDiv.style = "position:absolute; top:0; background:red; color:white; padding:20px;";
      errorDiv.innerHTML = `Model load failed: ${error.message}`;
      document.body.appendChild(errorDiv);
   }
);

// 4. Запуск рендера
engine.runRenderLoop(() => scene.render());