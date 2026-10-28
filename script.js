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

function renderRates(rates, container = listContainer) {
    container.innerHTML = '';

    for (const [currency, rate] of Object.entries(rates)) {
        const li = document.createElement('li');

        if (typeof rate === 'object' && rate !== null) {
            li.textContent =
                `${rate.amount} ${rate.from} → ` +
                `${rate.result.toFixed(2)} ${rate.to}`;
        } else {
            li.textContent = `${currency}: ${rate}`;

            li.setAttribute('data-rate', rate);

            if (rate > threshold) {
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
form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) {
        return;
    }
    const amount = Number(amountInput.value);
    const from = fromUnit.value;
    const to = toUnit.value;
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
    const convertedAmount = convert(amount, rates[to.toUpperCase()] / rates[from.toUpperCase()]);

    const conversion = {
        amount: amount,
        from: from,
        to: to,
        result: convertedAmount
    };

    history.push(conversion);
    renderRates(
        Object.fromEntries(
            history.map((item, index) => [index + 1, item])
        ),
        historyList
    );

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