import { productPresentationBySlug } from '../data/products'
import type { Product } from '../types/product'

interface ApiProduct {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  base_price_cents: number
  currency: string
  is_customizable: boolean
}

function isApiProduct(value: unknown): value is ApiProduct {
  if (typeof value !== 'object' || value === null) return false
  const product = value as Record<string, unknown>

  return (
    typeof product.id === 'string' &&
    typeof product.slug === 'string' &&
    typeof product.name === 'string' &&
    (typeof product.description === 'string' || product.description === null) &&
    typeof product.category === 'string' &&
    typeof product.base_price_cents === 'number' &&
    Number.isInteger(product.base_price_cents) &&
    product.base_price_cents >= 0 &&
    typeof product.currency === 'string' &&
    typeof product.is_customizable === 'boolean'
  )
}

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch('/api/products')
  if (!response.ok) {
    throw new Error(`Catalog request failed with HTTP ${response.status}`)
  }

  const payload: unknown = await response.json()
  if (!Array.isArray(payload) || !payload.every(isApiProduct)) {
    throw new Error('Catalog response has an unexpected format')
  }

  return payload.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    category: product.category,
    basePriceCents: product.base_price_cents,
    currency: product.currency,
    isCustomizable: product.is_customizable,
    ...productPresentationBySlug[product.slug],
  }))
}
