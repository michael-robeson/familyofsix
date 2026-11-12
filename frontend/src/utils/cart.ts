import type { ProductOptions } from '../data/products'
import type { Product } from '../types/product'

export interface CartLine {
  key: string
  productId: string
  name: string
  options: ProductOptions
  quantity: number
  unitPriceCents: number
  currency: string
}

export function getCartLineKey(
  productId: string,
  options: ProductOptions,
): string {
  const normalizedOptions = Object.fromEntries(
    Object.entries(options)
      .filter((entry): entry is [string, string] => Boolean(entry[1]))
      .sort(([left], [right]) => left.localeCompare(right)),
  )

  return `${productId}:${JSON.stringify(normalizedOptions)}`
}

export function addCartLine(
  lines: CartLine[],
  product: Product,
  options: ProductOptions,
): CartLine[] {
  const key = getCartLineKey(product.id, options)
  const existingLine = lines.find((line) => line.key === key)

  if (existingLine) {
    return lines.map((line) =>
      line.key === key ? { ...line, quantity: line.quantity + 1 } : line,
    )
  }

  return [
    ...lines,
    {
      key,
      productId: product.id,
      name: product.name,
      options,
      quantity: 1,
      unitPriceCents: product.basePriceCents,
      currency: product.currency,
    },
  ]
}

export function setCartLineQuantity(
  lines: CartLine[],
  key: string,
  quantity: number,
): CartLine[] {
  return lines.map((line) =>
    line.key === key ? { ...line, quantity: Math.max(1, quantity) } : line,
  )
}

export function removeCartLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((line) => line.key !== key)
}

export function getCartSubtotal(lines: CartLine[]): number {
  return lines.reduce(
    (subtotal, line) => subtotal + line.unitPriceCents * line.quantity,
    0,
  )
}
