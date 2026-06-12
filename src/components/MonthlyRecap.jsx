// ---------------------------------------------------------------------------
// Soundiary · MonthlyRecap — 이달의 음악 리포트 카드 (Canvas)
// ---------------------------------------------------------------------------
import { useState, useMemo } from 'react';
import { GENRE_GRADIENTS } from '../data.js';
import { shareOrDownloadImage } from '../share.js';

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function loadImage(url) {
  return new Promise((res) => {
    if (!url) return res(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => res(img);
    img.onerror = () => res(null);
    img.src = url;
  });
}

function ellipsize(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}

async function generateRecapCard(stats) {
  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  const pair = GENRE_GRADIENTS[stats.topGenre] || ['#8a7bff', '#66d6ff'];
  const FONT = '-apple-system, BlinkMacSystemFont, "Pretendard", sans-serif';

  const grd = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grd.addColorStop(0, pair[0]);
  grd.addColorStop(1, pair[1]);
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const dark = ctx.createLinearGradient(0, 0, 0, SIZE);
  dark.addColorStop(0, 'rgba(10,10,25,0.55)');
  dark.addColorStop(0.55, 'rgba(10,10,25,0.72)');
  dark.addColorStop(1, 'rgba(10,10,25,0.88)');
  ctx.fillStyle = dark;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.save();
  ctx.globalAlpha = 0.12;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.arc(SIZE - 110, 130, 200, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(90, SIZE - 220, 150, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.textAlign = 'left';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.font = 'bold 30px ' + FONT;
  ctx.fillText('🎵 Soundiary', 80, 110);
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 76px ' + FONT;
  ctx.fillText(stats.month + '월의 음악 리포트', 80, 205);
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '500 30px ' + FONT;
  ctx.fillText(String(stats.year), 80, 252);

  ctx.fillStyle = '#ffffff';
  ctx.font = '800 150px ' + FONT;
  ctx.fillText(String(stats.count), 80, 430);
  const numW = ctx.measureText(String(stats.count)).width;
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = '600 40px ' + FONT;
  ctx.fillText('곡 기록', 80 + numW + 22, 430);

  const rows = [
    ['최다 장르', stats.topGenre || '-'],
    ['최다 아티스트', stats.topArtist || '-'],
    ['평균 평점', '★ ' + stats.avg],
  ];
  let ry = 530;
  rows.forEach(([label, val]) => {
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '600 30px ' + FONT;
    ctx.fillText(label, 80, ry);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 38px ' + FONT;
    ctx.fillText(ellipsize(ctx, val, 560), SIZE - 80, ry);
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(80, ry + 26); ctx.lineTo(SIZE - 80, ry + 26); ctx.stroke();
    ry += 84;
  });

  if (stats.bestTrack) {
    const t = stats.bestTrack;
    const cardY = 790, cardH = 180;
    drawRoundRect(ctx, 80, cardY, SIZE - 160, cardH, 28);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.22)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    const img = await loadImage(t.artworkUrl);
    const artSize = 132, artX = 104, artY = cardY + 24;
    if (img) {
      ctx.save();
      drawRoundRect(ctx, artX, artY, artSize, artSize, 18);
      ctx.clip();
      ctx.drawImage(img, artX, artY, artSize, artSize);
      ctx.restore();
    } else {
      drawRoundRect(ctx, artX, artY, artSize, artSize, 18);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '60px serif';
      ctx.textAlign = 'center';
      ctx.fillText('♪', artX + artSize / 2, artY + artSize / 2 + 20);
    }

    const tx = artX + artSize + 30;
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '700 24px ' + FONT;
    ctx.fillText('이달의 베스트', tx, cardY + 56);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 40px ' + FONT;
    ctx.fillText(ellipsize(ctx, t.title, SIZE - 104 - tx - 130), tx, cardY + 106);
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 28px ' + FONT;
    ctx.fillText(ellipsize(ctx, t.artist, SIZE - 104 - tx - 24), tx, cardY + 146);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 30px ' + FONT;
    ctx.fillText('★ ' + (t.rating || 0) + '.0', SIZE - 104, cardY + 56);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '500 24px ' + FONT;
  ctx.fillText('나만의 음악 일기장 · Soundiary', SIZE / 2, SIZE - 44);

  return canvas.toDataURL('image/png');
}

export default function MonthlyRecap({ tracks, isDark = false }) {
  const [loading, setLoading] = useState(false);

  const stats = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const prefix = year + '-' + String(month).padStart(2, '0');
    const list = tracks.filter((t) => (t.date || '').startsWith(prefix));
    if (!list.length) return { year, month, count: 0 };
    const gc = {}, ac = {};
    list.forEach((t) => {
      gc[t.genre] = (gc[t.genre] || 0) + 1;
      ac[t.artist] = (ac[t.artist] || 0) + 1;
    });
    const top = (o) => Object.entries(o).sort((a, b) => b[1] - a[1])[0][0];
    const avg = (list.reduce((s, t) => s + (t.rating || 0), 0) / list.length).toFixed(1);
    const bestTrack = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0) || (b.date || '').localeCompare(a.date || ''))[0];
    return { year, month, count: list.length, topGenre: top(gc), topArtist: top(ac), avg, bestTrack };
  }, [tracks]);

  if (!stats.count) return null;

  const save = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const dataUrl = await generateRecapCard(stats);
      await shareOrDownloadImage(dataUrl, 'Soundiary ' + stats.year + '-' + String(stats.month).padStart(2, '0') + ' 리포트.png');
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className='sd-banner' style={{
      background: isDark ? 'rgba(38,38,58,0.82)' : 'rgba(255,255,255,0.72)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 20,
      border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.8)',
      borderTop: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,1)',
      boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(70,70,110,0.1)',
      padding: '16px 20px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <span style={{ fontSize: 26 }}>📊</span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>{stats.month}월의 음악 리포트</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-2)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {stats.count}곡 · {stats.topGenre} · ★ {stats.avg}
          </div>
        </div>
      </div>
      <button onClick={save} disabled={loading} style={{
        display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0,
        padding: '10px 18px', borderRadius: 999,
        fontSize: 13, fontWeight: 700, color: '#fff',
        background: loading ? 'rgba(120,90,250,0.5)' : 'linear-gradient(135deg,#a78bfa,#818cf8)',
        border: '1px solid rgba(255,255,255,0.4)',
        boxShadow: '0 6px 18px rgba(120,90,250,0.35)',
        cursor: loading ? 'wait' : 'pointer',
      }}>
        <svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='7 10 12 15 17 10'/><line x1='12' y1='15' x2='12' y2='3'/></svg>
        {loading ? '생성 중...' : '카드 저장'}
      </button>
    </div>
  );
}
