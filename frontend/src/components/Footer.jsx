import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="mt-12 bg-surface-muted text-gray-700 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Learnify</h3>
            <p className="text-sm text-gray-500">AI-powered learning with AR and interactive content.</p>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Explore</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/courses" className="text-gray-600 hover:text-gray-800">Courses</Link></li>
              <li><Link to="/visualisation" className="text-gray-600 hover:text-gray-800">Visualisation</Link></li>
              <li><Link to="/companion" className="text-gray-600 hover:text-gray-800">Companion</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-800">Privacy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-gray-800">Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} Learnify — All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer