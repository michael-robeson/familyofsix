import type { Product } from '../types/product'
import { formatPrice } from '../utils/formatPrice'

interface ProductCardProps {
  product: Product
  onSelect: (product: Product) => void
}

export function ProductCard({ product, onSelect }: ProductCardProps) {
  return (
    <button
      className="product-card"
      type="button"
      onClick={() => onSelect(product)}
      aria-label={`View details for ${product.name}`}
    >
      <span className="product-image-wrap">
        {product.image ? (
          <img
            src={product.image}
            alt={product.imageAlt ?? product.name}
            loading="lazy"
          />
        ) : (
          <span className="product-image-placeholder" aria-hidden="true" />
        )}
        {product.isCustomizable && (
          <span className="custom-badge">Made for you</span>
        )}
        <span className="quick-add">View details <span aria-hidden="true">↗</span></span>
      </span>
      <span className="product-info">
        <span className="product-meta">
          <span>{product.category}</span>
          <span className="product-price">
            {formatPrice(product.basePriceCents, product.currency)}*
          </span>
        </span>
        <span className="product-name">{product.name}</span>
        <span className="product-description">{product.description ?? ''}</span>
      </span>
    </button>
  )
}
