// ---------------------------------------------------------------------------
// Soundiary · TrackItem — 미리듣기 기능
// ---------------------------------------------------------------------------
import { useState, useEffect } from 'react';
import { useAudio } from '../context/AudioContext.jsx';
import { glass, useHover, StarRating, Icon } from '../ui.jsx';
import { genreGradient, genreGlow, fmtDate } from '../data.js';

function IconBtn({ icon, label, onClick, danger, isDark = false }) {
  const [hovered, , bind] = useHover();
  const baseBg = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.035)';
  const hoverBg = danger ? 'rgba(248,113,113,0.25)' : (isDark ? 'rgba(255,255,255,0.22)' : 'rgba(0,0,0,0.08)');
  const iconColor = hovered && danger ? '#f87171' : (isDark ? 'rgba(242,242,247,0.9)' : 'rgba(28,28,30,0.6)');
  return (
    <button {...bind} onClick={onClick} aria-label={label} style={{
      display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 11,
      background: hovered ? hoverBg : baseBg,
      border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.07)',
      borderTop: isDark ? '1px solid rgba(255,255,255,0.22)' : '1px solid rgba(255,255,255,0.9)',
      boxShadow: isDark ? 'none' : 'inset 0 1px 1px rgba(255,255,255,0.7)',
      transition: 'all .16s ease', flexShrink: 0,
    }}>
      <Icon name={icon} size={15.5} color={iconColor} strokeWidth={1.9} />
    </button>
  );
}

function useArtworkColor(artworkUrl) {
  const [color, setColor] = useState(null);
  useEffect(() => {
    if (!artworkUrl) { setColor(null); return; }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = artworkUrl;
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 10; canvas.height = 10;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, 10, 10);
        const d = ctx.getImageData(0, 0, 10, 10).data;
        let r = 0, g = 0, b = 0, count = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i+1]; b += d[i+2]; count++; }
        setColor(Math.round(r/count) + ', ' + Math.round(g/count) + ', ' + Math.round(b/count));
      } catch(e) { setColor(null); }
    };
  }, [artworkUrl]);
  return color;
}

export default function TrackItem({ track, onEdit, onDelete, onDetail, darkMode: isDark = false }) {
  const [hovered, , bind] = useHover();
  const { playingId, progress, toggle } = useAudio();
  const playing = playingId === track.id;
  const glow = genreGlow(track.genre);
  const artworkColor = useArtworkColor(track.artworkUrl);

  const borderColor = hovered
    ? (artworkColor ? 'rgba(' + artworkColor + ', 0.6)' : glow + '88')
    : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.85)');

  const shadowVal = hovered
    ? (artworkColor ? '0 26px 56px -18px rgba(' + artworkColor + ', 0.35)' : '0 26px 56px -18px ' + glow + '55')
    : (isDark ? '0 8px 24px -8px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05)' : '0 18px 44px -18px rgba(70,70,110,0.26), inset 0 1px 1px rgba(255,255,255,0.9)');

  const togglePlay = (e) => {
    e.stopPropagation();
    toggle(track);
  };

  return (
    <div
      {...bind}
      onClick={() => onDetail && onDetail(track)}
      style={{
        ...glass({ radius: 24 }),
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'stretch',
        borderTop: '1.5px solid ' + borderColor,
        borderRight: '1px solid ' + (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)'),
        borderBottom: '1px solid ' + (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)'),
        borderLeft: '1px solid ' + (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)'),
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: shadowVal,
        transition: 'transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .22s ease, border-color .3s ease',
        cursor: 'pointer',
      }}
    >
      {playing && (
        <div style={{ position: 'absolute', top: 0, left: 0, height: 3, width: progress + '%', background: genreGradient(track.genre, 90), boxShadow: '0 0 8px ' + glow + 'aa', transition: 'width .1s linear' }} />
      )}

      {track.artworkUrl ? (
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', padding: '14px 0 14px 14px' }} className='track-artwork-wrap'>
          <div style={{ position: 'relative' }}>
            <img src={track.artworkUrl} alt={track.album} className='track-artwork' style={{
              width: 80, height: 80, objectFit: 'cover', borderRadius: 12, display: 'block',
              boxShadow: artworkColor && hovered ? '0 8px 24px rgba(' + artworkColor + ', 0.5)' : '0 4px 12px rgba(0,0,0,0.2)',
            }} />
            {track.previewUrl && (
              <button onClick={togglePlay} style={{
                position: 'absolute', inset: 0, borderRadius: 12,
                background: playing ? 'rgba(0,0,0,0.5)' : (hovered ? 'rgba(0,0,0,0.38)' : 'transparent'),
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all .2s ease', border: 'none', cursor: 'pointer',
                opacity: hovered || playing ? 1 : 0,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.95)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                  transition: 'transform .15s ease',
                  transform: hovered ? 'scale(1.08)' : 'scale(1)',
                }}>
                  {playing
                    ? <svg width='14' height='14' viewBox='0 0 24 24' fill='#1a1a2e'><rect x='5' y='4' width='4' height='16' rx='1.5'/><rect x='15' y='4' width='4' height='16' rx='1.5'/></svg>
                    : <svg width='14' height='14' viewBox='0 0 24 24' fill='#1a1a2e'><polygon points='6,3 20,12 6,21'/></svg>
                  }
                </div>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div style={{ width: 6, flexShrink: 0, borderRadius: 999, margin: '2px 0', background: genreGradient(track.genre, 180), boxShadow: '0 0 16px ' + glow + 'cc' }} />
      )}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 9, padding: '16px 18px' }} className='track-body'>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className='track-title' style={{ fontSize: 17.5, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {track.title}
            </div>
            <div style={{ marginTop: 2, fontSize: 13.5, fontWeight: 500, color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {track.artist}
              {track.album ? <span style={{ color: 'var(--text-3)' }}>{'  ·  ' + track.album}</span> : null}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6, flexShrink: 0, opacity: hovered ? 1 : (isDark ? 0.7 : 0.45), transition: 'opacity .18s ease' }} onClick={e => e.stopPropagation()}>
            {track.previewUrl && !track.artworkUrl && (
              <button onClick={togglePlay} style={{
                display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: 11, fontSize: 14,
                background: playing ? 'rgba(120,90,250,0.2)' : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.035)'),
                border: isDark ? '1px solid rgba(255,255,255,0.18)' : '1px solid rgba(0,0,0,0.07)',
                cursor: 'pointer', transition: 'all .16s ease', flexShrink: 0,
              }}>{playing ? '⏸' : '▶'}</button>
            )}
            <IconBtn icon='edit' label='수정' onClick={(e) => { e.stopPropagation(); onEdit(track); }} isDark={isDark} />
            <IconBtn icon='trash' label='삭제' danger onClick={(e) => { e.stopPropagation(); onDelete(track); }} isDark={isDark} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 700, color: '#fff', background: genreGradient(track.genre, 135), boxShadow: '0 4px 12px -3px ' + glow }}>{track.genre}</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 11px', borderRadius: 999, fontSize: 11.5, fontWeight: 600, color: 'var(--text-2)', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.07)' }}>{track.mood}</span>
          <div style={{ marginLeft: 'auto' }}><StarRating value={track.rating} size={14} readOnly /></div>
        </div>

        {track.memo && <p style={{ fontSize: 13.5, lineHeight: 1.62, color: 'var(--text-2)', marginTop: 2 }}>{track.memo}</p>}

        <span style={{ fontFamily: 'var(--font-en)', fontSize: 11.5, fontWeight: 500, color: 'var(--text-3)', letterSpacing: '0.02em', marginTop: 1 }}>
          {fmtDate(track.date)}
        </span>
      </div>
      
    </div>
  );
}