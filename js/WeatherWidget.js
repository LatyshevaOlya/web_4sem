import UIComponent from './UIComponent.js';

export default class WeatherWidget extends UIComponent {
  #status = null;

  constructor(config) {
    super({ title: 'Погода в Москве', ...config });
  }

  renderBody(body) {
    this.#status = document.createElement('div');
    this.#status.className = 'api-status';

    const refresh = document.createElement('button');
    refresh.type = 'button';
    refresh.className = 'button';
    refresh.textContent = 'Обновить';

    this.addEventListener(refresh, 'click', () => this.#loadWeather());

    body.append(this.#status, refresh);
    this.#loadWeather();
  }

  async #loadWeather() {
    const controller = this.createAbortController();

    this.#setStatus('loading', 'Загружаем погоду…');

    try {
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=55.75&longitude=37.62&current=temperature_2m,wind_speed_10m&timezone=auto';
      const response = await fetch(url, { signal: controller.signal });

      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);

      const data = await response.json();
      const temperature = data?.current?.temperature_2m;
      const wind = data?.current?.wind_speed_10m;

      if (temperature === undefined || wind === undefined) {
        this.#setStatus('empty', 'Данные погоды временно недоступны');
        return;
      }

      this.#setStatus('success', '');
      this.#status.append(
        this.#createValue(`${temperature} °C`, 'Температура'),
        this.#createValue(`${wind} м/с`, 'Ветер')
      );
    } catch (error) {
      if (error.name === 'AbortError') return;
      this.#setStatus('error', 'Не удалось загрузить погоду. Попробуйте обновить.');
    }
  }

  #createValue(value, label) {
    const item = document.createElement('div');
    item.className = 'api-value';

    const strong = document.createElement('strong');
    strong.textContent = value;

    const span = document.createElement('span');
    span.textContent = label;

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