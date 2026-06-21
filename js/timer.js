/* ── TIMER: fases, ciclos, tick, sonido ── */

let timer     = null;
let running   = false;
let phase     = 'work';
let cycleCount = 0;
let timeLeft  = WORK_MIN_DEFAULT * 60;
let totalTime = WORK_MIN_DEFAULT * 60;

// ── HELPERS ──
function fmt(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

function currentWorkSecs() {
  return (activeProject ? activeProject.workMin : WORK_MIN_DEFAULT) * 60;
}

// ── DISPLAY ──
function updateDisplay() {
  document.getElementById('timerDisplay').textContent = fmt(timeLeft);
  const pct = Math.round(((totalTime - timeLeft) / totalTime) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  const labels = { work: 'Tiempo de trabajo', short: 'Descanso corto', long: 'Descanso largo' };
  document.getElementById('phaseLabel').textContent = labels[phase];
  document.getElementById('cycleLabel').textContent = `${cycleCount} / ${MAX_CYCLES}`;
  for (let i = 0; i < MAX_CYCLES; i++) {
    const d = document.getElementById('d' + i);
    if (d) d.className = 'cycle-dot' + (i < cycleCount ? ' done' : '');
  }
}

// ── CONTROLES ──
function toggleTimer() {
  if (!activeProject) { showNotif('Seleccioná un proyecto primero'); return; }
  running = !running;
  const icon = document.getElementById('mainBtnIcon');
  const lbl  = document.getElementById('mainBtnLabel');
  if (running) {
    icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    lbl.textContent = 'Pausar';
    tick();
  } else {
    icon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
    lbl.textContent = 'Continuar';
    clearTimeout(timer);
  }
}

function resetTimer() {
  clearTimeout(timer);
  running = false;
  phase = 'work';
  timeLeft = totalTime = currentWorkSecs();
  cycleCount = 0;
  updateDisplay();
  const icon = document.getElementById('mainBtnIcon');
  const lbl  = document.getElementById('mainBtnLabel');
  if (icon) icon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
  if (lbl)  lbl.textContent = 'Iniciar';
}

function skipPhase() {
  clearTimeout(timer);
  running = false;
  completePhase();
}

// ── TICK ──
function tick() {
  if (!running) return;
  if (timeLeft <= 0) { completePhase(); return; }
  timeLeft--;
  updateDisplay();
  timer = setTimeout(tick, 1000);
}

// ── COMPLETAR FASE ──
function completePhase() {
  clearTimeout(timer);
  running = false;
  const task   = document.getElementById('taskInput').value.trim();
  const isWork = phase === 'work';
  const workMin = activeProject ? activeProject.workMin : WORK_MIN_DEFAULT;

  pendingSession = {
    projectId: activeProject.id,
    type: phase,
    ts: Date.now(),
    task,
    note: '',
    workMin
  };

  playSound(isWork ? 880 : 660);
  notifyBrowser(isWork ? '🍅 Pomodoro completado!' : '☕ ¡A trabajar!');

  if (isWork) {
    openCloseModal();
  } else {
    commitPhase(false);
  }
}

function commitPhase(isWork) {
  if (pendingSession) {
    sessions.push(pendingSession);
    saveSessions();
    pendingSession = null;
  }
  if (isWork) {
    cycleCount++;
    if (cycleCount >= MAX_CYCLES) {
      phase = 'long';
      totalTime = timeLeft = LONG_MIN * 60;
      cycleCount = 0;
    } else {
      phase = 'short';
      totalTime = timeLeft = SHORT_MIN * 60;
    }
  } else {
    phase = 'work';
    totalTime = timeLeft = currentWorkSecs();
    showNotif('☕ Descanso terminado. ¡A trabajar!');
  }
  const icon = document.getElementById('mainBtnIcon');
  const lbl  = document.getElementById('mainBtnLabel');
  if (icon) icon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
  if (lbl)  lbl.textContent = 'Iniciar';
  updateDisplay();
  renderDashboard();
  renderHistory();
  renderProjects();
  updateDayCloseBtn();
}

// ── SONIDO ──
function playSound(frequency) {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)();
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start();
    osc.stop(ctx.currentTime + 0.6);
  } catch(e) {}
}

// ── NOTIFICACIÓN BROWSER ──
function notifyBrowser(msg) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('FocusFlow', { body: msg });
  }
}
