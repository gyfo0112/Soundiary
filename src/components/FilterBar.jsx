// ---------------------------------------------------------------------------
// Soundiary · FilterBar — 다크모드 대응
// ---------------------------------------------------------------------------
import { useState, useEffect, useRef } from 'react';
import { GENRES, MOODS, genreGradient } from '../data.js';
import { Chip, Icon } from '../ui.jsx';

export const SORTS = [
  { key: 'date_desc', label: '최신순' },
  { key: 'date_asc', label: '오래된순' },
  { key: 'rating_desc', label: '평점 높은순' },
  { key: 'title_asc', label: '제목순' },
];

export default function FilterBar({ genre, mood, sort, onGenre, onMood, onSort, count, darkMode: isDark = false }) {
  const [openSort, setOpenSort] = useState(false);
  const wrapRef = useRef(null);
  

  useEffect(() => {
    const close = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpenSort(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const activeSort = SORTS.find((s) => s.key === sort) || SORTS[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 상단 row: 곡 수 + 정렬 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🎵</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-2)', letterSpacing: '0.02em' }}>
            {count}곡
          </span>
        </div>

        <div ref={wrapRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setOpenSort(v => !v)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '8px 14px', borderRadius: 999,
              fontSize: 13, fontWeight: 600, color: 'var(--text-1)', whiteSpace: 'nowrap',
              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)',
              border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.07)',
              borderTop: isDark ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.95)',
              backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
              boxShadow: isDark ? 'none' : '0 2px 6px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.85)',
            }}
          >
            {activeSort.label}
            <Icon name='chevron' size={14} color='var(--text-3)'
              style={{ transform: openSort ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }} />
          </button>

          {openSort && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 30,
              minWidth: 156, padding: 6, borderRadius: 18,
              background: isDark ? 'rgba(28,28,44,0.96)' : 'rgba(255,255,255,0.95)',
              border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.06)',
              borderTop: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,1)',
              backdropFilter: 'blur(30px) saturate(180%)', WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 22px 46px -14px rgba(60,50,110,0.25)',
            }}>
              {SORTS.map((s) => (
                <button key={s.key} onClick={() => { onSort(s.key); setOpenSort(false); }} style={{
                  display: 'flex', alignItems: 'center', width: '100%',
                  padding: '10px 12px', borderRadius: 12,
                  fontSize: 13.5, fontWeight: s.key === sort ? 700 : 500,
                  color: s.key === sort ? 'var(--text-1)' : 'var(--text-2)',
                  background: s.key === sort ? 'rgba(120,90,250,0.15)' : 'transparent',
                  textAlign: 'left',
                }}>{s.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 장르 칩 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Chip label="전체 장르" active={!genre} accent="linear-gradient(135deg,#3a3a44,#56566a)" onClick={() => onGenre(null)} isDark={isDark} />
        {GENRES.map((g) => (
          <Chip key={g} label={g} active={genre === g} accent={genreGradient(g, 135)} onClick={() => onGenre(genre === g ? null : g)} isDark={isDark} />
        ))}
      </div>

      {/* 무드 칩 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Chip label="전체 무드" active={!mood} accent="linear-gradient(135deg,#3a3a44,#56566a)" onClick={() => onMood(null)} isDark={isDark} />
        {MOODS.map((m) => (
          <Chip key={m} label={m} active={mood === m} accent="linear-gradient(135deg,#b9a4ff,#8db4ff)" onClick={() => onMood(mood === m ? null : m)} isDark={isDark} />
        ))}
      </div>
    </div>
  );
}