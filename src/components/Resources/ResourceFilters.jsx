import React, { memo, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setSearchTerm,
  setSelectedType,
  setSortBy,
  setSortOrder,
  toggleSortOrder,
  setShowOnlyAvailable,
  resetFilters
} from '../../store/slices/filtersSlice'
import { 
  HiClipboardList,
  HiDesktopComputer, 
  HiUserGroup,
  HiSearch,
  HiX 
} from 'react-icons/hi'
import { TbPodium } from 'react-icons/tb'

const ResourceFilters = memo(() => {
  const dispatch = useDispatch()
  const {
    searchTerm,
    selectedType,
    sortBy,
    sortOrder,
    showOnlyAvailable
  } = useSelector(state => state.filters)

  const handleSearchChange = useCallback((e) => {
    dispatch(setSearchTerm(e.target.value))
  }, [dispatch])

  const handleTypeChange = useCallback((type) => {
    dispatch(setSelectedType(type))
  }, [dispatch])

  const handleSortChange = useCallback((newSortBy) => {
    if (newSortBy === sortBy) {
      dispatch(toggleSortOrder())
    } else {
      dispatch(setSortBy(newSortBy))
      dispatch(setSortOrder('asc'))
    }
  }, [dispatch, sortBy])

  const handleAvailabilityToggle = useCallback(() => {
    dispatch(setShowOnlyAvailable(!showOnlyAvailable))
  }, [dispatch, showOnlyAvailable])

  const handleResetFilters = useCallback(() => {
    dispatch(resetFilters())
  }, [dispatch])

  const resourceTypes = useMemo(() => [
    { value: 'all', label: 'Всі типи', icon: HiClipboardList },
    { value: 'meeting-room', label: 'Переговорні', icon: TbPodium },
    { value: 'equipment', label: 'Обладнання', icon: HiDesktopComputer },
    { value: 'workspace', label: 'Робочі місця', icon: HiUserGroup }
  ], [])

  const sortOptions = useMemo(() => [
    { value: 'name', label: 'Назва' },
    { value: 'type', label: 'Тип' },
    { value: 'capacity', label: 'Місткість' },
    { value: 'availability', label: 'Доступність' }
  ], [])

  const hasActiveFilters = useMemo(() => 
    searchTerm || selectedType !== 'all' || showOnlyAvailable || sortBy !== 'name' || sortOrder !== 'asc',
    [searchTerm, selectedType, showOnlyAvailable, sortBy, sortOrder]
  )

  const handleClearSearch = useCallback(() => {
    dispatch(setSearchTerm(''))
  }, [dispatch])

  const handleClearType = useCallback(() => {
    dispatch(setSelectedType('all'))
  }, [dispatch])

  const handleClearSort = useCallback(() => {
    dispatch(setSortBy('name'))
    dispatch(setSortOrder('asc'))
  }, [dispatch])

  const handleClearAvailability = useCallback(() => {
    dispatch(setShowOnlyAvailable(false))
  }, [dispatch])

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <HiSearch className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Пошук ресурсів за назвою або описом..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <HiX className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Type Filters */}
      <div>
        <h3 className="text-sm font-medium text-gray-900 mb-3">Тип ресурсу</h3>
        <div className="flex flex-wrap gap-2">
          {resourceTypes.map((type) => {
            const IconComponent = type.icon
            return (
              <button
                key={type.value}
                onClick={() => handleTypeChange(type.value)}
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedType === type.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <IconComponent className="mr-2 w-4 h-4" />
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Sort and Filter Options */}
      <div className="flex flex-col space-y-4">
        {/* Sort Options */}
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <span className="text-sm font-medium text-gray-700 flex-shrink-0">Сортувати за:</span>
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
                {sortBy === option.value && (
                  <span className="ml-1">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Availability Filter */}
        <div className="flex items-center space-x-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyAvailable}
              onChange={handleAvailabilityToggle}
              className="sr-only"
            />
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              showOnlyAvailable ? 'bg-blue-600' : 'bg-gray-200'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                showOnlyAvailable ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
            <span className="ml-3 text-sm font-medium text-gray-700">
              Тільки доступні
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary and Reset */}
      {hasActiveFilters && (
        <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
          <div className="flex flex-col space-y-2">
            <span className="text-sm font-medium text-gray-700">Активні фільтри:</span>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Пошук: "{searchTerm}"
                  <button
                    onClick={handleClearSearch}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {resourceTypes.find(t => t.value === selectedType)?.label}
                  <button
                    onClick={handleClearType}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(sortBy !== 'name' || sortOrder !== 'asc') && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Сортування: {sortOptions.find(s => s.value === sortBy)?.label} {sortOrder === 'asc' ? '↑' : '↓'}
                  <button
                    onClick={handleClearSort}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </span>
              )}
              {showOnlyAvailable && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Тільки доступні
                  <button
                    onClick={handleClearAvailability}
                    className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <HiX className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          </div>
          <div className="flex justify-center sm:justify-end">
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md font-medium transition-colors duration-200"
            >
              <HiX className="mr-1 h-4 w-4" />
              Очистити всі
            </button>
          </div>
        </div>
      )}

      {/* Always visible reset button when no filters are active */}
      {!hasActiveFilters && (
        <div className="pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-2">Фільтри не застосовані</p>
          <button
            onClick={handleResetFilters}
            disabled
            className="inline-flex items-center px-3 py-1.5 text-sm text-gray-400 bg-gray-100 rounded-md font-medium cursor-not-allowed"
          >
            <HiX className="mr-1 h-4 w-4" />
            Очистити всі
          </button>
        </div>
      )}
    </div>
  )
})

ResourceFilters.displayName = 'ResourceFilters'

export default ResourceFilters