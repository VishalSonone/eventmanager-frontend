import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 overflow-auto bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-6"
    >
      {/* Background Floating Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          className="absolute w-32 h-32 bg-pink-300 rounded-full opacity-30 blur-2xl"
          initial={{ x: -100, y: -100 }}
          animate={{ x: 200, y: 150 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute w-24 h-24 bg-indigo-300 rounded-full opacity-30 blur-2xl"
          initial={{ x: 300, y: 400 }}
          animate={{ x: 50, y: 200 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "mirror" }}
        />
        <motion.div
          className="absolute w-28 h-28 bg-purple-300 rounded-full opacity-30 blur-2xl"
          initial={{ x: 500, y: 100 }}
          animate={{ x: 150, y: 300 }}
          transition={{ duration: 16, repeat: Infinity, repeatType: "mirror" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl px-4 sm:px-0">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-3xl sm:text-5xl font-extrabold text-indigo-700 drop-shadow mb-4"
        >
          Welcome to <span className="text-purple-600">EventManager</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-gray-700 text-base sm:text-lg px-2 sm:px-0"
        >
          Your centralized hub for all college events — smart, stylish & easy to use.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-8 w-full flex justify-center"
        >
          {/* Placeholder for future CTA button if needed */}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Home;
