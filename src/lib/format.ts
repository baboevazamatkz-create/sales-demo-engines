export function formatPrice(amount: number, currency: string): string {
  return `${amount.toLocaleString('ru-RU')} ${currency}`;
}
