import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, ChefHat, Home, ShoppingBag, Sparkles, UtensilsCrossed } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { BottomNav, type NavItem } from '@/components/ui/BottomNav';
import { SplashIntro } from '@/components/ui/SplashIntro';
import { HomeScreen } from './HomeScreen';
import { MenuScreen } from './MenuScreen';
import { ItemSheet } from './ItemSheet';
import { BuilderScreen, type BuiltItem } from './BuilderScreen';
import { LoyaltyScreen } from './LoyaltyScreen';
import { BookingScreen } from './BookingScreen';
import { CartScreen } from './CartScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { SuccessScreen } from './SuccessScreen';
import { StoryViewer } from './StoriesBar';
import { builtLineKey, type CafeCartMeta } from './cartLine';
import { getAvailableModes, type OrderMode } from '../orderModes';
import type { CafeConfig, CafeMenuItem } from '../types';

type Tab = 'home' | 'menu' | 'builder' | 'loyalty' | 'booking' | 'cart';
type Overlay = 'none' | 'checkout' | 'success';

function stampsStorageKey(clientId: string) {
  return `loyalty-stamps:${clientId}`;
}

function readStamps(clientId: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(stampsStorageKey(clientId));
    return raw === null ? fallback : Number(raw) || 0;
  } catch {
    return fallback;
  }
}

export function PremiumCafeApp({ config }: { config: CafeConfig }) {
  const [showSplash, setShowSplash] = useState(true);
  const [tab, setTab] = useState<Tab>('home');
  const [overlay, setOverlay] = useState<Overlay>('none');
  const [activeCategory, setActiveCategory] = useState(config.categories[0]);
  const [sheetItem, setSheetItem] = useState<CafeMenuItem | null>(null);
  const [storyIndex, setStoryIndex] = useState<number | null>(null);
  const [orderNumber, setOrderNumber] = useState('');

  const loyalty = config.modules?.loyalty;
  const [stamps, setStamps] = useState(() =>
    loyalty ? readStamps(config.clientId, loyalty.demoStamps ?? 0) : 0,
  );

  useEffect(() => {
    if (!loyalty) return;
    try {
      localStorage.setItem(stampsStorageKey(config.clientId), String(stamps));
    } catch {
      // приватный режим браузера — демо продолжает работать без сохранения
    }
  }, [stamps, loyalty, config.clientId]);

  const availableModes = useMemo(() => getAvailableModes(config.features), [config.features]);
  const [orderMode, setOrderMode] = useState<OrderMode>(availableModes[0] ?? 'pickup');

  const cart = useCart<CafeCartMeta>();
  const cartTotal = cart.items.reduce((sum, line) => sum + line.qty * line.meta.price, 0);

  const stories = config.modules?.stories ?? [];
  const builder = config.modules?.builder;
  const booking = config.modules?.booking;

  const navItems: NavItem[] = [
    { id: 'home', label: 'Главная', icon: Home },
    { id: 'menu', label: 'Меню', icon: UtensilsCrossed },
    ...(builder ? [{ id: 'builder', label: 'Собрать', icon: ChefHat }] : []),
    ...(loyalty ? [{ id: 'loyalty', label: 'Бонусы', icon: Sparkles }] : []),
    ...(booking ? [{ id: 'booking', label: 'Бронь', icon: CalendarCheck }] : []),
    { id: 'cart', label: 'Корзина', icon: ShoppingBag, badge: cart.count || undefined },
  ];

  const addMenuItem = (item: CafeMenuItem, qty: number) => {
    cart.add(item.id, { name: item.name, price: item.price, imageUrl: item.imageUrl }, qty);
  };

  const addBuiltItem = (built: BuiltItem) => {
    cart.add(builtLineKey(built.name, built.summary), {
      name: built.name,
      price: built.price,
      imageUrl: built.imageUrl,
      summary: built.summary,
    });
    setTab('cart');
  };

  if (overlay === 'checkout') {
    return (
      <CheckoutScreen
        config={config}
        total={cartTotal}
        orderMode={orderMode}
        onBack={() => setOverlay('none')}
        onConfirm={() => {
          setOrderNumber(String(Math.floor(1000 + Math.random() * 9000)));
          if (loyalty) setStamps((s) => s + 1);
          setOverlay('success');
        }}
      />
    );
  }

  if (overlay === 'success') {
    return (
      <SuccessScreen
        config={config}
        orderNumber={orderNumber}
        stampAwarded={Boolean(loyalty)}
        onDone={() => {
          cart.clear();
          setOverlay('none');
          setTab('home');
        }}
      />
    );
  }

  return (
    <div className="h-full relative bg-app">
      {showSplash && (
        <SplashIntro
          name={config.business.name}
          logoUrl={config.business.logoUrl}
          tagline={config.style?.splashTagline ?? config.business.tagline}
          onDone={() => setShowSplash(false)}
        />
      )}

      <div className="h-full">
        {tab === 'home' && (
          <HomeScreen
            config={config}
            onSelectItem={setSheetItem}
            onOpenStory={setStoryIndex}
            onOpenBuilder={builder ? () => setTab('builder') : undefined}
            onOpenCategory={(category) => {
              setActiveCategory(category);
              setTab('menu');
            }}
          />
        )}

        {tab === 'menu' && (
          <MenuScreen
            config={config}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            onSelectItem={setSheetItem}
          />
        )}

        {tab === 'builder' && builder && (
          <BuilderScreen builder={builder} currency={config.business.currency} onAdd={addBuiltItem} />
        )}

        {tab === 'loyalty' && loyalty && (
          <LoyaltyScreen
            loyalty={loyalty}
            stamps={stamps}
            businessName={config.business.name}
            logoUrl={config.business.logoUrl}
          />
        )}

        {tab === 'booking' && booking && <BookingScreen booking={booking} businessName={config.business.name} />}

        {tab === 'cart' && (
          <CartScreen
            config={config}
            lines={cart.items}
            total={cartTotal}
            onAdd={(line) => cart.add(line.key, line.meta)}
            onRemove={(key) => cart.remove(key)}
            onCheckout={() => setOverlay('checkout')}
            orderMode={orderMode}
            setOrderMode={setOrderMode}
            availableModes={availableModes}
          />
        )}
      </div>

      <ItemSheet
        item={sheetItem}
        currency={config.business.currency}
        onClose={() => setSheetItem(null)}
        onAdd={addMenuItem}
      />

      {storyIndex !== null && stories.length > 0 && (
        <StoryViewer
          stories={stories}
          startIndex={storyIndex}
          onClose={() => setStoryIndex(null)}
          onCta={() => {
            setStoryIndex(null);
            setTab('menu');
          }}
        />
      )}

      <BottomNav items={navItems} active={tab} onSelect={(id) => setTab(id as Tab)} />
    </div>
  );
}
