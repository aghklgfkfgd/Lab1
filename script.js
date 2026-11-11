// Обрав Vue 3, оскільки він підтримує реактивний стан та властивості для автоматичного обчислення
// результату конвертації без додаткової кнопки.
console.log('script.js підключено')

const { createApp } = Vue;
// Функцію renderRates() видалено.
// Відображення курсів валют тепер виконується через директиву v-for.
// Компонент форми конвертації
const ConverterForm = {
    props: ['rates'],

    data() {
        return {
            amount: 100,
            fromUnit: 'USD',
            toUnit: 'EUR'
        };
    },
    emits: ['convert'],
    // Автоматичне обчислення результату
    computed: {
        result() {
            if (
                !Number.isFinite(this.amount) ||
                this.amount <= 0
            ) {
                return 0;
            }

            const rate =
                this.rates[this.toUnit] /
                this.rates[this.fromUnit];

            return this.amount * rate;
        }
    },
    methods: {
        swapUnits() {
            const temp = this.fromUnit;
            this.fromUnit = this.toUnit;
            this.toUnit = temp;
        },
        submitConversion() {
            if (
                !Number.isFinite(this.amount) ||
                this.amount <= 0
            ) {
                return;
            }

            this.$emit('convert', {
                amount: this.amount,
                from: this.fromUnit,
                to: this.toUnit,
                result: this.result
            });
        }
    },

    template: `
        <div>
            <h3>Конвертер валют</h3>

            <label>Сума:</label>
            <input
                type="number"
                v-model.number="amount"
                min="0.01"
                step="any"
            >

            <label>З:</label>
            <select v-model="fromUnit">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="UAH">UAH</option>
            </select>
            
            <label>У:</label>
            <select v-model="toUnit">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="UAH">UAH</option>
            </select>
            <label></label>
            <button type="button" @click="swapUnits">
                Поміняти місцями
            </button>
            <p>
                Результат:
                {{ result.toFixed(2) }} {{ toUnit }}
            </p>

            <button type="button" @click="submitConversion">
                Конвертація
            </button>
        </div>
    `
};
const RatesList = {
    props: ['rates', 'selectedId'],

    emits: ['select'],

    computed: {
        rateItems() {
            return [
                {
                    id: 1,
                    base: 'USD',
                    quote: 'EUR',
                    rate: this.rates.EUR / this.rates.USD
                },
                {
                    id: 2,
                    base: 'USD',
                    quote: 'UAH',
                    rate: this.rates.UAH / this.rates.USD
                },
                {
                    id: 3,
                    base: 'EUR',
                    quote: 'UAH',
                    rate: this.rates.UAH / this.rates.EUR
                }
            ];
        }
    },

    template: `
        <ul>
            <li
                v-for="item in rateItems"
                :key="item.id"
                @click="$emit('select', item.id)"
                :class="{ 'big-rate': item.id === selectedId }"
                style="cursor: pointer"
            >
                {{ item.base }} → {{ item.quote }}:
                {{ item.rate.toFixed(2) }}
            </li>
        </ul>
    `
};

createApp({
    components: {
        ConverterForm,
        RatesList
    },

    data() {
        return {
            rates: {
                USD: 1,
                EUR: 0.92,
                UAH: 41.5
            },

            history: [],
            selectedRateId: null,
            loading: false,
            error: ''
        };
    },

    computed: {
        historyCount() {
            return this.history.length;
        }
    },

    methods: {
        selectRate(id) {
            this.selectedRateId = id;
        },

        addConversion(conversion) {
            this.history.push({
                ...conversion,
                id: Date.now()
            });
        },

        async loadData() {
            this.loading = true;
            this.error = '';

            try {
                const urls = [
                    'https://api.frankfurter.dev/v2/rate/usd/uah',
                    'https://api.frankfurter.dev/v2/rate/eur/uah'
                ];

                const responses = await Promise.all(
                    urls.map(url => fetch(url))
                );

                for (const response of responses) {
                    if (response.status === 422) {
                        throw new Error('Перевірте код валюти');
                    }

                    if (!response.ok) {
                        throw new Error(
                            'Помилка HTTP: ' + response.status
                        );
                    }
                }

                const data = await Promise.all(
                    responses.map(response => response.json())
                );

                this.rates = {
                    USD: 1,
                    UAH: data[0].rate,
                    EUR: data[0].rate / data[1].rate
                };

            } catch (error) {
                console.error('Помилка завантаження:', error);

                this.error = error.message === 'Перевірте код валюти'
                    ? 'Перевірте код валюти.'
                    : 'Не вдалося завантажити курси валют.';
            } finally {
                this.loading = false;
            }
        }
    },

    mounted() {
        this.loadData();
    },

}).mount('#app');

