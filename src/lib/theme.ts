import type { BrandTheme } from '@/types/config';

const LIGHT_SURFACES = {
  bg: '#fafaf9',
  surface: '#ffffff',
  surfaceMuted: '#f5f5f4',
  textPrimary: '#1c1917',
  textMuted: '#78716c',
  border: '#e7e5e4',
};

const DARK_SURFACES = {
  bg: '#120b0c',
  surface: '#1c1314',
  surfaceMuted: '#251a1c',
  textPrimary: '#f7f1e8',
  textMuted: '#a79a92',
  border: '#332427',
};

const DEFAULT_THEME: BrandTheme = {
  primary: '#064e3b',
  primarySoft: '#d1fae5',
  primaryContrast: '#ecfdf5',
  accent: '#fbbf24',
  imageGradientFrom: '#d1fae5',
  imageGradientTo: '#fef3c7',
};

/** "#6b1f2a" → "107 31 42". Tailwind умеет подмешивать прозрачность
 * (bg-surface/90) только к цвету, записанному тройкой каналов, поэтому
 * каждый токен кладётся и в hex (для color-mix в CSS), и в тройку. */
function toRgbTriple(hex: string): string {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const int = parseInt(full, 16);
  if (Number.isNaN(int) || full.length !== 6) return '0 0 0';
  return `${(int >> 16) & 255} ${(int >> 8) & 255} ${int & 255}`;
}

/** Writes a client's brand colors onto :root as CSS custom properties so
 * Tailwind's `brand` / `accent` / surface utilities pick them up without a
 * rebuild — this is what lets a config swap the entire look & feel. */
export function applyTheme(theme: Partial<BrandTheme> = {}) {
  const merged: BrandTheme = { ...DEFAULT_THEME, ...theme };
  const surfaces = merged.mood === 'dark' ? DARK_SURFACES : LIGHT_SURFACES;
  const root = document.documentElement.style;

  const set = (name: string, value: string) => {
    root.setProperty(`--color-${name}`, value);
    root.setProperty(`--color-${name}-rgb`, toRgbTriple(value));
  };

  set('primary', merged.primary);
  set('primary-soft', merged.primarySoft);
  set('primary-contrast', merged.primaryContrast ?? merged.primarySoft);
  set('accent', merged.accent);
  set('bg', merged.bg ?? surfaces.bg);
  set('surface', merged.surface ?? surfaces.surface);
  set('surface-muted', merged.surfaceMuted ?? surfaces.surfaceMuted);
  set('text', merged.textPrimary ?? surfaces.textPrimary);
  set('text-muted', merged.textMuted ?? surfaces.textMuted);
  set('line', merged.border ?? surfaces.border);

  root.setProperty('--img-gradient-from', merged.imageGradientFrom);
  root.setProperty('--img-gradient-from-rgb', toRgbTriple(merged.imageGradientFrom));
  root.setProperty('--img-gradient-to', merged.imageGradientTo);
  root.setProperty('--img-gradient-to-rgb', toRgbTriple(merged.imageGradientTo));

  document.documentElement.dataset.mood = merged.mood ?? 'light';
}

/** Фоновая геометрия заведения. Рисунок задаётся в конфиге (style.pattern),
 * кладётся на :root переменными и подхватывается классом .ornament — так у
 * каждого клиента своя текстура без правки компонентов. */
const PATTERNS: Record<string, { image: string; size: string }> = {
  // Турецкая решётка: ромбы 45° с точкой в центре ячейки.
  turkish: {
    image: `radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--color-accent) 22%, transparent) 1.2px, transparent 1.3px),
      repeating-linear-gradient(45deg, color-mix(in srgb, var(--color-accent) 7%, transparent) 0 1px, transparent 1px 22px),
      repeating-linear-gradient(-45deg, color-mix(in srgb, var(--color-accent) 7%, transparent) 0 1px, transparent 1px 22px)`,
    size: '22px 22px',
  },
  // Горы Алтая: острые пики 60° и «снежные» точки над ними.
  mountains: {
    image: `radial-gradient(circle at 50% 14%, color-mix(in srgb, var(--color-accent) 26%, transparent) 1.1px, transparent 1.2px),
      repeating-linear-gradient(62deg, color-mix(in srgb, var(--color-accent) 9%, transparent) 0 1.2px, transparent 1.2px 30px),
      repeating-linear-gradient(-62deg, color-mix(in srgb, var(--color-accent) 9%, transparent) 0 1.2px, transparent 1.2px 30px)`,
    size: '34px 30px',
  },
  // Шахматка — как в айдентике кафе с клетчатой рамкой.
  checker: {
    image: `repeating-conic-gradient(color-mix(in srgb, var(--color-primary) 6%, transparent) 0% 25%, transparent 0% 50%)`,
    size: '44px 44px',
  },
  // Ровная сетка — для нейтральных, «городских» брендов.
  grid: {
    image: `linear-gradient(color-mix(in srgb, var(--color-accent) 8%, transparent) 1px, transparent 1px),
      linear-gradient(90deg, color-mix(in srgb, var(--color-accent) 8%, transparent) 1px, transparent 1px)`,
    size: '26px 26px',
  },
};

export function applyPattern(pattern?: string) {
  const chosen = PATTERNS[pattern ?? 'turkish'] ?? PATTERNS.turkish;
  const root = document.documentElement.style;
  root.setProperty('--ornament-image', chosen.image);
  root.setProperty('--ornament-size', chosen.size);
}
