/* ── APP: init, energy screen, eventos globales, service worker ── */

// ── ENERGY SCREEN ──
function selectEnergy(card) {
  document.querySelectorAll('.energy-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  energyMode = card.dataset.energy;
  document.getElementById('energyContinue').classList.add('active');
}

function launchApp() {
  if (!energyMode) return;
  const cfg = ENERGY_CONFIG[energyMode];

  document.getElementById('energyScreen').classList.add('hidden');
  document.getElementById('mainApp').classList.add('visible');

  document.getElementById('modeLabel').textContent       = cfg.label;
  document.getElementById('modeDot').style.background    = cfg.dotColor;
  document.getElementById('suggestionsTitle').textContent = cfg.tip;

  const tags = document.getElementById('suggestionsTags');
  tags.innerHTML = cfg.suggestions
    .map(s => `<span class="suggestion-tag" onclick="addFromSuggestion('${s}')">${s}</span>`)
    .join('');

  renderProjects();
  renderDashboard();
  renderHistory();
  updateDayCloseBtn();
  updateDisplay();
}

function resetDay() {
  clearTimeout(timer);
  running = false;
  activeProject = null;
  document.getElementById('mainApp').classList.remove('visible');
  document.getElementById('energyScreen').classList.remove('hidden');
  document.querySelectorAll('.energy-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('energyContinue').classList.remove('active');
  energyMode = null;
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  updateDisplay();

  // Permisos de notificación
  if ('Notification' in window) Notification.requestPermission();

  // Enter en input de proyecto
  document.getElementById('newProjectInput')
    .addEventListener('keydown', e => { if (e.key === 'Enter') addProject(); });

  // Modal cierre de pomodoro — contador de caracteres y atajos
  document.getElementById('closeNote').addEventListener('input', function () {
    document.getElementById('closeNoteChars').textContent = this.value.length;
  });
  document.getElementById('closeNote').addEventListener('keydown', e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) dismissModal(true);
    if (e.key === 'Escape') dismissModal(false);
  });

  // Modal cierre de día — guardar log al escribir
  document.getElementById('dayLogTextarea').addEventListener('input', function () {
    const dateStr = new Date().toISOString().slice(0, 10);
    saveDailyLog(dateStr, this.value);
  });

  // Cerrar modal día con Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.getElementById('dayModalOverlay').classList.contains('show')) {
      closeDayModal();
    }
  });
});

// ── SERVICE WORKER ──
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/pomodoro/sw.js')
      .then(() => console.log('FocusFlow SW registrado'))
      .catch(e => console.warn('SW error:', e));
  });
}
