import { configureStore } from '@reduxjs/toolkit'
import resourcesReducer from './slices/resourcesSlice'
import bookingsReducer from './slices/bookingsSlice'
import filtersReducer from './slices/filtersSlice'

export const store = configureStore({
  reducer: {
    resources: resourcesReducer,
    bookings: bookingsReducer,
    filters: filtersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})