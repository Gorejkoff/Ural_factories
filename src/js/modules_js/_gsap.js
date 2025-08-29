

var smoother;

function textWpapSpan(element) {
   const listSpan = element.querySelectorAll('span');
   listSpan.forEach(element => {
      const words = element.innerHTML.trim().split(' ');
      const wordWrap = words.map(item => { return item.split('').map(e => { return `<span class="letter">${e}</span>` }).join('') })
      element.innerHTML = `<span class="word">${wordWrap.join('</span>&#32;<span class="word"> ')}</span> `
      element.after(' ');
   })
}

function addTextAnimatePin(name) {
   textWpapSpan(element)
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: `${name}`,
         start: "0% 0%",
         end: `100% 0%`,
         pin: true,
         scrub: true,
      }
   })
   const text = document.querySelectorAll(`${name} .letter`);
   text && text.forEach((e) => {
      tl.to(e, 1, { opacity: 1 })
   })
}

function addTextAnimate(element) {
   textWpapSpan(element)
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: element,
         start: "0% 90%",
         end: `0% 5%`,
         scrub: true,
      }
   })
   const text = element.querySelectorAll(`.letter`);
   text && text.forEach((e) => {
      tl.to(e, { opacity: 1 })
   })
}


window.addEventListener('load', function (event) {
   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
   smoother = ScrollSmoother.create({
      smooth: 1,
      // effects: true
   });

   if (document.querySelector('main')) {
      const paddingHeader = document.createElement('div');
      paddingHeader.classList.add('padding-header')
      paddingHeader.style.height = 'var(--height-header)';
      const main = document.querySelector('main');
      const parentHeader = HEADER.parentElement;
      gsap.to(main, {
         scrollTrigger: {
            trigger: main,
            start: '0% 0%',
            end: '0% 0%',
            onEnter: () => { moveHeader() },
            onLeaveBack: () => { moveHeaderBack() },
         }
      })

      function moveHeader() {
         document.body.prepend(HEADER);
         parentHeader.prepend(paddingHeader)
      }
      function moveHeaderBack() {
         parentHeader.prepend(HEADER);
         document.querySelector('.padding-header').remove();
      }

   }

   if (document.getElementById('container3D')) {
      gsap.to('#container3D', {
         scrollTrigger: {
            trigger: '.scroll-animation-trigger',
            start: '0% 0%',
            end: '100% 100%',
            pin: true,
            scrub: true,
            onUpdate: (self) => {
               progressRadioAnimation = self.progress.toFixed(4);
            },
         }
      })
   }

   const LIST_DESCRIPTION_BLOCK = this.document.querySelectorAll('.description__block');

   LIST_DESCRIPTION_BLOCK.forEach((element, index) => {
      gsap.to(element, {
         scrollTrigger: {
            trigger: element,
            start: "top 60%",
            toggleClass: { targets: element, className: "text-animate-grow-show" }
         }
      }
      )
   })


   const ANIMATE_PIN = document.querySelectorAll('.js-text-animate-pin');
   ANIMATE_PIN.forEach(element => { addTextAnimate(element) });

   const ANIMATE_FREE = document.querySelectorAll('.js-text-animate-free');
   ANIMATE_FREE.forEach(element => { addTextAnimate(element) });

   let tl_about;
   if (document.querySelector('.about-section__body')) {
      tl_about = gsap.timeline({
         scrollTrigger: {
            trigger: '.about-section__body',
            start: '0% 50%',
            end: '0% 50%',
         }
      });

      const ABOUT_ANIMATION = this.document.querySelectorAll('.js-about-animation');
      if (ABOUT_ANIMATION.length === 0) return;
      ABOUT_ANIMATION.forEach((e) => {
         tl_about.to(e, { opacity: 1, duration: 0.5 })
      });
   };


   if (document.querySelector('.benefit__body') && MIN768.matches) {
      gsap.to('.benefit__progress', {
         "--progress": "100%",
         duration: 5,
         scrollTrigger: {
            trigger: '.benefit__body',
            start: '80% 100%',
            end: '40% 0%',
            scrub: MIN768.matches ? true : false,
            // markers: {
            //    startColor: "red",
            //    endColor: "green",
            //    fontSize: "18px",
            //    fontWeight: "bold",
            //    indent: 20
            // }
         }
      })
   }

   if (document.querySelector('.benefit__block') && !MIN768.matches) {

      const paddingX = getComputedStyle(document.querySelector('.benefit__container')).paddingLeft;
      const scrollWidth = document.querySelector('.benefit__body').offsetWidth - window.innerWidth + parseInt(paddingX) * 2;
      const benefitScroll = document.querySelector('.benefit__scroll');
      let scrollValue = 0;
      const benefitProgress = document.querySelector('.benefit__progress');

      benefitScroll.addEventListener('scroll', (event) => {
         benefitProgress.style.setProperty('--progress', benefitScroll.scrollLeft / scrollWidth * 100 + "%")
      })

      function scrollElement() {
         scrollValue += 2;
         benefitScroll.scrollLeft = scrollValue;
         if (scrollValue < scrollWidth) {
            requestAnimationFrame(scrollElement)
         }
      }

      function scrollToBeginning() {
         scrollValue = 0;
         benefitScroll.scrollLeft = 0;
      }

      gsap.to('.benefit__body ', {
         duration: 5,
         scrollTrigger: {
            trigger: '.benefit__body',
            start: '100% 100%',
            end: '0% 0%',
            onEnter: () => { if (scrollElement) scrollElement() },
            onLeaveBack: () => { if (scrollToBeginning) scrollToBeginning() },
            // scrub: true,
            // markers: {
            //    startColor: "red",
            //    endColor: "green",
            //    fontSize: "18px",
            //    fontWeight: "bold",
            //    indent: 20
            // }
         }
      })
   }

   // прокрутка по якорям
   document.body.addEventListener('click', (event) => {
      if (event.target.closest('[href^="#"]')) {
         event.preventDefault();
         let getName = event.target.closest('[href^="#"]').getAttribute('href');
         closeHeaderMenu();
         gsap.to(window, { scrollTo: getName, ease: "power2" })
      }
   })
})