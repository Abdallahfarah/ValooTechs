import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, Calendar, Award } from 'lucide-react';

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    const duration = 1.5; // seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = (currentTime - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      const currentCount = Math.floor(easeProgress * (end - start) + start);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-3xl font-extrabold text-primary">
      {count}
      {suffix}
    </span>
  );
}

function StatCard({ icon: Icon, value, suffix, label, isGreenTheme }: {
  icon: any;
  value: number;
  suffix: string;
  label: string;
  isGreenTheme?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
      className={`glass-panel p-6 rounded-2xl flex items-center gap-4 border border-white/65 hover:border-white/95 relative overflow-hidden group cursor-pointer ${
        isGreenTheme ? 'glass-glow-secondary' : 'glass-glow-primary'
      }`}
    >
      {/* Floating Glass Icon Frame */}
      <div className={`p-3.5 rounded-xl border flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 animate-float-icon ${
        isGreenTheme ? 'bg-secondary/5 border-secondary/25 text-secondary shadow-sm shadow-secondary/5' : 'bg-primary/5 border-primary/25 text-primary shadow-sm shadow-primary/5'
      }`}>
        <Icon className="w-5 h-5 stroke-[2.5]" />
      </div>

      {/* Metrics */}
      <div className="flex flex-col text-left">
        <Counter value={value} suffix={suffix} />
        <span className="text-[11px] font-bold text-primary/50 tracking-wider mt-0.5 uppercase">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  const statsData = [
    {
      icon: Briefcase,
      value: 15,
      suffix: '+',
      label: 'Projects Completed',
      isGreenTheme: false,
    },
    {
      icon: Users,
      value: 10,
      suffix: '+',
      label: 'Happy Clients',
      isGreenTheme: true,
    },
    {
      icon: Calendar,
      value: 1,
      suffix: '+',
      label: 'Years Experience',
      isGreenTheme: false,
    },
    {
      icon: Award,
      value: 100,
      suffix: '%',
      label: 'Client Satisfaction',
      isGreenTheme: true,
    },
  ];

  return (
    <section className="py-12 px-6 relative overflow-hidden bg-white/5">
      <div className="w-full max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
