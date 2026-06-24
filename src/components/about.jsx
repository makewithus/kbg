import { useState, useEffect } from "react";
import { CheckCircle, Award, Eye, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants for motion components
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

// Components
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


const ValueCard = ({ icon, title, description }) => {
  const Icon = () => {
    switch (icon) {
      case "integrity": return <CheckCircle className="text-[#7F1C75] w-6 h-6" />;
      case "excellence": return <Award className="text-[#7F1C75] w-6 h-6" />;
      case "transparency": return <Eye className="text-[#7F1C75] w-6 h-6" />;
      case "innovation": return <Lightbulb className="text-[#7F1C75] w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md border  border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-[#7F1C75]/20">
      
      <div className="flex items-start space-x-3">
      <div className="absolute inset-0">
        <div className="absolute inset-0 " />
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle, #4D4948 1px, transparent 1px)`,
              backgroundSize: '30px 30px',
            }}
          />
        </div>
      </div>
        <div className="mt-1">
          <Icon />
        </div>
        <div>
          <h4 className="font-semibold text-lg text-[#29146F]">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </div>
  );
};

// Statistic component
const StatisticCard = ({ value, label, delay }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseInt(value.replace(/,/g, ""));
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start > end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <div className="text-center gap-2 md:gap-0 flex justify-center items-center">
      <p className="text-3xl font-bold text-[#29146F]">
        {count.toLocaleString()}+
      </p>
      <p className="text-sm text-center text-gray-600 mt-1">{label}</p>
    </div>
  );
};

const AboutUs = () => {
  return (
    <section id="about-us" className="relative py-6 md:py-14 w-full bg-gradient-to-br from-[#7F1C75]/5 to-[#29146F]/5 overflow-hidden">
      {/* Subtle background grid pattern */}
      <div className="absolute w-full inset-0 opacity-5">
        <div 
          className="w-full h-full"
          
        />
      </div>
      
      {/* Accent border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#29146F] to-[#7F1C75]"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 md:py-0 py-12 relative z-10">
        <div>
          <SectionTitle subtitle="About Us" title="Who We Are" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left column - Text content */}
            <div className="lg:col-span-6 space-y-6">
              <p className="text-lg text-[#4D4948] leading-relaxed">
                KBG INDIA is a trusted name in business consulting and legal services, recognized under Start-up India and certified with ISO 9001, ISO 14001, and ISO 27001. We bring expertise and reliability to every client engagement.
              </p>
              <p className="text-lg text-[#4D4948] leading-relaxed">
                Our goal is simple: to empower entrepreneurs, simplify compliance, and build lasting business relationships that drive success.
              </p>
              
              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2 md:py-8 border-y border-gray-100 text-center my-8">
                <StatisticCard value="10,000" label="Clients Served" delay={0} />
                <StatisticCard value="20" label="Indian States" delay={200} />
                <StatisticCard value="12" label="Countries" delay={400} />
              </div>

              <motion.button
                onClick={() => (window.location.href = "/about")}
                className="bg-[#7F1C75] md:w-max w-full cursor-pointer text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-2">
                  About Us
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
            
            {/* Right column - Image */}
            <div className="lg:col-span-6 relative">
              <div className="relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl">
                {/* Decorative border */}
                <div className="absolute -inset-1 border-2 border-[#7F1C75] rounded-xl transform -rotate-2"></div>
                <img
                  src="https://static.wixstatic.com/media/11062b_d482f7fb62b04ae5a56d4235b94dac77~mv2.jpeg/v1/fill/w_950,h_1090,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/11062b_d482f7fb62b04ae5a56d4235b94dac77~mv2.jpeg"
                  alt="KBG INDIA Team"
                  className="object-cover rounded-xl w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#29146F]/10 to-[#7F1C75]/10" />
              </div>
              
              {/* Certification badge */}
              <div
                className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-200 w-auto"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="flex space-x-1">
                    {["9001", "14001", "27001"].map((cert, i) => (
                      <div key={i} className="bg-gray-50 rounded-md px-2 py-1 flex items-center">
                        <Award className="w-4 h-4 text-[#7F1C75] mr-1" />
                        <span className="text-xs font-semibold text-gray-700">ISO {cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Core Values Section */}
          <div className="mt-20">
            <h3 className="text-2xl font-bold mb-8 text-[#29146F] text-center">Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <ValueCard 
                icon="integrity" 
                title="Integrity" 
                description="Always doing the right thing for our Clients"
              />
              <ValueCard 
                icon="excellence" 
                title="Excellence" 
                description="Delivering unmatched Service Quality"
              />
              <ValueCard 
                icon="transparency" 
                title="Transparency" 
                description="No hidden charges, No Middlemen"
              />
              <ValueCard 
                icon="innovation" 
                title="Innovation" 
                description="Always adapting to serve you Better"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
