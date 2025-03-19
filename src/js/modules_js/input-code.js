// переход фокуса при вводе кода
const INPUTS_CODE = document.querySelectorAll('.enter__code input');
if (INPUTS_CODE.length > 0) {

   INPUTS_CODE.forEach((element, index) => {
      element.addEventListener('input', () => {
         if (element.value.length > 1) { element.value = element.value.slice(0, 1) }
         // if (element.value.length == 0) { cursorMovePrev(index) }
         if (element.value.length == 1) { cursorMoveNext(index) }
      })
   })
   INPUTS_CODE.forEach((element) => {
      element.addEventListener('paste', (event) => {
         paste(event.clipboardData.getData('text/plain'));
         INPUTS_CODE[INPUTS_CODE.length - 1].focus();
      })
   })

   INPUTS_CODE.forEach((element, index) => {
      element.addEventListener('keydown', (event) => {
         if (event.code == "Backspace" && element.value.length == 0) {
            cursorMovePrev(index);
            setTimeout(() => { element.selectionStart = 1 }, 0)
         };
         if (event.code == "ArrowLeft") {
            cursorMovePrev(index);
         };
         if (event.code == "ArrowRight") {
            cursorMoveNext(index);
         };
      })
   })

   function paste(val) {
      INPUTS_CODE.forEach((element, index) => { val[index] ? element.value = val[index] : element.value = "" })
   }
   function cursorMoveNext(index) {
      if (INPUTS_CODE.length > index + 1) {
         INPUTS_CODE[index + 1].focus();
         setTimeout(() => { INPUTS_CODE[index + 1].selectionStart = 0 }, 0)
      }
   }
   function cursorMovePrev(index) {
      if (INPUTS_CODE[index - 1]) {
         INPUTS_CODE[index - 1].focus();
      }

   }
}