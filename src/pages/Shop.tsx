import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories, rooms, formatPrice } from "@/data/products";
import type { ProductCategory, RoomType } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { ChevronDown } from "lucide-react";

const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under ₦50,000", min: 0, max: 50000 },
  { label: "₦50k — ₦100k", min: 50000, max: 100000 },
  { label: "₦100k — ₦200k", min: 100000, max: 200000 },
  { label: "Above ₦200k", min: 200000, max: Infinity },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") as ProductCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(categoryParam);
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [priceRange, setPriceRange] = useState(0);
  const [stockOnly, setStockOnly] = useState(false);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedRoom) result = result.filter((p) => p.room === selectedRoom || p.room === "any");
    const range = priceRanges[priceRange];
    result = result.filter((p) => p.price >= range.min && p.price < range.max);
    if (stockOnly) result = result.filter((p) => p.inStock);
    return result;
  }, [selectedCategory, selectedRoom, priceRange, stockOnly]);

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
      <div className="container py-6 md:py-10">
        {/* Header */}
        <div className="mb-6">
          <p className="text-gold text-sm font-body tracking-[0.25em] uppercase mb-2">Collection</p>
          <h1 className="font-display text-3xl md:text-4xl text-foreground">
            {selectedCategory
              ? categories.find((c) => c.id === selectedCategory)?.name || "Shop"
              : "All Products"}
          </h1>
          <p className="text-muted-foreground font-body text-sm mt-1">{filtered.length} products</p>
        </div>

        {/* Top Filters Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-border">
          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory || ""}
              onChange={(e) => handleCategoryChange((e.target.value || null) as ProductCategory | null)}
              className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-sm font-body text-foreground focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {/* Price Filter */}
          <div className="relative">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-sm font-body text-foreground focus:outline-none focus:border-gold cursor-pointer"
            >
              {priceRanges.map((range, i) => (
                <option key={range.label} value={i}>{range.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {/* Room Filter */}
          <div className="relative">
            <select
              value={selectedRoom || ""}
              onChange={(e) => setSelectedRoom((e.target.value || null) as RoomType | null)}
              className="appearance-none bg-background border border-border rounded-md px-4 py-2 pr-8 text-sm font-body text-foreground focus:outline-none focus:border-gold cursor-pointer"
            >
              <option value="">All Rooms</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          {/* Availability Filter */}
          <label className="flex items-center gap-2 cursor-pointer border border-border rounded-md px-4 py-2">
            <input
              type="checkbox"
              checked={stockOnly}
              onChange={(e) => setStockOnly(e.target.checked)}
              className="accent-gold w-4 h-4"
            />
            <span className="text-sm font-body text-foreground whitespace-nowrap">In stock only</span>
          </label>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
      <Footer />
    </>
  );
};

export default Shop;
