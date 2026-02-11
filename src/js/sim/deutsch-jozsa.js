export function initDeutschJozsa() {
  const runButton = document.getElementById('dj-run');
  const constantButton = document.getElementById('dj-constant');
  const balancedButton = document.getElementById('dj-balanced');
  const steps = Array.from(document.querySelectorAll('.dj-step'));
  const result = document.getElementById('dj-result');
  const oracleCopy = document.getElementById('dj-oracle-copy');
  const interferenceCopy = document.getElementById('dj-interference-copy');
  const measurementCopy = document.getElementById('dj-measurement-copy');

  if (!runButton || !constantButton || !balancedButton || steps.length === 0 || !result) {
    return;
  }

  let mode = 'constant';
  let running = false;
  let timers = [];

  function clearTimers() {
    timers.forEach((id) => window.clearTimeout(id));
    timers = [];
  }

  function resetVisualState() {
    steps.forEach((step) => {
      step.classList.remove('is-active', 'is-done');
    });
    result.textContent = 'Noch kein Ergebnis. Starte den Ablauf.';
    result.classList.remove('is-balanced');
  }

  function renderMode() {
    constantButton.classList.toggle('is-active', mode === 'constant');
    balancedButton.classList.toggle('is-active', mode === 'balanced');

    if (oracleCopy) {
      oracleCopy.textContent = mode === 'constant'
        ? 'Oracle liefert dieselbe Phase für alle Eingaben.'
        : 'Oracle verteilt Phasen so, dass sie sich gegeneinander aufheben.';
    }
  }

  function schedule(step, delay, callback) {
    const id = window.setTimeout(() => {
      callback(step);
    }, delay);
    timers.push(id);
  }

  function runSequence() {
    if (running) {
      return;
    }

    running = true;
    runButton.disabled = true;
    runButton.textContent = 'Läuft...';
    clearTimers();
    resetVisualState();
    renderMode();

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const gap = reducedMotion ? 220 : 840;

    schedule(0, gap * 0, () => {
      steps[0].classList.add('is-active');
    });

    schedule(1, gap * 1, () => {
      steps[0].classList.remove('is-active');
      steps[0].classList.add('is-done');
      steps[1].classList.add('is-active');
    });

    schedule(2, gap * 2, () => {
      steps[1].classList.remove('is-active');
      steps[1].classList.add('is-done');
      steps[2].classList.add('is-active');
      if (interferenceCopy) {
        interferenceCopy.textContent = mode === 'constant'
          ? 'Konstruktive Interferenz: Amplitude für |0...0⟩ bleibt stark.'
          : 'Destruktive Interferenz: |0...0⟩ wird ausgelöscht.';
      }
    });

    schedule(3, gap * 3, () => {
      steps[2].classList.remove('is-active');
      steps[2].classList.add('is-done');
      steps[3].classList.add('is-active');

      if (mode === 'constant') {
        if (measurementCopy) {
          measurementCopy.textContent = 'Messung ergibt |0...0⟩.';
        }
        result.textContent = 'Ergebnis: f(x) ist KONSTANT. Eine Abfrage reicht.';
        result.classList.remove('is-balanced');
      } else {
        if (measurementCopy) {
          measurementCopy.textContent = 'Messung ergibt ein Muster ungleich |0...0⟩.';
        }
        result.textContent = 'Ergebnis: f(x) ist BALANCIERT. Eine Abfrage reicht.';
        result.classList.add('is-balanced');
      }
    });

    schedule(4, gap * 3.8, () => {
      steps[3].classList.remove('is-active');
      steps[3].classList.add('is-done');
      runButton.disabled = false;
      runButton.textContent = 'Nochmal abspielen';
      running = false;
    });
  }

  constantButton.addEventListener('click', () => {
    if (running) {
      return;
    }
    mode = 'constant';
    resetVisualState();
    renderMode();
  });

  balancedButton.addEventListener('click', () => {
    if (running) {
      return;
    }
    mode = 'balanced';
    resetVisualState();
    renderMode();
  });

  runButton.addEventListener('click', runSequence);

  renderMode();
  resetVisualState();
}
