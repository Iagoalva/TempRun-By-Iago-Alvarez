/* TempRun — motor de entrenamiento (VDOT, zonas de FC, periodización).
   Portado desde el diseño "TempRun Coaching App" de Claude Design. */

const SESSION_TYPES = {
  rest: { type: "rest", workout: "Descanso" },
  easy: { type: "easy", workout: "Rodaje suave" },
  fartlek: { type: "hard", workout: "Fartlek" },
  cuestas: { type: "hard", workout: "Cuestas fuerza-resistencia" },
  series: { type: "hard", workout: "Series 6x1000m" },
  ritmo: { type: "hard", workout: "Ritmo de carrera" },
  long: { type: "long", workout: "Fondo largo" },
  caco: { type: "easy", workout: "CACO · Semana 1", isCaco: true, cacoRunMin: 2, cacoWalkMin: 3, cacoReps: 5 },
};

const RATIOS = {
  "3k": { base: 0.42, dev: 0.3, specific: 0.2, taper: 0.08, min: 8 },
  "5k": { base: 0.4, dev: 0.3, specific: 0.2, taper: 0.1, min: 10 },
  "10k": { base: 0.4, dev: 0.3, specific: 0.2, taper: 0.1, min: 10 },
};
const PHASE_QUALITY = { base: 1, dev: 2, specific: 2, taper: 1 };
const PHASE_NAMES = { base: "Base", dev: "Desarrollo", specific: "Específico", taper: "Tapering" };
const LEVEL_WEEKLY_KM = {
  Inicial: { min: 3, max: 10 },
  "Principiante Bajo": { min: 5, max: 15 },
  Principiante: { min: 10, max: 20 },
  Intermedio: { min: 15, max: 40 },
};
const LEVEL_ORDER = ["Inicial", "Principiante Bajo", "Principiante", "Intermedio"];
const MIN_AVAIL_DAYS = 2;
const DAY_KEYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const CACO_TABLE = [
  { runSec: 120, walkSec: 180, reps: 5 },
  { runSec: 180, walkSec: 120, reps: 5 },
  { runSec: 240, walkSec: 120, reps: 5 },
  { runSec: 240, walkSec: 60, reps: 5 },
  { runSec: 300, walkSec: 60, reps: 5 },
  { runSec: 360, walkSec: 60, reps: 4 },
  { runSec: 480, walkSec: 60, reps: 3 },
  { runSec: 1800, walkSec: 0, reps: 1 },
];
const CACO_SHORT_LEN = 4; // "Principiante Bajo" hace solo los primeros 4 escalones del CACO
const BRIDGE_WEEKS_INICIAL = 1; // semana puente (rodajes + 1 fartlek suave) al final del CACO de Inicial
const RAMP_WEEKS_PRINCIPIANTE = 2; // semanas de solo rodajes antes del primer fartlek para Principiante
const NOVICE_LEVELS = new Set(["Inicial", "Principiante Bajo"]);

function ageFromBirthdate(str) {
  if (!str) return 30;
  const b = new Date(str + "T00:00:00");
  const now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) age--;
  return age > 5 && age < 100 ? age : 30;
}
function fcMaxFromAge(age) {
  return Math.round(211 - 0.64 * age);
}
function parseTime(str) {
  if (!str || str === "NONE") return 0;
  const parts = str.split(":").map(Number);
  if (parts.some(isNaN)) return 0;
  let sec = 0;
  parts.forEach((p) => (sec = sec * 60 + p));
  return sec;
}
function vdotFromPerf(distM, timeSec) {
  const t = timeSec / 60;
  const v = distM / t;
  const vo2 = -4.6 + 0.182258 * v + 0.000104 * v * v;
  const pct = 0.8 + 0.1894393 * Math.exp(-0.012778 * t) + 0.2989558 * Math.exp(-0.1932605 * t);
  return vo2 / pct;
}
// Devuelve null si no hay ninguna marca de carrera cargada (3K/5K/10K) —
// no inventamos un VDOT "típico" del nivel: sin marca real, no hay ritmo objetivo.
function computeVdot(pbs) {
  const distMap = { p10k: 10000, p5k: 5000, p3k: 3000 };
  for (const key of ["p10k", "p5k", "p3k"]) {
    const sec = parseTime(pbs[key]);
    if (sec <= 0) continue;
    const paceMinPerKm = sec / 60 / (distMap[key] / 1000);
    if (paceMinPerKm < 2.3 || paceMinPerKm > 12) continue;
    const v = vdotFromPerf(distMap[key], sec);
    if (v >= 15 && v <= 85) return v;
  }
  return null;
}
// Clasifica el VDOT en un nivel de referencia para mostrarle al atleta dónde está parado.
function vdotTier(vdot) {
  if (vdot == null) return null;
  if (vdot >= 70) return "ELITE";
  if (vdot >= 55) return "AVANZADO";
  if (vdot >= 40) return "INTERMEDIO";
  return "PRINCIPIANTE";
}
// Inversa de vdotFromPerf: busca por bisección el tiempo (seg) para una distancia dada
// que corresponde a un VDOT objetivo — se usa para proyectar el "tiempo potencial".
function raceTimeFromVdot(vdot, distM) {
  let lo = 60,
    hi = 6 * 3600;
  for (let i = 0; i < 50; i++) {
    const mid = (lo + hi) / 2;
    const v = vdotFromPerf(distM, mid);
    if (v > vdot) lo = mid;
    else hi = mid;
  }
  return Math.round((lo + hi) / 2);
}
function formatRaceTime(totalSec) {
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = Math.round(totalSec % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}
// Sin VDOT (sin marca cargada), no hay ritmos objetivo: todos los campos vuelven null
// y las sesiones se guían solo por zona de FC y sensación ("A sensación").
function computePaces(vdot) {
  if (vdot == null) {
    return { easy: null, marathon: null, threshold: null, interval: null, repetition: null };
  }
  const safeVdot = Math.min(85, Math.max(15, vdot));
  const velAtPct = (pct) => {
    const vo2 = safeVdot * pct;
    const a = 0.000104,
      b = 0.182258,
      c = -(4.6 + vo2);
    return (-b + Math.sqrt(b * b - 4 * a * c)) / (2 * a);
  };
  const paceStr = (pct) => {
    let minPerKm = 1000 / velAtPct(pct);
    minPerKm = Math.min(15, Math.max(2.5, minPerKm));
    const m = Math.floor(minPerKm);
    const sec = Math.round((minPerKm - m) * 60);
    return `${m}:${String(sec).padStart(2, "0")}`;
  };
  return {
    easy: paceStr(0.7),
    marathon: paceStr(0.8),
    threshold: paceStr(0.87),
    interval: paceStr(0.975),
    repetition: paceStr(1.1),
  };
}
function parseGoalDistance(str) {
  if (!str) return { km: 10, key: "10k", label: "10K" };
  if (str.includes("10")) return { km: 10, key: "10k", label: "10K" };
  if (str.includes("5")) return { km: 5, key: "5k", label: "5K" };
  return { km: 3, key: "3k", label: "3K" };
}
function paceToMinutes(str) {
  const [m, s] = (str || "6:00").split(":").map(Number);
  return (m || 6) + (s || 0) / 60;
}
// Puntaje por pregunta — define Inicial / Principiante Bajo / Principiante.
// Intermedio queda aparte como filtro duro (ver levelFromAnswers): no alcanza con sumar
// puntos si no hay una base aeróbica real, para no exponer a cargas altas sin sustento.
const LEVEL_SCORE_WEIGHTS = {
  q1: { si: 15, no: 0 },
  q2: { nunca: 0, menos6: 8, mas6: 15 },
  q3: { cero: 0, poco: 8, mas15: 15 },
  q4: { no: 0, menos20: 8, "20a35": 16, mas35: 20 },
  q5: { si: 10, no: 0 },
  q6: { nunca: 0, mas6: 3, menos6: 7, activo: 12 },
  q7: { limitante: -10, recuperado: 0, no: 5 },
};
// Minutos continuos que representa cada opción de q4 — se usa como piso real de duración
// de las sesiones (nunca le prescribimos menos de lo que el atleta ya sostiene) y para
// decidir si saltea el CACO aunque su nivel general dé Inicial/Principiante Bajo.
const CONTINUOUS_MIN_BY_ANSWER = { no: 0, menos20: 10, "20a35": 20, mas35: 35 };
const CACO_SKIP_THRESHOLD_MIN = 20;
function continuousMinFromAnswers(a) {
  return CONTINUOUS_MIN_BY_ANSWER[a && a.q4] || 0;
}

function levelScore(a) {
  let total = 0;
  for (const q in LEVEL_SCORE_WEIGHTS) {
    total += LEVEL_SCORE_WEIGHTS[q][a[q]] || 0;
  }
  return Math.max(0, total);
}

function levelFromAnswers(a) {
  const isIntermedio = a.q2 === "mas6" && a.q3 === "mas15" && a.q4 === "mas35" && a.q7 !== "limitante";
  if (isIntermedio) return "Intermedio";
  const score = levelScore(a);
  if (score <= 20) return "Inicial";
  if (score <= 45) return "Principiante Bajo";
  return "Principiante";
}

// Combinaciones de respuestas que no tienen sentido juntas — se muestran como aviso
// para que el atleta revise, sin bloquear el avance (el coach puede reclasificar a mano igual).
function levelAnswerWarnings(a) {
  const warns = [];
  if (a.q1 === "si" && a.q3 === "cero") warns.push("Dijiste que corrés de forma regular, pero marcaste 0 km semanales.");
  if (a.q1 === "no" && a.q3 === "mas15") warns.push("Dijiste que no corrés de forma regular, pero marcaste +15 km semanales.");
  if ((a.q4 === "20a35" || a.q4 === "mas35") && a.q3 === "cero") warns.push("Dijiste que ya corrés varios minutos seguidos, pero marcaste 0 km semanales.");
  if (a.q6 === "activo" && a.q1 === "no") warns.push("Dijiste que corrés activamente ahora, pero también que no corrés de forma regular.");
  return warns;
}
function weekAdherence(completed, weekIdx, trainDays) {
  let done = 0,
    any = false;
  for (let i = 0; i < 7; i++) {
    const key = weekIdx + "-" + i;
    if (completed[key] !== undefined) any = true;
    if (completed[key]) done++;
  }
  if (!any) return null;
  return Math.min(1, done / Math.max(1, trainDays));
}

// Tipo de semana dentro de la fase Base para niveles que necesitan una rampa de adaptación:
// 'caco'   → progresión caminar-correr (Inicial: tabla completa; Principiante Bajo: primeros 4 escalones)
// 'bridge' → semana puente al final del CACO de Inicial: rodajes + 1 fartlek suave, antes de Desarrollo
// 'ramp'   → semanas de solo rodajes (sin sesión de calidad) antes del primer fartlek
// 'normal' → estructura estándar de la fase
function getWeekProgramType(level, phaseKey, weekInPhase, phaseWeeksTotal, alreadyRunsMin) {
  if (phaseKey !== "base") return "normal";
  // si el atleta ya sostiene 20+ minutos corridos, saltea el CACO aunque su nivel general
  // (por poco volumen semanal, tiempo sin entrenar, etc.) diera Inicial/Principiante Bajo —
  // arranca directo con el mismo patrón de solo-rodajes que usa Principiante.
  const skipCaco = (alreadyRunsMin || 0) >= CACO_SKIP_THRESHOLD_MIN;
  if (level === "Inicial") {
    if (skipCaco) return weekInPhase < RAMP_WEEKS_PRINCIPIANTE ? "ramp" : "normal";
    const bridgeStart = Math.max(0, phaseWeeksTotal - BRIDGE_WEEKS_INICIAL);
    return weekInPhase < bridgeStart ? "caco" : "bridge";
  }
  if (level === "Principiante Bajo") {
    if (skipCaco) return weekInPhase < RAMP_WEEKS_PRINCIPIANTE ? "ramp" : "normal";
    return weekInPhase < CACO_SHORT_LEN ? "caco" : "ramp";
  }
  if (level === "Principiante") {
    return weekInPhase < RAMP_WEEKS_PRINCIPIANTE ? "ramp" : "normal";
  }
  return "normal";
}

function buildMacrocycle(s, paces, level) {
  const distInfo = parseGoalDistance(s.goalDistance);
  const alreadyRunsMin = continuousMinFromAnswers(s.levelAnswers);
  const today = new Date();
  const goal = s.goalDate ? new Date(s.goalDate + "T00:00:00") : null;
  let totalWeeks = goal && goal > today ? Math.ceil((goal - today) / (7 * 24 * 3600 * 1000)) : 12;
  const ratios = RATIOS[distInfo.key];
  totalWeeks = Math.max(ratios.min, Math.min(30, totalWeeks));
  const baseW = Math.max(2, Math.round(totalWeeks * ratios.base));
  const devW = Math.max(2, Math.round(totalWeeks * ratios.dev));
  const taperW = Math.max(1, Math.round(totalWeeks * ratios.taper));
  const specW = Math.max(1, totalWeeks - baseW - devW - taperW);
  const phaseList = [
    { key: "base", weeks: baseW },
    { key: "dev", weeks: devW },
    { key: "specific", weeks: specW },
    { key: "taper", weeks: taperW },
  ];
  let cursor = 0;
  phaseList.forEach((p) => {
    p.start = cursor;
    p.end = cursor + p.weeks;
    cursor += p.weeks;
  });
  totalWeeks = cursor;

  const ratio = NOVICE_LEVELS.has(level) ? 2 : 3;
  const growth = level === "Inicial" ? 0.06 : level === "Principiante Bajo" ? 0.07 : level === "Intermedio" ? 0.1 : 0.09;
  // la descarga programada recorta desde el PICO alcanzado hasta ahora, no desde la semana
  // anterior — así cada ciclo de carga vuelve a crecer desde cerca del máximo previo en vez
  // de perder terreno para siempre. El recorte es más suave para niveles noveles (ciclos de
  // carga más cortos) para que el resultado neto de cada ciclo siga siendo un avance.
  const deloadFactor = NOVICE_LEVELS.has(level) ? 0.88 : 0.8;

  const availCount = Math.max(MIN_AVAIL_DAYS, DAY_KEYS.filter((k) => s.availability[k]).length);
  const range = LEVEL_WEEKLY_KM[level] || LEVEL_WEEKLY_KM.Intermedio;
  const daysFactor = Math.min(1, Math.max(0, (availCount - MIN_AVAIL_DAYS) / 4));
  const levelTarget = range.min + (range.max - range.min) * daysFactor;
  const startVol = Math.max(range.min, Math.min(range.max, parseFloat(s.weeklyKm) || levelTarget));
  const peakCap = Math.min(range.max, Math.max(startVol * 2.3, distInfo.km * 2.8));

  let current = startVol,
    peakVol = startVol,
    sinceDeload = 0,
    lastAdjustNote = "";
  const weeks = [];
  for (let i = 0; i < totalWeeks; i++) {
    const phase = phaseList.find((p) => i >= p.start && i < p.end);
    const weekInPhase = i - phase.start;
    const programType = getWeekProgramType(level, phase.key, weekInPhase, phase.weeks, alreadyRunsMin);
    let isDeload = false;
    if (phase.key === "taper") {
      const pos = weekInPhase;
      const factors = [0.75, 0.55, 0.35];
      current = peakVol * factors[Math.min(pos, factors.length - 1)];
    } else if (programType === "caco") {
      const stepIdx = Math.min(weekInPhase, CACO_TABLE.length - 1);
      const cfg = CACO_TABLE[stepIdx];
      const perDayKm = ((cfg.runSec * cfg.reps) / 60) / paceToMinutes(paces.easy);
      let cacoVol = Math.round(perDayKm * availCount * 10) / 10;
      // si se agotó la tabla (Inicial con fase Base larga), repetimos el último escalón
      // pero seguimos subiendo el volumen un poco cada semana en vez de dejarlo plano
      const overflowWeeks = weekInPhase - (CACO_TABLE.length - 1);
      if (overflowWeeks > 0) cacoVol = Math.round(cacoVol * (1 + 0.03 * overflowWeeks) * 10) / 10;
      // el CACO también respeta el techo semanal configurado para el nivel: la progresión
      // caminar-correr no puede superar el límite de seguridad de un principiante.
      current = Math.min(range.max, cacoVol);
      peakVol = Math.max(peakVol, current);
    } else {
      sinceDeload++;
      const prevAdherence = i > 0 ? weekAdherence(s.completed, i - 1, availCount) : 1;
      let adjustNote = "";
      if (prevAdherence !== null && prevAdherence < 0.6) {
        current = current * 0.95;
        isDeload = true;
        sinceDeload = 0;
        adjustNote = "Carga reducida — baja adherencia la semana pasada";
      } else if (sinceDeload > ratio) {
        isDeload = true;
        current = peakVol * deloadFactor;
        sinceDeload = 0;
        adjustNote = "Semana de descarga programada — recuperación activa cada ciertas semanas de carga";
      } else if (i > 0) {
        const lowAdherence = prevAdherence !== null && prevAdherence < 0.85;
        const g = lowAdherence ? growth * 0.5 : growth;
        if (lowAdherence) adjustNote = "Progresión más lenta — no se completó todo el plan la semana pasada";
        current = Math.min(peakCap, current * (1 + g));
      }
      peakVol = Math.max(peakVol, current);
      lastAdjustNote = adjustNote;
    }
    const isLastTaperWeek = phase.key === "taper" && i === phase.end - 1;
    weeks.push({
      index: i,
      phaseKey: phase.key,
      phaseName: PHASE_NAMES[phase.key],
      volume: Math.round(current * 10) / 10,
      isDeload,
      isLastTaperWeek,
      weekInPhase,
      phaseWeeksTotal: phase.weeks,
      programType,
      adjustNote: lastAdjustNote || "",
    });
    lastAdjustNote = "";
  }
  return { totalWeeks, weeks, distInfo, phaseList };
}

function reverseTypeKey(d) {
  if (d.isCaco) return "caco";
  if (d.type === "rest") return "rest";
  if (d.type === "easy") return "easy";
  if (d.type === "long") return "long";
  if (d.workout.toLowerCase().includes("fartlek")) return "fartlek";
  if (d.workout.toLowerCase().includes("cuestas")) return "cuestas";
  if (d.workout.toLowerCase().includes("ritmo de carrera")) return "ritmo";
  return "series";
}

function buildWeekDays(weekMeta, availability, paces, level, distInfo, alreadyRunsMin) {
  let avail = DAY_KEYS.filter((k) => availability[k]);
  if (avail.length === 0) avail = DAY_KEYS.slice();
  const longDay = avail[avail.length - 1];
  const programType = weekMeta.programType || "normal"; // 'caco' | 'bridge' | 'ramp' | 'normal'
  const isCacoPhase = programType === "caco";
  const isNovice = NOVICE_LEVELS.has(level);
  // si el atleta ya declaró que sostiene X minutos corridos, nunca le prescribimos una
  // sesión de rodaje/fondo más corta que eso — el piso sube en base a esos minutos.
  const alreadyRunsKm = alreadyRunsMin ? Math.round((alreadyRunsMin / paceToMinutes(paces.easy)) * 10) / 10 : 0;

  let qCount;
  if (weekMeta.isLastTaperWeek || isCacoPhase || programType === "ramp") qCount = 0;
  else if (programType === "bridge") qCount = 1;
  else qCount = weekMeta.isDeload ? Math.max(0, PHASE_QUALITY[weekMeta.phaseKey] - 1) : PHASE_QUALITY[weekMeta.phaseKey];
  qCount = Math.min(qCount, Math.max(0, avail.length - 1));

  const qualityDays = avail.filter((d) => d !== longDay).slice(0, qCount);
  const easyDaysList = avail.filter((d) => d !== longDay && !qualityDays.includes(d));
  const volume = weekMeta.volume;
  // Piso mínimo absoluto por tipo de sesión — solo evita sesiones sin sentido (ej. 0.3km),
  // no es un objetivo de duración: por eso es bajo y no domina sobre el volumen semanal
  // que ya calculó la periodización (progresión, deload, tapering).
  const longFloor = Math.max(isNovice ? 2 : 3, alreadyRunsKm);
  const qualityFloor = isNovice ? 1.5 : 2.5;
  const easyFloor = Math.max(isNovice ? 1.2 : 1.5, alreadyRunsKm);
  const longCapKm = Math.round(distInfo.km * 1.15 * 10) / 10;
  // Reparto por peso relativo (no por %fijo): el fondo largo pesa más que una sesión de
  // calidad, que a su vez pesa más que un rodaje — así el fondo largo sigue siendo la
  // sesión más exigente de la semana sin importar cuántos días de cada tipo haya.
  const LONG_WEIGHT = 1.8,
    QUALITY_WEIGHT = 1.3,
    EASY_WEIGHT = 1;
  let totalWeight = LONG_WEIGHT + QUALITY_WEIGHT * qCount + EASY_WEIGHT * easyDaysList.length;
  let longKm = (volume * LONG_WEIGHT) / totalWeight;
  if (longKm > longCapKm) {
    // el fondo largo no debe superar ~15% más que la distancia objetivo de carrera;
    // lo que sobra se reparte entre las demás sesiones de la semana.
    longKm = longCapKm;
    totalWeight -= LONG_WEIGHT;
  }
  longKm = Math.max(longFloor, Math.round(longKm * 10) / 10);
  const remainingAfterLong = Math.max(0, volume - longKm);
  const remWeight = QUALITY_WEIGHT * qCount + EASY_WEIGHT * easyDaysList.length;
  let perQualityKm = 0,
    perEasyKm = 0;
  if (remWeight > 0) {
    perQualityKm = qCount > 0 ? Math.max(qualityFloor, Math.round(((remainingAfterLong * QUALITY_WEIGHT) / remWeight) * 10) / 10) : 0;
    perEasyKm = easyDaysList.length > 0 ? Math.max(easyFloor, Math.round(((remainingAfterLong * EASY_WEIGHT) / remWeight) * 10) / 10) : 0;
  }
  const cacoCfg = isCacoPhase ? CACO_TABLE[Math.min(weekMeta.weekInPhase, CACO_TABLE.length - 1)] : null;
  const cacoWeekNum = isCacoPhase ? Math.min(weekMeta.weekInPhase + 1, CACO_TABLE.length) : 0;

  const days = DAY_KEYS.map((k) => {
    if (!avail.includes(k)) return { day: k, workout: "Descanso", dist: "—", km: 0, type: "rest" };
    if (isCacoPhase) {
      const totalRunSec = cacoCfg.runSec * cacoCfg.reps;
      const estKm = Math.round(((totalRunSec / 60 / paceToMinutes(paces.easy)) * 10)) / 10;
      return {
        day: k,
        workout: `CACO · Semana ${cacoWeekNum}`,
        dist: estKm + " km",
        km: estKm,
        type: k === longDay ? "long" : "easy",
        isCaco: true,
        cacoRunMin: cacoCfg.runSec / 60,
        cacoWalkMin: cacoCfg.walkSec / 60,
        cacoReps: cacoCfg.reps,
      };
    }
    if (k === longDay) {
      const isSpecific = weekMeta.phaseKey === "specific";
      return { day: k, workout: isSpecific ? "Fondo con ritmo objetivo" : "Fondo largo", dist: longKm + " km", km: longKm, type: "long" };
    }
    if (qualityDays.includes(k)) {
      if (weekMeta.phaseKey === "specific") return { day: k, workout: "Ritmo de carrera", dist: perQualityKm + " km", km: perQualityKm, type: "hard" };
      if (programType === "bridge") return { day: k, workout: "Fartlek suave", dist: perQualityKm + " km", km: perQualityKm, type: "hard" };
      // en fase Base el trabajo de calidad es de cuestas: fuerza-resistencia y técnica de
      // brazada/pierna en pendiente, antes de meter series a ritmo en Desarrollo/Específico.
      if (weekMeta.phaseKey === "base") return { day: k, workout: "Cuestas fuerza-resistencia", dist: perQualityKm + " km", km: perQualityKm, type: "hard" };
      const reps = { Inicial: 4, "Principiante Bajo": 5, Principiante: 6, Intermedio: 8 }[level] || 6;
      const distEach = 800;
      return { day: k, workout: `Series ${reps}x${distEach}m`, dist: perQualityKm + " km", km: perQualityKm, type: "hard" };
    }
    return { day: k, workout: "Rodaje suave", dist: perEasyKm + " km", km: perEasyKm, type: "easy" };
  });
  return days;
}

function karvonen(lo, hi, fcRest, fcMax) {
  const rr = fcMax - fcRest;
  return Math.round(fcRest + rr * lo) + "-" + Math.round(fcRest + rr * hi) + " bpm";
}

function sessionBlocks(d, fcRest, fcMax, paces, distInfo) {
  const z1 = karvonen(0.5, 0.6, fcRest, fcMax);
  const hasPaces = paces.easy != null;
  const NO_PACE = "A sensación";
  const pc = (v) => (v == null ? NO_PACE : v);
  const pcRange = (a, b) => (hasPaces ? `${a}-${b}` : NO_PACE);
  const pcCombo = (a, b) => (hasPaces ? `${a}/${b}` : NO_PACE);
  if (d.isCaco) {
    const zRun = karvonen(0.65, 0.78, fcRest, fcMax);
    const fmtMin = (m) => (m === Math.floor(m) ? m : m.toFixed(1)) + " min";
    const totalMin = Math.round((d.cacoRunMin + d.cacoWalkMin) * d.cacoReps + 8);
    return {
      typeTag: "CACO",
      title: `MÉTODO CACO (${totalMin} MIN)`,
      blocks: [
        { label: "CALENTAMIENTO", name: "Caminata activa", dist: "—", pace: "—", zone: "Z1", fc: z1, time: "5 min", desc: "Paso firme y buena postura, sin arrastrar los pies." },
        {
          label: "PRINCIPAL",
          name: `${d.cacoReps} x (Corre ${fmtMin(d.cacoRunMin)} + Camina ${d.cacoWalkMin > 0 ? fmtMin(d.cacoWalkMin) : "0 min"})`,
          dist: d.dist,
          pace: pc(paces.easy),
          zone: "Z2/Z3",
          fc: zRun,
          time: Math.round((d.cacoRunMin + d.cacoWalkMin) * d.cacoReps) + " min",
          desc: "Trote suave y conversacional en los tramos de correr; caminata activa (no parar) en los tramos de descanso.",
        },
        { label: "VUELTA A CALMA", name: "Caminata + estiramiento", dist: "—", pace: "—", zone: "Z1", fc: z1, time: "5 min", desc: "Bajar pulsaciones caminando y estirar al terminar." },
      ].map((b) => ({ ...b, zoneColor: b.zone.includes("1") ? "var(--muted)" : "var(--good)" })),
    };
  }
  const km = d.km;
  const mk = d.workout.match(/(\d+)x(\d+)m/);
  let typeTag, title, blocks;
  if (mk) {
    const reps = parseInt(mk[1]),
      distEach = parseInt(mk[2]);
    const mainKm = (reps * distEach) / 1000;
    const restKm = Math.max(0.5, (km - mainKm) / 2);
    const repPace = distEach <= 400 ? paces.repetition : paces.interval;
    typeTag = "SERIES";
    title = `SERIES ${reps}X${distEach}M (${km} KM)`;
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: restKm.toFixed(1) + "km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "10 min", desc: "Trote suave + movilidad articular + 4 progresiones." },
      { label: "PRINCIPAL", name: `${reps} x ${distEach}m`, dist: mainKm.toFixed(1) + "km", pace: pc(repPace), zone: "Z4", fc: karvonen(0.8, 0.9, fcRest, fcMax), time: reps * 2 + " min", desc: hasPaces ? `${reps} repeticiones a ritmo VDOT con ${Math.max(60, 180 - reps * 10)}s de trote suave entre series.` : `${reps} repeticiones a esfuerzo alto (a sensación) con ${Math.max(60, 180 - reps * 10)}s de trote suave entre series.` },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: restKm.toFixed(1) + "km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "8 min", desc: "Trote regenerativo + estiramiento." },
    ];
  } else if (d.workout.toLowerCase().includes("cuestas")) {
    const rawMainKm = Math.max(0.4, km - 3.5);
    // mínimo 4 repeticiones para que la sesión tenga sentido técnico — si el volumen de la
    // semana da menos, el total de la sesión se ajusta hacia arriba en vez de mostrar
    // reps y distancia inconsistentes entre sí.
    const cuestaReps = Math.max(4, Math.round(rawMainKm / 0.4));
    const mainKm = Math.round(cuestaReps * 0.4 * 100) / 100;
    const totalKm = Math.round((2 + mainKm + 1.5) * 10) / 10;
    typeTag = "CUESTAS";
    title = `CUESTAS FUERZA-RESISTENCIA (X${cuestaReps}) (${totalKm} KM)`;
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "2km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "8 min", desc: "Trote suave + movilidad articular." },
      {
        label: "PRINCIPAL",
        name: "Potencia muscular",
        dist: mainKm.toFixed(2) + "km",
        pace: "A tope",
        zone: "Neuro",
        fc: karvonen(0.8, 0.9, fcRest, fcMax),
        time: Math.round(cuestaReps * 0.75) + " min",
        desc: `${cuestaReps} x 200m en subida (pendiente 5-8%). Foco en técnica de braceo y empuje. Recuperación: bajar trotando muy suave (200m).`,
      },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1.5km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "5 min", desc: "Caminata o trote regenerativo." },
    ];
  } else if (d.workout.toLowerCase().includes("fartlek")) {
    const isSoft = d.workout.toLowerCase().includes("suave");
    typeTag = isSoft ? "FARTLEK SUAVE" : "FARTLEK";
    title = isSoft ? `FARTLEK SUAVE · ADAPTACIÓN (${km} KM)` : `FARTLEK (${km} KM)`;
    blocks = isSoft
      ? [
          { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "1.5km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "8 min", desc: "Trote suave + movilidad articular." },
          { label: "PRINCIPAL", name: "Juego de ritmos suave", dist: Math.max(km - 3, 1).toFixed(1) + "km", pace: pcCombo(paces.marathon, paces.easy), zone: "Z2/Z3", fc: karvonen(0.65, 0.75, fcRest, fcMax), time: "15 min", desc: "Primer contacto con cambios de ritmo: 1 min moderado (Z3) / 2 min suave (Z2). Nada de esfuerzo máximo — es adaptación." },
          { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1.5km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "8 min", desc: "Caminata o trote regenerativo." },
        ]
      : [
          { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "2km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "8 min", desc: "Trote suave + movilidad articular." },
          { label: "PRINCIPAL", name: "Juego de ritmos", dist: Math.max(km - 3.5, 1).toFixed(1) + "km", pace: pcCombo(paces.interval, paces.easy), zone: "Z3/Z4", fc: karvonen(0.75, 0.85, fcRest, fcMax), time: "25 min", desc: "Cambios de ritmo: 1 min ágil (Z4) / 1 min suave (Z2). Ideal para activar el sistema aeróbico." },
          { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1.5km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "5 min", desc: "Caminata o trote regenerativo." },
        ];
  } else if (d.type === "long") {
    const isSpecific = d.workout.toLowerCase().includes("ritmo objetivo");
    typeTag = "FONDO";
    title = `${isSpecific ? "FONDO CON RITMO OBJETIVO" : "FONDO LARGO"} (${km} KM)`;
    const mainKm = Math.max(km - 4, 1);
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "2km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "10 min", desc: "Trote suave + movilidad articular." },
      {
        label: "PRINCIPAL",
        name: isSpecific ? "Fondo a ritmo objetivo" : "Fondo continuo",
        dist: mainKm.toFixed(1) + "km",
        pace: isSpecific ? pc(paces.marathon) : pcRange(paces.easy, paces.marathon),
        zone: isSpecific ? "Z3" : "Z2/Z3",
        fc: karvonen(isSpecific ? 0.7 : 0.6, isSpecific ? 0.8 : 0.75, fcRest, fcMax),
        time: Math.round(mainKm * 5.5) + " min",
        desc: isSpecific ? "Últimos km a ritmo objetivo de carrera." : "Ritmo controlado y constante, últimos km a ritmo objetivo si llegás cómodo.",
      },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "2km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "10 min", desc: "Caminata + estiramiento e hidratación." },
    ];
  } else if (d.workout.toLowerCase().includes("ritmo de carrera")) {
    typeTag = "RITMO";
    title = `RITMO DE CARRERA (${km} KM)`;
    const mainKm = Math.max(km - 3, 1);
    const racePace = paces.threshold;
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "1.5km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "8 min", desc: "Trote suave + progresiones." },
      { label: "PRINCIPAL", name: "Tramo a ritmo objetivo", dist: mainKm.toFixed(1) + "km", pace: pc(racePace), zone: "Z3", fc: karvonen(0.7, 0.8, fcRest, fcMax), time: Math.round(mainKm * 4.75) + " min", desc: "Ritmo objetivo de carrera, sostenido y controlado." },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1.5km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "8 min", desc: "Trote regenerativo." },
    ];
  } else {
    typeTag = "RODAJE";
    title = `RODAJE SUAVE (${km} KM)`;
    const mainKm = Math.max(km - 2, 1);
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "1km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "5 min", desc: "Trote suave + movilidad articular." },
      { label: "PRINCIPAL", name: "Rodaje continuo", dist: mainKm.toFixed(1) + "km", pace: pc(paces.easy), zone: "Z2", fc: karvonen(0.6, 0.7, fcRest, fcMax), time: Math.round(mainKm * 5.7) + " min", desc: "Ritmo conversacional, controlado y cómodo." },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1km", pace: pc(paces.easy), zone: "Z1", fc: z1, time: "5 min", desc: "Caminata + estiramiento suave." },
    ];
  }
  blocks = blocks.map((b) => ({ ...b, zoneColor: b.zone.includes("1") ? "var(--muted)" : b.zone.toLowerCase() === "neuro" ? "var(--pink)" : "var(--good)" }));
  return { typeTag, title, blocks };
}
