(function () {
    class fdCalculator {
        constructor() {
            this.investmentInputBox = document.getElementById("totalInvestmentInput");
            this.investmentSlider = document.getElementById("totalInvestmentSlider");
            this.investmentThumb = document.querySelectorAll(".calculator__slider-thumb")[0];
            this.investmentliderProgress = document.getElementsByClassName("calculator__slider-progress")[0];
            this.investmentErrorMsg = document.getElementById("totalInvestmentErrorMsg");

            this.interestInputBox = document.getElementById("interestInput");
            this.interestSlider = document.getElementById("interestSlider");
            this.interestThumb = document.querySelectorAll(".calculator__slider-thumb")[1];
            this.interestSliderProgress = document.getElementsByClassName("calculator__slider-progress")[1];
            this.interestErrorMsg = document.getElementById("interestErrorMsg");

            this.timeInputBox = document.getElementById("timeInput");
            this.timeSlider = document.getElementById("timeSlider");
            this.timeThumb = document.querySelectorAll(".calculator__slider-thumb")[2];
            this.timeSliderProgress = document.getElementsByClassName("calculator__slider-progress")[2];
            this.timeErrorMsg = document.getElementById("timeErrorMsg");

            this.timeBtnContainer = document.querySelector(".calculator__time-btn-container");
            this.timeBtn = document.querySelector(".calculator__time-btn");
            this.timeBtnDropdown = document.querySelector(".calculator__time-btn-dropdown");
            this.yearsBtn = document.getElementsByClassName("calculator__time-btn-item")[0];
            this.monthsBtn = document.getElementsByClassName("calculator__time-btn-item")[1];
            this.daysBtn = document.getElementsByClassName("calculator__time-btn-item")[2];

            this.investment = document.getElementsByClassName("calculator__results-number")[0];
            this.returns = document.getElementsByClassName("calculator__results-number")[1];
            this.totalAmount = document.getElementsByClassName("calculator__results-number")[2];

            this.chart = document.querySelector(".calculator-donut-chart");
            this.chartDonut = null;
        }

        resetCalculator() {
            const defaults = {
                investment: 100000,
                interest: 6.5,
                time: 5,
            };

            this.investmentInputBox.value = defaults.investment;
            this.investmentSlider.value = defaults.investment;
            this.updateThumbPosition(this.investmentSlider, this.investmentThumb);
            this.investmentliderProgress.style.width = ((defaults.investment - this.investmentSlider.min) / (this.investmentSlider.max - this.investmentSlider.min)) * 100 + "%";

            this.interestInputBox.value = defaults.interest;
            this.interestSlider.value = defaults.interest * 10;
            this.updateThumbPosition(this.interestSlider, this.interestThumb);
            this.interestSliderProgress.style.width = ((defaults.interest * 10 - this.interestSlider.min) / (this.interestSlider.max - this.interestSlider.min)) * 100 + "%";

            this.timeInputBox.value = defaults.time;
            this.timeSlider.value = defaults.time;
            this.updateThumbPosition(this.timeSlider, this.timeThumb);
            this.timeSliderProgress.style.width = ((defaults.time - this.timeSlider.min) / (this.timeSlider.max - this.timeSlider.min)) * 100 + "%";
        }

        updateAllResults() {
            const endInvestment = Number(this.investmentInputBox.value) || 0;
            this.investment.textContent = `₱ ${endInvestment.toLocaleString('en-US')}`;

            const interest = this.calculateInterest();
            this.returns.textContent = `₱ ${interest.toLocaleString('en-US')}`;

            const totalAmount = interest + endInvestment;
            this.totalAmount.textContent = `₱ ${totalAmount.toLocaleString('en-US')}`;

            if (this.chartDonut) {
                this.chartDonut.data.datasets[0].data = [endInvestment, interest];
                this.chartDonut.update();
            }
        }

        updateThumbPosition(slider, thumb) {
            const sliderRect = slider.getBoundingClientRect();
            const sliderWidth = sliderRect.width;
            const min = slider.min;
            const max = slider.max;
            const value = slider.value;

            const percentage = ((value - min) / (max - min)) * 100;

            thumb.style.left = `calc(${percentage}% - ${thumb.offsetWidth / 2}px)`;
        }

        preventInvalidCharacters(event) {
            const allowedKeys = new Set(['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete', 'Tab']);
            const isNumeric = /[0-9]/.test(event.key);
            const isDecimalAllowed = event.target.id === "interestInput" && event.key === '.';

            if (!isNumeric && !allowedKeys.has(event.key) && !isDecimalAllowed) {
                event.preventDefault();
            }
        }

        checkInputError(inputElement, errorMsgElement, minValue) {
            const value = parseFloat(inputElement.value);
            inputElement.value = value;
            if (value < minValue) {
                errorMsgElement.style.display = "block";
                errorMsgElement.nextElementSibling.classList.add("error");
            } else {
                errorMsgElement.style.display = "none";
                errorMsgElement.nextElementSibling.classList.remove("error");
            }
        }

        updateInvestmentSlider() {
            this.investmentSlider.value = this.investmentInputBox.value;
            this.investmentliderProgress.style.width = ((this.investmentSlider.value - this.investmentSlider.min) / (this.investmentSlider.max - this.investmentSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.investmentSlider, this.investmentThumb);
        }

        updateInvestmentInputBox() {
            this.investmentInputBox.value = Math.floor(this.investmentSlider.value / 5000) * 5000;
            this.investmentliderProgress.style.width = ((this.investmentSlider.value - this.investmentSlider.min) / (this.investmentSlider.max - this.investmentSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.investmentSlider, this.investmentThumb);
        }

        updateInterestSlider() {
            this.interestSlider.value = this.interestInputBox.value * 10;
            this.interestSliderProgress.style.width = ((this.interestSlider.value - this.interestSlider.min) / (this.interestSlider.max - this.interestSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.interestSlider, this.interestThumb);
        }

        updateInterestInputBox() {
            this.interestInputBox.value = this.interestSlider.value / 10;
            this.interestSliderProgress.style.width = ((this.interestSlider.value - this.interestSlider.min) / (this.interestSlider.max - this.interestSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.interestSlider, this.interestThumb);
        }

        updateTimeSlider() {
            this.timeSlider.value = this.timeInputBox.value;
            this.timeSliderProgress.style.width = ((this.timeSlider.value - this.timeSlider.min) / (this.timeSlider.max - this.timeSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.timeSlider, this.timeThumb);
        }

        updateTimeInputBox() {
            this.timeInputBox.value = this.timeSlider.value;
            this.timeSliderProgress.style.width = ((this.timeSlider.value - this.timeSlider.min) / (this.timeSlider.max - this.timeSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.timeSlider, this.timeThumb);
        }

        toggleTimeDropdown() {
            this.timeBtnDropdown.classList.toggle("show");
            this.timeBtn.nextElementSibling.classList.toggle("rotate");
        }

        updateTimeDropdown(durationType) {
            const maxValues = { Years: 25, Months: 60, Days: 31 };
            this.timeInputBox.setAttribute("max", maxValues[durationType]);
            this.timeSlider.setAttribute("max", maxValues[durationType]);
            this.timeBtn.textContent = durationType;
            this.timeInputBox.value = 5;
            this.timeSlider.value = 5;
            this.updateThumbPosition(this.timeSlider, this.timeThumb);
            this.timeSliderProgress.style.width = ((this.timeSlider.value - this.timeSlider.min) / (this.timeSlider.max - this.timeSlider.min)) * 100 + "%";
            this.updateAllResults();
        }

        calculateInterest() {
            const investment = parseFloat(this.investmentInputBox.value) || 0; // Principal Amount (P)
            const annualInterestRate = parseFloat(this.interestInputBox.value) || 0; // Annual Interest Rate (r)
            let time = parseFloat(this.timeInputBox.value) || 0; // Time Period in Years (t);
            console.log(time)
            if (this.timeBtn.textContent == 'Months' && time < 12) {
                return Math.round(investment * annualInterestRate * time / 100 / 12);
            } else if (this.timeBtn.textContent == 'Months' && time >= 12) {
                time /= 12;
            } else if (this.timeBtn.textContent == 'Days') {
                return Math.round(investment * annualInterestRate * time / 100 / 365);
            }

            const compoundingFrequency = 4; // n = 4 (quarterly compounding)

            const ratePerPeriod = annualInterestRate / 100 / compoundingFrequency;

            const maturityAmount = investment * Math.pow((1 + ratePerPeriod), compoundingFrequency * time);

            const interest = maturityAmount - investment;

            return Math.round(interest);
        }

        bindingEvents() {
            this.investmentInputBox.addEventListener('keydown', (event) => this.preventInvalidCharacters(event));
            this.investmentInputBox.addEventListener('input', () => { this.checkInputError(this.investmentInputBox, this.investmentErrorMsg, 5000), this.updateInvestmentSlider(), this.updateAllResults() });
            this.investmentSlider.addEventListener('input', () => { this.checkInputError(this.investmentInputBox, this.investmentErrorMsg, 5000), this.updateInvestmentInputBox(), this.updateAllResults() });

            this.interestInputBox.addEventListener('keydown', (event) => this.preventInvalidCharacters(event));
            this.interestInputBox.addEventListener('input', () => { this.checkInputError(this.interestInputBox, this.interestErrorMsg, 1), this.updateInterestSlider(), this.updateAllResults() });
            this.interestSlider.addEventListener('input', () => { this.checkInputError(this.interestInputBox, this.interestErrorMsg, 1), this.updateInterestInputBox(), this.updateAllResults() });

            this.timeInputBox.addEventListener('keydown', (event) => this.preventInvalidCharacters(event));
            this.timeInputBox.addEventListener('input', () => { this.checkInputError(this.timeInputBox, this.timeErrorMsg, 1), this.updateTimeSlider(), this.updateAllResults() });
            this.timeSlider.addEventListener('input', () => { this.checkInputError(this.timeInputBox, this.timeErrorMsg, 1), this.updateTimeInputBox(), this.updateAllResults() });

            this.timeBtnContainer.addEventListener('click', () => this.toggleTimeDropdown());
            this.yearsBtn.addEventListener('click', () => this.updateTimeDropdown('Years'));
            this.monthsBtn.addEventListener('click', () => this.updateTimeDropdown('Months'));
            this.daysBtn.addEventListener('click', () => this.updateTimeDropdown('Days'));
        }

        init() {
            this.chartDonut = new Chart(this.chart, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [19, 12],
                        borderWidth: 0,
                        backgroundColor: ['#f0edf1', '#1C3430']
                    }]
                },
                options: {
                    plugins: {
                        tooltip: {
                            enabled: false // Disable tooltips
                        }
                    },
                    cutout: '60%'
                }
            });

            this.resetCalculator();
            this.updateAllResults();
            this.bindingEvents();
        }
    }
    window.addEventListener("DOMContentLoaded", () => {
        const fdCalculatorObj = new fdCalculator();
        fdCalculatorObj.init();
    });
})();
