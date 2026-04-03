import ProductCard from './ProductCard';

export default function ProductGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((product) =>
        <ProductCard key={product.id} product={product} />
      )}
    </div>);

}