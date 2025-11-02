import Header from './Header'
import Footer from './Footer'

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-surface text-base-900">
      <Header />
      <main className="flex-grow mt-20 w-full">
        <div className="container mx-auto max-w-6xl px-4 py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout