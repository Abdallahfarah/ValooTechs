import { motion } from 'framer-motion';
import DashboardScreen from './DashboardScreen';

export default function FeaturedProject() {
  return (
    <section id="project" className="py-24 px-6 relative overflow-hidden bg-white/10 scroll-mt-24">
      {/* Background glowing blob */}
      <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-primary-light/4 rounded-full blur-[130px] pointer-events-none -z-10 animate-blob-2" />

      <div className="w-full max-w-6xl mx-auto z-10">
        {/* Header Title Row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="text-left">
            <span className="text-[11px] font-extrabold tracking-widest text-secondary uppercase block mb-3">
              RECENT WORK
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
              Featured Project
            </h2>
          </div>
          
          <motion.a
            href="#contact"
            whileHover="hover"
            whileTap="tap"
            variants={{
              hover: { y: -6, scale: 1.03 },
              tap: { y: 0, scale: 0.98 }
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 text-primary text-xs font-bold tracking-wide rounded-full glass-button-light hover:bg-white/40 hover:border-white/70 transition-glass duration-500 group overflow-hidden"
          >
            {/* Sweep Reflection */}
            <motion.div
              className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -left-full pointer-events-none"
              variants={{
                hover: {
                  left: '100%',
                  transition: { duration: 0.8, ease: 'easeInOut' }
                }
              }}
            />
            <span>View All Projects</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
        </div>

        {/* Large Glass Container Box */}
        <motion.div
          className="glass-panel-heavy rounded-[32px] p-8 lg:p-12 grid grid-cols-12 gap-8 lg:gap-12 items-center shadow-glass-lg relative overflow-hidden border border-white/60 cursor-pointer"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          whileHover={{ y: -10, scale: 1.01 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />

          {/* Left: Device Mockup (Browser with Dashboard) */}
          <div className="col-span-12 lg:col-span-7 flex justify-center">
            <div className="w-full max-w-[620px] aspect-[16/10.5] glass-panel bg-[#0E0F19] rounded-2xl overflow-hidden shadow-2xl border border-white/15 transform hover:scale-[1.02] hover:-rotate-1 transition-transform duration-500 flex flex-col">
              {/* Browser Header Bar */}
              <div className="bg-[#181829] border-b border-white/10 px-4 py-3 flex items-center gap-2 flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <div className="h-5 px-3 bg-white/5 rounded-md flex items-center text-[10px] text-white/40 ml-4 w-64 select-none">
                  dhadhan-hub.smart/dashboard
                </div>
              </div>
              
              {/* Scaled Dashboard Content */}
              <div className="flex-1 overflow-hidden relative bg-[#0E0F19]">
                <div className="absolute top-0 left-0 origin-top-left scale-[0.61] w-[1024px] h-[670px] pointer-events-none">
                  <DashboardScreen />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Description & CTA */}
          <div className="col-span-12 lg:col-span-5 text-left flex flex-col justify-center">
            {/* Available for Deployment Badge (Frosted Glass version) */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel bg-[#68C247]/5 border-[#68C247]/30 text-[10px] font-bold tracking-widest text-secondary uppercase shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                Available for Deployment
              </span>
            </div>

            {/* Project Title */}
            <h3 className="text-3xl font-extrabold text-[#0A0E1A] tracking-tight mb-4">
              Dhadhan Hub
            </h3>

            {/* Project Subtitle / Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {[
                'Restaurant POS',
                'QR Menu Ordering',
                'Kitchen Display',
                'Staff Management',
                'Business Reports'
              ].map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-primary/75 px-3 py-1 bg-white/40 border border-white/60 rounded-full shadow-sm">
                  {tag}
                </span>
              ))}
            </div>

            {/* Description Paragraph */}
            <p className="text-sm text-primary/70 leading-relaxed mb-8">
              Dhadhan Hub helps restaurants run smoothly with an all-in-one platform for POS, kitchen display, table management, staff, payments, and business reporting.
            </p>

            {/* CTA Button (Primary Glass Button) */}
            <motion.a
              href="#contact"
              whileHover="hover"
              whileTap="tap"
              variants={{
                hover: { y: -6, scale: 1.03 },
                tap: { y: 0, scale: 0.98 }
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="self-start inline-flex items-center gap-2 px-6 py-3.5 text-white text-xs font-bold tracking-wide rounded-full glass-button-primary hover:border-white/50 transition-glass duration-500 group overflow-hidden"
            >
              {/* Sweep Reflection */}
              <motion.div
                className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -left-full pointer-events-none"
                variants={{
                  hover: {
                    left: '100%',
                    transition: { duration: 0.8, ease: 'easeInOut' }
                  }
                }}
              />
              <span>Book Demo Now</span>
              <svg
                className="w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
