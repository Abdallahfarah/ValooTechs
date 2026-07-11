import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Code, Video, Megaphone } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Reusable Tilt Card Component (Capped strictly at 3° tilt and -10px lift)
function ServiceCard({ icon: Icon, number, title, description, linkText, linkHref, accentClass, iconBgClass }: {
  icon: any,
  number: string,
  title: string,
  description: string,
  linkText: string,
  linkHref: string,
  accentClass: string,
  iconBgClass: string
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [shineX, setShineX] = useState(50);
  const [shineY, setShineY] = useState(50);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const pctX = (mouseX / width) - 0.5;
    const pctY = (mouseY / height) - 0.5;
    
    // Rotate values (strictly capped at 3 degrees)
    setRotateX(-pctY * 3);
    setRotateY(pctX * 3);
    
    setShineX((mouseX / width) * 100);
    setShineY((mouseY / height) * 100);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${isHovered ? -10 : 0}px) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="glass-panel relative rounded-3xl p-8 flex flex-col justify-between h-[360px] cursor-pointer group overflow-hidden transition-all duration-500 shadow-glass hover:shadow-glass-lg hover:border-white/80"
    >
      {/* 3D Glass Shine Layer */}
      <div
        style={{
          background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255, 255, 255, 0.2) 0%, transparent 60%)`,
        }}
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      />

      {/* Top Section */}
      <div className="flex justify-between items-start" style={{ transform: 'translateZ(20px)' }}>
        {/* Floating Glass Icon Container */}
        <div className={`p-4 rounded-2xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-float-icon ${iconBgClass}`}>
          <Icon className="w-6 h-6 stroke-[2]" />
        </div>
        <span className="text-sm font-bold text-primary/30 tracking-widest">{number}</span>
      </div>

      {/* Content */}
      <div className="mt-8 flex-1 flex flex-col justify-between" style={{ transform: 'translateZ(35px)' }}>
        <div>
          <h3 className="text-xl font-bold text-primary mb-3 transition-colors duration-300 group-hover:text-primary-dark">
            {title}
          </h3>
          <p className="text-sm text-primary/60 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Link Button */}
        <a
          href={linkHref}
          className={`inline-flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase mt-4 transition-transform duration-300 group-hover:translate-x-1.5 ${accentClass}`}
        >
          <span>{linkText}</span>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  );
}

export default function Services() {
  const servicesData = [
    {
      icon: Code,
      number: '01',
      title: 'Software Development',
      description: 'I build fast, secure, and scalable web applications using modern technologies that deliver real results.',
      linkText: 'Learn More',
      linkHref: '#project',
      accentClass: 'text-primary hover:text-primary-dark',
      iconBgClass: 'bg-primary/5 border-primary/25 text-primary shadow-sm shadow-primary/5',
    },
    {
      icon: Video,
      number: '02',
      title: 'Branding & Video Production',
      description: 'I create powerful brand identities and cinematic videos that tell your story and connect with your audience.',
      linkText: 'Learn More',
      linkHref: '#contact',
      accentClass: 'text-secondary hover:text-secondary-dark',
      iconBgClass: 'bg-secondary/5 border-secondary/25 text-secondary shadow-sm shadow-secondary/5',
    },
    {
      icon: Megaphone,
      number: '03',
      title: 'Digital Marketing',
      description: 'I help you grow your brand online with smart strategies, content creation, and ads that generate traffic and sales.',
      linkText: 'Learn More',
      linkHref: '#contact',
      accentClass: 'text-primary hover:text-primary-dark',
      iconBgClass: 'bg-purple-500/5 border-purple-500/25 text-purple-600 shadow-sm shadow-purple-500/5',
    },
  ];

  // GSAP ScrollTrigger reveal for Services heading (starts top 98%, ends top 78%, scrub 0.2, ease power2.out)
  useEffect(() => {
    const heading = document.getElementById('services-heading');
    if (!heading) return;

    // Set initial hidden properties (opacity 0, y: 20, blur 4px)
    gsap.set(heading, {
      opacity: 0,
      y: 20,
      filter: 'blur(4px)',
    });

    const trigger = ScrollTrigger.create({
      trigger: '#services',
      start: 'top 98%',
      end: 'top 78%',
      scrub: 0.2, // 200ms latency, extremely responsive
      animation: gsap.to(heading, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power2.out',
        force3D: true,
      }),
      toggleActions: 'play none none reverse',
      invalidateOnRefresh: true,
    });

    return () => {
      trigger.kill();
    };
  }, []);

  // Cards Reveal: Moves up 40px, Fades In, Scales 0.96 -> 1, Custom cascading delay
  const cardRevealVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.96 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        delay: (index + 1) * 0.1, // Card 1 gets 0.1s delay, Card 2 gets 0.2s, Card 3 gets 0.3s
        ease: [0.215, 0.61, 0.355, 1] as const, // easeOutCubic (power3.out equivalent)
      }
    })
  };

  return (
    <section id="services" className="pt-12 pb-24 px-6 relative overflow-hidden bg-white/20 scroll-mt-24">
      {/* Background radial soft light */}
      <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-secondary-light/4 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto z-10">
        {/* Title Header Group: Centered, controlled entirely by GSAP ScrollTrigger */}
        <div
          id="services-heading"
          className="flex flex-col items-center text-center justify-center max-w-2xl mx-auto mb-16 will-change-[transform,opacity,filter]"
        >
          <span className="text-[11px] font-extrabold tracking-widest text-secondary uppercase block mb-3">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
            Services we Provide <br className="hidden sm:inline" />
            to My <span className="text-secondary">Clients</span>
          </h2>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={cardRevealVariants}
            >
              <ServiceCard {...service} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
