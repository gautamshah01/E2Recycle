import React, { useState, useEffect, useMemo } from 'react';
import heroBackground from '../assets/hero-background.jpg';

const HeroSection = () => {
  const sentences = useMemo(() => [
    "Transform your electronic waste into environmental impact",
    "Recycle responsibly, protect our planet's future",
    "Turn old devices into sustainable solutions",
    "Join the e-waste revolution for a greener tomorrow"
  ], []);

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentSentence = sentences[currentSentenceIndex];
    
    if (isTyping) {
      // Typing effect
      if (charIndex < currentSentence.length) {
        const timer = setTimeout(() => {
          setCurrentText(currentSentence.substring(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        }, 100); // Typing speed
        return () => clearTimeout(timer);
      } else {
        // Sentence complete, wait then start deleting
        const timer = setTimeout(() => {
          setIsTyping(false);
        }, 2000); // Wait 2 seconds before deleting
        return () => clearTimeout(timer);
      }
    } else {
      // Deleting effect
      if (charIndex > 0) {
        const timer = setTimeout(() => {
          setCurrentText(currentSentence.substring(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        }, 50); // Deleting speed (faster than typing)
        return () => clearTimeout(timer);
      } else {
        // Move to next sentence
        setCurrentSentenceIndex((prevIndex) => 
          prevIndex === sentences.length - 1 ? 0 : prevIndex + 1
        );
        setIsTyping(true);
      }
    }
  }, [charIndex, isTyping, currentSentenceIndex, sentences]);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-16"
      style={{
        backgroundImage: `url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Hero Heading with Typing Animation */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to{' '}
              <span className="text-green-400">E2Recycle</span>
            </h1>
            <div className="h-20 flex items-center justify-center">
              <p className="text-xl md:text-2xl text-gray-100 font-medium drop-shadow-lg">
                {currentText}
                <span className="animate-pulse text-green-400">|</span>
              </p>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
            E2Recycle is your trusted partner in responsible electronic waste management. 
            We make it easy to recycle your old devices while contributing to a sustainable future.
          </p>

          {/* Contact Info Bar */}
          <div className="mb-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <a href="mailto:e2recycle@gmail.com" className="text-white font-medium hover:text-green-400 transition duration-300">
                e2recycle@gmail.com
              </a>
            </div>
            <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-lg px-4 py-2">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:+918433821253" className="text-white font-medium hover:text-green-400 transition duration-300">
                +91 8433821253
              </a>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105 shadow-xl">
              Get Started
            </button>
            <button className="border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition duration-300 transform hover:scale-105 backdrop-blur-sm">
              Learn More
            </button>
          </div>

          {/* Statistics */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">10K+</div>
              <div className="text-gray-700">Devices Recycled</div>
            </div>
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">5K+</div>
              <div className="text-gray-700">Happy Customers</div>
            </div>
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg shadow-xl p-6 transform hover:scale-105 transition duration-300">
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-700">Material Recovery</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;