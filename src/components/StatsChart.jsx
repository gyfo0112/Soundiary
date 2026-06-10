// ---------------------------------------------------------------------------
// Soundiary · StatsChart — 장르별 곡 수 바 차트
// ---------------------------------------------------------------------------
import { glass } from "../ui.jsx";
import { GENRE_GRADIENTS } from "../data.js";

export default function StatsChart({ tracks }) {
  if (!tracks.length) return null;

  const counts = {};
  tracks.forEach((t) => { counts[t.genre] = (counts[t.genre] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const max = sorted[0][1];

  return (
    <div style={{ ...glass({ radius: 24, opacity: 0.1 }), padding: "18px 20px" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", letterSpacing: "0.02em", marginBottom: 14 }}>
        🎸 장르별 기록
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {sorted.map(([genre, count]) => {
          const pair = GENRE_GRADIENTS[genre] || ["#cbd5e1", "#94a3b8"];
          const pct = Math.round((count / max) * 100);
          return (
            <div key={genre} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 62, fontSize: 12, fontWeight: 600, color: "var(--text-2)", flexShrink: 0, textAlign: "right" }}>
                {genre}
              </div>
              <div style={{ flex: 1, height: 10, borderRadius: 999, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${pair[0]}, ${pair[1]})`,
                  boxShadow: `0 2px 8px ${pair[0]}66`,
                  transition: "width .5s cubic-bezier(.4,0,.2,1)",
                }} />
              </div>
              <div style={{ width: 20, fontSize: 12, fontWeight: 700, color: "var(--text-1)", flexShrink: 0 }}>
                {count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}