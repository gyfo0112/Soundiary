// ---------------------------------------------------------------------------
// Soundiary · Heatmap — 기록 캘린더 (최근 16주 잔디)
// ---------------------------------------------------------------------------
import { useMemo } from 'react';

const WEEKS = 16;
const DAY_LABELS = ['', '월', '', '수', '', '금', ''];

const localISO = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');

export default function Heatmap({ tracks, isDark = false }) {
  const { weeks, monthLabels, total } = useMemo(() => {
    const counts = {};
    tracks.forEach((t) => { if (t.date) counts[t.date] = (counts[t.date] || 0) + 1; });

    const now = new Date();
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const cur = new Date(end);
    cur.setDate(cur.getDate() - end.getDay() - (WEEKS - 1) * 7); // 16주 전 일요일

    const weeks = [];
    const monthLabels = [];
    let prevMonth = -1;
    for (let w = 0; w < WEEKS; w++) {
      const m = cur.getMonth();
      monthLabels.push(m !== prevMonth ? (m + 1) + '월' : '');
      prevMonth = m;
      const col = [];
      for (let d = 0; d < 7; d++) {
        const key = localISO(cur);
        col.push({ key, count: counts[key] || 0, future: cur > end });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(col);
    }
    const total = weeks.reduce((s, col) => s + col.filter((c) => !c.future && c.count > 0).length, 0);
    return { weeks, monthLabels, total };
  }, [tracks]);

  if (!tracks.length) return null;

  const cellColor = (c, future) => {
    if (future) return 'transparent';
    if (!c) return isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)';
    if (c === 1) return 'rgba(138,123,255,0.35)';
    if (c === 2) return 'rgba(138,123,255,0.6)';
    return 'rgba(138,123,255,0.95)';
  };

  return (
    <div className='sd-banner' style={{
      background: isDark ? 'rgba(38,38,58,0.82)' : 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 20,
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
      borderTop: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,1)',
      boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(70,70,110,0.1)',
      padding: '16px 20px 14px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.02em' }}>🌱 기록 캘린더</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)' }}>최근 {WEEKS}주 · {total}일 기록</span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 2 }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', gap: 3, marginLeft: 22 }}>
            {monthLabels.map((m, i) => (
              <div key={i} style={{ width: 12, fontSize: 9, color: 'var(--text-3)', whiteSpace: 'nowrap', overflow: 'visible' }}>{m}</div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 19, flexShrink: 0 }}>
              {DAY_LABELS.map((d, i) => (
                <div key={i} style={{ height: 12, fontSize: 9, lineHeight: '12px', color: 'var(--text-3)' }}>{d}</div>
              ))}
            </div>
            {weeks.map((col, wi) => (
              <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {col.map((c) => (
                  <div
                    key={c.key}
                    title={c.future ? '' : c.key.replaceAll('-', '.') + ' · ' + c.count + '곡'}
                    style={{
                      width: 12, height: 12, borderRadius: 3.5,
                      background: cellColor(c.count, c.future),
                      boxShadow: c.count >= 3 ? '0 0 6px rgba(138,123,255,0.5)' : 'none',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 10 }}>
        <span style={{ fontSize: 10, color: 'var(--text-3)', marginRight: 2 }}>적음</span>
        {[0, 1, 2, 3].map((n) => (
          <div key={n} style={{ width: 10, height: 10, borderRadius: 3, background: cellColor(n, false) }} />
        ))}
        <span style={{ fontSize: 10, color: 'var(--text-3)', marginLeft: 2 }}>많음</span>
      </div>
    </div>
  );
}
