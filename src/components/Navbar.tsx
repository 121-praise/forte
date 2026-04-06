import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/data/products";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { to: "/", label: "Home", category: null },
  { to: "/shop", label: "Shop", category: null },
  { to: "/shop?category=decor", label: "Décor", category: "decor" },
  { to: "/shop?category=furniture", label: "Furniture", category: "furniture" },
  { to: "/shop?category=setups", label: "Setups", category: "setups" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const currentCategory = searchParams.get("category");

  const isActive = (link: typeof navLinks[0]) => {
    if (link.to === "/" && location.pathname === "/") return true;
    if (link.to === "/shop" && location.pathname === "/shop" && !currentCategory) return true;
    if (link.category && location.pathname === "/shop" && currentCategory === link.category) return true;
    return false;
  };

  const searchResults = searchQuery.trim().length > 0
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.material.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  useEffect(() => {
    if (searchOpen && inputRef.current) inputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container flex items-center justify-between h-16 md:h-20">
        {/* Mobile menu */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-foreground"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex flex-col items-center leading-none">
          <span className="font-display text-lg md:text-xl tracking-wide text-foreground">
            INTERIOR
          </span>
          <span className="text-[10px] md:text-xs tracking-[0.3em] text-gold font-body font-medium uppercase">
            by Forte
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className={`text-sm font-body tracking-wide transition-colors hover:text-gold ${
                isActive(link) ? "text-gold font-medium" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div ref={searchRef} className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-foreground hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>

            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 w-72 md:w-80 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50"
                >
                  <div className="p-3">
                    <input
                      ref={inputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-muted/50 border-none rounded-md px-3 py-2 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-gold"
                    />
                  </div>
                  {searchResults.length > 0 && (
                    <div className="border-t border-border max-h-64 overflow-y-auto">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                        >
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-body text-foreground truncate">{product.name}</p>
                            <p className="text-xs text-muted-foreground font-body">
                              {new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", minimumFractionDigits: 0 }).format(product.price)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchQuery.trim().length > 0 && searchResults.length === 0 && (
                    <div className="p-4 text-center text-sm text-muted-foreground font-body border-t border-border">
                      No products found
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-foreground hover:text-gold transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-gold text-accent-foreground text-xs flex items-center justify-center font-body font-medium">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border bg-background"
          >
            <nav className="container py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm font-body tracking-wide py-2 transition-colors hover:text-gold ${
                    isActive(link) ? "text-gold font-medium" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
