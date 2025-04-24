(function () {
    class rdCalculator {
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

            this.investment = document.getElementsByClassName("calculator__results-number")[0];
            this.returns = document.getElementsByClassName("calculator__results-number")[1];
            this.totalAmount = document.getElementsByClassName("calculator__results-number")[2];

            this.chart = document.querySelector(".calculator-donut-chart");
            this.chartDonut = null;
        }

        resetCalculator() {
            const defaults = {
                investment: 50000,
                interest: 6.5,
                time: 3,
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
            let time = parseFloat(this.timeInputBox.value) || 0;
            let endInvestment;

            if (this.timeBtn.textContent == 'Months') {
                endInvestment = Number(this.investmentInputBox.value) * time || 0;
            } else {
                endInvestment = Number(this.investmentInputBox.value) * time * 12 || 0;
            }

            this.investment.textContent = `₹ ${endInvestment.toLocaleString('en-IN')}`;

            const interest = this.calculateInterest();
            this.returns.textContent = `₹ ${interest.toLocaleString('en-IN')}`;

            const totalAmount = interest + endInvestment;
            this.totalAmount.textContent = `₹ ${totalAmount.toLocaleString('en-IN')}`;

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
            this.investmentInputBox.value = Math.floor(this.investmentSlider.value / 500) * 500;
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

        calculateInterest() {
            const monthlyDeposit = parseFloat(this.investmentInputBox.value) || 0; // Monthly Deposit (P)
            const annualInterestRate = parseFloat(this.interestInputBox.value) || 0; // Annual Interest Rate (r)
            let timeInYears = parseFloat(this.timeInputBox.value) || 0; // Tenure in Years (t)
        
            if (this.timeBtn.textContent === 'Months') {
                timeInYears /= 12;
            }
        
            const totalMonths = timeInYears * 12;
            const compoundingFrequency = 4; // Quarterly compounding (n = 4)
            const ratePerPeriod = annualInterestRate / 100 / compoundingFrequency; 
        
            let totalMaturity = 0;
        
            for (let month = 1; month <= totalMonths; month++) {
                const remainingTenureInYears = (totalMonths - month + 1) / 12;
                const maturityValue = monthlyDeposit * Math.pow((1 + ratePerPeriod), compoundingFrequency * remainingTenureInYears);
                totalMaturity += maturityValue;
            }
        
            const totalInvestment = monthlyDeposit * totalMonths;
            const interestEarned = totalMaturity - totalInvestment;
        
            return Math.round(interestEarned);
        }        

        bindingEvents() {
            this.investmentInputBox.addEventListener('keydown', (event) => this.preventInvalidCharacters(event));
            this.investmentInputBox.addEventListener('input', () => { this.checkInputError(this.investmentInputBox, this.investmentErrorMsg, 500), this.updateInvestmentSlider(), this.updateAllResults() });
            this.investmentSlider.addEventListener('input', () => { this.checkInputError(this.investmentInputBox, this.investmentErrorMsg, 500), this.updateInvestmentInputBox(), this.updateAllResults() });

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
