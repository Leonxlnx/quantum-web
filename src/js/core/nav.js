const CHAPTERS = [
  { id: 'index', title: 'Start', href: '/index.html', meta: 'Einstieg & Überblick' },
  { id: 'bit', title: 'Bit', href: '/pages/bit.html', meta: 'Klassischer Zustand' },
  { id: 'qubit', title: 'Qubit', href: '/pages/qubit.html', meta: 'Superposition' },
  { id: 'gates-classic', title: 'Gatter Klassisch', href: '/pages/gates-classic.html', meta: 'NOT, AND, OR, XOR' },
  { id: 'gates-quantum', title: 'Gatter Quanten', href: '/pages/gates-quantum.html', meta: 'Pauli-X, H, CNOT' },
  { id: 'supremacy', title: 'Überlegenheit', href: '/pages/supremacy.html', meta: 'Parallelismus-Race' },
  { id: 'deutsch-jozsa', title: 'Deutsch-Jozsa', href: '/pages/deutsch-jozsa.html', meta: '4-Schritt-Ablauf' },
  { id: 'willow', title: 'Willow', href: '/pages/willow.html', meta: 'Error Correction' },
  { id: 'faq', title: 'Gallery-FAQ', href: '/pages/faq.html', meta: 'Fragen souverän beantworten' },
  { id: 'sources', title: 'Quellen', href: '/pages/sources.html', meta: 'Referenzen & Credits' },
];

const TABS = [
  { group: 'start', label: 'Start', href: '/index.html' },
  { group: 'grundlagen', label: 'Basis', href: '/pages/bit.html' },
  { group: 'gatter', label: 'Gatter', href: '/pages/gates-classic.html' },
  { group: 'algorithmen', label: 'Algo', href: '/pages/deutsch-jozsa.html' },
  { group: 'qa', label: 'Q&A', href: '/pages/faq.html' },
];

function normalizePath(pathname) {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (normalized === '/index.html') {
    return '/';
  }
  return normalized;
}

function linkIsCurrent(linkHref, currentPath) {
  return normalizePath(linkHref) === currentPath;
}

function renderTabs() {
  const tabsRoot = document.getElementById('bottom-tabs');
  if (!tabsRoot) {
    return;
  }

  const currentGroup = document.body.dataset.group || '';
  tabsRoot.innerHTML = TABS.map((tab) => {
    const isActive = tab.group === currentGroup;
    return `
      <a class="bottom-tab ${isActive ? 'is-active' : ''}" href="${tab.href}">
        ${tab.label}
      </a>
    `;
  }).join('');
}

function renderNextButton() {
  const nextButton = document.getElementById('next-button');
  if (!nextButton) {
    return;
  }

  const nextHref = document.body.dataset.next;
  const nextLabel = document.body.dataset.nextLabel || 'Weiter';

  if (!nextHref) {
    nextButton.hidden = true;
    return;
  }

  nextButton.hidden = false;
  nextButton.textContent = nextLabel;
  nextButton.addEventListener('click', () => {
    window.location.href = nextHref;
  });
}

function closeMenu(menu, menuToggle) {
  menu.hidden = true;
  menuToggle.setAttribute('aria-expanded', 'false');
}

function openMenu(menu, menuToggle) {
  menu.hidden = false;
  menuToggle.setAttribute('aria-expanded', 'true');
}

function renderChapterMenu() {
  const menu = document.getElementById('chapter-menu');
  const menuToggle = document.getElementById('menu-toggle');

  if (!menu || !menuToggle) {
    return;
  }

  const currentPath = normalizePath(window.location.pathname);

  menu.innerHTML = `
    <div class="chapter-menu__backdrop" data-menu-close="true"></div>
    <aside class="chapter-menu__panel" role="dialog" aria-modal="true" aria-label="Kapitel">
      <div class="chapter-menu__head">
        <h2 class="chapter-menu__title">Kapitelübersicht</h2>
        <button class="chapter-menu__close" type="button" data-menu-close="true">Schließen</button>
      </div>
      <ul class="chapter-list">
        ${CHAPTERS.map((item, index) => {
          const isCurrent = linkIsCurrent(item.href, currentPath);
          return `
            <li>
              <a class="chapter-link ${isCurrent ? 'is-current' : ''}" href="${item.href}">
                <span>${String(index + 1).padStart(2, '0')} · ${item.title}</span>
                <span class="chapter-link__meta">${item.meta}</span>
              </a>
            </li>
          `;
        }).join('')}
      </ul>
    </aside>
  `;

  menuToggle.addEventListener('click', () => {
    if (menu.hidden) {
      openMenu(menu, menuToggle);
    } else {
      closeMenu(menu, menuToggle);
    }
  });

  menu.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.dataset.menuClose === 'true') {
      closeMenu(menu, menuToggle);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      closeMenu(menu, menuToggle);
    }
  });
}

export function initNav() {
  renderTabs();
  renderNextButton();
  renderChapterMenu();
}
