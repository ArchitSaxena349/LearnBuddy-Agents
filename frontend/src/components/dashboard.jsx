import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [userStats, setUserStats] = useState({
    level: 1,
    points: 0,
    nextLevelPoints: 100,
    progress: 0
  });

  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      description: "Learn HTML, CSS, and JavaScript basics",
      duration: "8 weeks",
      points: 50,
      difficulty: "Beginner",
      category: "Programming"
    },
    {
      id: 2,
      title: "Data Science Essentials",
      description: "Introduction to data analysis and visualization",
      duration: "10 weeks",
      points: 75,
      difficulty: "Intermediate",
      category: "Data Science"
    },
    {
      id: 3,
      title: "AI & Machine Learning",
      description: "Fundamentals of artificial intelligence",
      duration: "12 weeks",
      points: 100,
      difficulty: "Advanced",
      category: "AI"
    }
  ];

  const levels = {
    1: 100,
    2: 250,
    3: 500,
    4: 1000,
    5: 2000
  };

  const calculateProgress = (points, currentLevel) => {
    const nextLevelPoints = levels[currentLevel + 1] || levels[currentLevel];
    const previousLevelPoints = levels[currentLevel - 1] || 0;
    const levelProgress = ((points - previousLevelPoints) / (nextLevelPoints - previousLevelPoints)) * 100;
    return Math.min(100, Math.max(0, levelProgress));
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
  };

  const handleStartCourse = () => {
    // Add course to user's active courses
    // This would typically integrate with a backend

  };

  const earnPoints = (amount) => {
    setUserStats(prev => {
      const newPoints = prev.points + amount;
      let newLevel = prev.level;

      // Check for level up
      while (newPoints >= levels[newLevel] && levels[newLevel + 1]) {
        newLevel++;
      }

      return {
        ...prev,
        points: newPoints,
        level: newLevel,
        progress: calculateProgress(newPoints, newLevel)
      };
    });
  };

  return (
    <div className="container mx-auto px-6 py-8">
      {/* User Stats Section */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
          <div className="flex items-center space-x-4">
            <div className="text-purple-600">
              <span className="text-3xl font-bold">{userStats.level}</span>
              <span className="text-sm ml-1">Level</span>
            </div>
            <div className="text-blue-600">
              <span className="text-3xl font-bold">{userStats.points}</span>
              <span className="text-sm ml-1">Points</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className="bg-purple-600 rounded-full h-4 transition-all duration-500"
            style={{ width: `${userStats.progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-600">
          {levels[userStats.level + 1] ?
            `${levels[userStats.level + 1] - userStats.points} points to next level` :
            "Maximum level reached!"
          }
        </p>
      </div>

      {/* Course Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.02 }}
            className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer
              ${selectedCourse?.id === course.id ? 'ring-2 ring-purple-600' : ''}`}
            onClick={() => handleCourseSelect(course)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{course.title}</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm">
                  {course.difficulty}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{course.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Duration: {course.duration}</span>
                <span>{course.points} points</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Selected Course Details */}
      {selectedCourse && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed md:static bottom-0 left-0 right-0 md:bottom-auto bg-white shadow-lg p-4 md:p-6 z-40"
        >
          <div className="container flex flex-col md:flex-row md:justify-between items-center gap-3">
            <div className="text-left">
              <h3 className="text-lg md:text-xl font-semibold">{selectedCourse.title}</h3>
              <p className="text-gray-600 text-sm md:text-base">{selectedCourse.category}</p>
            </div>
            <button
              onClick={handleStartCourse}
              className="w-full md:w-auto px-4 md:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Start Course
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;