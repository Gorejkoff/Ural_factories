if (document.querySelector('.js-basket-count')) {
   document.body.addEventListener('click', (event) => {
      if (event.target.closest('.js-basket-dicrement')) {
         const input = event.target.closest('.js-basket-count').querySelector('.js-basket-value');
         input.value = Number(input.value) - 1;
         validationQuantityBasket(input);
      }
      if (event.target.closest('.js-basket-increment')) {
         const input = event.target.closest('.js-basket-count').querySelector('.js-basket-value');
         input.value = Number(input.value) + 1;
         validationQuantityBasket(input);
      }
   })

   // проверка количесва товара в корзине
   const QUANTITY_BASKET = document.querySelectorAll('.js-basket-value');
   QUANTITY_BASKET.forEach((e) => {
      e.addEventListener('change', () => validationQuantityBasket(e));
   })
   function validationQuantityBasket(e) {
      if (Number(e.max) && Number(e.max) < Number(e.value)) {
         e.value = Number(e.max);
         return;
      }
      if (Number(e.min) && Number(e.min) > Number(e.value)) {
         e.value = Number(e.min);
         return;
      }
   }
}