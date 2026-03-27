import { useParams, Link } from "react-router-dom";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ArrowLeft, Check, X } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addItem } = useCart();

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-gold font-body text-sm hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <>
      <div className="container py-8 md:py-12">
        <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-gold transition-colors mb-8">
          <ArrowLeft size={16} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded overflow-hidden bg-secondary"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
              width={800}
              height={800}
            />
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            {product.tag && (
              <span className="inline-block px-3 py-1 text-xs font-body tracking-wide bg-gold text-accent-foreground rounded w-fit mb-4">
                {product.tag}
              </span>
            )}
            <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">{product.name}</h1>
            <p className="text-2xl text-gold font-display mb-6">{formatPrice(product.price)}</p>

            <p className="text-muted-foreground font-body text-sm leading-relaxed mb-8">{product.description}</p>

            <div className="space-y-4 mb-8">
              <div className="flex gap-3">
                <span className="text-xs font-body tracking-wide uppercase text-muted-foreground w-20">Material</span>
                <span className="text-sm font-body text-foreground">{product.material}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs font-body tracking-wide uppercase text-muted-foreground w-20">Size</span>
                <span className="text-sm font-body text-foreground">{product.dimensions}</span>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-xs font-body tracking-wide uppercase text-muted-foreground w-20">Stock</span>
                {product.inStock ? (
                  <span className="flex items-center gap-1 text-sm font-body text-green-700">
                    <Check size={14} /> In Stock
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm font-body text-destructive">
                    <X size={14} /> Out of Stock
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => product.inStock && addItem(product)}
              disabled={!product.inStock}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-body text-sm tracking-wide hover:bg-charcoal transition-colors rounded disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>

            <p className="text-xs text-muted-foreground font-body mt-4">
              Free delivery on orders above ₦150,000 within Lagos
            </p>
          </motion.div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-20 md:mt-28">
            <h2 className="font-display text-2xl text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {related.map((p) => (
                <Link key={p.id} to={`/product/${p.id}`} className="group">
                  <div className="aspect-square rounded overflow-hidden bg-secondary mb-3">
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width={800}
                      height={800}
                    />
                  </div>
                  <h3 className="font-body text-sm text-foreground">{p.name}</h3>
                  <p className="text-sm text-gold font-medium mt-1">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
