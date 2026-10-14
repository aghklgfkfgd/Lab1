console.log('script.js підключено')
// Об'єкт з курсом валют
const rates = {
    USD: 1,
    EUR: 0.92,
    UAH: 41.5
};
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