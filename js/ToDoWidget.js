import UIComponent from './UIComponent.js';
import { createId } from './utils.js';

export default class ToDoWidget extends UIComponent {
  #tasks = [];
  #input = null;
  #list = null;

  constructor(config) {
    super({ title: 'Мои задачи', ...config });

    this.#tasks = [
      { id: createId(), text: 'Изучить ES6-модули', completed: true },
      { id: createId(), text: 'Сделать дашборд', completed: false }
    ];
  }

  renderBody(body) {
    const form = document.createElement('form');
    form.className = 'todo__form';

    this.#input = document.createElement('input');
    this.#input.className = 'todo__input';
    this.#input.type = 'text';
    this.#input.placeholder = 'Новая задача';
    this.#input.required = true;
    this.#input.setAttribute('aria-label', 'Текст новой задачи');

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.className = 'button';
    addButton.textContent = 'Добавить';

    this.#list = document.createElement('ul');
    this.#list.className = 'todo__list';

    form.append(this.#input, addButton);
    body.append(form, this.#list);

    this.addEventListener(form, 'submit', (event) => {
      event.preventDefault();
      this.#addTask(this.#input.value.trim());
    });

    this.addEventListener(this.#list, 'click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;

      const item = button.closest('.todo__item');
      const taskId = item?.dataset.taskId;
      if (!taskId) return;

      if (button.dataset.action === 'toggle') this.#toggleTask(taskId);
      if (button.dataset.action === 'delete') this.#removeTask(taskId);
    });

    this.#renderTasks();
  }

  #addTask(text) {
    if (!text) return;

    this.#tasks.push({
      id: createId(),
      text,
      completed: false
    });

    this.#input.value = '';
    this.#renderTasks();
  }

  #toggleTask(taskId) {
    this.#tasks = this.#tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    this.#renderTasks();
  }

  #removeTask(taskId) {
    this.#tasks = this.#tasks.filter((task) => task.id !== taskId);
    this.#renderTasks();
  }

  #renderTasks() {
    this.#list.replaceChildren();

    if (this.#tasks.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'todo__empty';
      empty.textContent = 'Задач пока нет';
      this.#list.append(empty);
      return;
    }

    this.#tasks.forEach((task) => {
      const item = document.createElement('li');
      item.className = `todo__item${task.completed ? ' todo__item--done' : ''}`;
      item.dataset.taskId = task.id;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'todo__toggle';
      toggle.dataset.action = 'toggle';
      toggle.textContent = task.completed ? '✓' : '';
      toggle.setAttribute(
        'aria-label',
        task.completed ? 'Снять отметку' : 'Отметить выполненной'
      );

      const text = document.createElement('span');
      text.className = 'todo__text';
      text.textContent = task.text;

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'todo__remove';
      remove.dataset.action = 'delete';
      remove.textContent = '×';
      remove.setAttribute('aria-label', `Удалить задачу: ${task.text}`);

      item.append(toggle, text, remove);
      this.#list.append(item);
    });
  }
}