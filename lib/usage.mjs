/**
 * Usage index for the sidebar "用量" panel.
 *
 * Runs under a Node with zstd support (the DSH runtime's own Node) because the
 * Electron host may ship an older runtime. Reads `$DSH_HOME/sessions/**\/session.v4.jsonl.zstd`,
 * sums `record.data.usage`, and prints one JSON document on stdout.
 *
 * Usage: node usage.mjs <dshHome>
 */
import { readdirSync, readFileSync, statSync, writeFileSync, renameSync } from 'node:fs';
import { join } from 'node:path';
import { zstdDecompressSync } from 'node:zlib';

/**
 * Decode every frame in an append-only log.
 *
 * The durable log is a sequence of concatenated zstd frames (one per flush).
 * Some Node builds decode only the first frame, so walk the frame magic instead
 * of relying on the decoder's multi-frame support.
 */
const FRAME_MAGIC = Buffer.from([0x28, 0xb5, 0x2f, 0xfd]);

function decodeAllFrames(buffer) {
  const parts = [];
  let offset = 0;
  let skipped = 0;
  while (offset < buffer.length) {
    const start = buffer.indexOf(FRAME_MAGIC, offset);
    if (start < 0) break;
    const next = buffer.indexOf(FRAME_MAGIC, start + 4);
    const end = next < 0 ? buffer.length : next;
    try {
      parts.push(zstdDecompressSync(buffer.subarray(start, end)).toString('utf8'));
    } catch {
      skipped += 1;
    }
    offset = next < 0 ? buffer.length : next;
  }
  if (skipped > 0) process.stderr.write(`usage: skipped ${skipped} frame(s)\n`);
  return parts.join('');
}

const home = process.argv[2] || process.env.DSH_HOME || '';
const cacheFile = join(home, 'yg-usage-cache.json');
const MAX_SESSIONS = 200;

function loadCache() {
  try {
    const parsed = JSON.parse(readFileSync(cacheFile, 'utf8'));
    return new Map(Object.entries(parsed || {}));
  } catch {
    return new Map();
  }
}

function saveCache(cache) {
  try {
    const tmp = `${cacheFile}.tmp`;
    writeFileSync(tmp, JSON.stringify(Object.fromEntries(cache)));
    renameSync(tmp, cacheFile);
  } catch {}
}

function sessionFiles(base) {
  const out = [];
  let workspaces = [];
  try {
    workspaces = readdirSync(join(base, 'sessions'), { withFileTypes: true }).filter((entry) => entry.isDirectory());
  } catch {
    return out;
  }
  for (const workspace of workspaces) {
    const workspaceDir = join(base, 'sessions', workspace.name);
    let sessions = [];
    try {
      sessions = readdirSync(workspaceDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
    } catch {
      continue;
    }
    for (const session of sessions) {
      out.push({ workspace: workspace.name, file: join(workspaceDir, session.name, 'session.v4.jsonl.zstd') });
    }
  }
  return out;
}

function readUsage(file, cache, dayStart) {
  let stats;
  try {
    stats = statSync(file);
  } catch {
    return undefined;
  }
  const hit = cache.get(file);
  if (hit && hit.mtimeMs === stats.mtimeMs && hit.size === stats.size && hit.dayStart === dayStart) return hit.value;

  let value;
  try {
    const text = decodeAllFrames(readFileSync(file));
    let input = 0;
    let output = 0;
    let cacheRead = 0;
    let cacheWrite = 0;
    let total = 0;
    let turns = 0;
    let todayTotal = 0;
    let todayOutput = 0;
    let todayTurns = 0;
    let lastTime = stats.mtimeMs;
    let cwd = '';
    let title = '';
    for (const line of text.split('\n')) {
      if (line === '') continue;
      let record;
      try {
        record = JSON.parse(line);
      } catch {
        continue;
      }
      const isToday = typeof record.time === 'number' && record.time >= dayStart;
      if (typeof record.time === 'number' && record.time > lastTime) lastTime = record.time;
      if (record.type === 'session' && typeof record.cwd === 'string') cwd = record.cwd;
      const data = record.data;
      if (!data) continue;
      if (record.type === 'session/title' && typeof data.title === 'string' && data.title !== '') title = data.title;
      if (record.type === 'turn/end') {
        turns += 1;
        if (isToday) todayTurns += 1;
      }
      const usage = data.usage;
      if (usage) {
        const inputTokens = Number(usage.inputTokens) || 0;
        const outputTokens = Number(usage.outputTokens) || 0;
        const recordTotal = Number(usage.totalTokens) || inputTokens + outputTokens;
        input += inputTokens;
        output += outputTokens;
        cacheRead += Number(usage.cacheReadTokens) || 0;
        cacheWrite += Number(usage.cacheWriteTokens) || 0;
        total += recordTotal;
        if (isToday) {
          todayTotal += recordTotal;
          todayOutput += outputTokens;
        }
      }
    }
    value = {
      input, output, cacheRead, cacheWrite, total, turns,
      todayTotal, todayOutput, todayTurns,
      lastTime, cwd, title,
    };
  } catch {
    value = undefined;
  }
  cache.set(file, { mtimeMs: stats.mtimeMs, size: stats.size, dayStart, value });
  return value;
}

const cache = loadCache();
const dayStart = new Date();
dayStart.setHours(0, 0, 0, 0);
const rows = [];
for (const { workspace, file } of sessionFiles(home)) {
  const usage = readUsage(file, cache, dayStart.getTime());
  if (!usage || usage.total <= 0) continue;
  rows.push({
    id: file.split(/[\\/]/).slice(-2)[0],
    workspace,
    cwd: usage.cwd,
    title: usage.title,
    input: usage.input,
    output: usage.output,
    cacheRead: usage.cacheRead,
    cacheWrite: usage.cacheWrite,
    total: usage.total,
    turns: usage.turns,
    todayTotal: usage.todayTotal,
    todayOutput: usage.todayOutput,
    todayTurns: usage.todayTurns,
    lastTime: usage.lastTime,
  });
}
saveCache(cache);

rows.sort((a, b) => b.total - a.total);

const totals = rows.reduce((acc, row) => ({
  total: acc.total + row.total,
  output: acc.output + row.output,
  input: acc.input + row.input,
  cacheRead: acc.cacheRead + row.cacheRead,
  todayTotal: acc.todayTotal + (row.todayTotal || 0),
  todayOutput: acc.todayOutput + (row.todayOutput || 0),
  sessions: acc.sessions + 1,
}), { total: 0, output: 0, input: 0, cacheRead: 0, todayTotal: 0, todayOutput: 0, sessions: 0 });

process.stdout.write(JSON.stringify({
  sessions: rows.slice(0, MAX_SESSIONS),
  totals,
  dayStart: dayStart.getTime(),
  at: Date.now(),
}));