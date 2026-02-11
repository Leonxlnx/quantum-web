const CLASSIC_RULES = {
  not: {
    title: 'NOT: invertiert den Eingang.',
    compute: (a) => (a === 0 ? 1 : 0),
    needsSecondInput: false,
  },
  and: {
    title: 'AND: 1 nur wenn beide Eingänge 1 sind.',
    compute: (a, b) => (a === 1 && b === 1 ? 1 : 0),
    needsSecondInput: true,
  },
  or: {
    title: 'OR: 1 wenn mindestens ein Eingang 1 ist.',
    compute: (a, b) => (a === 1 || b === 1 ? 1 : 0),
    needsSecondInput: true,
  },
  xor: {
    title: 'XOR: 1 wenn die Eingänge unterschiedlich sind.',
    compute: (a, b) => (a !== b ? 1 : 0),
    needsSecondInput: true,
  },
};

export function initGates() {
  initClassicGateSimulator();
  initQuantumGateSimulator();
}

function initClassicGateSimulator() {
  const root = document.getElementById('classic-gate-sim');
  if (!root) {
    return;
  }

  const gateButtons = root.querySelectorAll('.gate-type-btn');
  const inputA = root.querySelector('#classic-input-a');
  const inputB = root.querySelector('#classic-input-b');
  const inputBWrap = root.querySelector('#classic-input-b-wrap');
  const output = root.querySelector('#classic-output');
  const rule = root.querySelector('#classic-rule');

  if (!inputA || !inputB || !inputBWrap || !output || !rule) {
    return;
  }

  let gate = 'not';
  let a = 0;
  let b = 0;

  function render() {
    const selected = CLASSIC_RULES[gate];
    const result = selected.compute(a, b);

    gateButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.type === gate);
    });

    inputA.textContent = String(a);
    inputB.textContent = String(b);
    inputBWrap.classList.toggle('is-hidden', !selected.needsSecondInput);
    output.textContent = String(result);
    output.classList.toggle('is-ok', result === 1);
    rule.textContent = selected.title;
  }

  gateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.type;
      if (!type || !(type in CLASSIC_RULES)) {
        return;
      }
      gate = type;
      render();
    });
  });

  inputA.addEventListener('click', () => {
    a = a === 0 ? 1 : 0;
    render();
  });

  inputB.addEventListener('click', () => {
    b = b === 0 ? 1 : 0;
    render();
  });

  render();
}

function initQuantumGateSimulator() {
  const root = document.getElementById('quantum-gate-sim');
  if (!root) {
    return;
  }

  const gateButtons = root.querySelectorAll('.qgate-type-btn');
  const inputA = root.querySelector('#quantum-input-a');
  const inputB = root.querySelector('#quantum-input-b');
  const inputBWrap = root.querySelector('#quantum-input-b-wrap');
  const applyButton = root.querySelector('#quantum-apply');
  const output = root.querySelector('#quantum-output');
  const note = root.querySelector('#quantum-note');

  if (!inputA || !inputB || !inputBWrap || !applyButton || !output || !note) {
    return;
  }

  let gate = 'pauli';
  let q0 = 0;
  let q1 = 0;
  let q0Superposition = false;

  function render() {
    gateButtons.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.qtype === gate);
    });

    inputA.textContent = q0Superposition ? '|+⟩' : String(q0);
    inputB.textContent = String(q1);

    inputBWrap.classList.toggle('is-hidden', gate !== 'cnot');

    if (gate === 'pauli') {
      note.textContent = 'Pauli-X kippt |0⟩ zu |1⟩ und zurück.';
      output.textContent = q0Superposition ? '|+⟩' : `|${q0}⟩`;
      output.classList.remove('is-ok');
    }

    if (gate === 'hadamard') {
      note.textContent = 'Hadamard setzt ein Qubit in Superposition.';
      output.textContent = q0Superposition ? '|+⟩' : '|0⟩';
      output.classList.toggle('is-ok', q0Superposition);
    }

    if (gate === 'cnot') {
      note.textContent = 'CNOT invertiert das Ziel nur bei Kontroll-Qubit = 1.';
      output.textContent = `|Kontrolle=${q0}, Ziel=${q1}⟩`;
      output.classList.toggle('is-ok', q0 === 1 && q1 === 1);
    }
  }

  gateButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const type = button.dataset.qtype;
      if (!type) {
        return;
      }
      gate = type;
      render();
    });
  });

  inputA.addEventListener('click', () => {
    if (gate === 'hadamard') {
      return;
    }
    q0Superposition = false;
    q0 = q0 === 0 ? 1 : 0;
    render();
  });

  inputB.addEventListener('click', () => {
    q1 = q1 === 0 ? 1 : 0;
    render();
  });

  applyButton.addEventListener('click', () => {
    if (gate === 'pauli') {
      q0Superposition = false;
      q0 = q0 === 0 ? 1 : 0;
    }

    if (gate === 'hadamard') {
      if (q0Superposition) {
        q0Superposition = false;
        q0 = 0;
      } else {
        q0Superposition = true;
      }
    }

    if (gate === 'cnot') {
      if (q0 === 1) {
        q1 = q1 === 0 ? 1 : 0;
      }
    }

    render();
  });

  render();
}
