"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Users, Briefcase, Award, Globe, MapPin, Clock } from "react-feather"; // Assuming you're using react-feather for icons
import HeroSection from "@/components/Hero"; // Make sure this component exists
import AboutUs from "@/components/about";
import { Scale, FileText, Trophy, Briefcase as BriefcaseIcon, Rocket, Coins, Factory, Hospital, GraduationCap, Monitor, ShoppingBag, BarChart } from "lucide-react";

// Animation variants for reuse
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

// Component for section titles
const SectionTitle = ({ subtitle, title }) => (
  <div className="mb-12 text-center">
    <p className="text-[#7F1C75] text-sm sm:text-base font-semibold tracking-wider uppercase mb-2">
      {subtitle}
    </p>
    <h2 className="text-3xl sm:text-4xl font-bold">
      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7F1C75] to-[#29146F]">
        {title}
      </span>
    </h2>
    <div className="w-24 h-1 bg-[#7F1C75] mx-auto mt-4"></div>
  </div>
);
const LogoCard = ({ logoUrl }) => (
  <div className="flex items-center justify-center min-w-64 h-32 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className="w-40 h-20 mx-auto flex items-center justify-center">
      <img 
        src={logoUrl} 
        alt="Client logo" 
        className="max-h-full max-w-full object-contain"
      />
    </div>
  </div>
);


{
  /* Statistics Card Component */
}
// const StatCard = ({ number, text }) => (
//   <motion.div
//     className="text-center p-6 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
//     whileHover={{ y: -4 }}
//     transition={{ duration: 0.2 }}
//   >
//     <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
//       {number}
//     </div>
//     <p className="text-gray-600 font-medium">{text}</p>
//   </motion.div>
// );

// Stat card component
const StatCard = ({ icon, value, label }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/,/g, "").replace(/\+/g, ""));
  const hasPlus = value.includes("+");

  useEffect(() => {
    // Skip animation for non-numeric values
    if (isNaN(numericValue)) {
      return;
    }

    let start = 0;
    const duration = 2000; // 2 seconds
    const increment = numericValue / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start > numericValue) {
        setCount(numericValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [numericValue]);

  // Determine which icon to use
  const Icon = () => {
    switch (icon) {
      case "clients":
        return <Users size={24} className="text-[#7F1C75]" />;
      case "services":
        return <Briefcase size={24} className="text-[#7F1C75]" />;
      case "professionals":
        return <Award size={24} className="text-[#7F1C75]" />;
      case "countries":
        return <Globe size={24} className="text-[#7F1C75]" />;
      case "states":
        return <MapPin size={24} className="text-[#7F1C75]" />;
      case "experience":
        return <Clock size={24} className="text-[#7F1C75]" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 hover:border-[#7F1C75]/20 flex flex-col items-center">
      <div className="bg-[#7F1C75]/10 p-3 rounded-full mb-4">
        <Icon />
      </div>
      <h3 className="text-3xl font-bold text-[#29146F] mb-1">
        {isNaN(numericValue) ? value : count.toLocaleString()}
        {hasPlus ? "+" : ""}
      </h3>
      <p className="text-gray-600 text-sm text-center font-medium">{label}</p>
    </div>
  );
};

// Card component for services
const ServiceCard = ({ icon: Icon, title, description }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
    whileHover={{ y: -5 }}
  >
    <div className="w-12 h-12 rounded-full bg-[#7F1C75]/10 flex items-center justify-center mb-4">
      <span className="text-[#7F1C75]">
        <Icon size={24} />
      </span>
    </div>
    <h3 className="text-xl font-bold mb-2 text-black">{title}</h3>
    <p className="text-[#4D4948]">{description}</p>
  </motion.div>
);

// Testimonial card component
const TestimonialCard = ({ quote, author, position }) => (
  <motion.div
    className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
    whileHover={{ scale: 1.02 }}
  >
    <div className="mb-4 text-[#7F1C75]">
      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
    <p className="text-[#4D4948] mb-4 italic">{quote}</p>
    <div>
      <p className="font-bold text-black">{author}</p>
      <p className="text-sm text-[#4D4948]">{position}</p>
    </div>
  </motion.div>
);

// Client logo component
const ClientLogo = ({ name }) => (
  <motion.div
    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-center h-24"
    whileHover={{ scale: 1.05 }}
  >
    <span className="font-bold text-lg text-[#29146F]">{name}</span>
  </motion.div>
);

// Industry card component
const IndustryCard = ({ icon: Icon, name }) => (
  <motion.div
    className="flex items-center space-x-3 bg-[#29146F]/5 p-3 rounded-full border border-[#29146F]/20"
    whileHover={{ scale: 1.03 }}
  >
    <span className="text-[#7F1C75]">
      <Icon size={20} />
    </span>
    <span className="font-medium text-[#29146F]">{name}</span>
  </motion.div>
);

// FAQ component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex justify-between cursor-pointer items-center w-full text-left font-semibold text-black"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 text-[#7F1C75] transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-2 text-[#4D4948]">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const Stats = () => {
  return (
    <section
      id="stats"
      className="relative py-12 md:py-24  bg-white overflow-hidden"
    >
      {/* Background pattern with subtle gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7F1C75]/5 to-[#29146F]/5" />
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, #4D4948 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div>
          <SectionTitle subtitle="Our Growth" title="KBG in Numbers" />

          {/* Stats cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-16">
            <StatCard icon="clients" value="10,000+" label="Clients Served" />
            <StatCard icon="services" value="200+" label="Business Services" />
            <StatCard
              icon="professionals"
              value="100+"
              label="Certified Professionals"
              className="flex justify-center items-center"
            />
            <StatCard icon="countries" value="12+" label="Countries Presence" />
            <StatCard icon="states" value="22+" label="Indian States Covered" />
            <StatCard
              icon="experience"
              value="15+"
              label="Years of Experience"
            />
          </div>

          {/* Bottom quote section */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <div className="h-px bg-gray-200 w-24"></div>
              <div className="px-4">
                <div className="p-3 bg-[#7F1C75]/10 rounded-full">
                  <svg
                    className="w-6 h-6 text-[#7F1C75]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
              </div>
              <div className="h-px bg-gray-200 w-24"></div>
            </div>
            <p className="text-lg text-[#4D4948] font-medium mt-4">
              Clients backed by Trust. Growth powered by Service.
            </p>
          </div>

          {/* Decorative bottom wave */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden h-8">
            <svg
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
              className="w-full h-full fill-white/30"
            >
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118.11,141.89,111.27,221.93,101.6Z"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function KBGWebsite() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-white  overflow-hidden">
      {/* About Us Section */}
      <HeroSection />
      <AboutUs />

      {/* Our Services Section */}
      <section id="services" className="relative py-10 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle subtitle="Our Services" title="What We Offer" />

            <p className="text-center text-lg text-[#4D4948] mb-12 max-w-3xl mx-auto">
              Explore our wide range of services, crafted to meet the needs of
              Startups, MSMEs, and Large Enterprises. Support from Formation to
              Profitability, including IPO.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ServiceCard
                icon={Scale}
                title="Corporate Legal Services"
                description="Corporate & Business Law, Contract Drafting & Review, Legal Advisory & Representation"
              />
              <ServiceCard
                icon={FileText}
                title="Trademark & IPR"
                description="Trademark Registration & Renewal, Copyright & Patent Filing, Brand Protection Services"
              />
              <ServiceCard
                icon={Trophy}
                title="ISO Certifications"
                description="ISO 9001, ISO 14001, ISO 27001, Audit & Compliance Assistance, Certification Guidance"
              />
              <ServiceCard
                icon={BriefcaseIcon}
                title="Business Consulting"
                description="Business Formation & Structuring, Licensing & Compliance, Market Research & Strategy"
              />
              <ServiceCard
                icon={Rocket}
                title="Startup Support and Become a Listed Company"
                description="Pitch Decks & Valuation Reports, Company Registration, Funding & Mentorship"
              />
              <ServiceCard
                icon={Coins}
                title="Financial & HR Services"
                description="Payroll Setup & Management, Accounting & Bookkeeping, Taxation, GST, TDS, etc."
              />
            </div>

            <motion.div variants={itemVariants} className="text-center mt-12">
              <p className="text-lg text-[#4D4948] mb-6">
                👉 Need a custom solution? Contact us and let's discuss your
                unique requirements.
              </p>
              <motion.button
                onClick={() => (window.location.href = "/contact")}
                className="bg-[#7F1C75] cursor-pointer text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  Contact Us Now
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <motion.div
          className="absolute top-20 right-0 w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(127, 28, 117, 0.05) 0%, transparent 70%)",
          }}
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 left-0 w-48 h-48 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(41, 20, 111, 0.08) 0%, transparent 70%)",
          }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </section>

      {/* Stats Section */}
      <Stats />

      {/* Why Choose Us Section */}
      <section id="why-choose-us" className="relative py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle subtitle="Why Choose Us" title="KBG Advantage" />

            <div className="grid grid-cols-1 text-center md:text-left lg:grid-cols-2 gap-12 items-center">
              <motion.div
                variants={itemVariants}
                className="relative order-2 lg:order-1"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-[#7F1C75]/5  p-6 rounded-xl border border-[#7F1C75]/20">
                    <div className="w-12 mx-auto md:mx-0 h-12 rounded-full bg-[#7F1C75]/10 flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6  text-[#7F1C75]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-black">
                      Direct Access to Experts
                    </h3>
                    <p className="text-[#4D4948]">
                      Our team includes Lawyers, CAs, CSs, Engineers, and
                      Consultants — No Brokers or agents in between.
                    </p>
                  </div>

                  <div className="bg-[#29146F]/5 p-6 rounded-xl border border-[#29146F]/20">
                    <div className="w-12 h-12 rounded-full bg-[#29146F]/10 flex items-center justify-center mx-auto md:mx-0 mb-4">
                      <svg
                        className="w-6 h-6 text-[#29146F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-black">
                      Affordable Pricing
                    </h3>
                    <p className="text-[#4D4948]">
                      We believe business services shouldn't be expensive or
                      confusing. Clear pricing. No surprises.
                    </p>
                  </div>

                  <div className="bg-[#29146F]/5 p-6 rounded-xl border border-[#29146F]/20">
                    <div className="w-12 h-12 rounded-full bg-[#29146F]/10 mx-auto md:mx-0 flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-[#29146F]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-black">
                      Global Reach
                    </h3>
                    <p className="text-[#4D4948]">
                      Services available across India's 27 states and trusted by
                      clients in over 22 countries.
                    </p>
                  </div>

                  <div className="bg-[#7F1C75]/5 p-6 rounded-xl border border-[#7F1C75]/20">
                    <div className="w-12 mx-auto md:mx-0 h-12 rounded-full bg-[#7F1C75]/10 flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-[#7F1C75]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16.999l4.35-4.35a2.479 2.479 0 000-3.5 2.48 2.48 0 00-3.5 0l-.338.338a2.479 2.479 0 000 3.5m4.338-4.338L15.5 5.5m-2 4L16 7m-6-2l2-2m-8.863 10h0a4 4 0 01.993-4.993l2.664-2.253m-3.686 9.92L4 21v-7l5.014-5.014a2 2 0 12.828 0l-.707.707a1 1 0 001.414 1.414l4.336-4.336a1 1 0 00-1.591-1.21c-2.466 3.124-4.135 4.95-5.019 5.48a3 3 0 00-1.13 1.608c-.005.018-.177.928-.178.928a1.49 1.49 0 00.264.773c.613.842 4.139-.564 6.845-3.15.413-.39.487-1.07.106-1.496l-6.241-6.997a1 1 0 00-1.41-.12L4 10z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-black">
                      24/7 Support
                    </h3>
                    <p className="text-[#4D4948]">
                      With our 10-channel call system and auto-forwarding, we're
                      available even after office hours to help.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="space-y-6 order-1 lg:order-2"
              >
                <h3 className="text-3xl font-bold text-black">
                  We Make All Business Services{" "}
                  <span className="text-[#7F1C75]">Simple</span>
                </h3>
                <p className="text-lg text-[#4D4948] leading-relaxed">
                  At KBG, we understand that navigating into business
                  requirements can be overwhelming. That's why we've built a
                  team of experts who provide clear, accessible, and effective
                  solutions.
                </p>
                <p className="text-lg text-[#4D4948] leading-relaxed">
                  Our integrated approach means you get comprehensive services
                  without the complexity. We handle the details so you can focus
                  on what matters most—growing your business.
                </p>

                <div className="pt-6">
                  <motion.button
                    onClick={() => (window.location.href = "/signin")}
                    className="group relative overflow-hidden cursor-pointer bg-[#7F1C75] text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Get Started
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Client Success Stories */}
      <section id="testimonials" className="relative py-10 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle
              subtitle="Client Success Stories"
              title="What Our Clients Say"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              <TestimonialCard
                quote="Satisfactory services rendered… all in time."
                author="Mr. Sudheer Kanakode"
                position="Manager, Pothys Super Stores"
              />
              <TestimonialCard
                quote="KBG helped us secure ISO certification swiftly and smoothly. Highly recommended!"
                author="Operations Head"
                position="Kerala Tourism"
              />
              <TestimonialCard
                quote="Trademark registration was a breeze with their guidance. The team is responsive and professional."
                author="Director"
                position="Aspire Systems"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section id="industries" className="relative py-10 bg-[#F9F9F9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle subtitle="Industries" title="Sectors We Served" />

            <p className="text-center text-lg text-[#4D4948] mb-12 max-w-3xl mx-auto">
              We serve diverse industries with specialized expertise
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <IndustryCard icon={Rocket} name="Startups & Entrepreneurs" />
              <IndustryCard icon={Factory} name="Manufacturing & Industrial" />
              <IndustryCard icon={Hospital} name="Healthcare & Pharma" />
              <IndustryCard icon={GraduationCap} name="Educational Institutions" />
              <IndustryCard icon={Monitor} name="IT & Software" />
              <IndustryCard icon={ShoppingBag} name="Retail & Ecommerce" />
              <IndustryCard
                icon={BarChart}
                name="Financial & Professional Services"
              />
            </div>
          </motion.div>
        </div>
      </section>

<section
  id="clients"
  className="relative py-10 bg-gradient-to-br from-gray-50 to-white overflow-hidden"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <SectionTitle subtitle="Our Clients" title="Trusted By" />

      <p className="text-center text-lg text-[#4D4948] mb-16 max-w-3xl mx-auto">
        We're proud to have worked with some of the most innovative
        companies and organizations
      </p>

      {/* Infinite Carousel */}
      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

        {/* Carousel Container */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{
              x: [0, -2200],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
          {/* First set of unique logos */}
{[
  "https://static.wixstatic.com/media/a268ba_95918e09bf63488eaf2cd870699149cc~mv2.png/v1/fill/w_190,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KERAFED.png",
  "https://static.wixstatic.com/media/a268ba_38d959aeda0943e7be864ba4dca7a20e~mv2.jpg/v1/fill/w_240,h_126,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/kerala_tourism_logo-600x315.jpg",
  "https://static.wixstatic.com/media/a268ba_56ad74dffc6041bfae53855339db09a9~mv2.jpg/v1/fill/w_161,h_154,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/AGRO.jpg",
  "https://static.wixstatic.com/media/a268ba_542fb575a3ab4619933495afa3ebe440~mv2.png/v1/fill/w_275,h_85,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MILCO.png",
  "https://static.wixstatic.com/media/a268ba_cd7ac8b7d5664c0f978fd771687622ce~mv2.png/v1/fill/w_178,h_131,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Pothys_logo_main.png",
  "https://static.wixstatic.com/media/a268ba_9e80d415d2794d1fb40a64842be0144f~mv2.png/v1/fill/w_210,h_126,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MRA.png",
  "https://static.wixstatic.com/media/a268ba_19bd14a553284b9c94cded6436e53f28~mv2.png/v1/fill/w_233,h_85,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/SANTHIGIRI.png",
  "https://static.wixstatic.com/media/a268ba_c896735b8ade4f4fa034168d0e8d94a5~mv2.jpg/v1/fill/w_190,h_134,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ASPIRE.jpg",
  "https://static.wixstatic.com/media/a268ba_5f8f349a946b45e985ff95edcfd3a03e~mv2.png/v1/fill/w_190,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MKH.png",
  "https://static.wixstatic.com/media/a268ba_b767649ae7ff4774b351ae18955256f3~mv2.png/v1/fill/w_190,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KRISTHUJYOTHI%20COLLEGE.png"
].map((logoUrl, index) => (
  <LogoCard key={`logo-${index}`} logoUrl={logoUrl} />
))}

{/* Duplicate the unique set for seamless loop */}
{[
  "https://static.wixstatic.com/media/a268ba_95918e09bf63488eaf2cd870699149cc~mv2.png/v1/fill/w_190,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KERAFED.png",
  "https://static.wixstatic.com/media/a268ba_38d959aeda0943e7be864ba4dca7a20e~mv2.jpg/v1/fill/w_240,h_126,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/kerala_tourism_logo-600x315.jpg",
  "https://static.wixstatic.com/media/a268ba_56ad74dffc6041bfae53855339db09a9~mv2.jpg/v1/fill/w_161,h_154,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/AGRO.jpg",
  "https://static.wixstatic.com/media/a268ba_542fb575a3ab4619933495afa3ebe440~mv2.png/v1/fill/w_275,h_85,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MILCO.png"
].map((logoUrl, index) => (
  <LogoCard key={`logo-${index}-2`} logoUrl={logoUrl} />
))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  </div>
</section>


      {/* FAQ Section */}
      <section id="faq" className="relative py-10 bg-[#F9F9F9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <SectionTitle subtitle="FAQs" title="Common Questions" />

            <div className="mt-12 space-y-4">
              <FAQItem
                question="How long does it take to register a company in India?"
                answer="The time varies based on the type of company and documentation. Typically, it takes 10-15 working days for a Private Limited Company, provided all documents are in order."
              />
              <FAQItem
                question="What documents are needed for trademark registration?"
                answer="You'll need identity proof, address proof, business registration documents (if applicable), and a clear representation of your trademark (logo/brand name)."
              />
              <FAQItem
                question="Do you offer services outside India?"
                answer="Yes! We serve clients in 22+ countries, offering international business setup, compliance, and legal services through our global network."
              />
              <FAQItem
                question="How do you ensure data security?"
                answer="We're ISO 27001 certified for information security. All client data is encrypted, and we follow strict confidentiality protocols."
              />
              <FAQItem
                question="Can you help with funding and investor pitches?"
                answer="Absolutely. Our startup services include pitch deck preparation, valuation reports, and connecting entrepreneurs with our investor network."
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="relative py-10 bg-gradient-to-r from-[#7F1C75] to-[#29146F]"
      >
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, white 1px, transparent 1px),
                linear-gradient(to bottom, white 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto">
              Whether you're just starting out or looking to scale up, our experts
              are here to help you to navigate the business landscape with
              confidence.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                onClick={() => (window.location.href = "/contact")}
                className="bg-white text-[#7F1C75] cursor-pointer px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get a Free Consultation
              </motion.button>
              <motion.button
                className="bg-transparent border-2 cursor-pointer border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Call Us: +91 85 9393 9336
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
