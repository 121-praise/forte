import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { Plus, Minus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";

const Cart = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  return (
    <>
      <div className="container py-8 md:py-12 min-h-[70vh]">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={16} /> Continue Shopping
        </Link>

        <h1 className="font-display text-3xl md:text-4xl text-foreground mb-2">Your Cart</h1>
        <p className="text-muted-foreground font-body text-sm mb-10">
          {totalItems} {totalItems === 1 ? "item" : "items"}
        </p>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
            <ShoppingBag size={56} strokeWidth={1} />
            <p className="font-body">Your cart is empty</p>
            <Link
              to="/shop"
              className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-body text-sm tracking-wide hover:bg-charcoal transition-colors rounded"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-0 divide-y divide-border">
              {items.map((item, i) => (
                <motion.div
                  key={item.product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-4 md:gap-6 py-6 first:pt-0"
                >
                  <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded"
                      loading="lazy"
                      width={128}
                      height={128}
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.product.id}`}
                        className="font-body text-sm md:text-base font-medium text-foreground hover:text-gold transition-colors line-clamp-2"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground font-body mt-1 capitalize">
                        {item.product.categories[0]} · {item.product.material}
                      </p>
                      <p className="text-gold font-display text-lg mt-2">{formatPrice(item.product.price)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-body w-6 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-gold transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label="Remove item"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="font-display text-lg text-foreground mb-6">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                    <span className="text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                </div>
                <div className="border-t border-border pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-body text-sm text-foreground font-medium">Total</span>
                    <span className="font-display text-xl text-foreground">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
                <button className="w-full py-3.5 bg-primary text-primary-foreground font-body text-sm tracking-wide hover:bg-charcoal transition-colors rounded mb-3">
                  Proceed to Checkout
                </button>
                <button
                  onClick={clearCart}
                  className="w-full py-2.5 text-sm font-body text-muted-foreground hover:text-destructive transition-colors"
                >
                  Clear Cart
                </button>
                <p className="text-xs text-muted-foreground font-body mt-4 text-center">
                  Free delivery on orders above ₦150,000 within Lagos
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Cart;
