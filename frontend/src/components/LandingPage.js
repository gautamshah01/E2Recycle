import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import { HowItWorksSection, FeaturesSection, AboutSection } from './Sections';
import Footer from './Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default LandingPage;