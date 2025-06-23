import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import profile from '../images/profile1.png';

const team = [
  { name: 'Sourav Das', role: 'Founder & CEO', image: profile },
  { name: 'Jane Doe', role: 'Lead Developer', image: profile },
  { name: 'John Smith', role: 'UI/UX Designer', image: profile },
];

const timeline = [
  { year: '2021', event: 'Company founded with a vision.' },
  { year: '2022', event: 'Launched our first product.' },
  { year: '2023', event: 'Crossed 1M+ users milestone.' },
];

const AboutPage = () => {
  return (
    <div className="dark:bg-black bg-white text-gray-800 dark:text-white px-6 md:px-16 py-12">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-center mb-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About Us
      </motion.h1>

      {/* Team Section */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ staggerChildren: 0.2 }}
      >
        {team.map((member, idx) => (
          <motion.div
            key={idx}
            className="bg-white dark:bg-gray-900 shadow-lg rounded-xl p-4 text-center hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h3 className="text-lg font-semibold">{member.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{member.role}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline Section */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-6">Our Journey</h2>
        <ol className="border-l-2 border-blue-500 dark:border-blue-300 pl-6 space-y-8">
          {timeline.map((item, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <span className="absolute left-[-1.2rem] top-1.5 w-3 h-3 bg-blue-500 dark:bg-blue-300 rounded-full"></span>
              <h3 className="text-lg font-semibold">{item.year}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.event}</p>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* Contact CTA */}
      <motion.div
        className="bg-blue-600 text-white dark:bg-blue-500 rounded-xl p-8 text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Want to get in touch?</h2>
        <p className="mb-6">
          We’re always open to discuss your project and improve your online presence.
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-2 rounded-lg hover:bg-blue-100 transition"
        >
          Contact Us
        </Link>
      </motion.div>
    </div>
  );
};

export default AboutPage;
