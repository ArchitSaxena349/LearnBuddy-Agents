import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row min-h-screen animate-fade-in">
        {/* Left side - Content */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-purple-400">
              About Learnyfy
            </h1>
            <p className="text-gray-700 text-lg mb-8 leading-relaxed">
              Learnyfy is transforming education with an AI-powered, immersive platform that personalizes learning and fosters engagement. Founded by The Imperials, we’re redefining how students learn and grow.
            </p>
            <Link
              to="/signup"
              className="inline-block py-3 px-8 bg-purple-600 text-white rounded-full hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Join the Revolution
            </Link>
          </div>
        </div>
        {/* Right side - Image */}
        <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-purple-400 to-purple-600 p-12">
          <div
            className="h-full w-full bg-contain bg-center bg-no-repeat animate-pulse-slow"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1516321310764-959200eb3e35?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
            }}
          ></div>
        </div>
      </div>

      {/* Team Section */}
      <section className="py-16 px-8 animate-section-fade">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Meet The Imperials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Archit Saxena", role: "Team Lead" },
              { name: "Laieba", role: "Team Member" },
              { name: "Archit Prajapati", role: "Team Member" },
              { name: "Sandhya", role: "Team Member" },
             
            ].map((member, index) => (
              <div
                key={index}
                className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-8 bg-gradient-to-r from-purple-50 to-purple-100 animate-section-fade">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Our Mission</h2>
          <p className="text-gray-700 text-lg mb-6 text-center max-w-3xl mx-auto">
            We’re tackling the biggest challenges in education: rigid learning paths, low engagement, emotional isolation, and limited immersion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Key Issues</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Rigid Learning Paths: One-size-fits-all education.</li>
                <li>Low Engagement: Passive learning methods.</li>
                <li>Emotional Isolation: Lack of real-time support in remote settings.</li>
                <li>Limited Immersion: No hands-on experiential learning.</li>
              </ul>
              <p className="text-gray-600 mt-4">
                <em>Stats:</em> 70% of students report disengagement; only 20% of educators can personalize learning at scale.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Our Solutions</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>AI-Personalized Learning</strong>: Adaptive content curation.</li>
                <li><strong>Gamified Quests</strong>: Badges, leaderboards, challenges.</li>
                <li><strong>Emotionally Aware Chatbots</strong>: NLP-driven mental health support.</li>
                <li><strong>AR Expeditions</strong>: Virtual labs, historical reenactments.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 px-8 animate-section-fade">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Students</h3>
              <p className="text-gray-600">50% faster concept mastery via adaptive learning.</p>
              <p className="text-gray-600">40% stress reduction with chatbots.</p>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Educators</h3>
              <p className="text-gray-600">Automated analytics save 10+ hours/week.</p>
            </div>
            <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-xl p-6 shadow-lg text-center">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Society</h3>
              <p className="text-gray-600">Democratizes immersive learning with low-bandwidth AR.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-16 px-8 bg-gradient-to-r from-purple-50 to-purple-100 animate-section-fade">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">Why Choose Learnyfy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">360° Personalization</h3>
              <p className="text-gray-600">AI, gamification, AR, and emotional support.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Multimodal Learning</h3>
              <p className="text-gray-600">Seamlessly switch between text, AR, and quests.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-md text-center">
              <h3 className="text-xl font-semibold text-purple-600 mb-4">Real-Time Adaptation</h3>
              <p className="text-gray-600">APIs adjust content as students learn.</p>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-purple-600 mb-4 text-center">Competitor Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-gray-600">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left"></th>
                    <th className="py-2 px-4 text-left">Duolingo</th>
                    <th className="py-2 px-4 text-left">Coursera</th>
                    <th className="py-2 px-4 text-left">Learnyfy</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Gamification</td>
                    <td className="py-2 px-4">✓</td>
                    <td className="py-2 px-4">✗</td>
                    <td className="py-2 px-4">✓</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Static Content</td>
                    <td className="py-2 px-4">✗</td>
                    <td className="py-2 px-4">✓</td>
                    <td className="py-2 px-4">✗</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">All-in-One</td>
                    <td className="py-2 px-4">Gamification Only</td>
                    <td className="py-2 px-4">Static Content</td>
                    <td className="py-2 px-4">All-in-One</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-8 bg-purple-600 text-white text-center animate-section-fade">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Education?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Join Learnyfy to experience personalized, immersive learning like never before.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/signup"
              className="py-3 px-8 bg-white text-purple-600 rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              to="/contact"
              className="py-3 px-8 border border-white text-white rounded-full hover:bg-purple-700 transform hover:scale-105 transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;