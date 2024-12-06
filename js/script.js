(function () {
    class Calculator {
        constructor() {
            this.navDropdownBtn = document.querySelector("#navDropdownBtn");
            this.navDropdown = document.querySelector(".header__nav-dropdown");
            this.chevron = document.querySelector(".chevron");
            this.bannerBtn = document.querySelector(".banner__btn");
            this.calculatorsSection = document.getElementById('calculators');
            this.footerBtn = document.querySelector("p.footer__column-title");
        }

        toggleNavDropdown() {
            this.navDropdown.classList.toggle("show");
            this.chevron.classList.toggle("rotate");
        }

        scroll() {
            this.calculatorsSection.scrollIntoView({
                behavior: 'smooth'
            });
        }

        bindingEvents() {
            this.navDropdownBtn.addEventListener('click', () => this.toggleNavDropdown());
            this.bannerBtn.addEventListener('click', () => this.scroll());
            this.footerBtn.addEventListener('click', () => this.scroll());
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
