import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { 
  HiOfficeBuilding, 
  HiDesktopComputer, 
  HiUserGroup,
  HiCube 
} from 'react-icons/hi'

const ResourceCard = memo(({ resource }) => {
  const getResourceTypeLabel = (type) => {
    const types = {
      'meeting-room': 'Переговорна кімната',
      'equipment': 'Обладнання',
      'workspace': 'Робоче місце'
    }
    return types[type] || type
  }

  const getResourceIcon = (type) => {
    const icons = {
      'meeting-room': HiOfficeBuilding,
      'equipment': HiDesktopComputer,
      'workspace': HiUserGroup
    }
    return icons[type] || HiCube
  }

  const getAvailabilityStatus = () => {
    if (resource.availableUnits === 0) {
      return {
        text: 'Недоступно',
        color: 'text-red-600 bg-red-100'
      }
    } else if (resource.availableUnits <= resource.totalUnits * 0.3) {
      return {
        text: 'Обмежено',
        color: 'text-yellow-600 bg-yellow-100'
      }
    } else {
      return {
        text: 'Доступно',
        color: 'text-green-600 bg-green-100'
      }
    }
  }

  const availabilityStatus = getAvailabilityStatus()

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 group animate-fade-in-up hover:glow border border-white/20 hover:border-blue-200/50 relative">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      {/* Image/Icon Section */}
      <div className="h-48 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 flex items-center justify-center overflow-hidden relative group-hover:from-blue-200 group-hover:via-blue-300 group-hover:to-purple-300 transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/10 group-hover:to-black/20 transition-all duration-500"></div>
        {/* Animated particles effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-4 left-4 w-2 h-2 bg-white/40 rounded-full animate-ping"></div>
          <div className="absolute top-8 right-6 w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
        {resource.image ? (
          <img 
            src={resource.image} 
            alt={resource.name}
            className="w-full h-full object-cover transition-transform duration-600"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        <div 
          className={`flex items-center justify-center w-full h-full ${resource.image ? 'hidden' : 'flex'} relative z-10`}
          style={{ display: resource.image ? 'none' : 'flex' }}
        >
          {(() => {
            const IconComponent = getResourceIcon(resource.type)
            return <IconComponent className="w-24 h-24 text-blue-600 group-hover:text-blue-700 transition-all duration-400 animate-float" />
          })()}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 relative">
        {/* Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full group-hover:from-blue-200 group-hover:to-blue-300 transition-all duration-300 animate-slide-in-left">
            {getResourceTypeLabel(resource.type)}
          </span>
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full transition-all duration-300 animate-slide-in-right ${availabilityStatus.color}`}>
            {availabilityStatus.text}
          </span>
        </div>

        {/* Title */}
        <Link
            to={`/resource/${resource.id}`}
            className="block group-hover:text-blue-600 transition-colors duration-300"
            >
        <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors duration-300">
          {resource.name}
        </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {resource.description}
        </p>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Місткість:</span>
            <span className="font-medium text-gray-900">
              {resource.capacity} {resource.capacity === 1 ? 'особа' : 'осіб'}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Доступно:</span>
            <span className="font-medium text-gray-900">
              {resource.availableUnits} з {resource.totalUnits}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Часові слоти:</span>
            <span className="font-medium text-gray-900">
              {resource.timeSlots.length} слотів
            </span>
          </div>
        </div>

        {/* Time Slots Preview */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {resource.timeSlots.slice(0, 4).map((slot, index) => (
              <span 
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:from-blue-100 hover:to-blue-200 hover:text-blue-800 transition-all duration-300 cursor-default animate-slide-in-left"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {slot}
              </span>
            ))}
            {resource.timeSlots.length > 4 && (
              <span className="px-3 py-1.5 bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 rounded-lg text-xs font-medium hover:from-purple-200 hover:to-purple-300 transition-all duration-300 cursor-default animate-pulse">
                +{resource.timeSlots.length - 4} ще
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Link
            to={`/resource/${resource.id}`}
            className="flex-1 btn btn-primary text-center text-sm py-3 sm:py-2 hover:shadow-lg transition-all duration-300 relative overflow-hidden group/btn"
          >
            <span className="relative z-10">Переглянути</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          {resource.availableUnits > 0 ? (
            <Link
              to={`/resource/${resource.id}`}
              className="flex-1 btn btn-secondary text-center text-sm py-3 sm:py-2 hover:shadow-lg transition-all duration-300 relative overflow-hidden group/btn2"
            >
              <span className="relative z-10">Забронювати</span>
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 opacity-0 group-hover/btn2:opacity-100 transition-opacity duration-300"></div>
            </Link>
          ) : (
            <button
              disabled
              className="flex-1 btn bg-gray-100 text-gray-400 cursor-not-allowed text-center text-sm py-3 sm:py-2 opacity-60"
            >
              Недоступно
            </button>
          )}
        </div>
      </div>

      {/* Availability Indicator */}
      <div className="px-6 pb-4">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-600 group-hover:animate-pulse ${
              resource.availableUnits === 0 
                ? 'bg-gradient-to-r from-red-400 to-red-600' 
                : resource.availableUnits <= resource.totalUnits * 0.3
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500'
                : 'bg-gradient-to-r from-green-400 to-green-600'
            }`}
            style={{
              width: `${(resource.availableUnits / resource.totalUnits) * 100}%`
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2 group-hover:text-gray-600 transition-colors duration-300">
          <span className="font-medium">0</span>
          <span className="text-center font-medium text-gray-700">
            {resource.availableUnits} / {resource.totalUnits} доступно
          </span>
          <span className="font-medium">{resource.totalUnits}</span>
        </div>
      </div>
    </div>
  )
})

ResourceCard.displayName = 'ResourceCard'

export default ResourceCard