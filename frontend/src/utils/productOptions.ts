import type {
  ApparelDesign,
  ApparelOption,
  ApparelSelections,
  ApparelSize,
  ProductOptions,
} from '../data/products'
import type { Product } from '../types/product'

export const apparelOptionOrder: ApparelOption[] = [
  'garmentType',
  'color',
  'size',
  'design',
]

export function isApparelSelectionValid(
  product: Product,
  selections: ApparelSelections,
): boolean {
  const { apparelCustomization } = product
  if (!apparelCustomization) return false

  return apparelCustomization.variantGroups.some(
    ({ garmentType, color, sizes, designs }) =>
      garmentType === selections.garmentType &&
      color === selections.color &&
      sizes.includes(selections.size as (typeof sizes)[number]) &&
      designs.includes(selections.design as (typeof designs)[number]),
  )
}

export function getAvailableOptionValues(
  product: Product,
  option: ApparelOption,
  selections: ApparelSelections,
): string[] {
  const { apparelCustomization } = product
  if (!apparelCustomization) return []

  const priorOptions = apparelOptionOrder.slice(
    0,
    apparelOptionOrder.indexOf(option),
  )
  const matchingGroups = apparelCustomization.variantGroups.filter((group) =>
    priorOptions.every((priorOption) => {
      const selectedValue = selections[priorOption]
      if (!selectedValue) return true

      switch (priorOption) {
        case 'garmentType':
          return group.garmentType === selectedValue
        case 'color':
          return group.color === selectedValue
        case 'size':
          return group.sizes.includes(selectedValue as ApparelSize)
        case 'design':
          return group.designs.includes(selectedValue as ApparelDesign)
      }
    }),
  )

  if (option === 'size') {
    return [...new Set(matchingGroups.flatMap((group) => group.sizes))]
  }
  if (option === 'design') {
    return [...new Set(matchingGroups.flatMap((group) => group.designs))]
  }

  if (option === 'garmentType') {
    return [...new Set(matchingGroups.map((group) => group.garmentType))]
  }

  return [...new Set(matchingGroups.map((group) => group.color))]
}

export function updateApparelSelection(
  selections: ApparelSelections,
  option: ApparelOption,
  value: string,
): ApparelSelections {
  const changedOptionIndex = apparelOptionOrder.indexOf(option)
  const nextSelections = { ...selections, [option]: value }

  for (const laterOption of apparelOptionOrder.slice(changedOptionIndex + 1)) {
    nextSelections[laterOption] = ''
  }

  return nextSelections
}

export function toProductOptions(
  selections: ApparelSelections,
): ProductOptions {
  return {
    garmentType: selections.garmentType,
    color: selections.color,
    size: selections.size,
    design: selections.design,
  }
}
