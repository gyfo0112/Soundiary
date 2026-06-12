// ---------------------------------------------------------------------------
// Soundiary · App
// ---------------------------------------------------------------------------
import { useState, useEffect, useMemo, useRef } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import TrackList from './components/TrackList.jsx';
import TrackForm from './components/TrackForm.jsx';
import TrackDetail from './components/TrackDetail.jsx';
import ChartPanel from './components/ChartPanel.jsx';
import StatsChart from './components/StatsChart.jsx';
import ToastContainer, { toast } from './components/Toast.jsx';
import Streak from './components/Streak.jsx';
import Heatmap from './components/Heatmap.jsx';
import MonthlyRecap from './components/MonthlyRecap.jsx';
import { glass } from './ui.jsx';
import { SEED, uid } from './data.js';

const STORAGE_KEY = 'soundiary.tracks.v1';

function loadTracks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) { const arr = JSON.parse(raw); if (Array.isArray(arr)) return arr; }
  } catch (e) {}
  return SEED;
}

function ConfirmDelete({ track, onCancel, onConfirm }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  return (
    <div onMouseDown={onCancel} style={{ position: 'fixed', inset: 0, zIndex: 110, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(60,60,90,0.28)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', animation: 'sd-fade .2s ease' }}>
      <div onMouseDown={(e) => e.stopPropagation()} style={{ ...glass({ radius: 26 }), width: '100%', maxWidth: 360, padding: 24, textAlign: 'center', background: 'rgba(255,255,255,0.85)', boxShadow: '0 40px 86px -26px rgba(40,40,80,0.4)', animation: 'sd-pop .24s cubic-bezier(.2,.9,.25,1.1)' }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-1)' }}>이 기록을 삭제할까요?</div>
        <p style={{ fontSize: 13.5, color: 'var(--text-2)', marginTop: 8, lineHeight: 1.55 }}>
          <b style={{ color: 'var(--text-1)' }}>{track.title}</b> · {track.artist}<br />삭제하면 되돌릴 수 없어요.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={onCancel} style={{ flex: 1, height: 46, borderRadius: 14, fontSize: 14, fontWeight: 600, color: 'var(--text-2)', background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}>취소</button>
          <button onClick={onConfirm} style={{ flex: 1, height: 46, borderRadius: 14, fontSize: 14, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#ff5d7a,#ff3d6e)', boxShadow: '0 12px 28px -8px rgba(255,60,110,0.6)' }}>삭제</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [tracks, setTracks] = useState(loadTracks);
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState(null);
  const [mood, setMood] = useState(null);
  const [sort, setSort] = useState('date_desc');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [detail, setDetail] = useState(null);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('soundiary.dark') === 'true');

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
    localStorage.setItem('soundiary.dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks)); } catch (e) {}
  }, [tracks]);

  // 미리듣기/커버가 없는 기록을 iTunes에서 자동 보강 (시드 데이터 포함)
  const enrichedRef = useRef(false);
  useEffect(() => {
    if (enrichedRef.current) return;
    enrichedRef.current = true;
    const targets = tracks.filter((t) => !t.previewUrl || !t.artworkUrl);
    if (!targets.length) return;
    (async () => {
      const find = async (term) => {
        try {
          const res = await fetch('https://itunes.apple.com/search?term=' + encodeURIComponent(term) + '&entity=song&limit=1&country=KR');
          const data = await res.json();
          return (data.results && data.results[0]) || null;
        } catch (e) { return null; }
      };
      const updates = {};
      await Promise.all(targets.map(async (t) => {
        let item = await find(t.title + ' ' + t.artist);
        if (!item) item = await find(t.title);
        if (!item) return;
        updates[t.id] = {
          artworkUrl: t.artworkUrl || (item.artworkUrl100 || '').replace('100x100', '600x600'),
          previewUrl: t.previewUrl || item.previewUrl || '',
        };
      }));
      if (Object.keys(updates).length) {
        setTracks((prev) => prev.map((t) => (updates[t.id] ? { ...t, ...updates[t.id] } : t)));
      }
    })();
  }, []);

  const stats = useMemo(() => {
    const total = tracks.length;
    const avg = total ? (tracks.reduce((s, t) => s + (t.rating || 0), 0) / total).toFixed(1) : '0.0';
    const counts = {};
    tracks.forEach((t) => { counts[t.genre] = (counts[t.genre] || 0) + 1; });
    let topGenre = null, max = 0;
    Object.entries(counts).forEach(([g, c]) => { if (c > max) { max = c; topGenre = g; } });
    return { total, avg, topGenre };
  }, [tracks]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = tracks.filter((t) => {
      if (genre && t.genre !== genre) return false;
      if (mood && t.mood !== mood) return false;
      if (q) { const hay = (t.title + ' ' + t.artist + ' ' + (t.album || '')).toLowerCase(); if (!hay.includes(q)) return false; }
      return true;
    });
    const by = {
      date_desc: (a, b) => (b.date || '').localeCompare(a.date || ''),
      date_asc: (a, b) => (a.date || '').localeCompare(b.date || ''),
      rating_desc: (a, b) => (b.rating || 0) - (a.rating || 0) || (b.date || '').localeCompare(a.date || ''),
      title_asc: (a, b) => a.title.localeCompare(b.title, 'ko'),
    };
    return [...list].sort(by[sort] || by.date_desc);
  }, [tracks, query, genre, mood, sort]);

  const isFiltered = !!(query.trim() || genre || mood);

  const openAdd = () => { setEditing(null); setFormOpen(true); };
  const openFromChart = (prefill) => { setEditing(prefill); setFormOpen(true); };
  const openEdit = (t) => { setEditing(t); setFormOpen(true); };
  const closeForm = () => { setFormOpen(false); setEditing(null); };

  const save = (data) => {
    if (data.id) { setTracks((prev) => prev.map((t) => (t.id === data.id ? { ...t, ...data } : t))); toast('수정했어요 ✏️', 'edit'); }
    else { setTracks((prev) => [{ ...data, id: uid() }, ...prev]); toast('새 곡을 추가했어요 🎵', 'success'); }
    closeForm();
  };

  const confirmDelete = () => {
    setTracks((prev) => prev.filter((t) => t.id !== deleting.id));
    toast('삭제했어요', 'delete');
    setDeleting(null);
  };

  const clearFilters = () => { setQuery(''); setGenre(null); setMood(null); };

  return (
    <div style={{ minHeight: '100%', padding: 'var(--page-pad)' }}>
      <div className='orbs'>
        <div className='orb a' /><div className='orb b' /><div className='orb c' /><div className='orb d' />
      </div>
      <div style={{ maxWidth: 'var(--maxw)', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 22 }}>
        <Header stats={stats} onAdd={openAdd} darkMode={darkMode} onToggleDark={() => setDarkMode(v => !v)} />
        <SearchBar value={query} onChange={setQuery} darkMode={darkMode} />
        <ChartPanel isDark={darkMode} onPick={openFromChart} />
        <div style={{ ...glass({ radius: 24 }), padding: '18px 18px 20px' }}>
          <FilterBar genre={genre} mood={mood} sort={sort} count={visible.length} onGenre={setGenre} onMood={setMood} onSort={setSort} darkMode={darkMode} />
        </div>
        <StatsChart tracks={tracks} isDark={darkMode} />
        <Streak tracks={tracks} isDark={darkMode} />
        <Heatmap tracks={tracks} isDark={darkMode} />
        <MonthlyRecap tracks={tracks} isDark={darkMode} />
        <div id='track-list-container'>
          <TrackList
            tracks={visible} isFiltered={isFiltered}
            onAdd={openAdd} onClear={clearFilters}
            onDetail={setDetail} onEdit={openEdit}
            onDelete={setDeleting} darkMode={darkMode}
          />
        </div>
        <footer style={{ textAlign: 'center', paddingTop: 8 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-3)', letterSpacing: '0.02em' }}>Soundiary · 당신의 음악 일기</span>
        </footer>
      </div>
      {formOpen && <TrackForm initial={editing} onSave={save} onClose={closeForm} existingTracks={tracks} />}
      {detail && <TrackDetail track={detail} onClose={() => setDetail(null)} onEdit={openEdit} onDelete={setDeleting} />}
      {deleting && <ConfirmDelete track={deleting} onCancel={() => setDeleting(null)} onConfirm={confirmDelete} />}
      <ToastContainer />
    </div>
  );
}