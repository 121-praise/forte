import { useState } from "react";
import { products as initialProducts, categories, rooms, formatPrice } from "@/data/products";
import type { Product, ProductCategory, RoomType } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Lock, Plus, Pencil, Trash2, Package, ShoppingCart, X, Eye } from "lucide-react";
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
          <button
            type="submit"
            className="w-full bg-gold text-accent-foreground py-3 rounded-md text-sm font-body font-medium hover:bg-gold/90 transition-colors"
          >
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
  category: ProductCategory;
  room: RoomType;
  description: string;
  material: string;
  dimensions: string;
  inStock: boolean;
  featured: boolean;
  tag: string;
  imageUrl: string;
}

const emptyForm: ProductFormData = {
  name: "",
  price: "",
  category: "decor",
  room: "living-room",
  description: "",
  material: "",
  dimensions: "",
  inStock: true,
  featured: false,
  tag: "",
  imageUrl: "",
};

const Admin = () => {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem("ibf_admin") === "true");
  const [productsList, setProductsList] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const { items } = useCart();

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      room: product.room,
      description: product.description,
      material: product.material,
      dimensions: product.dimensions,
      inStock: product.inStock,
      featured: product.featured,
      tag: product.tag || "",
      imageUrl: "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this product?")) {
      setProductsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData: Omit<Product, "id"> = {
      name: form.name,
      price: Number(form.price),
      category: form.category,
      room: form.room,
      images: form.imageUrl ? [form.imageUrl] : ["/placeholder.svg"],
      description: form.description,
      material: form.material,
      dimensions: form.dimensions,
      inStock: form.inStock,
      featured: form.featured,
      tag: form.tag || undefined,
    };

    if (editingId) {
      setProductsList((prev) =>
        prev.map((p) => (p.id === editingId ? { ...productData, id: editingId } : p))
      );
    } else {
      const newId = String(Date.now());
      setProductsList((prev) => [...prev, { ...productData, id: newId }]);
    }
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const logout = () => {
    sessionStorage.removeItem("ibf_admin");
    setAuthed(false);
  };

  return (
    <>
      <div className="container py-6 md:py-10 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gold text-sm font-body tracking-[0.25em] uppercase mb-1">Dashboard</p>
            <h1 className="font-display text-2xl md:text-3xl text-foreground">Admin Panel</h1>
          </div>
          <button
            onClick={logout}
            className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors border border-border px-4 py-2 rounded-md"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-border">
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
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-muted-foreground font-body">{productsList.length} products total</p>
              <button
                onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
                className="flex items-center gap-2 bg-gold text-accent-foreground px-4 py-2 rounded-md text-sm font-body font-medium hover:bg-gold/90 transition-colors"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {/* Product Form Modal */}
            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-background border border-border rounded-lg w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h2 className="font-display text-lg text-foreground">
                      {editingId ? "Edit Product" : "Add Product"}
                    </h2>
                    <button onClick={() => { setShowForm(false); setEditingId(null); }}>
                      <X size={20} className="text-muted-foreground" />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Price (₦)</label>
                        <input
                          required
                          type="number"
                          value={form.price}
                          onChange={(e) => setForm({ ...form, price: e.target.value })}
                          className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Category</label>
                        <select
                          value={form.category}
                          onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory })}
                          className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Room</label>
                        <select
                          value={form.room}
                          onChange={(e) => setForm({ ...form, room: e.target.value as RoomType })}
                          className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                        >
                          {rooms.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Tag (optional)</label>
                        <input
                          value={form.tag}
                          onChange={(e) => setForm({ ...form, tag: e.target.value })}
                          placeholder="e.g. Bestseller"
                          className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Description</label>
                      <textarea
                        required
                        rows={3}
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Material</label>
                        <input
                          required
                          value={form.material}
                          onChange={(e) => setForm({ ...form, material: e.target.value })}
                          className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Dimensions</label>
                        <input
                          required
                          value={form.dimensions}
                          onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
                          className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-body text-muted-foreground uppercase tracking-wide">Image URL</label>
                      <input
                        value={form.imageUrl}
                        onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full mt-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-body text-foreground focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="flex gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.inStock}
                          onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                          className="accent-gold w-4 h-4"
                        />
                        <span className="text-sm font-body text-foreground">In Stock</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.featured}
                          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                          className="accent-gold w-4 h-4"
                        />
                        <span className="text-sm font-body text-foreground">Featured</span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gold text-accent-foreground py-3 rounded-md text-sm font-body font-medium hover:bg-gold/90 transition-colors"
                    >
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
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground hidden md:table-cell">Category</th>
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground">Price</th>
                      <th className="text-left px-4 py-3 font-body font-medium text-muted-foreground hidden md:table-cell">Status</th>
                      <th className="text-right px-4 py-3 font-body font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsList.map((product) => (
                      <tr key={product.id} className="border-t border-border hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover flex-shrink-0"
                            />
                            <span className="font-body text-foreground truncate max-w-[150px]">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-body text-muted-foreground capitalize hidden md:table-cell">
                          {product.category}
                        </td>
                        <td className="px-4 py-3 font-body text-foreground">{formatPrice(product.price)}</td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className={`text-xs px-2 py-1 rounded font-body ${product.inStock ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-500"}`}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(product)}
                              className="p-1.5 text-muted-foreground hover:text-gold transition-colors"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            {items.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground font-body">
                <ShoppingCart size={40} className="mx-auto mb-4 opacity-30" />
                <p>No orders yet.</p>
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
                      {items.map((item) => (
                        <tr key={item.product.id} className="border-t border-border">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <span className="font-body text-foreground">{item.product.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-body text-muted-foreground text-xs max-w-[200px]">
                            <p>{item.product.category} · {item.product.room}</p>
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
