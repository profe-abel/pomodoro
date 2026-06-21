/* ── TIMER: fases, ciclos, tick, sonido, modo Flow ── */

let timer        = null;
let running      = false;
let phase        = 'work';
let cycleCount   = 0;
let timeLeft     = WORK_MIN_DEFAULT * 60;
let totalTime    = WORK_MIN_DEFAULT * 60;

// Flow
let flowExtensions  = 0;
let flowBannerTimer = null;
const MAX_FLOW_EXT  = 3;
const FLOW_EXTRA    = 10; // minutos por extensión

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
  // Indicador de extensiones de flow activas
  const ext = document.getElementById('flowExtIndicator');
  if (ext) ext.textContent = flowExtensions > 0 ? `+${flowExtensions * FLOW_EXTRA}m flow` : '';
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
  flowExtensions = 0;
  timeLeft = totalTime = currentWorkSecs();
  cycleCount = 0;
  hideFlowBanner();
  updateDisplay();
  const icon = document.getElementById('mainBtnIcon');
  const lbl  = document.getElementById('mainBtnLabel');
  if (icon) icon.innerHTML = '<polygon points="5,3 19,12 5,21"/>';
  if (lbl)  lbl.textContent = 'Iniciar';
}

function skipPhase() {
  clearTimeout(timer);
  running = false;
  hideFlowBanner();
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
  const task    = document.getElementById('taskInput').value.trim();
  const isWork  = phase === 'work';
  const workMin = (activeProject ? activeProject.workMin : WORK_MIN_DEFAULT) + (flowExtensions * FLOW_EXTRA);

  pendingSession = {
    projectId: activeProject.id,
    type: phase,
    ts: Date.now(),
    task,
    note: '',
    workMin,
    flowExtensions
  };

  playSound(isWork ? 880 : 660);
  notifyBrowser(isWork ? '🍅 Pomodoro completado!' : '☕ ¡A trabajar!');

  if (isWork) {
    showFlowBanner(); // primero pregunta si sigue en flow
  } else {
    commitPhase(false);
  }
}

function commitPhase(isWork) {
  flowExtensions = 0;
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

// ── MODO FLOW ──
let flowCountdown = 10;

function showFlowBanner() {
  if (flowExtensions >= MAX_FLOW_EXT) {
    // Ya usó las 3 extensiones — ir directo al modal
    openCloseModal();
    return;
  }
  flowCountdown = 10;
  const banner = document.getElementById('flowBanner');
  const cd     = document.getElementById('flowCountdown');
  if (!banner) { openCloseModal(); return; }
  banner.classList.add('show');
  cd.textContent = flowCountdown;
  flowBannerTimer = setInterval(() => {
    flowCountdown--;
    cd.textContent = flowCountdown;
    if (flowCountdown <= 0) {
      hideFlowBanner();
      openCloseModal();
    }
  }, 1000);
}

function hideFlowBanner() {
  clearInterval(flowBannerTimer);
  const banner = document.getElementById('flowBanner');
  if (banner) banner.classList.remove('show');
}

function extendFlow() {
  if (flowExtensions >= MAX_FLOW_EXT) return;
  hideFlowBanner();
  flowExtensions++;
  timeLeft  = FLOW_EXTRA * 60;
  totalTime = FLOW_EXTRA * 60;
  phase     = 'work';
  running   = true;
  // actualizar workMin del pendingSession con la extensión acumulada
  if (pendingSession) {
    pendingSession.workMin += FLOW_EXTRA;
    pendingSession.flowExtensions = flowExtensions;
  }
  const icon = document.getElementById('mainBtnIcon');
  const lbl  = document.getElementById('mainBtnLabel');
  if (icon) icon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  if (lbl)  lbl.textContent = 'Pausar';
  showNotif(`⚡ Flow extendido +${FLOW_EXTRA}min (${flowExtensions}/${MAX_FLOW_EXT})`);
  updateDisplay();
  tick();
}

function closeFlow() {
  hideFlowBanner();
  openCloseModal();
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
