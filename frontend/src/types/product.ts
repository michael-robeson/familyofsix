import type { ApparelCustomization } from '../data/products'

export interface Product {
  id: string
  slug: string
  name: string
  description: string | null
  category: string
  basePriceCents: number
  currency: string
  isCustomizable: boolean
  image?: string
  imageAlt?: string
  apparelCustomization?: ApparelCustomization
}
