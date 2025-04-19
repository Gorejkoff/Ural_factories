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
addHeightVariable();


// ** ======================= RESIZE ======================  ** //
window.addEventListener('resize', () => {
   //  addHeightVariable();
   closeHeaderMenu();
   setMenuEffectSize();
   setMarginCustomSwiper();
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
setMarginCustomSwiper();

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