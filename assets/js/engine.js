/* TempRun — motor de entrenamiento (VDOT, zonas de FC, periodización).
   Portado desde el diseño "TempRun Coaching App" de Claude Design. */

const SESSION_TYPES = {
  rest: { type: "rest", workout: "Descanso" },
  easy: { type: "easy", workout: "Rodaje suave" },
  fartlek: { type: "hard", workout: "Fartlek" },
  series: { type: "hard", workout: "Series 6x1000m" },
  ritmo: { type: "hard", workout: "Ritmo de carrera" },
  long: { type: "long", workout: "Fondo largo" },
  caco: { type: "easy", workout: "CACO · Semana 1", isCaco: true, cacoRunMin: 2, cacoWalkMin: 3, cacoReps: 5 },
};

const RATIOS = {
  "5k": { base: 0.4, dev: 0.3, specific: 0.2, taper: 0.1, min: 10 },
  "10k": { base: 0.4, dev: 0.3, specific: 0.2, taper: 0.1, min: 10 },
  "21k": { base: 0.45, dev: 0.25, specific: 0.2, taper: 0.1, min: 14 },
  "42k": { base: 0.5, dev: 0.25, specific: 0.17, taper: 0.08, min: 16 },
};
const PHASE_QUALITY = { base: 1, dev: 2, specific: 2, taper: 1 };
const PHASE_NAMES = { base: "Base", dev: "Desarrollo", specific: "Específico", taper: "Tapering" };
const LEVEL_WEEKLY_KM = { Inicial: { min: 8, max: 20 }, Principiante: { min: 15, max: 40 }, Intermedio: { min: 25, max: 60 } };
const MIN_AVAIL_DAYS = 3;
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
function computeVdot(pbs, level) {
  const distMap = { p10k: 10000, p5k: 5000, p3k: 3000 };
  for (const key of ["p10k", "p5k", "p3k"]) {
    const sec = parseTime(pbs[key]);
    if (sec <= 0) continue;
    const paceMinPerKm = sec / 60 / (distMap[key] / 1000);
    if (paceMinPerKm < 2.3 || paceMinPerKm > 12) continue;
    const v = vdotFromPerf(distMap[key], sec);
    if (v >= 15 && v <= 85) return v;
  }
  return { Inicial: 26, Principiante: 34, Intermedio: 44 }[level] || 30;
}
function computePaces(vdot) {
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
  if (str.includes("42")) return { km: 42.2, key: "42k", label: "Maratón" };
  if (str.includes("21")) return { km: 21.1, key: "21k", label: "Media Maratón" };
  if (str.includes("10")) return { km: 10, key: "10k", label: "10K" };
  return { km: 5, key: "5k", label: "5K" };
}
function paceToMinutes(str) {
  const [m, s] = (str || "6:00").split(":").map(Number);
  return (m || 6) + (s || 0) / 60;
}
function levelFromAnswers(a) {
  const regular = a.q1 === "si";
  const experienced = a.q2 === "mas6";
  const kmOk = a.q3 === "mas15";
  const sustains30 = a.q4 === "comodo";
  const hasPlanOrRace = a.q5 === "si";
  if (!regular && !sustains30 && !hasPlanOrRace) return "Inicial";
  if (experienced && kmOk && sustains30) return "Intermedio";
  return "Principiante";
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

function buildMacrocycle(s, paces, level) {
  const distInfo = parseGoalDistance(s.goalDistance);
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

  const age = ageFromBirthdate(s.birthdate);
  const ratio = level === "Inicial" || age >= 45 ? 2 : 3;
  const growth = level === "Inicial" ? 0.06 : level === "Intermedio" ? 0.1 : 0.09;

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
    let isDeload = false;
    if (phase.key === "taper") {
      const pos = i - phase.start;
      const factors = [0.75, 0.55, 0.35];
      current = peakVol * factors[Math.min(pos, factors.length - 1)];
    } else if (level === "Inicial" && phase.key === "base") {
      const cfg = CACO_TABLE[Math.min(i - phase.start, CACO_TABLE.length - 1)];
      const perDayKm = ((cfg.runSec * cfg.reps) / 60) / paceToMinutes(paces.easy);
      current = Math.round(perDayKm * availCount * 10) / 10;
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
        current = current * 0.72;
        sinceDeload = 0;
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
      weekInPhase: i - phase.start,
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
  if (d.workout.toLowerCase().includes("ritmo de carrera")) return "ritmo";
  return "series";
}

function buildWeekDays(weekMeta, availability, paces, level, distInfo) {
  let avail = DAY_KEYS.filter((k) => availability[k]);
  if (avail.length === 0) avail = DAY_KEYS.slice();
  const longDay = avail[avail.length - 1];
  let qCount = weekMeta.isLastTaperWeek ? 0 : weekMeta.isDeload ? Math.max(0, PHASE_QUALITY[weekMeta.phaseKey] - 1) : PHASE_QUALITY[weekMeta.phaseKey];
  const isCacoPhase = level === "Inicial" && weekMeta.phaseKey === "base";
  if (isCacoPhase) qCount = 0;
  qCount = Math.min(qCount, Math.max(0, avail.length - 1));
  const qualityDays = avail.filter((d) => d !== longDay).slice(0, qCount);
  const volume = weekMeta.volume;
  const longFloor = level === "Inicial" ? 3 : 6;
  const longKm = Math.min(Math.round(distInfo.km * 1.15 * 10) / 10, Math.max(longFloor, Math.round(volume * 0.28)));
  const remainingAfterLong = Math.max(0, volume - longKm);
  const qualityFloor = level === "Inicial" ? 2.5 : 5;
  const perQualityKm = qCount > 0 ? Math.max(qualityFloor, Math.round(((remainingAfterLong * 0.35) / qCount) * 10) / 10) : 0;
  const easyDaysList = avail.filter((d) => d !== longDay && !qualityDays.includes(d));
  const remainingForEasy = Math.max(0, remainingAfterLong - perQualityKm * qCount);
  const easyFloor = level === "Inicial" ? 2 : 3;
  const perEasyKm = easyDaysList.length > 0 ? Math.max(easyFloor, Math.round((remainingForEasy / easyDaysList.length) * 10) / 10) : 0;
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
      if (weekMeta.phaseKey === "base") return { day: k, workout: "Fartlek", dist: perQualityKm + " km", km: perQualityKm, type: "hard" };
      const reps = { Inicial: 4, Principiante: 6, Intermedio: 8 }[level] || 6;
      const distEach = 800;
      return { day: k, workout: `Series ${reps}x${distEach}m`, dist: perQualityKm + " km", km: perQualityKm, type: "hard" };
    }
    return { day: k, workout: "Rodaje suave", dist: perEasyKm + " km", km: perEasyKm, type: "easy" };
  });
  const easyMinPerKm = paceToMinutes(paces.easy);
  const sessionMinFloor = level === "Inicial" ? 22 : 40;
  const minKm = Math.max(2, Math.round((sessionMinFloor / easyMinPerKm) * 10) / 10);
  const maxKm = Math.min(40, Math.round((120 / easyMinPerKm) * 10) / 10);
  return days.map((d) => (d.type === "rest" || d.isCaco ? d : { ...d, km: Math.min(maxKm, Math.max(minKm, d.km)), dist: Math.min(maxKm, Math.max(minKm, d.km)) + " km" }));
}

function karvonen(lo, hi, fcRest, fcMax) {
  const rr = fcMax - fcRest;
  return Math.round(fcRest + rr * lo) + "-" + Math.round(fcRest + rr * hi) + " bpm";
}

function sessionBlocks(d, fcRest, fcMax, paces, distInfo) {
  const z1 = karvonen(0.5, 0.6, fcRest, fcMax);
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
          pace: paces.easy,
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
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: restKm.toFixed(1) + "km", pace: paces.easy, zone: "Z1", fc: z1, time: "10 min", desc: "Trote suave + movilidad articular + 4 progresiones." },
      { label: "PRINCIPAL", name: `${reps} x ${distEach}m`, dist: mainKm.toFixed(1) + "km", pace: repPace, zone: "Z4", fc: karvonen(0.8, 0.9, fcRest, fcMax), time: reps * 2 + " min", desc: `${reps} repeticiones a ritmo VDOT con ${Math.max(60, 180 - reps * 10)}s de trote suave entre series.` },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: restKm.toFixed(1) + "km", pace: paces.easy, zone: "Z1", fc: z1, time: "8 min", desc: "Trote regenerativo + estiramiento." },
    ];
  } else if (d.workout.toLowerCase().includes("fartlek")) {
    typeTag = "FARTLEK";
    title = `FARTLEK (${km} KM)`;
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "2km", pace: paces.easy, zone: "Z1", fc: z1, time: "8 min", desc: "Trote suave + movilidad articular." },
      { label: "PRINCIPAL", name: "Juego de ritmos", dist: Math.max(km - 3.5, 1).toFixed(1) + "km", pace: `${paces.interval}/${paces.easy}`, zone: "Z3/Z4", fc: karvonen(0.75, 0.85, fcRest, fcMax), time: "25 min", desc: "Cambios de ritmo: 1 min ágil (Z4) / 1 min suave (Z2). Ideal para activar el sistema aeróbico." },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1.5km", pace: paces.easy, zone: "Z1", fc: z1, time: "5 min", desc: "Caminata o trote regenerativo." },
    ];
  } else if (d.type === "long") {
    const isSpecific = d.workout.toLowerCase().includes("ritmo objetivo");
    typeTag = "FONDO";
    title = `${isSpecific ? "FONDO CON RITMO OBJETIVO" : "FONDO LARGO"} (${km} KM)`;
    const mainKm = Math.max(km - 4, 1);
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "2km", pace: paces.easy, zone: "Z1", fc: z1, time: "10 min", desc: "Trote suave + movilidad articular." },
      {
        label: "PRINCIPAL",
        name: isSpecific ? "Fondo a ritmo objetivo" : "Fondo continuo",
        dist: mainKm.toFixed(1) + "km",
        pace: isSpecific ? paces.marathon : `${paces.easy}-${paces.marathon}`,
        zone: isSpecific ? "Z3" : "Z2/Z3",
        fc: karvonen(isSpecific ? 0.7 : 0.6, isSpecific ? 0.8 : 0.75, fcRest, fcMax),
        time: Math.round(mainKm * 5.5) + " min",
        desc: isSpecific ? "Últimos km a ritmo objetivo de carrera." : "Ritmo controlado y constante, últimos km a ritmo objetivo si llegás cómodo.",
      },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "2km", pace: paces.easy, zone: "Z1", fc: z1, time: "10 min", desc: "Caminata + estiramiento e hidratación." },
    ];
  } else if (d.workout.toLowerCase().includes("ritmo de carrera")) {
    typeTag = "RITMO";
    title = `RITMO DE CARRERA (${km} KM)`;
    const mainKm = Math.max(km - 3, 1);
    const racePace = distInfo.key === "42k" ? paces.marathon : paces.threshold;
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "1.5km", pace: paces.easy, zone: "Z1", fc: z1, time: "8 min", desc: "Trote suave + progresiones." },
      { label: "PRINCIPAL", name: "Tramo a ritmo objetivo", dist: mainKm.toFixed(1) + "km", pace: racePace, zone: "Z3", fc: karvonen(0.7, 0.8, fcRest, fcMax), time: Math.round(mainKm * 4.75) + " min", desc: "Ritmo objetivo de carrera, sostenido y controlado." },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1.5km", pace: paces.easy, zone: "Z1", fc: z1, time: "8 min", desc: "Trote regenerativo." },
    ];
  } else {
    typeTag = "RODAJE";
    title = `RODAJE SUAVE (${km} KM)`;
    const mainKm = Math.max(km - 2, 1);
    blocks = [
      { label: "CALENTAMIENTO", name: "Entrada en calor", dist: "1km", pace: paces.easy, zone: "Z1", fc: z1, time: "5 min", desc: "Trote suave + movilidad articular." },
      { label: "PRINCIPAL", name: "Rodaje continuo", dist: mainKm.toFixed(1) + "km", pace: paces.easy, zone: "Z2", fc: karvonen(0.6, 0.7, fcRest, fcMax), time: Math.round(mainKm * 5.7) + " min", desc: "Ritmo conversacional, controlado y cómodo." },
      { label: "VUELTA A CALMA", name: "Vuelta a la calma", dist: "1km", pace: paces.easy, zone: "Z1", fc: z1, time: "5 min", desc: "Caminata + estiramiento suave." },
    ];
  }
  blocks = blocks.map((b) => ({ ...b, zoneColor: b.zone.includes("1") ? "var(--muted)" : "var(--good)" }));
  return { typeTag, title, blocks };
}
