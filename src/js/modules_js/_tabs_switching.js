class TabsSwitching {
   constructor(body__buttons, button, tab, execute) {
      this.name_button = button;
      this.body__buttons = document.querySelector(body__buttons);
      this.button = document.querySelectorAll(button);
      this.tab = document.querySelectorAll(tab);
      this.execute = execute;
   }
   init = () => {
      this.body__buttons.addEventListener('click', (event) => {
         if (event.target.closest(this.name_button)) {
            let n = event.target.closest(this.name_button).dataset.button;
            this.button.forEach((e) => { e.classList.toggle('active', e.dataset.button == n) });
            if (this.tab.length > 0) { this.tab.forEach((e) => { e.classList.toggle('active', e.dataset.tab == n) }) }
            if (this.execute) { this.execute(event) };
         }
      })
   }
}

if (document.querySelector('.documents-certificates')) {
   let tab = new TabsSwitching('.documents-certificates__tab-buttons', '.documents-certificates__tab-button', '.documents-certificates__tab-page');
   tab.init();
}
if (document.querySelector('.js-map-button')) {
   let tab = new TabsSwitching('.js-map-buttons', '.js-map-button', '.js-map-tab');
   tab.init();
}
if (document.querySelector('.js-form')) {
   let tab = new TabsSwitching('.js-form-tab-button', '.js-form-tab-button', '.js-form-tab');
   tab.init();
   const firstTab = document.querySelector('.js-form');
   const formTabs = firstTab.querySelectorAll('.js-form-tab')
   const inputs = formTabs[0].querySelectorAll('[required]');
   function back() {
      formTabs.forEach(e => e.classList.remove('active'))
      formTabs[0].classList.add('active');
   }
   inputs.forEach(e => e.addEventListener('invalid', back))
}



