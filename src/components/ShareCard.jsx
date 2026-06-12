// ---------------------------------------------------------------------------
// Soundiary · ShareCard — Canvas 공유 카드 생성
// ---------------------------------------------------------------------------
import { useState } from 'react';
import { shareOrDownloadImage } from '../share.js';

async function getAvgColor(img) {
  const canvas = document.createElement('canvas');
  canvas.width = 10; canvas.height = 10;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, 10, 10);
  const d = ctx.getImageData(0, 0, 10, 10).data;
  let r=0,g=0,b=0,n=0;
  for (let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2];n++;}
  return [Math.round(r/n),Math.round(g/n),Math.round(b/n)];
}

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r,y);
  ctx.lineTo(x+w-r,y);
  ctx.quadraticCurveTo(x+w,y,x+w,y+r);
  ctx.lineTo(x+w,y+h-r);
  ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
  ctx.lineTo(x+r,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-r);
  ctx.lineTo(x,y+r);
  ctx.quadraticCurveTo(x,y,x+r,y);
  ctx.closePath();
}

export async function generateShareCard(track) {
  const SIZE = 1080;
  const canvas = document.createElement('canvas');
  canvas.width = SIZE; canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  // 앨범 이미지 로드
  let albumImg = null;
  if (track.artworkUrl) {
    albumImg = await new Promise(res => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = track.artworkUrl;
    });
  }

  // 평균색 추출
  let avgColor = [100, 80, 200];
  if (albumImg) avgColor = await getAvgColor(albumImg);
  const [ar,ag,ab] = avgColor;

  // === 배경 ===
  if (albumImg) {
    // 앨범 커버 배경 (확대 + 블러)
    ctx.save();
    ctx.filter = 'blur(80px) brightness(0.35) saturate(2)';
    ctx.drawImage(albumImg, -200, -200, SIZE+400, SIZE+400);
    ctx.restore();
  } else {
    // 장르 그라디언트 배경
    const grd = ctx.createLinearGradient(0, 0, SIZE, SIZE);
    grd.addColorStop(0, `rgb(${ar},${ag},${ab})`);
    grd.addColorStop(1, 'rgb(10,10,20)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, SIZE, SIZE);
  }

  // 배경 어둠 오버레이
  const overlay = ctx.createLinearGradient(0, 0, 0, SIZE);
  overlay.addColorStop(0, 'rgba(0,0,0,0.2)');
  overlay.addColorStop(0.5, 'rgba(0,0,0,0.1)');
  overlay.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // === 앨범 커버 ===
  const coverSize = 460;
  const coverX = (SIZE - coverSize) / 2;
  const coverY = 130;

  ctx.save();
  // 그림자
  ctx.shadowColor = `rgba(${ar},${ag},${ab},0.9)`;
  ctx.shadowBlur = 100;
  ctx.shadowOffsetY = 30;
  drawRoundRect(ctx, coverX, coverY, coverSize, coverSize, 48);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fill();
  ctx.restore();

  if (albumImg) {
    ctx.save();
    drawRoundRect(ctx, coverX, coverY, coverSize, coverSize, 48);
    ctx.clip();
    ctx.drawImage(albumImg, coverX, coverY, coverSize, coverSize);
    ctx.restore();
  } else {
    ctx.save();
    drawRoundRect(ctx, coverX, coverY, coverSize, coverSize, 48);
    const grd2 = ctx.createLinearGradient(coverX, coverY, coverX+coverSize, coverY+coverSize);
    grd2.addColorStop(0, `rgba(${ar},${ag},${ab},0.8)`);
    grd2.addColorStop(1, 'rgba(20,20,40,0.9)');
    ctx.fillStyle = grd2;
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = 'bold 140px serif';
    ctx.textAlign = 'center';
    ctx.fillText('♪', SIZE/2, coverY + coverSize/2 + 50);
  }

  // 앨범 커버 테두리
  ctx.save();
  drawRoundRect(ctx, coverX, coverY, coverSize, coverSize, 48);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // === 텍스트 영역 ===
  const textStartY = coverY + coverSize + 60;

  // 곡 제목
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.8)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 72px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  const maxTitleW = SIZE - 100;
  let titleText = track.title;
  while (ctx.measureText(titleText).width > maxTitleW) {
    titleText = titleText.slice(0, -1);
  }
  if (titleText !== track.title) titleText += '...';
  ctx.fillText(titleText, SIZE/2, textStartY);
  ctx.restore();

  // 아티스트
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.6)';
  ctx.shadowBlur = 20;
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = '500 38px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(track.artist, SIZE/2, textStartY + 58);
  ctx.restore();

  // === 태그 (장르 + 무드) ===
  const tagY = textStartY + 118;
  const tags = [track.genre, track.mood].filter(Boolean);
  let totalTagW = 0;
  const tagPad = 40;
  const tagH = 52;
  const tagGap = 16;
  ctx.font = 'bold 26px -apple-system, sans-serif';
  const tagWidths = tags.map(t => ctx.measureText(t).width + tagPad * 2);
  totalTagW = tagWidths.reduce((a,b) => a+b, 0) + tagGap * (tags.length-1);
  let tagX = SIZE/2 - totalTagW/2;

  tags.forEach((tag, i) => {
    const tw = tagWidths[i];
    drawRoundRect(ctx, tagX, tagY - tagH + 10, tw, tagH, tagH/2);
    if (i === 0) {
      const grd3 = ctx.createLinearGradient(tagX, 0, tagX+tw, 0);
      grd3.addColorStop(0, `rgba(${ar},${ag},${ab},0.85)`);
      grd3.addColorStop(1, `rgba(${Math.min(ar+80,255)},${Math.min(ag+60,255)},${Math.min(ab+80,255)},0.85)`);
      ctx.fillStyle = grd3;
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
    }
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, tagX + tw/2, tagY - tagH + 10 + tagH/2);
    ctx.textBaseline = 'alphabetic';
    tagX += tw + tagGap;
  });

  // === 별점 ===
  const starY = tagY + 72;
  const starSize = 48;
  const totalStarW = starSize * 5 + 10 * 4;
  let starX = SIZE/2 - totalStarW/2;
  ctx.font = starSize + 'px serif';
  ctx.textAlign = 'left';
  ctx.shadowColor = 'rgba(251,191,36,0.5)';
  ctx.shadowBlur = 15;
  for (let i=1;i<=5;i++) {
    ctx.fillStyle = i <= track.rating ? '#fbbf24' : 'rgba(255,255,255,0.2)';
    ctx.fillText('★', starX, starY);
    starX += starSize + 10;
  }
  ctx.shadowBlur = 0;

  // === 하단 워터마크 ===
  // 구분선
  ctx.save();
  const lineGrd = ctx.createLinearGradient(80, 0, SIZE-80, 0);
  lineGrd.addColorStop(0, 'rgba(255,255,255,0)');
  lineGrd.addColorStop(0.5, 'rgba(255,255,255,0.2)');
  lineGrd.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.strokeStyle = lineGrd;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, SIZE-120);
  ctx.lineTo(SIZE-80, SIZE-120);
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.font = 'bold 32px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.55)';
  ctx.fillText('🎵  Soundiary', SIZE/2, SIZE-68);
  ctx.font = '500 24px -apple-system, sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillText('나만의 음악 일기장', SIZE/2, SIZE-30);

  return canvas.toDataURL('image/png');
}

export default function ShareCardButton({ track, isDark = false, position = 'normal' }) {
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.stopPropagation();
    if (loading) return;
    setLoading(true);
    try {
      const dataUrl = await generateShareCard(track);
      await shareOrDownloadImage(dataUrl, track.title + ' - ' + track.artist + '.png');
    } catch(err) { console.error(err); }
    setLoading(false);
  };

  if (position === 'overlay') {
    return (
      <button onClick={handleSave} disabled={loading} title='카드 저장' style={{
        position: 'absolute', top: 14, right: 56,
        display: 'grid', placeItems: 'center',
        width: 34, height: 34, borderRadius: '50%',
        background: loading ? 'rgba(120,90,250,0.6)' : 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.25)',
        cursor: loading ? 'wait' : 'pointer',
        fontSize: 15,
        transition: 'all .2s ease',
      }}>
        {loading ? (<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'><circle cx='12' cy='12' r='9'/><path d='M12 8v4'/></svg>) : (<svg width='15' height='15' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='7 10 12 15 17 10'/><line x1='12' y1='15' x2='12' y2='3'/></svg>)}
      </button>
    );
  }

  return (
    <button onClick={handleSave} disabled={loading} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '10px 20px', borderRadius: 999,
      fontSize: 13.5, fontWeight: 700, color: '#fff',
      background: loading ? 'rgba(120,90,250,0.5)' : 'linear-gradient(135deg,#a78bfa,#818cf8)',
      border: '1px solid rgba(255,255,255,0.4)',
      boxShadow: '0 6px 18px rgba(120,90,250,0.35)',
      cursor: loading ? 'wait' : 'pointer',
    }}>
      <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='#fff' strokeWidth='2.2' strokeLinecap='round' strokeLinejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/><polyline points='7 10 12 15 17 10'/><line x1='12' y1='15' x2='12' y2='3'/></svg>
      {loading ? '생성 중...' : '카드 저장'}
    </button>
  );
}