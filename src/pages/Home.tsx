import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Scissors, Sparkles, Camera, CheckCircle } from 'lucide-react';

export function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&h=1080&fit=crop"
            alt="Luxury Salon"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark via-bg-dark/50 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold tracking-widest uppercase mb-6">
              <Sparkles className="w-3 h-3" />
              AI-Powered Hairstyling
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
              Find Your <span className="text-gold italic">Perfect</span> Look with AI.
            </h1>
            <p className="text-lg text-white/60 mb-10 leading-relaxed">
              Upload a photo and let our advanced AI analyze your facial features to recommend 
              the most flattering hairstyles. Experience a virtual salon transformation in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/upload" className="btn-gold text-center">
                Start Your Analysis
              </Link>
              <Link to="/booking" className="btn-outline-gold text-center">
                Book a Salon
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How It Works</h2>
            <p className="text-white/50">Three simple steps to your new signature style.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Camera className="w-8 h-8 text-gold" />,
                title: "Upload Photo",
                desc: "Take a clear, front-facing photo of your face."
              },
              {
                icon: <Sparkles className="w-8 h-8 text-gold" />,
                title: "AI Analysis",
                desc: "Our AI detects your face shape and analyzes features."
              },
              {
                icon: <CheckCircle className="w-8 h-8 text-gold" />,
                title: "Virtual Try-On",
                desc: "Instantly see how recommended styles look on you."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="card-premium text-center"
              >
                <div className="inline-flex p-4 rounded-2xl bg-gold/5 border border-gold/10 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-white/50 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="card-premium bg-gradient-to-br from-gold/10 to-transparent border-gold/20 flex flex-col md:flex-row items-center justify-between gap-8 p-12">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Ready for a Change?</h2>
              <p className="text-white/60">
                Join thousands of users who found their perfect hairstyle using our AI technology.
                It's free, fast, and incredibly accurate.
              </p>
            </div>
            <Link to="/upload" className="btn-gold whitespace-nowrap">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
