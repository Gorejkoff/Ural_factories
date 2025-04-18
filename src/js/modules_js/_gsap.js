var smoother;

function textWpapSpan(elementName) {
   const listText = document.querySelectorAll(elementName);
   listText.forEach(element => {
      const listSpan = element.querySelectorAll('span');
      listSpan.forEach(element => {
         const words = element.innerHTML.trim().split(' ');
         const wordWrap = words.map(item => { return item.split('').map(e => { return `<span class="letter">${e}</span>` }).join('') })
         element.innerHTML = `<span class="word">${wordWrap.join('</span>&#32;<span class="word">')}</span>`
      })
   });
}
textWpapSpan(".js-text-animate")

function addTextAnimatePin(name) {
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

function addTextAnimate(name) {
   let tl = gsap.timeline({
      scrollTrigger: {
         trigger: `${name}`,
         start: "0% 90%",
         end: `0% 5%`,
         scrub: true,
      }
   })
   const text = document.querySelectorAll(`${name} .letter`);
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

   // document.body.addEventListener('click', (event) => {
   //    if (event.target.closest('[href^="#"]')) {
   //       event.preventDefault();
   //       let getName = event.target.closest('[href^="#"]').getAttribute('href');
   //       closeHeaderMenu();
   //       gsap.to(window, { scrollTo: getName, ease: "power2" })
   //    }
   // })


   // gsap.to('.scroll-animation', {
   //    scrollTrigger: {
   //       trigger: '.scroll-animation',

   //       start: '0% 0%',
   //       end: '100% 100%',

   // pin: true,
   // scrub: true,

   //       markers: {
   //          startColor: "red",
   //          endColor: "green",
   //          fontSize: "18px",
   //          fontWeight: "bold",
   //          indent: 20
   //       },
   //    }
   // })
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
      let durationValue = 0.7;
      let xValue = 400;
      if (index % 2 == 0) { xValue *= -1 };
      gsap.fromTo(element, {
         x: xValue,
         scale: 0,
         opacity: 0,
         duration: durationValue,
      },
         {
            x: 0,
            scale: 1,
            opacity: 1,
            duration: durationValue,
            scrollTrigger: {
               trigger: element,
               start: '0% 70%',
               end: '0% 70%',
               toggleActions: 'play none reverse none',
            }
         }
      )
   })

   if (document.querySelector('.about-section__title')) addTextAnimatePin('.about-section__title');

   if (document.querySelector('.services-section__title')) addTextAnimate('.services-section__title')

   let tl_about;
   if (document.querySelector('.about-section__body')) {
      tl_about = gsap.timeline({
         scrollTrigger: {
            trigger: '.about-section__body',
            start: '0% 50%',
            end: '0% 50%',
         }
      })

      const ABOUT_ANIMATION = this.document.querySelectorAll('.js-about-animation');
      if (ABOUT_ANIMATION.length === 0) return;
      ABOUT_ANIMATION.forEach((e) => {
         tl_about.to(e, { opacity: 1, duration: 0.5 })
      })
   }



})