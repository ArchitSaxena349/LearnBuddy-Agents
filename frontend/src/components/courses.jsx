// src/pages/Courses.js
import React from "react";

const courses = [
  {
    title: "Web Development",
    description: "Learn to build modern websites and web applications using HTML, CSS, JavaScript, and popular frameworks.",
  },
  {
    title: "AI / Machine Learning",
    description: "Explore artificial intelligence concepts, machine learning algorithms, and practical applications.",
  },
  {
    title: "Cyber Security",
    description: "Understand the fundamentals of cyber security, ethical hacking, and protecting digital assets.",
  },
  {
    title: "Web3 / Blockchain",
    description: "Dive into decentralized technologies, blockchain development, and smart contracts.",
  },
];

function Courses() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Our Courses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.title}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">
                  {course.title}
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {course.description}
                </p>
                <button className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Courses;