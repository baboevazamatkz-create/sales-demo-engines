import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { applyTheme } from '@/lib/theme';
import { MenuScreen } from './MenuScreen';
import { ItemDetailScreen } from '@/components/screens/ItemDetailScreen';
import { CartScreen } from './CartScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { SuccessScreen } from './SuccessScreen';
import { getAvailableModes } from './orderModes';
import type { OrderMode } from './orderModes';
import type { CafeConfig, CafeMenuItem } from './types';

type Screen = 'menu' | 'item' | 'cart' | 'checkout' | 'success';

export function CafeRestaurantEngine({ config }: { config: CafeConfig }) {
  useEffect(() => applyTheme(config.theme), [config.theme]);

  const [screen, setScreen] = useState<Screen>('menu');
  const [activeCategory, setActiveCategory] = useState(config.categories[0]);
  const [selectedItem, setSelectedItem] = useState<CafeMenuItem | null>(null);

  const availableModes = useMemo(() => getAvailableModes(config.features), [config.features]);
  const [orderMode, setOrderMode] = useState<OrderMode>(availableModes[0] ?? 'pickup');

  const cart = useCart<CafeMenuItem>();

  const cartItems = cart.items.map((line) => ({ ...line.meta, qty: line.qty }));
  const cartTotal = cartItems.reduce((sum, item) => sum + item.qty * item.price, 0);
  const filteredItems = config.items.filter((i) => i.category === activeCategory);

  return (
    <div className="flex flex-col h-full">
      {screen === 'menu' && (
        <MenuScreen
          config={config}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          items={filteredItems}
          onSelectItem={(item) => {
            setSelectedItem(item);
            setScreen('item');
          }}
          cartCount={cart.count}
          onOpenCart={() => setScreen('cart')}
        />
      )}

      {screen === 'item' && selectedItem && (
        <ItemDetailScreen
          item={selectedItem}
          currency={config.business.currency}
          onBack={() => setScreen('menu')}
          onAdd={(qty) => {
            cart.add(String(selectedItem.id), selectedItem, qty);
            setScreen('menu');
          }}
        />
      )}

      {screen === 'cart' && (
        <CartScreen
          config={config}
          items={cartItems}
          total={cartTotal}
          onBack={() => setScreen('menu')}
          onAdd={(id) => {
            const item = config.items.find((i) => i.id === id);
            if (item) cart.add(id, item);
          }}
          onRemove={(id) => cart.remove(id)}
          onCheckout={() => setScreen('checkout')}
          orderMode={orderMode}
          setOrderMode={setOrderMode}
          availableModes={availableModes}
        />
      )}

      {screen === 'checkout' && (
        <CheckoutScreen
          config={config}
          total={cartTotal}
          orderMode={orderMode}
          onBack={() => setScreen('cart')}
          onConfirm={() => setScreen('success')}
        />
      )}

      {screen === 'success' && (
        <SuccessScreen
          config={config}
          onDone={() => {
            cart.clear();
            setScreen('menu');
          }}
        />
      )}
    </div>
  );
}
