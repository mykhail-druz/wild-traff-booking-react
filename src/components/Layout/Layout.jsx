import React, { useState, useMemo, useCallback, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  HiHome, 
  HiClipboardList, 
  HiCalendar,
  HiMenu,
  HiX 
} from 'react-icons/hi'

const Layout = memo(({ children }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = useCallback((path) => {
    return location.pathname === path
  }, [location.pathname])

  const navItems = useMemo(() => [
    { path: '/', label: 'Головна', icon: HiHome },
    { path: '/resources', label: 'Ресурси', icon: HiClipboardList },
    { path: '/bookings', label: 'Мої бронювання', icon: HiCalendar },
  ], [])

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50 animate-fade-in-down">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="relative">
                  {/*<HiOfficeBuilding className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />*/}
                  <img src="/logo.png" alt="PlacyMatch logo" className="w-10 h-10 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />

                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  PlacyMatch
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-2">
              {navItems.map((item, index) => {
                const IconComponent = item.icon
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group animate-slide-in-right ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                        : 'text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <IconComponent className={`w-5 h-5 transition-all duration-300 ${
                      isActive(item.path) 
                        ? 'text-white' 
                        : 'group-hover:scale-110 group-hover:rotate-12'
                    }`} />
                    <span className="relative z-10">{item.label}</span>
                    {!isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="relative p-2 rounded-xl text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 group"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6">
                  <HiMenu className={`absolute inset-0 w-6 h-6 transition-all duration-300 group-hover:scale-110 ${
                    isMobileMenuOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'
                  }`} />
                  <HiX className={`absolute inset-0 w-6 h-6 transition-all duration-300 group-hover:scale-110 ${
                    isMobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'
                  }`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden border-t border-gray-200/50 overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="pt-4 pb-3 bg-gradient-to-br from-white/50 to-blue-50/50 backdrop-blur-sm">
              <div className="space-y-2 px-2">
                {navItems.map((item, index) => {
                  const IconComponent = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 relative overflow-hidden group animate-slide-in-left ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25'
                          : 'text-gray-600 hover:text-blue-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-md hover:scale-105'
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <IconComponent className={`w-6 h-6 transition-all duration-300 ${
                        isActive(item.path) 
                          ? 'text-white' 
                          : 'group-hover:scale-110 group-hover:rotate-12'
                      }`} />
                      <span className="relative z-10">{item.label}</span>
                      {!isActive(item.path) && (
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl"></div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="relative">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/50 mt-auto animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">
              © 2025 Система управління бронюваннями. Всі права захищені.
            </div>
            <div className="flex justify-center items-center space-x-2 text-xs text-gray-500">
              <span>Створено з</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>для ефективного управління ресурсами</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
})

Layout.displayName = 'Layout'

export default Layout