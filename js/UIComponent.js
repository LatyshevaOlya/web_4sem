export default class UIComponent {
  #listeners = [];
  #intervals = [];
  #controllers = [];

  constructor({ id, title }) {
    if (new.target === UIComponent) {
      throw new Error('UIComponent является абстрактным классом');
    }

    this.id = id;
    this.title = title;
    this.element = null;
  }

  render() {
    this.element = document.createElement('article');
    this.element.className = 'widget';
    this.element.dataset.widgetId = this.id;

    const header = document.createElement('header');
    header.className = 'widget__header';

    const title = document.createElement('h2');
    title.className = 'widget__title';
    title.textContent = this.title;

    const actions = document.createElement('div');
    actions.className = 'widget__actions';

    const minimizeButton = this.#createActionButton('Свернуть', 'minimize');
    const closeButton = this.#createActionButton('Закрыть', 'close');

    actions.append(minimizeButton, closeButton);
    header.append(title, actions);

    const body = document.createElement('div');
    body.className = 'widget__body';

    this.element.append(header, body);
    this.renderBody(body);

    return this.element;
  }

  renderBody() {
    throw new Error('Метод renderBody() должен быть реализован в наследнике');
  }

  #createActionButton(label, action) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `widget__button widget__button--${action}`;
    button.textContent = label;
    button.setAttribute('aria-label', `${label} виджет «${this.title}»`);

    this.addEventListener(button, 'click', () => {
      if (action === 'minimize') this.minimize();
      if (action === 'close') this.close();
    });

    return button;
  }

  addEventListener(target, type, handler, options) {
    target.addEventListener(type, handler, options);
    this.#listeners.push({ target, type, handler, options });
  }

  setInterval(handler, delay) {
    const id = setInterval(handler, delay);
    this.#intervals.push(id);
    return id;
  }

  createAbortController() {
    const controller = new AbortController();
    this.#controllers.push(controller);
    return controller;
  }

  minimize() {
    this.element?.classList.toggle('widget--minimized');
  }

  close() {
    this.destroy();
  }

  destroy() {
    this.#listeners.forEach(({ target, type, handler, options }) => {
      target.removeEventListener(type, handler, options);
    });

    this.#intervals.forEach(clearInterval);
    this.#controllers.forEach((controller) => controller.abort());

    this.#listeners = [];
    this.#intervals = [];
    this.#controllers = [];
    this.element?.remove();
    this.element = null;
  }
}