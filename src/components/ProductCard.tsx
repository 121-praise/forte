import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden rounded bg-secondary mb-3">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          width={800}
          height={800}
        />
        {product.tag && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-body tracking-wide bg-gold text-accent-foreground rounded">
            {product.tag}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <span className="font-body text-sm tracking-wide text-foreground">Out of Stock</span>
          </div>
        )}
      </Link>
      <div className="flex justify-between items-start gap-2">
        <div>
          <h3 className="font-body text-sm font-medium text-foreground leading-snug">{product.name}</h3>
          <p className="text-sm text-gold font-medium mt-1">{formatPrice(product.price)}</p>
        </div>
        {product.inStock && (
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="p-2 rounded border border-border text-muted-foreground hover:text-gold hover:border-gold transition-colors"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
