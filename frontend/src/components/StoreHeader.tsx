import type { CartLine } from '../utils/cart'
import { formatPrice } from '../utils/formatPrice'

interface StoreHeaderProps {
  cartCount: number
  cartItems: CartLine[]
  cartSubtotal: number
  cartOpen: boolean
  onCartToggle: () => void
  onCartClose: () => void
  onQuantityChange: (key: string, quantity: number) => void
  onRemoveItem: (key: string) => void
}

export function StoreHeader({
  cartCount,
  cartItems,
  cartSubtotal,
  cartOpen,
  onCartToggle,
  onCartClose,
  onQuantityChange,
  onRemoveItem,
}: StoreHeaderProps) {
  return (
    <header className="site-header">
      <div className="header-inner page-width">
        <a className="brand" href="#" aria-label="FamilyOfSix home">
          <span className="brand-mark" aria-hidden="true">f<span>✳</span></span>
          <span className="brand-copy">
            <span className="brand-name">FamilyOfSix</span>
            <span className="brand-tagline">HANDMADE WITH HEART</span>
          </span>
        </a>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <div className="cart-anchor">
            <button
              className="cart-toggle"
              type="button"
              onClick={onCartToggle}
              aria-expanded={cartOpen}
              aria-controls="cart-popover"
            >
              Shopping Cart <span className="cart-count">{cartCount}</span>
            </button>
            {cartOpen && (
              <div className="cart-popover" id="cart-popover">
                <div className="cart-popover-heading">
                  <strong>Your sample cart</strong>
                  <button
                    className="cart-close"
                    type="button"
                    onClick={onCartClose}
                    aria-label="Close shopping cart"
                  >
                    ×
                  </button>
                </div>
                {cartItems.length === 0 ? (
                  <p className="cart-empty">Your bag is waiting for something lovely.</p>
                ) : (
                  <>
                    <ul className="cart-items" aria-live="polite">
                      {cartItems.map((item) => (
                        <li key={item.key}>
                          <div className="cart-item-details">
                            <strong>{item.name}</strong>
                            {Object.entries(item.options).map(([name, value]) => (
                              <span className="cart-item-option" key={name}>
                                {name === 'garmentType'
                                  ? 'Garment'
                                  : name === 'design'
                                    ? 'Design'
                                    : name}
                                : {value}
                              </span>
                            ))}
                            <span className="cart-item-unit">
                              {formatPrice(item.unitPriceCents, item.currency)}* each
                            </span>
                          </div>
                          <div className="cart-item-controls">
                            <div className="quantity-control" aria-label={`Quantity for ${item.name}`}>
                              <button
                                type="button"
                                onClick={() =>
                                  onQuantityChange(item.key, item.quantity - 1)
                                }
                                disabled={item.quantity <= 1}
                                aria-label={`Decrease ${item.name} quantity`}
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  onQuantityChange(item.key, item.quantity + 1)
                                }
                                aria-label={`Increase ${item.name} quantity`}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="cart-remove"
                              type="button"
                              onClick={() => onRemoveItem(item.key)}
                            >
                              Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="cart-placeholder">
                  Sample subtotal{' '}
                  <strong>
                    {formatPrice(cartSubtotal, cartItems[0]?.currency ?? 'USD')}*
                  </strong>
                </p>
                <p className="cart-disclaimer">
                  Sample cart and placeholder prices only. No checkout or payment is available.
                </p>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
