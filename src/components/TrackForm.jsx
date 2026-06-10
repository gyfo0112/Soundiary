// ---------------------------------------------------------------------------
// Soundiary · TrackForm — iTunes 검색 + 아티스트 페이지
// ---------------------------------------------------------------------------
import { useState, useEffect } from 'react';
import { GENRES, MOODS, genreGradient, todayISO } from '../data.js';
import { glass, StarRating, Icon } from '../ui.jsx';
import DatePicker from './DatePicker.jsx';

const GENRE_MAP = {
  'K-Pop': 'K-Pop', 'Korean Pop': 'K-Pop', 'J-Pop': 'J-Pop', 'Japanese Pop': 'J-Pop',
  'Pop': 'Pop', 'Dance': 'Pop', 'Electronic': 'Electronic', 'Electronica': 'Electronic',
  'Hip-Hop/Rap': 'Hip-Hop', 'Hip Hop': 'Hip-Hop', 'Rap': 'Hip-Hop',
  'R&B/Soul': 'R&B', 'R&B': 'R&B', 'Soul': 'R&B',
  'Jazz': 'Jazz', 'Blues': 'Jazz', 'Classical': 'Classical',
  'Rock': 'Rock', 'Alternative': 'Rock', 'Indie': 'Indie', 'Ballad': 'Ballad',
};

function mapGenre(g) {
  if (!g) return null;
  for (const [k, v] of Object.entries(GENRE_MAP)) {
    if (g.toLowerCase().includes(k.toLowerCase())) return v;
  }
  return null;
}

function SearchResultItem({ item, isDark, onSelect }) {
  return (
    <button onClick={() => onSelect(item)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 12, textAlign: 'left', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.07)', cursor: 'pointer', transition: 'all .15s ease', width: '100%' }}
      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.95)'}
      onMouseLeave={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.7)'}
    >
      <img src={item.artworkUrl60} alt={item.trackName} style={{ width: 44, height: 44, borderRadius: 8, flexShrink: 0, objectFit: 'cover' }} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.trackName}</div>
        <div style={{ fontSize: 12, color: 'var(--text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.artistName} · {item.collectionName}</div>
        {item.primaryGenreName && <div style={{ fontSize: 11, color: isDark ? 'rgba(180,150,255,0.8)' : 'rgba(120,90,250,0.7)', marginTop: 1, fontWeight: 600 }}>{item.primaryGenreName}</div>}
      </div>
    </button>
  );
}

// 아티스트 페이지 모달
function ArtistPage({ artist, isDark, onSelect, onClose }) {
  const [tracks, setTracks] = useState(artist.tracks || []);
  const [loading, setLoading] = useState(!artist.tracks?.length);

  useEffect(() => {
    if (artist.tracks?.length) return;
    setLoading(true);
    fetch('https://itunes.apple.com/search?term=' + encodeURIComponent(artist.name) + '&entity=song&attribute=artistTerm&limit=50')
      .then(r => r.json())
      .then(d => {
        const al = artist.name.toLowerCase();
        const filtered = (d.results || []).filter(r =>
          r.artistName.toLowerCase() === al ||
          r.artistName.toLowerCase().includes(al) ||
          al.includes(r.artistName.toLowerCase())
        );
        setTracks(filtered.length > 0 ? filtered : (d.results || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [artist.name]);

  return (
    <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, zIndex: 400, background: 'rgba(60,60,90,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div onMouseDown={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, maxHeight: '80vh', borderRadius: 24, overflow: 'hidden', background: isDark ? 'rgba(22,22,36,0.98)' : 'rgba(255,255,255,0.98)', border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)', boxShadow: '0 32px 72px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column' }}>

        {/* 아티스트 헤더 */}
        <div style={{ position: 'relative', height: 160, flexShrink: 0, overflow: 'hidden' }}>
          {artist.img
            ? <>
                <img src={artist.img} alt={artist.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.55) saturate(1.3)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75))' }} />
              </>
            : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #a78bfa, #818cf8)' }} />
          }
          <button onMouseDown={onClose} style={{ position: 'absolute', top: 14, left: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', display: 'grid', placeItems: 'center', cursor: 'pointer' }}>
            <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.2' strokeLinecap='round'><polyline points='15 18 9 12 15 6'/></svg>
          </button>
          <div style={{ position: 'absolute', bottom: 14, left: 18, right: 18 }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}>{artist.name}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>곡 {tracks.length}개 · 선택하면 자동 입력돼요</div>
          </div>
        </div>

        {/* 곡 목록 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px 14px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 14 }}>불러오는 중...</div>
          ) : tracks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-3)', fontSize: 14 }}>곡을 찾을 수 없어요</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {tracks.map((item, idx) => (
                <button key={item.trackId || idx} onClick={() => onSelect(item)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all .15s ease', width: '100%' }}
                  onMouseEnter={e => e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <img src={item.artworkUrl60} alt={item.trackName} style={{ width: 46, height: 46, borderRadius: 10, flexShrink: 0, objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.trackName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.collectionName}</div>
                  </div>
                  {item.primaryGenreName && (
                    <span style={{ fontSize: 11, fontWeight: 600, color: isDark ? 'rgba(180,150,255,0.7)' : 'rgba(120,90,250,0.7)', flexShrink: 0 }}>{item.primaryGenreName}</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TrackForm({ initial, onSave, onClose, existingTracks = [] }) {
  const isDark = document.body.classList.contains('dark');
  const editing = !!initial;
  const [title, setTitle] = useState(initial?.title || '');
  const [artist, setArtist] = useState(initial?.artist || '');
  const [album, setAlbum] = useState(initial?.album || '');
  const [artworkUrl, setArtworkUrl] = useState(initial?.artworkUrl || '');
  const [previewUrl, setPreviewUrl] = useState(initial?.previewUrl || '');
  const [genre, setGenre] = useState(initial?.genre || 'K-Pop');
  const [mood, setMood] = useState(initial?.mood || '신남');
  const [rating, setRating] = useState(initial?.rating || 5);
  const [memo, setMemo] = useState(initial?.memo || '');
  const [date, setDate] = useState(initial?.date || new Date().toISOString().slice(0, 10));
  const [tried, setTried] = useState(false);
  const [dupError, setDupError] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [allResults, setAllResults] = useState([]);
  const [showAllModal, setShowAllModal] = useState(false);
  const [artistPage, setArtistPage] = useState(null);
  const [searchError, setSearchError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (artistPage) { setArtistPage(null); return; }
        if (showAllModal) { setShowAllModal(false); return; }
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [artistPage, showAllModal]);

  const bg = isDark ? 'rgba(22,22,36,0.97)' : 'rgba(255,255,255,0.88)';
  const inputBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.035)';
  const inputBorder = isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.1)';

  const inputStyle = (invalid) => ({
    width: '100%', height: 46, padding: '0 15px', borderRadius: 14,
    fontSize: 14.5, fontWeight: 500, color: 'var(--text-1)',
    background: invalid ? (isDark ? 'rgba(248,113,113,0.1)' : 'rgba(255,90,110,0.04)') : inputBg,
    border: invalid ? '1px solid rgba(248,113,113,0.6)' : inputBorder,
    transition: 'all .16s ease',
  });

  const Label = ({ children }) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.6 }}>{children}</label>
  );

  const searchItunes = async () => {
    if (!title.trim() && !artist.trim()) { setSearchError('곡 제목 또는 아티스트를 입력해주세요'); return; }
    setSearching(true); setSearchError(''); setSearchResults([]); setAllResults([]); setArtistPage(null);
    try {
      let results = [];
      if (title.trim() && artist.trim()) {
        const q = encodeURIComponent(title.trim() + ' ' + artist.trim());
        const res = await fetch('https://itunes.apple.com/search?term=' + q + '&entity=song&limit=20');
        const data = await res.json();
        results = data.results || [];
        const al = artist.trim().toLowerCase();
        const filtered = results.filter(r => r.artistName.toLowerCase().includes(al) || al.includes(r.artistName.toLowerCase()));
        if (filtered.length > 0) results = filtered;
      } else if (artist.trim() && !title.trim()) {
        const q = encodeURIComponent(artist.trim());
        const res = await fetch('https://itunes.apple.com/search?term=' + q + '&entity=song&attribute=artistTerm&limit=50');
        const data = await res.json();
        const al = artist.trim().toLowerCase();
        // 아티스트명이 정확히 일치하는 곡만 필터링
        results = (data.results || []).filter(r =>
          r.artistName.toLowerCase() === al ||
          r.artistName.toLowerCase().includes(al) ||
          al.includes(r.artistName.toLowerCase())
        );
        // 필터 후 없으면 원본 사용
        if (results.length === 0) results = data.results || [];
      } else {
        const q = encodeURIComponent(title.trim());
        const res = await fetch('https://itunes.apple.com/search?term=' + q + '&entity=song&limit=20');
        const data = await res.json();
        results = data.results || [];
      }
      if (!results.length) setSearchError('검색 결과가 없어요.');
      else { setAllResults(results); setSearchResults(results.slice(0, 5)); }
    } catch (e) { setSearchError('검색 중 오류가 발생했어요.'); }
    finally { setSearching(false); }
  };

  const selectResult = (item) => {
    const mapped = mapGenre(item.primaryGenreName);
    setTitle(item.trackName);
    setArtist(item.artistName);
    setAlbum(item.collectionName || '');
    setArtworkUrl(item.artworkUrl100?.replace('100x100', '600x600') || '');
    setPreviewUrl(item.previewUrl || '');
    if (mapped) setGenre(mapped);
    setSearchResults([]); setAllResults([]);
    setShowAllModal(false); setArtistPage(null);
  };

  const submit = () => {
    setDupError('');
    const isDup = existingTracks.some(t => t.id !== initial?.id && t.title.trim().toLowerCase() === title.trim().toLowerCase() && t.artist.trim().toLowerCase() === artist.trim().toLowerCase());
    if (isDup) { setTried(true); setDupError('이미 동일한 곡이 등록되어 있어요.'); return; }
    setTried(true);
    if (!title.trim() || !artist.trim()) return;
    onSave({ id: initial?.id, title: title.trim(), artist: artist.trim(), album: album.trim(), artworkUrl, previewUrl, genre, mood, rating, memo: memo.trim(), date });
  };

  return (
    <>
      {/* 메인 폼 */}
      <div onMouseDown={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '5vh 16px 16px', overflowY: 'auto', background: 'rgba(60,60,90,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'sd-fade .22s ease' }}>
        <div onMouseDown={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 520, padding: 26, borderRadius: 30, background: bg, border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)', boxShadow: isDark ? '0 44px 96px -28px rgba(0,0,0,0.7)' : '0 44px 96px -28px rgba(40,40,80,0.4)', animation: 'sd-pop .26s cubic-bezier(.2,.9,.25,1.1)', marginBottom: '5vh' }}>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-en)', fontSize: 21, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>{editing ? 'Edit track' : 'New track'}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 3 }}>{editing ? '기록을 수정합니다' : '오늘 들은 곡을 기록해요'}</div>
            </div>
            <button onClick={onClose} style={{ display: 'grid', placeItems: 'center', width: 36, height: 36, borderRadius: '50%', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(0,0,0,0.08)', cursor: 'pointer' }}>
              <Icon name='close' size={16} color='var(--text-2)' />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* iTunes 검색 */}
            <div style={{ background: isDark ? 'rgba(120,90,250,0.1)' : 'rgba(120,90,250,0.06)', borderRadius: 16, padding: '14px 16px', border: isDark ? '1px solid rgba(120,90,250,0.25)' : '1px solid rgba(120,90,250,0.12)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? 'rgba(180,150,255,0.9)' : 'rgba(120,90,250,0.8)', marginBottom: 10 }}>
                🔍 iTunes 검색 — 곡 제목 또는 아티스트로 검색
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={title} onChange={e => { setTitle(e.target.value); setSearchResults([]); setAllResults([]); }} placeholder='곡 제목 (선택)' style={{ ...inputStyle(tried && !title.trim()), flex: 2 }} />
                <input value={artist} onChange={e => { setArtist(e.target.value); setSearchResults([]); setAllResults([]); }} placeholder='아티스트 (선택)' style={{ ...inputStyle(tried && !artist.trim()), flex: 1.5 }}
                  onKeyDown={e => e.key === 'Enter' && searchItunes()}
                />
                <button onClick={searchItunes} disabled={searching} style={{ height: 46, padding: '0 16px', borderRadius: 14, fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', background: searching ? 'rgba(120,90,250,0.5)' : 'linear-gradient(135deg,#a78bfa,#818cf8)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 4px 12px rgba(120,90,250,0.3)', flexShrink: 0, cursor: 'pointer' }}>
                  {searching ? '...' : '검색'}
                </button>
              </div>
              {searchError && <p style={{ fontSize: 12.5, color: '#f87171', marginTop: 8 }}>{searchError}</p>}

              {searchResults.length > 0 && (
                <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {/* 아티스트 카드 - 아티스트 검색 시 맨 위에 표시 */}
                  {artist.trim() && !title.trim() && allResults.length > 0 && (
                    <button
                      onClick={() => setArtistPage({ name: allResults[0].artistName, img: allResults[0].artworkUrl100?.replace('100x100', '600x600') || '', tracks: allResults })}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 14, textAlign: 'left', width: '100%', background: isDark ? 'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(129,140,248,0.15))' : 'linear-gradient(135deg,rgba(120,90,250,0.1),rgba(99,102,241,0.08))', border: isDark ? '1px solid rgba(167,139,250,0.35)' : '1px solid rgba(120,90,250,0.25)', cursor: 'pointer', transition: 'all .15s ease', marginBottom: 4 }}
                      onMouseEnter={e => e.currentTarget.style.background = isDark ? 'linear-gradient(135deg,rgba(167,139,250,0.3),rgba(129,140,248,0.25))' : 'linear-gradient(135deg,rgba(120,90,250,0.18),rgba(99,102,241,0.14))'}
                      onMouseLeave={e => e.currentTarget.style.background = isDark ? 'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(129,140,248,0.15))' : 'linear-gradient(135deg,rgba(120,90,250,0.1),rgba(99,102,241,0.08))'}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: isDark ? 'rgba(167,139,250,0.3)' : 'rgba(120,90,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isDark ? '2px solid rgba(167,139,250,0.4)' : '2px solid rgba(120,90,250,0.25)' }}>
                        {allResults[0]?.artworkUrl60
                          ? <img src={allResults[0].artworkUrl60} alt={allResults[0].artistName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: 20 }}>🎤</span>
                        }
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{allResults[0]?.artistName}</div>
                        <div style={{ fontSize: 12, color: isDark ? 'rgba(180,150,255,0.8)' : 'rgba(120,90,250,0.8)', marginTop: 2 }}>아티스트 · 곡 {allResults.length}개</div>
                      </div>
                      <span style={{ fontSize: 13, color: isDark ? 'rgba(180,150,255,0.7)' : 'rgba(120,90,250,0.6)', fontWeight: 600 }}>아티스트 페이지 ›</span>
                    </button>
                  )}
                  {searchResults.map(item => (
                    <SearchResultItem key={item.trackId} item={item} isDark={isDark} onSelect={selectResult} />
                  ))}
                  {allResults.length > 5 && (
                    <button onClick={() => setShowAllModal(true)} style={{ marginTop: 4, padding: '9px', borderRadius: 12, fontSize: 13, fontWeight: 600, color: isDark ? 'rgba(180,150,255,0.9)' : 'rgba(120,90,250,0.9)', background: isDark ? 'rgba(167,139,250,0.12)' : 'rgba(120,90,250,0.07)', border: isDark ? '1px solid rgba(167,139,250,0.25)' : '1px solid rgba(120,90,250,0.18)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                      <span>더보기</span>
                      <span style={{ fontSize: 11, opacity: 0.7 }}>전체 {allResults.length}개 결과</span>
                      <span>›</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {artworkUrl && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderRadius: 16, background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.07)' }}>
                <img src={artworkUrl} alt='album' style={{ width: 60, height: 60, borderRadius: 10, objectFit: 'cover', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 2 }}>{artist}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--text-3)', marginTop: 1 }}>{album}</div>
                </div>
              </div>
            )}

            <div><Label>앨범</Label><input value={album} onChange={e => setAlbum(e.target.value)} placeholder='앨범명 (검색 시 자동입력)' style={inputStyle(false)} /></div>

            <div>
              <Label>장르</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {GENRES.map(g => { const on = genre === g; return (<button key={g} type='button' onClick={() => setGenre(g)} style={{ padding: '7px 12px', borderRadius: 999, fontSize: 12.5, fontWeight: on ? 700 : 500, color: on ? '#fff' : 'var(--text-2)', background: on ? genreGradient(g, 135) : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'), border: on ? '1px solid rgba(255,255,255,0.5)' : (isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)'), boxShadow: on ? '0 5px 14px -4px rgba(70,50,130,0.4)' : 'none', transition: 'all .15s ease', cursor: 'pointer' }}>{g}</button>); })}
              </div>
            </div>

            <div>
              <Label>무드</Label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {MOODS.map(m => { const on = mood === m; return (<button key={m} type='button' onClick={() => setMood(m)} style={{ padding: '7px 13px', borderRadius: 999, fontSize: 12.5, fontWeight: on ? 700 : 500, color: on ? '#fff' : 'var(--text-2)', background: on ? 'linear-gradient(135deg,#b9a4ff,#8db4ff)' : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'), border: on ? '1px solid rgba(255,255,255,0.5)' : (isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)'), boxShadow: on ? '0 5px 14px -4px rgba(70,50,130,0.4)' : 'none', transition: 'all .15s ease', cursor: 'pointer' }}>{m}</button>); })}
              </div>
            </div>

            <div>
              <Label>평점</Label>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 46, padding: '0 16px', borderRadius: 14, background: inputBg, border: inputBorder }}>
                <StarRating value={rating} onChange={setRating} size={24} gap={5} />
                <span style={{ fontFamily: 'var(--font-en)', fontSize: 14, fontWeight: 600, color: 'var(--text-2)' }}>{rating}.0</span>
              </div>
            </div>

            <div><Label>날짜</Label><DatePicker value={date} onChange={setDate} isDark={isDark} /></div>

            <div>
              <Label>감상 메모</Label>
              <textarea value={memo} onChange={e => setMemo(e.target.value)} placeholder='이 곡을 듣고 느낀 점을 남겨보세요…' rows={3} style={{ padding: '13px 15px', borderRadius: 14, fontSize: 14, lineHeight: 1.6, fontWeight: 500, color: 'var(--text-1)', resize: 'vertical', minHeight: 84, width: '100%', background: inputBg, border: inputBorder, transition: 'all .16s ease', fontFamily: 'var(--font-kr)' }} />
            </div>

            {dupError && <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#f87171', fontWeight: 600 }}>⚠️ {dupError}</div>}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button onClick={onClose} style={{ flex: '0 0 auto', padding: '0 22px', height: 50, borderRadius: 16, fontSize: 14.5, fontWeight: 600, color: 'var(--text-2)', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)', border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(0,0,0,0.08)', cursor: 'pointer' }}>취소</button>
            <button onClick={submit} style={{ flex: 1, height: 50, borderRadius: 16, fontSize: 15, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #ff8fcf, #8a7bff 55%, #66d6ff)', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 16px 36px -10px rgba(140,60,200,0.5)', letterSpacing: '-0.01em', cursor: 'pointer' }}>
              {editing ? '변경 저장' : '기록 추가'}
            </button>
          </div>
        </div>
      </div>

      {/* 전체 결과 모달 */}
      {showAllModal && (
        <div onMouseDown={() => setShowAllModal(false)} style={{ position: 'fixed', inset: 0, zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'rgba(60,60,90,0.4)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div onMouseDown={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 460, maxHeight: '75vh', borderRadius: 24, overflow: 'hidden', background: isDark ? 'rgba(22,22,36,0.98)' : 'rgba(255,255,255,0.98)', border: isDark ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.9)', boxShadow: '0 32px 72px rgba(0,0,0,0.35)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.02em' }}>전체 검색 결과</div>
                <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2 }}>총 {allResults.length}곡 · 선택하면 자동 입력돼요</div>
              </div>
              <button onClick={() => setShowAllModal(false)} style={{ width: 30, height: 30, borderRadius: '50%', display: 'grid', placeItems: 'center', background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--text-2)' }}>✕</button>
            </div>
            <div style={{ overflowY: 'auto', padding: '10px 14px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {allResults.map(item => (
                <SearchResultItem key={item.trackId} item={item} isDark={isDark} onSelect={selectResult} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 아티스트 페이지 */}
      {artistPage && (
        <ArtistPage
          artist={artistPage}
          isDark={isDark}
          onSelect={selectResult}
          onClose={() => setArtistPage(null)}
        />
      )}
    </>
  );
}