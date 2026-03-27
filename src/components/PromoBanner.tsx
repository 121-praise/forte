import { motion } from "framer-motion";
import { Truck, Shield, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Nationwide Delivery", desc: "We deliver across all 36 states in Nigeria" },
  { icon: Shield, title: "Secure Payments", desc: "Pay safely with cards, bank transfer & more" },
  { icon: Headphones, title: "Dedicated Support", desc: "Our team is here to help, Mon — Sat" },
];

const PromoBanner = () => (
  <section className="py-16 border-y border-border">
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <f.icon size={18} className="text-gold" />
            </div>
            <div>
              <h3 className="font-body text-sm font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-xs text-muted-foreground font-body leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PromoBanner;
