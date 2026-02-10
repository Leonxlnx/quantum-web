/* ===================================================
   QUANTUM ALGORITHMS — Main JavaScript
   Interactive logic for all sections
   =================================================== */

// ---- Chapter Navigation ----
const chapterNav = document.getElementById('chapter-nav');
const chapterToggle = document.getElementById('chapter-toggle');
const chapterList = document.getElementById('chapter-list');
const chapterLinks = document.querySelectorAll('.chapter-link');

chapterToggle.addEventListener('click', () => {
  chapterNav.classList.toggle('open');
});

chapterLinks.forEach(link => {
  link.addEventListener('click', () => {
    chapterNav.classList.remove('open');
  });
});

document.addEventListener('click', (e) => {
  if (!chapterNav.contains(e.target)) {
    chapterNav.classList.remove('open');
  }
});

// ---- Progress Bar ----
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = progress + '%';
}

// ---- Active Chapter Tracking ----
const sections = document.querySelectorAll('.section');

function updateActiveChapter() {
  const scrollY = window.scrollY + window.innerHeight * 0.3;
  let currentIdx = 0;

  sections.forEach((section, i) => {
    if (scrollY >= section.offsetTop) {
      currentIdx = i;
    }
  });

  chapterLinks.forEach((link, i) => {
    link.classList.toggle('active', i === currentIdx);
  });
}

// ---- Scroll Animations ----
function revealCards() {
  const cards = document.querySelectorAll('.section--lesson .card');
  const windowH = window.innerHeight;

  cards.forEach(card => {
    const rect = card.getBoundingClientRect();
    if (rect.top < windowH * 0.85) {
      card.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', () => {
  updateProgress();
  updateActiveChapter();
  revealCards();
}, { passive: true });

// Initial call
updateProgress();
updateActiveChapter();
revealCards();

// ---- Bit Toggle ----
const bitToggle = document.getElementById('bit-toggle');
bitToggle.addEventListener('click', () => {
  const current = bitToggle.dataset.state;
  const next = current === '0' ? '1' : '0';
  bitToggle.dataset.state = next;
  bitToggle.querySelector('.bit-value').textContent = next;
});

// ---- Qubit Controls ----
const qubitArrow = document.getElementById('qubit-arrow');
const qubitState = document.getElementById('qubit-state');
const qubitBtns = document.querySelectorAll('.qubit-btn');

let currentQubitState = 'zero';

const qubitStates = {
  zero: { rotation: 0, label: '|0⟩', desc: 'Zustand: |0⟩ — Nordpol der Bloch-Sphäre' },
  one: { rotation: 180, label: '|1⟩', desc: 'Zustand: |1⟩ — Südpol der Bloch-Sphäre' },
  super: { rotation: 90, label: '|+⟩', desc: 'Superposition: |0⟩ + |1⟩ — gleichzeitig beides!' },
};

qubitBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const action = btn.dataset.action;
    currentQubitState = action;
    const state = qubitStates[action];
    qubitArrow.style.transform = `translate(-50%, -100%) rotate(${state.rotation}deg)`;
    qubitState.textContent = state.desc;

    if (action === 'super') {
      qubitArrow.style.animation = 'qubitPulse 1.5s ease-in-out infinite';
    } else {
      qubitArrow.style.animation = 'none';
    }
  });
});

// Add qubit pulse animation
const style = document.createElement('style');
style.textContent = `
  @keyframes qubitPulse {
    0%, 100% { opacity: 1; filter: brightness(1); }
    50% { opacity: 0.7; filter: brightness(1.5); }
  }
`;
document.head.appendChild(style);

// ---- Exponential Slider ----
const qubitSlider = document.getElementById('qubit-slider');
const qubitCount = document.getElementById('qubit-count');
const expValue = document.getElementById('exp-value');
const expComparison = document.getElementById('exp-comparison');

const comparisons = [
  { threshold: 1, text: '' },
  { threshold: 3, text: '→ Mehr als ein Byte!' },
  { threshold: 8, text: '→ 256 — so viele Zeichen hat ASCII' },
  { threshold: 10, text: '→ Über 1.000 Zustände' },
  { threshold: 14, text: '→ Mehr als 16.000 — so viele Einwohner hat eine Kleinstadt' },
  { threshold: 17, text: '→ Über 131.000 — mehr als ein Fußballstadion fasst' },
  { threshold: 20, text: '→ Über 1 Million Zustände — gleichzeitig!' },
];

qubitSlider.addEventListener('input', () => {
  const n = parseInt(qubitSlider.value);
  const states = Math.pow(2, n);
  qubitCount.textContent = n;
  expValue.textContent = states.toLocaleString('de-DE');

  let comp = '';
  for (let i = comparisons.length - 1; i >= 0; i--) {
    if (n >= comparisons[i].threshold) {
      comp = comparisons[i].text;
      break;
    }
  }
  expComparison.textContent = comp;
});

// ---- Gate Tabs ----
const gateTabs = document.querySelectorAll('.gate-tab');
const gatePanels = document.querySelectorAll('.gate-panel');

gateTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    gateTabs.forEach(t => t.classList.remove('active'));
    gatePanels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    // Re-trigger visibility
    setTimeout(revealCards, 50);
  });
});

// ---- Classical Gate Simulators ----

// Helper: toggle input
function toggleInput(btn) {
  const val = btn.dataset.val === '0' ? '1' : '0';
  btn.dataset.val = val;
  btn.textContent = val;
  return val;
}

function setOutput(el, val) {
  el.textContent = val;
  el.classList.toggle('active', val === '1');
}

// NOT
const notInput = document.getElementById('not-input');
const notOutput = document.getElementById('not-output');
notInput.addEventListener('click', () => {
  const val = toggleInput(notInput);
  const result = val === '0' ? '1' : '0';
  setOutput(notOutput, result);
});

// AND
const andA = document.getElementById('and-a');
const andB = document.getElementById('and-b');
const andOutput = document.getElementById('and-output');
function updateAnd() {
  const result = (andA.dataset.val === '1' && andB.dataset.val === '1') ? '1' : '0';
  setOutput(andOutput, result);
}
andA.addEventListener('click', () => { toggleInput(andA); updateAnd(); });
andB.addEventListener('click', () => { toggleInput(andB); updateAnd(); });

// OR
const orA = document.getElementById('or-a');
const orB = document.getElementById('or-b');
const orOutput = document.getElementById('or-output');
function updateOr() {
  const result = (orA.dataset.val === '1' || orB.dataset.val === '1') ? '1' : '0';
  setOutput(orOutput, result);
}
orA.addEventListener('click', () => { toggleInput(orA); updateOr(); });
orB.addEventListener('click', () => { toggleInput(orB); updateOr(); });

// XOR
const xorA = document.getElementById('xor-a');
const xorB = document.getElementById('xor-b');
const xorOutput = document.getElementById('xor-output');
function updateXor() {
  const result = (xorA.dataset.val !== xorB.dataset.val) ? '1' : '0';
  setOutput(xorOutput, result);
}
xorA.addEventListener('click', () => { toggleInput(xorA); updateXor(); });
xorB.addEventListener('click', () => { toggleInput(xorB); updateXor(); });

// ---- Quantum Gate Demos ----

// Pauli-X
let pauliState = 0;
const pauliStateEl = document.getElementById('pauli-state');
const pauliResult = document.getElementById('pauli-result');
const pauliApply = document.getElementById('pauli-apply');

pauliApply.addEventListener('click', () => {
  pauliState = pauliState === 0 ? 1 : 0;
  pauliResult.textContent = `|${pauliState}⟩`;
  pauliResult.classList.remove('super');
  pauliStateEl.textContent = `|${pauliState === 0 ? 1 : 0}⟩`;

  // Flash animation
  pauliResult.style.transform = 'scale(1.1)';
  setTimeout(() => { pauliResult.style.transform = 'scale(1)'; }, 200);
});

// Hadamard
let hadamardState = 'zero';
const hadamardStateEl = document.getElementById('hadamard-state');
const hadamardResult = document.getElementById('hadamard-result');
const hadamardApply = document.getElementById('hadamard-apply');
const hadamardExplain = document.getElementById('hadamard-explain');

hadamardApply.addEventListener('click', () => {
  if (hadamardState === 'zero') {
    hadamardState = 'super';
    hadamardResult.textContent = '|+⟩';
    hadamardResult.classList.add('super');
    hadamardExplain.textContent = '= (|0⟩ + |1⟩) / √2 — Superposition!';
    hadamardStateEl.textContent = '|+⟩';
  } else if (hadamardState === 'super') {
    hadamardState = 'zero';
    hadamardResult.textContent = '|0⟩';
    hadamardResult.classList.remove('super');
    hadamardExplain.textContent = 'Zurück zu |0⟩ — Superposition aufgelöst';
    hadamardStateEl.textContent = '|0⟩';
  }

  hadamardResult.style.transform = 'scale(1.1)';
  setTimeout(() => { hadamardResult.style.transform = 'scale(1)'; }, 200);
});

// CNOT
const cnotControl = document.getElementById('cnot-control');
const cnotTarget = document.getElementById('cnot-target');
const cnotOutCtrl = document.getElementById('cnot-out-ctrl');
const cnotOutTarget = document.getElementById('cnot-out-target');

function updateCnot() {
  const ctrl = cnotControl.dataset.val;
  const tgt = cnotTarget.dataset.val;
  const outCtrl = ctrl;
  const outTarget = ctrl === '1' ? (tgt === '0' ? '1' : '0') : tgt;

  setOutput(cnotOutCtrl, outCtrl);
  setOutput(cnotOutTarget, outTarget);
}

cnotControl.addEventListener('click', () => { toggleInput(cnotControl); updateCnot(); });
cnotTarget.addEventListener('click', () => { toggleInput(cnotTarget); updateCnot(); });

// ---- Race Animation ----
const raceSlider = document.getElementById('race-slider');
const raceN = document.getElementById('race-n');
const raceGo = document.getElementById('race-go');
const raceClassical = document.getElementById('race-classical');
const raceQuantum = document.getElementById('race-quantum');
const raceClassicalSteps = document.getElementById('race-classical-steps');
const raceQuantumSteps = document.getElementById('race-quantum-steps');

raceSlider.addEventListener('input', () => {
  const n = parseInt(raceSlider.value);
  raceN.textContent = n;
  const classicalSteps = Math.pow(2, n);
  raceClassicalSteps.textContent = classicalSteps.toLocaleString('de-DE') + ' Schritte';
  raceQuantumSteps.textContent = '1 Schritt';

  // Reset bars
  raceClassical.style.width = '0%';
  raceQuantum.style.width = '0%';
});

// Init display
raceClassicalSteps.textContent = '8 Schritte';

let raceRunning = false;

raceGo.addEventListener('click', () => {
  if (raceRunning) return;
  raceRunning = true;
  raceGo.disabled = true;
  raceGo.textContent = 'Läuft...';

  const n = parseInt(raceSlider.value);
  const totalSteps = Math.pow(2, n);
  const duration = Math.min(3000, totalSteps * 50);
  const stepDuration = duration / totalSteps;

  // Reset
  raceClassical.style.width = '0%';
  raceQuantum.style.width = '0%';

  // Quantum finishes immediately
  setTimeout(() => {
    raceQuantum.style.transition = 'width 0.3s ease';
    raceQuantum.style.width = '100%';
  }, 200);

  // Classical builds up slowly
  let currentStep = 0;
  const interval = setInterval(() => {
    currentStep++;
    const progress = (currentStep / totalSteps) * 100;
    raceClassical.style.transition = 'none';
    raceClassical.style.width = progress + '%';

    if (currentStep >= totalSteps) {
      clearInterval(interval);
      raceRunning = false;
      raceGo.disabled = false;
      raceGo.textContent = 'Nochmal starten';
    }
  }, Math.max(stepDuration, 16));

  // Safety timeout
  setTimeout(() => {
    if (raceRunning) {
      raceClassical.style.transition = 'width 0.5s ease';
      raceClassical.style.width = '100%';
      clearInterval(interval);
      raceRunning = false;
      raceGo.disabled = false;
      raceGo.textContent = 'Nochmal starten';
    }
  }, 5000);
});

// ---- Deutsch-Jozsa Algorithm ----
const djConstant = document.getElementById('dj-constant');
const djBalanced = document.getElementById('dj-balanced');
const djRun = document.getElementById('dj-run');
const djSteps = document.querySelectorAll('.dj-step');
const djOracleType = document.getElementById('dj-oracle-type');
const djFinalResult = document.getElementById('dj-final-result');

let djType = 'constant';

djConstant.addEventListener('click', () => {
  djType = 'constant';
  djConstant.classList.add('active');
  djBalanced.classList.remove('active');
  resetDJ();
});

djBalanced.addEventListener('click', () => {
  djType = 'balanced';
  djBalanced.classList.add('active');
  djConstant.classList.remove('active');
  resetDJ();
});

function resetDJ() {
  djSteps.forEach(step => {
    step.classList.remove('active', 'done');
  });
  djFinalResult.classList.remove('show');
  djFinalResult.textContent = '';
  djRun.disabled = false;
  djRun.textContent = 'Algorithmus starten';

  document.getElementById('dj-visual-2').innerHTML = '';
  document.getElementById('dj-visual-3').innerHTML = '';
}

djRun.addEventListener('click', () => {
  djRun.disabled = true;
  djRun.textContent = 'Läuft...';
  djOracleType.textContent = djType === 'constant' ? 'konstant' : 'balanciert';

  resetDJ();

  // Step 1: Superposition
  setTimeout(() => {
    djSteps[0].classList.add('active');
  }, 300);

  // Step 2: Oracle
  setTimeout(() => {
    djSteps[0].classList.remove('active');
    djSteps[0].classList.add('done');
    djSteps[1].classList.add('active');
    djOracleType.textContent = djType === 'constant' ? 'konstant' : 'balanciert';
  }, 1500);

  // Step 3: Interference
  setTimeout(() => {
    djSteps[1].classList.remove('active');
    djSteps[1].classList.add('done');
    djSteps[2].classList.add('active');

    const visual2 = document.getElementById('dj-visual-2');
    if (djType === 'constant') {
      visual2.innerHTML = '<div class="dj-oracle">Alle Phasen gleich → <span style="color:var(--accent);font-weight:700">konstruktive Interferenz</span></div>';
    } else {
      visual2.innerHTML = '<div class="dj-oracle">Phasen heben sich auf → <span style="color:var(--accent);font-weight:700">destruktive Interferenz</span></div>';
    }
  }, 2800);

  // Step 4: Measurement
  setTimeout(() => {
    djSteps[2].classList.remove('active');
    djSteps[2].classList.add('done');
    djSteps[3].classList.add('active');

    const visual3 = document.getElementById('dj-visual-3');
    if (djType === 'constant') {
      visual3.innerHTML = '<div class="dj-oracle">Messung: |0...0⟩</div>';
    } else {
      visual3.innerHTML = '<div class="dj-oracle">Messung: ≠ |0...0⟩</div>';
    }

    djFinalResult.textContent = djType === 'constant'
      ? '✅ Ergebnis: f(x) ist KONSTANT — mit nur 1 Abfrage!'
      : '✅ Ergebnis: f(x) ist BALANCIERT — mit nur 1 Abfrage!';
    djFinalResult.classList.add('show');

    djRun.textContent = 'Nochmal starten';
    djRun.disabled = false;
  }, 4200);
});

// ---- Initial State ----
// Trigger output displays
setOutput(notOutput, '1');
updateAnd();
updateOr();
updateXor();
updateCnot();
