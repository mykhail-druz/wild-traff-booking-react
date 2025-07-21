import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchBookings, cancelBooking, updateExpiredBookings } from '../store/slices/bookingsSlice'
import BookingCard from '../components/Booking/BookingCard'
import LoadingSpinner from '../components/UI/LoadingSpinner'
import ErrorMessage from '../components/UI/ErrorMessage'
import ConfirmationModal from '../components/UI/ConfirmationModal'
import { HiCalendar } from 'react-icons/hi'

const BookingsPage = () => {
  const dispatch = useDispatch()
  const { bookings, loading, error, cancelBookingLoading } = useSelector(state => state.bookings)
  
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)

  // Fetch bookings on component mount
  useEffect(() => {
    dispatch(fetchBookings('user1')) // In real app, this would come from auth
    dispatch(updateExpiredBookings())
  }, [dispatch])

  // Filter and sort bookings
  const filteredAndSortedBookings = useMemo(() => {
    let filtered = [...bookings]

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter)
    }

    // Sort bookings
    filtered.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'date':
          aValue = new Date(`${a.date} ${a.timeSlot}`)
          bValue = new Date(`${b.date} ${b.timeSlot}`)
          break
        case 'resource':
          aValue = a.resourceName.toLowerCase()
          bValue = b.resourceName.toLowerCase()
          break
        case 'status':
          aValue = a.status
          bValue = b.status
          break
        case 'bookedAt':
          aValue = new Date(a.bookedAt)
          bValue = new Date(b.bookedAt)
          break
        default:
          aValue = new Date(`${a.date} ${a.timeSlot}`)
          bValue = new Date(`${b.date} ${b.timeSlot}`)
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortOrder === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })

    return filtered
  }, [bookings, statusFilter, sortBy, sortOrder])

  // Get booking statistics
  const bookingStats = useMemo(() => {
    const total = bookings.length
    const active = bookings.filter(b => b.status === 'active').length
    const past = bookings.filter(b => b.status === 'past').length
    const cancelled = bookings.filter(b => b.status === 'cancelled').length
    
    return { total, active, past, cancelled }
  }, [bookings])

  const handleCancelBooking = (bookingId) => {
    const booking = bookings.find(b => b.id === bookingId)
    setBookingToCancel(booking)
    setShowCancelModal(true)
  }

  const handleConfirmCancel = async () => {
    if (bookingToCancel) {
      try {
        await dispatch(cancelBooking(bookingToCancel)).unwrap()
        setShowCancelModal(false)
        setBookingToCancel(null)
      } catch (error) {
        console.error('Failed to cancel booking:', error)
        // Modal will stay open to show error state
      }
    }
  }

  const handleCloseCancelModal = () => {
    setShowCancelModal(false)
    setBookingToCancel(null)
  }

  const getStatusLabel = (status) => {
    const labels = {
      'all': 'Всі',
      'active': 'Активні',
      'past': 'Минулі',
      'cancelled': 'Скасовані'
    }
    return labels[status] || status
  }

  const getStatusColor = (status) => {
    const colors = {
      'active': 'text-green-600 bg-green-100',
      'past': 'text-gray-600 bg-gray-100',
      'cancelled': 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <ErrorMessage 
          message={error} 
          onRetry={() => dispatch(fetchBookings('user1'))}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Мої бронювання
        </h1>
        <p className="text-lg text-gray-600">
          Керуйте своїми бронюваннями ресурсів
        </p>
      </div>

      {/* Statistics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{bookingStats.total}</div>
            <div className="text-sm text-gray-600">Всього</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{bookingStats.active}</div>
            <div className="text-sm text-gray-600">Активні</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">{bookingStats.past}</div>
            <div className="text-sm text-gray-600">Минулі</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{bookingStats.cancelled}</div>
            <div className="text-sm text-gray-600">Скасовані</div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Status Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <span className="text-sm font-medium text-gray-700 flex-shrink-0">Статус:</span>
            <div className="flex flex-wrap gap-2">
              {['all', 'active', 'past', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Сортувати:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">За датою</option>
              <option value="resource">За ресурсом</option>
              <option value="status">За статусом</option>
              <option value="bookedAt">За часом створення</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-gray-500 hover:text-gray-700"
              title={`Сортувати ${sortOrder === 'asc' ? 'за спаданням' : 'за зростанням'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {filteredAndSortedBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <HiCalendar className="w-24 h-24 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {statusFilter === 'all' ? 'Бронювань не знайдено' : `Немає ${getStatusLabel(statusFilter).toLowerCase()} бронювань`}
          </h3>
          <p className="text-gray-600 mb-4">
            {statusFilter === 'all' 
              ? 'Ви ще не створили жодного бронювання.'
              : `У вас немає бронювань зі статусом "${getStatusLabel(statusFilter).toLowerCase()}".`
            }
          </p>
          {statusFilter === 'all' && (
            <Link to="/resources" className="btn btn-primary">
              Переглянути ресурси
            </Link>
          )}
          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="btn btn-secondary"
            >
              Показати всі бронювання
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAndSortedBookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
              cancelLoading={cancelBookingLoading}
            />
          ))}
        </div>
      )}

      {/* Summary */}
      {filteredAndSortedBookings.length > 0 && (
        <div className="text-center text-gray-600">
          Показано {filteredAndSortedBookings.length} з {bookings.length} бронювань
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={handleCloseCancelModal}
        onConfirm={handleConfirmCancel}
        title="Скасування бронювання"
        message={
          bookingToCancel 
            ? `Ви впевнені, що хочете скасувати бронювання "${bookingToCancel.resourceName}" на ${bookingToCancel.date} о ${bookingToCancel.timeSlot}?`
            : 'Ви впевнені, що хочете скасувати це бронювання?'
        }
        confirmText="Скасувати бронювання"
        cancelText="Залишити"
        isLoading={cancelBookingLoading}
      />
    </div>
  )
}

export default BookingsPage