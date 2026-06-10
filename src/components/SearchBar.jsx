// ---------------------------------------------------------------------------
// Soundiary · SearchBar — 다크모드 대응
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { Icon } from '../ui.jsx';

export default function SearchBar({ value, onChange, darkMode: isDark = false }) {
  const [focused, setFocused] = useState(false);
  

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '0 18px', height: 52, borderRadius: 999,
      background: isDark
        ? (focused ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.07)')
        : (focused ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.65)'),
      border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.06)',
      borderTop: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(255,255,255,0.95)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      boxShadow: focused
        ? '0 0 0 3px rgba(120,90,250,0.2), 0 14px 34px -12px rgba(120,90,200,0.25)'
        : (isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 12px 30px -16px rgba(70,70,110,0.2)'),
      transition: 'all .2s ease',
    }}>
      <Icon name='search' size={18} color={isDark ? 'rgba(242,242,247,0.45)' : 'rgba(28,28,30,0.4)'} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder='제목, 아티스트, 앨범 검색…'
        style={{
          flex: 1, fontSize: 15, fontWeight: 500,
          color: 'var(--text-1)', letterSpacing: '-0.01em',
          background: 'transparent',
        }}
      />
      {value && (
        <button onClick={() => onChange('')} style={{
          display: 'grid', placeItems: 'center',
          width: 24, height: 24, borderRadius: '50%',
          background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)',
          border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)',
          flexShrink: 0,
        }}>
          <Icon name='close' size={12} color={isDark ? 'rgba(242,242,247,0.7)' : 'rgba(28,28,30,0.6)'} />
        </button>
      )}
    </div>
  );
}