(function () {
    class rdCalculator {
        constructor() {
            this.loanInputBox = document.getElementById("totalLoanInput");
            this.loanSlider = document.getElementById("totalLoanSlider");
            this.loanThumb = document.querySelectorAll(".calculator__slider-thumb")[0];
            this.loanSliderProgress = document.getElementsByClassName("calculator__slider-progress")[0];
            this.LoanErrorMsg = document.getElementById("totalLoanErrorMsg");

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

            this.monthlyInvestment = document.getElementsByClassName("calculator__results-number")[0];
            this.loan = document.getElementsByClassName("calculator__results-number")[1];
            this.interest = document.getElementsByClassName("calculator__results-number")[2];
            this.totalAmount = document.getElementsByClassName("calculator__results-number")[3];

            this.chart = document.querySelector(".calculator-donut-chart");
            this.chartDonut = null;
        }

        resetCalculator() {
            const defaults = {
                loan: 1000000,
                interest: 6.5,
                time: 5,
            };

            this.loanInputBox.value = defaults.loan;
            this.loanSlider.value = defaults.loan;
            this.updateThumbPosition(this.loanSlider, this.loanThumb);
            this.loanSliderProgress.style.width = ((defaults.loan - this.loanSlider.min) / (this.loanSlider.max - this.loanSlider.min)) * 100 + "%";

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
            let loanAmount = parseFloat(this.loanInputBox.value) || 0;
            let time = parseFloat(this.timeInputBox.value) || 0;

            if (this.timeBtn.textContent == 'Years') {
                time *= 12;
            }

            this.loan.textContent = `₱ ${loanAmount.toLocaleString('en-IN')}`;

            const monthlyDeposit = this.calculateMonthlyDeposit();
            this.monthlyInvestment.textContent = `₱ ${monthlyDeposit.toLocaleString('en-IN')}`;

            const totalAmount = monthlyDeposit * time;
            this.totalAmount.textContent = `₱ ${totalAmount.toLocaleString('en-IN')}`;

            const interest = totalAmount - loanAmount;
            this.interest.textContent = `₱ ${interest.toLocaleString('en-IN')}`;

            if (this.chartDonut) {
                this.chartDonut.data.datasets[0].data = [loanAmount, interest];
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

        updateloanSlider() {
            this.loanSlider.value = this.loanInputBox.value;
            this.loanSliderProgress.style.width = ((this.loanSlider.value - this.loanSlider.min) / (this.loanSlider.max - this.loanSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.loanSlider, this.loanThumb);
        }

        updateloanInputBox() {
            this.loanInputBox.value = Math.floor(this.loanSlider.value / 500) * 500;
            this.loanSliderProgress.style.width = ((this.loanSlider.value - this.loanSlider.min) / (this.loanSlider.max - this.loanSlider.min)) * 100 + "%";
            this.updateThumbPosition(this.loanSlider, this.loanThumb);
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
            const maxValues = { Years: 10, Months: 60 };
            const minValues = { Years: 1, Months: 3 };
            this.timeInputBox.setAttribute("max", maxValues[durationType]);
            this.timeInputBox.setAttribute("min", minValues[durationType]);
            this.timeSlider.setAttribute("max", maxValues[durationType]);
            this.timeSlider.setAttribute("min", minValues[durationType]);
            this.timeBtn.textContent = durationType;
            this.timeInputBox.value = 3;
            this.timeSlider.value = 3;
            this.updateThumbPosition(this.timeSlider, this.timeThumb);
            this.timeSliderProgress.style.width = ((this.timeSlider.value - this.timeSlider.min) / (this.timeSlider.max - this.timeSlider.min)) * 100 + "%";
            this.updateAllResults();
        }

        calculateMonthlyDeposit() {
            const loanAmount = parseFloat(this.loanInputBox.value) || 0; // Monthly Deposit (P)
            const annualInterestRate = parseFloat(this.interestInputBox.value) || 0; // Annual Interest Rate (r)
            let timeInMonths = parseFloat(this.timeInputBox.value) || 0; // Tenure in Months (n)

            if (this.timeBtn.textContent == 'Years') {
                timeInMonths *= 12;
            }

            const monthlyInterestRate = annualInterestRate / 12 / 100;
        
            const emi = 
                (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, timeInMonths)) / 
                (Math.pow(1 + monthlyInterestRate, timeInMonths) - 1);
        
            return Math.round(emi);
        }

        bindingEvents() {
            this.loanInputBox.addEventListener('keydown', (event) => this.preventInvalidCharacters(event));
            this.loanInputBox.addEventListener('input', () => { this.checkInputError(this.loanInputBox, this.LoanErrorMsg, 500), this.updateloanSlider(), this.updateAllResults() });
            this.loanSlider.addEventListener('input', () => { this.checkInputError(this.loanInputBox, this.LoanErrorMsg, 500), this.updateloanInputBox(), this.updateAllResults() });

            this.interestInputBox.addEventListener('keydown', (event) => this.preventInvalidCharacters(event));
            this.interestInputBox.addEventListener('input', () => { this.checkInputError(this.interestInputBox, this.interestErrorMsg, 1), this.updateInterestSlider(), this.updateAllResults() });
            this.interestSlider.addEventListener('input', () => { this.checkInputError(this.interestInputBox, this.interestErrorMsg, 1), this.updateInterestInputBox(), this.updateAllResults() });

            this.timeInputBox.addEventListener('keydown', (event) => this.preventInvalidCharacters(event));
            this.timeInputBox.addEventListener('input', () => { this.checkInputError(this.timeInputBox, this.timeErrorMsg, 1), this.updateTimeSlider(), this.updateAllResults() });
            this.timeSlider.addEventListener('input', () => { this.checkInputError(this.timeInputBox, this.timeErrorMsg, 1), this.updateTimeInputBox(), this.updateAllResults() });

            this.timeBtnContainer.addEventListener('click', () => this.toggleTimeDropdown());
            this.yearsBtn.addEventListener('click', () => this.updateTimeDropdown('Years'));
            this.monthsBtn.addEventListener('click', () => this.updateTimeDropdown('Months'));
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
        const rdCalculatorObj = new rdCalculator();
        rdCalculatorObj.init();
    });
})();
