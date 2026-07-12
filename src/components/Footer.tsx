import { motion } from 'framer-motion';
import { Facebook, Instagram, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-16 px-6 bg-white/20 border-t border-white/40 overflow-hidden">
      {/* Background radial soft glow */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-primary-light/3 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12 text-left">
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-6">
            <a href="#home" className="group self-start inline-flex">
              <img
                src="/logo.png"
                alt="VALO"
                className="h-6 sm:h-7 md:h-8 w-auto object-contain select-none pointer-events-none transform group-hover:scale-105 transition-transform duration-300"
              />
            </a>

            <p className="text-sm text-primary/60 leading-relaxed max-w-sm">
              Building digital products, brands, and experiences that drive real business results.
            </p>

            {/* Premium Glass Social Icons */}
            <div className="flex gap-4">
              {[
                { icon: Facebook, href: 'https://www.facebook.com/ValoTechs/' },
                { icon: Instagram, href: 'https://instagram.com/' },
              ].map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover="hover"
                    whileTap="tap"
                    variants={{
                      hover: { y: -4, scale: 1.1 },
                      tap: { y: 0, scale: 0.95 }
                    }}
                    transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                    className="w-9 h-9 rounded-full text-primary/70 hover:text-primary hover:border-white/80 flex items-center justify-center glass-button-light transition-glass duration-500 overflow-hidden relative shadow-sm"
                  >
                    {/* Sweep Reflection */}
                    <motion.div
                      className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -left-full pointer-events-none"
                      variants={{
                        hover: {
                          left: '100%',
                          transition: { duration: 0.6, ease: 'easeInOut' }
                        }
                      }}
                    />
                    <Icon className="w-4 h-4 z-10" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-5">
            <h4 className="text-xs font-extrabold tracking-widest text-primary uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '#home' },
                { name: 'About', href: '#home' },
                { name: 'Services', href: '#services' },
                { name: 'Contact', href: '#contact' },
              ].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-xs font-semibold text-primary/60 hover:text-primary transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4 space-y-5">
            <h4 className="text-xs font-extrabold tracking-widest text-primary uppercase">
              Contact Info
            </h4>
            <ul className="space-y-3.5">
              {[
                { icon: MapPin, text: 'Jijiga, Somali Region, Ethiopia' },
                { icon: Mail, text: 'Valodev14@gmail.com' },
                { icon: Phone, text: '+251 915 783 928' },
              ].map((info, index) => {
                const Icon = info.icon;
                return (
                  <li key={index} className="flex items-center gap-3 text-xs font-semibold text-primary/65">
                    {/* Glass box for contact item icons */}
                    <div className="w-7 h-7 rounded-lg glass-panel bg-white/30 border-white/50 text-primary/60 flex items-center justify-center flex-shrink-0 animate-float-icon">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{info.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/40 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-primary/50 text-center">
          <span>© {currentYear} Valo Tech. All rights reserved.</span>
          <div className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-red-500 animate-pulse text-sm">❤️</span>
            <span>by Valo Tech</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
