"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Calendar,
  MapPin,
  Users,
  Briefcase,
  Globe,
  Clock,
} from "lucide-react";

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const TimelineItem = ({ year, title, description, isActive, onClick }) => (
  <motion.div
    className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 min-w-80 ${
      isActive
        ? "border-[#7F1C75] bg-gradient-to-br from-[#7F1C75]/10 to-[#29146F]/10 shadow-lg"
        : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
    }`}
    whileHover={{ y: -4 }}
    onClick={onClick}
  >
    <div className="flex items-center mb-3">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
          isActive ? "bg-[#7F1C75]" : "bg-gray-400"
        }`}
      >
        <Calendar className="w-4 h-4 text-white" />
      </div>
      <span
        className={`text-3xl font-bold ${
          isActive
            ? "text-transparent bg-clip-text bg-gradient-to-r from-[#7F1C75] to-[#29146F]"
            : "text-gray-400"
        }`}
      >
        {year}
      </span>
    </div>
    <h3
      className={`text-xl font-semibold mb-2 ${
        isActive ? "text-gray-800" : "text-gray-600"
      }`}
    >
      {title}
    </h3>
    <p className={`text-sm ${isActive ? "text-gray-700" : "text-gray-500"}`}>
      {description}
    </p>
  </motion.div>
);

const TeamMember = ({ name, role, phone, expertise }) => (
  <div className="min-w-80 p-6 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300">
    <div className="text-center">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#7F1C75] to-[#29146F] flex items-center justify-center">
        <span className="text-white font-bold text-2xl">
          {name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)}
        </span>
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{name}</h3>
      <p className="text-[#7F1C75] font-medium mb-1">{role}</p>
      {expertise && <p className="text-sm text-gray-600 mb-2">{expertise}</p>}
      {phone && <p className="text-sm text-gray-500">{phone}</p>}
    </div>
  </div>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <motion.div
    className="text-center p-6 rounded-xl bg-gradient-to-r from-[#7F1C75]/10 to-[#29146F]/10 border border-[#7F1C75]/20"
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
  >
    <Icon className="w-12 h-12 mx-auto mb-4 text-[#7F1C75]" />
    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7F1C75] to-[#29146F] mb-2">
      {value}
    </div>
    <p className="text-gray-600 font-medium">{label}</p>
  </motion.div>
);

const AboutPage = () => {
  const [activeTimelineItem, setActiveTimelineItem] = useState(0);
  const [teamCarouselIndex, setTeamCarouselIndex] = useState(0);

  const timelineData = [
    {
      year: "2010",
      title: "KBG IS FOUNDED",
      description:
        "Established in June 2010. Started with just two services- Trademark and ISO Certification Consultancy.",
    },
    {
      year: "2015",
      title: "Partnership Transformation",
      description:
        "Converted into a partnership firm in 2015. The company was transformed with multiple individuals coming together to jointly own and operate the business.",
    },
    {
      year: "2016",
      title: "First Branch in Cochin",
      description:
        "A new branch of the company was opened in the city of Cochin.",
    },
    {
      year: "Dec 2016",
      title: "First 1000 Clients",
      description:
        "We were so happy to reach our first 1000 clients in just 6 years. It feels so proud to have achieved that milestone.",
    },
    {
      year: "2021",
      title: "Private Limited Company",
      description:
        "In 2021, we achieved a significant milestone by transitioning our company to a private limited company.",
    },
    {
      year: "2021",
      title: "Start-up India Recognized",
      description:
        "Start-up India Recognized In The Year 2021. This Recognition Was One Of The Biggest Milestone In Our Journey So Far.",
    },
    {
      year: "2022",
      title: "20+ Locations Across India",
      description:
        "Our Services are available in 20+ Locations Across India. It Feels like being a part of a huge company.",
    },
    {
      year: "2025",
      title: "10,000+ Clients",
      description:
        "Our client base exceeded 10,000 in March 2023, enabling us to offer over 200 services across 200+ locations in India and abroad.",
    },
  ];

  const teamMembers = [
    {
      name: "Mrs. RINI.R.S",
      role: "Founder & Managing Director",
      phone: "75 9191 9493",
    },
    { name: "Mrs. HEMA.V", role: "Director", phone: "73 5660 9903" },
    {
      name: "Mrs. RAJI.S",
      role: "Business Support Executive-BSE",
      expertise: "Certification Services",
      phone: "97 479 67367",
    },
    {
      name: "Mrs. RESMY.T",
      role: "Head Customer Care and Accounts",
      phone: "85 9393 9336",
    },
    {
      name: "Mrs. SUDHEESHA.G.S",
      role: "Business Support Executive- BSE",
      expertise: "IPR Services",
      phone: "70 259 27285",
    },
    {
      name: "Ms. ANU.S",
      role: "Business Support Executive-BSE",
      expertise: "Social Media & Marketing",
      phone: "98 4646 4141",
    },
    {
      name: "Mr. R. N. IYER",
      role: "Mentor, Motivator & Advisor",
      expertise: "Certification Services",
    },
    { name: "Mr. V.S. BALASUBRAMANIAM", role: "Legal & Corporate Advisor" },
    { name: "Mr. KRUPA ROMIL SHAH", role: "Company Secretary" },
    { name: "Mr. ARAVIND SASI", role: "Chartered Accountant" },
    { name: "Mr SYAMLAL.S", role: "Chartered Accountant" },
  ];

  const nextTeamSlide = () => {
    setTeamCarouselIndex((prev) => (prev + 3) % teamMembers.length);
  };

  const prevTeamSlide = () => {
    setTeamCarouselIndex(
      (prev) => (prev - 3 + teamMembers.length) % teamMembers.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section
        className="relative py-10 bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl md:text-2xl mb-8">
              Finding Inspiration in Every Turn
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                ISO 9001 Certified
              </span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                ISO 14001 Certified
              </span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                ISO 27001 Certified
              </span>
              <span className="px-4 py-2 bg-white/20 rounded-full backdrop-blur-sm">
                Start-up India Recognised
              </span>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <StatCard icon={Clock} value="15+" label="Years of Excellence" />
            <StatCard icon={Users} value="10,000+" label="Happy Clients" />
            <StatCard icon={MapPin} value="300+" label="Success Stories" />
            <StatCard icon={Briefcase} value="200+" label="Services" />
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-10 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A timeline of milestones that shaped KBG into the company as it is
              today
            </p>
          </motion.div>

          <div className="relative">
            {/* Journey carousel controls - Hidden on mobile */}
            <button
              onClick={() =>
                setActiveTimelineItem(
                  (prev) =>
                    (prev - 1 + timelineData.length) % timelineData.length
                )
              }
              className="hidden sm:block absolute cursor-pointer left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={activeTimelineItem === 0}
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={() =>
                setActiveTimelineItem(
                  (prev) => (prev + 1) % timelineData.length
                )
              }
              className="hidden sm:block absolute cursor-pointer right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={activeTimelineItem === timelineData.length - 1}
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Mobile view - single centered card */}
            <div className="sm:hidden flex justify-center">
              <TimelineItem
                year={timelineData[activeTimelineItem].year}
                title={timelineData[activeTimelineItem].title}
                description={timelineData[activeTimelineItem].description}
                isActive={true}
                onClick={() => {}}
              />
            </div>

            {/* Desktop view - carousel */}
            <div className="hidden sm:block overflow-hidden mx-12">
              <motion.div
                className="flex gap-6 pb-6"
                animate={{ x: -activeTimelineItem * 320 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {timelineData.map((item, index) => (
                  <TimelineItem
                    key={index}
                    year={item.year}
                    title={item.title}
                    description={item.description}
                    isActive={index === activeTimelineItem}
                    onClick={() => setActiveTimelineItem(index)}
                  />
                ))}
              </motion.div>
            </div>

            {/* Mobile navigation dots */}
            <div className="sm:hidden flex justify-center gap-2 mt-8">
              {timelineData.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeTimelineItem
                      ? "bg-[#7F1C75]"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setActiveTimelineItem(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-10 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate professionals behind KBG's success
            </p>
          </motion.div>

          <div className="relative ">
            {/* Team carousel controls - Hidden on mobile */}
            <button
              onClick={prevTeamSlide}
              className="hidden sm:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={nextTeamSlide}
              className="hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>

            {/* Mobile view - single centered card */}
            <div className="sm:hidden flex justify-center">
              <TeamMember
                name={teamMembers[teamCarouselIndex].name}
                role={teamMembers[teamCarouselIndex].role}
                phone={teamMembers[teamCarouselIndex].phone}
                expertise={teamMembers[teamCarouselIndex].expertise}
              />
            </div>

            {/* Desktop view - carousel */}
            <div className="hidden sm:block overflow-hidden mx-12">
              <motion.div
                className="flex gap-6"
                animate={{ x: -teamCarouselIndex * 320 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {teamMembers.map((member, index) => (
                  <TeamMember
                    key={index}
                    name={member.name}
                    role={member.role}
                    phone={member.phone}
                    expertise={member.expertise}
                  />
                ))}
              </motion.div>
            </div>

            {/* Mobile navigation dots */}
            <div className="sm:hidden flex justify-center gap-2 mt-8">
              {teamMembers.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === teamCarouselIndex ? "bg-[#7F1C75]" : "bg-gray-300"
                  }`}
                  onClick={() => setTeamCarouselIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Clients Logo Section */}
      <motion.section
        className="py-10 bg-gradient-to-br pb-30 from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Our Clients
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trusted by leading organizations across industries
            </p>
          </motion.div>

          <div className="relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>

            <motion.div
              className="flex gap-12 whitespace-nowrap"
              animate={{
                x: [0, -1600],
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
                "https://static.wixstatic.com/media/a268ba_b767649ae7ff4774b351ae18955256f3~mv2.png/v1/fill/w_190,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KRISTHUJYOTHI%20COLLEGE.png",
              ].map((logoUrl, index) => (
                <LogoCard key={`logo-${index}`} logoUrl={logoUrl} />
              ))}

              {/* Duplicate the unique set for seamless loop */}
              {[
                "https://static.wixstatic.com/media/a268ba_95918e09bf63488eaf2cd870699149cc~mv2.png/v1/fill/w_190,h_134,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KERAFED.png",
                "https://static.wixstatic.com/media/a268ba_38d959aeda0943e7be864ba4dca7a20e~mv2.jpg/v1/fill/w_240,h_126,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/kerala_tourism_logo-600x315.jpg",
                "https://static.wixstatic.com/media/a268ba_56ad74dffc6041bfae53855339db09a9~mv2.jpg/v1/fill/w_161,h_154,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/AGRO.jpg",
                "https://static.wixstatic.com/media/a268ba_542fb575a3ab4619933495afa3ebe440~mv2.png/v1/fill/w_275,h_85,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/MILCO.png",
              ].map((logoUrl, index) => (
                <LogoCard key={`logo-${index}-2`} logoUrl={logoUrl} />
              ))}
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
