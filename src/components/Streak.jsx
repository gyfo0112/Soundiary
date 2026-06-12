// ---------------------------------------------------------------------------
// Soundiary · Streak — 연속 기록 스트릭
// ---------------------------------------------------------------------------
import { useMemo } from 'react';

function getStreak(tracks) {
  if (!tracks.length) return { current: 0, best: 0 };
  
  // 날짜별 기록 여부 Set
  const dates = new Set(tracks.map(t => t.date).filter(Boolean));
  
  // 오늘부터 거꾸로 연속 확인
  const today = new Date();
  let current = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    if (dates.has(key)) current++;
    else if (i > 0) break;
  }

  // 최장 스트릭
  const sortedDates = [...dates].sort();
  let best = 0, tmp = 1;
  for (let i = 1; i < sortedDates.length; i++) {
    const prev = new Date(sortedDates[i-1]);
    const curr = new Date(sortedDates[i]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) { tmp++; best = Math.max(best, tmp); }
    else tmp = 1;
  }
  best = Math.max(best, current, sortedDates.length > 0 ? 1 : 0);

  return { current, best };
}

export default function Streak({ tracks, isDark = false }) {
  const { current, best } = useMemo(() => getStreak(tracks), [tracks]);
  if (!tracks.length) return null;

  const flames = current >= 7 ? '🔥🔥🔥' : current >= 3 ? '🔥🔥' : current >= 1 ? '🔥' : '💤';

  return (
    <div style={{
      background: isDark ? 'rgba(38,38,58,0.82)' : 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 20,
      borderTop: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,1)',
      borderRight: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
      borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
      borderLeft: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
      boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(70,70,110,0.1)',
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 28 }}>{flames}</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>연속 기록</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            {current}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', marginLeft: 3 }}>일</span>
          </div>
        </div>
      </div>

      <div style={{ width: 1, height: 40, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>최장 기록</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {best}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', marginLeft: 3 }}>일</span>
        </div>
      </div>

      <div style={{ width: 1, height: 40, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }} />

      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>총 기록일</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {new Set(tracks.map(t => t.date).filter(Boolean)).size}<span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-2)', marginLeft: 3 }}>일</span>
        </div>
      </div>
    </div>
  );
}