import { useState } from 'react';
import { motion } from 'framer-motion';

const Home = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      title: "AI-Powered Learning Paths",
      description: "Personalized learning experiences tailored to your unique needs and pace",
      icon: "🤖",
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Gamified Learning Experience",
      description: "Earn badges, compete on leaderboards, and complete exciting challenges",
      icon: "🎮",
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Mental Health Support",
      description: "24/7 emotional support through our AI-powered counseling system",
      icon: "🧠",
      color: "from-green-400 to-green-600"
    },
    {
      title: "AR Expeditions",
      description: "Immersive learning through virtual labs and historical reenactments",
      icon: "🌟",
      color: "from-yellow-400 to-yellow-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="container px-4 py-16 sm:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              >
                Welcome to LearnBuddy Agents
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg mb-8"
              >
                Where AI, Gamification, and AR Redefine Learning

              </motion.p>
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white text-purple-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-purple-100 transition duration-300"
              >
                Start Learning
              </motion.button>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-full md:w-1/2"
            >
              <img 
                src="/src/assets/hero-image.png" 
                alt="Learning illustration" 
                className="w-full h-48 sm:h-64 md:h-auto object-cover rounded-lg shadow-md"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-6 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">Why Choose The Imperials?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setActiveFeature(index)}
              className={`p-6 rounded-xl bg-gradient-to-r ${feature.color} transform hover:scale-105 transition duration-300 cursor-pointer ${
                activeFeature === index ? 'shadow-2xl' : 'shadow-lg'
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-white opacity-90">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-xl opacity-90">Active Learners</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-xl opacity-90">Interactive Courses</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6"
            >
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-xl opacity-90">Success Rate</div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-6 py-20 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-8"
        >
          Ready to Transform Your Learning Journey?
        </motion.h2>
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-700 transition duration-300"
        >
          Get Started Now
        </motion.button>
      </div>
    </div>
  );
};

export default Home;