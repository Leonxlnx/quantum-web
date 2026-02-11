export function initBitQubit() {
  initBitToggle();
  initQubitStates();
}

function initBitToggle() {
  const bitToggle = document.getElementById('bit-toggle');
  const bitValue = document.getElementById('bit-value');
  const bitStateText = document.getElementById('bit-state-text');

  if (!bitToggle || !bitValue || !bitStateText) {
    return;
  }

  let state = 0;

  function render() {
    bitToggle.classList.toggle('is-on', state === 1);
    bitToggle.setAttribute('aria-pressed', String(state === 1));
    bitValue.textContent = String(state);
    bitStateText.innerHTML = state === 0
      ? 'Aktueller Zustand: <strong>0</strong> (aus)'
      : 'Aktueller Zustand: <strong>1</strong> (an)';
  }

  bitToggle.addEventListener('click', () => {
    state = state === 0 ? 1 : 0;
    render();
  });

  render();
}

function initQubitStates() {
  const needle = document.getElementById('qubit-needle');
  const stateText = document.getElementById('qubit-state-copy');
  const buttons = document.querySelectorAll('[data-qubit-target]');

  if (!needle || !stateText || buttons.length === 0) {
    return;
  }

  const states = {
    zero: {
      angle: -90,
      text: 'Zustand |0⟩: klassischer Nordpol. Voll bestimmt.',
    },
    one: {
      angle: 90,
      text: 'Zustand |1⟩: klassischer Südpol. Ebenfalls bestimmt.',
    },
    super: {
      angle: 0,
      text: 'Superposition |+⟩: beide Basiszustände gleichzeitig bis zur Messung.',
    },
  };

  let current = 'zero';

  function render() {
    const selected = states[current];
    needle.style.transform = `translateX(-50%) rotate(${selected.angle}deg)`;
    needle.classList.toggle('is-super', current === 'super');
    stateText.textContent = selected.text;

    buttons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.qubitTarget === current);
    });
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.dataset.qubitTarget;
      if (!target || !(target in states)) {
        return;
      }
      current = target;
      render();
    });
  });

  render();
}
