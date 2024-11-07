(function () {
    class Calculator {
        constructor() {
            this.navDropdownBtn = document.querySelector("#navDropdownBtn");
            this.navDropdown = document.querySelector(".nav-item-dropdown");
            this.chevron = document.querySelector(".chevron");
        }

        toggleNavDropdown() {
            this.navDropdown.classList.toggle("show");
            this.chevron.classList.toggle("rotate");
        }

        bindingEvents() {
            this.navDropdownBtn.addEventListener('click', ()=> this.toggleNavDropdown());
        }

        init() {
            this.bindingEvents();
        }
    }
    window.addEventListener("DOMContentLoaded", () => {
        const CalculatorObj = new Calculator();
        CalculatorObj.init();
    });
})();
