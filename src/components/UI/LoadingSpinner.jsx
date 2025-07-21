import React from 'react'

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-blue-200 rounded-full animate-spin`}
          role="status"
          aria-label="Завантаження..."
        >
          <span className="sr-only">Завантаження...</span>
        </div>
        
        {/* Inner spinning gradient */}
        <div
          className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-blue-600 border-r-purple-600 rounded-full animate-spin`}
          style={{ animationDuration: '1s' }}
        />
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export default LoadingSpinner