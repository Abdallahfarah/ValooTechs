import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, Zap, Sparkles } from 'lucide-react';

export default function About() {
  const whyChooseUs = [
    {
      icon: Zap,
      title: 'Premium Engineering',
      description: 'We write highly optimized, type-safe, and clean code that scales seamlessly under load.',
    },
    {
      icon: Sparkles,
      title: 'Aesthetic Excellence',
      description: 'We design pixel-perfect, interactive interfaces with glassmorphism and micro-animations.',
    },
    {
      icon: ShieldCheck,
      title: 'Enterprise Security',
      description: 'Ironclad security and high availability built directly into the core architecture of every project.',
    },
  ];

  const miniStats = [
    { value: '99.9%', label: 'SLA Uptime' },
    { value: '24/7', label: 'Tech Support' },
    { value: '100%', label: 'Delivery Rate' },
  ];

  return (
    <section id="about" className="py-24 px-6 relative overflow-hidden bg-white/5 scroll-mt-24">
      {/* Background glowing blob */}
      <div className="absolute top-[30%] left-[-10%] w-[500px] h-[500px] bg-primary-light/3 rounded-full blur-[130px] pointer-events-none -z-10" />

      <div className="w-full max-w-6xl mx-auto z-10">
        {/* Header Title */}
        <div className="flex flex-col items-center text-center justify-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-extrabold tracking-widest text-secondary uppercase block mb-3">
            WHO WE ARE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
            Pioneering Next-Gen <span className="text-secondary">Digital Solutions</span>
          </h2>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Left Column: Mission & Vision */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            <motion.div
              className="glass-panel p-8 rounded-3xl border border-white/60 hover:border-white/80 transition-glass duration-300 flex-1 flex flex-col text-left justify-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/5 border border-primary/25 text-primary flex items-center justify-center">
                  <Target className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-primary">Our Mission</h3>
              </div>
              <p className="text-sm text-primary/70 leading-relaxed">
                To empower modern enterprises with high-fidelity 3D interactive interfaces, scalable cloud infrastructure, and robust POS systems that simplify operations and spark sustainable growth.
              </p>
            </motion.div>

            <motion.div
              className="glass-panel p-8 rounded-3xl border border-white/60 hover:border-white/80 transition-glass duration-300 flex-1 flex flex-col text-left justify-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3.5 mb-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/5 border border-secondary/25 text-secondary flex items-center justify-center">
                  <Eye className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-lg font-bold text-primary">Our Vision</h3>
              </div>
              <p className="text-sm text-primary/70 leading-relaxed">
                To stand as the premier boutique digital studio recognized worldwide for marrying cutting-edge visual aesthetics with performant engineering models that push browser boundaries.
              </p>
            </motion.div>
          </div>

          {/* Right Column: Why Choose Us & Mini Stats */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/60 flex-1 flex flex-col text-left justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-primary mb-6">Why Choose VALO</h3>
                <div className="space-y-6">
                  {whyChooseUs.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex gap-4 items-start">
                        <div className="w-8 h-8 rounded-lg bg-primary/5 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Icon className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-primary tracking-wide uppercase mb-1">
                            {item.title}
                          </h4>
                          <p className="text-xs text-primary/65 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mini Stats row */}
              <div className="grid grid-cols-3 gap-4 border-t border-white/40 pt-6 mt-8">
                {miniStats.map((stat, idx) => (
                  <div key={idx} className="flex flex-col text-center">
                    <span className="text-lg sm:text-xl font-extrabold text-secondary">
                      {stat.value}
                    </span>
                    <span className="text-[9px] font-bold text-primary/45 tracking-wider uppercase mt-1">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
