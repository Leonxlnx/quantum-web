export function initRace() {
  initSupremacyRace();
  initWillowCorrection();
}

function initSupremacyRace() {
  const slider = document.getElementById('race-n');
  const nLabel = document.getElementById('race-n-label');
  const classicalSteps = document.getElementById('classical-steps');
  const quantumSteps = document.getElementById('quantum-steps');
  const startButton = document.getElementById('race-start');
  const classicalBar = document.getElementById('bar-classical');
  const quantumBar = document.getElementById('bar-quantum');

  if (
    !slider ||
    !nLabel ||
    !classicalSteps ||
    !quantumSteps ||
    !startButton ||
    !classicalBar ||
    !quantumBar
  ) {
    return;
  }

  let running = false;
  let rafId = 0;

  function formatSteps(power) {
    return Math.pow(2, power).toLocaleString('de-DE');
  }

  function renderCounts() {
    const n = Number(slider.value);
    nLabel.textContent = String(n);
    classicalSteps.textContent = `${formatSteps(n)} Schritte`;
    quantumSteps.textContent = '1 Schritt';
  }

  function animateClassical(duration) {
    const start = performance.now();

    function frame(timestamp) {
      const progress = Math.min((timestamp - start) / duration, 1);
      classicalBar.style.width = `${Math.round(progress * 100)}%`;

      if (progress < 1) {
        rafId = requestAnimationFrame(frame);
        return;
      }

      running = false;
      startButton.disabled = false;
      startButton.textContent = 'Nochmal starten';
    }

    rafId = requestAnimationFrame(frame);
  }

  startButton.addEventListener('click', () => {
    if (running) {
      return;
    }

    running = true;
    startButton.disabled = true;
    startButton.textContent = 'Läuft...';

    cancelAnimationFrame(rafId);
    classicalBar.style.width = '0%';
    quantumBar.style.width = '0%';

    const n = Number(slider.value);
    const totalSteps = Math.pow(2, n);
    const duration = Math.min(3400, 500 + totalSteps * 4);

    window.setTimeout(() => {
      quantumBar.style.width = '100%';
    }, 120);

    animateClassical(duration);
  });

  slider.addEventListener('input', () => {
    renderCounts();
    if (!running) {
      classicalBar.style.width = '0%';
      quantumBar.style.width = '0%';
    }
  });

  renderCounts();
}

function initWillowCorrection() {
  const slider = document.getElementById('willow-qubits');
  const level = document.getElementById('willow-level');
  const errorFill = document.getElementById('willow-error-fill');
  const errorText = document.getElementById('willow-error-text');
  const stabilityFill = document.getElementById('willow-stability-fill');

  if (!slider || !level || !errorFill || !errorText || !stabilityFill) {
    return;
  }

  function render() {
    const logicalQubits = Number(slider.value);
    const errorRate = Math.max(8, 74 - logicalQubits * 11);
    const stability = Math.min(92, 20 + logicalQubits * 13);

    level.textContent = `${logicalQubits} Blöcke`;
    errorFill.style.width = `${errorRate}%`;
    stabilityFill.style.width = `${stability}%`;
    stabilityFill.classList.add('is-good');
    errorText.textContent = `Fehlerrate fällt auf ca. ${errorRate}% im Modellvergleich.`;
  }

  slider.addEventListener('input', render);
  render();
}
