import React from 'react'
import LoadingSpinner from './LoadingSpinner'

const FullScreenLoader = ({ size = 'large', className = '' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ minHeight: 'calc(100vh - 64px - 88px)' }}>
      <div className="text-center space-y-4">
        <LoadingSpinner size={size} />
        <p className="text-gray-600 text-sm animate-pulse">
          Завантаження...
        </p>
      </div>
    </div>
  )
}

export default FullScreenLoader