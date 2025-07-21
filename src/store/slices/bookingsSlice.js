import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings?userId=${userId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch bookings')
    }
  }
)

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/bookings`, {
        ...bookingData,
        bookedAt: new Date().toISOString(),
        status: 'active'
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create booking')
    }
  }
)

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (booking, { rejectWithValue }) => {
    try {
      // Cancel the booking
      const response = await axios.patch(`${API_BASE_URL}/bookings/${booking.id}`, {
        status: 'cancelled'
      })
      
      // Get current resource data to update availability
      const resourceResponse = await axios.get(`${API_BASE_URL}/resources/${booking.resourceId}`)
      const currentResource = resourceResponse.data
      
      // Increase available units by 1 (restore availability)
      // Ensure we don't exceed totalUnits
      const newAvailableUnits = Math.min(currentResource.availableUnits + 1, currentResource.totalUnits)
      await axios.patch(`${API_BASE_URL}/resources/${booking.resourceId}`, {
        availableUnits: newAvailableUnits
      })
      
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel booking')
    }
  }
)

const initialState = {
  bookings: [],
  loading: false,
  error: null,
  createBookingLoading: false,
  cancelBookingLoading: false,
}

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    updateBookingStatus: (state, action) => {
      const { bookingId, status } = action.payload
      const booking = state.bookings.find(b => b.id === bookingId)
      if (booking) {
        booking.status = status
      }
    },
    // Update booking status based on current date
    updateExpiredBookings: (state) => {
      const currentDate = new Date().toISOString().split('T')[0]
      state.bookings.forEach(booking => {
        if (booking.date < currentDate && booking.status === 'active') {
          booking.status = 'past'
        }
      })
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch bookings
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false
        state.bookings = action.payload
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.createBookingLoading = true
        state.error = null
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.createBookingLoading = false
        state.bookings.push(action.payload)
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.createBookingLoading = false
        state.error = action.payload
      })
      // Cancel booking
      .addCase(cancelBooking.pending, (state) => {
        state.cancelBookingLoading = true
        state.error = null
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.cancelBookingLoading = false
        const index = state.bookings.findIndex(b => b.id === action.payload.id)
        if (index !== -1) {
          state.bookings[index] = action.payload
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.cancelBookingLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, updateBookingStatus, updateExpiredBookings } = bookingsSlice.actions
export default bookingsSlice.reducer