import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  searchTerm: '',
  selectedType: 'all',
  sortBy: 'name',
  sortOrder: 'asc',
  showOnlyAvailable: false,
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload
    },
    setSelectedType: (state, action) => {
      state.selectedType = action.payload
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload
    },
    toggleSortOrder: (state) => {
      state.sortOrder = state.sortOrder === 'asc' ? 'desc' : 'asc'
    },
    setShowOnlyAvailable: (state, action) => {
      state.showOnlyAvailable = action.payload
    },
    resetFilters: (state) => {
      state.searchTerm = ''
      state.selectedType = 'all'
      state.sortBy = 'name'
      state.sortOrder = 'asc'
      state.showOnlyAvailable = false
    },
  },
})

export const {
  setSearchTerm,
  setSelectedType,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
  setShowOnlyAvailable,
  resetFilters,
} = filtersSlice.actions

export default filtersSlice.reducer

// Selectors
export const selectFilteredResources = (state) => {
  const { resources } = state.resources
  const { searchTerm, selectedType, sortBy, sortOrder, showOnlyAvailable } = state.filters

  let filtered = resources.filter(resource => {
    // Filter by search term
    const matchesSearch = resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by type
    const matchesType = selectedType === 'all' || resource.type === selectedType
    
    // Filter by availability
    const matchesAvailability = !showOnlyAvailable || resource.availableUnits > 0

    return matchesSearch && matchesType && matchesAvailability
  })

  // Sort resources
  filtered.sort((a, b) => {
    let aValue, bValue

    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'type':
        aValue = a.type
        bValue = b.type
        break
      case 'capacity':
        aValue = a.capacity
        bValue = b.capacity
        break
      case 'availability':
        aValue = a.availableUnits
        bValue = b.availableUnits
        break
      default:
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
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
}