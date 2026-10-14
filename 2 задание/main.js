import Dashboard from './js/Dashboard.js';

function init() {
  const dashboardElement = document.querySelector('#dashboard');
  const emptyState = document.querySelector('#empty-state');
  const toolbar = document.querySelector('.toolbar');

  if (!dashboardElement || !toolbar) {
    console.error('Не найдены #dashboard или .toolbar. Проверь index.html.');
    return;
  }

  const dashboard = new Dashboard(dashboardElement, emptyState);

  toolbar.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-add]');

    if (!button) return;

    try {
      dashboard.addWidget(button.dataset.add);
    } catch (error) {
      console.error('Не удалось добавить виджет:', error);
      alert('Не удалось добавить виджет. Подробности — в консоли браузера.');
    }
  });

  dashboard.addWidget('todo');
  dashboard.addWidget('weather');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}