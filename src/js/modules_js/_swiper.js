// инициализация слайдеров
class AnimateBackground {
   constructor(elementName, duration) {
      this.duration = duration || 1;
      this.background = document.querySelector(elementName);
      (() => { this.background.style.transitionDuration = this.duration + "s" })()
   }

   backgroundMove = (value) => {
      this.background.style.transform = `translateX(${value}px)`;
      setTimeout(() => { this.background.style.transform = `translateX(0)` }, this.duration * 1000)
   }
}

if (document.querySelector('.services-section__swiper')) {
   const swiper = new Swiper('.services-section__swiper', {
      keyboard: {
         enabled: true,
         onlyInViewport: true,
      },
      spaceBetween: 8,
      speed: 300,
      slidesPerView: 1.08,
      navigation: {
         nextEl: ".services-section__swiper-button-next",
         prevEl: ".services-section__swiper-button-prev",
      },
      pagination: {
         el: '.services-section__pagination',
         type: 'fraction',
      },
      breakpoints: {
         1024: {
            slidesPerView: 3,
         }
      },
   });
}

if (document.querySelector('.product-card__top-swiper')) {
   const swiper = new Swiper('.product-card__top-swiper', {
      keyboard: {
         enabled: true,
         onlyInViewport: true,
      },
      spaceBetween: 10,
      speed: 300,
      slidesPerView: 1,
      grabCursor: true,
      breakpoints: {
         1024: {
            pagination: {
               type: 'fraction',
            },
         },
      },
      navigation: {
         nextEl: ".product-card__top-swiper-button-next",
         prevEl: ".product-card__top-swiper-button-prev",
      },
      pagination: {
         el: '.product-card__top-pagination',
         type: 'bullets',
         clickable: true,
      },
   });
}

if (document.querySelector('.block-swiper__swiper')) {
   const list = document.querySelectorAll('.block-swiper__swiper');
   list.forEach((element) => { addSwiper(element) });
   function addSwiper(element) {
      const blockSwiper = element.closest('.block-swiper');
      const quantity = Number(blockSwiper.dataset.quantity);
      const swiper = new Swiper(element, {
         allowTouchMove: true,
         spaceBetween: 8,
         speed: 300,
         slidesPerView: quantity > 1 ? 1.3 : 1,
         navigation: {
            nextEl: element.parentElement.querySelector('.block-swiper__swiper-button-next'),
            prevEl: element.parentElement.querySelector('.block-swiper__swiper-button-prev')
         },
         pagination: {
            el: element.parentElement.querySelector('.block-swiper__pagination'),
            type: 'bullets',
         },
         breakpoints: {
            768: {
               slidesPerView: quantity > 1 ? 2 : quantity,
            },
            1024: {
               slidesPerView: quantity > 2 ? 3 : quantity,
               pagination: {
                  type: 'fraction',
               },
            },
            1200: {
               slidesPerView: quantity > 3 ? 4 : quantity,
               pagination: {
                  type: 'fraction',
               },
            }
         },
      });
      if (element.querySelectorAll('.swiper-slide').length <= quantity) {
         blockSwiper.classList.add('swiper-nav-hidden');
      }
   }
}

if (document.querySelector('.custom-swiper__swiper')) {
   function setSpaceBetweenCustomSwiperSlide() {
      const CUSTOM_SWIPER = document.getElementById('custom-swiper');
      if (!CUSTOM_SWIPER) return false;
      return (document.body.offsetWidth - CUSTOM_SWIPER.offsetWidth) / 2;
   }

   const animate = new AnimateBackground('.custom-swiper__background');

   const swiper = new Swiper('.custom-swiper__swiper', {
      allowTouchMove: true,
      grabCursor: true,
      spaceBetween: setSpaceBetweenCustomSwiperSlide() || window.innerWidth / 2,
      speed: 2000,
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
         nextEl: ".custom-swiper__next",
         prevEl: ".custom-swiper__prev",
      },
      freeMode: false,
      on: {
         slideNextTransitionStart: function () {
            animate.backgroundMove(-50)
         },
         slidePrevTransitionStart: function () {
            animate.backgroundMove(50)
         },
      },
   });
}

if (document.querySelector('.custom-swiper-benefit__swiper')) {

   const animate = new AnimateBackground('.custom-swiper-benefit__background');
   const benefitSwiper = document.querySelector('.custom-swiper-benefit__swiper');
   const quantitySlide = benefitSwiper.querySelectorAll('.swiper-slide');
   const thumbList = document.querySelector('.custom-swiper-benefit__swiper-thumb-list');
   for (let i = 1; i < quantitySlide.length; i++) {
      const thumbLi = thumbList.querySelector('li').cloneNode(true);
      thumbList.append(thumbLi)
   }

   const swiper_tumb = new Swiper('.custom-swiper-benefit__swiper-thumb', {
      allowTouchMove: true,
      spaceBetween: 8,
      speed: 2000,
      slidesPerView: 3.5,
      grabCursor: true,
   });

   const swiper = new Swiper('.custom-swiper-benefit__swiper', {
      keyboard: {
         enabled: true,
         onlyInViewport: true,
      },
      allowTouchMove: true,
      loop: true,
      spaceBetween: 100,
      speed: 2000,
      slidesPerView: 1,
      grabCursor: true,
      thumbs: {
         swiper: swiper_tumb,
      },
      on: {
         slideNextTransitionStart: function () {
            animate.backgroundMove(-50)
         },
         slidePrevTransitionStart: function () {
            animate.backgroundMove(50)
         },
      },
   });
}

/* пример инициализации слайдера */
// if (document.querySelector('.swiper')) {
//    const swiper = new Swiper('.swiper', {
//       keyboard: {
//          enabled: true,
//          onlyInViewport: true,
//       },
//       allowTouchMove: false,
//       loop: true,
//       spaceBetween: 10,
//       speed: 300,
//       slidesPerView: 2.5,
//       grabCursor: true,
//       initialSlide: 2,
//       centeredSlides: true,
//       breakpoints: {
//          1024: {
//             spaceBetween: 20,
//             slidesPerView: 3
//          },
//          768: {
//             slidesPerView: 2
//          }
//       },
//       navigation: {
//          nextEl: ".next",
//          prevEl: ".prev",
//       },
//       pagination: {
//          el: '.pagination__body',
//          type: 'bullets',
//          type: 'fraction',
//          clickable: true,
//       },
//       autoplay: {
//          delay: 2000,
//       },
//       virtual: {
//          enabled: true,
//       },
//    });
// }


/* создание и ликвидация состояния слайдера в зависимости от ширины вьюпорта */
// if (document.querySelector('.swiper')) {
//    let swiperState;
//    let swiper;
//    changeStateSlider();
//    window.addEventListener('resize', () => {
//       changeStateSlider();
//    })
//    function initswiper() {
//       swiper = new Swiper('.swiper', {
//          keyboard: {
//             enabled: true,
//             onlyInViewport: true,
//          },
//          allowTouchMove: true,
//          loop: false,
//          speed: 300,
//          slidesPerView: 1.3,
//          spaceBetween: 24,
//       });
//    }
//    function changeStateSlider() {
//       if (!MIN768.matches) {
//          if (!swiperState) {
//             swiperState = true;
//             initswiper();
//          }
//       } else {
//          if (swiperState) {
//             swiperState = false;
//             swiper.destroy(true, true);
//          }
//       }
//    }
// }



