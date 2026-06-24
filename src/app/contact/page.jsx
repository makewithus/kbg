// app/contact/page.tsx
'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { MessageCircle } from 'react-feather';

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

const ContactPage = () => {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs.sendForm(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "",
      formRef.current || null,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
    )
    .then((result) => {
      setSubmitStatus({ success: true, message: 'Message sent successfully!' });
      formRef.current?.reset();
    }, (error) => {
      setSubmitStatus({ success: false, message: 'Failed to send message. Please try again.' });
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <motion.section
        className="relative py-20 bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-white overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl mb-8">Get in touch with our team</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        className="py-20 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div variants={itemVariants} className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Office</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#7F1C75]/10 p-3 rounded-full mr-4">
                      <MapPin className="w-6 h-6 text-[#7F1C75]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Address</h3>
                      <p className="text-gray-600">
                        KBG BUSINESS SOLUTIONS PRIVATE LIMITED<br />
                        (CIN U74999KL2021PTC069962)<br />
                        3rd Floor, CRRA 106,<br />
                        Thattil Buildings, Chirakkulam Road<br />
                        Opp Sree Padmam Pharma, Statue, GPO<br />
                        Thiruvananthapuram-695 001<br />
                        Kerala State, India
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#7F1C75]/10 p-3 rounded-full mr-4">
                      <Phone className="w-6 h-6 text-[#7F1C75]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Phone</h3>
                      <p className="text-gray-600">
                        Mobile: +91 85 9393 9336<br />
                        Landline: +91 471 4053086 (10 lines)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#7F1C75]/10 p-3 rounded-full mr-4">
                      <Mail className="w-6 h-6 text-[#7F1C75]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Email</h3>
                      <p className="text-gray-600">
                        kbgindia2000@gmail.com<br />
                        info@kbgindia.in
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#7F1C75]/10 p-3 rounded-full mr-4">
                      <div className="w-6 h-6 flex items-center justify-center text-[#7F1C75]">
                        <span className="font-bold">S</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">Social Media</h3>
                      <div className="flex space-x-4 mt-2">
                        <a href="https://www.facebook.com/KBGBUSINESSGROUP" className="text-[#7F1C75] hover:text-[#29146F] transition-colors">
                          <Facebook className="w-6 h-6" />
                        </a>
                        <a href="https://www.instagram.com/kerala_business_group_1/" className="text-[#7F1C75] hover:text-[#29146F] transition-colors">
                          <Instagram className="w-6 h-6" />
                        </a>
                          <a href="https://wa.me/918593939336?text=I'm%20interested%20in%20leaning%20more%20about%20KBG%20India's%20servives.%20" className="text-[#7F1C75] hover:text-[#29146F] transition-colors">
                          <MessageCircle className="w-6 h-6" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <div className="bg-gradient-to-br from-[#7F1C75]/10 to-[#29146F]/10 p-8 rounded-xl border border-[#7F1C75]/20">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a message</h2>
                
                {submitStatus && (
                  <div className={`mb-6 p-4 rounded-lg ${submitStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {submitStatus.message}
                  </div>
                )}

                <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7F1C75] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7F1C75] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7F1C75] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#7F1C75] focus:border-transparent"
                    ></textarea>
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full cursor-pointer bg-gradient-to-r from-[#7F1C75] to-[#29146F] text-white py-4 px-6 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Map Section */}
      <motion.section
        className="py-16 bg-gradient-to-br from-gray-50 to-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Find Us on Map</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit our Corporate office in Thiruvananthapuram
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d493.2544703712609!2d76.94410955333558!3d8.495903699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b05bbbc57d1ddeb%3A0xe401a93e0d7c47a3!2sFWWV%2B9V8%2C%20Palayam%2C%20Thiruvananthapuram%2C%20Kerala%20695035!5e0!3m2!1sen!2sin!4v1747315836193!5m2!1sen!2sin"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default ContactPage;