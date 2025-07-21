import React, { useState, useMemo } from 'react'
import { format, addDays, isWeekend, isBefore, startOfDay } from 'date-fns'
import LoadingSpinner from '../UI/LoadingSpinner'
import { HiExclamationCircle } from 'react-icons/hi'

const BookingForm = ({ resource, onSubmit, loading, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('')
  const [errors, setErrors] = useState({})

  // Generate available dates (next 30 days, excluding weekends)
  const availableDates = useMemo(() => {
    const dates = []
    const today = startOfDay(new Date())
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i)
      if (!isWeekend(date)) {
        dates.push(date)
      }
    }
    
    return dates
  }, [])

  const validateForm = () => {
    const newErrors = {}

    if (!selectedDate) {
      newErrors.date = 'Оберіть дату бронювання'
    }

    if (!selectedTimeSlot) {
      newErrors.timeSlot = 'Оберіть часовий слот'
    }

    // Check if selected date is not in the past
    if (selectedDate) {
      const selected = new Date(selectedDate)
      const today = startOfDay(new Date())
      
      if (isBefore(selected, today)) {
        newErrors.date = 'Неможливо забронювати на минулу дату'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const bookingData = {
      date: selectedDate,
      timeSlot: selectedTimeSlot,
    }

    onSubmit(bookingData)
  }

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value)
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: null }))
    }
  }

  const handleTimeSlotChange = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
    if (errors.timeSlot) {
      setErrors(prev => ({ ...prev, timeSlot: null }))
    }
  }

  const formatDateForInput = (date) => {
    return format(date, 'yyyy-MM-dd')
  }

  const formatDateForDisplay = (date) => {
    return format(date, 'dd MMMM yyyy, EEEE')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Resource Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Деталі бронювання</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Ресурс:</span> {resource.name}</p>
          <p><span className="font-medium">Тип:</span> {resource.type}</p>
          <p><span className="font-medium">Доступно:</span> {resource.availableUnits} з {resource.totalUnits}</p>
        </div>
      </div>

      {/* Date Selection */}
      <div>
        <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-2">
          Дата бронювання
        </label>
        <select
          id="booking-date"
          value={selectedDate}
          onChange={handleDateChange}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.date 
              ? 'border-red-300 focus:border-red-500' 
              : 'border-gray-300 focus:border-blue-500'
          }`}
        >
          <option value="">Оберіть дату</option>
          {availableDates.map((date) => (
            <option key={formatDateForInput(date)} value={formatDateForInput(date)}>
              {formatDateForDisplay(date)}
            </option>
          ))}
        </select>
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      {/* Time Slot Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Часовий слот
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {resource.timeSlots.map((timeSlot) => (
            <button
              key={timeSlot}
              type="button"
              onClick={() => handleTimeSlotChange(timeSlot)}
              className={`px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                selectedTimeSlot === timeSlot
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              {timeSlot}
            </button>
          ))}
        </div>
        {errors.timeSlot && (
          <p className="mt-1 text-sm text-red-600">{errors.timeSlot}</p>
        )}
      </div>

      {/* Booking Summary */}
      {selectedDate && selectedTimeSlot && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Підсумок бронювання</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p><span className="font-medium">Ресурс:</span> {resource.name}</p>
            <p><span className="font-medium">Дата:</span> {formatDateForDisplay(new Date(selectedDate))}</p>
            <p><span className="font-medium">Час:</span> {selectedTimeSlot}</p>
          </div>
        </div>
      )}

      {/* Important Notes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <HiExclamationCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Важливо знати
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Бронювання можна скасувати до початку часового слоту</li>
                <li>Бронювання автоматично стає неактивним після закінчення дати</li>
                <li>Переконайтеся, що обрана дата та час вам підходять</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          type="submit"
          disabled={loading || !selectedDate || !selectedTimeSlot}
          className="flex-1 btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <LoadingSpinner size="small" className="mr-2" />
              Створення бронювання...
            </div>
          ) : (
            'Підтвердити бронювання'
          )}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 btn btn-secondary py-3 disabled:opacity-50"
        >
          Скасувати
        </button>
      </div>
    </form>
  )
}

export default BookingForm