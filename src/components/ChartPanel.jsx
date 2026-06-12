// ---------------------------------------------------------------------------
// Soundiary · ChartPanel — 애플 뮤직 인기 차트(RSS)에서 바로 기록하기
// ---------------------------------------------------------------------------
import { useState, useEffect } from 'react';

const RSS_URL = 'https://rss.marketingtools.apple.com/api/v2/kr/music/most-played/25/songs.json';
const PROXY_URL = 'https://api.allorigins.win/raw?url=' + encodeURIComponent(RSS_URL); // 안정적이지만 느린 폴백
const PROXY_URL_2 = 'https://corsproxy.io/?url=' + encodeURIComponent(RSS_URL); // 빠른 프록시 (브라우저 전용)
const CACHE_KEY = 'soundiary.chart.v1';
const CACHE_TTL = 1000 * 60 * 30; // 30분

const GENRE_MAP = {
  'K-Pop': 'K-Pop', 'J-Pop': 'J-Pop', 'Hip-Hop/Rap': 'Hip-Hop', 'Hip-Hop': 'Hip-Hop',
  'R&B/Soul': 'R&B', 'R&B': 'R&B', 'Rock': 'Rock', 'Jazz': 'Jazz', 'Classical': 'Classical',
  'Electronic': 'Electronic', 'Dance': 'Electronic', 'Indie': 'Indie', 'Alternative': 'Indie',
  'Ballad': 'Ballad', '발라드': 'Ballad', '힙합': 'Hip-Hop', '랩': 'Hip-Hop', 'R&B/소울': 'R&B', '알앤비': 'R&B', '록': 'Rock', '재즈': 'Jazz', '클래식': 'Classical', '일렉트로닉': 'Electronic', '댄스': 'Electronic', '인디': 'Indie', '얼터너티브': 'Indie', '팝': 'Pop', 'Pop': 'Pop',
};

function mapGenre(name) {
  if (!name) return 'Pop';
  for (const [k, v] of Object.entries(GENRE_MAP)) {
    if (name.includes(k)) return v;
  }
  return 'Pop';
}

export default function ChartPanel({ isDark = false, onPick }) {
  const [open, setOpen] = useState(false);
  const [songs, setSongs] = useState(null);
  const [error, setError] = useState(false);
  const [picking, setPicking] = useState(null);

  useEffect(() => {
    // 앱 로드 시 미리 받아두고(prefetch), 30분간 localStorage 캐시로 즉시 표시
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const c = JSON.parse(raw);
        if (c && Date.now() - c.at < CACHE_TTL && Array.isArray(c.list) && c.list.length) {
          setSongs(c.list);
          return;
        }
      }
    } catch (e) {}
    const grab = async (url) => {
      const r = await fetch(url);
      if (!r.ok) throw new Error('bad response');
      const d = await r.json();
      const list = (d.feed && d.feed.results) || [];
      if (!list.length) throw new Error('empty');
      return list;
    };
    (async () => {
      let list = null;
      try {
        list = await grab(RSS_URL); // 직접 시도 (CORS 허용 시 가장 빠름)
      } catch (e) {
        try {
          // 빠른 프록시와 안정적인 프록시를 동시에 요청, 먼저 성공한 쪽 사용
          list = await Promise.any([grab(PROXY_URL_2), grab(PROXY_URL)]);
        } catch (e2) { setError(true); }
      }
      if (list) {
        setSongs(list);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), list })); } catch (e) {}
      }
    })();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.classList.add('modal-open'); // 모달 열린 동안 배경 스크롤 잠금
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('modal-open');
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pick = async (s) => {
    if (picking) return;
    setPicking(s.id);
    let extra = {};
    try {
      const res = await fetch('https://itunes.apple.com/lookup?id=' + s.id + '&country=KR');
      const data = await res.json();
      const item = data.results && data.results[0];
      if (item) extra = { previewUrl: item.previewUrl || '', album: item.collectionName || '', genre: mapGenre(item.primaryGenreName) };
    } catch (e) {}
    setPicking(null);
    setOpen(false);
    onPick({
      title: s.name,
      artist: s.artistName,
      album: extra.album || '',
      artworkUrl: (s.artworkUrl100 || '').replace('100x100', '600x600'),
      previewUrl: extra.previewUrl || '',
      genre: extra.genre || mapGenre(s.genres && s.genres[0] && s.genres[0].name),
    });
  };

  return (
    <>
      <div className='sd-banner' style={{
        background: isDark ? 'rgba(38,38,58,0.82)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 20,
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
        borderTop: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,1)',
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(70,70,110,0.1)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          <span style={{ fontSize: 24 }}>🔥</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>지금 인기 차트</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>애플 뮤직 TOP 25에서 바로 기록해보세요</div>
          </div>
        </div>
        <button onClick={() => setOpen(true)} style={{
          flexShrink: 0, padding: '10px 18px', borderRadius: 999,
          fontSize: 13, fontWeight: 700, color: '#fff',
          background: 'linear-gradient(135deg,#fb7185,#f59e0b)',
          border: '1px solid rgba(255,255,255,0.4)',
          boxShadow: '0 6px 18px rgba(250,115,100,0.35)',
          cursor: 'pointer',
        }}>차트 보기</button>
      </div>

      {open && (
        <div onMouseDown={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 105, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(60,60,90,0.28)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'sd-fade .2s ease' }}>
          <div onMouseDown={(e) => e.stopPropagation()} style={{
            width: '100%', maxWidth: 440, maxHeight: '78vh',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
            borderRadius: 26,
            background: isDark ? 'rgba(30,30,48,0.96)' : 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.9)',
            boxShadow: '0 40px 86px -26px rgba(40,40,80,0.45)',
            animation: 'sd-pop .24s cubic-bezier(.2,.9,.25,1.1)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px 14px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid rgba(0,0,0,0.06)' }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-1)' }}>🔥 인기 차트 TOP 25</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>애플 뮤직 · 한국 · 가장 많이 재생된 곡</div>
              </div>
              <button onClick={() => setOpen(false)} style={{ width: 32, height: 32, borderRadius: 999, fontSize: 15, color: 'var(--text-2)', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)', border: 'none', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ overflowY: 'auto', padding: '8px 10px 12px' }}>
              {error && <div style={{ padding: 30, textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>차트를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</div>}
              {!error && !songs && <div style={{ padding: 30, textAlign: 'center', fontSize: 13, color: 'var(--text-2)' }}>차트 불러오는 중...</div>}
              {songs && songs.map((s, i) => (
                <button key={s.id} onClick={() => pick(s)} disabled={!!picking} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '9px 10px', borderRadius: 14, border: 'none',
                  background: 'transparent', cursor: picking ? 'wait' : 'pointer', textAlign: 'left',
                  opacity: picking && picking !== s.id ? 0.5 : 1,
                }}>
                  <span style={{ width: 24, flexShrink: 0, textAlign: 'center', fontSize: 13.5, fontWeight: 800, color: i < 3 ? '#f59e0b' : 'var(--text-3)' }}>{i + 1}</span>
                  <img src={s.artworkUrl100} alt={s.name} style={{ width: 46, height: 46, borderRadius: 10, objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--text-2)', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.artistName}</span>
                  </span>
                  <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, padding: '6px 11px', borderRadius: 999, color: picking === s.id ? 'var(--text-3)' : '#fff', background: picking === s.id ? 'transparent' : 'linear-gradient(135deg,#fb7185,#f59e0b)' }}>
                    {picking === s.id ? '불러오는 중' : '+ 기록'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
