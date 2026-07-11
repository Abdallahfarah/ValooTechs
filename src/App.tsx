import { useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import FeaturedProject from './components/FeaturedProject';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Footer from './components/Footer';
import siteBg from './assets/site-bg.jpg';

export default function App() {
  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1, // Reduced duration slightly to lower scroll interpolation latency
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
        cancelAnimationFrame(rafId);
      } else {
        lenis.start();
        rafId = requestAnimationFrame(raf);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      className="relative min-h-screen selection:bg-secondary/20 select-text hero-background"
      style={{ backgroundImage: `url(${siteBg})` }}
    >
      {/* Main Layout Elements */}
      <div className="relative z-10">
        <Navbar />
        
        <main>
          {/* Hero Section containing the 3D Canvas */}
          <Hero />
          
          {/* Services Section showing what we offer */}
          <Services />
          
          {/* About Section outlining mission, vision and values */}
          <About />
          
          {/* Featured Project Section */}
          <FeaturedProject />
          
          {/* Statistics grid with animated counter metrics */}
          <Stats />
          
          {/* Contact form and info section */}
          <Contact />
        </main>
        
        {/* Footer map and social credits */}
        <Footer />
      </div>
    </div>
  );
}
