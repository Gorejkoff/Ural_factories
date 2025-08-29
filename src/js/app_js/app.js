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

