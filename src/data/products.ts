import vaseCeramic from "@/assets/products/vase-ceramic.jpg";
import wallArt from "@/assets/products/wall-art.jpg";
import pendantLight from "@/assets/products/pendant-light.jpg";
import accentChair from "@/assets/products/accent-chair.jpg";
import goldMirror from "@/assets/products/gold-mirror.jpg";
import candleSet from "@/assets/products/candle-set.jpg";
import sideTable from "@/assets/products/side-table.jpg";

export type ProductCategory = "decor" | "furniture" | "setups" | "lifestyle";
export type RoomType = "living-room" | "bedroom" | "dining" | "bathroom" | "office" | "any";
export type ProductTag = "Bestseller" | "New" | "Limited" | "";

export interface Product {
  id: string;
  name: string;
  price: number;
  categories: ProductCategory[];
  rooms: RoomType[];
  images: string[];
  videos: string[];
  description: string;
  material: string;
  dimensions: string;
  inStock: boolean;
  featured: boolean;
  tag?: ProductTag | string;
}

export const categories = [
  { id: "decor" as const, name: "Décor", description: "Vases, wall art, lighting, mirrors & more" },
  { id: "furniture" as const, name: "Furniture", description: "Chairs, tables, sofas & shelves" },
  { id: "setups" as const, name: "Room Setups", description: "Curated full room designs" },
  { id: "lifestyle" as const, name: "Lifestyle", description: "Home comfort & functional pieces" },
];

export const rooms = [
  { id: "living-room" as const, name: "Living Room" },
  { id: "bedroom" as const, name: "Bedroom" },
  { id: "dining" as const, name: "Dining" },
  { id: "bathroom" as const, name: "Bathroom" },
  { id: "office" as const, name: "Office" },
  { id: "any" as const, name: "Any Room" },
];

export const tagOptions: ProductTag[] = ["Bestseller", "New", "Limited"];

export const products: Product[] = [
  {
    id: "1",
    name: "Aria Ceramic Vase Set",
    price: 45000,
    categories: ["decor"],
    rooms: ["living-room", "dining"],
    images: [vaseCeramic],
    videos: [],
    description: "Elegant hand-crafted ceramic vase duo featuring a stunning gold wave accent. Perfect as a statement piece on consoles, shelves, or dining tables.",
    material: "Premium ceramic with gold-plated accent",
    dimensions: "Large: 38cm H × 12cm W | Small: 18cm H × 14cm W",
    inStock: true,
    featured: true,
    tag: "Bestseller",
  },
  {
    id: "2",
    name: "Abstract Warmth Wall Art",
    price: 85000,
    categories: ["decor"],
    rooms: ["living-room", "bedroom"],
    images: [wallArt],
    videos: [],
    description: "Hand-painted abstract canvas in warm earth tones with walnut wood frame. Adds depth and artistic character to any living space.",
    material: "Canvas, acrylic paint, walnut wood frame",
    dimensions: "120cm × 90cm",
    inStock: true,
    featured: true,
    tag: "New",
  },
  {
    id: "3",
    name: "Soleil Gold Pendant Light",
    price: 120000,
    categories: ["decor"],
    rooms: ["dining", "living-room"],
    images: [pendantLight],
    videos: [],
    description: "Statement sunburst pendant light in brushed gold finish. Creates dramatic shadows and a luxurious ambiance in any room.",
    material: "Brushed brass, E27 bulb socket",
    dimensions: "50cm diameter × 45cm H",
    inStock: true,
    featured: true,
  },
  {
    id: "4",
    name: "Luna Accent Chair",
    price: 280000,
    categories: ["furniture"],
    rooms: ["living-room", "bedroom"],
    images: [accentChair],
    videos: [],
    description: "Sculptural accent chair with buttery soft cream upholstery and tapered brass legs. A perfect balance of comfort and modern elegance.",
    material: "Premium fabric, high-density foam, brass legs",
    dimensions: "75cm W × 72cm D × 78cm H",
    inStock: true,
    featured: true,
    tag: "Bestseller",
  },
  {
    id: "5",
    name: "Aurelia Round Mirror",
    price: 95000,
    categories: ["decor"],
    rooms: ["bedroom", "bathroom"],
    images: [goldMirror],
    videos: [],
    description: "Stunning round wall mirror with double gold frame and subtle LED backlighting. Elevates hallways, bedrooms, and living spaces.",
    material: "Beveled glass, gold-plated steel frame, LED",
    dimensions: "80cm diameter",
    inStock: true,
    featured: false,
  },
  {
    id: "6",
    name: "Lumière Candle Collection",
    price: 35000,
    categories: ["lifestyle", "decor"],
    rooms: ["any"],
    images: [candleSet],
    videos: [],
    description: "Set of four luxury scented candles in hand-poured soy wax with gold-lidded glass jars. Notes of vanilla, amber, sandalwood & bergamot.",
    material: "Soy wax, glass jars, gold-plated lids",
    dimensions: "8cm H × 7cm diameter each",
    inStock: true,
    featured: true,
  },
  {
    id: "7",
    name: "Carrara Marble Side Table",
    price: 175000,
    categories: ["furniture"],
    rooms: ["living-room", "bedroom"],
    images: [sideTable],
    videos: [],
    description: "Elegant round side table featuring genuine Carrara marble top and base with a sleek brushed gold pedestal. A timeless accent piece.",
    material: "Carrara marble, brushed gold steel",
    dimensions: "50cm diameter × 55cm H",
    inStock: true,
    featured: true,
  },
  {
    id: "8",
    name: "Serenity Throw Pillow Set",
    price: 28000,
    categories: ["lifestyle"],
    rooms: ["bedroom", "living-room"],
    images: [vaseCeramic],
    videos: [],
    description: "Set of four premium textured throw pillows in warm cream and beige tones. Mix of herringbone, waffle, and linen weave textures.",
    material: "Cotton-linen blend, polyester fill",
    dimensions: "45cm × 45cm each",
    inStock: false,
    featured: false,
    tag: "Limited",
  },
];

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(price);
};
