import { useCallback, useMemo, useState } from 'react';

export interface CartLine<TMeta> {
  key: string;
  qty: number;
  meta: TMeta;
}

/**
 * Generic cart keyed by a caller-chosen line key (e.g. a product id, or
 * `${productId}::${size}::${color}` for retail variants) so every engine can
 * reuse the same add/remove/qty logic regardless of what a "line" contains.
 */
export function useCart<TMeta>() {
  const [lines, setLines] = useState<Record<string, CartLine<TMeta>>>({});

  const add = useCallback((key: string, meta: TMeta, qty = 1) => {
    setLines((prev) => ({
      ...prev,
      [key]: { key, meta, qty: (prev[key]?.qty ?? 0) + qty },
    }));
  }, []);

  const remove = useCallback((key: string, qty = 1) => {
    setLines((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      if (existing.qty <= qty) {
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: { ...existing, qty: existing.qty - qty } };
    });
  }, []);

  const clear = useCallback(() => setLines({}), []);

  const items = useMemo(() => Object.values(lines), [lines]);
  const count = useMemo(() => items.reduce((sum, l) => sum + l.qty, 0), [items]);

  return { items, count, add, remove, clear };
}
