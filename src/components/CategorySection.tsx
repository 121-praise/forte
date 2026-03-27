import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import categoryDecor from "@/assets/category-decor.jpg";
import categoryFurniture from "@/assets/category-furniture.jpg";
import categorySetups from "@/assets/category-setups.jpg";
import categoryLifestyle from "@/assets/category-lifestyle.jpg";

const categoriesData = [
  { id: "decor", name: "Décor Accessories", image: categoryDecor },
  { id: "furniture", name: "Furniture", image: categoryFurniture },
  { id: "setups", name: "Room Setups", image: categorySetups },
  { id: "lifestyle", name: "Lifestyle", image: categoryLifestyle },
];

const CategorySection = () => (
  <section className="py-20 md:py-28">
    <div className="container">
      <div className="text-center mb-12 md:mb-16">
        <p className="text-gold text-sm font-body tracking-[0.25em] uppercase mb-3">Browse</p>
        <h2 className="font-display text-3xl md:text-4xl text-foreground">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {categoriesData.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <Link
              to={`/shop?category=${cat.id}`}
              className="group block relative aspect-[3/4] overflow-hidden rounded"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={800}
                height={1000}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-display text-lg md:text-xl text-primary-foreground">{cat.name}</h3>
                <span className="text-primary-foreground/70 text-xs font-body tracking-wide mt-1 inline-block group-hover:text-gold-light transition-colors">
                  Explore →
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CategorySection;
