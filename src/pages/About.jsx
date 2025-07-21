import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaInstagram, FaWhatsapp } from "react-icons/fa";

const About = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100 to-indigo-200 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="bg-white shadow-xl rounded-2xl w-full max-w-md sm:max-w-xl p-6 sm:p-8 text-center space-y-4"
      >
        <div className="flex justify-center">
          <img
            src="/logo.jpeg"
            alt="KBC NMU Logo"
            className="w-20 h-20 object-contain rounded-full border-2 border-indigo-300"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">
          Campus Event Manager
        </h1>

        <p className="text-sm sm:text-base text-gray-600">
          One place for all your college event needs — announcements, results, and celebrations.
        </p>

        <div className="bg-indigo-50 rounded-xl p-3 sm:p-4 text-indigo-700 shadow-inner text-sm sm:text-base">
          <p className="font-medium">📌 Organized by</p>
          <p className="font-semibold leading-tight">
            PPA ACTIVITY CLUB,<br />
            SOCS KBC NMU, Jalgaon
          </p>
        </div>

        <div className="text-gray-700 text-sm sm:text-base">
          <p className="font-medium">👨‍💻 Developed by</p>
          <p className="font-semibold text-indigo-700">Vishal Sonone</p>
          <p className="italic">MCA Student, SOCS</p>
        </div>

        <div className="flex justify-center gap-4 text-indigo-600 text-xl mt-2">
          <a href="http://github.com/VishalSonone" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
          <a href="http://www.linkedin.com/in/vishalsonone/?original_referer=http%3A%2F%2Fgithub.com%2F" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="http://instagram.com/vishalsonone" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="http://wa.me/9370669660" target="_blank" rel="noreferrer">
            <FaWhatsapp />
          </a>
        </div>

        <Link
          to="/"
          className="inline-block mt-2 px-5 py-2 bg-indigo-600 text-white rounded-full text-sm hover:bg-indigo-700 transition"
        >
          Go to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default About;
