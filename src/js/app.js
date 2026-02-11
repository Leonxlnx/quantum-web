import { initFaq } from './content/faq.js';
import { initMotion } from './core/motion.js';
import { initNav } from './core/nav.js';
import { initBitQubit } from './sim/bit-qubit.js';
import { initDeutschJozsa } from './sim/deutsch-jozsa.js';
import { initGates } from './sim/gates.js';
import { initRace } from './sim/race.js';

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMotion();
  initBitQubit();
  initGates();
  initRace();
  initDeutschJozsa();
  initFaq();
});
