import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Host half of the sidebar-studio bundle.
 *
 * Two jobs:
 * 1. deliver the glass skin as an index-injection script (works even when the
 *    client module graph has not loaded the package yet), and
 * 2. serve `GET /yg-usage.json`, the per-Session token index behind the "用量"
 *    panel. The index is computed by `lib/usage.mjs` under the DSH runtime's own
 *    Node, because the Electron host runtime may decode only the first zstd
 *    frame of an append-only session log.
 */

const HERE = fileURLToPath(new URL('.', import.meta.url));
const SKIN_DATA = JSON.parse(readFileSync(join(HERE, 'lib', 'skins.json'), 'utf8'));
const USAGE_HELPER = join(HERE, 'lib', 'usage.mjs');
const USAGE_TTL_MS = 20_000;

/**
 * Extra CSS per skin, appended after the token declarations so its own
 * `!important` rules win. `.wtg9ga_root` is ui-sidebar's column root.
 */
const SKIN_CSS = {
  glass: [
    'html{background:radial-gradient(1200px 820px at 8% -12%, #dbe7f7 0%, rgba(219,231,247,0) 62%),'
      + 'radial-gradient(900px 700px at 100% -5%, #e6eef9 0%, rgba(230,238,249,0) 58%),'
      + 'radial-gradient(1100px 900px at 55% 112%, #e3eaf3 0%, rgba(227,234,243,0) 62%), #f2f6fb;'
      + 'background-attachment:fixed}',
    'html:has(body[data-ds-dark-theme]){background:'
      + 'radial-gradient(1200px 820px at 8% -12%, #17222f 0%, rgba(23,34,47,0) 62%),'
      + 'radial-gradient(900px 700px at 100% -5%, #141c27 0%, rgba(20,28,39,0) 58%),'
      + 'radial-gradient(1100px 900px at 55% 112%, #101823 0%, rgba(16,24,35,0) 62%), #0b1017;'
      + 'background-attachment:fixed}',
    'body{background:transparent !important}',
    // Blur lives on a pseudo-element: `backdrop-filter` on the root would become the
    // containing block for the Windows titlebar toggle (`position: fixed`) and hide it.
    '.wtg9ga_root{position:relative;isolation:isolate;background:transparent !important;backdrop-filter:none;-webkit-backdrop-filter:none;'
      + 'box-shadow:inset -1px 0 0 rgba(255,255,255,0.38), inset 0 1px 0 rgba(255,255,255,0.32)}',
    '.wtg9ga_root::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;border-radius:inherit;'
      + 'background:var(--dsw-specific-sidebar-fill);'
      + 'backdrop-filter:blur(30px) saturate(180%) brightness(1.06);'
      + '-webkit-backdrop-filter:blur(30px) saturate(180%) brightness(1.06)}',
    '.wtg9ga_root::after{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;border-radius:inherit;'
      + 'background:linear-gradient(155deg, rgba(255,255,255,0.42), rgba(255,255,255,0) 42%)}',
    'body[data-ds-dark-theme] .wtg9ga_root{box-shadow:inset -1px 0 0 rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)}',
    'body[data-ds-dark-theme] .wtg9ga_root::before{backdrop-filter:blur(30px) saturate(170%) brightness(0.92);'
      + '-webkit-backdrop-filter:blur(30px) saturate(170%) brightness(0.92)}',
    'body[data-ds-dark-theme] .wtg9ga_root::after{background:linear-gradient(155deg, rgba(255,255,255,0.10), rgba(255,255,255,0) 42%)}',
  ].join('\n'),
};

const ROW_MARKER = 'yg-sidebar-skin';
const STYLE_ID = 'yg-sidebar-skin';

function bootstrapSource() {
  const payload = JSON.stringify({
    skins: SKIN_DATA.skins,
    css: SKIN_CSS,
    order: Object.keys(SKIN_DATA.skins),
    initial: SKIN_DATA.default,
  });
  return `(function(){try{
var D=${payload};
var STYLE_ID=${JSON.stringify(STYLE_ID)};
var current=D.initial;
function css(name){
  var s=D.skins[name]||{}, light=[], dark=[], k;
  for(k in s){light.push(k+':'+s[k].light+' !important');}
  for(k in s){dark.push(k+':'+s[k].dark+' !important');}
  return 'body:not([data-ds-dark-theme]){'+light.join(';')+'}\\nbody[data-ds-dark-theme]{'+dark.join(';')+'}\\n'+(D.css[name]||'');
}
function node(){return document.getElementById(STYLE_ID);}
function paint(){
  var n=node();
  if(!n){
    n=document.createElement('style');
    n.id=STYLE_ID;
    (document.head||document.documentElement).appendChild(n);
  }
  n.textContent=css(current);
}
function start(){
  if(!document.head){setTimeout(start,50);return;}
  paint();
  new MutationObserver(function(){if(!node())paint();}).observe(document.documentElement,{childList:true,subtree:false});
}
window.__YG_SIDEBAR_SKIN__={
  list:function(){return D.order.slice();},
  current:function(){return current;},
  use:function(name){
    if(!D.skins[name])throw new Error('unknown sidebar skin "'+name+'"; available: '+D.order.join(', '));
    current=name;paint();return name;
  },
  /* 临时改色，立即生效、不落盘：apply({ '--dsw-specific-sidebar-fill': { light:'#EDE9DF', dark:'#0E0F10' } }) */
  apply:function(overrides){
    var skin=D.skins[current]||(D.skins[current]={});
    for(var k in overrides){skin[k]=overrides[k];}
    paint();return current;
  },
  /* 导出当前这套的完整值，便于把满意的结果写回文件 */
  dump:function(){return JSON.parse(JSON.stringify(D.skins[current]));}
};
start();
}catch(e){}})()`;
}

const BOOTSTRAP = bootstrapSource();

/** Node that can decode every zstd frame: the DSH runtime's own binary when present. */
function runtimeNode(home) {
  const candidates = [
    process.env.DSH_NODE,
    join(home, 'dsh-runtimes', 'dsh-primary-runtime', 'dependencies', 'node', 'bin',
      process.platform === 'win32' ? 'node.exe' : 'node'),
    process.execPath,
  ].filter((candidate) => typeof candidate === 'string' && candidate !== '');
  return candidates.find((candidate) => existsSync(candidate)) || 'node';
}

let usageCache = { at: 0, value: null };

function usagePayload(home) {
  const now = Date.now();
  if (usageCache.value && now - usageCache.at < USAGE_TTL_MS) return usageCache.value;
  const output = execFileSync(runtimeNode(home), [USAGE_HELPER, home], {
    encoding: 'utf8',
    timeout: 20000,
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  });
  const value = JSON.parse(output);
  usageCache = { at: now, value };
  return value;
}

function csvCell(value) {
  const text = value === undefined || value === null ? '' : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function usageCsv(payload) {
  const header = ['id', 'title', 'workspace', 'cwd', 'total', 'input', 'output', 'cacheRead', 'cacheWrite', 'turns', 'todayTotal', 'todayOutput', 'todayTurns', 'lastTime'];
  const lines = [header.join(',')];
  for (const row of payload.sessions || []) {
    lines.push([
      row.id, row.title, row.workspace, row.cwd, row.total, row.input, row.output,
      row.cacheRead, row.cacheWrite, row.turns, row.todayTotal, row.todayOutput,
      row.todayTurns, row.lastTime ? new Date(row.lastTime).toISOString() : '',
    ].map(csvCell).join(','));
  }
  return `${lines.join('\n')}\n`;
}

/** Host plugin row: index injection first (no service needed), then the web routes. */
export function apply(ctx) {
  ctx.on('webserver/index-inject', (table) => {
    try {
      if (!Array.isArray(table)) return;
      for (const row of table) {
        if (row && row.kind === 'script' && typeof row.text === 'string' && row.text.includes(ROW_MARKER)) return;
      }
      table.push({ kind: 'script', placement: 'body', text: BOOTSTRAP });
    } catch {}
  });

  ctx.inject(['webServer'], (scoped) => {
    try {
      const home = process.env.DSH_HOME || `${process.env.USERPROFILE || process.env.HOME}/.dsh`;

      scoped.effect(() => scoped.webServer.register({
        kind: 'exact',
        path: '/yg-usage.json',
        handler: (request, response) => {
          try {
            const payload = usagePayload(home);
            const wantsCsv = /[?&]format=csv(&|$)/.test(request.url || '');
            if (wantsCsv) {
              response.writeHead(200, {
                'content-type': 'text/csv; charset=utf-8',
                'content-disposition': `attachment; filename="yg-usage-${new Date().toISOString().slice(0, 10)}.csv"`,
                'cache-control': 'no-store',
              });
              response.end(usageCsv(payload));
              return;
            }
            response.writeHead(200, {
              'content-type': 'application/json; charset=utf-8',
              'cache-control': 'no-store',
            });
            response.end(JSON.stringify(payload));
          } catch (error) {
            response.writeHead(500, { 'content-type': 'application/json; charset=utf-8' });
            response.end(JSON.stringify({ error: error && error.message ? error.message : String(error) }));
          }
        },
      }), 'yg-sidebar-studio: usage route');

      scoped.effect(() => scoped.webServer.tapIndex((html) => {
        if (html.includes(ROW_MARKER)) return html;
        const script = `<script>${BOOTSTRAP.replaceAll('</script', '<\\/script')}</script>`;
        return html.includes('</body>') ? html.replace('</body>', `${script}</body>`) : html + script;
      }), 'yg-sidebar-studio: index tap');
    } catch {}
  });
}