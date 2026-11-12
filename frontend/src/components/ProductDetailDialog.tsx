import { useState } from 'react'
import type {
  ApparelOption,
  ApparelSelections,
  ProductOptions,
} from '../data/products'
import type { Product } from '../types/product'
import { formatPrice } from '../utils/formatPrice'
import {
  apparelOptionOrder,
  getAvailableOptionValues,
  isApparelSelectionValid,
  toProductOptions,
  updateApparelSelection,
} from '../utils/productOptions'

interface ProductDetailDialogProps {
  product: Product
  onClose: () => void
  onAddToCart: (product: Product, options: ProductOptions) => void
}

const optionLabels: Record<ApparelOption, string> = {
  garmentType: 'Garment type',
  color: 'Color',
  size: 'Size',
  design: 'Design / logo',
}

const initialSelections: ApparelSelections = {
  garmentType: '',
  color: '',
  size: '',
  design: '',
}

export function ProductDetailDialog({
  product,
  onClose,
  onAddToCart,
}: ProductDetailDialogProps) {
  const [selections, setSelections] =
    useState<ApparelSelections>(initialSelections)
  const [showValidation, setShowValidation] = useState(false)
  const apparel = Boolean(
    product.isCustomizable && product.apparelCustomization,
  )
  const selectionValid =
    !apparel || isApparelSelectionValid(product, selections)

  function handleAdd() {
    if (!selectionValid) {
      setShowValidation(true)
      return
    }

    onAddToCart(product, apparel ? toProductOptions(selections) : {})
  }

  return (
    <div
      className="detail-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="product-detail"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <button
          className="detail-close"
          type="button"
          onClick={onClose}
          aria-label="Close product details"
        >
          ×
        </button>
        <div className="detail-image">
          {product.image ? (
            <img src={product.image} alt={product.imageAlt ?? product.name} />
          ) : (
            <span className="product-image-placeholder" aria-hidden="true" />
          )}
          {product.isCustomizable && (
            <span className="custom-badge">Made for you</span>
          )}
        </div>
        <div className="detail-content">
          <p className="eyebrow">{product.category}</p>
          <h2 id="detail-title">{product.name}</h2>
          <p className="detail-price">
            {formatPrice(product.basePriceCents, product.currency)}*
          </p>
          <p className="detail-description">{product.description}</p>

          {apparel && (
            <div className="apparel-options">
              <p className="options-caption">Choose your sample options</p>
              {apparelOptionOrder.map((option) => {
                const availableValues = getAvailableOptionValues(
                  product,
                  option,
                  selections,
                )
                const isRequired = !selections[option]

                return (
                  <label className="option-field" key={option}>
                    <span>{optionLabels[option]}</span>
                    <select
                      value={selections[option]}
                      onChange={(event) => {
                        setSelections((current) =>
                          updateApparelSelection(
                            current,
                            option,
                            event.target.value,
                          ),
                        )
                        setShowValidation(false)
                      }}
                    >
                      <option value="">Select {optionLabels[option].toLowerCase()}</option>
                      {availableValues.map((value) => (
                        <option value={value} key={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    {showValidation && isRequired && (
                      <span className="field-error">
                        Please select {optionLabels[option].toLowerCase()}.
                      </span>
                    )}
                  </label>
                )
              })}
              <p className="placeholder-disclaimer">
                Sample options and prices only. Available choices may change.
              </p>
            </div>
          )}

          {!apparel && (
            <p className="placeholder-disclaimer">
              Sample product and price only.
            </p>
          )}

          <button
            className="button button-primary detail-add"
            type="button"
            onClick={handleAdd}
          >
            Add to sample cart <span aria-hidden="true">↗</span>
          </button>
          {apparel && !selectionValid && (
            <p className="detail-validation" aria-live="polite">
              Select all available options to add this item.
            </p>
          )}
          <button className="detail-back text-link" type="button" onClick={onClose}>
            ← Back to browsing
          </button>
        </div>
      </section>
    </div>
  )
}
