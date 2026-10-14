import UIComponent from './UIComponent.js';

export default class QuoteWidget extends UIComponent {
  #quotes = [
    { text: 'Простота — высшая форма изысканности.', author: 'Леонардо да Винчи' },
    { text: 'Лучший способ предсказать будущее — создать его.', author: 'Алан Кэй' },
    { text: 'Код читают чаще, чем пишут.', author: 'Гвидо ван Россум' },
    { text: 'Дизайн — это не только то, как что-то выглядит.', author: 'Стив Джобс' }
  ];
  #quoteBlock = null;

  constructor(config) {
    super({ title: 'Цитата дня', ...config });
  }

  renderBody(body) {
    this.#quoteBlock = document.createElement('blockquote');
    this.#quoteBlock.className = 'quote';

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'button';
    button.textContent = 'Обновить цитату';

    this.addEventListener(button, 'click', () => this.#showRandomQuote());
    this.#showRandomQuote();

    body.append(this.#quoteBlock, button);
  }

  #showRandomQuote() {
    const quote = this.#quotes[Math.floor(Math.random() * this.#quotes.length)];

    this.#quoteBlock.replaceChildren();

    const text = document.createElement('p');
    text.className = 'quote__text';
    text.textContent = `«${quote.text}»`;

    const author = document.createElement('footer');
    author.className = 'quote__author';
    author.textContent = `— ${quote.author}`;

    this.#quoteBlock.append(text, author);
  }
}