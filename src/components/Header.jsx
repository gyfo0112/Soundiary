// ---------------------------------------------------------------------------
// Soundiary · Header
// ---------------------------------------------------------------------------
import { glass, useHover, Icon } from '../ui.jsx';
import { genreGradient } from '../data.js';

function StatCard({ value, label, sub }) {
  return (
    <div style={{
      ...glass({ radius: 20 }),
      flex: 1, minWidth: 0, padding: '16px 16px 15px',
      display: 'flex', flexDirection: 'column', gap: 3,
    }}>
      <div style={{ fontFamily: 'var(--font-en)', fontSize: 27, fontWeight: 700, lineHeight: 1.05, color: 'var(--text-1)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-3)', letterSpacing: '0.01em' }}>{label}</div>
      {sub && <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-3)', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function AddButton({ onClick }) {
  const [hovered, active, bind] = useHover();
  return (
    <button {...bind} onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 8,
      height: 46, padding: '0 20px 0 16px', borderRadius: 999,
      fontSize: 14.5, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', whiteSpace: 'nowrap',
      background: hovered ? 'linear-gradient(135deg, #ff9ad6, #968bff 55%, #76dcff)' : 'linear-gradient(135deg, #ff8fcf, #8a7bff 55%, #66d6ff)',
      border: '1px solid rgba(255,255,255,0.6)', borderTop: '1px solid rgba(255,255,255,0.9)',
      backdropFilter: 'blur(18px) saturate(180%)', WebkitBackdropFilter: 'blur(18px) saturate(180%)',
      boxShadow: active ? 'inset 0 2px 8px rgba(60,30,120,0.35)' : '0 12px 30px -8px rgba(140,80,220,0.5), inset 0 1px 1px rgba(255,255,255,0.7)',
      transform: active ? 'scale(0.96)' : hovered ? 'scale(1.03)' : 'scale(1)',
      transition: 'all .18s cubic-bezier(.2,.8,.2,1)', flexShrink: 0,
    }}>
      <Icon name='plus' size={18} strokeWidth={2.4} color='#fff' />
      기록
    </button>
  );
}

export default function Header({ stats, onAdd, darkMode, onToggleDark }) {
  return (
    <header style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 15, display: 'grid', placeItems: 'center',
            background: 'linear-gradient(150deg, #ff8fcf, #8a7bff 55%, #66d6ff)',
            border: '1px solid rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.85)',
            boxShadow: '0 10px 26px -8px rgba(150,60,200,0.6), inset 0 1px 2px rgba(255,255,255,0.6)',
          }}>
            <Icon name='disc' size={24} color='#fff' strokeWidth={1.9} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-en)', fontSize: 27, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-1)', lineHeight: 1 }}>Soundiary</h1>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)', marginTop: 4, letterSpacing: '0.01em' }}>오늘 들은 음악을 기록하는 곳</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onToggleDark} style={{
            width: 40, height: 40, borderRadius: '50%', display: 'grid', placeItems: 'center',
            background: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
            border: '1px solid rgba(255,255,255,0.3)', fontSize: 18, cursor: 'pointer', transition: 'all .2s ease',
          }}>{darkMode ? '☀️' : '🌙'}</button>
          <AddButton onClick={onAdd} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <StatCard value={stats.total} label='기록한 곡' />
        <StatCard value={stats.avg} label='평균 평점' sub='★ 5점 만점' />
        <StatCard value={stats.topGenre || '—'} label='최다 장르' />
      </div>
    </header>
  );
}