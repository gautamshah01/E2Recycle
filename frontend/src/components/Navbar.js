import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600">
              E2Recycle
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a 
                href="#home" 
                className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Home
              </a>
              <a 
                href="#how-it-works" 
                className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                How E2Recycle Works
              </a>
              <a 
                href="#contact" 
                className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Login and Register Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center space-x-4">
              <Link 
                to="/login"
                className="text-gray-900 hover:text-green-600 px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-300"
              >
                Register
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-gray-900 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <a 
              href="#home" 
              className="text-gray-900 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Home
            </a>
            <a 
              href="#how-it-works" 
              className="text-gray-900 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              How E2Recycle Works
            </a>
            <a 
              href="#contact" 
              className="text-gray-900 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
              onClick={toggleMenu}
            >
              Contact Us
            </a>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <Link 
                  to="/login"
                  className="text-gray-900 hover:text-green-600 px-3 py-2 rounded-md text-base font-medium text-left"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;