import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories, formatPrice } from "@/data/products";
import type { ProductCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { SlidersHorizontal, X } from "lucide-react";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₦50,000", min: 0, max: 50000 },
  { label: "₦50,000 — ₦100,000", min: 50000, max: 100000 },
  { label: "₦100,000 — ₦200,000", min: 100000, max: 200000 },
  { label: "Above ₦200,000", min: 200000, max: Infinity },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as ProductCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(categoryParam);
  const [priceRange, setPriceRange] = useState(0);
  const [stockOnly, setStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    const range = priceRanges[priceRange];
    result = result.filter((p) => p.price >= range.min && p.price < range.max);
    if (stockOnly) result = result.filter((p) => p.inStock);
    return result;
  }, [selectedCategory, priceRange, stockOnly]);

  const handleCategoryChange = (cat: ProductCategory | null) => {
    setSelectedCategory(cat);
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  return (
    <>
      <div className="container py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <p className="text-gold text-sm font-body tracking-[0.25em] uppercase mb-2">Collection</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name || "Shop"
              : "All Products"}
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-2">{filtered.length} products</p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden md:block w-56 flex-shrink-0 space-y-8">
            <div>
              <h3 className="font-body text-xs tracking-wide uppercase text-muted-foreground mb-3">Category</h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange(null)}
                  className={`block text-sm font-body transition-colors ${!selectedCategory ? "text-gold font-medium" : "text-foreground hover:text-gold"}`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`block text-sm font-body transition-colors ${selectedCategory === cat.id ? "text-gold font-medium" : "text-foreground hover:text-gold"}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-body text-xs tracking-wide uppercase text-muted-foreground mb-3">Price</h3>
              <div className="space-y-2">
                {priceRanges.map((range, i) => (
                  <button
                    key={range.label}
                    onClick={() => setPriceRange(i)}
                    className={`block text-sm font-body transition-colors ${priceRange === i ? "text-gold font-medium" : "text-foreground hover:text-gold"}`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={stockOnly}
                  onChange={(e) => setStockOnly(e.target.checked)}
                  className="accent-gold"
                />
                <span className="text-sm font-body text-foreground">In stock only</span>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center gap-2 text-sm font-body text-muted-foreground mb-6 border border-border px-4 py-2 rounded"
            >
              <SlidersHorizontal size={16} /> Filters
            </button>

            {/* Mobile filters */}
            {showFilters && (
              <div className="md:hidden mb-6 p-4 border border-border rounded space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-body text-sm font-medium">Filters</span>
                  <button onClick={() => setShowFilters(false)}><X size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleCategoryChange(null)}
                    className={`text-xs px-3 py-1.5 rounded border font-body ${!selectedCategory ? "border-gold text-gold" : "border-border text-foreground"}`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`text-xs px-3 py-1.5 rounded border font-body ${selectedCategory === cat.id ? "border-gold text-gold" : "border-border text-foreground"}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground font-body">
                <p>No products match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
