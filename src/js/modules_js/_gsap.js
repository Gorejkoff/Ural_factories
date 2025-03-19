
window.addEventListener('load', function (event) {
   gsap.registerPlugin(ScrollTrigger, ScrollSmoother);
   let smoother = ScrollSmoother.create({
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

   //       // pin: true,
   //       // scrub: true,

   //       markers: {
   //          startColor: "red",
   //          endColor: "green",
   //          fontSize: "18px",
   //          fontWeight: "bold",
   //          indent: 20
   //       },
   //    }
   // })






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

   const LIST_DESCRIPTION_BLOCK = this.document.querySelectorAll('.description__block');

   LIST_DESCRIPTION_BLOCK.forEach((element, index) => {
      let durationValue = 0.7;
      let xValue = window.innerWidth;
      if (index % 2 == 0) { xValue *= -1 };
      gsap.fromTo(element, {
         x: xValue,
         duration: durationValue,
      },
         {
            x: 0,
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







})