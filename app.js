"use strict";

const TREBLE_PITCHES = ["G3","A3","B3","C4","D4","E4","F4","G4","A4","B4","C5","D5","E5","F5","G5","A5","B5","C6"];
const BASS_PITCHES = ["C2","D2","E2","F2","G2","A2","B2","C3","D3","E3","F3","G3","A3","B3","C4","D4","E4","F4"];
const ORDER = ["C","D","E","F","G","A","B"];

const GLYPHS = {
  treble: "M488,1015C524,1015 548,974 548,919C548,819 430,697 350,634C346,659 345,684 345,710C345,858 400,1015 488,1015M429,145C546,143 602,72 602,-36C602,-111 561,-189 486,-211M462,-219C435,-226 408,-229 382,-229C207,-229 68,-94 68,59C68,214 231,365 353,455L383,271C264,246 205,138 205,60C205,-31 259,-106 338,-134L348,-123C303,-101 269,-32 269,12C269,54 301,129 402,143M467,-252C481,-321 499,-468 499,-494C499,-595 424,-664 338,-664C282,-664 243,-643 230,-625C308,-603 341,-557 341,-510C341,-451 287,-409 237,-409C159,-409 128,-477 128,-537C128,-651 255,-690 332,-690C467,-690 525,-587 525,-502C525,-473 504,-306 492,-245C604,-207 683,-94 683,24C683,164 591,277 436,277C427,277 418,277 409,276L376,470C440,521 483,568 518,627C561,700 589,770 589,892C589,1003 517,1170 473,1170C414,1170 337,1026 322,958C311,910 306,852 306,814C306,742 315,680 325,613C169,498 0,337 0,135C0,-110 183,-261 387,-261C416,-261 442,-257 467,-252z",
  bass: "M517,-28C517,114 420,250 248,250C80,250 0,136 0,15C0,-53 49,-110 110,-110C175,-110 216,-60 216,-9C216,41 187,91 130,91C89,91 68,71 59,71C51,71 51,83 51,86C51,157 143,221 223,221C315,221 372,126 372,-20C372,-244 274,-465 -43,-571L-36,-586C263,-547 517,-309 517,-28M555,123C555,91 580,69 611,69C643,69 665,94 665,125C665,157 640,177 609,177C577,177 555,154 555,123M554,-129C555,-161 580,-183 611,-183C643,-183 665,-158 665,-127C665,-96 640,-75 609,-75C578,-75 554,-99 554,-129z",
  head: "M0,-40C0,-93 43,-132 111,-132C206,-132 318,-56 318,35C318,88 275,126 206,126C114,126 0,55 0,-40z",
  flagUp: "M0,31L0,-231L20,-231C185,-247 248,-439 248,-582C248,-638 240,-706 221,-753L233,-755C253,-699 264,-637 264,-570C264,-473 244,-374 189,-280C115,-154 24,-77 20,31z",
  flagDown: "M285,574C285,667 259,746 230,790L219,783C250,722 267,656 267,582C267,457 199,325 122,271C81,243 43,236 20,232L0,232L0,-34L20,-34C20,22 55,85 88,132C127,188 172,255 215,327C264,409 285,486 285,574z"
};

const pitchSelect = document.getElementById("pitchSelect");
const clefSelect = document.getElementById("clefSelect");
const valueSelect = document.getElementById("valueSelect");
const spacingSelect = document.getElementById("spacingSelect");
const svgPreview = document.getElementById("svgPreview");
const summary = document.getElementById("selectionSummary");

function noteIndex(note) {
  return Number(note.slice(1)) * 7 + ORDER.indexOf(note[0]);
}

function pitchesForClef(clef) {
  return clef === "treble" ? TREBLE_PITCHES : BASS_PITCHES;
}

function refreshPitchOptions(preferred = null) {
  const choices = pitchesForClef(clefSelect.value);
  const selected = preferred && choices.includes(preferred)
    ? preferred
    : (clefSelect.value === "treble" ? "C4" : "C3");
  pitchSelect.innerHTML = choices.map(p => `<option value="${p}">${p}</option>`).join("");
  pitchSelect.value = selected;
}

function staffY(clef, note) {
  const staffTop = 74;
  const staffSpace = 14;
  const bottomNote = clef === "treble" ? "E4" : "G2";
  const steps = noteIndex(note) - noteIndex(bottomNote);
  let y = staffTop + 4 * staffSpace - steps * (staffSpace / 2);
  const topIndex = noteIndex(bottomNote) + 8;
  if (noteIndex(note) < noteIndex(bottomNote)) y -= 0.7;
  if (noteIndex(note) > topIndex) y += 0.7;
  return y;
}

function stemDirection(clef, note) {
  const middle = clef === "treble" ? "B4" : "D3";
  return noteIndex(note) < noteIndex(middle) ? "up" : "down";
}

function path(d, x, y, scale = 0.056) {
  return `<path d="${d}" transform="translate(${x.toFixed(3)},${y.toFixed(3)}) scale(${scale},${-scale})" fill="#111"/>`;
}

function noteMarkup(cx, cy, direction, value) {
  const headX = cx - 8.904;
  const headY = cy - 2.168;
  let stem, flag = "";

  if (direction === "up") {
    const stemX = cx + 7.59;
    const stemTop = cy - 51.05;
    const stemBottom = cy - 2.0;
    stem = `<line x1="${stemX.toFixed(3)}" y1="${stemBottom.toFixed(3)}" x2="${stemX.toFixed(3)}" y2="${stemTop.toFixed(3)}" stroke="#111" stroke-width="1.276"/>`;
    if (value === "eighth") flag = path(GLYPHS.flagUp, stemX - 0.63, stemTop, 0.056);
  } else {
    const stemX = cx - 8.268;
    const stemTop = cy + 51.05;
    const stemBottom = cy + 2.0;
    stem = `<line x1="${stemX.toFixed(3)}" y1="${stemBottom.toFixed(3)}" x2="${stemX.toFixed(3)}" y2="${stemTop.toFixed(3)}" stroke="#111" stroke-width="1.276"/>`;
    if (value === "eighth") flag = path(GLYPHS.flagDown, stemX - 0.64, stemTop, 0.056);
  }

  return `${stem}${flag}${path(GLYPHS.head, headX, headY, 0.056)}`;
}

function generateSvg() {
  const clef = clefSelect.value;
  const pitch = pitchSelect.value;
  const value = valueSelect.value;
  const spacing = spacingSelect.value;

  const staffLeft = 14;
  const noteX = { near: 90, key: 118, keytime: 146 }[spacing];
  const staffRight = noteX + 80;
  const width = staffRight + 10;
  const height = 156;
  const viewY = 24;
  const y = staffY(clef, pitch);
  const direction = stemDirection(clef, pitch);

  const lines = Array.from({length: 5}, (_, i) => {
    const ly = 74 + i * 14;
    return `<line x1="${staffLeft}" y1="${ly}" x2="${staffRight}" y2="${ly}" stroke="#111" stroke-width="1.2"/>`;
  }).join("");

  const clefGraphic = clef === "treble"
    ? path(GLYPHS.treble, staffLeft + 16, 116, 0.056)
    : path(GLYPHS.bass, staffLeft + 17, 88, 0.056);

  const ledgerYs = [];
  const bottom = 130, top = 74;
  if (y > bottom + 3.5) {
    for (let ly = bottom + 14 - 0.7; ly <= y + 0.1; ly += 14) ledgerYs.push(ly);
  } else if (y < top - 3.5) {
    for (let ly = top - 14 + 0.7; ly >= y - 0.1; ly -= 14) ledgerYs.push(ly);
  }
  const ledgers = ledgerYs.map(ly => `<line x1="${noteX - 14}" y1="${ly.toFixed(3)}" x2="${noteX + 14}" y2="${ly.toFixed(3)}" stroke="#111" stroke-width="1.2"/>`).join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 ${viewY} ${width} ${height}" aria-hidden="true"><rect x="0" y="${viewY}" width="${width}" height="${height}" fill="white"/>${lines}${clefGraphic}${ledgers}${noteMarkup(noteX, y, direction, value)}</svg>`;
}

function label(value) {
  const labels = {
    treble: "Treble clef", bass: "Bass clef",
    quarter: "Quarter note", eighth: "Eighth note",
    near: "Near clef", key: "Key signature space", keytime: "Key + time signature space"
  };
  return labels[value] || value;
}

function update() {
  const svg = generateSvg();
  svgPreview.innerHTML = svg;
  summary.textContent = `${label(clefSelect.value)} · ${pitchSelect.value} · ${label(valueSelect.value)} · ${label(spacingSelect.value)}`;
  svgPreview.setAttribute("aria-label", summary.textContent);
}

function filename(extension) {
  return `${clefSelect.value}_${pitchSelect.value}_${valueSelect.value}_${spacingSelect.value}.${extension}`;
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadSvg() {
  const svg = generateSvg();
  downloadBlob(new Blob([svg], {type: "image/svg+xml;charset=utf-8"}), filename("svg"));
}

function downloadPng() {
  const svg = generateSvg();
  const source = new Blob([svg], {type: "image/svg+xml;charset=utf-8"});
  const url = URL.createObjectURL(source);
  const img = new Image();
  img.onload = () => {
    const scale = 3;
    const canvas = document.createElement("canvas");
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (blob) downloadBlob(blob, filename("png"));
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.onerror = () => URL.revokeObjectURL(url);
  img.src = url;
}

clefSelect.addEventListener("change", () => {
  refreshPitchOptions(pitchSelect.value);
  update();
});
[pitchSelect, valueSelect, spacingSelect].forEach(el => el.addEventListener("change", update));
document.getElementById("downloadSvg").addEventListener("click", downloadSvg);
document.getElementById("downloadPng").addEventListener("click", downloadPng);

refreshPitchOptions("C4");
update();
