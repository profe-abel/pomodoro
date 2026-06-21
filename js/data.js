/* ── DATA: constantes, estado, persistencia, proyectos ── */

const COLORS = ['#1D9E75','#378ADD','#D85A30','#7F77DD','#BA7517','#D4537E','#639922','#E24B4A'];
const WORK_MIN_DEFAULT = 25;
const SHORT_MIN = 5;
const LONG_MIN  = 15;
const MAX_CYCLES = 4;
const WORK_MIN_OPTIONS = [15, 20, 25, 35, 45, 52];

const ENERGY_CONFIG = {
  high: {
    label: '⚡ Energía alta',
    dotColor: '#1D9E75',
    suggestions: ['Diseño BIM', 'Propuestas conceptuales', 'CimientoDigital', 'Contenido LinkedIn'],
    tip: 'Modo creativo: ideal para diseño, propuestas y contenido'
  },
  mid: {
    label: '🔋 Energía media',
    dotColor: '#378ADD',
    suggestions: ['Cómputos y costos', 'Documentación técnica', 'Presupuestos', 'ProspectaRed'],
    tip: 'Modo técnico: ideal para cómputos, Revit y ejecución'
  },
  low: {
    label: '🌙 Energía baja',
    dotColor: '#BA7517',
    suggestions: ['Responder mensajes', 'Actualizar CRM', 'Revisar facturas', 'Planificar mañana'],
    tip: 'Modo gestión: ideal para emails, admin y organización'
  }
};

// ── ESTADO GLOBAL ──
let projects     = null;
let sessions     = [];
let energyMode   = null;
let activeProject = null;
let pendingSession = null;

// ── PERSISTENCIA ──
function loadData() {
  projects = JSON.parse(localStorage.getItem('ff_projects') || 'null');
  if (!projects) {
    projects = [
      { id: 1, name: 'Consultora Construcción', color: COLORS[0], workMin: WORK_MIN_DEFAULT },
      { id: 2, name: 'CimientoDigital',         color: COLORS[1], workMin: WORK_MIN_DEFAULT },
      { id: 3, name: 'Katuetei Home',            color: COLORS[2], workMin: WORK_MIN_DEFAULT },
      { id: 4, name: 'ProspectaRed',             color: COLORS[3], workMin: WORK_MIN_DEFAULT }
    ];
    saveProjects();
  }
  // migrar proyectos viejos sin workMin
  projects = projects.map(p => ({ workMin: WORK_MIN_DEFAULT, ...p }));
  sessions = JSON.parse(localStorage.getItem('ff_sessions') || '[]');
}

function saveProjects() {
  localStorage.setItem('ff_projects', JSON.stringify(projects));
}

function saveSessions() {
  localStorage.setItem('ff_sessions', JSON.stringify(sessions));
}

// ── PROYECTOS ──
function addProject() {
  const inp  = document.getElementById('newProjectInput');
  const name = inp.value.trim();
  if (!name) return;
  const color = COLORS[projects.length % COLORS.length];
  projects.push({ id: Date.now(), name, color, workMin: WORK_MIN_DEFAULT });
  saveProjects();
  inp.value = '';
  renderProjects();
}

function addFromSuggestion(name) {
  if (projects.find(p => p.name === name)) return;
  const color = COLORS[projects.length % COLORS.length];
  projects.push({ id: Date.now(), name, color, workMin: WORK_MIN_DEFAULT });
  saveProjects();
  renderProjects();
}

function deleteProject(id) {
  projects = projects.filter(p => p.id !== id);
  if (activeProject && activeProject.id === id) {
    activeProject = null;
    resetTimer();
    updateTimerArea();
  }
  saveProjects();
  renderProjects();
}

function setProjectWorkMin(id, min) {
  const p = projects.find(pr => pr.id === id);
  if (!p) return;
  p.workMin = parseInt(min);
  saveProjects();
  // si es el proyecto activo y el timer no corre, actualizar
  if (activeProject && activeProject.id === id) {
    activeProject = p;
    if (!running) resetTimer();
  }
}

function selectProject(id) {
  const p = projects.find(pr => pr.id === id);
  if (!p) return;
  activeProject = p;
  resetTimer();
  renderProjects();
  updateTimerArea();
}

// ── HELPERS DE FECHA ──
function isToday(ts) {
  const d = new Date(ts), n = new Date();
  return d.toDateString() === n.toDateString();
}

function startOfWeek() {
  const n = new Date();
  n.setHours(0, 0, 0, 0);
  n.setDate(n.getDate() - n.getDay());
  return n;
}

function getDailyLog(dateStr) {
  return localStorage.getItem(`ff_log_${dateStr}`) || '';
}

function saveDailyLog(dateStr, text) {
  localStorage.setItem(`ff_log_${dateStr}`, text);
}
