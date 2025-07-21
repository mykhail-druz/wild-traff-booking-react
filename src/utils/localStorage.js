// localStorage utility for managing user bookings
const STORAGE_KEYS = {
  USER_BOOKINGS: 'booking_system_user_bookings',
  USER_PREFERENCES: 'booking_system_user_preferences',
  FILTERS: 'booking_system_filters'
}

// User Bookings Management
export const saveUserBookings = (bookings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_BOOKINGS, JSON.stringify(bookings))
  } catch (error) {
    console.error('Failed to save bookings to localStorage:', error)
  }
}

export const getUserBookings = () => {
  try {
    const bookings = localStorage.getItem(STORAGE_KEYS.USER_BOOKINGS)
    return bookings ? JSON.parse(bookings) : []
  } catch (error) {
    console.error('Failed to load bookings from localStorage:', error)
    return []
  }
}

export const addUserBooking = (booking) => {
  try {
    const existingBookings = getUserBookings()
    const updatedBookings = [...existingBookings, booking]
    saveUserBookings(updatedBookings)
    return updatedBookings
  } catch (error) {
    console.error('Failed to add booking to localStorage:', error)
    return getUserBookings()
  }
}

export const updateUserBooking = (bookingId, updates) => {
  try {
    const existingBookings = getUserBookings()
    const updatedBookings = existingBookings.map(booking =>
      booking.id === bookingId ? { ...booking, ...updates } : booking
    )
    saveUserBookings(updatedBookings)
    return updatedBookings
  } catch (error) {
    console.error('Failed to update booking in localStorage:', error)
    return getUserBookings()
  }
}

export const removeUserBooking = (bookingId) => {
  try {
    const existingBookings = getUserBookings()
    const updatedBookings = existingBookings.filter(booking => booking.id !== bookingId)
    saveUserBookings(updatedBookings)
    return updatedBookings
  } catch (error) {
    console.error('Failed to remove booking from localStorage:', error)
    return getUserBookings()
  }
}

// User Preferences Management
export const saveUserPreferences = (preferences) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences))
  } catch (error) {
    console.error('Failed to save preferences to localStorage:', error)
  }
}

export const getUserPreferences = () => {
  try {
    const preferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES)
    return preferences ? JSON.parse(preferences) : {
      theme: 'light',
      language: 'uk',
      notifications: true,
      defaultView: 'grid'
    }
  } catch (error) {
    console.error('Failed to load preferences from localStorage:', error)
    return {
      theme: 'light',
      language: 'uk',
      notifications: true,
      defaultView: 'grid'
    }
  }
}

// Filters State Management
export const saveFiltersState = (filters) => {
  try {
    localStorage.setItem(STORAGE_KEYS.FILTERS, JSON.stringify(filters))
  } catch (error) {
    console.error('Failed to save filters to localStorage:', error)
  }
}

export const getFiltersState = () => {
  try {
    const filters = localStorage.getItem(STORAGE_KEYS.FILTERS)
    return filters ? JSON.parse(filters) : null
  } catch (error) {
    console.error('Failed to load filters from localStorage:', error)
    return null
  }
}

// Clear all stored data
export const clearAllStoredData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  } catch (error) {
    console.error('Failed to clear localStorage:', error)
  }
}

// Check localStorage availability
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}