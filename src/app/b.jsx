'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };
  
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  if (!mounted) return null;

  return (
    <section className="relative h-full bg-white overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, #4D4948 1px, transparent 1px),
                linear-gradient(to bottom, #4D4948 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />
        </div>
        
        {/* Accent elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-[#7F1C75]"></div>
        
        {/* Decorative shapes */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(127, 28, 117, 0.05) 0%, transparent 70%)',
          }}
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/3 right-1/3 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(41, 20, 111, 0.08) 0%, transparent 70%)',
          }}
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
          
          {/* Text Content */}
          <motion.div
            className="space-y-4 lg:space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
           
            {/* Tagline */}
            <motion.div variants={itemVariants}>
              <p className="text-[#7F1C75] text-sm sm:text-base font-semibold tracking-wider uppercase">
                Expert Legal Representation
              </p>
            </motion.div>
            
            {/* Headline */}
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black">
                <span className="block">Discover</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#7F1C75] to-[#29146F]">
                  the World of Great
                </span>
                <span className="block">Entrepreneurship</span>
              </h1>
            </motion.div>
            
            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className="text-[#4D4948] text-lg sm:text-xl max-w-2xl leading-relaxed">
                Navigating law with clarity, confidence, and commitment. From corporate to personal legal matters — our dedicated team delivers results that protect your interests and drive success.
              </p>
            </motion.div>
            
            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <motion.button
                className="group relative overflow-hidden bg-[#7F1C75] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Discover Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </motion.button>
              <motion.button
                className="group border-2 border-[#29146F] text-[#29146F] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#29146F]/5 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  Learn More
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
          
          {/* Right Side - Visual and Trust Badges */}
          <motion.div
            className="relative hidden lg:flex flex-col h-full"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative h-[350px] w-full mb-4">
              <motion.div
                className="absolute inset-0 rounded-xl overflow-hidden shadow-2xl"
                animate={floatingAnimation}
              >
                {/* Decorative border */}
                <div className="absolute -inset-1 border-2 border-[#7F1C75] rounded-xl transform rotate-2"></div>
                
                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#29146F]/10 to-[#7F1C75]/10 backdrop-blur-sm" />
                
                <Image
                  src="https://plus.unsplash.com/premium_photo-1679923814027-2afd45cd2563?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Professional legal team"
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
              
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-6 -right-6 w-16 h-16 bg-[#29146F] rounded-full flex items-center justify-center shadow-xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </motion.div>
            </div>
            
            {/* Trust Badges */}
            <motion.div 
              className="bg-[#29146F]/5 p-6 rounded-xl border border-[#29146F]/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-[#7F1C75] text-sm font-bold mb-1">TRUSTED BY CLIENTS WORLDWIDE</div>
              <div className="text-black text-xl font-semibold mb-3">Award-Winning Legal Services</div>
             
              <div className="flex flex-wrap gap-3">
                <span className="text-xs bg-[#29146F]/10 text-[#29146F] px-3 py-1.5 rounded-full">ISO 9001 Certified</span>
                <span className="text-xs bg-[#29146F]/10 text-[#29146F] px-3 py-1.5 rounded-full">Best Law Firm 2023</span>
                <span className="text-xs bg-[#29146F]/10 text-[#29146F] px-3 py-1.5 rounded-full">AV-Rated</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Mobile View - Trust Badges below content */}
          <motion.div 
            className="lg:hidden mt-12 bg-[#29146F]/5 p-6 rounded-xl border border-[#29146F]/20"
            variants={itemVariants}
          >
            <div className="text-[#7F1C75] text-sm font-bold mb-1">TRUSTED BY CLIENTS WORLDWIDE</div>
            <div className="text-black text-xl font-semibold mb-3">Award-Winning Legal Services</div>
            <div className="text-[#4D4948] text-sm leading-relaxed mb-4">
              Recognized for excellence in legal practice and client service.
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="text-xs bg-[#29146F]/10 text-[#29146F] px-3 py-1.5 rounded-full">ISO 9001 Certified</span>
              <span className="text-xs bg-[#29146F]/10 text-[#29146F] px-3 py-1.5 rounded-full">Best Law Firm 2023</span>
              <span className="text-xs bg-[#29146F]/10 text-[#29146F] px-3 py-1.5 rounded-full">AV-Rated</span>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Image Background */}
      <motion.div
        className="lg:hidden absolute inset-0 opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/api/placeholder/800/1200"
          alt="Legal team"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/90 to-white" />
      </motion.div>
      
      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-[#7F1C75] rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-[#7F1C75] rounded-full mt-2"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
      
      <style jsx>{`
        @keyframes spin-slow {
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
}