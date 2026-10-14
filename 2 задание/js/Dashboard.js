import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import WeatherWidget from './WeatherWidget.js';
import CurrencyWidget from './CurrencyWidget.js';
import { createId } from './utils.js';

export default class Dashboard {
  #widgets = [];
  #container = null;
  #emptyState = null;
  #widgetTypes = new Map([
    ['todo', ToDoWidget],
    ['quote', QuoteWidget],
    ['weather', WeatherWidget],
    ['currency', CurrencyWidget]
  ]);

  constructor(container, emptyState) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('Не найден контейнер дашборда');
    }

    this.#container = container;
    this.#emptyState = emptyState;
    this.#updateEmptyState();
  }

  addWidget(widgetType) {
    const WidgetClass = this.#widgetTypes.get(widgetType);

    if (!WidgetClass) {
      throw new Error(`Неизвестный тип виджета: ${widgetType}`);
    }

    const widget = new WidgetClass({
      id: createId(),
      title: this.#getWidgetTitle(widgetType)
    });

    this.#widgets.push(widget);
    this.#container.append(widget.render());
    this.#updateEmptyState();

    return widget;
  }

  removeWidget(widgetId) {
    const index = this.#widgets.findIndex((widget) => widget.id === widgetId);

    if (index === -1) return false;

    const [widget] = this.#widgets.splice(index, 1);
    widget.destroy();
    this.#updateEmptyState();

    return true;
  }

  #getWidgetTitle(widgetType) {
    const titles = {
      todo: 'Мои задачи',
      quote: 'Цитата дня',
      weather: 'Погода в Москве',
      currency: 'Курсы валют'
    };

    return titles[widgetType] ?? 'Виджет';
  }

  #updateEmptyState() {
    if (this.#emptyState) {
      this.#emptyState.hidden = this.#widgets.length > 0;
    }
  }
}