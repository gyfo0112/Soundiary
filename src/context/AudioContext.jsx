// ---------------------------------------------------------------------------
// Soundiary · AudioContext — 전역 오디오 상태 관리
// ---------------------------------------------------------------------------
import { createContext, useContext, useState, useRef, useCallback } from 'react';

const AudioCtx = createContext(null);

export function AudioProvider({ children }) {
  const [playingId, setPlayingId] = useState(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(30);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  const intervalRef = useRef(null);

  const stopCurrent = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlayingId(null);
    setProgress(0);
    setCurrentTime(0);
    setDuration(30);
  }, []);

  const toggle = useCallback((track) => {
    if (!track.previewUrl) return;

    // 같은 곡 재생 중이면 정지
    if (playingId === track.id) {
      stopCurrent();
      return;
    }

    // 다른 곡 재생 중이면 정지 후 새로 시작
    stopCurrent();

    const audio = new Audio(track.previewUrl);
    audioRef.current = audio;

    audio.onloadedmetadata = () => {
      setDuration(audio.duration || 30);
    };

    audio.onended = () => {
      setPlayingId(null);
      setProgress(0);
      setCurrentTime(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };

    audio.play();
    setPlayingId(track.id);
    setProgress(0);
    setCurrentTime(0);

    intervalRef.current = setInterval(() => {
      if (audioRef.current) {
        const cur = audioRef.current.currentTime;
        const dur = audioRef.current.duration || 30;
        setCurrentTime(cur);
        setDuration(dur);
        setProgress((cur / dur) * 100);
      }
    }, 100);
  }, [playingId, stopCurrent]);

  const fmt = (sec) => {
    const s = Math.floor(sec || 0);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };

  return (
    <AudioCtx.Provider value={{ playingId, progress, currentTime, duration, toggle, stop: stopCurrent, fmt }}>
      {children}
    </AudioCtx.Provider>
  );
}

export function useAudio() {
  return useContext(AudioCtx);
}