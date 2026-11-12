export type GarmentType = 'T-Shirt' | 'Sweatshirt' | 'Hoodie'
export type ApparelColor =
  | 'Cream'
  | 'Sage Green'
  | 'Forest Green'
  | 'Terracotta'
export type ApparelSize = 'S' | 'M' | 'L' | 'XL' | '2XL'
export type ApparelDesign = 'Family Tree' | 'Floral' | 'Simple Monogram'
export type ApparelOption = 'garmentType' | 'color' | 'size' | 'design'

export interface ApparelVariantGroup {
  garmentType: GarmentType
  color: ApparelColor
  sizes: ApparelSize[]
  designs: ApparelDesign[]
}

export interface ApparelCustomization {
  variantGroups: ApparelVariantGroup[]
}

export interface ApparelSelections {
  garmentType: GarmentType | ''
  color: ApparelColor | ''
  size: ApparelSize | ''
  design: ApparelDesign | ''
}

export type ProductOptions = Partial<Record<ApparelOption, string>>

export interface ProductPresentation {
  image: string
  imageAlt: string
  apparelCustomization?: ApparelCustomization
}

// Images and customization choices remain sample presentation metadata keyed by API slug.
export const productPresentationBySlug: Record<string, ProductPresentation> = {
  'custom-t-shirt': {
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A classic cotton t-shirt',
    apparelCustomization: {
      variantGroups: [
        {
          garmentType: 'T-Shirt',
          color: 'Cream',
          sizes: ['S', 'M', 'L', 'XL', '2XL'],
          designs: ['Family Tree', 'Floral', 'Simple Monogram'],
        },
        {
          garmentType: 'T-Shirt',
          color: 'Sage Green',
          sizes: ['S', 'M', 'L', 'XL'],
          designs: ['Floral', 'Simple Monogram'],
        },
        {
          garmentType: 'T-Shirt',
          color: 'Forest Green',
          sizes: ['M', 'L', 'XL', '2XL'],
          designs: ['Family Tree', 'Simple Monogram'],
        },
        {
          garmentType: 'T-Shirt',
          color: 'Terracotta',
          sizes: ['S', 'M', 'L'],
          designs: ['Family Tree', 'Floral'],
        },
      ],
    },
  },
  'custom-sweatshirt': {
    image:
      'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A soft neutral sweatshirt',
    apparelCustomization: {
      variantGroups: [
        {
          garmentType: 'Sweatshirt',
          color: 'Cream',
          sizes: ['S', 'M', 'L', 'XL'],
          designs: ['Family Tree', 'Floral'],
        },
        {
          garmentType: 'Sweatshirt',
          color: 'Sage Green',
          sizes: ['S', 'M', 'L', 'XL', '2XL'],
          designs: ['Floral', 'Simple Monogram'],
        },
        {
          garmentType: 'Sweatshirt',
          color: 'Forest Green',
          sizes: ['M', 'L', 'XL', '2XL'],
          designs: ['Family Tree', 'Simple Monogram'],
        },
        {
          garmentType: 'Sweatshirt',
          color: 'Terracotta',
          sizes: ['S', 'M', 'L'],
          designs: ['Floral'],
        },
      ],
    },
  },
  'custom-hoodie': {
    image:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A casual hoodie in a warm neutral shade',
    apparelCustomization: {
      variantGroups: [
        {
          garmentType: 'Hoodie',
          color: 'Cream',
          sizes: ['S', 'M', 'L', 'XL', '2XL'],
          designs: ['Family Tree', 'Simple Monogram'],
        },
        {
          garmentType: 'Hoodie',
          color: 'Sage Green',
          sizes: ['S', 'M', 'L', 'XL'],
          designs: ['Floral', 'Simple Monogram'],
        },
        {
          garmentType: 'Hoodie',
          color: 'Forest Green',
          sizes: ['M', 'L', 'XL', '2XL'],
          designs: ['Family Tree', 'Floral', 'Simple Monogram'],
        },
        {
          garmentType: 'Hoodie',
          color: 'Terracotta',
          sizes: ['S', 'M', 'L'],
          designs: ['Floral', 'Simple Monogram'],
        },
      ],
    },
  },
  'handmade-tote-bag': {
    image:
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A structured everyday tote bag',
  },
  'scrunchie-set': {
    image:
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Colorful fabric accessories',
  },
  'leather-keyring': {
    image:
      'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Handcrafted leather accessories',
  },
  'patchwork-scarf': {
    image:
      'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'A patterned scarf in soft colors',
  },
}
