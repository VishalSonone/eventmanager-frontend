import { motion } from "framer-motion";

const Home = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex flex-col items-center justify-center p-6"
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
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 drop-shadow mb-4">
          Welcome to <span className="text-purple-600">EventManager</span>
        </h1>
        <p className="text-gray-700 text-base sm:text-lg">
          Your centralized hub for all college events — smart, stylish & easy to use.
        </p>
      </div>
    </motion.div>
  );
};

export default Home;
