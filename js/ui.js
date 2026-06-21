/* ── UI: render proyectos, dashboard, historial, timer area, toast ── */

// ── PROYECTOS ──
function renderProjects() {
  const list = document.getElementById('projectList');
  if (!projects.length) {
    list.innerHTML = '<div class="empty-msg">Agrega un proyecto para empezar</div>';
    return;
  }

  const opts = WORK_MIN_OPTIONS.map(m => `<option value="${m}">${m}m</option>`).join('');

  list.innerHTML = projects.map(p => {
    const cnt = sessions.filter(s => s.projectId === p.id && isToday(s.ts) && s.type === 'work').length;
    const isActive = activeProject && activeProject.id === p.id;
    const selectedMin = p.workMin || WORK_MIN_DEFAULT;

    return `<div class="project-item${isActive ? ' active' : ''}" onclick="selectProject(${p.id})">
      <div class="p-dot" style="background:${p.color}"></div>
      <div class="p-name">${p.name}</div>
      <select class="p-workmin" onclick="event.stopPropagation()"
        onchange="setProjectWorkMin(${p.id}, this.value)" title="Duración del pomodoro">
        ${WORK_MIN_OPTIONS.map(m =>
          `<option value="${m}"${m === selectedMin ? ' selected' : ''}>${m}m</option>`
        ).join('')}
      </select>
      ${cnt ? `<div class="p-count">${cnt}</div>` : ''}
      <button class="p-delete"
        onclick="event.stopPropagation(); deleteProject(${p.id})"
        title="Eliminar">×</button>
    </div>`;
  }).join('');
}

// ── TIMER AREA ──
function updateTimerArea() {
  const noMsg     = document.getElementById('noProjectMsg');
  const timerArea = document.getElementById('timerArea');
  if (!activeProject) {
    noMsg.style.display    = 'block';
    timerArea.style.display = 'none';
    return;
  }
  noMsg.style.display    = 'none';
  timerArea.style.display = 'flex';
  document.getElementById('activeName').textContent      = activeProject.name;
  document.getElementById('activeDot').style.background  = activeProject.color;
}

// ── DASHBOARD ──
function renderDashboard() {
  const todayWork = sessions.filter(s => s.type === 'work' && isToday(s.ts));
  const mins      = todayWork.reduce((acc, s) => acc + (s.workMin || WORK_MIN_DEFAULT), 0);

  document.getElementById('metPomos').textContent =
    todayWork.length;
  document.getElementById('metFoco').textContent  =
    mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;

  // Proyecto top del día
  const counts = {};
  todayWork.forEach(s => { counts[s.projectId] = (counts[s.projectId] || 0) + 1; });
  const topId = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  const topP  = topId ? projects.find(p => p.id == topId) : null;
  document.getElementById('metTop').textContent =
    topP ? `${topP.name} (${counts[topId]} 🍅)` : '—';

  // Heatmap semanal
  const sw       = startOfWeek();
  const days     = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const todayIdx = new Date().getDay();
  let daysHTML = '', barsHTML = '', weekCounts = [];

  for (let i = 0; i < 7; i++) {
    const d   = new Date(sw);
    d.setDate(sw.getDate() + i);
    const cnt = sessions.filter(s => {
      const sd = new Date(s.ts);
      return s.type === 'work' && sd.toDateString() === d.toDateString();
    }).length;
    weekCounts.push(cnt);
    daysHTML += `<div class="week-day">${days[i]}</div>`;
  }
  const maxCnt = Math.max(...weekCounts, 1);
  for (let i = 0; i < 7; i++) {
    const pct = Math.round((weekCounts[i] / maxCnt) * 100);
    const cls = i === todayIdx ? 'today' : weekCounts[i] > 0 ? 'has-data' : '';
    barsHTML += `<div class="week-bar-wrap">
      <div class="week-bar ${cls}" style="height:${Math.max(pct, 4)}%"></div>
    </div>`;
  }
  document.getElementById('weekDays').innerHTML = daysHTML;
  document.getElementById('weekBars').innerHTML = barsHTML;
}

// ── HISTORIAL ──
function renderHistory() {
  const list   = document.getElementById('historyList');
  const recent = [...sessions].reverse().slice(0, 10);

  if (!recent.length) {
    list.innerHTML = '<div class="empty-msg">Sin sesiones aún.<br>¡Arrancá tu primer pomodoro!</div>';
    return;
  }
  list.innerHTML = recent.map(s => {
    const p     = projects.find(pr => pr.id === s.projectId);
    const color = p ? p.color : '#666';
    const name  = p ? p.name  : 'Proyecto eliminado';
    const t     = new Date(s.ts).toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    const icon  = s.type === 'work' ? '🍅' : '☕';
    const label = s.task || name;
    const title = s.note ? `${label} — ${s.note}` : label;
    return `<div class="history-item">
      <div class="h-dot" style="background:${color}"></div>
      <div class="h-project" title="${title}">${label}</div>
      <div class="h-type">${icon}</div>
      <div class="h-time">${t}</div>
    </div>`;
  }).join('');
}

// ── LIMPIAR HISTORIAL ──
function clearHistory() {
  if (!confirm('¿Borrar todo el historial de sesiones?')) return;
  sessions = [];
  saveSessions();
  renderDashboard();
  renderHistory();
  renderProjects();
  updateDayCloseBtn();
}

// ── EXPORTAR CSV ──
function exportCSV() {
  if (!sessions.length) { showNotif('Sin sesiones para exportar'); return; }
  const header = ['Fecha','Hora','Proyecto','Tipo','Tarea','Nota','Minutos'];
  const rows = sessions.map(s => {
    const p       = projects.find(pr => pr.id === s.projectId);
    const d       = new Date(s.ts);
    const fecha   = d.toLocaleDateString('es-PY');
    const hora    = d.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
    const proyecto = p ? p.name : 'Eliminado';
    const tipo    = s.type === 'work' ? 'Trabajo'
                  : s.type === 'short' ? 'Descanso corto' : 'Descanso largo';
    const tarea   = (s.task || '').replace(/"/g, '""');
    const nota    = (s.note || '').replace(/"/g, '""');
    const mins    = s.workMin || (s.type === 'work' ? WORK_MIN_DEFAULT : s.type === 'short' ? SHORT_MIN : LONG_MIN);
    return [fecha, hora, `"${proyecto}"`, tipo, `"${tarea}"`, `"${nota}"`, mins];
  });
  const csv  = [header, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  const today = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `focusflow-${today}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showNotif(`CSV exportado — ${sessions.length} sesiones`);
}

// ── TOAST ──
function showNotif(msg) {
  const n = document.getElementById('notif');
  n.textContent = msg;
  n.classList.add('show');
  setTimeout(() => n.classList.remove('show'), 3500);
}
