import { useEffect, useMemo, useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { applyTheme } from '@/lib/theme';
import { CatalogScreen } from './CatalogScreen';
import { ProductScreen } from './ProductScreen';
import { CartScreen } from './CartScreen';
import { CheckoutScreen } from './CheckoutScreen';
import { SuccessScreen } from './SuccessScreen';
import { buildLineKey, type RetailCartMeta } from './cartLine';
import type { RetailConfig, RetailProduct } from './types';

type Screen = 'catalog' | 'product' | 'cart' | 'checkout' | 'success';

function randomOrderNumber(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function RetailEngine({ config }: { config: RetailConfig }) {
  useEffect(() => applyTheme(config.theme), [config.theme]);

  const [screen, setScreen] = useState<Screen>('catalog');
  const [activeCategory, setActiveCategory] = useState(config.categories[0]);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [selectedProduct, setSelectedProduct] = useState<RetailProduct | null>(null);
  const [shippingMethodId, setShippingMethodId] = useState(config.shippingMethods[0]?.id ?? '');
  const [orderNumber, setOrderNumber] = useState('');

  const cart = useCart<RetailCartMeta>();

  const toggleFilter = (id: string) =>
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const filteredProducts = useMemo(() => {
    const activeTags = (config.filters ?? []).filter((f) => activeFilters.has(f.id)).map((f) => f.tag);
    return config.products.filter((p) => {
      if (p.category !== activeCategory) return false;
      if (activeTags.length === 0) return true;
      return activeTags.every((tag) => p.tags?.includes(tag));
    });
  }, [config.products, config.filters, activeCategory, activeFilters]);

  const cartTotal = cart.items.reduce((sum, line) => sum + line.qty * line.meta.product.price, 0);

  return (
    <div className="flex flex-col h-full">
      {screen === 'catalog' && (
        <CatalogScreen
          config={config}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeFilters={activeFilters}
          toggleFilter={toggleFilter}
          items={filteredProducts}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            setScreen('product');
          }}
          cartCount={cart.count}
          onOpenCart={() => setScreen('cart')}
        />
      )}

      {screen === 'product' && selectedProduct && (
        <ProductScreen
          product={selectedProduct}
          currency={config.business.currency}
          onBack={() => setScreen('catalog')}
          onAdd={(qty, selection) => {
            const key = buildLineKey(selectedProduct.id, selection);
            cart.add(key, { product: selectedProduct, selection }, qty);
            setScreen('catalog');
          }}
        />
      )}

      {screen === 'cart' && (
        <CartScreen
          config={config}
          lines={cart.items}
          total={cartTotal}
          onBack={() => setScreen('catalog')}
          onAdd={(line) => cart.add(line.key, line.meta)}
          onRemove={(key) => cart.remove(key)}
          onCheckout={() => setScreen('checkout')}
          shippingMethodId={shippingMethodId}
          setShippingMethodId={setShippingMethodId}
        />
      )}

      {screen === 'checkout' && (
        <CheckoutScreen
          config={config}
          total={cartTotal}
          shippingMethodId={shippingMethodId}
          onBack={() => setScreen('cart')}
          onConfirm={() => {
            setOrderNumber(randomOrderNumber());
            setScreen('success');
          }}
        />
      )}

      {screen === 'success' && (
        <SuccessScreen
          config={config}
          orderNumber={orderNumber}
          onDone={() => {
            cart.clear();
            setScreen('catalog');
          }}
        />
      )}
    </div>
  );
}
