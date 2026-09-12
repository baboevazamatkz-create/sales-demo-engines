/** Строка корзины премиум-движка: и обычная позиция меню, и собранная
 * в конструкторе — у собранной есть summary с составом. */
export interface CafeCartMeta {
  name: string;
  price: number;
  imageUrl?: string;
  summary?: string;
}

export function builtLineKey(name: string, summary: string): string {
  return `built::${name}::${summary}`;
}
