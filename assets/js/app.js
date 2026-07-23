/* TempRun — app principal (estado + render). Sin dependencias externas. */

const ICONS = {
  logo: `<svg width="26" height="26" viewBox="0 0 28 28"><path d="M2 20 L8 8 L14 16 L20 6 L26 14" stroke="var(--accent)" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  panel: `<svg viewBox="0 0 24 24" width="17" height="17"><rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/><rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/><rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor" opacity="0.5"/><rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/></svg>`,
  plan: `<svg viewBox="0 0 24 24" width="17" height="17"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="1.6"/><line x1="7" y1="3" x2="7" y2="7" stroke="currentColor" stroke-width="1.6"/><line x1="17" y1="3" x2="17" y2="7" stroke="currentColor" stroke-width="1.6"/></svg>`,
  tools: `<svg viewBox="0 0 24 24" width="17" height="17"><path d="M14.7 6.3a3 3 0 0 1-3.9 3.9L5 16l3 3 5.8-5.8a3 3 0 0 1 3.9-3.9L21 6l-3-3-3.3 3.3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  perfil: `<svg viewBox="0 0 24 24" width="17" height="17"><circle cx="12" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4 20c0-3.6 3.2-6 8-6s8 2.4 8 6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  lightning: `<svg viewBox="0 0 24 24" width="19" height="19"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="var(--accent)"/></svg>`,
  chat: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 5h16v11H9l-4 4V5z" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
  weather: `<svg viewBox="0 0 24 24" width="17" height="17"><circle cx="12" cy="12" r="4" fill="var(--warn)"/><g stroke="var(--warn)" stroke-width="1.6"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></g></svg>`,
  moon: `<svg viewBox="0 0 24 24" width="15" height="15"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" width="15" height="15"><circle cx="12" cy="12" r="4" fill="currentColor"/><g stroke="currentColor" stroke-width="1.6"><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/></g></svg>`,
  strava: `<svg viewBox="0 0 24 24" width="18" height="18"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="var(--accent)"/></svg>`,
  person: `<svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="8" r="3.5" fill="none" stroke="var(--muted)" stroke-width="1.6"/><path d="M4 20c0-3.6 3.2-6 8-6s8 2.4 8 6" fill="none" stroke="var(--muted)" stroke-width="1.6"/></svg>`,
  phone: `<svg viewBox="0 0 24 24" width="16" height="16"><path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 5 5L15 12l5 2v3c0 1.1-.9 2-2 2C10.6 19 5 13.4 5 6c0-1.1.9-2 2-2z" fill="none" stroke="var(--muted)" stroke-width="1.4" stroke-linejoin="round"/></svg>`,
};

const ACCOUNTS_KEY = "temprun_accounts";
const SESSION_KEY = "temprun_session";

function loadAccounts() {
  return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
}
function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
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
    goalDistance: "10K / 10000m",
    goalDate: "",
    weeklyKm: 11,
    levelAnswers: { q1: "", q2: "", q3: "", q4: "", q5: "" },
    availability: { Lun: true, Mar: false, Mié: true, Jue: false, Vie: true, Sáb: false, Dom: false },
    pbs: { walk: "", p3k: "", p5k: "", p10k: "" },
    completed: {},
    dayOverrides: {},
    coachMessage: "",
    stravaStatus: "disconnected",
    stravaConnectedAt: null,
    chatMessages: [
      { from: "coach", text: "Vamos bien. Cualquier cosa, escribime.", time: "09:14" },
      { from: "athlete", text: "Dale, el fartlek de mañana lo hago a la tarde ¿va bien?", time: "09:20" },
      { from: "coach", text: "Perfecto, mejor con más descanso. Avisame cómo te sentís.", time: "09:22" },
    ],
    onboardingDone: false,
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
  recoverEmail: "",
  recoverSubmitted: false,
  currentEmail: null,
  onboardingStep: 1,
  compileStep: 0,
  theme: "dark",
  athleteTab: "panel",
  weekIndex: 0,
  expandedKey: null,
  selectedDayIdx: null,
  chatInput: "",
  profile: defaultProfileState(),
};

function setState(patch) {
  Object.assign(state, typeof patch === "function" ? patch(state) : patch);
  render();
}
function setProfile(patch) {
  Object.assign(state.profile, typeof patch === "function" ? patch(state.profile) : patch);
  render();
}

const root = document.getElementById("root");

function render() {
  document.documentElement.setAttribute("data-theme", state.theme);
  let html = "";
  if (state.screen === "login") html = renderAuth();
  else if (state.screen === "onboarding") html = renderOnboarding();
  else if (state.screen === "compiling") html = renderCompiling();
  else if (state.screen === "app") html = renderApp();
  root.innerHTML = html;
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
  return `
  <div class="auth-screen">
    <div class="auth-card">
      <div class="auth-logo">${ICONS.logo}<div>TEMPRUN</div></div>
      ${
        !state.recoverSubmitted
          ? `
        <div class="auth-title">Recuperar contraseña</div>
        <div class="auth-subtitle">Ingresá tu email y te enviamos un enlace para restablecerla.</div>
        <input class="field-input" type="email" placeholder="Email" data-bind="recoverEmail" value="${esc(state.recoverEmail)}">
        <button class="btn-accent" data-action="sendRecover">Enviar enlace</button>
      `
          : `
        <div style="width:52px;height:52px;border-radius:50%;background:color-mix(in oklch, var(--good) 18%, transparent);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
          <svg viewBox="0 0 24 24" width="24" height="24"><path d="M20 6 9 17l-5-5" fill="none" stroke="var(--good)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="auth-title">Listo, revisá tu correo</div>
        <div class="auth-subtitle">Te enviamos un enlace a <strong style="color:var(--text)">${esc(state.recoverEmail)}</strong> para restablecer tu contraseña.</div>
      `
      }
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
  const levelComplete = !!(s.levelAnswers.q1 && s.levelAnswers.q2 && s.levelAnswers.q3 && s.levelAnswers.q4 && s.levelAnswers.q5);
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
      <div class="ob-field-icon accent" style="margin-bottom:6px;">
        <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="var(--accent)" stroke-width="1.6"/><line x1="3" y1="10" x2="21" y2="10" stroke="var(--accent)" stroke-width="1.6"/></svg>
        <input type="date" data-bind="profile.birthdate" value="${esc(s.birthdate)}">
      </div>
      <div class="ob-hint">Con tu edad calculamos tu FC máxima (${fcMax} bpm) y así poder ajustar tus zonas.</div>
      <div class="ob-grid-2" style="margin-bottom:14px;">
        <div>
          <div class="ob-label">PESO (KG)</div>
          <div class="ob-field-icon"><span>⚖️</span><input data-bind="profile.weight" value="${esc(s.weight)}"></div>
        </div>
        <div>
          <div class="ob-label">ALTURA (CM)</div>
          <div class="ob-field-icon"><span>📏</span><input data-bind="profile.height" value="${esc(s.height)}"></div>
        </div>
      </div>
      <div>
        <div class="ob-label">FC EN REPOSO (BPM)</div>
        <div class="ob-field-icon"><svg viewBox="0 0 24 24" width="15" height="15"><path d="M3 12h4l2-6 4 12 2-6h6" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linejoin="round"/></svg><input data-bind="profile.fcRest" value="${esc(s.fcRest)}"></div>
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
            ${["5K / 5000m", "10K / 10000m", "21K / 21097m", "42K / 42195m"].map((d) => `<option value="${d}" ${s.goalDistance === d ? "selected" : ""}>${d}</option>`).join("")}
          </select>
        </div>
        <div>
          <div class="ob-label">FECHA (OBLIGATORIA)</div>
          <input class="ob-text accent" type="date" data-bind="profile.goalDate" value="${esc(s.goalDate)}">
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
        ${questionHtml("q4", "¿Podés correr 30 minutos seguidos sin parar a caminar?", [["no", "No"], ["esfuerzo", "Con esfuerzo"], ["comodo", "Sí, cómodo"]], s)}
        ${questionHtml("q5", "¿Entrenaste alguna vez con un plan o corriste una carrera oficial?", [["si", "Sí"], ["no", "No"]], s)}
      </div>
      ${levelComplete ? `<div class="level-detected"><span class="lbl">NIVEL DETECTADO</span><span class="val">${level}</span></div>` : ""}`;
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
        <input data-action="pbSeg" data-pb="${f.key}" data-part="h" ${isNone ? "disabled" : ""} placeholder="00" inputmode="numeric" maxlength="2" value="${esc(parts.h)}">
        <span>:</span>
        <input data-action="pbSeg" data-pb="${f.key}" data-part="m" ${isNone ? "disabled" : ""} placeholder="00" inputmode="numeric" maxlength="2" value="${esc(parts.m)}">
        <span>:</span>
        <input data-action="pbSeg" data-pb="${f.key}" data-part="s" ${isNone ? "disabled" : ""} placeholder="00" inputmode="numeric" maxlength="2" value="${esc(parts.s)}">
      </div>
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

function computeRenderModel() {
  const s = state.profile;
  const age = ageFromBirthdate(s.birthdate);
  const fcMax = fcMaxFromAge(age);
  const fcRest = parseFloat(s.fcRest) || 60;
  const distInfo = parseGoalDistance(s.goalDistance);
  const level = levelFromAnswers(s.levelAnswers);
  const vdot = computeVdot(s.pbs, level);
  const paces = computePaces(vdot);
  const macro = buildMacrocycle(s, paces, level);
  const weekIndex = Math.max(0, Math.min(macro.totalWeeks - 1, state.weekIndex));
  const weekMeta = macro.weeks[weekIndex];

  const rawDaysBase = buildWeekDays(weekMeta, s.availability, paces, level, distInfo);
  const rawDays = rawDaysBase.map((d, i) => {
    const ov = s.dayOverrides[weekIndex + "-" + i];
    return ov ? { ...d, ...ov } : d;
  });

  const planDays = rawDays.map((d, i) => {
    const key = weekIndex + "-" + i;
    const done = !!s.completed[key];
    const isRest = d.type === "rest";
    const barColor = d.type === "hard" ? "var(--bad)" : d.type === "long" ? "var(--accent)" : isRest ? "var(--muted)" : "var(--good)";
    const expanded = state.expandedKey === key;
    const sessionInfoRaw = isRest ? null : sessionBlocks(d, fcRest, fcMax, paces, distInfo);
    const sessionInfo = sessionInfoRaw ? { ...sessionInfoRaw, phaseTag: weekMeta.phaseName.toUpperCase() + (weekMeta.isDeload ? " · DESCARGA" : "") } : null;
    return { ...d, key, done, isRest, hasSession: !isRest, barColor, expanded, sessionInfo };
  });

  const totalKm = rawDays.reduce((sum, d) => sum + d.km, 0);
  const doneKm = rawDays.reduce((sum, d, i) => sum + (s.completed[weekIndex + "-" + i] ? d.km : 0), 0);
  const pct = totalKm > 0 ? Math.round((doneKm / totalKm) * 100) : 0;

  const dayKeyByJs = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const todayKey = dayKeyByJs[new Date().getDay()];
  let selIdx = state.selectedDayIdx;
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

  return {
    level, vdot, paces, macro, weekIndex, weekMeta, planDays, todayDay, todayHeading,
    totalKm, doneKm, pct, acwrStatus, weeksMeta, fcMax, fcRest, distInfo,
    phaseLabelShort: `${distInfo.label} · ${level} · Sem ${weekIndex + 1}/${macro.totalWeeks}`,
    phaseLabelFull: `${weekMeta.phaseName}${weekMeta.isDeload ? " · Descarga" : ""} · Semana ${weekIndex + 1}/${macro.totalWeeks} · ${level}`,
    goalLine: s.goalName ? `${s.goalName} · ${distInfo.label}` : `Objetivo: ${distInfo.label}`,
  };
}

function renderApp() {
  const m = computeRenderModel();
  const s = state.profile;
  const firstName = (s.fullName || "Atleta").split(" ")[0];
  const avatarLetter = firstName.charAt(0).toUpperCase();

  const navItems = [
    { key: "panel", icon: ICONS.panel, label: "Panel" },
    { key: "plan", icon: ICONS.plan, label: "Plan" },
    { key: "chat", icon: ICONS.tools, label: "Herramientas" },
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
        <button class="logout-link" data-action="logout">Cerrar sesión</button>
      </div>
    </aside>

    <main class="app-content">
      <div class="content-inner">
        ${state.athleteTab === "panel" ? renderPanel(m, firstName, avatarLetter) : ""}
        ${state.athleteTab === "plan" ? renderPlan(m) : ""}
        ${state.athleteTab === "chat" ? renderHerramientas() : ""}
        ${state.athleteTab === "perfil" ? renderPerfil() : ""}
      </div>
    </main>
  </div>

  <nav class="mobile-tabbar">
    ${navItems.map((n) => `<button class="${state.athleteTab === n.key ? "active" : ""}" data-action="goTab" data-tab="${n.key}">${n.icon}<span>${n.label}</span></button>`).join("")}
  </nav>`;
}

function renderPanel(m, firstName, avatarLetter) {
  const coachMsg = m.weekMeta.isDeload
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
        <div style="background:var(--surface2);border-radius:10px;padding:10px 16px;display:flex;align-items:center;gap:9px;">
          ${ICONS.weather}
          <div>
            <div style="font-size:11px;color:var(--muted);font-weight:600;">Buenos Aires</div>
            <div style="font-size:14px;font-weight:800;">13°C</div>
          </div>
        </div>
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
          <div class="today-icon">${ICONS.lightning}</div>
          <div>
            <div class="tag-row">
              <span class="tag-solid">${d.sessionInfo.phaseTag}</span>
              <span class="tag-outline">${d.sessionInfo.typeTag}</span>
            </div>
            <div class="today-title">${d.day} · ${d.sessionInfo.title}</div>
          </div>
        </div>
      </div>
      ${expanded ? renderBlocksGrid(d.sessionInfo.blocks) : ""}
    </div>`;
}

function renderBlocksGrid(blocks) {
  return `
    <div class="blocks-grid">
      ${blocks
        .map(
          (b) => `
        <div class="block-card">
          <div class="b-label">${b.label}</div>
          <div class="b-name">${b.name}</div>
          <div class="block-mini-grid">
            <div class="block-mini"><div class="k">DIST</div><div class="v">${b.dist}</div></div>
            <div class="block-mini"><div class="k">RITMO /KM</div><div class="v" style="color:var(--accent)">${b.pace}</div></div>
            <div class="block-mini"><div class="k">ZONA</div><div class="v" style="color:${b.zoneColor}">${b.zone}</div></div>
            <div class="block-mini"><div class="k">FC TARGET</div><div class="v" style="color:var(--pink)">${b.fc}</div></div>
          </div>
          <div class="block-mini" style="margin-bottom:8px;"><div class="k">TIEMPO</div><div class="v">${b.time}</div></div>
          <div class="b-desc">${b.desc}</div>
        </div>`
        )
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
      <div class="week-nav">
        <button data-action="weekPrev">‹</button>
        <button data-action="weekNext">›</button>
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
                  <div class="today-icon">${ICONS.lightning}</div>
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
              ${d.expanded ? renderBlocksGrid(d.sessionInfo.blocks) : ""}
            </div>`;
        })
        .join("")}
    </div>

    <div class="week-summary">
      <div><span class="label">Volumen</span><div class="value">${m.doneKm.toFixed(1)} / ${m.totalKm.toFixed(1)} km</div></div>
      <div><span class="label">Plan cumplido</span><div class="value">${m.pct}%</div></div>
      <div><span class="label">VDOT</span><div class="value">${Math.round(m.vdot)}</div></div>
      <div><span class="label">FC máx</span><div class="value">${m.fcMax} bpm</div></div>
    </div>`;
}

function renderHerramientas() {
  const s = state.profile;
  return `
    <div style="font-size:26px;font-weight:800;margin-bottom:6px;">Herramientas</div>
    <div style="font-size:13px;color:var(--muted);margin-bottom:18px;">Chat directo con tu coach.</div>
    <div class="chat-box">
      ${s.chatMessages
        .map(
          (msg) => `
        <div class="chat-bubble-row" style="justify-content:${msg.from === "athlete" ? "flex-end" : "flex-start"}">
          <div class="chat-bubble" style="background:${msg.from === "athlete" ? "var(--accent)" : "var(--surface2)"};color:${msg.from === "athlete" ? "var(--accent-ink)" : "var(--text)"}">
            <div class="msg-text">${esc(msg.text)}</div>
            <div class="msg-time">${msg.time}</div>
          </div>
        </div>`
        )
        .join("")}
    </div>
    <div class="chat-input-row">
      <input placeholder="Escribí un mensaje..." data-bind="chatInput" value="${esc(state.chatInput)}" data-enter-action="sendMessage">
      <button class="chat-send-btn" data-action="sendMessage">Enviar</button>
    </div>`;
}

function renderPerfil() {
  const s = state.profile;
  const age = ageFromBirthdate(s.birthdate);
  const fcMax = fcMaxFromAge(age);
  const bioFields = [
    { key: "fullName", label: "NOMBRE", value: s.fullName },
    { key: "weight", label: "PESO (KG)", value: s.weight },
    { key: "height", label: "ALTURA (CM)", value: s.height },
    { key: "fcRest", label: "FC REPOSO", value: s.fcRest },
    { key: null, label: "FC MÁXIMA (211−0,64×edad)", value: fcMax, disabled: true },
    { key: "gender", label: "SEXO", value: s.gender },
    { key: "birthdate", label: "NACIMIENTO", value: s.birthdate, type: "date" },
  ];
  const pbDefs = [
    { key: "walk", label: "RECORD CAMINANDO" },
    { key: "p3k", label: "PB 3K" },
    { key: "p5k", label: "PB 5K" },
    { key: "p10k", label: "PB 10K" },
  ];

  return `
    <div class="ob-title">PERFIL DE ATLETA</div>
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

    <div class="strava-card">
      <div class="strava-heading">${ICONS.strava} STRAVA</div>
      ${
        s.stravaStatus === "disconnected"
          ? `<div class="strava-desc">Conectá tu cuenta para sincronizar automáticamente tus km y marcar entrenamientos completados.</div>
             <button class="btn-accent" style="width:auto;padding:11px 20px;margin:0;" data-action="connectStrava">Conectar con Strava</button>`
          : s.stravaStatus === "connecting"
          ? `<div class="strava-connecting"><div class="spinner-sm"></div><div style="font-size:13px;color:var(--muted);">Redirigiendo a Strava para autorizar...</div></div>`
          : `<div class="strava-connected-row">
               <div style="display:flex;align-items:center;gap:10px;">
                 <span class="dot-good"></span>
                 <div><div style="font-size:13px;font-weight:700;">Cuenta conectada</div><div style="font-size:11.5px;color:var(--muted);margin-top:2px;">Conectado · última sincronización hace unos segundos</div></div>
               </div>
               <button class="logout-link" style="background:var(--surface2);padding:9px 16px;border-radius:8px;" data-action="disconnectStrava">Desconectar</button>
             </div>`
      }
    </div>

    <div class="perfil-grid">
      <div class="perfil-panel">
        <div class="perfil-panel-heading">${ICONS.lightning.replace('width="19" height="19"', 'width="16" height="16"')} MÉTRICAS BIOMECÁNICAS</div>
        <div class="bio-grid">
          ${bioFields
            .map(
              (f) => `
            <div class="bio-field">
              <div class="b-label">${f.label}</div>
              <input type="${f.type || "text"}" value="${esc(String(f.value ?? ""))}" ${f.disabled ? "disabled style='opacity:0.7'" : `data-bind="profile.${f.key}"`}>
            </div>`
            )
            .join("")}
        </div>
      </div>
      <div class="perfil-panel">
        <div class="perfil-panel-heading"><svg viewBox="0 0 24 24" width="16" height="16"><circle cx="12" cy="12" r="8" fill="none" stroke="var(--accent)" stroke-width="1.6"/><circle cx="12" cy="12" r="3.5" fill="none" stroke="var(--accent)" stroke-width="1.6"/></svg> PBS</div>
        <div class="pbs-list">
          ${pbDefs.map((f) => `<div class="pb-row">${pbFieldHtml(f, s, false)}</div>`).join("")}
        </div>
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

function bindDynamicListeners() {
  root.querySelectorAll("[data-bind]").forEach((el) => {
    const path = el.getAttribute("data-bind");
    const evt = el.tagName === "SELECT" || el.type === "date" ? "change" : "input";
    el.addEventListener(evt, () => {
      setByPath(state, path, el.value);
      if (path.startsWith("profile.")) render();
    });
    if (el.hasAttribute("data-enter-action")) {
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter") ACTIONS[el.getAttribute("data-enter-action")]();
      });
    }
  });
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
  goRecover: () => setState({ loginScreen: "recover", recoverSubmitted: false, recoverEmail: state.loginEmail }),
  backToLogin: () => setState({ loginScreen: "signin", recoverSubmitted: false }),
  sendRecover: () => {
    if (state.recoverEmail.trim()) setState({ recoverSubmitted: true });
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
    const acc = { password: state.signupPassword, profile };
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
    });
    localStorage.removeItem(SESSION_KEY);
  },
  obNext: () => {
    const s = state.profile;
    const step = state.onboardingStep;
    if (step === 4 && (!s.goalName.trim() || !s.goalDate)) { render(); return; }
    if (step === 6) {
      const la = s.levelAnswers;
      if (!(la.q1 && la.q2 && la.q3 && la.q4 && la.q5)) { render(); return; }
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
  pbSeg: null, // handled via input listener below (needs value), see bindDynamicListeners extension
  goTab: (el) => setState({ athleteTab: el.dataset.tab, selectedDayIdx: null, expandedKey: null }),
  setTheme: (el) => setState({ theme: el.dataset.theme }),
  pickDay: (el) => setState({ selectedDayIdx: parseInt(el.dataset.idx, 10) }),
  weekPrev: () => setState((s) => ({ weekIndex: Math.max(0, s.weekIndex - 1), expandedKey: null, selectedDayIdx: null })),
  weekNext: () => setState({ weekIndex: state.weekIndex + 1, expandedKey: null, selectedDayIdx: null }),
  jumpWeek: (el) => setState({ weekIndex: parseInt(el.dataset.idx, 10), expandedKey: null }),
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
  disconnectStrava: () => setProfile({ stravaStatus: "disconnected", stravaConnectedAt: null }),
  sendMessage: () => {
    if (!state.chatInput.trim()) return;
    const now = new Date();
    const time = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");
    setProfile((p) => ({ chatMessages: [...p.chatMessages, { from: "athlete", text: state.chatInput, time }] }));
    setState({ chatInput: "" });
  },
};

// pb segment inputs need custom binding since they compose h:m:s — patch bindDynamicListeners
const originalBind = bindDynamicListeners;
bindDynamicListeners = function () {
  originalBind();
  root.querySelectorAll('[data-action="pbSeg"]').forEach((el) => {
    el.addEventListener("input", () => {
      const key = el.dataset.pb,
        part = el.dataset.part;
      const digits = el.value.replace(/\D/g, "").slice(0, 2);
      setProfile((p) => {
        const cur = pbParts(p.pbs[key] === "NONE" ? "" : p.pbs[key]);
        cur[part] = digits;
        return { pbs: { ...p.pbs, [key]: `${cur.h || "0"}:${cur.m || "00"}:${cur.s || "00"}` } };
      });
    });
  });
};

function quickSocialLogin(name, email) {
  const accounts = loadAccounts();
  let acc = accounts[email];
  if (!acc) {
    const profile = defaultProfileState();
    profile.fullName = name;
    acc = { password: null, profile };
    accounts[email] = acc;
    saveAccounts(accounts);
  }
  enterAccount(email, acc);
}

function enterAccount(email, acc) {
  localStorage.setItem(SESSION_KEY, email);
  const profile = acc.profile;
  if (profile.onboardingDone) {
    setState({ screen: "app", currentEmail: email, profile, athleteTab: "panel", weekIndex: 0, loginError: "" });
  } else {
    setState({ screen: "onboarding", currentEmail: email, profile, onboardingStep: 1, loginError: "" });
  }
}

function compileProgram() {
  setState({ screen: "compiling", compileStep: 0 });
  setTimeout(() => setState({ compileStep: 1 }), 700);
  setTimeout(() => setState({ compileStep: 2 }), 1500);
  setTimeout(() => {
    setProfile({ onboardingDone: true });
    persistCurrentProfile();
    setState({ screen: "app", athleteTab: "panel", weekIndex: 0 });
  }, 3100);
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
  const savedEmail = localStorage.getItem(SESSION_KEY);
  if (savedEmail) {
    const accounts = loadAccounts();
    const acc = accounts[savedEmail];
    if (acc) {
      state.currentEmail = savedEmail;
      state.profile = acc.profile;
      state.screen = acc.profile.onboardingDone ? "app" : "onboarding";
    }
  }
  render();
})();
