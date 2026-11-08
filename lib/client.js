window.__ModuleLoader__.load({
  id: 'dsh-sidebar-studio',
  factory(require) {
    // Execution probe: proves the bundle was fetched and ran, independently of
    // whether `apply` later succeeds. Removed once the channel is verified.
    window.__YG_CLIENT_BUNDLE__ = 'exec';

    const React = require('react');
    const h = React.createElement;

    /**
     * Skin layer: alias-layer token overrides only. The base theme stays intact,
     * layers compose in registration order, and removing this layer restores the
     * shipped palette, so every value here is a reversible aesthetic choice.
     *
     * The frosted-glass blur and gradient backdrop live in the Host-injected
     * stylesheet (`index.js`); this half carries the same token values so the
     * theme service stays truthful and `theme/change` repaints keep them.
     */
    const SKINS = {
      paper: {
        '--dsw-alias-bg-base': { light: '#FDFCF9', dark: '#17191B' },
        '--dsw-specific-sidebar-fill': { light: '#EDE9DF', dark: '#0E0F10' },
        '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#1C1F22' },
        '--dsw-alias-bg-layer-2': { light: '#F6F3EC', dark: '#23262A' },
        '--dsw-alias-bg-overlay': { light: '#FDFCF9', dark: '#202327' },
        '--dsw-alias-border-l1': { light: '#0000000F', dark: '#FFFFFF12' },
        '--dsw-alias-border-l2': { light: '#0000001C', dark: '#FFFFFF22' },
        '--dsw-alias-label-primary': { light: '#17150F', dark: '#EFEDE7' },
        '--dsw-alias-label-secondary': { light: '#67625A', dark: '#A8A39A' },
        '--dsw-alias-label-tertiary': { light: '#8B857A', dark: '#807A72' },
        '--dsw-alias-interactive-bg-hover': { light: '#2B261A12', dark: '#FFFFFF16' },
        '--dsw-alias-interactive-bg-active': { light: '#2B261A20', dark: '#FFFFFF26' },
        '--dsw-specific-sidebar-nav-item-active': { light: '#E2DAC8', dark: '#24221C' },
        '--dsw-specific-sidebar-nav-item-active-accent': { light: '#B8892B', dark: '#E3B45C' },
        '--dsw-alias-menu-surface-fill': { light: '#FDFCF9E6', dark: '#202327B8' },
        '--dsw-alias-scrollbar-bg-l1': { light: '#D6CFC0', dark: '#3B3F44' },
      },
      slate: {
        '--dsw-alias-bg-base': { light: '#FBFCFD', dark: '#101419' },
        '--dsw-specific-sidebar-fill': { light: '#E8ECF2', dark: '#0A0D11' },
        '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#171C23' },
        '--dsw-alias-bg-layer-2': { light: '#F1F4F8', dark: '#1D242D' },
        '--dsw-alias-bg-overlay': { light: '#FBFCFD', dark: '#1A2028' },
        '--dsw-alias-border-l1': { light: '#0B12200F', dark: '#FFFFFF12' },
        '--dsw-alias-border-l2': { light: '#0B12201F', dark: '#FFFFFF22' },
        '--dsw-alias-label-primary': { light: '#0F141B', dark: '#E9EDF2' },
        '--dsw-alias-label-secondary': { light: '#525C68', dark: '#9BA5B1' },
        '--dsw-alias-label-tertiary': { light: '#7A838F', dark: '#77808C' },
        '--dsw-alias-interactive-bg-hover': { light: '#26314812', dark: '#FFFFFF16' },
        '--dsw-alias-interactive-bg-active': { light: '#26314820', dark: '#FFFFFF26' },
        '--dsw-specific-sidebar-nav-item-active': { light: '#DCE3EC', dark: '#1E2A36' },
        '--dsw-specific-sidebar-nav-item-active-accent': { light: '#4B6A8F', dark: '#8FB2D6' },
        '--dsw-alias-menu-surface-fill': { light: '#FBFCFDE6', dark: '#1A2028C0' },
        '--dsw-alias-scrollbar-bg-l1': { light: '#C9D2DD', dark: '#37414C' },
      },
      ink: {
        '--dsw-alias-bg-base': { light: '#FBFBFB', dark: '#080808' },
        '--dsw-specific-sidebar-fill': { light: '#F0F0F0', dark: '#0E0E0E' },
        '--dsw-alias-bg-layer-1': { light: '#FFFFFF', dark: '#141414' },
        '--dsw-alias-bg-layer-2': { light: '#F4F4F4', dark: '#1A1A1A' },
        '--dsw-alias-bg-overlay': { light: '#FAFAFA', dark: '#1E1E1E' },
        '--dsw-alias-border-l1': { light: '#0000000D', dark: '#FFFFFF0F' },
        '--dsw-alias-border-l2': { light: '#0000001A', dark: '#FFFFFF1C' },
        '--dsw-alias-label-primary': { light: '#0F0F0F', dark: '#F2F2F2' },
        '--dsw-alias-label-secondary': { light: '#5B5B5B', dark: '#A8A8A8' },
        '--dsw-alias-label-tertiary': { light: '#858585', dark: '#7A7A7A' },
        '--dsw-alias-interactive-bg-hover': { light: '#0000000D', dark: '#FFFFFF12' },
        '--dsw-alias-interactive-bg-active': { light: '#0000001A', dark: '#FFFFFF22' },
        '--dsw-specific-sidebar-nav-item-active': { light: '#E4E4E4', dark: '#1F1F1F' },
        '--dsw-specific-sidebar-nav-item-active-accent': { light: '#C0392B', dark: '#E05C4B' },
        '--dsw-alias-menu-surface-fill': { light: '#FAFAFAB3', dark: '#1E1E1EB3' },
        '--dsw-alias-scrollbar-bg-l1': { light: '#D0D0D0', dark: '#3A3A3A' },
      },
      glass: {
        '--dsw-alias-bg-base': { light: 'rgba(246,249,253,0.55)', dark: 'rgba(9,13,19,0.55)' },
        '--dsw-specific-sidebar-fill': { light: 'rgba(255,255,255,0.34)', dark: 'rgba(24,31,40,0.36)' },
        '--dsw-alias-bg-layer-1': { light: 'rgba(255,255,255,0.74)', dark: 'rgba(32,41,52,0.70)' },
        '--dsw-alias-bg-layer-2': { light: 'rgba(255,255,255,0.56)', dark: 'rgba(27,35,45,0.55)' },
        '--dsw-alias-bg-overlay': { light: 'rgba(251,253,255,0.82)', dark: 'rgba(28,36,46,0.82)' },
        '--dsw-alias-border-l1': { light: 'rgba(11,18,32,0.10)', dark: 'rgba(255,255,255,0.10)' },
        '--dsw-alias-border-l2': { light: 'rgba(11,18,32,0.16)', dark: 'rgba(255,255,255,0.16)' },
        '--dsw-alias-label-primary': { light: '#0E141B', dark: '#E9EDF2' },
        '--dsw-alias-label-secondary': { light: '#4D5865', dark: '#9BA5B1' },
        '--dsw-alias-label-tertiary': { light: '#76808D', dark: '#79828E' },
        '--dsw-alias-interactive-bg-hover': { light: 'rgba(38,49,72,0.07)', dark: 'rgba(255,255,255,0.07)' },
        '--dsw-alias-interactive-bg-active': { light: 'rgba(38,49,72,0.12)', dark: 'rgba(255,255,255,0.13)' },
        '--dsw-specific-sidebar-nav-item-active': { light: 'rgba(62,123,196,0.16)', dark: 'rgba(127,176,232,0.16)' },
        '--dsw-specific-sidebar-nav-item-active-accent': { light: '#3E7BC4', dark: '#7FB0E8' },
        '--dsw-alias-menu-surface-fill': { light: 'rgba(251,253,255,0.60)', dark: 'rgba(24,31,40,0.62)' },
        '--dsw-alias-scrollbar-bg-l1': { light: 'rgba(126,140,158,0.34)', dark: 'rgba(150,165,185,0.28)' },
      },
    };

    const DEFAULT_SKIN = 'glass';
    const SOURCE = 'yg-sidebar-studio';

    const ICON_COPY = ['M9 3.5h6.2a1.3 1.3 0 0 1 1.3 1.3V11h-1.6V5.1H9z',
      'M5.8 6.9h6.2a1.3 1.3 0 0 1 1.3 1.3v6.4a1.3 1.3 0 0 1-1.3 1.3H5.8a1.3 1.3 0 0 1-1.3-1.3V8.2a1.3 1.3 0 0 1 1.3-1.3zm.4 1.6v6.1h5.4V8.5z'];

    /** Hover button on a Session row: copy its full Session ID. */
    function CopySessionId({ sessionId }) {
      const [done, setDone] = React.useState(false);
      const timer = React.useRef();
      React.useEffect(() => () => clearTimeout(timer.current), []);
      const onClick = React.useCallback((event) => {
        event.stopPropagation();
        event.preventDefault();
        const text = String(sessionId ?? '');
        if (!text) return;
        const settle = () => {
          setDone(true);
          timer.current = setTimeout(() => setDone(false), 1200);
        };
        try {
          navigator.clipboard.writeText(text).then(settle, () => {});
        } catch {}
      }, [sessionId]);
      const label = done ? '已复制会话 ID' : '复制会话 ID';
      return h('button', {
        type: 'button',
        'aria-label': label,
        title: label,
        onClick,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '24px',
          height: '24px',
          margin: '-4px',
          padding: 0,
          border: 'none',
          borderRadius: '6px',
          background: done ? 'var(--dsw-alias-interactive-bg-active, rgba(0,0,0,.08))' : 'transparent',
          color: done
            ? 'var(--dsw-specific-sidebar-nav-item-active-accent, var(--dsw-alias-brand-primary))'
            : 'var(--dsw-alias-label-tertiary, currentColor)',
          cursor: 'pointer',
        },
      }, h('svg', {
        viewBox: '0 0 18 18', width: 14, height: 14, 'aria-hidden': true,
        fill: 'currentColor',
      }, ICON_COPY.map((d, i) => h('path', { key: i, d }))));
    }

    /** Collapsed-rail notification: how many Sessions wait for an answer. */
    function PendingBadge({ useSessionStatus }) {
      let pending = 0;
      let running = 0;
      let probe = 'no-hook';
      try {
        if (typeof useSessionStatus !== 'function') throw new Error('missing useSessionStatus');
        const statuses = useSessionStatus((s) => s);
        const values = statuses instanceof Map
          ? Array.from(statuses.values())
          : Object.values(statuses || {});
        probe = `n=${values.length}`;
        for (const status of values) {
          if (!status) continue;
          if (status.pendingInteraction && status.pendingInteraction.kind) pending += 1;
          else if (status.running === true) running += 1;
        }
        if (typeof window !== 'undefined') {
          window.__YG_PENDING__ = { pending, running, probe };
        }
      } catch (error) {
        if (typeof window !== 'undefined') {
          window.__YG_PENDING__ = { pending: 0, running: 0, probe: `error: ${error && error.message}` };
        }
      }
      // Waiting for an answer wins; otherwise show that work is still running.
      const count = pending > 0 ? pending : running;
      if (count <= 0) return null;
      const waiting = pending > 0;
      const label = waiting ? `${count} 个会话等待回答` : `${count} 个会话正在运行`;
      return h('span', {
        role: 'status',
        'aria-label': label,
        title: label,
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '14px',
          height: '14px',
          padding: '0 4px',
          borderRadius: '999px',
          background: waiting
            ? 'var(--dsw-alias-state-warn-primary, #E0851F)'
            : 'var(--dsw-alias-brand-primary, #3E7BC4)',
          color: '#FFFFFF',
          fontSize: '10px',
          fontWeight: 600,
          lineHeight: '14px',
          letterSpacing: 0,
        },
      }, count > 9 ? '9+' : String(count));
    }

    /** Frame-wide pill: how many Sessions wait for an answer, or are still running. */
    function ActivityPill({ useSessionStatus }) {
      let pending = 0;
      let running = 0;
      try {
        if (typeof useSessionStatus !== 'function') throw new Error('missing useSessionStatus');
        const statuses = useSessionStatus((s) => s);
        const values = statuses instanceof Map
          ? Array.from(statuses.values())
          : Object.values(statuses || {});
        for (const status of values) {
          if (!status) continue;
          if (status.pendingInteraction && status.pendingInteraction.kind) pending += 1;
          else if (status.running === true) running += 1;
        }
        if (typeof window !== 'undefined') window.__YG_PENDING__ = { pending, running, probe: `n=${values.length}` };
      } catch (error) {
        if (typeof window !== 'undefined') window.__YG_PENDING__ = { pending: 0, running: 0, probe: `error: ${error && error.message}` };
      }
      const count = pending > 0 ? pending : running;
      if (count <= 0) return null;
      const waiting = pending > 0;
      const label = waiting ? `${count} 个会话等待回答` : `${count} 个会话正在运行`;
      return h('div', {
        role: 'status',
        'aria-label': label,
        title: label,
        style: {
          position: 'fixed',
          left: '14px',
          bottom: '14px',
          zIndex: 30,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          height: '22px',
          padding: '0 9px',
          borderRadius: '999px',
          pointerEvents: 'none',
          background: waiting ? 'rgba(224,133,31,0.92)' : 'rgba(62,123,196,0.88)',
          color: '#FFFFFF',
          fontSize: '11px',
          fontWeight: 600,
          lineHeight: '22px',
          letterSpacing: '0.02em',
          boxShadow: '0 2px 10px rgba(0,0,0,0.18)',
          backdropFilter: 'blur(10px)',
        },
      }, h('span', {
        'aria-hidden': true,
        style: { width: '6px', height: '6px', borderRadius: '999px', background: '#FFFFFF', opacity: 0.9 },
      }), waiting ? `${count} 待回答` : `${count} 运行中`);
    }

    /** Relative time for the overview rows. */
    function relativeTime(timestamp) {
      if (!timestamp) return '';
      const diff = Date.now() - timestamp;
      if (!Number.isFinite(diff) || diff < 0) return '刚刚';
      const minute = 60000;
      const hour = 60 * minute;
      const day = 24 * hour;
      if (diff < minute) return '刚刚';
      if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
      if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
      if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
      return new Date(timestamp).toLocaleDateString();
    }

    function basenameOf(path) {
      if (!path) return '';
      const trimmed = String(path).replace(/[/\\]+$/, '');
      const index = Math.max(trimmed.lastIndexOf('/'), trimmed.lastIndexOf('\\'));
      return index >= 0 ? trimmed.slice(index + 1) : trimmed;
    }

    /** Sidebar icon for the usage panel: ascending bars. */
    function UsageIcon({ size }) {
      const dimension = size || 16;
      return h('svg', {
        viewBox: '0 0 16 16', width: dimension, height: dimension, 'aria-hidden': true,
        fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round',
      },
        h('path', { d: 'M3 13V9.5' }),
        h('path', { d: 'M6.5 13V6' }),
        h('path', { d: 'M10 13V8' }),
        h('path', { d: 'M13.5 13V3.5' }));
    }

    function compactTokens(n) {
      const value = Number(n) || 0;
      if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(0)}k`;
      return String(value);
    }

    /** Shared usage feed: one fetch serves both the panel and the row badges. */
    const usageFeed = {
      phase: 'idle',
      data: null,
      error: null,
      rows: new Map(),
      at: 0,
      listeners: new Set(),
      inflight: null,
      subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
      },
      emit() {
        for (const listener of this.listeners) {
          try { listener(); } catch {}
        }
      },
      refresh(force) {
        if (!force && this.data && Date.now() - this.at < 60000) return;
        if (this.inflight) return;
        this.phase = this.data ? this.phase : 'loading';
        this.inflight = fetch('/yg-usage.json', { headers: { accept: 'application/json' } })
          .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`))))
          .then((data) => {
            this.data = data;
            this.error = null;
            this.rows = new Map((data.sessions || []).map((row) => [row.id, row]));
            this.phase = 'ready';
            this.at = Date.now();
          })
          .catch((error) => {
            this.error = error;
            if (!this.data) this.phase = 'error';
          })
          .finally(() => {
            this.inflight = null;
            this.emit();
          });
      },
    };

    function useUsageFeed() {
      const [, bump] = React.useState(0);
      React.useEffect(() => {
        const off = usageFeed.subscribe(() => bump((n) => n + 1));
        usageFeed.refresh(false);
        const timer = setInterval(() => usageFeed.refresh(true), 60000);
        return () => {
          off();
          clearInterval(timer);
        };
      }, []);
      return usageFeed;
    }

    function Segmented({ options, value, onChange, faint }) {
      return h('div', {
        style: {
          display: 'inline-flex', gap: '2px', padding: '2px',
          borderRadius: '8px', background: 'var(--dsw-alias-interactive-bg-hover, rgba(0,0,0,.05))',
        },
      }, options.map((option) => h('button', {
        key: option.id,
        type: 'button',
        onClick: () => onChange(option.id),
        style: {
          border: 'none', cursor: 'pointer', font: 'inherit', fontSize: '12px',
          padding: '3px 10px', borderRadius: '6px',
          background: option.id === value ? 'var(--dsw-alias-bg-layer-1, #fff)' : 'transparent',
          color: option.id === value ? 'var(--dsw-alias-label-primary, currentColor)' : faint,
          boxShadow: option.id === value ? '0 1px 2px rgba(0,0,0,.12)' : 'none',
        },
      }, option.label)));
    }

    /** Central panel: per-Session or per-Workspace token usage. */
    function UsagePanel(props) {
      const { openSession } = props;
      const feed = useUsageFeed();
      const [scope, setScope] = React.useState('all');
      const [grouping, setGrouping] = React.useState('session');

      const muted = 'var(--dsw-alias-label-secondary, #8A8F98)';
      const faint = 'var(--dsw-alias-label-tertiary, #9AA0A6)';
      const data = feed.data;
      const sessions = (data && data.sessions) || [];
      const totals = (data && data.totals) || { total: 0, output: 0, sessions: 0, todayTotal: 0, todayOutput: 0 };

      const metric = (row) => (scope === 'today' ? row.todayTotal || 0 : row.total || 0);
      const outputOf = (row) => (scope === 'today' ? row.todayOutput || 0 : row.output || 0);
      const turnsOf = (row) => (scope === 'today' ? row.todayTurns || 0 : row.turns || 0);

      let rows = sessions
        .map((row) => ({
          id: row.id,
          title: row.title || row.id,
          subtitle: basenameOf(row.cwd) || row.workspace,
          value: metric(row),
          output: outputOf(row),
          turns: turnsOf(row),
          cacheRead: row.cacheRead || 0,
          total: row.total || 0,
          lastTime: row.lastTime,
          count: 1,
          cwd: row.cwd,
        }))
        .filter((row) => (scope === 'today' ? row.value > 0 : true));

      if (grouping === 'workspace') {
        const groups = new Map();
        for (const row of rows) {
          const key = row.subtitle || row.id;
          const current = groups.get(key) || {
            id: key, title: key, subtitle: '', value: 0, output: 0, turns: 0,
            cacheRead: 0, total: 0, lastTime: 0, count: 0,
          };
          current.value += row.value;
          current.output += row.output;
          current.turns += row.turns;
          current.cacheRead += row.cacheRead;
          current.total += row.total;
          current.count += 1;
          current.lastTime = Math.max(current.lastTime || 0, row.lastTime || 0);
          groups.set(key, current);
        }
        rows = Array.from(groups.values());
      }

      rows.sort((a, b) => b.value - a.value);

      const totalValue = scope === 'today' ? totals.todayTotal : totals.total;
      const totalOutput = scope === 'today' ? totals.todayOutput : totals.output;

      const exportCsv = () => {
        try {
          const link = document.createElement('a');
          link.href = '/yg-usage.json?format=csv';
          link.download = `yg-usage-${new Date().toISOString().slice(0, 10)}.csv`;
          document.body.appendChild(link);
          link.click();
          link.remove();
        } catch {}
      };

      const headerNode = h('div', { style: { marginBottom: '14px' } },
        h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' } },
          h('span', { style: { fontSize: '18px', fontWeight: 600 } }, '用量'),
          h('span', { style: { fontSize: '12px', color: faint } },
            `${totals.sessions} 个会话 · ${scope === 'today' ? '今日' : '累计'} ${compactTokens(totalValue)} tok · 输出 ${compactTokens(totalOutput)} tok`),
          h('span', { style: { flex: 1 } }),
          h(Segmented, {
            options: [{ id: 'all', label: '累计' }, { id: 'today', label: '今日' }],
            value: scope, onChange: setScope, faint,
          }),
          h(Segmented, {
            options: [{ id: 'session', label: '按会话' }, { id: 'workspace', label: '按工作区' }],
            value: grouping, onChange: setGrouping, faint,
          }),
          h('button', {
            type: 'button',
            onClick: exportCsv,
            style: {
              border: '1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.1))',
              background: 'var(--dsw-alias-bg-layer-1, rgba(255,255,255,.6))',
              color: 'inherit', font: 'inherit', fontSize: '12px',
              padding: '4px 10px', borderRadius: '8px', cursor: 'pointer',
            },
          }, '导出 CSV')),
        h('div', { style: { fontSize: '12px', color: faint, marginTop: '6px' } },
          feed.phase === 'error'
            ? `读取失败：${feed.error && feed.error.message ? feed.error.message : '未知错误'}`
            : '来自本地会话日志，60 秒自动刷新；点一行打开对应会话。'));

      const rowNodes = rows.map((row) => {
        const cacheHit = row.total > 0 ? Math.round((row.cacheRead / row.total) * 100) : 0;
        return h('button', {
          key: row.id,
          type: 'button',
          onClick: () => {
            try {
              if (grouping === 'session' && openSession) openSession(row.id);
            } catch {}
          },
          title: row.cwd || row.id,
          style: {
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto auto auto',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
            padding: '10px 14px',
            textAlign: 'left',
            border: '1px solid var(--dsw-alias-border-l1, rgba(0,0,0,.08))',
            borderRadius: '12px',
            background: 'var(--dsw-alias-bg-layer-1, rgba(255,255,255,.6))',
            color: 'inherit',
            cursor: grouping === 'session' ? 'pointer' : 'default',
            font: 'inherit',
          },
        },
          h('div', { style: { minWidth: 0 } },
            h('div', {
              style: { fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
            }, row.title),
            h('div', {
              style: { fontSize: '12px', color: faint, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
            }, grouping === 'workspace' ? `${row.count} 个会话` : row.subtitle)),
          h('div', { style: { fontSize: '12px', color: faint, whiteSpace: 'nowrap', textAlign: 'right' } },
            `缓存 ${cacheHit}%`,
            h('div', null, `${row.turns} 轮`)),
          h('div', { style: { fontSize: '13px', color: muted, whiteSpace: 'nowrap', textAlign: 'right', minWidth: '74px' } },
            `${compactTokens(row.value)} tok`,
            h('div', { style: { fontSize: '12px', color: faint } }, `输出 ${compactTokens(row.output)}`)),
          h('div', {
            style: { fontSize: '12px', color: faint, whiteSpace: 'nowrap', minWidth: '64px', textAlign: 'right' },
          }, relativeTime(row.lastTime)));
      });

      const bodyNode = !data && feed.phase === 'loading'
        ? h('div', { style: { color: muted, fontSize: '13px' } }, '正在读取会话日志…')
        : rows.length === 0
          ? h('div', {
            style: {
              border: '1px dashed var(--dsw-alias-border-l2, rgba(0,0,0,.12))',
              borderRadius: '12px', padding: '28px', textAlign: 'center', color: muted,
            },
          }, scope === 'today' ? '今天还没有用量记录。' : '日志里还没有可统计的用量记录。')
          : h('div', { style: { display: 'flex', flexDirection: 'column', gap: '6px' } }, rowNodes);

      return h('div', {
        style: {
          height: '100%', overflowY: 'auto', padding: '28px 32px 40px',
          color: 'var(--dsw-alias-label-primary, currentColor)', fontSize: '14px',
        },
      }, h('div', { style: { maxWidth: '880px', margin: '0 auto' } }, headerNode, bodyNode));
    }


    /** Session-row badge: this Session's total tokens, coloured by magnitude. */
    function SessionTokens({ sessionId }) {
      const feed = useUsageFeed();
      const row = feed.rows.get(sessionId);
      if (!row || !row.total) return null;
      const strong = row.total >= 50_000_000;
      const medium = row.total >= 5_000_000;
      return h('span', {
        title: `累计 ${row.total.toLocaleString()} tok`,
        style: {
          marginLeft: '6px',
          fontSize: '11px',
          fontVariantNumeric: 'tabular-nums',
          whiteSpace: 'nowrap',
          color: strong
            ? 'var(--dsw-alias-state-warn-primary, #E0851F)'
            : medium
              ? 'var(--dsw-alias-label-secondary, #8A8F98)'
              : 'var(--dsw-alias-label-tertiary, #9AA0A6)',
        },
      }, compactTokens(row.total));
    }

    //__USAGE_BLOCK__

    return {
      inject: ['slots'],
      apply(ctx) {
        try {
          let theme;
          let disposeLayer;
          let current = DEFAULT_SKIN;

          const paint = () => {
            if (!theme || typeof theme.overrideTokens !== 'function') return false;
            if (typeof disposeLayer === 'function') disposeLayer();
            disposeLayer = theme.overrideTokens(SOURCE, SKINS[current]);
            return true;
          };

          const use = (name) => {
            if (!SKINS[name]) throw new Error(`unknown sidebar skin "${name}"; available: ${Object.keys(SKINS).join(', ')}`);
            current = name;
            return paint();
          };

          ctx.inject(['theme'], (scoped) => {
            theme = scoped.theme;
            scoped.effect(() => {
              paint();
              return () => {
                if (typeof disposeLayer === 'function') disposeLayer();
                disposeLayer = undefined;
              };
            }, 'yg-sidebar-studio: skin layer');
          });

          if (typeof window !== 'undefined') {
            const previous = window.__YG_SIDEBAR_SKIN__ || {};
            window.__YG_SIDEBAR_SKIN__ = Object.assign({}, previous, {
              list: () => Object.keys(SKINS),
              current: () => current,
              use,
            });
          }

          const safeInject = (key, options, component, tag) => {
            try {
              ctx.slots.inject(key, () => ctx.slots.register(options, component));
            } catch (error) {
              const list = window.__YG_SLOT_ERRORS__ || (window.__YG_SLOT_ERRORS__ = []);
              list.push(`${tag}: ${error && error.message ? error.message : String(error)}`);
            }
          };

          // `backdrop-filter` on the sidebar root turns it into the containing block
          // for `position: fixed` descendants, which drags the Windows titlebar toggle
          // out of view. Keep the blur on a leaf pseudo-element instead.
          try {
            const STYLE_FIX_ID = 'yg-sidebar-glass-fix';
            const FIX_CSS = [
              // Paint the translucent fill ONCE, on the pseudo-element, so the blur and
              // the colour are not composited twice (that read as "no longer transparent").
              '.wtg9ga_root{position:relative;isolation:isolate;background:transparent !important;',
              'backdrop-filter:none !important;-webkit-backdrop-filter:none !important}',
              '.wtg9ga_root::before{content:"";position:absolute;inset:0;z-index:-1;pointer-events:none;',
              'border-radius:inherit;background:var(--dsw-specific-sidebar-fill);',
              'backdrop-filter:blur(22px) saturate(160%);-webkit-backdrop-filter:blur(22px) saturate(160%)}',
            ].join('');
            const installFix = () => {
              if (!document.head || document.getElementById(STYLE_FIX_ID)) return;
              const node = document.createElement('style');
              node.id = STYLE_FIX_ID;
              node.textContent = FIX_CSS;
              document.head.appendChild(node);
            };
            installFix();
            ctx.effect(() => {
              installFix();
              return () => {
                const node = document.getElementById(STYLE_FIX_ID);
                if (node) node.remove();
              };
            }, 'yg-sidebar-studio: glass fix');
          } catch {}

          safeInject('shell.overlay', {
            name: 'shell.overlay',
            id: 'yg.activity-pill',
            order: 900,
            label: () => '会话活动',
          }, ActivityPill, 'overlay');

          safeInject('sidebar.workspaces.session.row.action', {
            name: 'sidebar.workspaces.session.row.action',
            id: 'yg.copy-session-id',
            order: 300,
            label: () => '复制会话 ID',
          }, CopySessionId, 'row-action');

          safeInject('sidebar.session.row.trailing', {
            name: 'sidebar.session.row.trailing',
            id: 'yg.session-tokens',
            order: 50,
            label: () => '会话用量',
          }, SessionTokens, 'row-tokens');

          safeInject('sidebar.toggle.badge', {
            name: 'sidebar.toggle.badge',
          }, PendingBadge, 'badge');

          // Usage panel: one sidebar entry + its central panel, sharing the id.
          try {
            const uiWorkspace = ctx.get('uiWorkspace');
            const injected = {
              openSession: uiWorkspace && typeof uiWorkspace.openSession === 'function'
                ? (id) => uiWorkspace.openSession(id) : undefined,
            };
            safeInject('main', {
              name: 'main',
              key: 'yg-usage',
              inject: () => injected,
            }, UsagePanel, 'usage-panel');
            safeInject('sidebar.panellist', {
              name: 'sidebar.panellist',
              id: 'yg-usage',
              order: 30,
              label: () => '用量',
            }, UsageIcon, 'usage-entry');
          } catch (error) {
            const list = window.__YG_SLOT_ERRORS__ || (window.__YG_SLOT_ERRORS__ = []);
            list.push(`usage: ${error && error.message ? error.message : String(error)}`);
          }

          window.__YG_CLIENT_APPLY__ = 'ok';
        } catch (error) {
          window.__YG_CLIENT_APPLY__ = `failed: ${error && error.message ? error.message : String(error)}`;
          throw error;
        }
      },
    };
  },
});
