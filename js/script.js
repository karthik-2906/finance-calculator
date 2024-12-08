(function () {
    class Calculator {
        constructor() {
            this.hamburgerMenu = document.getElementsByClassName("header__hamburger-menu")[0];
            this.headerMobileMenu = document.getElementsByClassName("header__nav-mobile-menu")[0];
            this.headerAccordion = document.querySelector("div.header__accordion-item");
            this.headerAccordionChevron = document.getElementsByClassName("header__accordion-chevron")[0];
            this.navDropdownBtn = document.querySelector("#navDropdownBtn");
            this.navDropdown = document.querySelector(".header__nav-dropdown");
            this.chevron = document.querySelector(".chevron");
            this.bannerBtn = document.querySelector(".banner__btn");
            this.calculatorsSection = document.getElementById('calculators');
            this.footerAccordion = document.querySelector("div.footer__accordion-item");
            this.footerAccordionChevron = document.getElementsByClassName("footer__accordion-chevron")[0];
        }

        toggleHamburgerMenu() {
            this.hamburgerMenu.classList.toggle("active");
            this.headerMobileMenu.classList.toggle("active");
            document.body.classList.toggle("hide-scroll");
        }

        toggleHeaderAccordion() {
            this.headerAccordion.children[1].classList.toggle("show");
            this.headerAccordionChevron.classList.toggle("rotate");
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

        toggleFooterAccordion() {
            this.footerAccordion.children[1].classList.toggle("show");
            this.footerAccordionChevron.classList.toggle("rotate");
        }

        bindingEvents() {
            this.hamburgerMenu.addEventListener('click', () => this.toggleHamburgerMenu());
            this.headerAccordion.addEventListener('click', () => this.toggleHeaderAccordion());
            this.navDropdownBtn.addEventListener('click', () => this.toggleNavDropdown());
            this.bannerBtn.addEventListener('click', () => this.scroll());
            this.footerAccordion.addEventListener('click', () => this.toggleFooterAccordion());
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
