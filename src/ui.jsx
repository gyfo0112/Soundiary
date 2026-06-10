import { useState } from 'react';

export function glass({ radius = 24, blur = 32 } = {}) {
  return {
    background: 'var(--glass-bg, rgba(255,255,255,0.78))',
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    borderTop: '1px solid var(--glass-border-top, rgba(255,255,255,1))',
    borderRight: '1px solid var(--glass-border, rgba(255,255,255,0.8))',
    borderBottom: '1px solid var(--glass-border, rgba(255,255,255,0.8))',
    borderLeft: '1px solid var(--glass-border, rgba(255,255,255,0.8))',
    borderRadius: radius,
    boxShadow: 'var(--glass-shadow, 0 18px 44px -18px rgba(70,70,110,0.28), inset 0 1px 1px rgba(255,255,255,0.9))',
  };
}

export function useHover() {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);
  const bind = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => { setHovered(false); setActive(false); },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false),
    onTouchStart: () => setActive(true),
    onTouchEnd: () => setActive(false),
  };
  return [hovered, active, bind];
}

export function StarRating({ value = 0, onChange, size = 16, gap = 2, readOnly = false }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: 'inline-flex', gap, lineHeight: 1 }}>
      {[1,2,3,4,5].map((n) => {
        const filled = (hover || value) >= n;
        return (
          <span key={n}
            onClick={readOnly ? undefined : () => onChange && onChange(n)}
            onMouseEnter={readOnly ? undefined : () => setHover(n)}
            onMouseLeave={readOnly ? undefined : () => setHover(0)}
            style={{
              fontSize: size, cursor: readOnly ? 'default' : 'pointer',
              color: filled ? '#ffb300' : 'rgba(28,28,30,0.2)',
              textShadow: filled ? '0 0 8px rgba(255,179,0,0.45)' : 'none',
              transition: 'transform .12s ease, color .12s ease',
              transform: !readOnly && hover === n ? 'scale(1.25)' : 'scale(1)',
              userSelect: 'none',
            }}
          >{filled ? '★' : '☆'}</span>
        );
      })}
    </div>
  );
}

export function Chip({ label, active, onClick, accent, isDark = false, style }) {
  const [hovered, , bind] = useHover();
  const inactiveBg = isDark
    ? (hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.08)')
    : (hovered ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)');
  const inactiveBorder = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.07)';
  const inactiveBorderTop = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.95)';

  return (
    <button {...bind} onClick={onClick} style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '7px 14px', borderRadius: 999, fontSize: 13,
      fontWeight: active ? 600 : 500, letterSpacing: '-0.01em', whiteSpace: 'nowrap',
      color: active ? '#fff' : 'var(--text-2)',
      background: active ? (accent || 'rgba(28,28,30,0.85)') : inactiveBg,
      border: active ? '1px solid rgba(255,255,255,0.5)' : `1px solid ${inactiveBorder}`,
      borderTop: active ? '1px solid rgba(255,255,255,0.7)' : `1px solid ${inactiveBorderTop}`,
      boxShadow: active
        ? '0 7px 18px -6px rgba(70,50,130,0.4), inset 0 1px 1px rgba(255,255,255,0.45)'
        : (isDark ? 'none' : '0 1px 2px rgba(0,0,0,0.04)'),
      backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
      transition: 'all .18s ease', ...style,
    }}>{label}</button>
  );
}

export function Icon({ name, size = 18, color = 'currentColor', strokeWidth = 1.8, style }) {
  const common = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', style };
  const paths = {
    plus: <><line x1='12' y1='5' x2='12' y2='19' /><line x1='5' y1='12' x2='19' y2='12' /></>,
    search: <><circle cx='11' cy='11' r='7' /><line x1='21' y1='21' x2='16.65' y2='16.65' /></>,
    close: <><line x1='18' y1='6' x2='6' y2='18' /><line x1='6' y1='6' x2='18' y2='18' /></>,
    edit: <><path d='M12 20h9' /><path d='M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z' /></>,
    trash: <><polyline points='3 6 5 6 21 6' /><path d='M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' /></>,
    note: <><path d='M4 4h16v12l-4 4H4z' /><path d='M16 20v-4h4' /></>,
    sliders: <><line x1='4' y1='7' x2='20' y2='7' /><line x1='4' y1='17' x2='20' y2='17' /><circle cx='9' cy='7' r='2.4' /><circle cx='15' cy='17' r='2.4' /></>,
    chevron: <polyline points='6 9 12 15 18 9' />,
    music: <><path d='M9 18V5l12-2v13' /><circle cx='6' cy='18' r='3' /><circle cx='18' cy='16' r='3' /></>,
    star: <polygon points='12 2 15 9 22 9.3 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9.3 9 9' />,
    disc: <><circle cx='12' cy='12' r='9' /><circle cx='12' cy='12' r='2.5' /></>,
  };
  return <svg {...common}>{paths[name] || null}</svg>;
}