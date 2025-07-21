import React, { memo } from 'react'
import { Link } from 'react-router-dom'
import { format, parseISO, isBefore, isAfter, startOfDay } from 'date-fns'
import LoadingSpinner from '../UI/LoadingSpinner'
import { 
  HiCheckCircle, 
  HiCalendar, 
  HiXCircle,
  HiBell,
  HiOfficeBuilding, 
  HiDesktopComputer, 
  HiUserGroup,
  HiCube,
  HiInformationCircle 
} from 'react-icons/hi'

const BookingCard = memo(({ booking, onCancel, cancelLoading }) => {
  const getStatusInfo = (status) => {
    const statusMap = {
      'active': {
        label: 'Активне',
        color: 'bg-green-100 text-green-800',
        icon: HiCheckCircle
      },
      'past': {
        label: 'Завершене',
        color: 'bg-gray-100 text-gray-800',
        icon: HiCalendar
      },
      'cancelled': {
        label: 'Скасоване',
        color: 'bg-red-100 text-red-800',
        icon: HiXCircle
      }
    }
    return statusMap[status] || statusMap['active']
  }

  const getResourceTypeInfo = (resourceName) => {
    // Extract type from resource name or use default
    if (resourceName.toLowerCase().includes('переговорна')) {
      return { icon: HiOfficeBuilding, type: 'Переговорна кімната' }
    } else if (resourceName.toLowerCase().includes('macbook') || resourceName.toLowerCase().includes('проектор')) {
      return { icon: HiDesktopComputer, type: 'Обладнання' }
    } else if (resourceName.toLowerCase().includes('робоче')) {
      return { icon: HiUserGroup, type: 'Робоче місце' }
    }
    return { icon: HiCube, type: 'Ресурс' }
  }

  const formatBookingDate = (dateString) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'dd MMMM yyyy')
    } catch {
      return dateString
    }
  }

  const formatBookingDateTime = (dateString) => {
    try {
      const date = parseISO(dateString)
      return format(date, 'dd.MM.yyyy HH:mm')
    } catch {
      return dateString
    }
  }

  const isBookingCancellable = () => {
    if (booking.status !== 'active') return false
    
    try {
      const bookingDate = parseISO(booking.date)
      const today = startOfDay(new Date())
      return isAfter(bookingDate, today) || bookingDate.getTime() === today.getTime()
    } catch {
      return false
    }
  }

  const isUpcoming = () => {
    try {
      const bookingDate = parseISO(booking.date)
      const today = startOfDay(new Date())
      return isAfter(bookingDate, today)
    } catch {
      return false
    }
  }

  const statusInfo = getStatusInfo(booking.status)
  const resourceInfo = getResourceTypeInfo(booking.resourceName)
  const canCancel = isBookingCancellable()
  const upcoming = isUpcoming()

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 space-y-3 sm:space-y-0">
        {/* Resource Info */}
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center">
            {(() => {
              const IconComponent = resourceInfo.icon
              return <IconComponent className="w-8 h-8 text-blue-600" />
            })()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {booking.resourceName}
            </h3>
            <p className="text-sm text-gray-600">{resourceInfo.type}</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-wrap items-center gap-2">
          {upcoming && booking.status === 'active' && (
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <HiBell className="mr-1 w-3 h-3" />
              Найближче
            </span>
          )}
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${statusInfo.color}`}>
            {(() => {
              const StatusIconComponent = statusInfo.icon
              return <StatusIconComponent className="mr-1 w-4 h-4" />
            })()}
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Booking Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-20">Дата:</span>
            <span className="font-medium text-gray-900">
              {formatBookingDate(booking.date)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-20">Час:</span>
            <span className="font-medium text-gray-900">{booking.timeSlot}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-24">Створено:</span>
            <span className="text-gray-700">
              {formatBookingDateTime(booking.bookedAt)}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 w-24">ID:</span>
            <span className="text-gray-700 font-mono">#{booking.id}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-gray-200 space-y-3 sm:space-y-0">
        <div className="flex justify-center sm:justify-start">
          <Link
            to={`/resource/${booking.resourceId}`}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Переглянути ресурс →
          </Link>
        </div>

        <div className="flex items-center justify-center sm:justify-end space-x-3">
          {canCancel && (
            <button
              onClick={() => onCancel(booking.id)}
              disabled={cancelLoading}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {cancelLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-1" />
                  Скасування...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Скасувати
                </>
              )}
            </button>
          )}
          
          {booking.status === 'cancelled' && (
            <span className="text-sm text-gray-500 italic">
              Бронювання скасовано
            </span>
          )}
          
          {booking.status === 'past' && (
            <span className="text-sm text-gray-500 italic">
              Бронювання завершено
            </span>
          )}
        </div>
      </div>

      {/* Additional Info for Active Bookings */}
      {booking.status === 'active' && upcoming && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <HiInformationCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Нагадування:</span> Не забудьте про своє бронювання на {formatBookingDate(booking.date)} о {booking.timeSlot}.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
})

BookingCard.displayName = 'BookingCard'

export default BookingCard