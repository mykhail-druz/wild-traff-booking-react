import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchResources, setSelectedResource, updateResourceAvailability } from '../store/slices/resourcesSlice'
import { createBooking } from '../store/slices/bookingsSlice'
import BookingForm from '../components/Booking/BookingForm'
import FullScreenLoader from '../components/UI/FullScreenLoader'
import ErrorMessage from '../components/UI/ErrorMessage'
import SuccessMessage from '../components/UI/SuccessMessage'
import { 
  HiOfficeBuilding, 
  HiDesktopComputer, 
  HiUserGroup,
  HiCube,
  HiExclamationCircle,
  HiEmojiSad,
  HiX 
} from 'react-icons/hi'

const ResourceDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { resources, loading, error, selectedResource } = useSelector(state => state.resources)
  const { createBookingLoading, error: bookingError } = useSelector(state => state.bookings)
  
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [showBookingForm, setShowBookingForm] = useState(false)

  // Find and set selected resource
  useEffect(() => {
    if (resources.length === 0) {
      dispatch(fetchResources())
    } else {
      const resource = resources.find(r => r.id === parseInt(id))
      if (resource) {
        dispatch(setSelectedResource(resource))
      }
    }
  }, [dispatch, id, resources])

  // Clear selected resource on unmount
  useEffect(() => {
    return () => {
      dispatch(setSelectedResource(null))
    }
  }, [dispatch])

  const handleBookingSubmit = async (bookingData) => {
    try {
      await dispatch(createBooking({
        ...bookingData,
        resourceId: selectedResource.id,
        resourceName: selectedResource.name,
        userId: 'user1' // In real app, this would come from auth
      })).unwrap()
      
      // Decrease available units after successful booking
      const newAvailableUnits = selectedResource.availableUnits - 1
      await dispatch(updateResourceAvailability({
        resourceId: selectedResource.id,
        availableUnits: newAvailableUnits
      })).unwrap()
      
      setBookingSuccess(true)
      setShowBookingForm(false)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false)
      }, 3000)
    } catch (error) {
      console.error('Booking failed:', error)
    }
  }

  const resourceTypeLabel = useMemo(() => {
    if (!selectedResource) return ''
    const types = {
      'meeting-room': 'Переговорна кімната',
      'equipment': 'Обладнання',
      'workspace': 'Робоче місце'
    }
    return types[selectedResource.type] || selectedResource.type
  }, [selectedResource?.type])

  const resourceIcon = useMemo(() => {
    if (!selectedResource) return HiCube
    const icons = {
      'meeting-room': HiOfficeBuilding,
      'equipment': HiDesktopComputer,
      'workspace': HiUserGroup
    }
    return icons[selectedResource.type] || HiCube
  }, [selectedResource?.type])

  const handleRetry = useCallback(() => {
    dispatch(fetchResources())
  }, [dispatch])

  const handleImageError = useCallback((e) => {
    e.target.style.display = 'none'
    e.target.nextSibling.style.display = 'flex'
  }, [])

  if (loading) {
    return <FullScreenLoader />
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto">
        <ErrorMessage 
          message={error} 
          onRetry={handleRetry}
        />
      </div>
    )
  }

  if (!selectedResource) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <HiExclamationCircle className="w-24 h-24 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ресурс не знайдено
        </h2>
        <p className="text-gray-600 mb-6">
          Ресурс з ID {id} не існує або був видалений.
        </p>
        <Link to="/resources" className="btn btn-primary">
          Повернутися до списку ресурсів
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600">
        <Link to="/" className="hover:text-blue-600">Головна</Link>
        <span>/</span>
        <Link to="/resources" className="hover:text-blue-600">Ресурси</Link>
        <span>/</span>
        <span className="text-gray-900">{selectedResource.name}</span>
      </nav>

      {/* Success Message */}
      {bookingSuccess && (
        <SuccessMessage message="Бронювання успішно створено! Перевірте свої бронювання." />
      )}

      {/* Resource Details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Image */}
          <div className="md:w-1/2">
            <div className="h-64 md:h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center overflow-hidden">
              {selectedResource.image ? (
                <img 
                  src={selectedResource.image} 
                  alt={selectedResource.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : null}
              <div 
                className={`flex items-center justify-center w-full h-full ${selectedResource.image ? 'hidden' : 'flex'}`}
                style={{ display: selectedResource.image ? 'none' : 'flex' }}
              >
                {React.createElement(resourceIcon, {
                  className: "w-32 h-32 text-blue-600"
                })}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="md:w-1/2 p-6 space-y-4">
            <div>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                {resourceTypeLabel}
              </span>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedResource.name}
              </h1>
            </div>
            
            <p className="text-gray-600 text-lg">
              {selectedResource.description}
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Місткість</span>
                <div className="text-xl font-semibold text-gray-900">
                  {selectedResource.capacity} {selectedResource.capacity === 1 ? 'особа' : 'осіб'}
                </div>
              </div>
              <div>
                <span className="text-sm text-gray-500">Доступно</span>
                <div className="text-xl font-semibold text-green-600">
                  {selectedResource.availableUnits} з {selectedResource.totalUnits}
                </div>
              </div>
            </div>
            
            <div>
              <span className="text-sm text-gray-500 block mb-2">Доступні часові слоти</span>
              <div className="flex flex-wrap gap-2">
                {selectedResource.timeSlots.map((slot, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                  >
                    {slot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Бронювання
        </h2>
        
        {selectedResource.availableUnits === 0 ? (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <HiEmojiSad className="w-16 h-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ресурс недоступний
            </h3>
            <p className="text-gray-600">
              На жаль, всі одиниці цього ресурсу зараз заброньовані.
            </p>
          </div>
        ) : !showBookingForm ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Готові забронювати цей ресурс?
            </p>
            <button
              onClick={() => setShowBookingForm(true)}
              className="btn btn-primary text-lg px-8 py-3"
            >
              Забронювати
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Форма бронювання
              </h3>
              <button
                onClick={() => setShowBookingForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
            
            {bookingError && (
              <div className="mb-4">
                <ErrorMessage message={bookingError} />
              </div>
            )}
            
            <BookingForm
              resource={selectedResource}
              onSubmit={handleBookingSubmit}
              loading={createBookingLoading}
              onCancel={() => setShowBookingForm(false)}
            />
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="text-center">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
        >
          ← Повернутися назад
        </button>
      </div>
    </div>
  )
}

export default ResourceDetailPage