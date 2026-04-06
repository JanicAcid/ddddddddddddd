// ============================================================================
// ЦЕНЫ КАРТОЧЕК ТОВАРОВ
// ============================================================================

export function getProductCardPrice(count: number): number {
  if (count <= 100) return 80
  if (count <= 500) return 60
  return 40
}

export function getProductCardPriceLabel(count: number): string {
  if (count <= 100) return '80 руб./шт.'
  if (count <= 500) return '60 руб./шт.'
  return '40 руб./шт.'
}
