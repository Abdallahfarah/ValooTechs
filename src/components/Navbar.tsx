import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Services', href: '#services' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Transition header glass styling when scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for Active Link Highlighting
  useEffect(() => {
    const sections = ['home', 'services', 'about', 'contact'];
    
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const nameMap: Record<string, string> = {
              home: 'Home',
              services: 'Services',
              about: 'About',
              contact: 'Contact',
            };
            setActiveTab(nameMap[id]);
          }
        },
        {
          rootMargin: '-100px 0px -60% 0px', // triggers when the section dominates the viewport center
          threshold: 0,
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  // Handle click scroll with sticky header offsets (implemented via scroll-margin-top CSS)
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string, name: string) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile drawer
    
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setActiveTab(name);
    }
  };

  // Combined Logo & Brand name Home/Refresh action
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    
    if (window.scrollY < 10) {
      window.location.reload(); // Refresh if already at home/top
    } else {
      const homeSection = document.getElementById('home');
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setActiveTab('Home');
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 flex justify-center px-4 ${
        scrolled ? 'pt-3' : 'pt-6'
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className={`w-full max-w-6xl flex items-center justify-between transition-all duration-500 rounded-full px-6 py-3 border relative ${
          scrolled
            ? 'glass-panel bg-white/70 py-2.5 shadow-glass-lg'
            : 'bg-white/30 border-white/20 shadow-glass-sm'
        }`}
      >
        {/* Clickable Brand Wrapper */}
        <a 
          href="/" 
          onClick={handleLogoClick}
          aria-label="VALO Tech Home"
          className="flex items-center gap-3.5 group select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 rounded-xl p-1"
        >
          <img
            src="/logo_icon_transparent.png"
            alt="VALO Logo"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain select-none pointer-events-none transform group-hover:scale-[1.03] transition-transform duration-[250ms] ease-out"
          />
          <span className="font-extrabold text-base sm:text-lg tracking-wider text-primary/75 group-hover:text-[#2D2D73] transition-colors duration-[250ms] ease-out whitespace-nowrap">
            VALO Tech
          </span>
        </a>

        {/* Center Links (Desktop Nav) */}
        <nav className="hidden md:flex items-center gap-1.5 bg-white/20 backdrop-blur-xs p-1 rounded-full border border-white/30">
          {navLinks.map((link) => {
            const isActive = activeTab === link.name;
            const targetId = link.href.replace('#', '');
            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, targetId, link.name)}
                aria-current={isActive ? 'page' : undefined}
                className={`relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                  isActive ? 'text-primary' : 'text-primary/70 hover:text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute inset-0 bg-white/60 border border-white/40 shadow-sm rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right CTA / Mobile Menu toggle */}
        <div className="flex items-center gap-3">
          <motion.a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 'contact', 'Contact')}
            whileHover="hover"
            whileTap="tap"
            variants={{
              hover: { y: -3, scale: 1.02 },
              tap: { y: 0, scale: 0.98 }
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="hidden md:inline-flex relative items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide text-white glass-button-primary hover:border-white/50 transition-glass duration-500 group overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/45"
          >
            {/* Sweep sweep reflection */}
            <motion.div
              className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -left-full pointer-events-none"
              variants={{
                hover: {
                  left: '100%',
                  transition: { duration: 0.8, ease: 'easeInOut' }
                }
              }}
            />
            <span>Let's Talk</span>
            <div className="w-5 h-5 rounded-full bg-[#68C247] flex items-center justify-center text-white transform group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-all duration-300">
              <svg
                className="w-3 h-3 stroke-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </div>
          </motion.a>

          {/* Hamburger (Mobile Toggle) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden w-10 h-10 rounded-full flex items-center justify-center bg-white/20 border border-white/30 text-primary hover:text-secondary hover:bg-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors duration-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="absolute top-full left-0 w-full mt-3 p-6 glass-panel bg-white/95 border border-white/60 shadow-glass-lg rounded-3xl md:hidden flex flex-col gap-4 text-left z-40"
            >
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const isActive = activeTab === link.name;
                  const targetId = link.href.replace('#', '');
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, targetId, link.name)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-4 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary/5 text-primary border-l-4 border-secondary pl-3' 
                          : 'text-primary/70 hover:text-primary hover:bg-black/5'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                })}
              </nav>

              <div className="border-t border-white/40 pt-4 mt-2">
                <a
                  href="#contact"
                  onClick={(e) => handleLinkClick(e, 'contact', 'Contact')}
                  className="w-full py-3.5 bg-gradient-to-r from-primary to-primary-light border border-white/20 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-95 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-primary/10"
                >
                  <span>Let's Talk</span>
                  <svg className="w-3.5 h-3.5 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
