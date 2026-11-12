import { useEffect, useMemo, useState } from 'react'
import type { ProductOptions } from './data/products'
import { fetchProducts } from './api/products'
import { CollectionCard } from './components/CollectionCard'
import { ProductDetailDialog } from './components/ProductDetailDialog'
import { ProductCard } from './components/ProductCard'
import { StoreFooter } from './components/StoreFooter'
import { StoreHeader } from './components/StoreHeader'
import {
  addCartLine,
  getCartSubtotal,
  removeCartLine,
  setCartLineQuantity,
  type CartLine,
} from './utils/cart'
import type { Product } from './types/product'
import './App.css'

const collections = [
  {
    name: 'Wearables',
    description: 'Everyday favorites, made a little more you.',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'Thoughtfully styled handmade clothing',
    href: '#products',
  },
  {
    name: 'Bags & Wearables',
    description: 'Useful, lovely things to take along.',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1100&q=85',
    imageAlt: 'A beautifully made everyday bag',
    href: '#products',
  },
]

function App() {
  const [cartItems, setCartItems] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [catalogError, setCatalogError] = useState(false)
  const [catalogAttempt, setCatalogAttempt] = useState(0)
  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  )
  const cartSubtotal = useMemo(() => getCartSubtotal(cartItems), [cartItems])

  useEffect(() => {
    let active = true
    setCatalogLoading(true)
    setCatalogError(false)

    fetchProducts()
      .then((products) => {
        if (active) setCatalogProducts(products)
      })
      .catch(() => {
        if (active) {
          setCatalogProducts([])
          setCatalogError(true)
        }
      })
      .finally(() => {
        if (active) setCatalogLoading(false)
      })

    return () => {
      active = false
    }
  }, [catalogAttempt])

  function addToCart(product: Product, options: ProductOptions) {
    setCartItems((currentItems) => addCartLine(currentItems, product, options))
    setCartOpen(true)
    setSelectedProduct(null)
  }

  return (
    <>
      <div className="announcement">
        A little handmade, a lot of heart <span aria-hidden="true">✦</span>
      </div>
      <StoreHeader
        cartCount={cartCount}
        cartItems={cartItems}
        cartSubtotal={cartSubtotal}
        cartOpen={cartOpen}
        onCartToggle={() => setCartOpen((open) => !open)}
        onCartClose={() => setCartOpen(false)}
        onQuantityChange={(key, quantity) =>
          setCartItems((currentItems) =>
            setCartLineQuantity(currentItems, key, quantity),
          )
        }
        onRemoveItem={(key) =>
          setCartItems((currentItems) => removeCartLine(currentItems, key))
        }
      />

      <main>
        <section className="hero page-width" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">✳</span> MADE WITH LOVE, JUST FOR YOU</p>
            <h1 id="hero-title">
              Made by hand.
              <br />
              Made to be <em>loved.</em>
            </h1>
            <p className="hero-description">
              Welcome to FamilyOfSix, a family-owned shop for handmade
              treasures, thoughtful details, and everyday things with a little
              extra heart.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#collections">
                Shop collections <span aria-hidden="true">↗</span>
              </a>
              <a className="text-link" href="#about">
                Get to know us <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="hero-note">
              <span className="hero-note-star" aria-hidden="true">✦</span>
              <span>Small-batch goods, made with a whole lot of care</span>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1400&q=90"
              alt="A bright, creative workspace filled with handmade details"
            />
            <div className="hero-sticker" aria-label="Handmade with love">
              <span aria-hidden="true">✳</span>
              <span>handmade<br />with love</span>
            </div>
            <p className="hero-caption">A little something special, from our hands to yours.</p>
          </div>
        </section>

        <section
          className="collections-section section-padding"
          id="collections"
          aria-labelledby="collections-title"
        >
          <div className="page-width">
            <div className="section-heading">
              <div>
                <p className="eyebrow">FIND YOUR SOMETHING</p>
                <h2 id="collections-title">A collection for every kind of day</h2>
              </div>
              <p className="section-intro">
                Little handmade things that bring a bit of joy to the everyday.
              </p>
            </div>
            <div className="collection-grid">
              {collections.map((collection, index) => (
                <CollectionCard
                  key={collection.name}
                  collection={collection}
                  index={index + 1}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="products-section section-padding page-width"
          id="products"
          aria-labelledby="products-title"
        >
          <div className="section-heading products-heading">
            <div>
              <p className="eyebrow">A FEW FAVORITES</p>
              <h2 id="products-title">Made to make you smile</h2>
            </div>
            <span className="product-count">
              {catalogProducts.length}{' '}
              {catalogProducts.length === 1 ? 'little thing' : 'little things'} to love
            </span>
          </div>
          <p className="sample-notice">
            Sample catalog prices are placeholders and are not checkout pricing.
          </p>
          {catalogLoading ? (
            <div className="catalog-state" role="status">
              Loading our little collection…
            </div>
          ) : catalogError ? (
            <div className="catalog-state catalog-state-error" role="alert">
              <p>We couldn’t load the product catalog. Check the API connection and try again.</p>
              <button
                className="button button-primary"
                type="button"
                onClick={() => setCatalogAttempt((attempt) => attempt + 1)}
              >
                Try again <span aria-hidden="true">↻</span>
              </button>
            </div>
          ) : catalogProducts.length === 0 ? (
            <div className="catalog-state" role="status">
              No products are available right now. Please check back soon.
            </div>
          ) : (
            <div className="product-grid">
              {catalogProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="about-inner page-width">
            <div className="about-ornament" aria-hidden="true">✳</div>
            <div className="about-copy">
              <p className="eyebrow">A LITTLE ABOUT US</p>
              <h2 id="about-title">A family shop, with room for a little creativity.</h2>
              <p>
                FamilyOfSix is a family-owned handmade-goods shop built around
                creativity, thoughtful details, and the joy of making. We love
                creating things that feel personal, useful, and made to be
                enjoyed every day.
              </p>
              <a className="text-link" href="#footer">
                A warm hello from our family <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="about-image">
              <img
                src="https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85"
                alt="A maker's hands sketching a creative idea"
                loading="lazy"
              />
              <span>Made with intention</span>
            </div>
          </div>
        </section>
      </main>

      {selectedProduct && (
        <ProductDetailDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}

      <StoreFooter />
    </>
  )
}

export default App
