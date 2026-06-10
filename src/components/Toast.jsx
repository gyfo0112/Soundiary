// ---------------------------------------------------------------------------
// Soundiary · Toast — 알림 컴포넌트
// ---------------------------------------------------------------------------
import { useState, useEffect, useCallback } from 'react';

let toastId = 0;
let globalAddToast = null;

export function toast(message, type = 'success') {
  if (globalAddToast) globalAddToast({ id: ++toastId, message, type });
}

const ICONS = {
  success: '✅',
  delete: '🗑️',
  edit: '✏️',
  error: '❌',
  info: 'ℹ️',
};

const COLORS = {
  success: 'linear-gradient(135deg, #34d399, #10b981)',
  delete: 'linear-gradient(135deg, #f87171, #ef4444)',
  edit: 'linear-gradient(135deg, #a78bfa, #818cf8)',
  error: 'linear-gradient(135deg, #f87171, #ef4444)',
  info: 'linear-gradient(135deg, #60a5fa, #3b82f6)',
};

function ToastItem({ item, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onRemove(item.id), 350);
    }, 2800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 18px', borderRadius: 14,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.9)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.9)',
      transform: visible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
      opacity: visible ? 1 : 0,
      transition: 'all 0.3s cubic-bezier(.2,.9,.25,1.1)',
      minWidth: 220, maxWidth: 320,
      cursor: 'pointer',
    }} onClick={() => { setVisible(false); setTimeout(() => onRemove(item.id), 350); }}>
      {/* 왼쪽 컬러 바 */}
      <div style={{ width: 4, height: 36, borderRadius: 999, background: COLORS[item.type] || COLORS.success, flexShrink: 0 }} />
      <span style={{ fontSize: 18 }}>{ICONS[item.type] || ICONS.success}</span>
      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1c1c1e', letterSpacing: '-0.01em', flex: 1 }}>
        {item.message}
      </span>
    </div>
  );
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((t) => {
    setToasts(prev => [...prev, t]);
  }, []);

  useEffect(() => {
    globalAddToast = addToast;
    return () => { globalAddToast = null; };
  }, [addToast]);

  const remove = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 999,
      display: 'flex', flexDirection: 'column', gap: 10,
      alignItems: 'center', pointerEvents: 'none',
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem item={t} onRemove={remove} />
        </div>
      ))}
    </div>
  );
}