/* ── APP: init, energy screen, eventos globales, service worker ── */

// ── ENERGY SECTION ──
function selectEnergy(card) {
  document.querySelectorAll('.energy-card').forEach(c => c.classList.remove('selected'));
  card.classList.add('selected');
  energyMode = card.dataset.energy;

  const cfg = ENERGY_CONFIG[energyMode];
  document.getElementById('modeLabel').textContent = cfg.label;
  document.getElementById('modeDot').style.background = cfg.dotColor;
  document.getElementById('suggestionsTitle').textContent = cfg.tip;

  const tags = document.getElementById('suggestionsTags');
  tags.innerHTML = cfg.suggestions
    .map(s => `<span class="suggestion-tag" onclick="addFromSuggestion('${s}')">${s}</span>`)
    .join('');
  document.getElementById('suggestionsBox').style.display = 'block';

  const names = { high: 'Alta', mid: 'Media', low: 'Baja' };
  document.getElementById('energyCollapseLabel').textContent = `Energía: ${names[energyMode]}`;

  collapseEnergy();

  if (projects) {
    renderProjects();
    renderDashboard();
    renderHistory();
    updateDayCloseBtn();
  }
}

function toggleEnergy() {
  const section = document.getElementById('energySection');
  const chevron = document.getElementById('energyChevron');
  const isCollapsed = section.classList.contains('collapsed');
  if (isCollapsed) {
    section.classList.remove('collapsed');
    chevron.textContent = 'expand_more';
  } else {
    section.classList.add('collapsed');
    chevron.textContent = 'expand_less';
  }
}

function collapseEnergy() {
  document.getElementById('energySection').classList.add('collapsed');
  document.getElementById('energyChevron').textContent = 'expand_less';
}

function resetDay() {
  clearTimeout(timer);
  running = false;
  activeProject = null;
  energyMode = null;

  document.querySelectorAll('.energy-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('suggestionsBox').style.display = 'none';
  document.getElementById('modeLabel').textContent = '—';
  document.getElementById('modeDot').style.background = 'transparent';
  document.getElementById('energyCollapseLabel').textContent = 'Seleccioná tu nivel de energía';
  document.getElementById('energySection').classList.remove('collapsed');
  document.getElementById('energyChevron').textContent = 'expand_more';

  resetTimer();
  updateTimerArea();
  renderProjects();
  renderDashboard();
  renderHistory();
  updateDayCloseBtn();
}

// ── BOTTOM NAV ──
function scrollToSection(btn, id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  document.querySelectorAll('.bottom-nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function openPatternsFromNav() {
  const dash = document.getElementById('dashPanel');
  const pat  = document.getElementById('patternsPanel');
  const btn  = document.getElementById('patternToggle');
  const showing = !pat.classList.contains('hidden');
  if (showing) {
    pat.classList.add('hidden');
    dash.classList.remove('hidden');
    btn.textContent = 'Patrones →';
  } else {
    dash.classList.add('hidden');
    pat.classList.remove('hidden');
    btn.textContent = '← Dashboard';
    renderPatterns();
  }
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  renderProjects();
  renderDashboard();
  renderHistory();
  updateDayCloseBtn();
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
