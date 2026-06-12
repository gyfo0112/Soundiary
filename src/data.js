// ---------------------------------------------------------------------------
// Soundiary · 데이터 정의 (장르 / 무드 / 그라디언트 / 시드)
// ---------------------------------------------------------------------------

export const GENRE_GRADIENTS = {
  'K-Pop':      ['#ff6ec4', '#7873f5'],
  'J-Pop':      ['#f9a8d4', '#c084fc'],
  'Pop':        ['#fb7185', '#f472b6'],
  'Rock':       ['#ff5858', '#f09819'],
  'Hip-Hop':    ['#6a11cb', '#2575fc'],
  'R&B':        ['#c471ed', '#f64f59'],
  'Jazz':       ['#f7971e', '#ffd200'],
  'Classical':  ['#4facfe', '#00f2fe'],
  'Electronic': ['#0acffe', '#495aff'],
  'Indie':      ['#43e97b', '#38f9d7'],
  'Ballad':     ['#a18cd1', '#fbc2eb'],
};

export const GENRES = Object.keys(GENRE_GRADIENTS);

export const MOODS = ['신남', '차분', '설렘', '슬픔', '몽환', '집중', '위로', '그루브'];

export function genreGradient(genre, angle = 180) {
  const pair = GENRE_GRADIENTS[genre] || ['#cbd5e1', '#94a3b8'];
  return 'linear-gradient(' + angle + 'deg, ' + pair[0] + ', ' + pair[1] + ')';
}

export function genreGlow(genre) {
  const pair = GENRE_GRADIENTS[genre] || ['#cbd5e1', '#94a3b8'];
  return pair[0];
}

export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function todayISO() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function fmtDate(iso) {
  if (!iso) return '';
  return iso.replaceAll('-', '.');
}

export const SEED = [
  {
    id: uid(), title: 'Supernova', artist: 'aespa', album: 'Armageddon',
    genre: 'K-Pop', mood: '신남', rating: 5, date: '2026-06-01',
    memo: '도입부 신스가 머릿속에서 안 떠난다. 드라이브할 때 최고.',
    artworkUrl: '',
  },
  {
    id: uid(), title: 'Lover Boy', artist: 'Phum Viphurit', album: 'Manchild',
    genre: 'Indie', mood: '설렘', rating: 5, date: '2026-05-28',
    memo: '봄날 오후에 딱 맞는 따뜻한 기타 팝.',
    artworkUrl: '',
  },
  {
    id: uid(), title: 'Overdose', artist: 'Exo', album: 'Overdose',
    genre: 'K-Pop', mood: '신남', rating: 4, date: '2026-05-20',
    memo: '중독성 있는 훅. 한번 들으면 계속 흥얼거리게 된다.',
    artworkUrl: '',
  },
  {
    id: uid(), title: 'Nights', artist: 'Frank Ocean', album: 'Blonde',
    genre: 'R&B', mood: '몽환', rating: 5, date: '2026-05-15',
    memo: '밤에 혼자 드라이브할 때 꼭 트는 곡.',
    artworkUrl: '',
  },
  {
    id: uid(), title: '夜に駆ける', artist: 'YOASOBI', album: 'THE BOOK',
    genre: 'J-Pop', mood: '슬픔', rating: 5, date: '2026-05-10',
    memo: '멜로디가 너무 아름다워서 처음 들었을 때 소름이 돋았다.',
    artworkUrl: '',
  },
];