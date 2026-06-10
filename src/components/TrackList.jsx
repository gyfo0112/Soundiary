// ---------------------------------------------------------------------------
// Soundiary · TrackList — 카드 추가 애니메이션
// ---------------------------------------------------------------------------
import { useEffect, useRef, useState } from 'react';
import TrackItem from './TrackItem.jsx';
import EmptyState from './EmptyState.jsx';

function AnimatedCard({ track, onEdit, onDelete, onDetail, darkMode, index }) {
  const [visible, setVisible] = useState(false);
  const prevId = useRef(null);

  useEffect(() => {
    if (prevId.current !== track.id) {
      prevId.current = track.id;
      // 첫 렌더 or 새 카드
      const t = setTimeout(() => setVisible(true), index * 40);
      return () => clearTimeout(t);
    }
    setVisible(true);
  }, [track.id]);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
      transition: 'opacity 0.35s ease, transform 0.35s cubic-bezier(.2,.9,.25,1.1)',
    }}>
      <TrackItem track={track} onEdit={onEdit} onDelete={onDelete} onDetail={onDetail} darkMode={darkMode} />
    </div>
  );
}

export default function TrackList({ tracks, isFiltered, onAdd, onClear, onEdit, onDelete, onDetail, darkMode }) {
  if (!tracks.length) {
    return <EmptyState filtered={isFiltered} onAdd={onAdd} onClear={onClear} />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {tracks.map((t, idx) => (
        <AnimatedCard
          key={t.id} track={t} index={idx}
          onEdit={onEdit} onDelete={onDelete} onDetail={onDetail}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
}