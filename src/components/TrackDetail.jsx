// ---------------------------------------------------------------------------
// Soundiary · TrackDetail — 곡 상세 모달 (다크모드 대응)
// ---------------------------------------------------------------------------
import { useEffect } from 'react';
import { useAudio } from '../context/AudioContext.jsx';
import { glass, StarRating, Icon } from '../ui.jsx';
import { genreGradient, genreGlow, fmtDate } from '../data.js';
import ShareCardButton from './ShareCard.jsx';

export default function TrackDetail({ track, onClose, onEdit, onDelete }) {
  const glow = genreGlow(track.genre);
  const isDark = document.body.classList.contains('dark');
  const { playingId, toggle, progress, currentTime, duration, fmt } = useAudio();
  const playing = playingId === track.id;

  const togglePlay = () => {
    toggle(track);
  };

  useEffect(() => {
    document.body.classList.add('modal-open');
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKey);  };
  }, []);

  return (
    <div
      onMouseDown={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px 16px',
        background: 'rgba(60,60,90,0.32)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        animation: 'sd-fade .22s ease',
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 460,
          background: isDark ? 'rgba(22,22,36,0.97)' : 'rgba(255,255,255,0.95)',
          borderRadius: 30,
          border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)',
          boxShadow: isDark
            ? '0 44px 96px -28px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.08)'
            : '0 44px 96px -28px rgba(40,40,80,0.45), inset 0 1px 1px rgba(255,255,255,0.95)',
          animation: 'sd-pop .26s cubic-bezier(.2,.9,.25,1.1)',
          overflow: 'hidden',
        }}
      >
        {/* 앨범 커버 상단 */}
        {track.artworkUrl ? (
          <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
            <img src={track.artworkUrl} alt={track.album} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(2px) brightness(0.85)', transform: 'scale(1.05)' }} />
            <img src={track.artworkUrl} alt={track.album} style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 130, height: 130, borderRadius: 20, objectFit: 'cover',
              boxShadow: '0 20px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.3)',
            }} />
            <button onClick={onClose} style={{
              position: 'absolute', top: 14, right: 14,
              display: 'grid', placeItems: 'center',
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)', cursor: 'pointer',
            }}>
              <Icon name='close' size={15} color='#fff' />
            </button>
            <ShareCardButton track={track} isDark={isDark} position='overlay' />
          </div>
        ) : (
          <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', background: genreGradient(track.genre, 135), position: 'relative' }}>
            <Icon name='disc' size={60} color='rgba(255,255,255,0.6)' strokeWidth={1.2} />
            <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, display: 'grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer' }}>
              <Icon name='close' size={15} color='#fff' />
            </button>
          </div>
        )}

        {/* 본문 */}
        <div style={{ padding: '22px 24px 26px' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-1)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
              {track.title}
            </div>
            <div style={{ fontSize: 14.5, color: 'var(--text-2)', marginTop: 5, fontWeight: 500 }}>
              {track.artist}
              {track.album && <span style={{ color: 'var(--text-3)' }}> · {track.album}</span>}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, color: '#fff', background: genreGradient(track.genre, 135), boxShadow: '0 4px 12px -3px ' + glow }}>{track.genre}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', height: 26, padding: '0 12px', borderRadius: 999, fontSize: 12, fontWeight: 600, color: 'var(--text-2)', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.07)' }}>{track.mood}</span>
            <StarRating value={track.rating} size={16} readOnly />
          </div>

          {track.memo && (
            <div style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)', borderRadius: 16, border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.07)', padding: '14px 16px', marginBottom: 16 }}>
              <p style={{ fontSize: 14.5, lineHeight: 1.7, color: 'var(--text-2)', fontStyle: 'italic' }}>
                '{track.memo}'
              </p>
            </div>
          )}

          {track.previewUrl && (
            <div style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {/* 재생 버튼 */}
              <button onClick={togglePlay} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 24px', borderRadius: 999,
                background: playing ? 'linear-gradient(135deg,#f472b6,#a78bfa)' : 'linear-gradient(135deg,#a78bfa,#818cf8)',
                border: '1px solid rgba(255,255,255,0.4)',
                boxShadow: '0 8px 20px rgba(120,90,250,0.35)',
                cursor: 'pointer', transition: 'all .2s ease',
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {playing
                    ? <svg width='12' height='12' viewBox='0 0 24 24' fill='#1a1a2e'><rect x='5' y='4' width='4' height='16' rx='1.5'/><rect x='15' y='4' width='4' height='16' rx='1.5'/></svg>
                    : <svg width='12' height='12' viewBox='0 0 24 24' fill='#1a1a2e'><polygon points='6,3 20,12 6,21'/></svg>
                  }
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em' }}>
                  {playing ? '재생 중' : '30초 미리듣기'}
                </span>
              </button>

              {/* 트랙바 + 시간 */}
              <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ position: 'relative', height: 5, borderRadius: 999, background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 999,
                    background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                    width: progress + '%',
                    transition: 'width .1s linear',
                    boxShadow: '0 0 8px rgba(167,139,250,0.5)',
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-3)', fontFamily: 'var(--font-en)', fontWeight: 500 }}>
                  <span>{fmt(currentTime)}</span>
                  <span>{fmt(duration)}</span>
                </div>
              </div>
            </div>
          )}

          <div style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-3)', marginBottom: 20, letterSpacing: '0.02em' }}>
            {fmtDate(track.date)}
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => { onDelete(track); onClose(); }} style={{
              flex: 1, height: 46, borderRadius: 14, fontSize: 14, fontWeight: 600,
              color: 'rgba(220,50,70,0.9)',
              background: isDark ? 'rgba(248,113,113,0.12)' : 'rgba(255,90,110,0.08)',
              border: isDark ? '1px solid rgba(248,113,113,0.25)' : '1px solid rgba(255,90,110,0.2)',
              cursor: 'pointer',
            }}>삭제</button>
            <button onClick={() => { onEdit(track); onClose(); }} style={{
              flex: 2, height: 46, borderRadius: 14, fontSize: 14.5, fontWeight: 700, color: '#fff',
              background: 'linear-gradient(135deg, #ff8fcf, #8a7bff 55%, #66d6ff)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 10px 28px -8px rgba(140,60,200,0.5)',
              cursor: 'pointer',
            }}>수정하기</button>
          </div>
        </div>
      </div>
    </div>
  );
}