import type { BaseClientConfig } from '@/types/config';

export interface CafeMenuItem {
  id: string;
  category: string;
  name: string;
  desc: string;
  price: number;
  weight?: string;
  imageUrl?: string;
  /** Показывается крупной карточкой в карусели «Хиты» на главной. */
  featured?: boolean;
  /** Плашка на карточке: «Хит», «Новинка», «Острое». */
  badge?: string;
}

/** Сторис-лента заведения: акции, кухня, атмосфера. */
export interface CafeStory {
  id: string;
  title: string;
  imageUrl: string;
  headline?: string;
  text?: string;
  /** Подпись на кнопке внутри сторис. */
  ctaLabel?: string;
  /** Куда ведёт эта кнопка; по умолчанию — в меню. */
  ctaTarget?: 'menu' | 'builder' | 'loyalty' | 'booking';
}

export interface BuilderOption {
  id: string;
  label: string;
  /** Надбавка к базовой цене; 0 — входит в базу. */
  price: number;
  hint?: string;
}

export interface BuilderStep {
  id: string;
  label: string;
  /** Подзаголовок шага, например «Выберите одну основу». */
  hint?: string;
  type: 'single' | 'multi';
  /** Для multi: максимум одновременно выбранных. */
  max?: number;
  options: BuilderOption[];
}

/** Конструктор блюда: пошаговая сборка с живым пересчётом цены. */
export interface BuilderModule {
  title: string;
  subtitle?: string;
  /** Как называется собранная позиция в корзине. */
  itemName: string;
  basePrice: number;
  imageUrl?: string;
  steps: BuilderStep[];
}

/** Накопительная карта: N штампов — награда. */
export interface LoyaltyModule {
  title: string;
  subtitle?: string;
  stampsRequired: number;
  rewardLabel: string;
  /** Сколько штампов «уже есть» при первом открытии демо — чтобы карта не выглядела пустой. */
  demoStamps?: number;
}

export interface BookingTable {
  id: string;
  label: string;
  seats: number;
  /** vip-кабина рисуется иначе, чем обычный стол в зале. */
  kind: 'table' | 'vip';
  /** Занят — показывается недоступным на схеме. */
  busy?: boolean;
}

export interface BookingZone {
  id: string;
  name: string;
  hint?: string;
  tables: BookingTable[];
}

/** Бронь стола/кабины по интерактивной схеме зала. */
export interface BookingModule {
  title: string;
  subtitle?: string;
  zones: BookingZone[];
  timeSlots: string[];
}

export interface CafeConfig extends BaseClientConfig {
  niche: 'cafe-restaurant';
  /** Which order modes this business offers; the flow adapts to whichever are on. */
  features: {
    delivery: boolean;
    pickup: boolean;
    tableOrder: boolean;
  };
  /** Оболочка приложения: 'classic' — минималистичный флоу меню → заказ,
   *  'premium' — со сплэшем, лентой сторис и модулями. Светлая или тёмная
   *  тема задаётся палитрой (theme.mood), а не пресетом. */
  style?: {
    preset?: 'classic' | 'premium';
    /** Фоновый геометрический орнамент: см. PATTERNS в lib/theme.ts. */
    pattern?: 'turkish' | 'mountains' | 'checker' | 'diamonds' | 'petals' | 'grid';
    /** Текст на сплэш-экране под логотипом. */
    splashTagline?: string;
  };
  /** Опциональные модули — каждый включается наличием своего ключа. */
  modules?: {
    stories?: CafeStory[];
    builder?: BuilderModule;
    loyalty?: LoyaltyModule;
    booking?: BookingModule;
  };
  categories: string[];
  items: CafeMenuItem[];
  paymentMethods?: string[];
}
