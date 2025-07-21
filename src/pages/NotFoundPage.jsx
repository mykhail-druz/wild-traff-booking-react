import React from 'react'
import { Link } from 'react-router-dom'
import { HiSearch, HiHome } from 'react-icons/hi'

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <HiSearch className="w-36 h-36 text-gray-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900">
          Сторінку не знайдено
        </h1>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          На жаль, сторінка, яку ви шукаете, не існує або була переміщена.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn btn-primary text-lg px-8 py-3 inline-flex items-center justify-center"
          >
            <HiHome className="mr-2 h-5 w-5" />
            На головну
          </Link>
          <Link
            to="/resources"
            className="btn btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center"
          >
            Переглянути ресурси
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage