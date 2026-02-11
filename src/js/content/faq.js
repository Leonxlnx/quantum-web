import faqItems from '../../data/faq.de.json';

export function initFaq() {
  const root = document.getElementById('faq-list');
  if (!root) {
    return;
  }

  root.innerHTML = faqItems.map((item, index) => {
    const panelId = `faq-panel-${item.id}`;
    const expanded = index === 0 ? 'true' : 'false';
    return `
      <article class="faq-item" data-faq-item="${item.id}">
        <button
          type="button"
          class="faq-toggle"
          data-faq-toggle="${item.id}"
          aria-expanded="${expanded}"
          aria-controls="${panelId}"
        >
          <span>Frage ${String(index + 1).padStart(2, '0')}</span>
          <span>${item.frage}</span>
        </button>
        <div class="faq-panel" id="${panelId}" ${index === 0 ? '' : 'hidden'}>
          <p><strong>Kurzantwort:</strong> ${item.kurzantwort}</p>
          <p><strong>Wenn nachgehakt wird:</strong> ${item.deep_dive}</p>
        </div>
      </article>
    `;
  }).join('');

  const toggles = root.querySelectorAll('[data-faq-toggle]');
  toggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const id = toggle.getAttribute('data-faq-toggle');
      if (!id) {
        return;
      }
      const panel = document.getElementById(`faq-panel-${id}`);
      if (!panel) {
        return;
      }

      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      panel.hidden = isOpen;
    });
  });
}
