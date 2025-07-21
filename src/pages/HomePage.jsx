import React from 'react'
import { Link } from 'react-router-dom'
import {
  HiDesktopComputer, 
  HiUserGroup,
  HiArrowRight 
} from 'react-icons/hi'
import { TbPodium } from "react-icons/tb";

const HomePage = () => {
  const features = [
    {
      icon: TbPodium,
      title: 'Переговорні кімнати',
      description: 'Бронюйте переговорні кімнати для ваших зустрічей та презентацій',
      link: '/resources?type=meeting-room'
    },
    {
      icon: HiDesktopComputer,
      title: 'Обладнання',
      description: 'Резервуйте необхідне технічне обладнання для роботи',
      link: '/resources?type=equipment'
    },
    {
      icon: HiUserGroup,
      title: 'Робочі місця',
      description: 'Забронюйте комфортне робоче місце на потрібний час',
      link: '/resources?type=workspace'
    }
  ]

  const stats = [
    { label: 'Доступних ресурсів', value: '50+' },
    { label: 'Активних бронювань', value: '120+' },
    { label: 'Задоволених користувачів', value: '200+' }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-transparent to-purple-50 rounded-3xl -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 animate-fade-in-down">
          Система управління

          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">бронюваннями</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up">
          Легко бронюйте переговорні кімнати, технічне обладнання та робочі місця. 
          Керуйте своїми бронюваннями в одному місці.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Link
            to="/resources"
            className="btn btn-primary text-lg px-8 py-3 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Переглянути ресурси</span>
            <svg className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          <Link
            to="/bookings"
            className="btn btn-secondary text-lg px-8 py-3 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-xl hover:text-white transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">Мої бронювання</span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in-up relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-3 group-hover:animate-bounce-gentle">
                {stat.value}
              </div>
              <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Що ви можете забронювати?
          </h2>
          <p className="text-lg text-gray-600">
            Оберіть тип ресурсу, який вам потрібен
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <Link
                key={index}
                to={feature.link}
                className="card p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-400 cursor-pointer group relative overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-400"></div>
                <div className="text-center space-y-6 relative z-10">
                  <div className="flex justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-400">
                    <div className="p-4 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-400">
                      <IconComponent className="w-16 h-16 text-blue-600 group-hover:text-blue-700 animate-float" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {feature.description}
                  </p>
                  <div className="text-blue-600 font-medium group-hover:text-blue-700 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                    Переглянути <HiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-blue-50 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Як це працює?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Оберіть ресурс', desc: 'Знайдіть потрібний ресурс зі списку' },
            { step: '2', title: 'Виберіть час', desc: 'Оберіть дату та час бронювання' },
            { step: '3', title: 'Підтвердіть', desc: 'Підтвердіть бронювання одним кліком' },
            { step: '4', title: 'Користуйтесь', desc: 'Використовуйте заброньований ресурс' }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage