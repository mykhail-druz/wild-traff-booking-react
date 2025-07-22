import React, { useEffect, useMemo, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchResources } from '../store/slices/resourcesSlice'
import { 
  setSelectedType, 
  setSearchTerm, 
  setSortBy, 
  setSortOrder, 
  setShowOnlyAvailable 
} from '../store/slices/filtersSlice'
import { selectFilteredResources } from '../store/slices/filtersSlice'
import ResourceCard from '../components/Resources/ResourceCard'
import ResourceFilters from '../components/Resources/ResourceFilters'
import FullScreenLoader from '../components/UI/FullScreenLoader'
import ErrorMessage from '../components/UI/ErrorMessage'

const ResourcesPage = () => {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  
  const { loading, error } = useSelector(state => state.resources)
  const filteredResources = useSelector(selectFilteredResources)
  const { searchTerm, selectedType, sortBy, sortOrder, showOnlyAvailable } = useSelector(state => state.filters)

  // Handle URL parameters for filtering - read from URL on mount only
  useEffect(() => {
    const typeParam = searchParams.get('type')
    const searchParam = searchParams.get('search')
    const sortByParam = searchParams.get('sortBy')
    const sortOrderParam = searchParams.get('sortOrder')
    const showOnlyAvailableParam = searchParams.get('showOnlyAvailable')
    
    if (typeParam) {
      dispatch(setSelectedType(typeParam))
    }
    
    if (searchParam) {
      dispatch(setSearchTerm(searchParam))
    }
    
    if (sortByParam) {
      dispatch(setSortBy(sortByParam))
    }
    
    if (sortOrderParam) {
      dispatch(setSortOrder(sortOrderParam))
    }
    
    if (showOnlyAvailableParam === 'true') {
      dispatch(setShowOnlyAvailable(true))
    }
  }, []) // Only run on mount to avoid conflicts with user actions

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    
    if (selectedType !== 'all') {
      params.set('type', selectedType)
    }
    
    if (searchTerm) {
      params.set('search', searchTerm)
    }
    
    if (sortBy !== 'name') {
      params.set('sortBy', sortBy)
    }
    
    if (sortOrder !== 'asc') {
      params.set('sortOrder', sortOrder)
    }
    
    if (showOnlyAvailable) {
      params.set('showOnlyAvailable', 'true')
    }
    
    setSearchParams(params, { replace: true })
  }, [selectedType, searchTerm, sortBy, sortOrder, showOnlyAvailable, setSearchParams])

  // Fetch resources on component mount
  useEffect(() => {
    dispatch(fetchResources())
  }, [dispatch])

  const resourceStats = useMemo(() => {
    const total = filteredResources.length
    const available = filteredResources.filter(r => r.availableUnits > 0).length
    const types = [...new Set(filteredResources.map(r => r.type))].length
    
    return { total, available, types }
  }, [filteredResources])

  const handleRetry = useCallback(() => {
    dispatch(fetchResources())
  }, [dispatch])

  const handleResetFilters = useCallback(() => {
    dispatch(setSearchTerm(''))
    dispatch(setSelectedType('all'))
  }, [dispatch])

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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 animate-fade-in-down">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Доступні ресурси
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Оберіть та забронюйте потрібний ресурс для вашої роботи
        </p>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-scale-in"></div>
      </div>

      {/* Stats */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          <div className="text-center group hover:scale-105 transition-all duration-300 cursor-default">
            <div className="relative">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-3 group-hover:animate-bounce-gentle">
                {resourceStats.total}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              Всього ресурсів
            </div>
          </div>
          <div className="text-center group hover:scale-105 transition-all duration-300 cursor-default">
            <div className="relative">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 group-hover:animate-bounce-gentle">
                {resourceStats.available}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              Доступно зараз
            </div>
          </div>
          <div className="text-center group hover:scale-105 transition-all duration-300 cursor-default">
            <div className="relative">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-3 group-hover:animate-bounce-gentle">
                {resourceStats.types}
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              Типів ресурсів
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ResourceFilters />

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <div className="text-8xl mb-6 animate-bounce-gentle">🔍</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ресурси не знайдено
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
            Спробуйте змінити фільтри або пошуковий запит для кращих результатів
          </p>
          <button
            onClick={handleResetFilters}
            className="btn btn-primary transform hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Скинути фільтри</span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource, index) => (
            <div
              key={resource.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ResourceCard resource={resource} />
            </div>
          ))}
        </div>
      )}

      {/* Load More Button (for future pagination) */}
      {filteredResources.length > 0 && (
        <div className="text-center pt-8">
          <p className="text-gray-600">
            Показано {filteredResources.length} ресурсів
          </p>
        </div>
      )}
    </div>
  )
}

export default ResourcesPage