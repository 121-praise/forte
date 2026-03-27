import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="container py-16 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        {/* Brand */}
        <div className="md:col-span-1">
          <div className="mb-4">
            <span className="font-display text-xl tracking-wide">INTERIOR</span>
            <br />
            <span className="text-xs tracking-[0.3em] text-gold font-body uppercase">by Forte</span>
          </div>
          <p className="text-primary-foreground/60 text-sm font-body leading-relaxed">
            Premium interior décor, furniture & lifestyle accessories. Delivering luxury across Nigeria.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-body text-sm tracking-wide uppercase mb-4 text-gold">Shop</h4>
          <ul className="space-y-3">
            {["Décor Accessories", "Furniture", "Room Setups", "Lifestyle"].map((item) => (
              <li key={item}>
                <Link to="/shop" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors font-body">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-body text-sm tracking-wide uppercase mb-4 text-gold">Company</h4>
          <ul className="space-y-3">
            {["About Us", "Contact", "Delivery Info", "Returns Policy"].map((item) => (
              <li key={item}>
                <span className="text-sm text-primary-foreground/60 font-body cursor-default">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-body text-sm tracking-wide uppercase mb-4 text-gold">Get in Touch</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/60 font-body">
            <li>hello@interiorbyforte.com</li>
            <li>Lagos, Nigeria</li>
            <li>Mon — Sat, 9am — 6pm</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-primary-foreground/40 font-body">
          © 2025 Interior by Forte. All rights reserved.
        </p>
        <div className="flex gap-6 text-xs text-primary-foreground/40 font-body">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
