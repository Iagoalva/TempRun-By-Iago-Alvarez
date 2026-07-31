/* ============================================================================
   TempRun — Google Apps Script: planilla de contactos + resumen semanal
   ============================================================================
   Este script va DENTRO de una planilla de Google Sheets (Extensiones → Apps
   Script), no en tu computadora. Instrucciones completas al final del chat.

   Qué hace:
   1. Recibe datos de cada atleta (nombre, teléfono, provincia, zona, km de la
      semana, entrenamientos completados, % de adherencia) desde la app de
      TempRun, y los guarda/actualiza en una fila de la planilla.
   2. Todos los domingos (con el disparador que configurás vos), manda:
      - a cada atleta, un mail con SU resumen de la semana.
      - a vos (coach), un solo mail con el resumen de todo el club junto.

   NO guarda contraseñas ni datos de salud — solo lo que ves en las columnas.
   ============================================================================ */

// ====== CONFIGURACIÓN — completar antes de desplegar ======

// Clave secreta compartida con la app (tiene que ser EXACTAMENTE la misma
// que le vas a pasar a Claude para poner en GOOGLE_SHEETS_SHARED_SECRET del
// lado de app.js). Inventá algo largo y único, tipo una contraseña.
const SHARED_SECRET = "CAMBIAR_ESTO_POR_UNA_CLAVE_LARGA_Y_UNICA";

// El mail donde vos (coach) querés recibir el resumen consolidado de todos
// los domingos.
const COACH_EMAIL = "coach@ejemplo.com";

const SHEET_NAME = "Atletas";
const COLUMNS = ["Email", "Nombre completo", "Teléfono", "Provincia", "Zona", "Km esta semana", "Entrenamientos completados", "Adherencia %", "Última actualización"];

// ====== NO HACE FALTA TOCAR NADA DE ACÁ PARA ABAJO ======

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Recibe el POST que manda la app cada vez que un atleta está usando TempRun.
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    if (body.secret !== SHARED_SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ error: "unauthorized" })).setMimeType(ContentService.MimeType.JSON);
    }
    upsertRow_(body);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}

function upsertRow_(data) {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === data.email) {
      rowIndex = i + 1; // getRange es 1-indexado
      break;
    }
  }
  const row = [
    data.email || "",
    data.fullName || "",
    data.phone || "",
    data.provincia || "",
    data.zona || "",
    data.weeklyKm || 0,
    data.sessionsDone || 0,
    data.adherence || 0,
    new Date(),
  ];
  if (rowIndex === -1) {
    sheet.appendRow(row);
  } else {
    sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
  }
}

// Se ejecuta sola todos los domingos — hay que configurar el disparador una
// sola vez (ver instrucciones). También la podés correr manualmente desde el
// editor para probarla antes de esperar al domingo.
function sendWeeklySummaries() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const rows = values.slice(1).filter((r) => r[0]); // saltea el encabezado y filas vacías

  rows.forEach((r) => {
    const [email, fullName, , , , weeklyKm, sessionsDone, adherence] = r;
    if (!email) return;
    const nombre = fullName ? fullName.split(" ")[0] : "";
    const subject = "Tu resumen semanal de TempRun";
    const body =
      `Hola ${nombre},\n\n` +
      `Así te fue esta semana:\n` +
      `- ${weeklyKm} km recorridos\n` +
      `- ${sessionsDone} entrenamientos completados\n` +
      `- ${adherence}% de adherencia a tu plan\n\n` +
      `¡Seguí así!\n` +
      `TempRun by Iago Alvarez`;
    try {
      MailApp.sendEmail(email, subject, body);
    } catch (err) {
      Logger.log("Error enviando a " + email + ": " + err);
    }
  });

  if (COACH_EMAIL) {
    const lines = rows.map((r) => `${r[1] || r[0]} — ${r[5]} km, ${r[6]} entrenamientos, ${r[7]}% adherencia`);
    const coachBody = rows.length ? `Resumen semanal del club:\n\n${lines.join("\n")}` : "Todavía no hay datos de atletas cargados esta semana.";
    try {
      MailApp.sendEmail(COACH_EMAIL, "Resumen semanal del club — TempRun", coachBody);
    } catch (err) {
      Logger.log("Error enviando resumen al coach: " + err);
    }
  }
}
