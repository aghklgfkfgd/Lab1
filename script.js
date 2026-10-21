console.log('script.js підключено')
// Об'єкт з курсом валют
const rates = {
    USD: 1,
    EUR: 0.92,
    UAH: 41.5
};
const listContainer = document.querySelector('#rates-list');
const ratesCount = document.querySelector('#rates-count');
const threshold = 10;
// Створює список валют на основі об'єкта rates.
// Додає курс, атрибут data-rate та клас big-rate для курсів понад поріг.
function renderRates(rates) {
    for (const [currency, rate] of Object.entries(rates)) {
        const li = document.createElement('li');

        li.textContent = `${currency}: ${rate}`;

        li.setAttribute('data-rate', rate);

        if (rate > threshold) {
            li.classList.add('big-rate');
        }
        listContainer.append(li);
    }
}
renderRates(rates);
ratesCount.textContent = `Кількість валют: ${Object.entries(rates).length}`;
const exampleRate = document.querySelector('#example-rate');

if (exampleRate) {
    exampleRate.remove();
}



// Виводить курс валют
function showRates() {
    for (const currency of Object.keys(rates)) {
        console.log(`${currency}: ${rates[currency]}`);
    }
}
// чи є сума конвертації великою
function checkAmount(result, threshold) {
    if (result > threshold) {
        console.log('Велика сума');
    } else {
        console.log('Звичайна сума');
    }
}
showRates();
checkAmount(1500, 1000);

// Конвертує суму за курсом
const convert = (amount, rate) => amount * rate;

const result = convert(100, rates.UAH);

console.log('Результат конвертації:', result);