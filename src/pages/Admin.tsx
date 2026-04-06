import { useState, useMemo, useRef } from "react";
import { products as initialProducts, categories, rooms, formatPrice, tagOptions } from "@/data/products";
import type { Product, ProductCategory, RoomType, ProductTag } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Lock, Plus, Pencil, Trash2, Package, ShoppingCart, X, Upload, Image, Film, Search } from "lucide-react";
import Footer from "@/components/Footer";

const ADMIN_PASSWORD = "ibforte2026";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("ibf_admin", "true");
      onLogin();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-gold" />
          </div>
          <h1 className="font-display text-2xl text-foreground">Admin Access</h1>
          <p className="text-muted-foreground text-sm font-body mt-2">Enter admin password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            className="w-full bg-background border border-border rounded-md px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold"
          />
          {error && <p className="text-red-500 text-xs font-body">Incorrect password</p>}
          <button type="submit" className="w-full bg-gold text-accent-foreground py-3 rounded-md text-sm font-body font-medium hover:bg-gold/90 transition-colors">
            Enter Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

interface ProductFormData {
  name: string;
  price: string;
  categories: ProductCategory[];
  rooms: RoomType[];
  description: string;
  material: string;
  dimensions: string;
  inStock: boolean;
  featured: boolean;
  tag: ProductTag | "";
  imageFiles: File[];
  videoFiles: File[];
  existingImages: string[];
  existingVideos: string[];
}

const emptyForm: ProductFormData = {
  name: "",
  price: "",
  categories: ["decor"],
  rooms: ["living-room"],
  description: "",
  material: "",
  dimensions: "",
  inStock: true,
  featured: false,
  tag: "",
  imageFiles: [],
  videoFiles: [],
  existingImages: [],
  existingVideos: [],
};

const MultiSelect = <T extends string>({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: { id: T; name: string }[];
  selected: T[];
  onChange: (val: T[]) => void;
}) => {
  const toggle = (id: T) => {
    if (selected.includes(id)) {
      if (selected.length > 1) onChange(selected.filter((s) => s !== id));
    } else {
      onChange([...selected, id]);
    }
  };
  return (
    <div>
      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">{label}</label>
      <div className="flex flex-wrap gap-2 mt-1.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => toggle(opt.id)}
            className={`px-3 py-1.5 rounded-md text-xs font-body border transition-colors ${
              selected.includes(opt.id)
                ? "bg-gold text-accent-foreground border-gold"
                : "bg-background text-muted-foreground border-border hover:border-gold/50"
            }`}
          >
            {opt.name}
          </button>
        ))}
      </div>
    </div>
  );
};

const Admin = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ibf_admin") === "true");
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const { items } = useCart();

  // Filters state
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState<ProductCategory | "">("");
  const [productStatusFilter, setProductStatusFilter] = useState<"" | "in-stock" | "out-of-stock">("");
  const [productPriceSort, setProductPriceSort] = useState<"" | "asc" | "desc">("");

  const [orderSearch, setOrderSearch] = useState("");
  const [orderCategoryFilter, setOrderCategoryFilter] = useState<ProductCategory | "">("");
  const [orderPriceSort, setOrderPriceSort] = useState<"" | "asc" | "desc">("");

  const filteredProducts = useMemo(() => {
    let result = productsList;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (productCategoryFilter) {
      result = result.filter((p) => p.categories.includes(productCategoryFilter));
    }
    if (productStatusFilter === "in-stock") result = result.filter((p) => p.inStock);
    if (productStatusFilter === "out-of-stock") result = result.filter((p) => !p.inStock);
    if (productPriceSort === "asc") result = [...result].sort((a, b) => a.price - b.price);
    if (productPriceSort === "desc") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [productsList, productSearch, productCategoryFilter, productStatusFilter, productPriceSort]);

  const filteredOrders = useMemo(() => {
    let result = items;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      result = result.filter((i) => i.product.name.toLowerCase().includes(q));
    }
    if (orderCategoryFilter) {
      result = result.filter((i) => i.product.categories.includes(orderCategoryFilter));
    }
    if (orderPriceSort === "asc") result = [...result].sort((a, b) => a.product.price - b.product.price);
    if (orderPriceSort === "desc") result = [...result].sort((a, b) => b.product.price - a.product.price);
    return result;
  }, [items, orderSearch, orderCategoryFilter, orderPriceSort]);

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setForm((prev) => ({ ...prev, imageFiles: [...prev.imageFiles, ...files] }));
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setForm((prev) => ({ ...prev, videoFiles: [...prev.videoFiles, ...files] }));
    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      setVideoPreviews((prev) => [...prev, url]);
    });
  };

  const removeImagePreview = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, imageFiles: prev.imageFiles.filter((_, i) => i !== index) }));
  };

  const removeExistingImage = (index: number) => {
    setForm((prev) => ({ ...prev, existingImages: prev.existingImages.filter((_, i) => i !== index) }));
  };

  const removeVideoPreview = (index: number) => {
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => ({ ...prev, videoFiles: prev.videoFiles.filter((_, i) => i !== index) }));
  };

  const removeExistingVideo = (index: number) => {
    setForm((prev) => ({ ...prev, existingVideos: prev.existingVideos.filter((_, i) => i !== index) }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      categories: product.categories,
      rooms: product.rooms,
      description: product.description,
      material: product.material,
      dimensions: product.dimensions,
      inStock: product.inStock,
      featured: product.featured,
      tag: (product.tag as ProductTag) || "",
      imageFiles: [],
      videoFiles: [],
      existingImages: [...product.images],
      existingVideos: [...product.videos],
    });
    setImagePreviews([]);
    setVideoPreviews([]);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this product?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For local state, use data URLs from previews for new images
    const newImages = imagePreviews;
    const allImages = [...form.existingImages, ...newImages];
    const allVideos = [...form.existingVideos, ...videoPreviews];

    const productData: Omit<Product, "id"> = {
      name: form.name,
      price: Number(form.price),
      categories: form.categories,
      rooms: form.rooms,
      images: allImages.length > 0 ? allImages : ["/placeholder.svg"],
      videos: allVideos,
      description: form.description,
      material: form.material,
      dimensions: form.dimensions,
      inStock: form.inStock,
      featured: form.featured,
      tag: form.tag || undefined,
    };

    if (editingId) {
      setProductsList((prev) => prev.map((p) => (p.id === editingId ? { ...productData, id: editingId } : p)));
    } else {
      const newId = String(Date.now());
      setProductsList((prev) => [...prev, { ...productData, id: newId }]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setImagePreviews([]);
    setVideoPreviews([]);
  };

  const logout = () => {
    sessionStorage.removeItem("ibf_admin");
    setAuthed(false);
  };

  const selectClass = "appearance-none bg-background border border-border rounded-md px-3 py-2 pr-8 text-sm font-body text-foreground focus:outline-none focus:border-gold cursor-pointer";
  const inputClass = "w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold";

  return (
    <>
      <div className="container py-6 md:py-10 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold text-sm font-body tracking-[0.25em] uppercase mb-1">Dashboard</p>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">Admin Panel</h1>
          </div>
          <button onClick={logout} className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 rounded-md">
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-body transition-colors border-b-2 -mb-px ${
              activeTab === "products" ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package size={16} /> Products ({productsList.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-body transition-colors border-b-2 -mb-px ${
              activeTab === "orders" ? "border-gold text-gold" : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <ShoppingCart size={16} /> Orders ({items.length})
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                />
              </div>
              <select value={productCategoryFilter} onChange={(e) => setProductCategoryFilter(e.target.value as ProductCategory | "")} className={selectClass}>
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={productStatusFilter} onChange={(e) => setProductStatusFilter(e.target.value as "" | "in-stock" | "out-of-stock")} className={selectClass}>
                <option value="">All Status</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
              <select value={productPriceSort} onChange={(e) => setProductPriceSort(e.target.value as "" | "asc" | "desc")} className={selectClass}>
                <option value="">Price: Default</option>
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setImagePreviews([]); setVideoPreviews([]); }}
                className="flex items-center gap-2 bg-gold text-accent-foreground px-4 py-2 rounded-md text-sm font-body font-medium hover:bg-gold/90 transition-colors ml-auto"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => { setShowForm(false); setEditingId(null); }}>
                <div className="bg-background border border-border rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="font-display text-lg text-foreground">{editingId ? "Edit Product" : "Add Product"}</h2>
                    <button onClick={() => { setShowForm(false); setEditingId(null); }}><X size={20} className="text-muted-foreground" /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Name</label>
                      <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass + " mt-1"} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Price (₦)</label>
                        <input required type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={inputClass + " mt-1"} />
                      </div>
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Tag</label>
                        <select
                          value={form.tag}
                          onChange={(e) => setForm({ ...form, tag: e.target.value as ProductTag | "" })}
                          className={inputClass + " mt-1"}
                        >
                          <option value="">No Tag</option>
                          {tagOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>

                    <MultiSelect
                      label="Categories (select one or more)"
                      options={categories}
                      selected={form.categories}
                      onChange={(val) => setForm({ ...form, categories: val })}
                    />

                    <MultiSelect
                      label="Rooms (select one or more)"
                      options={rooms}
                      selected={form.rooms}
                      onChange={(val) => setForm({ ...form, rooms: val })}
                    />

                    <div>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Description</label>
                      <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass + " mt-1 resize-none"} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Material</label>
                        <input required value={form.material} onChange={(e) => setForm({ ...form, material: e.target.value })} className={inputClass + " mt-1"} />
                      </div>
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Dimensions</label>
                        <input required value={form.dimensions} onChange={(e) => setForm({ ...form, dimensions: e.target.value })} className={inputClass + " mt-1"} />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Images</label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {form.existingImages.map((src, i) => (
                          <div key={"ex-img-" + i} className="relative w-20 h-20 rounded overflow-hidden border border-border">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                        {imagePreviews.map((src, i) => (
                          <div key={"new-img-" + i} className="relative w-20 h-20 rounded overflow-hidden border border-gold/50">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeImagePreview(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => imageInputRef.current?.click()}
                          className="w-20 h-20 rounded border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-colors gap-1"
                        >
                          <Image size={18} />
                          <span className="text-[10px] font-body">Upload</span>
                        </button>
                        <input ref={imageInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </div>
                    </div>

                    {/* Video Upload */}
                    <div>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Videos</label>
                      <div className="flex flex-wrap gap-3 mt-2">
                        {form.existingVideos.map((src, i) => (
                          <div key={"ex-vid-" + i} className="relative w-28 h-20 rounded overflow-hidden border border-border bg-black">
                            <video src={src} className="w-full h-full object-cover" muted />
                            <button type="button" onClick={() => removeExistingVideo(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                        {videoPreviews.map((src, i) => (
                          <div key={"new-vid-" + i} className="relative w-28 h-20 rounded overflow-hidden border border-gold/50 bg-black">
                            <video src={src} className="w-full h-full object-cover" muted />
                            <button type="button" onClick={() => removeVideoPreview(i)} className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => videoInputRef.current?.click()}
                          className="w-28 h-20 rounded border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-gold hover:text-gold transition-colors gap-1"
                        >
                          <Film size={18} />
                          <span className="text-[10px] font-body">Upload</span>
                        </button>
                        <input ref={videoInputRef} type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="accent-gold w-4 h-4" />
                        <span className="text-sm font-body text-foreground">In Stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="accent-gold w-4 h-4" />
                        <span className="text-sm font-body text-foreground">Featured</span>
                      </label>
                    </div>
                    <button type="submit" className="w-full bg-gold text-accent-foreground py-3 rounded-md text-sm font-body font-medium hover:bg-gold/90 transition-colors">
                      {editingId ? "Save Changes" : "Add Product"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Products Table */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/30">
                    <tr>
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground">Product</th>
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground hidden md:table-cell">Categories</th>
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground">Price</th>
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground hidden md:table-cell">Tag</th>
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground hidden md:table-cell">Status</th>
                      <th className="text-right px-4 py-3 font-body font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={product.images[0]} alt={product.name} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                            <span className="font-body text-foreground truncate max-w-[150px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {product.categories.map((c) => (
                              <span key={c} className="text-xs px-1.5 py-0.5 rounded bg-muted/50 text-muted-foreground capitalize">{c}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-foreground">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          {product.tag ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-gold/10 text-gold font-body">{product.tag}</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs px-2 py-1 rounded font-body ${product.inStock ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEdit(product)} className="p-1.5 text-muted-foreground hover:text-gold transition-colors" title="Edit">
                              <Pencil size={15} />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors" title="Delete">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-10 text-muted-foreground font-body text-sm">No products match your filters</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            {/* Order Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search orders..."
                  className="w-full bg-background border border-border rounded-md pl-9 pr-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                />
              </div>
              <select value={orderCategoryFilter} onChange={(e) => setOrderCategoryFilter(e.target.value as ProductCategory | "")} className={selectClass}>
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select value={orderPriceSort} onChange={(e) => setOrderPriceSort(e.target.value as "" | "asc" | "desc")} className={selectClass}>
                <option value="">Price: Default</option>
                <option value="asc">Price: Low → High</option>
                <option value="desc">Price: High → Low</option>
              </select>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground font-body">
                <ShoppingCart size={40} className="mx-auto mb-4 opacity-30" />
                <p>No orders found.</p>
                <p className="text-xs mt-1">Orders will appear here when customers make purchases.</p>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground">Product</th>
                        <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground">Details</th>
                        <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground">Qty</th>
                        <th className="text-right px-4 py-3 font-body font-medium text-muted-foreground">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((item) => (
                        <tr key={item.product.id} className="border-t border-border">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={item.product.images[0]} alt={item.product.name} className="w-10 h-10 rounded object-cover" />
                              <span className="font-body text-foreground">{item.product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-body text-muted-foreground text-xs max-w-[200px]">
                            <p>{item.product.categories.join(", ")} · {item.product.rooms.join(", ")}</p>
                            <p>{item.product.material}</p>
                            <p>{item.product.dimensions}</p>
                          </td>
                          <td className="px-4 py-3 font-body text-foreground">{item.quantity}</td>
                          <td className="px-4 py-3 font-body text-foreground text-right">
                            {formatPrice(item.product.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Admin;
