import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'

import Dashboard from './components/dashboard'
import CompanionChat from './components/companion-chat'
import Courses from './components/courses'
import Visualisation from './components/3DVisualisation'
import About from './components/about'
import Contact from './components/contact'
import Login from './components/Auth'
import './App.css'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/companion" element={<CompanionChat />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/visualisation" element={<Visualisation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
