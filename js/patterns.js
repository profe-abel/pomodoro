/* ── PATTERNS: análisis de patrones de productividad ── */

const DAYS_ES   = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const DAYS_FULL = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
const MIN_SESSIONS_FOR_PATTERNS = 7;

function togglePatterns() {
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

function renderPatterns() {
  const workSessions = sessions.filter(s => s.type === 'work');
  const panel = document.getElementById('patternsPanel');

  if (workSessions.length < MIN_SESSIONS_FOR_PATTERNS) {
    panel.innerHTML = `
      <div class="sidebar-title" style="margin-bottom:.75rem">Patrones</div>
      <div class="pattern-empty">
        <div style="font-size:24px;margin-bottom:.5rem">📊</div>
        <div>Usá FocusFlow <strong>${MIN_SESSIONS_FOR_PATTERNS - workSessions.length} sesiones más</strong> para ver tus patrones de productividad.</div>
      </div>`;
    return;
  }

  panel.innerHTML = `
    <div class="sidebar-title" style="margin-bottom:.75rem">Patrones</div>
    <div id="patBestDay"   class="pattern-card"></div>
    <div id="patBestHour"  class="pattern-card"></div>
    <div id="patStreak"    class="pattern-card"></div>
    <div id="patProjects"  class="pattern-card"></div>`;

  _renderBestDay(workSessions);
  _renderBestHour(workSessions);
  _renderStreak(workSessions);
  _renderProjectBars(workSessions);
}

// ── Mejor día de la semana ──
function _renderBestDay(ws) {
  const byDay = Array(7).fill(0);
  const countByDay = Array(7).fill(0);

  // Agrupar por día de semana — promedio de pomos ese día
  const daySessions = {};
  ws.forEach(s => {
    const d = new Date(s.ts);
    const dow = d.getDay();
    const dateKey = d.toDateString();
    if (!daySessions[dow]) daySessions[dow] = {};
    daySessions[dow][dateKey] = (daySessions[dow][dateKey] || 0) + 1;
  });

  const dayAvg = Array(7).fill(0);
  for (let d = 0; d < 7; d++) {
    if (!daySessions[d]) continue;
    const days  = Object.keys(daySessions[d]).length;
    const total = Object.values(daySessions[d]).reduce((a, b) => a + b, 0);
    dayAvg[d] = total / days;
  }

  const best = dayAvg.indexOf(Math.max(...dayAvg));
  const avg  = dayAvg[best].toFixed(1);
  const max  = Math.max(...dayAvg, 0.1);

  document.getElementById('patBestDay').innerHTML = `
    <div class="pattern-label">Mejor día</div>
    <div class="pattern-value">${DAYS_FULL[best]}</div>
    <div class="pattern-sub">promedio ${avg} 🍅 / semana</div>
    <div class="pat-bars" style="margin-top:8px">
      ${dayAvg.map((v, i) => `
        <div class="pat-bar-col">
          <div class="pat-bar-fill${i === best ? ' best' : ''}"
               style="height:${Math.max(Math.round((v/max)*40),2)}px"></div>
          <div class="pat-bar-label">${DAYS_ES[i]}</div>
        </div>`).join('')}
    </div>`;
}

// ── Mejor franja horaria ──
function _renderBestHour(ws) {
  const slots = {}; // clave: hora par (0,2,4,...22)
  ws.forEach(s => {
    const h    = new Date(s.ts).getHours();
    const slot = h - (h % 2);
    slots[slot] = (slots[slot] || 0) + 1;
  });

  const bestSlot = Object.keys(slots).sort((a, b) => slots[b] - slots[a])[0];
  const count    = slots[bestSlot];
  const h1       = String(bestSlot).padStart(2,'0');
  const h2       = String(parseInt(bestSlot) + 2).padStart(2,'0');

  // Top 3 franjas
  const top3 = Object.entries(slots)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([h, c]) => {
      const ha = String(h).padStart(2,'0');
      const hb = String(parseInt(h)+2).padStart(2,'0');
      return `<div class="pattern-sub" style="margin-top:2px">${ha}:00–${hb}:00 → ${c} 🍅</div>`;
    }).join('');

  document.getElementById('patBestHour').innerHTML = `
    <div class="pattern-label">Mejor franja horaria</div>
    <div class="pattern-value">${h1}:00 – ${h2}:00</div>
    <div class="pattern-sub">${count} pomodoros en esa franja</div>
    ${top3}`;
}

// ── Racha actual ──
function _renderStreak(ws) {
  // Días únicos con al menos 1 pomo, ordenados desc
  const daySet = [...new Set(ws.map(s => new Date(s.ts).toDateString()))];
  const sorted = daySet.map(d => new Date(d)).sort((a, b) => b - a);

  let streak = 0;
  let check  = new Date();
  check.setHours(0,0,0,0);

  for (const d of sorted) {
    const dc = new Date(d); dc.setHours(0,0,0,0);
    const diff = Math.round((check - dc) / 86400000);
    if (diff === 0 || diff === 1) { streak++; check = dc; }
    else break;
  }

  const emoji  = streak >= 7 ? '🔥' : streak >= 3 ? '⚡' : '🌱';
  const msg    = streak >= 7 ? '¡Semana completa!' : streak >= 3 ? '¡Buen ritmo!' : 'Seguí así';

  document.getElementById('patStreak').innerHTML = `
    <div class="pattern-label">Racha actual</div>
    <div class="pattern-value">${emoji} ${streak} día${streak !== 1 ? 's' : ''}</div>
    <div class="pattern-sub">${msg}</div>`;
}

// ── Minutos por proyecto (últimas 4 semanas) ──
function _renderProjectBars(ws) {
  const since = Date.now() - 28 * 24 * 60 * 60 * 1000;
  const recent = ws.filter(s => s.ts >= since);

  const mins = {};
  recent.forEach(s => {
    mins[s.projectId] = (mins[s.projectId] || 0) + (s.workMin || WORK_MIN_DEFAULT);
  });

  if (!Object.keys(mins).length) {
    document.getElementById('patProjects').innerHTML =
      '<div class="pattern-label">Por proyecto</div><div class="pattern-sub">Sin datos recientes</div>';
    return;
  }

  const maxMins = Math.max(...Object.values(mins));
  const rows = Object.entries(mins)
    .sort((a, b) => b[1] - a[1])
    .map(([id, m]) => {
      const p   = projects.find(pr => pr.id == id);
      const pct = Math.round((m / maxMins) * 100);
      const h   = Math.floor(m / 60);
      const min = m % 60;
      const label = h > 0 ? `${h}h ${min}m` : `${min}m`;
      return `<div class="pat-proj-row">
        <div class="p-dot" style="background:${p ? p.color : '#666'}"></div>
        <div class="pat-proj-name">${p ? p.name : '—'}</div>
        <div class="pat-proj-bar-bg">
          <div class="pat-proj-bar-fill"
               style="width:${pct}%;background:${p ? p.color : 'var(--green)'}"></div>
        </div>
        <div class="pat-proj-time">${label}</div>
      </div>`;
    }).join('');

  document.getElementById('patProjects').innerHTML = `
    <div class="pattern-label">Por proyecto — últimas 4 semanas</div>
    <div style="margin-top:8px;display:flex;flex-direction:column;gap:6px">${rows}</div>`;
}
