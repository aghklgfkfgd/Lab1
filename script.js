console.log('script.js підключено')
const loadingMessage =
    document.querySelector('#loading-message');
const errorMessage =
    document.querySelector('#error-message');
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

function renderRates(rates, container = listContainer) {
    container.innerHTML = '';

    if (!Array.isArray(rates)) {
        rates = Object.entries(rates).map(([currency, rate]) => ({
            base: 'UAH',
            quote: currency,
            rate: rate
        }));
    }

    for (const item of rates) {
        const li = document.createElement('li');

        if (item.from && item.to) {
            li.textContent =
                `${item.amount} ${item.from.toUpperCase()} → ${item.result.toFixed(2)} ${item.to.toUpperCase()}`;

        } else {
            li.textContent =
                `${item.base} → ${item.quote}: ${item.rate}`;

            li.setAttribute('data-rate', item.rate);

            if (item.rate > threshold) {
                li.classList.add('big-rate');
            }
        }

        container.append(li);
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

const amountInput = document.querySelector('#amount');
const fromUnit = document.querySelector('#from-unit');
const toUnit = document.querySelector('#to-unit');
const resultElement = document.querySelector('#result');

const historyList = document.querySelector('#history-list');
const historyCount = document.querySelector('#history-count');

const history = [];

// Форма конвертації
const form = document.querySelector('#conversion-form');

amountInput.addEventListener('input', () => {
    if (
        amountInput.value !== '' &&
        Number(amountInput.value) <= 0
    ) {
        amountInput.setCustomValidity(
            'Сума має бути додатною'
        );
    } else {
        amountInput.setCustomValidity('');
    }
});
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
        return;
    }
    const amount = Number(amountInput.value);
    const from = fromUnit.value;
    const to = toUnit.value;
    const convertedAmount = convert(amount, rates[to.toUpperCase()] / rates[from.toUpperCase()]);

    const conversion = {
        amount: amount,
        from: from,
        to: to,
        result: convertedAmount
    };

    history.push(conversion);
    renderRates(history, historyList);

    historyCount.textContent =
        `Кількість конвертацій: ${history.length}`;
    form.reset();

});
// Оновлює результат конвертації та перевіряє правильність суми.
function updateResult() {
    const amount = Number(amountInput.value);

    if (
        amountInput.value.trim() === '' ||
        !Number.isFinite(amount) ||
        amount <= 0
    ) {
        resultElement.textContent =
            'Введіть додатну суму для конвертації.';
        return;
    }

    const from = fromUnit.value.toUpperCase();
    const to = toUnit.value.toUpperCase();

    const rate = rates[to] / rates[from];
    const convertedAmount = convert(amount, rate);

    resultElement.textContent =
        `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
}

fromUnit.addEventListener('change', updateResult);
toUnit.addEventListener('change', updateResult);


const API_URL =
    'https://api.frankfurter.dev/v2/rate/usd/uah';
// Завантажує курси валют із Frankfurter API
async function loadData() {
    loadingMessage.hidden = false;
    try {
        errorMessage.hidden = true;
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(
                'Помилка HTTP: ' + response.status
            );
        }
        const data = await response.json();

        console.log(data);

    } catch (error) {

        console.error('Помилка завантаження:', error);

        if (error.message === 'Перевірте код валюти') {

            errorMessage.textContent =
                'Перевірте код валюти.';

        } else {

            errorMessage.textContent =
                'Не вдалося завантажити курси валют.';

        }

        errorMessage.hidden = false;

    }
    finally {
        loadingMessage.hidden = true;
    }
}
loadData();
const refreshButton = document.querySelector('#refresh-button');

refreshButton.addEventListener('click', () => {
    loadData();
});