/* TempRun — app principal (estado + render). Sin dependencias externas. */

const ICONS = {
  logo: `<svg width="26" height="26" viewBox="0 0 28 28"><path d="M2 20 L8 8 L14 16 L20 6 L26 14" stroke="var(--accent)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  panel: `<svg viewBox="0 0 24 24" width="17" height="17"><rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/></svg>`,
  plan: `<svg viewBox="0 0 24 24" width="17" height="17"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.6"/><line x1="7" y1="3" x2="7" y2="7" stroke="currentColor" stroke-width="1.6"/><line x1="17" y1="3" x2="17" y2="7" stroke="currentColor" stroke-width="1.6"/></svg>`,
  tools: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M14.7 6.3a3 3 0 0 1-3.9 3.9L5 16l3 3 5.8-5.8a3 3 0 0 1 3.9-3.9L21 6l-3-3-3.3 3.3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  perfil: `<svg viewBox="0 0 24 24" width="17" height="17"><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 20c0-3.6 3.2-6 8-6s8 2.4 8 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  lightning: `<svg viewBox="0 0 24 24" width="19" height="19"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="var(--accent)"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 5h16v11H9l-4 4V5z" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  chatNav: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M4 5h16v11H9l-4 4V5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  weather: `<svg viewBox="0 0 24 24" width="17" height="17"><circle cx="12" cy="12" r="4" fill="var(--warn)"/><g stroke="var(--warn)" stroke-width="1.6"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></g></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></g></svg>`,
  strava: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="var(--accent)"/></svg>`,
  person: `<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="8" r="3.5" fill="none" stroke="var(--muted)" stroke-width="1.6"/><path d="M4 20c0-3.6 3.2-6 8-6s8 2.4 8 6" fill="none" stroke="var(--muted)" stroke-width="1.6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3c0 1.1-.9 2-2 2C10.6 19 5 13.4 5 6c0-1.1.9-2 2-2z" fill="none" stroke="var(--muted)" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
  people: `<svg viewBox="0 0 24 24" width="17" height="17"><circle cx="9" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="17" cy="9" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M15 20c0-2.2 1-4 3.5-4.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M20 11a8 8 0 1 0-2.3 5.7M20 5v6h-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m2 0-.8 12.1a2 2 0 0 1-2 1.9H9.8a2 2 0 0 1-2-1.9L7 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  mountain: `<svg viewBox="0 0 24 24" width="19" height="19"><path d="M3 19 9.5 7l3.2 5.6L15 9l6 10z" fill="var(--accent)" stroke="var(--accent)" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  trophy: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M7 4h10v4a5 5 0 0 1-10 0V4z" fill="none" stroke="var(--accent)" stroke-width="1.6"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3" fill="none" stroke="var(--accent)" stroke-width="1.6"/><path d="M12 13v3M9 20h6M10 20v-2.5h4V20" fill="none" stroke="var(--accent)" stroke-width="1.6"/></svg>`,
  trendUp: `<svg viewBox="0 0 24 24" width="16" height="16" style="flex:none;margin-top:1px;"><path d="M3 17 9.5 10.5 14 15l7-8" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M16 7h5v5" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  pin: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" fill="none" stroke="var(--accent)" stroke-width="1.6"/><circle cx="12" cy="9.5" r="2.2" fill="none" stroke="var(--accent)" stroke-width="1.6"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" width="13" height="13"><circle cx="12" cy="12" r="8.5" fill="none" stroke="var(--good)" stroke-width="1.6"/><path d="M12 7.5V12l3 2" fill="none" stroke="var(--good)" stroke-width="1.6" stroke-linecap="round"/></svg>`,
  paceIcon: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="var(--accent)"/></svg>`,
  raceClose: `<svg viewBox="0 0 24 24" width="13" height="13"><path d="M5 5l14 14M19 5 5 19" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M12 20.5s-7.5-4.6-9.7-9.3C.7 7.6 2.7 4 6.3 4c1.9 0 3.5 1 4.7 2.5C12.2 5 13.8 4 15.7 4c3.6 0 5.6 3.6 4 7.2C17.5 15.9 12 20.5 12 20.5z" fill="var(--accent)"/></svg>`,
};
function sessionIcon(typeTag) {
  return typeTag === "CUESTAS" ? ICONS.mountain : ICONS.lightning;
}

const ACCOUNTS_KEY = "temprun_accounts";
const SESSION_KEY = "temprun_session";
const COACH_EMAIL = "coach@temprun.club";
const COACH_PASSWORD = "TempRun2026";

/* ---------------- SUPABASE (cuentas compartidas entre dispositivos) ----------------
   La clave "publishable" es segura para exponer en el navegador: la tabla "accounts"
   tiene una policy de Row Level Security abierta pensada para esta beta cerrada (ver
   el SQL de setup). localStorage sigue siendo la fuente de verdad instantánea de este
   dispositivo — Supabase es una capa de sincronización en segundo plano por arriba. */
const SUPABASE_URL = "https://bhbexadljhubqpsbsale.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_vlCEFRIgMe1XkNvql-YOCg_F5Ho2BkZ";
const sb = typeof window !== "undefined" && window.supabase && SUPABASE_URL ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const SUPABASE_SYNC_INTERVAL_MS = 8000;
// campos del perfil de un atleta que puede escribir el coach desde su propio dispositivo —
// al sincronizar, solo estos se pisan con lo que venga del servidor para la cuenta propia
// (todo lo demás sigue mandando el estado local, para no perder ediciones en curso).
const COACH_WRITABLE_PROFILE_FIELDS = ["chatMessages", "coachMessage", "dayOverrides", "stravaActivities"];

async function pushAccountsToSupabase(accounts) {
  if (!sb) return;
  const rows = Object.entries(accounts).map(([email, data]) => ({ email, data }));
  if (!rows.length) return;
  try {
    const { error } = await sb.from("accounts").upsert(rows);
    if (error) console.warn("Supabase: no se pudo guardar", error.message);
  } catch (e) {
    console.warn("Supabase: error de red al guardar", e);
  }
}

async function pullAccountsFromSupabase() {
  if (!sb) return;
  try {
    const { data, error } = await sb.from("accounts").select("email,data");
    if (error || !data) {
      if (error) console.warn("Supabase: no se pudo sincronizar", error.message);
      return;
    }
    const local = loadAccounts();
    let changed = false;
    for (const row of data) {
      const remote = row.data;
      const isMe = row.email === state.currentEmail;
      if (isMe && state.role === "athlete" && state.profile && remote && remote.profile) {
        COACH_WRITABLE_PROFILE_FIELDS.forEach((f) => {
          if (JSON.stringify(state.profile[f]) !== JSON.stringify(remote.profile[f])) {
            state.profile[f] = remote.profile[f];
            changed = true;
          }
        });
        if (local[row.email]) local[row.email].profile = state.profile;
      } else if (!isMe) {
        if (JSON.stringify(local[row.email]) !== JSON.stringify(remote)) {
          local[row.email] = remote;
          changed = true;
        }
      }
    }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(local));
    if (changed) render();
  } catch (e) {
    console.warn("Supabase: error de red al sincronizar", e);
  }
}
const GROUP_LABELS = { "3k": "3K", "5k": "5K", "10k": "10K" };
const GROUP_ORDER = ["3k", "5k", "10k"];
const PLAN_TYPE_OPTIONS = [
  ["rest", "Descanso"],
  ["easy", "Rodaje suave"],
  ["fartlek", "Fartlek"],
  ["cuestas", "Cuestas fuerza-resistencia"],
  ["series", "Series"],
  ["ritmo", "Ritmo de carrera"],
  ["long", "Fondo largo"],
  ["caco", "CACO (caminar-correr)"],
];

function loadAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
}
function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  pushAccountsToSupabase(accounts);
}
function ensureCoachAccount() {
  const accounts = loadAccounts();
  if (!accounts[COACH_EMAIL]) {
    accounts[COACH_EMAIL] = { password: COACH_PASSWORD, role: "coach", profile: null };
    saveAccounts(accounts);
  }
}

function defaultProfileState() {
  return {
    fullName: "",
    phone: "",
    gender: "Masculino",
    birthdate: "",
    weight: "",
    height: "",
    fcRest: "",
    healthNotes: "",
    goalName: "",
    // arranca en la distancia más chica: para alguien que recién empieza (objetivo tipo
    // "sentirme mejor", sin carrera en mente) es una sobrepromesa forzarlo a 10K sin que
    // lo haya elegido — mejor pedirle que suba el objetivo a propósito, no que lo bajemos.
    goalDistance: "3K / 3000m",
    goalDate: "",
    weeklyKm: 11,
    levelAnswers: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "" },
    availability: { Lun: true, Mar: false, Mié: true, Jue: false, Vie: true, Sáb: false, Dom: false },
    pbs: { walk: "", p3k: "", p5k: "", p10k: "" },
    completed: {},
    dayOverrides: {},
    coachMessage: "",
    stravaStatus: "disconnected",
    stravaConnectedAt: null,
    stravaActivities: {}, // { [weekIndex-dayIndex]: { km, durationMin, pace, syncedAt } }
    chatMessages: [],
    coachReadCount: 0,
    onboardingDone: false,
    raceLog: [], // [{ id, distKey: "p3k"|"p5k"|"p10k", date: "YYYY-MM-DD", timeSec }]
  };
}

let state = {
  screen: "login", // login | onboarding | compiling | app
  loginScreen: "signin", // signin | signup | recover
  loginEmail: "",
  loginPassword: "",
  signupName: "",
  signupEmail: "",
  signupPassword: "",
  loginError: "",
  recoverStep: "email", // email | reset | done
  recoverEmail: "",
  recoverFoundEmail: "",
  recoverPassword1: "",
  recoverPassword2: "",
  recoverError: "",
  currentEmail: null,
  role: "athlete",
  onboardingStep: 1,
  compileStep: 0,
  theme: "dark",
  athleteTab: "panel",
  perfilTab: "datos", // datos | carreras | fisiologia | salud | membresia
  weekIndex: 0,
  expandedKey: null,
  selectedDayIdx: null,
  chatInput: "",
  profile: defaultProfileState(),
  // coach-only
  coachView: "roster", // roster | detail
  selectedAthleteEmail: null,
  coachBroadcast: "",
  coachWeekIndex: 0,
  coachExpandedKey: null,
  coachChatInput: "",
  coachSearch: "",
  coachKmDraft: {}, // { [dayIdx]: texto tal cual lo está tipeando el coach, para no reformatear a mitad de tipeo }
  coachEdgeDraft: {}, // { "[dayIdx]-warmupMinOverride"|"[dayIdx]-cooldownMinOverride": texto tal cual se tipea }
  stravaJustSynced: false,
  // clima/ubicación del panel — se completa una sola vez por sesión vía geolocalización
  weatherStatus: "idle", // idle | loading | ready | denied | error | unsupported
  weatherCity: "",
  weatherTemp: null,
  // herramientas calculators (local, not persisted)
  toolDistance: "5000",
  toolCustomKm: "",
  toolH: "",
  toolM: "",
  toolS: "",
  toolGlossaryOpen: false,
  // medidor de FC en reposo (contador de pulsaciones con cronómetro propio)
  pulseMode: "tap", // tap: tocar la pantalla en cada latido | count: cronómetro sin tocar, cargar el total al final
  pulseRunning: false,
  pulseStartedAt: null,
  pulseTaps: 0,
  pulseDuration: 30,
  pulseResult: null,
  pulseSaved: false,
  pulseAwaitingCount: false,
  toolPulseManualCount: "",
  // formulario de carga de carreras (registro cronológico), no persistido hasta agregar
  raceFormDist: "p5k",
  raceFormName: "",
  raceFormDate: "",
  raceFormH: "",
  raceFormM: "",
  raceFormS: "",
  // custom date picker

  openDatePicker: null, // bind path currently open, or null
  datePickerView: {}, // { [path]: { year, month } } month is 0-11
  // selector de número tipo "rueda" (scroll + tap), reemplaza el tipeo libre
  openNumPicker: null, // bind path currently open, or null
};

/* ---------------- CUSTOM DATE PICKER ---------------- */

const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
const WEEKDAY_LETTERS = ["L", "M", "X", "J", "V", "S", "D"];

function formatDateDisplay(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function isoFromYmd(y, m, d) {
  return `${y}-${pad2(m + 1)}-${pad2(d)}`;
}
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function renderDatePicker(path, isoValue, opts) {
  opts = opts || {};
  const minYear = opts.minYear || 1940;
  const maxYear = opts.maxYear || new Date().getFullYear();
  const isOpen = state.openDatePicker === path;
  const today = new Date();

  let view = state.datePickerView[path];
  if (!view) {
    if (isoValue) {
      const [y, m] = isoValue.split("-").map(Number);
      view = { year: y, month: m - 1 };
    } else {
      view = { year: Math.min(maxYear, Math.max(minYear, opts.defaultYear || today.getFullYear())), month: today.getMonth() };
    }
  }

  const years = [];
  for (let y = maxYear; y >= minYear; y--) years.push(y);

  const firstDow = (new Date(view.year, view.month, 1).getDay() + 6) % 7; // Monday=0
  const totalDays = daysInMonth(view.year, view.month);
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  return `
    <div class="datefield">
      <button type="button" class="date-toggle" data-action="toggleDatePicker" data-path="${esc(path)}" data-default-year="${opts.defaultYear || ""}">
        <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.6"/></svg>
        <span class="${isoValue ? "" : "placeholder"}">${isoValue ? formatDateDisplay(isoValue) : "dd/mm/aaaa"}</span>
      </button>
      ${
        isOpen
          ? `
        <div class="date-overlay" data-action="closeDatePicker"></div>
        <div class="date-popup">
          <div class="date-popup-header">
            <button type="button" class="date-nav-btn" data-action="dpPrevMonth" data-path="${esc(path)}">‹</button>
            <select class="date-sel" data-action="dpSetMonth" data-path="${esc(path)}">
              ${MONTH_NAMES.map((mn, i) => `<option value="${i}" ${i === view.month ? "selected" : ""}>${mn}</option>`).join("")}
            </select>
            <select class="date-sel" data-action="dpSetYear" data-path="${esc(path)}">
              ${years.map((y) => `<option value="${y}" ${y === view.year ? "selected" : ""}>${y}</option>`).join("")}
            </select>
            <button type="button" class="date-nav-btn" data-action="dpNextMonth" data-path="${esc(path)}">›</button>
          </div>
          <div class="date-weekdays">${WEEKDAY_LETTERS.map((w) => `<span>${w}</span>`).join("")}</div>
          <div class="date-grid">
            ${cells
              .map((d) => {
                if (d == null) return `<span class="date-cell empty"></span>`;
                const iso = isoFromYmd(view.year, view.month, d);
                const isSelected = iso === isoValue;
                const isToday = iso === isoFromYmd(today.getFullYear(), today.getMonth(), today.getDate());
                return `<button type="button" class="date-cell${isSelected ? " selected" : ""}${isToday ? " today" : ""}" data-action="dpSelectDay" data-path="${esc(path)}" data-iso="${iso}">${d}</button>`;
              })
              .join("")}
          </div>
        </div>`
          : ""
      }
    </div>`;
}

/* ---------------- SELECTOR DE NÚMERO (RUEDA) ---------------- */
// Reemplaza el tipeo libre por una lista deslizable: se desliza para acercar el valor
// y se toca para confirmarlo — igual de rápido en el celu que el teclado numérico, sin
// el vaivén de mostrar/ocultar el teclado del sistema en cada campo.
function renderNumberPicker(path, value, opts) {
  opts = opts || {};
  const min = opts.min != null ? opts.min : 0;
  const max = opts.max != null ? opts.max : 100;
  const step = opts.step || 1;
  const unit = opts.unit || "";
  const isOpen = state.openNumPicker === path;
  const hasValue = value !== "" && value != null;

  const items = [];
  for (let n = min; n <= max; n += step) items.push(n);

  return `
    <div class="numfield">
      <button type="button" class="date-toggle" data-action="toggleNumPicker" data-path="${esc(path)}">
        <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 9h16M4 15h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        <span class="${hasValue ? "" : "placeholder"}">${hasValue ? value + (unit ? " " + unit : "") : opts.placeholder || "Elegir"}</span>
      </button>
      ${
        isOpen
          ? `
        <div class="date-overlay" data-action="closeNumPicker"></div>
        <div class="num-popup">
          <div class="date-popup-header" style="justify-content:center;">${opts.label || "Elegí un valor"}${unit ? ` (${unit})` : ""}</div>
          <div class="num-scroll-list" data-path="${esc(path)}">
            ${items
              .map((n) => `<button type="button" class="num-cell${n === value || String(n) === String(value) ? " selected" : ""}" data-action="numSelect" data-path="${esc(path)}" data-val="${n}">${n}</button>`)
              .join("")}
          </div>
        </div>`
          : ""
      }
    </div>`;
}

function setState(patch) {
  Object.assign(state, typeof patch === "function" ? patch(state) : patch);
  render();
}
function setProfile(patch) {
  Object.assign(state.profile, typeof patch === "function" ? patch(state.profile) : patch);
  render();
}

const root = document.getElementById("root");

function focusSelector(el) {
  if (!el || !el.dataset) return null;
  const d = el.dataset;
  if (d.bind) return `[data-bind="${cssEsc(d.bind)}"]`;
  if (d.action === "coachSetDayKm") return `[data-action="coachSetDayKm"][data-idx="${cssEsc(d.idx)}"]`;
  if (d.action === "coachSetEdge") return `[data-action="coachSetEdge"][data-idx="${cssEsc(d.idx)}"][data-part="${cssEsc(d.part)}"]`;
  if (d.action === "broadcastInput" || d.action === "athleteMessageInput" || d.action === "coachSearchInput") return `[data-action="${d.action}"]`;
  return null;
}
function cssEsc(v) {
  return String(v).replace(/["\\]/g, "\\$&");
}

let pulseIntervalId = null;
function pulseTick() {
  if (!state.pulseRunning) return;
  const elapsed = (Date.now() - state.pulseStartedAt) / 1000;
  if (elapsed >= state.pulseDuration) {
    clearInterval(pulseIntervalId);
    pulseIntervalId = null;
    state.pulseRunning = false;
    if (state.pulseMode === "count") {
      // en este modo el atleta cuenta de memoria sin tocar la pantalla — recién al
      // terminar el cronómetro carga cuántos latidos sintió y ahí se calcula el bpm.
      state.pulseAwaitingCount = true;
    } else {
      state.pulseResult = Math.round((state.pulseTaps / state.pulseDuration) * 60);
    }
  }
  render();
}

function render() {
  document.documentElement.setAttribute("data-theme", state.theme);

  const active = root.contains(document.activeElement) ? document.activeElement : null;
  const sel = active ? focusSelector(active) : null;
  const selStart = active && "selectionStart" in active ? active.selectionStart : null;
  const selEnd = active && "selectionEnd" in active ? active.selectionEnd : null;

  let html = "";
  if (state.screen === "login") html = renderAuth();
  else if (state.screen === "onboarding") html = renderOnboarding();
  else if (state.screen === "compiling") html = renderCompiling();
  else if (state.screen === "app") html = renderApp();
  root.innerHTML = html;

  if (sel) {
    const next = root.querySelector(sel);
    if (next) {
      next.focus({ preventScroll: true });
      if (selStart != null && "setSelectionRange" in next) {
        try {
          next.setSelectionRange(selStart, selEnd);
        } catch (e) {}
      }
    }
  }
  bindDynamicListeners();
}

/* ---------------- AUTH ---------------- */

function renderAuth() {
  if (state.loginScreen === "recover") return renderRecover();
  const isSignup = state.loginScreen === "signup";
  return `
  <div class="auth-screen">
    <div class="auth-card">
      <div class="auth-logo">${ICONS.logo}<div>TEMPRUN</div></div>
      <div class="auth-title">${isSignup ? "Creá tu cuenta" : "Ingresá a tu cuenta"}</div>
      <div class="auth-subtitle">${isSignup ? "Sumate al club y empezá tu plan." : "Usá tu email y contraseña, o entrá con Google / Apple."}</div>

      <button class="social-btn" data-action="loginWithGoogle">
        <svg width="16" height="16" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 5 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.2-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3 0 5.8 1.1 7.9 3l5.7-5.7C34.5 7 29.5 5 24 5c-7.8 0-14.4 4.5-17.7 9.7z"/><path fill="#4CAF50" d="M24 43c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 34 26.8 35 24 35c-5.3 0-9.7-3.6-11.3-8.4l-6.5 5C9.5 38.5 16.2 43 24 43z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.3 4.4-4.3 5.9l6.3 5.3C40.9 36.6 43 30.9 43 24c0-1.2-.1-2.4-.4-3.5z"/></svg>
        Continuar con Google
      </button>
      <button class="social-btn apple" data-action="loginWithApple">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M16.365 1.43c0 1.14-.417 2.06-1.25 2.86-.86.82-1.9 1.29-2.99 1.2-.12-1.1.42-2.24 1.24-3.02.85-.82 2-1.34 3-1.4v.36zM20.6 17.5c-.55 1.27-.82 1.84-1.53 2.97-1 1.58-2.4 3.54-4.14 3.55-1.54.02-1.94-1-4.03-1-2.1 0-2.54 1-4.06 1.02-1.72.02-3.03-1.7-4.03-3.27C.83 17.4.05 13.28 1.5 10.5c.72-1.38 2-2.25 3.4-2.27 1.5-.03 2.4 1.02 4.02 1.02 1.6 0 2.4-1.02 4.1-.98.7.03 2.65.28 3.9 2.13-.1.06-2.33 1.36-2.3 4.05.03 3.22 2.83 4.28 2.98 4.55z"/></svg>
        Continuar con Apple
      </button>

      <div class="divider-row"><div class="line"></div><span>O CON TU CUENTA</span><div class="line"></div></div>

      ${state.loginError ? `<div class="auth-error">${state.loginError}</div>` : ""}

      ${
        isSignup
          ? `
        <input class="field-input" type="text" placeholder="Nombre completo" data-bind="signupName" value="${esc(state.signupName)}">
        <input class="field-input" type="email" placeholder="Email" data-bind="signupEmail" value="${esc(state.signupEmail)}">
        <input class="field-input" type="password" placeholder="Contraseña (mínimo 4 caracteres)" data-bind="signupPassword" value="${esc(state.signupPassword)}">
        <button class="btn-accent" data-action="doSignup">Crear cuenta</button>
        <button class="btn-outline-block" data-action="goSignin">Ya tengo cuenta</button>
      `
          : `
        <input class="field-input" type="email" placeholder="Email" data-bind="loginEmail" value="${esc(state.loginEmail)}">
        <input class="field-input" type="password" placeholder="Contraseña" data-bind="loginPassword" value="${esc(state.loginPassword)}">
        <div class="forgot-row"><button class="link-btn" data-action="goRecover">¿Olvidaste tu contraseña?</button></div>
        <button class="btn-accent" data-action="doLogin">Ingresar</button>
        <button class="btn-outline-block" data-action="goSignup">Crear cuenta</button>
      `
      }
    </div>
  </div>`;
}

function renderRecover() {
  let body = "";
  if (state.recoverStep === "email") {
    body = `
      <div class="auth-title">Recuperar contraseña</div>
      <div class="auth-subtitle">Ingresá el email de tu cuenta para restablecer la contraseña.</div>
      ${state.recoverError ? `<div class="auth-error">${state.recoverError}</div>` : ""}
      <input class="field-input" type="email" placeholder="Email" data-bind="recoverEmail" value="${esc(state.recoverEmail)}">
      <button class="btn-accent" data-action="checkRecoverEmail">Continuar</button>`;
  } else if (state.recoverStep === "reset") {
    body = `
      <div class="auth-title">Elegí una nueva contraseña</div>
      <div class="auth-subtitle">Cuenta: <strong style="color:var(--text)">${esc(state.recoverFoundEmail)}</strong></div>
      ${state.recoverError ? `<div class="auth-error">${state.recoverError}</div>` : ""}
      <input class="field-input" type="password" placeholder="Nueva contraseña (mínimo 4 caracteres)" data-bind="recoverPassword1" value="${esc(state.recoverPassword1)}">
      <input class="field-input" type="password" placeholder="Repetir contraseña" data-bind="recoverPassword2" value="${esc(state.recoverPassword2)}">
      <button class="btn-accent" data-action="submitReset">Guardar nueva contraseña</button>`;
  } else {
    body = `
      <div style="width:52px;height:52px;border-radius:50%;background:color-mix(in oklch, var(--good) 18%, transparent);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M20 6 9 17l-5-5" fill="none" stroke="var(--good)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <div class="auth-title">¡Contraseña actualizada!</div>
      <div class="auth-subtitle">Ya podés ingresar con tu nueva contraseña.</div>`;
  }
  return `
  <div class="auth-screen">
    <div class="auth-card">
      <div class="auth-logo">${ICONS.logo}<div>TEMPRUN</div></div>
      ${body}
      <button class="link-btn" data-action="backToLogin">‹ Volver a ingresar</button>
    </div>
  </div>`;
}

/* ---------------- ONBOARDING ---------------- */

function renderOnboarding() {
  const s = state.profile;
  const step = state.onboardingStep;
  const dots = [1, 2, 3, 4, 5, 6, 7].map((n) => `<span class="${n <= step ? "active" : ""}"></span>`).join("");
  const level = levelFromAnswers(s.levelAnswers);
  const levelComplete = !!(
    s.levelAnswers.q1 &&
    s.levelAnswers.q2 &&
    s.levelAnswers.q3 &&
    s.levelAnswers.q4 &&
    s.levelAnswers.q5 &&
    s.levelAnswers.q6 &&
    s.levelAnswers.q7
  );
  const levelWarnings = levelComplete ? levelAnswerWarnings(s.levelAnswers) : [];
  const availCount = DAY_KEYS.filter((k) => s.availability[k]).length;
  const goalMissing = step === 4 && (!s.goalName.trim() || !s.goalDate);
  const availTooFew = step === 7 && availCount < MIN_AVAIL_DAYS;

  let body = "";
  if (step === 1) {
    body = `
      <div class="ob-title">PERFIL DE ATLETA</div>
      <div class="ob-photo">
        <div class="avatar-placeholder">
          <svg viewBox="0 0 24 24" width="26" height="26"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="13.5" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M9 7l1.5-2.5h3L15 7" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
        </div>
        <div class="caption">FOTO DE PERFIL</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div class="ob-field-icon">${ICONS.person}<input data-bind="profile.fullName" value="${esc(s.fullName)}" placeholder="Nombre completo"></div>
        <div class="ob-field-icon">${ICONS.phone}<input data-bind="profile.phone" value="${esc(s.phone)}" placeholder="Teléfono"></div>
        <div>
          <div class="ob-label">GÉNERO</div>
          <select class="ob-select" data-bind="profile.gender">
            ${["Masculino", "Femenino", "Otro"].map((g) => `<option value="${g}" ${s.gender === g ? "selected" : ""}>${g}</option>`).join("")}
          </select>
        </div>
      </div>`;
  } else if (step === 2) {
    const age = ageFromBirthdate(s.birthdate);
    const fcMax = fcMaxFromAge(age);
    body = `
      <div class="ob-title">BIOMETRÍA</div>
      <div class="ob-label accent">FECHA DE NACIMIENTO (DATO CRÍTICO)</div>
      <div style="margin-bottom:6px;">
        ${renderDatePicker("profile.birthdate", s.birthdate, { minYear: 1940, maxYear: new Date().getFullYear() - 5, defaultYear: 1995 })}
      </div>
      <div class="ob-hint">Con tu edad calculamos tu FC máxima (${fcMax} bpm) y así poder ajustar tus zonas.</div>
      <div class="ob-grid-2" style="margin-bottom:14px;">
        <div>
          <div class="ob-label">PESO (KG)</div>
          ${renderNumberPicker("profile.weight", s.weight, { min: 30, max: 180, unit: "kg", label: "Elegí tu peso", placeholder: "Elegir peso" })}
        </div>
        <div>
          <div class="ob-label">ALTURA (CM)</div>
          ${renderNumberPicker("profile.height", s.height, { min: 130, max: 220, unit: "cm", label: "Elegí tu altura", placeholder: "Elegir altura" })}
        </div>
      </div>
      <div>
        <div class="ob-label">FC EN REPOSO (BPM)</div>
        ${renderNumberPicker("profile.fcRest", s.fcRest, { min: 35, max: 100, unit: "bpm", label: "Elegí tu FC en reposo", placeholder: "Elegir FC en reposo" })}
      </div>`;
  } else if (step === 3) {
    body = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px;">
        <div style="width:38px;height:38px;border-radius:10px;background:var(--surface2);display:flex;align-items:center;justify-content:center;">
          <svg viewBox="0 0 24 24" width="17" height="17"><rect x="5" y="4" width="14" height="17" rx="2" fill="none" stroke="var(--accent)" stroke-width="1.6"/><rect x="8" y="2.5" width="8" height="3.5" rx="1" fill="var(--accent)"/></svg>
        </div>
        <div class="ob-title" style="margin-bottom:0;">CHEQUEO DE SALUD</div>
      </div>
      <div style="font-size:12.5px;color:var(--muted);font-style:italic;margin-bottom:12px;">Información confidencial.</div>
      <textarea class="ob-textarea" data-bind="profile.healthNotes" placeholder="Cirugías, lesiones previas, asma, etc.">${esc(s.healthNotes)}</textarea>`;
  } else if (step === 4) {
    body = `
      <div class="ob-title">OBJETIVO PRINCIPAL</div>
      <input class="ob-text" style="margin-bottom:14px;" data-bind="profile.goalName" value="${esc(s.goalName)}" placeholder="Ej: Maratón de Chicago 2026">
      <div class="ob-grid-2">
        <div>
          <div class="ob-label">DISTANCIA</div>
          <select class="ob-select" data-bind="profile.goalDistance">
            ${["3K / 3000m", "5K / 5000m", "10K / 10000m"].map((d) => `<option value="${d}" ${s.goalDistance === d ? "selected" : ""}>${d}</option>`).join("")}
          </select>
        </div>
        <div>
          <div class="ob-label">FECHA (OBLIGATORIA)</div>
          ${renderDatePicker("profile.goalDate", s.goalDate, { minYear: new Date().getFullYear(), maxYear: new Date().getFullYear() + 3, defaultYear: new Date().getFullYear() })}
        </div>
      </div>
      ${goalMissing ? `<div class="ob-error">Completá el nombre del objetivo y la fecha para continuar — con esto armamos tu plan.</div>` : ""}`;
  } else if (step === 5) {
    const pbDefs = [
      { key: "walk", label: "RECORD CAMINANDO" },
      { key: "p3k", label: "PB 3K" },
      { key: "p5k", label: "PB 5K" },
      { key: "p10k", label: "PB 10K" },
    ];
    body = `
      <div class="ob-title" style="margin-bottom:6px;">MEJORES MARCAS (PB)</div>
      <div style="font-size:12.5px;color:var(--muted);font-style:italic;margin-bottom:20px;">Ayuda al Coach a calibrar tus ritmos VDOT.</div>
      <div class="pb-grid">
        ${pbDefs.map((f) => pbFieldHtml(f, s, true)).join("")}
      </div>`;
  } else if (step === 6) {
    body = `
      <div class="ob-title" style="margin-bottom:6px;">NIVEL ACTUAL</div>
      <div style="font-size:12.5px;color:var(--muted);font-style:italic;margin-bottom:18px;">Respondé para calcular tu nivel de entrenamiento.</div>
      <div class="ob-question">
        ${questionHtml("q1", "¿Corrés actualmente de forma regular?", [["si", "Sí"], ["no", "No"]], s)}
        ${questionHtml("q2", "¿Hace cuánto corrés de forma continua?", [["nunca", "Nunca"], ["menos6", "< 6 meses"], ["mas6", "+ 6 meses"]], s)}
        ${questionHtml("q3", "¿Cuántos km corrés por semana en promedio?", [["cero", "0 km"], ["poco", "1-15 km"], ["mas15", "+15 km"]], s)}
        ${questionHtml("q4", "¿Cuántos minutos podés correr seguido, sin parar a caminar, hoy en día?", [["no", "No puedo correr sin parar"], ["menos20", "Menos de 20 min"], ["20a35", "20 a 35 min"], ["mas35", "Más de 35 min"]], s)}
        ${questionHtml("q5", "¿Entrenaste alguna vez con un plan o corriste una carrera oficial?", [["si", "Sí"], ["no", "No"]], s)}
        ${questionHtml("q6", "¿Cuándo corriste por última vez de forma regular?", [["nunca", "Nunca corrí regular"], ["mas6", "Hace + 6 meses"], ["menos6", "Hace - 6 meses"], ["activo", "Corro activamente ahora"]], s)}
        ${questionHtml("q7", "¿Tuviste alguna lesión reciente que te haya limitado?", [["limitante", "Sí, todavía me limita"], ["recuperado", "Sí, ya recuperado/a"], ["no", "No"]], s)}
      </div>
      ${levelComplete ? `<div class="level-detected"><span class="lbl">NIVEL DETECTADO</span><span class="val">${level}</span></div>` : ""}
      ${
        levelWarnings.length
          ? `<div class="ob-error" style="margin-top:12px;">${levelWarnings.map((w) => `⚠ ${w}`).join("<br>")}</div>`
          : ""
      }`;
  } else if (step === 7) {
    body = `
      <div class="ob-title">DISPONIBILIDAD SEMANAL</div>
      <div class="avail-grid">
        ${DAY_KEYS.map((k) => `<button class="avail-day-btn ${s.availability[k] ? "active" : ""}" data-action="toggleAvail" data-day="${k}">${k}</button>`).join("")}
      </div>
      <div class="avail-count">${availCount} días seleccionados (mínimo ${MIN_AVAIL_DAYS})</div>
      ${availTooFew ? `<div class="ob-error" style="text-align:center;">Elegí al menos 3 días para poder armar tu plan.</div>` : ""}`;
  }

  const nextLabel = step === 7 ? "COMPILAR PROGRAMA" : "CONTINUAR";

  return `
  <div class="ob-screen">
    <div class="ob-dots">${dots}</div>
    <div class="ob-card">${body}</div>
    <div class="ob-actions">
      ${step > 1 ? `<button class="ob-back-btn" data-action="obBack">‹</button>` : ""}
      <button class="ob-next-btn" data-action="obNext">${nextLabel}</button>
    </div>
  </div>`;
}

function pbFieldHtml(f, s, obContext) {
  const val = s.pbs[f.key];
  const isNone = val === "NONE";
  const parts = pbParts(val);
  return `
    <div>
      <div class="pb-field-head">
        <div class="pb-label">${f.label}</div>
        <button class="pb-none-btn" data-action="pbToggleNone" data-pb="${f.key}" style="background:${isNone ? "var(--accent)" : "var(--surface2)"};color:${isNone ? "var(--accent-ink)" : "var(--muted)"};">No tengo</button>
      </div>
      <div class="pb-segments" style="opacity:${isNone ? 0.35 : 1};">
        ${renderPbSegPicker(f.key, "h", parts.h, { min: 0, max: 5, label: "Horas", disabled: isNone })}
        <span>:</span>
        ${renderPbSegPicker(f.key, "m", parts.m, { min: 0, max: 59, label: "Minutos", disabled: isNone })}
        <span>:</span>
        ${renderPbSegPicker(f.key, "s", parts.s, { min: 0, max: 59, label: "Segundos", disabled: isNone })}
      </div>
    </div>`;
}

function renderPbSegPicker(pbKey, part, value, opts) {
  opts = opts || {};
  const min = opts.min != null ? opts.min : 0;
  const max = opts.max != null ? opts.max : 59;
  const pickerPath = `pbseg:${pbKey}:${part}`;
  const isOpen = state.openNumPicker === pickerPath;
  const curVal = value !== "" && value != null ? parseInt(value, 10) : null;
  const items = [];
  for (let n = min; n <= max; n++) items.push(n);
  return `
    <div class="numfield pb-numfield">
      <button type="button" class="pb-seg-toggle" ${opts.disabled ? "disabled" : ""} data-action="toggleNumPicker" data-path="${pickerPath}">${curVal != null ? pad2(curVal) : "00"}</button>
      ${
        isOpen
          ? `
        <div class="date-overlay" data-action="closeNumPicker"></div>
        <div class="num-popup">
          <div class="date-popup-header" style="justify-content:center;">${opts.label || ""}</div>
          <div class="num-scroll-list" data-path="${pickerPath}">
            ${items.map((n) => `<button type="button" class="num-cell${curVal === n ? " selected" : ""}" data-action="pbSegSelect" data-pb="${pbKey}" data-part="${part}" data-val="${n}">${pad2(n)}</button>`).join("")}
          </div>
        </div>`
          : ""
      }
    </div>`;
}

function questionHtml(key, label, pairs, s) {
  return `
    <div>
      <div class="ob-question-label">${label}</div>
      <div class="ob-opts">
        ${pairs.map(([val, lbl]) => `<button class="ob-opt-btn ${s.levelAnswers[key] === val ? "active" : ""}" data-action="setLevelAnswer" data-q="${key}" data-val="${val}">${lbl}</button>`).join("")}
      </div>
    </div>`;
}

function pbParts(val) {
  if (val === "NONE" || !val) return { h: "", m: "", s: "" };
  const [h, m, s] = val.split(":");
  return { h: h || "", m: m || "", s: s || "" };
}

/* ---------------- COMPILING ---------------- */

function renderCompiling() {
  const msgs = ["ACTUALIZANDO ZONAS...", "GUARDANDO PERFIL...", "SINCRONIZANDO COACH..."];
  return `
  <div class="compiling-screen">
    ${ICONS.logo.replace('width="26" height="26"', 'width="46" height="46"')}
    <div class="compiling-title">ANALIZANDO MÉTRICAS</div>
    <div class="compiling-items">
      ${msgs
        .map((label, i) => {
          const mark = state.compileStep > i ? "✓" : "▪";
          const color = state.compileStep > i ? "var(--good)" : state.compileStep === i ? "var(--accent)" : "var(--muted)";
          return `<div style="color:${color};">${mark} ${label}</div>`;
        })
        .join("")}
    </div>
  </div>`;
}

/* ---------------- APP SHELL ---------------- */

function computeRenderModel(profile, weekIndexParam) {
  const s = profile || state.profile;
  const isOwn = s === state.profile;
  const weekIndexRaw = weekIndexParam != null ? weekIndexParam : isOwn ? state.weekIndex : 0;
  const age = ageFromBirthdate(s.birthdate);
  const fcMax = fcMaxFromAge(age);
  // sin FC en reposo cargada, las zonas caen a %FC máx puro (fcRest=0 en Karvonen = FC máx × %)
  const fcRest = parseFloat(s.fcRest) || 0;
  const distInfo = parseGoalDistance(s.goalDistance);
  const level = levelFromAnswers(s.levelAnswers);
  const vdot = computeVdot(s.pbs);
  const paces = computePaces(vdot);
  const macro = buildMacrocycle(s, paces, level);
  const weekIndex = Math.max(0, Math.min(macro.totalWeeks - 1, weekIndexRaw));
  const weekMeta = macro.weeks[weekIndex];

  const alreadyRunsMin = continuousMinFromAnswers(s.levelAnswers);
  const rawDaysBase = buildWeekDays(weekMeta, s.availability, paces, level, distInfo, alreadyRunsMin);
  const rawDays = rawDaysBase.map((d, i) => {
    const ov = s.dayOverrides[weekIndex + "-" + i];
    return ov ? { ...d, ...ov } : d;
  });

  const planDays = rawDays.map((d, i) => {
    const key = weekIndex + "-" + i;
    const done = !!s.completed[key];
    const isRest = d.type === "rest";
    const barColor = d.type === "hard" ? "var(--bad)" : d.type === "long" ? "var(--accent)" : isRest ? "var(--muted)" : "var(--good)";
    const expanded = isOwn && state.expandedKey === key;
    const sessionInfoRaw = isRest ? null : sessionBlocks(d, fcRest, fcMax, paces, distInfo, level);
    const sessionInfo = sessionInfoRaw ? { ...sessionInfoRaw, phaseTag: weekMeta.phaseName.toUpperCase() + (weekMeta.isDeload ? " · DESCARGA" : "") } : null;
    return { ...d, key, i, done, isRest, hasSession: !isRest, barColor, expanded, sessionInfo, typeKey: reverseTypeKey(d) };
  });

  const totalKm = rawDays.reduce((sum, d) => sum + d.km, 0);
  const doneKm = rawDays.reduce((sum, d, i) => sum + (s.completed[weekIndex + "-" + i] ? d.km : 0), 0);
  const pct = totalKm > 0 ? Math.round((doneKm / totalKm) * 100) : 0;

  const dayKeyByJs = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const todayKey = dayKeyByJs[new Date().getDay()];
  let selIdx = isOwn ? state.selectedDayIdx : null;
  if (selIdx == null || selIdx < 0 || selIdx > 6) {
    const foundToday = planDays.findIndex((d) => d.day === todayKey);
    selIdx = foundToday >= 0 ? foundToday : planDays.findIndex((d) => d.hasSession);
    if (selIdx < 0) selIdx = 0;
  }
  const todayDay = { ...planDays[selIdx], isToday: planDays[selIdx].day === todayKey };
  const todayHeading = todayDay.isToday ? "Entrenamiento de hoy" : `Entrenamiento · ${todayDay.day}`;

  const chronicWeeks = macro.weeks.slice(Math.max(0, weekIndex - 3), weekIndex + 1);
  const chronicLoad = chronicWeeks.reduce((sum, w) => sum + w.volume, 0) / chronicWeeks.length;
  const acwr = chronicLoad > 0 ? totalKm / chronicLoad : 1;
  let acwrStatus;
  if (acwr < 0.8) acwrStatus = { label: "Carga Baja", color: "var(--warn)" };
  else if (acwr <= 1.3) acwrStatus = { label: "Carga Óptima", color: "var(--good)" };
  else if (acwr <= 1.5) acwrStatus = { label: "Precaución", color: "var(--warn)" };
  else acwrStatus = { label: "Riesgo Alto", color: "var(--bad)" };

  const maxVol = Math.max(...macro.weeks.map((w) => w.volume));
  const weeksMeta = macro.weeks.map((w) => ({
    title: `Semana ${w.index + 1} · ${w.phaseName}${w.isDeload ? " (descarga)" : ""} · ${w.volume}km`,
    barHeight: Math.max(4, Math.round((w.volume / maxVol) * 40)),
    color: w.index === weekIndex ? "var(--accent)" : w.isDeload ? "var(--warn)" : "var(--surface2)",
    index: w.index,
  }));

  const factors = [0.85, 1.0, 1.1, 0.65];
  const labels = ["Sem 1", "Sem 2", "Sem 3", "Sem 4 (descarga)"];
  const monthVols = factors.map((f) => Math.round(totalKm * f));
  const monthMax = Math.max(...monthVols, 1);
  const monthWeeks = monthVols.map((km, i) => ({
    km,
    label: labels[i],
    barHeight: Math.max(6, Math.round((km / monthMax) * 70)),
    color: i === 3 ? "var(--warn)" : "var(--accent)",
  }));

  return {
    level, vdot, paces, macro, weekIndex, weekMeta, planDays, todayDay, todayHeading,
    totalKm, doneKm, pct, acwrStatus, weeksMeta, fcMax, fcRest, distInfo, monthWeeks,
    phaseLabelShort: `${distInfo.label} · ${level} · Sem ${weekIndex + 1}/${macro.totalWeeks}`,
    phaseLabelFull: `${weekMeta.phaseName}${weekMeta.isDeload ? " · Descarga" : ""} · Semana ${weekIndex + 1}/${macro.totalWeeks} · ${level}`,
    goalLine: s.goalName ? `${s.goalName} · ${distInfo.label}` : `Objetivo: ${distInfo.label}`,
  };
}

function renderApp() {
  if (state.role === "coach") return renderCoachApp();
  const m = computeRenderModel();
  const s = state.profile;
  const firstName = (s.fullName || "Atleta").split(" ")[0];
  const avatarLetter = firstName.charAt(0).toUpperCase();

  const navItems = [
    { key: "panel", icon: ICONS.panel, label: "Panel" },
    { key: "plan", icon: ICONS.plan, label: "Plan" },
    { key: "chat", icon: ICONS.chatNav, label: "Chat" },
    { key: "tools", icon: ICONS.tools, label: "Herramientas" },
    { key: "perfil", icon: ICONS.perfil, label: "Perfil" },
  ];

  return `
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="sidebar-brand">
        ${ICONS.logo}
        <div>
          <div class="brand-title">TEMPRUN</div>
          <div class="brand-sub">BY IAGO ALVAREZ</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${navItems.map((n) => `<button class="${state.athleteTab === n.key ? "active" : ""}" data-action="goTab" data-tab="${n.key}">${n.icon}<span class="nav-label">${n.label}</span></button>`).join("")}
      </nav>
      <div class="sidebar-footer">
        <div class="footer-label">TEMA</div>
        <div class="theme-toggle-row">
          <button class="${state.theme === "dark" ? "active" : ""}" data-action="setTheme" data-theme="dark">${ICONS.moon} Oscuro</button>
          <button class="${state.theme === "light" ? "active" : ""}" data-action="setTheme" data-theme="light">${ICONS.sun} Claro</button>
        </div>
        <button class="logout-btn-lg" data-action="logout">Cerrar sesión</button>
      </div>
    </aside>

    <main class="app-content">
      <div class="content-inner">
        ${state.athleteTab === "panel" ? renderPanel(m, firstName, avatarLetter) : ""}
        ${state.athleteTab === "plan" ? renderPlan(m) : ""}
        ${state.athleteTab === "chat" ? renderChatTab() : ""}
        ${state.athleteTab === "tools" ? renderToolsTab() : ""}
        ${state.athleteTab === "perfil" ? renderPerfil() : ""}
      </div>
    </main>
  </div>

  <nav class="mobile-tabbar">
    ${navItems.map((n) => `<button class="${state.athleteTab === n.key ? "active" : ""}" data-action="goTab" data-tab="${n.key}">${n.icon}<span>${n.label}</span></button>`).join("")}
  </nav>`;
}

function renderWeatherWidget() {
  const box = (content) => `<div style="background:var(--surface2);border-radius:10px;padding:10px 16px;display:flex;align-items:center;gap:9px;">${ICONS.weather}<div>${content}</div></div>`;
  if (state.weatherStatus === "ready") {
    return box(`
      <div style="font-size:11px;color:var(--muted);font-weight:600;">${esc(state.weatherCity || "Tu ubicación")}</div>
      <div style="font-size:14px;font-weight:800;">${state.weatherTemp}°C</div>
    `);
  }
  if (state.weatherStatus === "loading") {
    return box(`<div style="font-size:11.5px;color:var(--muted);font-weight:600;">Ubicando...</div>`);
  }
  // denied | error | unsupported | idle: no interrumpimos el panel, solo no mostramos clima
  return "";
}

function renderPanel(m, firstName, avatarLetter) {
  const coachMsg = state.profile.coachMessage && state.profile.coachMessage.trim()
    ? state.profile.coachMessage
    : m.weekMeta.isDeload
    ? "Esta semana bajamos volumen a propósito — es momento de recuperar y absorber la carga."
    : "Vamos bien esta semana. Metele fuerte a las sesiones de calidad y avisame cómo te sentís.";

  return `
    <div class="panel-header">
      <div class="panel-header-left">
        <div class="avatar-circle">${avatarLetter}</div>
        <div>
          <div class="eyebrow-brand">TEMPRUN · IAGO ALVAREZ</div>
          <div class="hello-title">Hola, <span>${esc(firstName)}</span></div>
          <span class="phase-pill">${m.phaseLabelShort}</span>
        </div>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
        ${renderWeatherWidget()}
        <button class="btn-accent" style="width:auto;padding:11px 18px;margin:0;" data-action="goTab" data-tab="chat">Mensaje al coach</button>
      </div>
    </div>

    <div class="coach-message-card">
      <div class="icon-circle">${ICONS.chat}</div>
      <div>
        <div class="label">MENSAJE DEL COACH</div>
        <div class="text">${esc(coachMsg)}</div>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-box"><div class="label">VOL. SEMANAL</div><div class="value">${m.doneKm.toFixed(1)} / ${m.totalKm.toFixed(1)} km</div></div>
      <div class="stat-box"><div class="label">% PLAN CUMPLIDO</div><div class="value">${m.pct}%</div></div>
      <div class="stat-box"><div class="label">ESTADO DE CARGA</div><div class="value" style="color:${m.weekMeta.isDeload ? "var(--warn)" : m.acwrStatus.color}">${m.weekMeta.isDeload ? "Descarga" : m.acwrStatus.label}</div></div>
      <div class="stat-box">
        <div class="label">KM REALIZADOS</div>
        <div class="value">${m.doneKm.toFixed(1)} km</div>
        <div class="sub">${ICONS.lightning.replace('width="19" height="19"', 'width="11" height="11"')} ${state.profile.stravaStatus === "connected" ? "Sincronizado con Strava · hace 2h" : "Sin conectar a Strava"}</div>
      </div>
    </div>

    <div class="section-heading-row">
      <div class="heading">${m.todayHeading}</div>
      <span class="phase-pill">${m.phaseLabelShort}</span>
    </div>

    <div class="today-card">
      ${
        m.todayDay.isRest
          ? `<div class="today-rest"><div class="title">Día de descanso</div><div class="sub">Aprovechá para recuperar. Mañana seguimos.</div></div>`
          : renderSessionBody(m.todayDay, true)
      }
    </div>

    <div class="section-heading-row">
      <div class="heading">Esta semana</div>
      <button class="link-btn" data-action="goTab" data-tab="plan">Ver plan completo →</button>
    </div>
    <div class="day-chips">
      ${m.planDays
        .map(
          (d, i) => `
        <button class="day-chip" style="border-color:${i === (state.selectedDayIdx ?? m.planDays.findIndex((x) => x.day === m.todayDay.day)) ? "var(--accent)" : "var(--border)"}" data-action="pickDay" data-idx="${i}">
          <div class="d-name">${d.day}</div>
          <div class="dot" style="background:${d.barColor}"></div>
          <div class="workout" style="opacity:${d.done ? 0.55 : 1}">${d.isRest ? "Descanso" : d.workout}</div>
          <div class="done-mark">${d.done ? "✓" : ""}</div>
        </button>`
        )
        .join("")}
    </div>`;
}

function renderSessionBody(d, expandedForced) {
  const expanded = expandedForced || d.expanded;
  return `
    <div class="today-body">
      <div class="today-top">
        <div class="session-row-left">
          <div class="today-icon">${sessionIcon(d.sessionInfo.typeTag)}</div>
          <div>
            <div class="tag-row">
              <span class="tag-solid">${d.sessionInfo.phaseTag}</span>
              <span class="tag-outline">${d.sessionInfo.typeTag}</span>
            </div>
            <div class="today-title">${d.day} · ${d.sessionInfo.title}</div>
          </div>
        </div>
        <button class="done-btn" style="background:${d.done ? "color-mix(in oklch, var(--good) 20%, transparent)" : "var(--surface2)"};color:${d.done ? "var(--good)" : "var(--text)"}" data-action="toggleDoneStop" data-key="${d.key}">${d.done ? "COMPLETADO ✓" : "MARCAR COMPLETADO"}</button>
      </div>
      ${expanded ? renderStravaActual(state.profile, d.key) + renderBlocksGrid(d.sessionInfo.blocks) : ""}
    </div>`;
}

function renderStravaActual(profile, key) {
  const act = profile.stravaActivities && profile.stravaActivities[key];
  if (!act) return "";
  return `
    <div class="strava-actual-row">
      ${ICONS.strava}
      <div>
        <div class="strava-actual-label">REGISTRADO CON STRAVA</div>
        <div class="strava-actual-value">${act.km} km · ${act.durationMin} min · ${act.pace} /km</div>
      </div>
    </div>`;
}

function renderBlocksGrid(sessionInfo, editDayIdx) {
  const blocks = sessionInfo.blocks || sessionInfo; // admite pasar blocks directo (uso de solo lectura)
  const canEditEdges = editDayIdx != null && sessionInfo.warmupMin != null;
  return `
    <div class="blocks-grid">
      ${blocks
        .map((b, i) => {
          const isEdge = i === 0 || i === blocks.length - 1;
          const editable = canEditEdges && isEdge;
          const part = i === 0 ? "warmupMinOverride" : "cooldownMinOverride";
          const draftKey = editDayIdx + "-" + part;
          const rawVal = i === 0 ? sessionInfo.warmupMin : sessionInfo.cooldownMin;
          // se edita el TIEMPO (minutos) de entrada/vuelta, no la distancia — así lo piensa
          // un coach de verdad (Daniels: 10-15 min de entrada, sin importar el km total de
          // la sesión) y se evita la matemática circular de derivar minutos desde km.
          const timeCell = editable
            ? `<input type="text" inputmode="decimal" data-action="coachSetEdge" data-idx="${editDayIdx}" data-part="${part}" value="${state.coachEdgeDraft[draftKey] != null ? state.coachEdgeDraft[draftKey] : rawVal}" style="width:44px;background:transparent;border:none;border-bottom:1px dashed var(--border);color:var(--text);font-weight:800;font-size:13px;padding:0 0 2px;"> min`
            : b.time;
          return `
        <div class="block-card">
          <div class="b-label">${b.label}</div>
          <div class="b-name">${b.name}</div>
          <div class="block-mini-grid">
            <div class="block-mini"><div class="k">DIST</div><div class="v">${b.dist}</div></div>
            <div class="block-mini"><div class="k">RITMO /KM</div><div class="v" style="color:var(--accent)">${b.pace}</div></div>
            <div class="block-mini"><div class="k">ZONA</div><div class="v" style="color:${b.zoneColor}">${b.zone}</div></div>
            <div class="block-mini"><div class="k">FC TARGET</div><div class="v" style="color:var(--pink)">${b.fc}</div></div>
          </div>
          <div class="block-mini" style="margin-bottom:8px;"><div class="k">TIEMPO</div><div class="v">${timeCell}</div></div>
          <div class="b-desc">${b.desc}</div>
        </div>`;
        })
        .join("")}
    </div>`;
}

function renderPlan(m) {
  return `
    <div class="plan-header">
      <div>
        <div class="goal-line">${m.goalLine}</div>
        <div class="phase-full">${m.phaseLabelFull}</div>
        ${m.weekMeta.adjustNote ? `<div class="adjust-note">⚠ ${m.weekMeta.adjustNote}</div>` : ""}
      </div>
      <div class="plan-header-actions">
        <button class="date-nav-btn" title="Reiniciar progreso del plan" data-action="resetPlanProgress">${ICONS.refresh}</button>
        <button class="date-nav-btn" title="Crear un plan nuevo" data-action="startNewPlan">${ICONS.trash}</button>
        <div class="week-nav">
          <button data-action="weekPrev">‹</button>
          <button data-action="weekNext">›</button>
        </div>
      </div>
    </div>

    <div class="weeks-bar">
      ${m.weeksMeta.map((w) => `<div class="bar" title="${w.title}" style="height:${w.barHeight}px;background:${w.color}" data-action="jumpWeek" data-idx="${w.index}"></div>`).join("")}
    </div>

    <div class="week-days">
      ${m.planDays
        .map((d) => {
          if (d.isRest) {
            return `
            <div class="week-day-card">
              <div class="rest-row">
                <div class="bar" style="background:${d.barColor}"></div>
                <div class="day-name">${d.day}</div>
                <div class="desc">Descanso</div>
                <button class="done-circle" style="border-color:${d.done ? "var(--good)" : "var(--border)"}" data-action="toggleDone" data-key="${d.key}">${d.done ? "✓" : ""}</button>
              </div>
            </div>`;
          }
          return `
            <div class="week-day-card">
              <div class="session-row" data-action="toggleExpand" data-key="${d.key}">
                <div class="session-row-left">
                  <div class="today-icon">${sessionIcon(d.sessionInfo.typeTag)}</div>
                  <div>
                    <div class="tag-row">
                      <span class="tag-solid">${d.sessionInfo.phaseTag}</span>
                      <span class="tag-outline">${d.sessionInfo.typeTag}</span>
                    </div>
                    <div class="today-title">${d.day} · ${d.sessionInfo.title}</div>
                  </div>
                </div>
                <div class="session-row-actions">
                  <span class="expand-label">${d.expanded ? "OCULTAR DETALLES ▴" : "VER DETALLES ▾"}</span>
                  <button class="done-btn" style="background:${d.done ? "color-mix(in oklch, var(--good) 20%, transparent)" : "var(--surface2)"};color:${d.done ? "var(--good)" : "var(--text)"}" data-action="toggleDoneStop" data-key="${d.key}">${d.done ? "COMPLETADO ✓" : "MARCAR COMPLETADO"}</button>
                </div>
              </div>
              ${d.expanded ? renderStravaActual(state.profile, d.key) + renderBlocksGrid(d.sessionInfo.blocks) : ""}
            </div>`;
        })
        .join("")}
    </div>

    <div class="week-summary">
      <div><span class="label">Volumen</span><div class="value">${m.doneKm.toFixed(1)} / ${m.totalKm.toFixed(1)} km</div></div>
      <div><span class="label">Plan cumplido</span><div class="value">${m.pct}%</div></div>
      <div><span class="label">VDOT</span><div class="value">${m.vdot == null ? "Sin marca" : Math.round(m.vdot)}</div></div>
      <div><span class="label">FC máx</span><div class="value">${m.fcMax} bpm</div></div>
    </div>`;
}

function renderChatTab() {
  const s = state.profile;
  return `
    <div style="font-size:26px;font-weight:800;margin-bottom:6px;">Chat con Iago</div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:18px;">Chat directo con tu coach.</div>
    <div class="chat-box${s.chatMessages.length === 0 ? " empty" : ""}">
      ${
        s.chatMessages.length === 0
          ? `<div class="chat-empty-msg">Todavía no hay mensajes. Escribile a tu coach.</div>`
          : s.chatMessages
              .map(
                (msg) => `
        <div class="chat-bubble-row" style="justify-content:${msg.from === "athlete" ? "flex-end" : "flex-start"}">
          <div class="chat-bubble" style="background:${msg.from === "athlete" ? "var(--accent)" : "var(--surface2)"};color:${msg.from === "athlete" ? "var(--accent-ink)" : "var(--text)"}">
            <div class="msg-text">${esc(msg.text)}</div>
            <div class="msg-time">${msg.time}</div>
          </div>
        </div>`
              )
              .join("")
      }
    </div>
    <div class="chat-input-row">
      <input placeholder="Escribí un mensaje..." data-bind="chatInput" value="${esc(state.chatInput)}" data-enter-action="sendMessage">
      <button class="chat-send-btn" data-action="sendMessage">Enviar</button>
    </div>`;
}

function renderToolsTab() {
  const distOptions = [
    ["1500", "1500 m"],
    ["3000", "3000 m"],
    ["5000", "5000 m (5K)"],
    ["10000", "10000 m (10K)"],
    ["21097", "21097 m (21K)"],
    ["42195", "42195 m (42K)"],
    ["custom", "Otra distancia (km)"],
  ];
  const distM = state.toolDistance === "custom" ? (parseFloat(state.toolCustomKm) || 0) * 1000 : parseFloat(state.toolDistance);
  const h = parseInt(state.toolH, 10) || 0;
  const mnt = parseInt(state.toolM, 10) || 0;
  const sec = parseInt(state.toolS, 10) || 0;
  const timeSec = h * 3600 + mnt * 60 + sec;
  let calcResult = "";
  if (distM > 0 && timeSec > 0) {
    const vdot = vdotFromPerf(distM, timeSec);
    const paces = computePaces(vdot);
    const s = state.profile;
    const age = ageFromBirthdate(s.birthdate);
    const fcMax = fcMaxFromAge(age);
    // sin FC en reposo cargada, las zonas caen a %FC máx puro (fcRest=0 en Karvonen = FC máx × %)
  const fcRest = parseFloat(s.fcRest) || 0;
    const hasFc = !!s.birthdate || !!s.fcRest;
    calcResult = `
      <div class="week-summary" style="margin-top:18px;">
        <div><span class="label">VDOT estimado</span><div class="value">${Math.round(vdot)}</div></div>
        <div><span class="label">Ritmo suave</span><div class="value">${paces.easy} /km</div></div>
        <div><span class="label">Ritmo maratón</span><div class="value">${paces.marathon} /km</div></div>
        <div><span class="label">Ritmo umbral</span><div class="value">${paces.threshold} /km</div></div>
        <div><span class="label">Ritmo intervalo</span><div class="value">${paces.interval} /km</div></div>
        <div><span class="label">Ritmo repetición</span><div class="value">${paces.repetition} /km</div></div>
      </div>
      ${
        hasFc
          ? `<div class="week-summary" style="margin-top:10px;">
              <div><span class="label">Z1 recuperación</span><div class="value">${karvonen(0.5, 0.6, fcRest, fcMax)}</div></div>
              <div><span class="label">Z2 aeróbico</span><div class="value">${karvonen(0.6, 0.75, fcRest, fcMax)}</div></div>
              <div><span class="label">Z3 tempo</span><div class="value">${karvonen(0.75, 0.85, fcRest, fcMax)}</div></div>
              <div><span class="label">Z4 umbral</span><div class="value">${karvonen(0.85, 0.95, fcRest, fcMax)}</div></div>
            </div>`
          : `<div style="font-size:12px;color:var(--muted);margin-top:10px;">Completá tu FC en reposo y fecha de nacimiento en Perfil para ver también tus zonas de frecuencia cardíaca.</div>`
      }`;
  }

  return `
    <div style="font-size:26px;font-weight:800;margin-bottom:6px;">Herramientas</div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:22px;">Calculadora para planificar tus entrenamientos.</div>

    <div class="perfil-panel">
      <div class="perfil-panel-heading">${ICONS.lightning.replace('width="19" height="19"', 'width="16" height="16"')} CALCULADORA DE RITMOS Y ZONAS (VDOT)</div>
      <div style="font-size:12.5px;color:var(--muted);margin-bottom:16px;">Ingresá una marca reciente (distancia + tiempo) para estimar tus ritmos de entrenamiento y zonas de FC.</div>
      <div class="ob-grid-2" style="margin-bottom:12px;">
        <div>
          <div class="ob-label">DISTANCIA</div>
          <select class="ob-select" data-bind="toolDistance">
            ${distOptions.map(([v, l]) => `<option value="${v}" ${state.toolDistance === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </div>
        ${state.toolDistance === "custom" ? `<div><div class="ob-label">KM</div><input class="ob-text" type="number" data-bind="toolCustomKm" value="${esc(state.toolCustomKm)}"></div>` : `<div></div>`}
      </div>
      <div class="ob-label">TIEMPO (H : M : S)</div>
      <div style="display:flex;gap:8px;align-items:center;max-width:260px;">
        <input class="ob-text" type="number" placeholder="H" data-bind="toolH" value="${esc(state.toolH)}">
        <input class="ob-text" type="number" placeholder="M" data-bind="toolM" value="${esc(state.toolM)}">
        <input class="ob-text" type="number" placeholder="S" data-bind="toolS" value="${esc(state.toolS)}">
      </div>
      ${calcResult}
    </div>

    ${renderPulseTool()}
    ${renderGlossaryTool()}`;
}

const GLOSSARY_TERMS = [
  { term: "FC (frecuencia cardíaca)", def: "Cantidad de latidos del corazón por minuto. Se usa la FC en reposo (recién levantado) y la FC máxima para calcular tus zonas de entrenamiento." },
  { term: "PB y BPM", def: "PB es tu Personal Best: la mejor marca que registraste en una distancia. BPM es \"beats per minute\" (pulsaciones por minuto), la unidad en la que se mide la FC." },
  { term: "VDOT", def: "Índice de capacidad aeróbica creado por Jack Daniels. A partir de una marca reciente estima tu nivel actual y calcula los ritmos de entrenamiento (suave, umbral, intervalo, etc.)." },
  { term: "Zonas (Z1-Z4)", def: "Rangos de FC que indican la intensidad del esfuerzo: Z1 recuperación muy suave, Z2 aeróbico/conversacional, Z3 tempo (moderado-fuerte), Z4 umbral/anaeróbico (esfuerzo alto)." },
  { term: "Rodaje suave", def: "Trote continuo a ritmo cómodo y conversacional (Z1-Z2). Es la base de cualquier plan: construye resistencia aeróbica sin generar demasiado desgaste." },
  { term: "Neuro", def: "Trabajo neuromuscular: progresiones o cambios de ritmo cortos y suaves (no son series a fondo) que activan la conexión entre el sistema nervioso y los músculos, mejorando la técnica y la economía de carrera." },
  { term: "Fondo largo", def: "La sesión más extensa de la semana, a ritmo suave. Entrena la resistencia y la capacidad de sostener el esfuerzo en el tiempo, clave para carreras de 10K en adelante." },
  { term: "Fartlek", def: "\"Juego de ritmos\" en sueco: alterna tramos rápidos y suaves dentro de la misma sesión, sin distancias exactas, para mejorar la capacidad de cambiar de ritmo." },
  { term: "Cuestas", def: "Repeticiones en subida a esfuerzo alto. Suman fuerza y potencia en las piernas con menos impacto que las series en llano." },
  { term: "Series", def: "Repeticiones cortas a ritmo rápido (por ejemplo 6x1000m) con pausas de trote suave entre medio. Mejoran la velocidad y el VO2 máx." },
  { term: "Ritmo de carrera", def: "Sesión a la velocidad objetivo de tu próxima competencia, para que el cuerpo se acostumbre a sostener ese esfuerzo específico." },
  { term: "CACO (caminar-correr)", def: "Método que alterna tramos de trote suave y caminata activa. Ideal para arrancar desde cero sin lesionarte, sumando minutos de trote de a poco." },
  { term: "A sensación / RPE", def: "Cuando no hay una marca cargada para calcular un ritmo exacto, el esfuerzo se guía por sensación (RPE = Rate of Perceived Exertion): tenés que poder mantener una conversación sin ahogarte." },
  { term: "Estado de carga", def: "Compara tu volumen reciente contra tu volumen habitual para avisarte si estás entrenando en un rango seguro o si el aumento fue demasiado brusco (riesgo de lesión)." },
  { term: "Descarga (deload)", def: "Semana con menos volumen a propósito, dentro del plan, para que el cuerpo absorba el entrenamiento acumulado y llegue más fresco a la siguiente fase." },
];

function renderGlossaryTool() {
  const open = state.toolGlossaryOpen;
  return `
    <div class="perfil-panel" style="margin-top:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;" data-action="toggleGlossary">
        <div class="perfil-panel-heading" style="margin-bottom:0;">${ICONS.lightning.replace('width="19" height="19"', 'width="16" height="16"')} GLOSARIO</div>
        <span class="expand-label">${open ? "OCULTAR ▴" : "VER ▾"}</span>
      </div>
      ${
        open
          ? `<div style="margin-top:16px;max-height:360px;overflow-y:auto;display:flex;flex-direction:column;gap:14px;">
              ${GLOSSARY_TERMS.map(
                (g) => `
                <div>
                  <div style="font-size:12.5px;font-weight:800;color:var(--accent);margin-bottom:3px;">${esc(g.term)}</div>
                  <div style="font-size:12.5px;color:var(--muted);line-height:1.5;">${esc(g.def)}</div>
                </div>`
              ).join("")}
            </div>`
          : `<div style="font-size:12px;color:var(--muted);margin-top:8px;">¿Qué significa FC, VDOT, rodaje suave...? Tocá "VER" para desplegar las definiciones.</div>`
      }
    </div>`;
}

function renderPulseTool() {
  const durations = [15, 30, 60];
  let body;
  if (state.pulseResult != null) {
    body = `
      <div style="text-align:center;padding:8px 0;">
        <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.4px;margin-bottom:4px;">FC EN REPOSO ESTIMADA</div>
        <div style="font-size:38px;font-weight:800;font-style:italic;color:var(--accent);">${state.pulseResult} <span style="font-size:16px;color:var(--muted);font-style:normal;">bpm</span></div>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:16px;flex-wrap:wrap;">
          ${
            state.pulseSaved
              ? `<div style="font-size:12.5px;color:var(--good);font-weight:700;padding:11px 4px;">✓ Guardado como tu FC en reposo</div>`
              : `<button class="btn-accent" style="width:auto;padding:11px 20px;margin:0;" data-action="pulseUseResult">Usar este valor</button>`
          }
          <button class="btn-outline-block" style="width:auto;padding:11px 20px;" data-action="pulseReset">Medir de nuevo</button>
        </div>
      </div>`;
  } else if (state.pulseAwaitingCount) {
    body = `
      <div style="text-align:center;padding:8px 0;">
        <div style="font-size:13px;margin-bottom:14px;">¿Cuántas pulsaciones contaste en ${state.pulseDuration} segundos?</div>
        <input class="ob-text" type="text" inputmode="numeric" data-bind="toolPulseManualCount" value="${esc(state.toolPulseManualCount)}" placeholder="Ej: ${Math.round((70 * state.pulseDuration) / 60)}" style="max-width:140px;text-align:center;font-size:18px;font-weight:800;margin:0 auto 16px;">
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
          <button class="btn-accent" style="width:auto;padding:11px 20px;margin:0;" data-action="pulseSubmitCount">Calcular</button>
          <button class="btn-outline-block" style="width:auto;padding:11px 20px;" data-action="pulseCancel">Cancelar</button>
        </div>
      </div>`;
  } else if (state.pulseRunning) {
    const elapsed = Math.min(state.pulseDuration, (Date.now() - state.pulseStartedAt) / 1000);
    const remaining = Math.max(0, Math.ceil(state.pulseDuration - elapsed));
    body =
      state.pulseMode === "tap"
        ? `
      <div style="text-align:center;padding:4px 0;">
        <div style="font-size:12.5px;color:var(--muted);margin-bottom:14px;">Tocá el círculo cada vez que sientas un latido en la muñeca o el cuello.</div>
        <button type="button" data-action="pulseTap" style="all:unset;box-sizing:border-box;cursor:pointer;width:150px;height:150px;border-radius:50%;background:color-mix(in oklch, var(--accent) 16%, var(--surface2));border:3px solid var(--accent);display:flex;flex-direction:column;align-items:center;justify-content:center;margin:0 auto;">
          <div style="font-size:34px;font-weight:800;color:var(--accent);">${state.pulseTaps}</div>
          <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.4px;">LATIDOS</div>
        </button>
        <div style="font-size:22px;font-weight:800;margin-top:16px;">${remaining}s</div>
        <button class="btn-outline-block" style="width:auto;padding:9px 18px;margin-top:14px;" data-action="pulseCancel">Cancelar</button>
      </div>`
        : `
      <div style="text-align:center;padding:20px 0;">
        <div style="font-size:12.5px;color:var(--muted);margin-bottom:18px;">Contá tus pulsaciones en la muñeca o el cuello sin tocar la pantalla. Al terminar el tiempo te vamos a pedir el total.</div>
        <div style="width:150px;height:150px;border-radius:50%;background:color-mix(in oklch, var(--accent) 16%, var(--surface2));border:3px solid var(--accent);display:flex;align-items:center;justify-content:center;margin:0 auto;">
          <div style="font-size:44px;font-weight:800;color:var(--accent);">${remaining}s</div>
        </div>
        <button class="btn-outline-block" style="width:auto;padding:9px 18px;margin-top:18px;" data-action="pulseCancel">Cancelar</button>
      </div>`;
  } else {
    body = `
      <div style="font-size:12.5px;color:var(--muted);line-height:1.6;margin-bottom:16px;">
        Medila apenas te despertás, antes de levantarte de la cama y mientras estás quieto/a: apoyá dos dedos (no el pulgar) sobre la muñeca o el costado del cuello hasta sentir el pulso.
      </div>
      <div class="ob-label">MODO DE CONTEO</div>
      <div class="ob-opts" style="margin-bottom:16px;max-width:420px;">
        <button class="ob-opt-btn ${state.pulseMode === "tap" ? "active" : ""}" data-action="pulseSetMode" data-mode="tap">Tocar la pantalla en cada latido</button>
        <button class="ob-opt-btn ${state.pulseMode === "count" ? "active" : ""}" data-action="pulseSetMode" data-mode="count">Contar sin tocar la pantalla</button>
      </div>
      <div class="ob-label">DURACIÓN DE LA MEDICIÓN</div>
      <div class="ob-opts" style="margin-bottom:16px;max-width:320px;">
        ${durations.map((d) => `<button class="ob-opt-btn ${state.pulseDuration === d ? "active" : ""}" data-action="pulseSetDuration" data-sec="${d}">${d}s</button>`).join("")}
      </div>
      <button class="btn-accent" style="width:auto;padding:12px 22px;margin:0;" data-action="pulseStart">${ICONS.heart} Empezar medición</button>
    `;
  }
  return `
    <div class="perfil-panel" style="margin-top:20px;">
      <div class="perfil-panel-heading">${ICONS.heart} MEDIR MI FC EN REPOSO</div>
      ${body}
    </div>`;
}

const MARK_DISTS = [
  { key: "p3k", label: "3K", distM: 3000 },
  { key: "p5k", label: "5K", distM: 5000 },
  { key: "p10k", label: "10K", distM: 10000 },
];

function renderMyMarks(s) {
  const marks = MARK_DISTS.map(({ key, label, distM }) => {
    const pbStr = s.pbs[key];
    const sec = parseTime(pbStr);
    if (!pbStr || pbStr === "NONE" || sec <= 0) return { label, hasPb: false };
    const vdot = vdotFromPerf(distM, sec);
    const tier = vdotTier(vdot);
    const potentialSec = raceTimeFromVdot(Math.min(85, vdot + 4), distM);
    return { label, hasPb: true, pbFormatted: formatRaceTime(sec), vdot, tier, potential: formatRaceTime(potentialSec) };
  });
  return `
    <div class="perfil-panel" style="margin-bottom:22px;">
      <div class="perfil-panel-heading">${ICONS.trophy} MIS MARCAS PERSONALES</div>
      <div style="font-size:11px;color:var(--muted);margin:-12px 0 16px;letter-spacing:0.3px;">NIVEL VDOT · DANIELS RUNNING FORMULA</div>
      <div class="marks-grid">
        ${marks
          .map((m) =>
            m.hasPb
              ? `
          <div class="mark-card">
            <div class="mark-card-top"><span class="mark-dist">${m.label}</span><span class="mark-badge">${m.tier}</span></div>
            <div class="mark-pb-label">PB ACTUAL</div>
            <div class="mark-pb-value">${m.pbFormatted}</div>
            <div class="mark-vdot">VDOT ${Math.round(m.vdot)}</div>
            <div class="mark-divider"></div>
            <div class="mark-pot-label">POTENCIAL (4 MESES)</div>
            <div class="mark-pot-value">${m.potential}</div>
            <div class="mark-pot-sub">+4 PUNTOS VDOT</div>
          </div>`
              : `
          <div class="mark-card empty">
            <div>
              <div class="mark-empty-dist">${m.label}</div>
              <div class="mark-empty-label">SIN MARCA</div>
            </div>
          </div>`
          )
          .join("")}
      </div>
      <div class="mark-tip">${ICONS.trendUp} Con entrenamiento constante de <b>4-5 días semanales</b> y un plan periodizado, podés mejorar tu VDOT entre 3 y 6 puntos en 4 meses. Eso equivale a los tiempos mostrados arriba.</div>
    </div>`;
}

function raceEntryHtml(e) {
  const dist = MARK_DISTS.find((m) => m.key === e.distKey) || MARK_DISTS[1];
  const km = dist.distM / 1000;
  const paceSec = e.timeSec / km;
  const d = new Date(e.date + "T00:00:00");
  const dayNum = isNaN(d) ? "—" : d.getDate();
  const monthAbbr = isNaN(d) ? "" : MONTH_NAMES[d.getMonth()].slice(0, 3).toUpperCase();
  return `
    <div class="race-entry">
      <div class="race-date-badge">
        <div class="rd-day">${dayNum}</div>
        <div class="rd-month">${monthAbbr}</div>
      </div>
      <div class="race-entry-body">
        <div class="race-entry-title">${e.name ? `${esc(e.name)} · ${dist.label}` : dist.label}</div>
        <div class="race-entry-stats">
          <span>${ICONS.pin} ${km} km</span>
          <span>${ICONS.clock} ${formatRaceTime(e.timeSec)}</span>
          <span>${ICONS.paceIcon} ${formatRaceTime(paceSec)} /km</span>
        </div>
      </div>
      <button class="race-del-btn" data-action="deleteRaceEntry" data-id="${e.id}" title="Eliminar">${ICONS.raceClose}</button>
    </div>`;
}

function renderRaceLog(s) {
  const entries = [...(s.raceLog || [])].sort((a, b) => (a.date < b.date ? 1 : -1));
  return `
    <div class="perfil-panel" style="margin-bottom:22px;">
      <div class="perfil-panel-heading">${ICONS.trophy} ÚLTIMAS CARRERAS</div>
      <div class="race-add-row">
        <select class="ob-select" data-bind="raceFormDist">
          ${MARK_DISTS.map((m) => `<option value="${m.key}" ${state.raceFormDist === m.key ? "selected" : ""}>${m.label}</option>`).join("")}
        </select>
        <input class="ob-text" type="text" data-bind="raceFormName" value="${esc(state.raceFormName)}" placeholder="Nombre de la carrera (opcional)" style="width:auto;flex:1;min-width:160px;">
        ${renderDatePicker("raceFormDate", state.raceFormDate, { maxYear: new Date().getFullYear(), minYear: new Date().getFullYear() - 10, defaultYear: new Date().getFullYear() })}
        <div class="pb-segments" style="opacity:1;">
          <input data-bind="raceFormH" placeholder="H" inputmode="numeric" maxlength="2" value="${esc(state.raceFormH)}">
          <span>:</span>
          <input data-bind="raceFormM" placeholder="M" inputmode="numeric" maxlength="2" value="${esc(state.raceFormM)}">
          <span>:</span>
          <input data-bind="raceFormS" placeholder="S" inputmode="numeric" maxlength="2" value="${esc(state.raceFormS)}">
        </div>
        <button class="btn-accent" style="width:auto;padding:11px 18px;margin:0;" data-action="addRaceEntry">Agregar carrera</button>
      </div>
      <div class="race-log-list">
        ${entries.length ? entries.map(raceEntryHtml).join("") : `<div style="font-size:12.5px;color:var(--muted);padding:6px 2px;">Todavía no cargaste carreras. Agregá la fecha, distancia y tiempo de tu última carrera.</div>`}
      </div>
    </div>`;
}

const PERFIL_TABS = [
  { key: "datos", label: "MIS DATOS" },
  { key: "carreras", label: "CARRERAS" },
  { key: "fisiologia", label: "FISIOLOGÍA" },
  { key: "salud", label: "SALUD" },
  { key: "membresia", label: "MEMBRESÍA" },
];

function renderPerfil() {
  const s = state.profile;
  const tab = state.perfilTab || "datos";
  const bodies = {
    datos: renderPerfilDatos(s),
    carreras: renderRaceLog(s),
    fisiologia: renderMyMarks(s),
    salud: renderPerfilSalud(s),
    membresia: renderPerfilMembresia(s),
  };
  return `
    <div class="ob-title">PERFIL DE ATLETA</div>
    <div class="perfil-tabs">
      ${PERFIL_TABS.map((t) => `<button class="perfil-tab-btn ${tab === t.key ? "active" : ""}" data-action="setPerfilTab" data-tab="${t.key}">${t.label}</button>`).join("")}
    </div>
    ${bodies[tab] || bodies.datos}
    <div style="margin-top:32px;max-width:420px;">
      <button class="btn-outline-block" style="padding:16px 0;font-size:15.5px;" data-action="logout">Cerrar sesión</button>
    </div>`;
}

function renderPerfilDatos(s) {
  const age = ageFromBirthdate(s.birthdate);
  const fcMax = fcMaxFromAge(age);
  const bioFields = [
    { key: "weight", label: "PESO (KG)", value: s.weight },
    { key: "height", label: "ALTURA (CM)", value: s.height },
    { key: "fcRest", label: "FC REPOSO", value: s.fcRest },
    { key: null, label: "FC MÁXIMA (211−0,64×EDAD)", value: fcMax, disabled: true },
  ];
  const pbDefs = [
    { key: "walk", label: "RECORD CAMINANDO" },
    { key: "p3k", label: "PB 3K" },
    { key: "p5k", label: "PB 5K" },
    { key: "p10k", label: "PB 10K" },
  ];
  return `
    <div class="ob-photo">
      <div class="avatar-placeholder">
        <svg viewBox="0 0 24 24" width="26" height="26"><rect x="3" y="7" width="18" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="13.5" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>
      </div>
      <div class="caption">FOTO DE PERFIL</div>
    </div>
    <div class="perfil-fields">
      <div class="perfil-field">${ICONS.person}<input data-bind="profile.fullName" value="${esc(s.fullName)}"></div>
      <div class="perfil-field">${ICONS.phone}<input data-bind="profile.phone" value="${esc(s.phone)}" placeholder="Teléfono"></div>
      <div>
        <div class="ob-label">GÉNERO</div>
        <select class="ob-select" data-bind="profile.gender">
          ${["Masculino", "Femenino", "Otro"].map((g) => `<option value="${g}" ${s.gender === g ? "selected" : ""}>${g}</option>`).join("")}
        </select>
      </div>
    </div>

    <div class="perfil-grid">
      <div class="perfil-panel">
        <div class="perfil-panel-heading">${ICONS.lightning.replace('width="19" height="19"', 'width="16" height="16"')} MÉTRICAS BIOMECÁNICAS</div>
        <div style="font-size:11.5px;color:var(--muted);margin:-10px 0 14px;">¿No sabés tu FC en reposo? Medila en <b>Herramientas</b>.</div>
        <div class="bio-grid">
          ${bioFields
            .map(
              (f) => `
            <div class="metric-card">
              <div class="m-label">${f.label}</div>
              <input type="text" value="${esc(String(f.value ?? ""))}" ${f.disabled ? "disabled" : `data-bind="profile.${f.key}"`}>
            </div>`
            )
            .join("")}
        </div>
        <div class="metric-card" style="margin-top:12px;">
          <div class="m-label">NACIMIENTO</div>
          ${renderDatePicker("profile.birthdate", s.birthdate, { minYear: 1940, maxYear: new Date().getFullYear() - 5, defaultYear: 1995 })}
        </div>
      </div>
      <div class="perfil-panel">
        <div class="perfil-panel-heading"><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="8" fill="none" stroke="var(--accent)" stroke-width="1.6"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="var(--accent)" stroke-width="1.6"/></svg> PBS</div>
        <div class="pbs-list">
          ${pbDefs.map((f) => `<div class="pb-row">${pbFieldHtml(f, s, false)}</div>`).join("")}
        </div>
      </div>
    </div>

    <div class="strava-card" style="margin-top:22px;">
      <div class="strava-heading">${ICONS.strava} INTEGRACIONES</div>
      ${
        s.stravaStatus === "disconnected"
          ? `<div class="strava-desc">Conectá tu cuenta de Strava para vincular el ritmo y el tiempo real de tus carreras a esta app.</div>
             <button class="btn-accent" style="width:auto;padding:11px 20px;margin:0;" data-action="connectStrava">Conectar con Strava</button>`
          : s.stravaStatus === "connecting"
          ? `<div class="strava-connecting"><div class="spinner-sm"></div><div style="font-size:13px;color:var(--muted);">Redirigiendo a Strava para autorizar...</div></div>`
          : `<div class="strava-connected-row">
               <div style="display:flex;align-items:center;gap:10px;">
                 <span class="dot-good"></span>
                 <div><div style="font-size:13px;font-weight:700;">Cuenta conectada</div><div style="font-size:11.5px;color:var(--muted);margin-top:2px;">${state.stravaJustSynced ? "Última actividad sincronizada ahora" : "Esperando tu próxima carrera"}</div></div>
               </div>
               <div style="display:flex;gap:8px;">
                 <button class="btn-accent" style="width:auto;padding:9px 16px;margin:0;font-size:12.5px;" data-action="syncStravaActivity">Sincronizar entrenamiento</button>
                 <button class="logout-link" style="background:var(--surface2);padding:9px 16px;border-radius:8px;" data-action="disconnectStrava">Desconectar</button>
               </div>
             </div>
             <div class="strava-desc" style="margin:12px 0 0;">Simulación: te trae tu próxima sesión pendiente del plan y le carga un ritmo y tiempo reales, como haría una sincronización real de Strava.</div>`
      }
    </div>`;
}

function renderPerfilSalud(s) {
  return `
    <div class="perfil-panel" style="max-width:640px;">
      <div class="perfil-panel-heading">${ICONS.lightning.replace('width="19" height="19"', 'width="16" height="16"')} CONTEXTO DE SALUD Y EXPERIENCIA</div>
      <div style="font-size:12px;color:var(--muted);margin:-10px 0 18px;">Esto es lo que usamos para calcular tu nivel. Actualizalo si algo cambió (por ejemplo, una lesión).</div>
      <div class="ob-question">
        ${questionHtml("q1", "¿Corrés actualmente de forma regular?", [["si", "Sí"], ["no", "No"]], s)}
        ${questionHtml("q2", "¿Hace cuánto corrés de forma continua?", [["nunca", "Nunca"], ["menos6", "< 6 meses"], ["mas6", "+ 6 meses"]], s)}
        ${questionHtml("q3", "¿Cuántos km corrés por semana en promedio?", [["cero", "0 km"], ["poco", "1-15 km"], ["mas15", "+15 km"]], s)}
        ${questionHtml("q4", "¿Cuántos minutos podés correr seguido, sin parar a caminar, hoy en día?", [["no", "No puedo correr sin parar"], ["menos20", "Menos de 20 min"], ["20a35", "20 a 35 min"], ["mas35", "Más de 35 min"]], s)}
        ${questionHtml("q5", "¿Entrenaste alguna vez con un plan o corriste una carrera oficial?", [["si", "Sí"], ["no", "No"]], s)}
        ${questionHtml("q6", "¿Cuándo corriste por última vez de forma regular?", [["nunca", "Nunca corrí regular"], ["mas6", "Hace + 6 meses"], ["menos6", "Hace - 6 meses"], ["activo", "Corro activamente ahora"]], s)}
        ${questionHtml("q7", "¿Tuviste alguna lesión reciente que te haya limitado?", [["limitante", "Sí, todavía me limita"], ["recuperado", "Sí, ya recuperado/a"], ["no", "No"]], s)}
      </div>
    </div>`;
}

function renderPerfilMembresia() {
  return `
    <div class="perfil-panel" style="text-align:center;padding:60px 20px;max-width:480px;">
      <div style="font-size:16px;font-weight:800;margin-bottom:8px;">Próximamente</div>
      <div style="font-size:12.5px;color:var(--muted);line-height:1.6;">La gestión de membresía del club (plan, pagos y estado de cuenta) se va a habilitar más adelante.</div>
    </div>`;
}

/* ---------------- COACH APP ---------------- */

function getAllAthleteAccounts() {
  const accounts = loadAccounts();
  return Object.entries(accounts)
    .filter(([email, acc]) => acc.role !== "coach" && acc.profile && acc.profile.onboardingDone)
    .map(([email, acc]) => ({ email, acc }));
}

function unreadCountFor(profile) {
  const readCount = profile.coachReadCount || 0;
  return profile.chatMessages.slice(readCount).filter((m) => m.from === "athlete").length;
}

function getAthleteSummaries() {
  return getAllAthleteAccounts().map(({ email, acc }) => {
    const m = computeRenderModel(acc.profile, 0);
    const isBad = m.acwrStatus.color === "var(--bad)" && !m.weekMeta.isDeload;
    return {
      email,
      name: acc.profile.fullName || email,
      groupKey: m.distInfo.key,
      groupLabel: m.distInfo.label,
      level: m.level,
      adherence: m.pct,
      loadLabel: m.weekMeta.isDeload ? "Descarga" : m.acwrStatus.label,
      loadColor: m.weekMeta.isDeload ? "var(--warn)" : m.acwrStatus.color,
      alert: isBad,
      unread: unreadCountFor(acc.profile),
      sync: acc.profile.stravaStatus === "connected" ? "Strava" : "—",
    };
  });
}

function renderCoachApp() {
  const allAthletes = getAthleteSummaries();
  const query = (state.coachSearch || "").trim().toLowerCase();
  const athletes = query ? allAthletes.filter((a) => a.name.toLowerCase().includes(query)) : allAthletes;
  const levelGroups = LEVEL_ORDER.map((level) => {
    const inLevel = athletes.filter((a) => a.level === level);
    const groupKeys = GROUP_ORDER.filter((gk) => inLevel.some((a) => a.groupKey === gk));
    return {
      level,
      groups: groupKeys.map((gk) => ({
        groupKey: gk,
        groupLabel: GROUP_LABELS[gk] || gk,
        athletes: inLevel.filter((a) => a.groupKey === gk),
      })),
    };
  }).filter((lg) => lg.groups.length > 0);

  return `
  <div class="app-shell">
    <aside class="app-sidebar">
      <div class="sidebar-brand">
        ${ICONS.logo}
        <div>
          <div class="brand-title">TEMPRUN</div>
          <div class="brand-sub">PANEL COACH</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <button class="${state.coachView === "roster" ? "active" : ""}" data-action="backToRoster">${ICONS.people}<span class="nav-label">Panel de atletas</span></button>
      </nav>
      ${
        allAthletes.length > 0
          ? `<input type="text" data-action="coachSearchInput" value="${esc(state.coachSearch || "")}" placeholder="Buscar atleta..." style="width:100%;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:9px 11px;color:var(--text);font-size:12.5px;">`
          : ""
      }
      ${
        levelGroups.length > 0
          ? `
        <div class="coach-roster-nav">
          ${levelGroups
            .map(
              (lg) => `
            <div class="coach-level-block">
              <div class="coach-level-label">${lg.level.toUpperCase()}</div>
              ${lg.groups
                .map(
                  (gr) => `
                <div class="coach-group-block">
                  <div class="coach-group-label">${gr.groupLabel} <span class="coach-group-count">${gr.athletes.length}</span></div>
                  ${gr.athletes
                    .map(
                      (a) => `
                    <button class="coach-athlete-btn ${state.coachView === "detail" && state.selectedAthleteEmail === a.email ? "active" : ""}" data-action="openAthlete" data-email="${esc(a.email)}">
                      ${a.alert ? `<span class="coach-athlete-alert-dot" title="Riesgo"></span>` : ""}
                      <span class="coach-athlete-name">${esc(a.name)}</span>
                      ${a.unread > 0 ? `<span class="athlete-unread-badge" title="${a.unread} mensaje${a.unread > 1 ? "s" : ""} sin leer">${a.unread}</span>` : ""}
                    </button>`
                    )
                    .join("")}
                </div>`
                )
                .join("")}
            </div>`
            )
            .join("")}
        </div>`
          : query
          ? `<div style="font-size:12px;color:var(--muted);padding:8px 4px;">Sin resultados para "${esc(state.coachSearch)}"</div>`
          : ""
      }
      <div class="sidebar-footer">
        <div class="footer-label">TEMA</div>
        <div class="theme-toggle-row">
          <button class="${state.theme === "dark" ? "active" : ""}" data-action="setTheme" data-theme="dark">${ICONS.moon} Oscuro</button>
          <button class="${state.theme === "light" ? "active" : ""}" data-action="setTheme" data-theme="light">${ICONS.sun} Claro</button>
        </div>
        <button class="logout-btn-lg" data-action="logout">Cerrar sesión</button>
      </div>
    </aside>
    <main class="app-content">
      <div class="content-inner">
        ${state.coachView === "detail" && state.selectedAthleteEmail ? renderCoachDetail() : renderCoachRoster(athletes)}
      </div>
    </main>
  </div>`;
}

function renderCoachRoster(athletes) {
  const avgAdherence = athletes.length ? Math.round(athletes.reduce((sum, a) => sum + a.adherence, 0) / athletes.length) : 0;
  const alertsCount = athletes.filter((a) => a.alert).length;

  return `
    <div class="coach-header-row" style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:22px;gap:14px;flex-wrap:wrap;">
      <div>
        <div style="margin-bottom:6px;font-size:26px;font-weight:800;">Panel de atletas</div>
        <div style="font-size:13.5px;color:var(--muted);">Vista general de tu equipo</div>
      </div>
      <button class="logout-btn-lg coach-mobile-logout" style="width:auto;padding:10px 18px;" data-action="logout">Cerrar sesión</button>
    </div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.4px;margin-bottom:8px;">MENSAJE GENERAL (se muestra a atletas sin mensaje personalizado)</div>
      <textarea id="coach-broadcast" style="width:100%;min-height:70px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:13px;resize:vertical;" data-action="broadcastInput">${esc(state.coachBroadcast)}</textarea>
    </div>

    ${
      athletes.length === 0
        ? `<div style="background:var(--surface);border:1px dashed var(--border);border-radius:14px;padding:60px 20px;text-align:center;">
             <div style="font-size:17px;font-weight:800;margin-bottom:8px;">Todavía no hay atletas</div>
             <div style="font-size:13.5px;color:var(--muted);">Cuando un alumno se registre y termine el onboarding, va a aparecer acá.</div>
           </div>`
        : `
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:26px;">
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;">
            <div style="font-size:10.5px;font-weight:700;letter-spacing:0.4px;color:var(--muted);">ATLETAS ACTIVOS</div>
            <div style="font-size:22px;font-weight:800;margin-top:8px;">${athletes.length}</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;">
            <div style="font-size:10.5px;font-weight:700;letter-spacing:0.4px;color:var(--muted);">ALERTAS</div>
            <div style="font-size:22px;font-weight:800;margin-top:8px;color:var(--bad);">${alertsCount}</div>
          </div>
          <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;">
            <div style="font-size:10.5px;font-weight:700;letter-spacing:0.4px;color:var(--muted);">ADHERENCIA PROMEDIO</div>
            <div style="font-size:22px;font-weight:800;margin-top:8px;">${avgAdherence}%</div>
          </div>
        </div>

        <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;overflow:hidden;">
          <div style="display:flex;gap:10px;padding:12px 18px;border-bottom:1px solid var(--border);font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.3px;">
            <div style="flex:2;">ATLETA</div>
            <div style="flex:1;">OBJETIVO</div>
            <div style="flex:1;">NIVEL</div>
            <div style="flex:1;">ADHERENCIA</div>
            <div style="flex:1.4;">CARGA</div>
          </div>
          ${athletes
            .map(
              (a) => `
            <div data-action="openAthlete" data-email="${esc(a.email)}" style="display:flex;align-items:center;padding:13px 18px;border-bottom:1px solid var(--border);font-size:13px;cursor:pointer;">
              <div style="flex:2;font-weight:700;display:flex;align-items:center;gap:8px;">${esc(a.name)}${a.alert ? `<span title="Riesgo" style="width:8px;height:8px;border-radius:50%;background:var(--bad);display:inline-block;"></span>` : ""}${a.unread > 0 ? `<span class="athlete-unread-badge" title="${a.unread} mensaje${a.unread > 1 ? "s" : ""} sin leer">${a.unread}</span>` : ""}</div>
              <div style="flex:1;color:var(--muted);">${a.groupLabel}</div>
              <div style="flex:1;color:var(--muted);">${a.level}</div>
              <div style="flex:1;font-weight:700;">${a.adherence}%</div>
              <div style="flex:1.4;"><span style="font-size:11.5px;font-weight:700;color:${a.loadColor};background:color-mix(in oklch, ${a.loadColor} 18%, transparent);padding:4px 10px;border-radius:12px;">${a.loadLabel}</span></div>
            </div>`
            )
            .join("")}
        </div>`
    }`;
}

function renderCoachDetail() {
  const accounts = loadAccounts();
  const acc = accounts[state.selectedAthleteEmail];
  if (!acc) return renderCoachRoster();
  const profile = acc.profile;
  const weekIndex = Math.max(0, state.coachWeekIndex || 0);
  const m = computeRenderModel(profile, weekIndex);
  const editableDays = m.planDays.map((d) => ({
    ...d,
    kmDisplay: d.type === "rest" ? 0 : d.km,
    expanded: state.coachExpandedKey === d.key,
  }));

  return `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:22px;">
      <button data-action="backToRoster" style="all:unset;cursor:pointer;width:34px;height:34px;border-radius:8px;background:var(--surface);border:1px solid var(--border);color:var(--muted);text-align:center;line-height:32px;">‹</button>
      <div>
        <div style="font-size:24px;font-weight:800;">${esc(profile.fullName || state.selectedAthleteEmail)}</div>
        <div style="font-size:12.5px;color:var(--muted);margin-top:2px;">${m.distInfo.label} · ${m.level} · ${m.pct}% adherencia esta semana · ${m.weekMeta.isDeload ? "Descarga" : m.acwrStatus.label}</div>
      </div>
    </div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px;">
      <div style="font-size:11px;font-weight:700;color:var(--muted);letter-spacing:0.4px;margin-bottom:8px;">MENSAJE FIJO EN EL PANEL DE ${esc((profile.fullName || "").split(" ")[0].toUpperCase())}</div>
      <textarea data-action="athleteMessageInput" style="width:100%;min-height:70px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:10px 12px;color:var(--text);font-size:13px;resize:vertical;" placeholder="Escribí un mensaje solo para este atleta...">${esc(profile.coachMessage || "")}</textarea>
    </div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px;">
      <div style="font-size:15px;font-weight:800;margin-bottom:14px;">Chat con ${esc((profile.fullName || "el atleta").split(" ")[0])}</div>
      <div class="chat-box${profile.chatMessages.length === 0 ? " empty" : ""}" style="min-height:auto;max-height:180px;overflow-y:auto;">
        ${
          profile.chatMessages.length === 0
            ? `<div class="chat-empty-msg">Todavía no hay mensajes con este atleta.</div>`
            : profile.chatMessages
                .map(
                  (msg) => `
          <div class="chat-bubble-row" style="justify-content:${msg.from === "athlete" ? "flex-start" : "flex-end"}">
            <div class="chat-bubble" style="background:${msg.from === "athlete" ? "var(--surface2)" : "var(--accent)"};color:${msg.from === "athlete" ? "var(--text)" : "var(--accent-ink)"}">
              <div class="msg-text">${esc(msg.text)}</div>
              <div class="msg-time">${msg.time}</div>
            </div>
          </div>`
                )
                .join("")
        }
      </div>
      <div class="chat-input-row">
        <input placeholder="Responderle..." data-bind="coachChatInput" value="${esc(state.coachChatInput)}" data-enter-action="coachSendMessage">
        <button class="chat-send-btn" data-action="coachSendMessage">Enviar</button>
      </div>
    </div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px;">
      <div class="plan-header" style="margin-bottom:8px;">
        <div>
          <div class="goal-line">${m.goalLine}</div>
          <div class="phase-full" style="font-size:20px;">${m.phaseLabelFull}</div>
        </div>
        <div class="week-nav">
          <button data-action="coachWeekPrev">‹</button>
          <button data-action="coachWeekNext">›</button>
        </div>
      </div>
      <div class="weeks-bar" style="margin-bottom:6px;">
        ${m.weeksMeta.map((w) => `<div class="bar" title="${w.title}" style="height:${w.barHeight}px;background:${w.color}" data-action="coachJumpWeek" data-idx="${w.index}"></div>`).join("")}
      </div>
      <div style="font-size:11.5px;color:var(--muted);">Toda la planificación del atleta — recorré las semanas para ver o editar cualquier fase del plan.</div>
    </div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;margin-bottom:20px;">
      <div style="font-size:15px;font-weight:800;margin-bottom:4px;">Editar semana ${weekIndex + 1}</div>
      <div style="font-size:12px;color:var(--muted);margin-bottom:16px;">Cambiá el tipo de sesión o los km, y tocá una sesión para ver/editar el detalle completo.</div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        ${editableDays
          .map(
            (d) => `
          <div class="week-day-card">
            <div style="display:flex;align-items:center;gap:10px;padding:14px 16px;flex-wrap:wrap;">
              <div style="width:38px;font-size:12px;font-weight:700;color:var(--muted);flex:none;">${d.day}</div>
              <select data-action="coachSetDayType" data-idx="${d.i}" data-km="${d.kmDisplay}" style="flex:1;min-width:150px;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12.5px;font-weight:600;">
                ${PLAN_TYPE_OPTIONS.map(([v, l]) => `<option value="${v}" ${d.typeKey === v ? "selected" : ""}>${l}</option>`).join("")}
              </select>
              <input type="text" inputmode="decimal" data-action="coachSetDayKm" data-idx="${d.i}" data-typekey="${d.typeKey}" value="${state.coachKmDraft[d.i] != null ? state.coachKmDraft[d.i] : d.kmDisplay}" style="width:70px;flex:none;background:var(--surface2);border:1px solid var(--border);border-radius:8px;padding:8px 10px;color:var(--text);font-size:12.5px;font-weight:700;">
              <span style="font-size:11px;color:var(--muted);width:22px;flex:none;">km</span>
              ${
                d.hasSession
                  ? `<button data-action="coachToggleExpand" data-key="${d.key}" style="all:unset;cursor:pointer;font-size:11px;font-weight:700;color:var(--accent);flex:none;">${d.expanded ? "OCULTAR ▴" : "EDITAR SESIÓN ▾"}</button>`
                  : ""
              }
            </div>
            ${d.hasSession && d.expanded ? renderStravaActual(profile, d.key) + renderBlocksGrid(d.sessionInfo, d.i) : ""}
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:20px;">
      <div style="font-size:15px;font-weight:800;margin-bottom:14px;">Planificación mensual (estimada desde semana ${weekIndex + 1})</div>
      <div style="display:flex;align-items:flex-end;gap:10px;height:90px;">
        ${m.monthWeeks
          .map(
            (w) => `
          <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;">
            <div style="font-size:11px;font-weight:700;">${w.km}km</div>
            <div style="width:100%;border-radius:5px 5px 0 0;background:${w.color};height:${w.barHeight}px;"></div>
            <div style="font-size:10px;color:var(--muted);">${w.label}</div>
          </div>`
          )
          .join("")}
      </div>
    </div>`;
}

function esc(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

/* ---------------- EVENTS ---------------- */

function setByPath(obj, path, value) {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
}

// Filtra en el momento cualquier caracter que no sea dígito o separador decimal — no deja
// escribir letras en los campos de km (entrada en calor, vuelta a la calma, km total).
function sanitizeDecimalInput(el) {
  let v = el.value.replace(/[^0-9.,]/g, "");
  const sep = v.match(/[.,]/);
  if (sep) {
    const sepIndex = v.indexOf(sep[0]);
    v = v.slice(0, sepIndex + 1) + v.slice(sepIndex + 1).replace(/[.,]/g, "");
  }
  if (v !== el.value) {
    const pos = el.selectionStart - (el.value.length - v.length);
    el.value = v;
    try {
      el.setSelectionRange(pos, pos);
    } catch (e) {}
  }
  return v;
}

function bindDynamicListeners() {
  root.querySelectorAll("[data-bind]").forEach((el) => {
    const path = el.getAttribute("data-bind");
    const evt = el.tagName === "SELECT" || el.type === "date" ? "change" : "input";
    el.addEventListener(evt, () => {
      setByPath(state, path, el.value);
      if (path.startsWith("profile.") || path.startsWith("tool")) render();
    });
    if (el.hasAttribute("data-enter-action")) {
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") ACTIONS[el.getAttribute("data-enter-action")]();
      });
    }
  });
  root.querySelectorAll('[data-action="broadcastInput"]').forEach((el) => {
    el.addEventListener("input", () => {
      state.coachBroadcast = el.value;
      applyCoachBroadcast();
    });
  });
  root.querySelectorAll('[data-action="coachSearchInput"]').forEach((el) => {
    el.addEventListener("input", () => {
      state.coachSearch = el.value;
      render();
    });
  });
  root.querySelectorAll('[data-action="athleteMessageInput"]').forEach((el) => {
    el.addEventListener("input", () => {
      const accounts = loadAccounts();
      const acc = accounts[state.selectedAthleteEmail];
      if (!acc) return;
      acc.profile.coachMessage = el.value;
      saveAccounts(accounts);
    });
  });
  root.querySelectorAll('[data-action="dpSetMonth"]').forEach((el) => {
    el.addEventListener("change", () => {
      const path = el.dataset.path;
      const view = state.datePickerView[path] || { year: new Date().getFullYear(), month: 0 };
      state.datePickerView = { ...state.datePickerView, [path]: { ...view, month: parseInt(el.value, 10) } };
      render();
    });
  });
  root.querySelectorAll('[data-action="dpSetYear"]').forEach((el) => {
    el.addEventListener("change", () => {
      const path = el.dataset.path;
      const view = state.datePickerView[path] || { year: new Date().getFullYear(), month: 0 };
      state.datePickerView = { ...state.datePickerView, [path]: { ...view, year: parseInt(el.value, 10) } };
      render();
    });
  });
  root.querySelectorAll('[data-action="coachSetDayType"]').forEach((el) => {
    el.addEventListener("change", () => {
      // acá sí querés un default razonable (8) si el día no tenía km todavía (ej. venía de
      // "Descanso", que muestra 0) — es un caso distinto a estar editando el campo de km.
      coachSetDay(parseInt(el.dataset.idx, 10), el.value, parseFloat(el.dataset.km) || 8);
    });
  });
  root.querySelectorAll('[data-action="coachSetDayKm"]').forEach((el) => {
    el.addEventListener("input", () => {
      const idx = parseInt(el.dataset.idx, 10);
      sanitizeDecimalInput(el);
      // guardamos el texto tal cual se está tipeando (borrador) para que el render no lo
      // reformatee a mitad de tipeo — ej. al escribir "3," antes de llegar a "3,5"
      state.coachKmDraft = { ...state.coachKmDraft, [idx]: el.value };
      // acepta coma o punto como separador decimal (teclados en español escriben ",")
      const normalized = el.value.replace(",", ".");
      const parsed = parseFloat(normalized);
      // ojo: "|| 0" con un 0 real (o el campo vacío mientras se borra el número para escribir
      // uno nuevo) es falsy iguel que NaN — eso hacía que coachSetDay() volviera a poner 8 de
      // vuelta apenas se borraba el campo. Con isNaN se respeta el 0 real tal cual se tipeó.
      coachSetDay(idx, el.dataset.typekey, isNaN(parsed) ? 0 : parsed);
    });
    el.addEventListener("blur", () => {
      const idx = parseInt(el.dataset.idx, 10);
      // se difiere al siguiente tick: si el blur es porque el usuario clickeó otro botón
      // (ej. "EDITAR SESIÓN"), un render() síncrono acá reemplaza el DOM a mitad del click
      // y ese click se pierde — con setTimeout el click ya terminó de procesarse.
      setTimeout(() => {
        const draft = { ...state.coachKmDraft };
        delete draft[idx];
        state.coachKmDraft = draft;
        render();
      }, 0);
    });
  });
  root.querySelectorAll('[data-action="coachSetEdge"]').forEach((el) => {
    el.addEventListener("input", () => {
      const idx = parseInt(el.dataset.idx, 10),
        part = el.dataset.part;
      const draftKey = idx + "-" + part;
      sanitizeDecimalInput(el);
      state.coachEdgeDraft = { ...state.coachEdgeDraft, [draftKey]: el.value };
      const normalized = el.value.replace(",", ".");
      const parsed = parseFloat(normalized);
      // ojo: "|| 0.1" trataría un 0 tipeado a propósito (o un "0." a mitad de escribir "0.5")
      // como inválido y lo pisaría con 0.1 — con isNaN solo cae a 0 cuando el campo
      // todavía no tiene ningún número real (vacío, o solo un "-"/"." suelto).
      coachSetEdge(idx, part, isNaN(parsed) ? 0 : parsed);
    });
    el.addEventListener("blur", () => {
      const idx = parseInt(el.dataset.idx, 10),
        part = el.dataset.part;
      const draftKey = idx + "-" + part;
      setTimeout(() => {
        const draft = { ...state.coachEdgeDraft };
        delete draft[draftKey];
        state.coachEdgeDraft = draft;
        render();
      }, 0);
    });
  });
  root.querySelectorAll(".num-scroll-list").forEach((list) => {
    const sel = list.querySelector(".num-cell.selected");
    (sel || list.firstElementChild)?.scrollIntoView({ block: "center" });
  });
}

function coachSetDay(idx, typeKey, km) {
  const accounts = loadAccounts();
  const acc = accounts[state.selectedAthleteEmail];
  if (!acc) return;
  const cfg = SESSION_TYPES[typeKey];
  // Number.isFinite(0) es true — a diferencia de "km || 8", esto no pisa un 0 real (el
  // atleta está borrando el campo para tipear un número nuevo) con el default de 8.
  const finalKm = cfg.type === "rest" ? 0 : Number.isFinite(km) ? km : 8;
  const key = (state.coachWeekIndex || 0) + "-" + idx;
  // se preservan los overrides de entrada/vuelta que ya se hubieran cargado para este día,
  // así cambiar el tipo o el km total no los borra.
  const prev = acc.profile.dayOverrides[key] || {};
  acc.profile.dayOverrides[key] = {
    ...cfg,
    km: finalKm,
    dist: cfg.type === "rest" ? "—" : finalKm + " km",
    warmupMinOverride: prev.warmupMinOverride,
    cooldownMinOverride: prev.cooldownMinOverride,
    // el día base puede haber sido CACO (isCaco/cacoRunMin/etc. en el objeto original) —
    // si el nuevo tipo no es CACO hay que limpiar esos campos explícitamente, si no el
    // merge con el día base los deja pegados y la sesión se sigue viendo como CACO.
    isCaco: cfg.isCaco || false,
    cacoRunMin: cfg.cacoRunMin,
    cacoWalkMin: cfg.cacoWalkMin,
    cacoReps: cfg.cacoReps,
  };
  saveAccounts(accounts);
  render();
}

function coachSetEdge(idx, part, value) {
  const accounts = loadAccounts();
  const acc = accounts[state.selectedAthleteEmail];
  if (!acc) return;
  const key = (state.coachWeekIndex || 0) + "-" + idx;
  let existing = acc.profile.dayOverrides[key];
  if (!existing) {
    // todavía no se había tocado el tipo/km de este día — se crea un override a partir
    // del valor que ya tiene calculado el plan, para no perder nada.
    const m = computeRenderModel(acc.profile, state.coachWeekIndex || 0);
    const day = m.planDays[idx];
    const cfg = SESSION_TYPES[day.typeKey] || SESSION_TYPES.easy;
    existing = { ...cfg, km: day.km, dist: cfg.type === "rest" ? "—" : day.km + " km" };
  }
  existing[part] = value;
  acc.profile.dayOverrides[key] = existing;
  saveAccounts(accounts);
  render();
}

function applyCoachBroadcast() {
  const accounts = loadAccounts();
  Object.entries(accounts).forEach(([email, acc]) => {
    if (acc.role === "coach" || !acc.profile) return;
    if (!acc.profile.coachMessage || acc.profile.coachMessage === state.coachBroadcastPrev) {
      // only overwrite if it looked like a previous broadcast (avoid clobbering personalized msgs)
    }
  });
  localStorage.setItem("temprun_coach_broadcast", state.coachBroadcast);
}

root.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.getAttribute("data-action");
  if (action === "toggleDoneStop") {
    e.stopPropagation();
    ACTIONS.toggleDone(el.dataset.key);
    return;
  }
  const fn = ACTIONS[action];
  if (fn) fn(el);
});

const ACTIONS = {
  loginWithGoogle: () => quickSocialLogin("Juan Pérez", "google-user@temprun.demo"),
  loginWithApple: () => quickSocialLogin("Juan Pérez", "apple-user@temprun.demo"),
  goSignup: () => setState({ loginScreen: "signup", loginError: "" }),
  goSignin: () => setState({ loginScreen: "signin", loginError: "" }),
  goRecover: () =>
    setState({ loginScreen: "recover", recoverStep: "email", recoverEmail: state.loginEmail, recoverError: "", recoverPassword1: "", recoverPassword2: "" }),
  backToLogin: () => setState({ loginScreen: "signin" }),
  checkRecoverEmail: () => {
    const email = state.recoverEmail.trim().toLowerCase();
    const accounts = loadAccounts();
    if (!email || !accounts[email]) {
      setState({ recoverError: "No existe ninguna cuenta con ese email." });
      return;
    }
    setState({ recoverStep: "reset", recoverFoundEmail: email, recoverError: "" });
  },
  submitReset: () => {
    if (state.recoverPassword1.length < 4) {
      setState({ recoverError: "La contraseña debe tener al menos 4 caracteres." });
      return;
    }
    if (state.recoverPassword1 !== state.recoverPassword2) {
      setState({ recoverError: "Las contraseñas no coinciden." });
      return;
    }
    const accounts = loadAccounts();
    const acc = accounts[state.recoverFoundEmail];
    if (!acc) {
      setState({ recoverError: "No existe ninguna cuenta con ese email." });
      return;
    }
    acc.password = state.recoverPassword1;
    saveAccounts(accounts);
    setState({ recoverStep: "done", recoverError: "" });
  },
  doLogin: () => {
    const email = state.loginEmail.trim().toLowerCase();
    const accounts = loadAccounts();
    if (!email || !state.loginPassword) {
      setState({ loginError: "Completá email y contraseña." });
      return;
    }
    const acc = accounts[email];
    if (!acc || acc.password !== state.loginPassword) {
      setState({ loginError: "Email o contraseña incorrectos." });
      return;
    }
    enterAccount(email, acc);
  },
  doSignup: () => {
    const email = state.signupEmail.trim().toLowerCase();
    if (!state.signupName.trim() || !email || state.signupPassword.length < 4) {
      setState({ loginError: "Completá nombre, email y una contraseña de al menos 4 caracteres." });
      return;
    }
    const accounts = loadAccounts();
    if (accounts[email]) {
      setState({ loginError: "Ya existe una cuenta con ese email." });
      return;
    }
    const profile = defaultProfileState();
    profile.fullName = state.signupName.trim();
    const acc = { password: state.signupPassword, role: "athlete", profile };
    accounts[email] = acc;
    saveAccounts(accounts);
    enterAccount(email, acc);
  },
  logout: () => {
    setState({
      screen: "login",
      loginScreen: "signin",
      loginEmail: "",
      loginPassword: "",
      signupName: "",
      signupEmail: "",
      signupPassword: "",
      loginError: "",
      currentEmail: null,
      role: "athlete",
      coachView: "roster",
      selectedAthleteEmail: null,
    });
    localStorage.removeItem(SESSION_KEY);
  },
  obNext: () => {
    const s = state.profile;
    const step = state.onboardingStep;
    if (step === 4 && (!s.goalName.trim() || !s.goalDate)) { render(); return; }
    if (step === 6) {
      const la = s.levelAnswers;
      if (!(la.q1 && la.q2 && la.q3 && la.q4 && la.q5 && la.q6 && la.q7)) { render(); return; }
    }
    if (step === 7 && DAY_KEYS.filter((k) => s.availability[k]).length < MIN_AVAIL_DAYS) { render(); return; }
    if (step === 7) {
      compileProgram();
      return;
    }
    setState({ onboardingStep: step + 1 });
  },
  obBack: () => setState({ onboardingStep: Math.max(1, state.onboardingStep - 1) }),
  toggleAvail: (el) => {
    const day = el.dataset.day;
    setProfile((p) => ({ availability: { ...p.availability, [day]: !p.availability[day] } }));
  },
  setLevelAnswer: (el) => {
    const q = el.dataset.q,
      val = el.dataset.val;
    setProfile((p) => ({ levelAnswers: { ...p.levelAnswers, [q]: val } }));
  },
  pbToggleNone: (el) => {
    const key = el.dataset.pb;
    setProfile((p) => ({ pbs: { ...p.pbs, [key]: p.pbs[key] === "NONE" ? "" : "NONE" } }));
  },
  addRaceEntry: () => {
    const h = parseInt(state.raceFormH, 10) || 0;
    const m = parseInt(state.raceFormM, 10) || 0;
    const sec = parseInt(state.raceFormS, 10) || 0;
    const timeSec = h * 3600 + m * 60 + sec;
    if (!state.raceFormDate || timeSec <= 0) return;
    const distKey = state.raceFormDist;
    const entry = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 7),
      distKey,
      date: state.raceFormDate,
      timeSec,
      name: state.raceFormName.trim(),
    };
    setProfile((p) => {
      const prevSec = parseTime(p.pbs[distKey] === "NONE" ? "" : p.pbs[distKey]);
      // la carrera cargada actualiza el PB de esa distancia solo si es una marca mejor
      // (o si todavía no había ninguna) — nunca empeora un PB ya cargado.
      const isNewBest = prevSec <= 0 || timeSec < prevSec;
      const h2 = Math.floor(timeSec / 3600),
        m2 = Math.floor((timeSec % 3600) / 60),
        s2 = timeSec % 60;
      return {
        raceLog: [...(p.raceLog || []), entry],
        pbs: isNewBest ? { ...p.pbs, [distKey]: `${h2}:${String(m2).padStart(2, "0")}:${String(s2).padStart(2, "0")}` } : p.pbs,
      };
    });
    setState({ raceFormName: "", raceFormDate: "", raceFormH: "", raceFormM: "", raceFormS: "" });
  },
  deleteRaceEntry: (el) => {
    const id = el.dataset.id;
    setProfile((p) => ({ raceLog: (p.raceLog || []).filter((r) => r.id !== id) }));
  },
  pulseSetDuration: (el) => {
    if (state.pulseRunning) return;
    setState({ pulseDuration: parseInt(el.dataset.sec, 10), pulseResult: null, pulseSaved: false });
  },
  pulseSetMode: (el) => {
    if (state.pulseRunning) return;
    setState({ pulseMode: el.dataset.mode, pulseResult: null, pulseSaved: false, pulseAwaitingCount: false });
  },
  pulseStart: () => {
    if (pulseIntervalId) clearInterval(pulseIntervalId);
    state.pulseRunning = true;
    state.pulseStartedAt = Date.now();
    state.pulseTaps = 0;
    state.pulseResult = null;
    state.pulseSaved = false;
    state.pulseAwaitingCount = false;
    state.toolPulseManualCount = "";
    pulseIntervalId = setInterval(pulseTick, 150);
    render();
  },
  pulseTap: () => {
    if (!state.pulseRunning || state.pulseMode !== "tap") return;
    state.pulseTaps++;
    render();
  },
  pulseSubmitCount: () => {
    const count = parseInt(state.toolPulseManualCount, 10);
    if (!Number.isFinite(count) || count <= 0) return;
    setState({ pulseResult: Math.round((count / state.pulseDuration) * 60), pulseAwaitingCount: false, pulseSaved: false });
  },
  pulseCancel: () => {
    if (pulseIntervalId) clearInterval(pulseIntervalId);
    pulseIntervalId = null;
    setState({ pulseRunning: false, pulseStartedAt: null, pulseTaps: 0, pulseResult: null, pulseSaved: false, pulseAwaitingCount: false, toolPulseManualCount: "" });
  },
  pulseReset: () => setState({ pulseResult: null, pulseSaved: false, pulseTaps: 0, pulseAwaitingCount: false, toolPulseManualCount: "" }),
  toggleGlossary: () => setState((s) => ({ toolGlossaryOpen: !s.toolGlossaryOpen })),
  pulseUseResult: () => {
    if (state.pulseResult == null) return;
    setProfile({ fcRest: String(state.pulseResult) });
    setState({ pulseSaved: true });
  },
  goTab: (el) => setState({ athleteTab: el.dataset.tab, selectedDayIdx: null, expandedKey: null }),
  setPerfilTab: (el) => setState({ perfilTab: el.dataset.tab }),
  setTheme: (el) => setState({ theme: el.dataset.theme }),
  pickDay: (el) => setState({ selectedDayIdx: parseInt(el.dataset.idx, 10) }),
  weekPrev: () => setState((s) => ({ weekIndex: Math.max(0, s.weekIndex - 1), expandedKey: null, selectedDayIdx: null })),
  weekNext: () => setState({ weekIndex: state.weekIndex + 1, expandedKey: null, selectedDayIdx: null }),
  jumpWeek: (el) => setState({ weekIndex: parseInt(el.dataset.idx, 10), expandedKey: null }),
  resetPlanProgress: () => {
    if (!confirm("¿Reiniciar el progreso del plan actual? Se borrarán los entrenamientos marcados como completados y las sincronizaciones de Strava, pero mantenés el mismo objetivo y nivel.")) return;
    setProfile({ completed: {}, dayOverrides: {}, stravaActivities: {} });
    setState({ weekIndex: 0, expandedKey: null, selectedDayIdx: null });
  },
  startNewPlan: () => {
    if (!confirm("¿Crear un plan nuevo? Vas a volver a definir tu objetivo, marcas personales y nivel. Tu perfil y datos de salud se mantienen.")) return;
    setProfile((p) => ({
      goalName: "",
      goalDate: "",
      weeklyKm: 11,
      levelAnswers: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "" },
      pbs: { walk: "", p3k: "", p5k: "", p10k: "" },
      completed: {},
      dayOverrides: {},
      stravaActivities: {},
      onboardingDone: false,
    }));
    setState({ screen: "onboarding", onboardingStep: 4, weekIndex: 0, expandedKey: null, selectedDayIdx: null, athleteTab: "panel" });
  },
  toggleDone: (key) => {
    const k = typeof key === "string" ? key : key.dataset.key;
    setProfile((p) => ({ completed: { ...p.completed, [k]: !p.completed[k] } }));
  },
  toggleExpand: (el) => {
    const key = el.dataset.key;
    setState({ expandedKey: state.expandedKey === key ? null : key });
  },
  connectStrava: () => {
    setProfile({ stravaStatus: "connecting" });
    setTimeout(() => setProfile({ stravaStatus: "connected", stravaConnectedAt: Date.now() }), 1600);
  },
  disconnectStrava: () => setProfile({ stravaStatus: "disconnected", stravaConnectedAt: null, stravaActivities: {} }),
  syncStravaActivity: () => {
    const s = state.profile;
    let target = null;
    for (let w = state.weekIndex; w < state.weekIndex + 6; w++) {
      const model = computeRenderModel(s, w);
      const pending = model.planDays.find((d) => d.hasSession && !d.done);
      if (pending) {
        target = { weekIndex: model.weekIndex, day: pending, paces: model.paces };
        break;
      }
    }
    if (!target) return;
    const plannedKm = target.day.km;
    const paceBaseStr = target.day.type === "hard" ? target.paces.threshold : target.paces.easy;
    const paceBaseMin = paceToMinutes(paceBaseStr);
    const distVariance = 0.92 + Math.random() * 0.14;
    const paceVariance = 0.95 + Math.random() * 0.12;
    const actualKm = Math.max(1, Math.round(plannedKm * distVariance * 10) / 10);
    const actualPaceMin = paceBaseMin * paceVariance;
    const durationMin = Math.max(1, Math.round(actualKm * actualPaceMin));
    const pm = Math.floor(actualPaceMin);
    const ps = Math.round((actualPaceMin - pm) * 60);
    const paceStr = `${pm}:${String(ps).padStart(2, "0")}`;
    const key = target.weekIndex + "-" + target.day.i;

    setProfile((p) => ({
      completed: { ...p.completed, [key]: true },
      stravaActivities: { ...p.stravaActivities, [key]: { km: actualKm, durationMin, pace: paceStr, syncedAt: Date.now() } },
      stravaConnectedAt: Date.now(),
    }));
    setState({ stravaJustSynced: true, weekIndex: target.weekIndex, expandedKey: key });
  },
  sendMessage: () => {
    if (!state.chatInput.trim()) return;
    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    setProfile((p) => ({ chatMessages: [...p.chatMessages, { from: "athlete", text: state.chatInput, time }] }));
    setState({ chatInput: "" });
  },
  openAthlete: (el) => {
    const email = el.dataset.email;
    const accounts = loadAccounts();
    const acc = accounts[email];
    if (acc && acc.profile) {
      acc.profile.coachReadCount = acc.profile.chatMessages.length;
      saveAccounts(accounts);
    }
    setState({ coachView: "detail", selectedAthleteEmail: email, coachWeekIndex: 0, coachExpandedKey: null, coachChatInput: "" });
  },
  backToRoster: () => setState({ coachView: "roster", selectedAthleteEmail: null }),
  coachWeekPrev: () => setState((s) => ({ coachWeekIndex: Math.max(0, (s.coachWeekIndex || 0) - 1), coachExpandedKey: null })),
  coachWeekNext: () => setState((s) => ({ coachWeekIndex: (s.coachWeekIndex || 0) + 1, coachExpandedKey: null })),
  coachJumpWeek: (el) => setState({ coachWeekIndex: parseInt(el.dataset.idx, 10), coachExpandedKey: null }),
  coachToggleExpand: (el) => {
    const key = el.dataset.key;
    setState({ coachExpandedKey: state.coachExpandedKey === key ? null : key });
  },
  coachSendMessage: () => {
    if (!state.coachChatInput.trim()) return;
    const accounts = loadAccounts();
    const acc = accounts[state.selectedAthleteEmail];
    if (!acc) return;
    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    acc.profile.chatMessages = [...acc.profile.chatMessages, { from: "coach", text: state.coachChatInput, time }];
    acc.profile.coachReadCount = acc.profile.chatMessages.length;
    saveAccounts(accounts);
    setState({ coachChatInput: "" });
  },

  toggleDatePicker: (el) => {
    const path = el.dataset.path;
    if (state.openDatePicker === path) {
      setState({ openDatePicker: null });
      return;
    }
    if (!state.datePickerView[path]) {
      const current = getByPath(state, path);
      const defaultYear = parseInt(el.dataset.defaultYear, 10) || new Date().getFullYear();
      let view;
      if (current) {
        const [y, m] = current.split("-").map(Number);
        view = { year: y, month: m - 1 };
      } else {
        view = { year: defaultYear, month: 0 };
      }
      state.datePickerView = { ...state.datePickerView, [path]: view };
    }
    setState({ openDatePicker: path });
  },
  closeDatePicker: () => setState({ openDatePicker: null }),
  dpPrevMonth: (el) => shiftDatePickerMonth(el.dataset.path, -1),
  dpNextMonth: (el) => shiftDatePickerMonth(el.dataset.path, 1),
  dpSelectDay: (el) => {
    const path = el.dataset.path;
    setByPath(state, path, el.dataset.iso);
    state.openDatePicker = null;
    render();
    persistCurrentProfile();
  },

  toggleNumPicker: (el) => {
    const path = el.dataset.path;
    setState({ openNumPicker: state.openNumPicker === path ? null : path });
  },
  closeNumPicker: () => setState({ openNumPicker: null }),
  numSelect: (el) => {
    const path = el.dataset.path;
    setByPath(state, path, el.dataset.val);
    state.openNumPicker = null;
    render();
    persistCurrentProfile();
  },
  pbSegSelect: (el) => {
    const key = el.dataset.pb,
      part = el.dataset.part,
      val = pad2(parseInt(el.dataset.val, 10));
    setProfile((p) => {
      const cur = pbParts(p.pbs[key] === "NONE" ? "" : p.pbs[key]);
      cur[part] = val;
      return { pbs: { ...p.pbs, [key]: `${cur.h || "0"}:${cur.m || "00"}:${cur.s || "00"}` } };
    });
    setState({ openNumPicker: null });
  },
};

function shiftDatePickerMonth(path, delta) {
  const view = state.datePickerView[path] || { year: new Date().getFullYear(), month: 0 };
  let month = view.month + delta;
  let year = view.year;
  if (month < 0) {
    month = 11;
    year--;
  } else if (month > 11) {
    month = 0;
    year++;
  }
  state.datePickerView = { ...state.datePickerView, [path]: { year, month } };
  render();
}

function getByPath(obj, path) {
  return path.split(".").reduce((cur, key) => (cur == null ? cur : cur[key]), obj);
}

function quickSocialLogin(name, email) {
  const accounts = loadAccounts();
  let acc = accounts[email];
  if (!acc) {
    const profile = defaultProfileState();
    profile.fullName = name;
    acc = { password: null, role: "athlete", profile };
    accounts[email] = acc;
    saveAccounts(accounts);
  }
  enterAccount(email, acc);
}

function enterAccount(email, acc) {
  localStorage.setItem(SESSION_KEY, email);
  if (acc.role === "coach") {
    setState({
      screen: "app",
      role: "coach",
      currentEmail: email,
      coachView: "roster",
      selectedAthleteEmail: null,
      coachBroadcast: localStorage.getItem("temprun_coach_broadcast") || "",
      loginError: "",
    });
    return;
  }
  const profile = acc.profile;
  if (profile.onboardingDone) {
    setState({ screen: "app", role: "athlete", currentEmail: email, profile, athleteTab: "panel", weekIndex: 0, loginError: "" });
    initWeather();
  } else {
    setState({ screen: "onboarding", role: "athlete", currentEmail: email, profile, onboardingStep: 1, loginError: "" });
  }
}

function compileProgram() {
  setState({ screen: "compiling", compileStep: 0 });
  setTimeout(() => setState({ compileStep: 1 }), 700);
  setTimeout(() => setState({ compileStep: 2 }), 1500);
  setTimeout(() => {
    const g = state.profile.gender;
    // primer mensaje que ve el atleta en el panel, apenas se compila su plan por primera vez —
    // el coach puede reemplazarlo después escribiendo el suyo.
    const welcome = `${g === "Femenino" ? "Bienvenida" : g === "Masculino" ? "Bienvenido" : "Bienvenido/a"} a TempRun by Iago Alvarez. Acá empieza tu camino. ¡Que lo disfrutes!`;
    setProfile({ onboardingDone: true, coachMessage: welcome });
    persistCurrentProfile();
    setState({ screen: "app", athleteTab: "panel", weekIndex: 0 });
    initWeather();
  }, 3100);
}

// Clima/ubicación del panel: se pide una sola vez por sesión de navegador (no por atleta,
// ya que la ubicación real es la del dispositivo). Si el usuario no da permiso o falla la
// consulta, el panel simplemente no muestra el clima en vez de trabar la pantalla.
function initWeather() {
  if (state.weatherStatus !== "idle") return;
  if (!navigator.geolocation) {
    setState({ weatherStatus: "unsupported" });
    return;
  }
  setState({ weatherStatus: "loading" });
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const [weatherRes, placeRes] = await Promise.all([
          fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`),
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=es`),
        ]);
        const weatherData = await weatherRes.json();
        const placeData = await placeRes.json();
        const temp = weatherData?.current_weather?.temperature;
        const city = placeData?.city || placeData?.locality || placeData?.principalSubdivision || "";
        if (temp == null) throw new Error("sin datos de clima");
        setState({ weatherStatus: "ready", weatherTemp: Math.round(temp), weatherCity: city });
      } catch (e) {
        setState({ weatherStatus: "error" });
      }
    },
    () => setState({ weatherStatus: "denied" }),
    { timeout: 8000 }
  );
}

function persistCurrentProfile() {
  if (!state.currentEmail) return;
  const accounts = loadAccounts();
  if (!accounts[state.currentEmail]) return;
  accounts[state.currentEmail].profile = state.profile;
  saveAccounts(accounts);
}

// Autosave profile on any state change while in-app
const originalSetProfile = setProfile;
setProfile = function (patch) {
  originalSetProfile(patch);
  persistCurrentProfile();
};

/* ---------------- INIT ---------------- */

(function init() {
  ensureCoachAccount();
  const savedEmail = localStorage.getItem(SESSION_KEY);
  if (savedEmail) {
    const accounts = loadAccounts();
    const acc = accounts[savedEmail];
    if (acc) {
      state.currentEmail = savedEmail;
      if (acc.role === "coach") {
        state.role = "coach";
        state.screen = "app";
        state.coachBroadcast = localStorage.getItem("temprun_coach_broadcast") || "";
      } else {
        state.role = "athlete";
        state.profile = acc.profile;
        state.screen = acc.profile.onboardingDone ? "app" : "onboarding";
      }
    }
  }
  render();
  if (sb) {
    pullAccountsFromSupabase();
    setInterval(pullAccountsFromSupabase, SUPABASE_SYNC_INTERVAL_MS);
  }
})();
