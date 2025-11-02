import { Link } from 'react-router-dom'
import { useState } from 'react'

const Header = () => {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed w-full top-0 z-50 backdrop-blur-sm bg-white/60 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-2xl font-extrabold text-purple-600 tracking-tight">LearnBuddy Agents</Link>
            <span className="hidden sm:inline text-sm text-gray-500">AI · AR · Learning</span>
          </div>

          <nav className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-purple-600 transition">Home</Link>
            <Link to="/courses" className="text-gray-600 hover:text-purple-600 transition">Courses</Link>
            <Link to="/visualisation" className="text-gray-600 hover:text-purple-600 transition">Visualisation</Link>
            <Link to="/companion" className="text-gray-600 hover:text-purple-600 transition">Companion</Link>
            <Link to="/about" className="text-gray-600 hover:text-purple-600 transition">About</Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              to="/companion"
              className="hidden md:inline-flex items-center px-3 py-1.5 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Companion
            </Link>

            <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800 hidden md:inline">Log in</Link>
            <Link to="/signup" className="hidden md:inline-flex items-center px-3 py-1.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">Sign up</Link>

            <button
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu - appears under the header on small screens */}
        {open && (
          <div className="lg:hidden absolute left-0 right-0 top-full mt-1 bg-white/95 border border-gray-200 rounded-md shadow-md z-40 p-4">
            <div className="flex flex-col space-y-2">
              <Link to="/" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Home</Link>
              <Link to="/courses" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Courses</Link>
              <Link to="/visualisation" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Visualisation</Link>
              <Link to="/companion" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">Companion</Link>
              <Link to="/about" onClick={() => setOpen(false)} className="py-2 px-3 rounded hover:bg-gray-100">About</Link>

              <div className="pt-3 border-t border-gray-100 flex gap-2">
                <Link to="/login" onClick={() => setOpen(false)} className="flex-1 text-center py-2 rounded hover:bg-gray-100">Log in</Link>
                <Link to="/signup" onClick={() => setOpen(false)} className="flex-1 text-center py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Sign up</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header