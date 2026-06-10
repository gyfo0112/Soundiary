// ---------------------------------------------------------------------------
// Soundiary · EmptyState — 곡이 없을 때 안내
// ---------------------------------------------------------------------------
import { glass, Icon } from "../ui.jsx";

export default function EmptyState({ filtered, onAdd, onClear }) {
  return (
    <div
      style={{
        ...glass({ radius: 28, opacity: 0.12 }),
        padding: "64px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          width: 84,
          height: 84,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          background: "rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderTop: "1px solid rgba(255,255,255,0.9)",
          boxShadow:
            "inset 0 1px 2px rgba(255,255,255,0.8), 0 10px 26px -12px rgba(80,80,120,0.3)",
        }}
      >
        <Icon
          name={filtered ? "search" : "music"}
          size={34}
          color="rgba(28,28,30,0.55)"
          strokeWidth={1.6}
        />
      </div>

      <div>
        <div
          style={{
            fontFamily: "var(--font-en)",
            fontSize: 22,
            fontWeight: 600,
            color: "var(--text-1)",
            letterSpacing: "-0.01em",
          }}
        >
          {filtered ? "검색 결과 없음" : "아직 기록된 곡이 없어요"}
        </div>
        <p
          style={{
            marginTop: 8,
            fontSize: 14.5,
            lineHeight: 1.6,
            color: "var(--text-2)",
            maxWidth: 320,
          }}
        >
          {filtered
            ? "조건에 맞는 곡이 없어요. 검색어나 필터를 바꿔보세요."
            : "오늘 들은 곡을 기록해보세요. 제목, 무드, 평점과 함께 그 순간을 남겨두면 돼요."}
        </p>
      </div>

      <button
        onClick={filtered ? onClear : onAdd}
        style={{
          marginTop: 4,
          padding: "12px 22px",
          borderRadius: 999,
          fontSize: 14.5,
          fontWeight: 600,
          color: "#fff",
          background: "linear-gradient(135deg, #ff8fcf, #8a7bff 55%, #66d6ff)",
          border: "1px solid rgba(255,255,255,0.6)",
          borderTop: "1px solid rgba(255,255,255,0.9)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow:
            "0 12px 28px -8px rgba(140,80,220,0.5), inset 0 1px 1px rgba(255,255,255,0.7)",
        }}
      >
        {filtered ? "필터 초기화" : "첫 곡 기록하기"}
      </button>
    </div>
  );
}
