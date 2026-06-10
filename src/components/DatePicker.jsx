// ---------------------------------------------------------------------------
// Soundiary · DatePicker — 다크모드 대응
// ---------------------------------------------------------------------------
import { useState } from 'react';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];

export default function DatePicker({ value, onChange, isDark = false }) {
  const today = new Date();
  const selected = value ? new Date(value + 'T00:00:00') : today;
  const [view, setView] = useState({ year: selected.getFullYear(), month: selected.getMonth() });
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date().toISOString().slice(0, 10));

  const firstDay = new Date(view.year, view.month, 1).getDay();
  const daysInMonth = new Date(view.year, view.month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setView(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 });
  const nextMonth = () => setView(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 });

  const handleSelect = (d) => {
    if (!d) return;
    const mm = String(view.month + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    setTempDate(view.year + '-' + mm + '-' + dd);
  };

  const isSelected = (d) => {
    if (!d || !tempDate) return false;
    const s = new Date(tempDate + 'T00:00:00');
    return s.getFullYear() === view.year && s.getMonth() === view.month && s.getDate() === d;
  };

  const isToday = (d) => {
    if (!d) return false;
    return today.getFullYear() === view.year && today.getMonth() === view.month && today.getDate() === d;
  };

  const displayValue = value
    ? new Date(value + 'T00:00:00').toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
    : '날짜 선택';

  const calBg = isDark ? 'rgba(22,22,38,0.98)' : 'rgba(255,255,255,0.97)';
  const calBorder = isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.9)';
  const navBtnStyle = {
    width: 32, height: 32, borderRadius: 10, display: 'grid', placeItems: 'center',
    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.07)',
    fontSize: 15, cursor: 'pointer', color: 'var(--text-2)',
  };

  return (
    <>
      <button type='button' onClick={() => setOpen(true)} style={{
        width: '100%', height: 46, padding: '0 15px', borderRadius: 14,
        fontSize: 14.5, fontWeight: 500,
        color: value ? 'var(--text-1)' : 'var(--text-3)',
        background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.035)',
        border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)',
        textAlign: 'left', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span>{displayValue}</span>
        <span style={{ fontSize: 14 }}>📅</span>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(60,60,90,0.25)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
          onMouseDown={() => setOpen(false)}
        >
          <div
            style={{ width: 300, borderRadius: 24, padding: 20, background: calBg, border: calBorder, boxShadow: isDark ? '0 24px 56px -12px rgba(0,0,0,0.7)' : '0 24px 56px -12px rgba(70,50,130,0.25)' }}
            onMouseDown={e => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <button type='button' onClick={prevMonth} style={navBtnStyle}>‹</button>
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>
                {view.year}년 {MONTHS[view.month]}
              </span>
              <button type='button' onClick={nextMonth} style={navBtnStyle}>›</button>
            </div>

            {/* 요일 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 8 }}>
              {DAYS.map((d, i) => (
                <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 700, color: i === 0 ? '#f87171' : i === 6 ? '#60a5fa' : 'var(--text-3)', padding: '4px 0' }}>{d}</div>
              ))}
            </div>

            {/* 날짜 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
              {cells.map((d, i) => {
                const col = i % 7;
                const sel = isSelected(d);
                const tod = isToday(d);
                return (
                  <button key={i} type='button' onClick={() => handleSelect(d)} style={{
                    height: 36, borderRadius: 10, fontSize: 13,
                    fontWeight: sel ? 700 : tod ? 600 : 400,
                    display: 'grid', placeItems: 'center',
                    cursor: d ? 'pointer' : 'default',
                    background: sel ? 'linear-gradient(135deg,#a78bfa,#818cf8)' : tod ? (isDark ? 'rgba(167,139,250,0.2)' : 'rgba(120,90,250,0.1)') : 'transparent',
                    color: sel ? '#fff' : col === 0 ? '#f87171' : col === 6 ? '#60a5fa' : 'var(--text-1)',
                    border: tod && !sel ? '1px solid rgba(120,90,250,0.4)' : '1px solid transparent',
                    opacity: d ? 1 : 0,
                    pointerEvents: d ? 'auto' : 'none',
                    transition: 'all .12s ease',
                  }}
                    onMouseEnter={e => { if (d && !sel) e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'; }}
                    onMouseLeave={e => { if (d && !sel) e.currentTarget.style.background = tod ? (isDark ? 'rgba(167,139,250,0.2)' : 'rgba(120,90,250,0.1)') : 'transparent'; }}
                  >
                    {d || ''}
                  </button>
                );
              })}
            </div>

            {/* 하단 버튼 */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button type='button' onClick={() => { const t = new Date(); onChange(t.toISOString().slice(0, 10)); setView({ year: t.getFullYear(), month: t.getMonth() }); setOpen(false); }} style={{
                flex: 1, height: 38, borderRadius: 12,
                fontSize: 13, fontWeight: 600,
                color: isDark ? 'rgba(180,150,255,0.9)' : 'rgba(120,90,250,0.9)',
                background: isDark ? 'rgba(167,139,250,0.15)' : 'rgba(120,90,250,0.08)',
                border: isDark ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(120,90,250,0.2)',
                cursor: 'pointer',
              }}>오늘</button>
              <button type='button' onClick={() => setOpen(false)} style={{
                flex: 1, height: 38, borderRadius: 12,
                fontSize: 13, fontWeight: 700,
                color: '#fff',
                background: 'linear-gradient(135deg,#a78bfa,#818cf8)',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 4px 12px rgba(120,90,250,0.3)',
                cursor: 'pointer',
              }}>확인</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}