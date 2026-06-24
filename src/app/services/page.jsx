'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Award, Check, Shield, FileText, Globe, Clock, Tag, Users, Briefcase, Star, ArrowRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const ServiceCard = ({ name, basePrice, otherCost, note, icon }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${
        isHovered ? "shadow-lg shadow-purple-100 border-purple-100 translate-y-[-6px]" : "shadow-sm border-gray-100"
      } border`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6">
        {/* Card Header with Icon and Title */}
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-lg transition-all duration-300 ${
              isHovered
                ? "bg-gradient-to-br from-[#7F1C75]/15 to-[#29146F]/15"
                : "bg-gradient-to-br from-[#7F1C75]/10 to-[#29146F]/10"
            }`}
          >
            <div className="text-[#7F1C75]">{icon}</div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          </div>
        </div>

       

        {/* Card Footer with Button */}
        <div className={`mt-6 flex justify-end transition-all duration-300`}>
          <button
            className={`group flex items-center gap-2 px-4 py-2 rounded-lg transition-all cursor-pointer duration-300 ${
              isHovered
                ? "bg-gradient-to-r from-[#7F1C75]/15 to-[#29146F]/15"
                : "bg-gradient-to-r from-[#7F1C75]/5 to-[#29146F]/5 hover:from-[#7F1C75]/10 hover:to-[#29146F]/10"
            }`}
            onClick={() => window.location.href = "/contact"}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-sm font-medium">
              Enquire now
            </span>

            <div
              className={`bg-white rounded-full p-1.5 shadow-sm transition-all duration-300 ${
                isHovered ? "transform translate-x-1" : ""
              }`}
            >
              <ArrowRight size={14} className="text-[#7F1C75]" />
            </div>
          </button>
        </div>
      </div>
    </div>
  )}


const ServicePage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  const serviceData = [
    {
      category: 'Certifications',
      icon: <Shield size={20} />,
      services: [
        { name: 'ISO 9001:2015, 14001 STD *', basePrice: '12,000',  note: 'OHSAS, ISMS 27001, 29990 extra ₹2,000', icon: <Shield size={18} /> },
        { name: 'BIC US 9001:2015, 14001 *', basePrice: '47,000', note: 'OHSAS, ISMS 27001, 29990 extra ₹20,000', icon: <Globe size={18} /> },
        { name: 'UKAS 9001:2015, 14001 *', basePrice: '1,45,000',  note: 'OHSAS, ISMS 27001, 29990 extra ₹50,000', icon: <Award size={18} /> },
        { name: 'TUV 9001:2015, 14001 *', basePrice: '1,40,000',  note: 'OHSAS, ISMS 27001, 29990 extra ₹1,20,000', icon: <Star size={18} /> },
      ]
    },
    {
      category: 'Registrations',
      icon: <FileText size={20} />,
      services: [
        { name: 'Company Registration (Pvt Ltd) *', basePrice: '12,500', icon: <Briefcase size={18} /> },
        { name: 'GST Registration *', basePrice: '2,500',  icon: <FileText size={18} /> },
        { name: 'Import-Export Code *', basePrice: '1,500', icon: <Globe size={18} /> },
        { name: 'Trust Registration *', basePrice: '15,000', icon: <Users size={18} /> },
      ]
    },
    {
      category: 'Intellectual Property',
      icon: <Briefcase size={20} />,
      services: [
        { name: 'Trademark Filing *', basePrice: '6,900',  icon: <Tag size={18} /> },
        { name: 'Trademark (Comprehensive) *', basePrice: '14,900', note: 'No additional costs', icon: <Check size={18} /> },
        { name: 'Copyright Registration *', basePrice: '7,000 - 12,000', icon: <FileText size={18} /> },
      ]
    },
    {
      category: 'Legal & Compliance',
      icon: <Briefcase size={20} />,
      services: [
        { name: 'NABH Documentation *', basePrice: '3,25,000', icon: <FileText size={18} /> },
        { name: 'ROC Filing *', basePrice: '5,000 - 25,000', icon: <Briefcase size={18} /> },
        { name: '3CB Auditing *', basePrice: '12,000 - 25,000', icon: <Check size={18} /> },
      ]
    }
  ];

  const filteredServices = activeCategory === 'all' 
    ? serviceData 
    : serviceData.filter(cat => cat.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section - Styled like About page */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative py-20 bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl font-bold mb-6">
              Our Services
            </motion.h1>
            <motion.p variants={itemVariants} className="text-xl md:text-2xl mb-8">
              Comprehensive solutions for your business growth
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 md:gap-3">
              <div className="flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Award className="mr-2" size={18} />
                <span>ISO Certified</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Check className="mr-2" size={18} />
                <span>100+ Services</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                <Users className="mr-2" size={18} />
                <span>10,000+ Clients</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Category Navigation - Styled like About page tabs */}
      <div className="container mx-auto md:w-[80%] px-6 py-8 sticky top-0 bg-gradient-to-br from-gray-50 to-white z-10 border-b border-gray-200 ">
        <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide ">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium cursor-pointer transition-all ${
              activeCategory === 'all' 
                ? 'bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            All Services
          </button>
          {serviceData.map((category, index) => (
            <button
              key={index}
              onClick={() => setActiveCategory(category.category)}
              className={`px-5 py-2 cursor-pointer rounded-full whitespace-nowrap text-sm font-medium flex items-center transition-all ${
                activeCategory === category.category 
                  ? 'bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              <span className="mr-2">{category.icon}</span>
              {category.category}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto md:w-[80%]  px-6 py-12"
      >
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((category) =>
            category.services.map((service, index) => (
              <ServiceCard 
                key={`${category.category}-${index}`}
                name={service.name}
                // basePrice={service.basePrice}
                // otherCost={service.otherCost}
                icon={service.icon}
              />
            ))
          )}
        </div>
      </motion.section>


      {/* CTA Section - Matches About page style */}
      <section className="py-16 bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-white">
        <div className="container mx-auto px-6 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-6"
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
          >
            Contact our team today for personalized service and support
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="px-8 py-3 bg-white cursor-pointer text-[#7F1C75]  rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border-2 border-white"
            onClick={() => window.location.href = "/contact"}
          >
            Contact Our Experts
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default ServicePage;
