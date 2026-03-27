import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-living-room.jpg";

const Hero = () => (
  <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
    <img
      src={heroImage}
      alt="Luxury interior design living room by Interior by Forte"
      className="absolute inset-0 w-full h-full object-cover"
      width={1920}
      height={1080}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/30 to-transparent" />

    <div className="relative h-full container flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl"
      >
        <p className="text-gold-light text-sm font-body tracking-[0.25em] uppercase mb-4">
          Premium Interior Décor
        </p>
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-primary-foreground leading-[1.1] mb-6">
          Elevate Your
          <br />
          Living Space
        </h1>
        <p className="text-primary-foreground/80 font-body text-base md:text-lg leading-relaxed mb-8 max-w-md">
          Discover curated collections of luxury furniture, décor accessories, and styled room setups — delivered across Nigeria.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-3.5 bg-gold text-accent-foreground font-body text-sm tracking-wide hover:bg-gold-dark transition-colors rounded"
          >
            Shop Collection
          </Link>
          <Link
            to="/shop?category=setups"
            className="inline-flex items-center px-8 py-3.5 border border-primary-foreground/40 text-primary-foreground font-body text-sm tracking-wide hover:bg-primary-foreground/10 transition-colors rounded"
          >
            View Setups
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Hero;
