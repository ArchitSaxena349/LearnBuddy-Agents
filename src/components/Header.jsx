import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="w-full justify-center top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-purple-600">Learnify</Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-purple-600 transition duration-300">Home</Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-purple-600 transition duration-300">Dashboard</Link>
            <Link to="/courses" className="text-gray-600 hover:text-purple-600 transition duration-300">Courses</Link>
            <Link to="/Visualisation" className="text-gray-600 hover:text-purple-600 transition duration-300">Visualisation</Link>
            <Link to="/contact" className="text-gray-600 hover:text-purple-600 transition duration-300">Contact</Link>
            <Link to="/about" className="text-gray-600 hover:text-purple-600 transition duration-300">About</Link>
          
          </nav>


          <div className="flex items-center space-x-4">
            <Link
              to="/companion"
              className="px-4 py-2 text-purple-600 hover:text-purple-700 transition duration-300 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Talk to Companion
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 text-purple-600 hover:text-purple-700 transition duration-300"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header