interface Collection {
  name: string
  description: string
  image: string
  imageAlt: string
  href: string
}

interface CollectionCardProps {
  collection: Collection
  index: number
}

export function CollectionCard({ collection, index }: CollectionCardProps) {
  return (
    <a className={`collection-card collection-card-${index}`} href={collection.href}>
      <img src={collection.image} alt={collection.imageAlt} loading="lazy" />
      <span className="collection-shade" aria-hidden="true" />
      <span className="collection-number">0{index}</span>
      <span className="collection-content">
        <span className="collection-title">{collection.name}</span>
        <span className="collection-description">{collection.description}</span>
      </span>
      <span className="collection-arrow" aria-hidden="true">↗</span>
    </a>
  )
}
