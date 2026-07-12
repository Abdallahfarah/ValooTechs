import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Facebook, Instagram, XCircle } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; subMessage?: string; isError?: boolean }>({
    show: false,
    message: '',
  });

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const validate = () => {
    const temp: Record<string, string> = {};
    if (!form.name.trim()) temp.name = 'Name is required';
    if (!form.email.trim()) {
      temp.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      temp.email = 'Email is invalid';
    }
    if (!form.subject.trim()) temp.subject = 'Subject is required';
    if (!form.message.trim()) {
      temp.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      temp.message = 'Message must be at least 10 characters';
    }
    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          ownerName: 'Abdallah Abdirahman',
          ownerEmail: 'valodev14@gmail.com',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setForm({ name: '', email: '', subject: '', message: '' });
        setErrors({});
        setToast({
          show: true,
          message: '✓ Message sent successfully!',
          subMessage: 'Thank you for contacting VALO TECH.\nWe will get back to you as soon as possible.',
          isError: false,
        });
      } else {
        setToast({
          show: true,
          message: 'Unable to send your message.',
          subMessage: data.message || 'Please try again later.',
          isError: true,
        });
      }
    } catch (err) {
      console.error('Submission error:', err);
      setToast({
        show: true,
        message: 'Unable to send your message.',
        subMessage: 'Please try again later.',
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden bg-white/10 scroll-mt-24">
      {/* Background glowing blob */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary-light/4 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse" />

      <div className="w-full max-w-6xl mx-auto z-10">
        {/* Title Header */}
        <div className="flex flex-col items-center text-center justify-center max-w-2xl mx-auto mb-16">
          <span className="text-[11px] font-extrabold tracking-widest text-secondary uppercase block mb-3">
            GET IN TOUCH
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
            Let's Build Something <span className="text-secondary">Amazing</span>
          </h2>
        </div>

        {/* Content Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Contact info & socials */}
          <div className="col-span-12 lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="glass-panel p-8 rounded-3xl border border-white/60 text-left flex flex-col justify-between h-full">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-extrabold text-primary mb-3">Contact Information</h3>
                  <p className="text-xs text-primary/65 leading-relaxed">
                    Have a project in mind or want to schedule a demo? Reach out to us. We will get back to you within 24 hours.
                  </p>
                </div>

                <div className="space-y-5">
                  {[
                    { icon: Mail, title: 'Email Us', value: 'Valodev14@gmail.com', href: 'mailto:Valodev14@gmail.com' },
                    { icon: Phone, title: 'Call Us', value: '+251 915 783 928', href: 'tel:+251915783928' },
                    { icon: MapPin, title: 'Visit Us', value: 'Jijiga, Somali Region, Ethiopia', href: '#' },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div key={idx} className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-primary/5 border border-primary/20 text-primary flex items-center justify-center flex-shrink-0 animate-float-icon">
                          <Icon className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-primary/45 uppercase tracking-wider block">
                            {item.title}
                          </span>
                          <a
                            href={item.href}
                            className="text-xs font-bold text-primary hover:text-secondary transition-colors duration-200"
                          >
                            {item.value}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Social Icons inside glass containers */}
              <div className="border-t border-white/40 pt-8 mt-8">
                <span className="text-[10px] font-bold text-primary/45 uppercase tracking-wider block mb-4">
                  Connect With Us
                </span>
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
                        whileHover={{ y: -4, scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 15 }}
                        className="w-9 h-9 rounded-full glass-panel bg-white/30 border-white/60 text-primary hover:text-secondary flex items-center justify-center shadow-sm"
                      >
                        <Icon className="w-4 h-4 stroke-[2.2]" />
                      </motion.a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="col-span-12 lg:col-span-7">
            <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/60 text-left h-full flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary/60 uppercase tracking-wider block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-white/40 border ${
                        errors.name ? 'border-red-500/50 focus:border-red-500' : 'border-white/60 focus:border-primary/40'
                      } text-xs font-semibold text-primary placeholder-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 backdrop-blur-xs transition-all duration-300`}
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="text-[9px] font-bold text-red-500">{errors.name}</span>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary/60 uppercase tracking-wider block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl bg-white/40 border ${
                        errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/60 focus:border-primary/40'
                      } text-xs font-semibold text-primary placeholder-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 backdrop-blur-xs transition-all duration-300`}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="text-[9px] font-bold text-red-500">{errors.email}</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary/60 uppercase tracking-wider block">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-white/40 border ${
                      errors.subject ? 'border-red-500/50 focus:border-red-500' : 'border-white/60 focus:border-primary/40'
                    } text-xs font-semibold text-primary placeholder-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 backdrop-blur-xs transition-all duration-300`}
                    placeholder="Inquiry about services"
                  />
                  {errors.subject && <span className="text-[9px] font-bold text-red-500">{errors.subject}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary/60 uppercase tracking-wider block">
                    Your Message
                  </label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-white/40 border ${
                      errors.message ? 'border-red-500/50 focus:border-red-500' : 'border-white/60 focus:border-primary/40'
                    } text-xs font-semibold text-primary placeholder-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 backdrop-blur-xs resize-none transition-all duration-300`}
                    placeholder="Tell us about your project or questions..."
                  />
                  {errors.message && <span className="text-[9px] font-bold text-red-500">{errors.message}</span>}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-light border border-white/20 text-white rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-95 disabled:opacity-80 transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-primary/10 overflow-hidden relative"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full p-4 rounded-2xl glass-panel bg-white/80 border-white/60 shadow-2xl backdrop-blur-md text-left flex items-start gap-3.5"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              toast.isError ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-secondary/10 text-secondary border border-secondary/20'
            }`}>
              {toast.isError ? <XCircle className="w-5 h-5 stroke-[2.2]" /> : <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />}
            </div>
            <div className="flex-1 space-y-1">
              <h4 className="text-xs font-extrabold text-primary">
                {toast.message}
              </h4>
              {toast.subMessage && (
                <p className="text-[10px] font-semibold text-primary/65 leading-relaxed whitespace-pre-line">
                  {toast.subMessage}
                </p>
              )}
            </div>
            <button
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
              className="text-primary/45 hover:text-primary transition-colors text-xs font-bold self-start"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
