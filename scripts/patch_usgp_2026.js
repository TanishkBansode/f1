#!/usr/bin/env node
/**
 * patch_usgp_2026.js
 * Patches rounds 39 (qualifying) and 40 (race) for the
 * 2026 United States Grand Prix with real lap times and grid positions.
 */
const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "..", "data", "2026.json");
const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));

// ─── Qualifying lap times (round 39) ───────────────────────────────────────
const QUALI_TIMES = {
  ANT: { q1: "1:35.390", q2: "1:34.278", q3: "1:34.035" },
  VER: { q1: "1:35.215", q2: "1:34.471", q3: "1:34.214" },
  HAD: { q1: "1:35.286", q2: "1:34.887", q3: "1:34.250" },
  LEC: { q1: "1:35.200", q2: "1:34.198", q3: "1:34.267" },
  HAM: { q1: "1:35.355", q2: "1:34.833", q3: "1:34.311" },
  RUS: { q1: "1:35.730", q2: "1:34.305", q3: "1:34.476" },
  PIA: { q1: "1:35.842", q2: "1:34.818", q3: "1:34.803" },
  NOR: { q1: "1:35.029", q2: "1:34.539", q3: "1:35.049" },
  LIN: { q1: "1:35.755", q2: "1:34.950", q3: "1:36.049" },
  LAW: { q1: "1:35.662", q2: "1:35.058", q3: null },      // no time in Q3
  GAS: { q1: "1:35.969", q2: "1:35.080", q3: null },
  HUL: { q1: "1:35.704", q2: "1:35.158", q3: null },
  BOR: { q1: "1:35.632", q2: "1:35.691", q3: null },
  COL: { q1: "1:35.898", q2: "1:35.722", q3: null },
  ALO: { q1: "1:36.240", q2: "1:35.818", q3: null },
  BEA: { q1: "1:36.175", q2: "1:36.031", q3: null },
  OCO: { q1: "1:36.531", q2: null,        q3: null },
  STR: { q1: "1:36.677", q2: null,        q3: null },
  SAI: { q1: "1:36.770", q2: null,        q3: null },
  ALB: { q1: "1:36.967", q2: null,        q3: null },
  PER: { q1: "1:37.433", q2: null,        q3: null },
  BOT: { q1: "1:37.523", q2: null,        q3: null },
};

// ─── Race results (round 40) ────────────────────────────────────────────────
// starting grid = qualifying position (above)
// Laps: 56 for P1-P11 (finished on lead lap), 55 for P12-P19 (+1 lap), DNF for rest
const RACE_DATA = [
  { id: "ANT", grid: 1,  laps: 56, time: "1:35:16.650", points: 25, fastestLapTime: null },
  { id: "LEC", grid: 4,  laps: 56, time: "+13.078",     points: 19, fastestLapTime: "1:37.976", setFastestLap: true },
  { id: "VER", grid: 2,  laps: 56, time: "+17.485",     points: 15, fastestLapTime: null },
  { id: "HAM", grid: 5,  laps: 56, time: "+18.515",     points: 12, fastestLapTime: null },
  { id: "NOR", grid: 8,  laps: 56, time: "+30.521",     points: 10, fastestLapTime: null },
  { id: "HAD", grid: 3,  laps: 56, time: "+34.373",     points: 8,  fastestLapTime: null },
  { id: "PIA", grid: 7,  laps: 56, time: "+52.674",     points: 6,  fastestLapTime: null },
  { id: "RUS", grid: 6,  laps: 56, time: "+54.303",     points: 4,  fastestLapTime: null },
  { id: "LAW", grid: 10, laps: 56, time: "+1:19.183",   points: 2,  fastestLapTime: null },
  { id: "GAS", grid: 11, laps: 56, time: "+1:27.516",   points: 1,  fastestLapTime: null },
  { id: "HUL", grid: 12, laps: 56, time: "+1:34.945",   points: 0,  fastestLapTime: null },
  { id: "LIN", grid: 9,  laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "BOR", grid: 13, laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "OCO", grid: 17, laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "STR", grid: 18, laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "ALO", grid: 15, laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "ALB", grid: 20, laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "SAI", grid: 19, laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "PER", grid: 21, laps: 55, time: "+1 lap",      points: 0,  fastestLapTime: null },
  { id: "BOT", grid: 22, laps: 42, time: "DNF",         points: 0,  fastestLapTime: null, status: "DNF" },
  { id: "COL", grid: 14, laps: 25, time: "DNF",         points: 0,  fastestLapTime: null, status: "DNF" },
  { id: "BEA", grid: 16, laps: 14, time: "DNF",         points: 0,  fastestLapTime: null, status: "DNF" },
];

// ─── Patch round 39 qualifying ──────────────────────────────────────────────
const r39 = data.raceDetails.find(r => r.round === 39);
if (!r39) { console.error("Round 39 not found!"); process.exit(1); }

r39.qualifyingResults.forEach(entry => {
  const t = QUALI_TIMES[entry.driverId];
  if (!t) { console.warn(`No quali time for ${entry.driverId}`); return; }
  entry.q1 = t.q1 ?? null;
  entry.q2 = t.q2 ?? null;
  entry.q3 = t.q3 ?? null;
  // estimate laps from sessions reached
  entry.laps = t.q3 !== null ? 15 : (t.q2 !== null ? 9 : 5);
});

console.log("✓ Patched round 39 qualifying times");

// ─── Patch round 40 race ────────────────────────────────────────────────────
const r40 = data.raceDetails.find(r => r.round === 40);
if (!r40) { console.error("Round 40 not found!"); process.exit(1); }

r40.raceResults.forEach(entry => {
  const d = RACE_DATA.find(x => x.id === entry.driverId);
  if (!d) { console.warn(`No race data for ${entry.driverId}`); return; }
  entry.startingGrid = d.grid;
  entry.laps = d.laps;
  entry.time = d.time;
  if (d.fastestLapTime) entry.fastestLapTime = d.fastestLapTime;
  if (d.setFastestLap) entry.setFastestLap = true;
  if (d.status) entry.status = d.status;
});

// Also add qualifying results to round 40 (the race round stores quali for reference)
r40.qualifyingResults = r39.qualifyingResults;

console.log("✓ Patched round 40 race data");

// ─── Write ───────────────────────────────────────────────────────────────────
const bak = FILE + ".bak-usgp-patch";
fs.copyFileSync(FILE, bak);
console.log(`Backup: ${path.basename(bak)}`);
fs.writeFileSync(FILE, JSON.stringify(data, null, 2) + "\n");
console.log(`Wrote ${FILE}`);
