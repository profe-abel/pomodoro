/* ── MODAL: cierre de pomodoro + cierre de día ── */

// ══ MODAL CIERRE DE POMODORO ══

function openCloseModal() {
  const p = projects.find(pr => pr.id === pendingSession.projectId);
  document.getElementById('modalProject').innerHTML =
    `<div class="p-dot" style="background:${p ? p.color : '#666'}"></div>${p ? p.name : ''}`;
  document.getElementById('closeNote').value = '';
  document.getElementById('closeNoteChars').textContent = '0';
  document.getElementById('modalOverlay').classList.add('show');
  setTimeout(() => document.getElementById('closeNote').focus(), 100);
}

function dismissModal(save) {
  if (save) {
    const note = document.getElementById('closeNote').value.trim();
    if (pendingSession) pendingSession.note = note;
  }
  document.getElementById('modalOverlay').classList.remove('show');
  commitPhase(true);
}

// ══ MODAL CIERRE DE DÍA ══

function updateDayCloseBtn() {
  const btn = document.getElementById('dayCloseBtn');
  if (!btn) return;
  const hayPomos = sessions.some(s => s.type === 'work' && isToday(s.ts));
  btn.classList.toggle('hidden', !hayPomos);
}

function openDayModal() {
  const todayWork = sessions.filter(s => s.type === 'work' && isToday(s.ts));
  const totalMins = todayWork.reduce((acc, s) => acc + (s.workMin || WORK_MIN_DEFAULT), 0);

  // Cabecera de métricas
  document.getElementById('dayMetrics').innerHTML =
    `<strong>${todayWork.length} pomodoros</strong> — 
     ${totalMins >= 60 ? `${Math.floor(totalMins/60)}h ${totalMins%60}m` : `${totalMins}m`} de foco`;

  // Desglose por proyecto
  const counts = {};
  todayWork.forEach(s => { counts[s.projectId] = (counts[s.projectId] || 0) + 1; });
  const maxCnt = Math.max(...Object.values(counts), 1);
  const breakdown = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, cnt]) => {
      const p   = projects.find(pr => pr.id == id);
      const pct = Math.round((cnt / maxCnt) * 100);
      return `<div class="day-project-row">
        <div class="p-dot" style="background:${p ? p.color : '#666'}"></div>
        <div style="font-size:12px;flex:1;color:var(--text2)">${p ? p.name : '—'}</div>
        <div class="day-bar-bg"><div class="day-bar-fill" style="width:${pct}%;background:${p ? p.color : 'var(--green)'}"></div></div>
        <div class="day-pomo-count">${cnt} 🍅</div>
      </div>`;
    }).join('');
  document.getElementById('dayBreakdown').innerHTML = breakdown || '<div class="empty-msg">Sin datos</div>';

  // Notas de cierre del día
  const notes = todayWork.filter(s => s.note).map(s =>
    `<div class="day-note-item">${s.note}</div>`
  );
  const notesEl = document.getElementById('dayNotes');
  notesEl.innerHTML = notes.length
    ? notes.join('')
    : '<div class="empty-msg">No escribiste notas de cierre hoy.</div>';

  // Log del día (textarea persistente)
  const dateStr = new Date().toISOString().slice(0, 10);
  document.getElementById('dayLogTextarea').value = getDailyLog(dateStr);
  document.getElementById('dayLogDate').textContent = dateStr;

  // Mostrar modal
  document.getElementById('dayModalOverlay').classList.add('show');
}

function closeDayModal() {
  // Guardar log al cerrar
  const dateStr = new Date().toISOString().slice(0, 10);
  const text = document.getElementById('dayLogTextarea').value.trim();
  saveDailyLog(dateStr, text);
  document.getElementById('dayModalOverlay').classList.remove('show');
}

function copyDaySummary() {
  const todayWork = sessions.filter(s => s.type === 'work' && isToday(s.ts));
  const totalMins = todayWork.reduce((acc, s) => acc + (s.workMin || WORK_MIN_DEFAULT), 0);
  const fecha     = new Date().toLocaleDateString('es-PY', { weekday:'long', day:'numeric', month:'long' });

  // Desglose por proyecto
  const counts = {};
  todayWork.forEach(s => { counts[s.projectId] = (counts[s.projectId] || 0) + 1; });
  const lines = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([id, cnt]) => {
      const p     = projects.find(pr => pr.id == id);
      const notes = todayWork.filter(s => s.projectId == id && s.note).map(s => `  → ${s.note}`);
      return `• ${p ? p.name : '—'} — ${cnt} 🍅\n${notes.join('\n')}`.trim();
    }).join('\n');

  const logText = document.getElementById('dayLogTextarea').value.trim();
  const resumen =
`📅 ${fecha}
🍅 ${todayWork.length} pomodoros — ${totalMins >= 60 ? `${Math.floor(totalMins/60)}h ${totalMins%60}m` : `${totalMins}m`} de foco

${lines}${logText ? `\n\nLogro del día: ${logText}` : ''}

_Generado con FocusFlow_`;

  navigator.clipboard.writeText(resumen).then(() => {
    const btn = document.getElementById('copyDayBtn');
    btn.textContent = '✓ Copiado';
    btn.classList.add('success');
    setTimeout(() => { btn.textContent = '📋 Copiar resumen'; btn.classList.remove('success'); }, 2000);
  }).catch(() => showNotif('No se pudo copiar — copiá el texto manualmente'));
}
