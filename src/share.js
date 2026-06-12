// ---------------------------------------------------------------------------
// Soundiary · 이미지 공유/저장 유틸 (Web Share API + 다운로드 폴백)
// ---------------------------------------------------------------------------

// 터치 기기(모바일/태블릿)에서는 공유 시트를 띄워 인스타·카톡 등으로 바로 공유,
// 데스크톱에서는 기존처럼 PNG 다운로드.
export async function shareOrDownloadImage(dataUrl, filename) {
  const isTouch = (navigator.maxTouchPoints || 0) > 0;
  if (isTouch && navigator.share && navigator.canShare) {
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], filename, { type: 'image/png' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Soundiary' });
        return 'shared';
      }
    } catch (e) {
      if (e && e.name === 'AbortError') return 'cancelled'; // 사용자가 공유 시트를 닫음
      // 그 외 실패는 다운로드로 폴백
    }
  }
  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  link.click();
  return 'downloaded';
}
