import { Link } from "react-router-dom";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const featured = products.filter((p) => p.featured).slice(0, 6);

  return (
    <section className="py-20 md:py-28 bg-card">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
          <div>
            <p className="text-gold text-sm font-body tracking-[0.25em] uppercase mb-3">Curated</p>
            <h2 className="font-display text-3xl md:text-4xl text-foreground">Featured Pieces</h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-body tracking-wide text-muted-foreground hover:text-gold transition-colors"
          >
            View All Products →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
