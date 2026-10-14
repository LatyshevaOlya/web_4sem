import UIComponent from './UIComponent.js';

export default class CurrencyWidget extends UIComponent {
  #status = null;

  constructor(config) {
    super({ title: 'Курсы валют', ...config });
  }

  renderBody(body) {
    this.#status = document.createElement('div');
    this.#status.className = 'api-status';

    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'button';
    refresh.textContent = 'Обновить';

    this.addEventListener(refresh, 'click', () => this.#loadRates());

    body.append(this.#status, refresh);
    this.#loadRates();
  }

  async #loadRates() {
    const controller = this.createAbortController();

    this.#setStatus('loading', 'Загружаем курсы…');

    try {
      const response = await fetch(
        'https://api.frankfurter.app/latest?from=USD&to=EUR,RUB',
        { signal: controller.signal }
      );

      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const data = await response.json();
      const rates = data?.rates;

      if (!rates?.EUR || !rates?.RUB) {
        this.#setStatus('empty', 'Курсы временно недоступны');
        return;
      }

      this.#setStatus('success', '');
      this.#status.append(
        this.#createRate('1 USD', `${rates.EUR} EUR`),
        this.#createRate('1 USD', `${rates.RUB} RUB`)
      );
    } catch (error) {
      if (error.name === 'AbortError') return;
      this.#setStatus('error', 'Не удалось загрузить курсы. Попробуйте обновить.');
    }
  }

  #createRate(base, value) {
    const item = document.createElement('div');
    item.className = 'api-value';

    const strong = document.createElement('strong');
    strong.textContent = value;

    const span = document.createElement('span');
    span.textContent = base;

    item.append(strong, span);
    return item;
  }

  #setStatus(state, message) {
    this.#status.className = `api-status api-status--${state}`;
    this.#status.replaceChildren();

    if (message) {
      const text = document.createElement('p');
      text.textContent = message;
      this.#status.append(text);
    }
  }
}