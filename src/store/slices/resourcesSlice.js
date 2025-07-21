import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

// Async thunks
export const fetchResources = createAsyncThunk(
  'resources/fetchResources',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/resources`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch resources')
    }
  }
)

export const updateResourceAvailability = createAsyncThunk(
  'resources/updateResourceAvailability',
  async ({ resourceId, availableUnits }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/resources/${resourceId}`, {
        availableUnits
      })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update resource')
    }
  }
)

const initialState = {
  resources: [],
  loading: false,
  error: null,
  selectedResource: null,
}

const resourcesSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setSelectedResource: (state, action) => {
      state.selectedResource = action.payload
    },
    clearSelectedResource: (state) => {
      state.selectedResource = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resources
      .addCase(fetchResources.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false
        state.resources = action.payload
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update resource availability
      .addCase(updateResourceAvailability.pending, (state) => {
        state.loading = true
      })
      .addCase(updateResourceAvailability.fulfilled, (state, action) => {
        state.loading = false
        const index = state.resources.findIndex(r => r.id === action.payload.id)
        if (index !== -1) {
          state.resources[index] = action.payload
        }
      })
      .addCase(updateResourceAvailability.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSelectedResource, clearSelectedResource, clearError } = resourcesSlice.actions
export default resourcesSlice.reducer