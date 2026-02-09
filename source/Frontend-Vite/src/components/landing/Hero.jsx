import React from 'react';
import { Link } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <AutoAwesomeIcon sx={{ fontSize: 16 }} />
              <span>Welcome to FINKI Library</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6 animate-fade-in-up animation-delay-200">
              Your Gateway to{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Endless Knowledge
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl animate-fade-in-up animation-delay-400">
              Discover, reserve, and enjoy thousands of books from our extensive collection.
              Join our community of readers and experience seamless library management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-600">
              <Link
                to="/books"
                className="group inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Explore Books</span>
                <ArrowForwardIcon className="ml-2 group-hover:translate-x-1 transition-transform" sx={{ fontSize: 20 }} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <MenuBookIcon className="mr-2" sx={{ fontSize: 20 }} />
                <span>Login</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-gray-600 animate-fade-in animation-delay-800">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>10,000+ Books</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>5,000+ Members</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>24/7 Access</span>
              </div>
            </div>
          </div>

          {/* Right Column - Illustration/Image */}
          <div className="relative hidden lg:block animate-fade-in-scale animation-delay-400">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-200 rounded-3xl transform rotate-6 opacity-50"></div>
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-200 rounded-3xl transform -rotate-6 opacity-50"></div>

              {/* Main illustration container */}
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                <div className="space-y-4">
                  {/* Book stack illustration using CSS */}
                  <div className="flex justify-center items-end space-x-2 h-64">
                    <div className="w-16 h-48 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform"></div>
                    <div className="w-16 h-56 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform"></div>
                    <div className="w-16 h-40 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform"></div>
                    <div className="w-16 h-52 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg shadow-lg transform hover:-translate-y-2 transition-transform"></div>
                  </div>

                  {/* Floating badge */}
                  <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-bounce">
                    📚 New Arrivals
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-fade-in animation-delay-1000">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-indigo-600 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-indigo-600 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
