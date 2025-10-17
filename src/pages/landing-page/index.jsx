import React from 'react';
import { Helmet } from 'react-helmet';
import PublicHeader from 'components/ui/PublicHeader';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import FeaturesSection from './components/FeaturesSection';
import FooterSection from './components/FooterSection';

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>LMS Pro - Transform Your Digital Learning Experience</title>
        <meta name="description" content="Empower educators and students with our comprehensive learning management system. Create courses, manage assignments, and track progress all in one powerful platform." />
        <meta name="keywords" content="LMS, learning management system, online education, course creation, student management, digital learning" />
        <meta property="og:title" content="LMS Pro - Transform Your Digital Learning Experience" />
        <meta property="og:description" content="Comprehensive learning management system for modern education" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <PublicHeader />
        
        <main>
          <HeroSection />
          <AboutSection />
          <FeaturesSection />
        </main>
        
        <FooterSection />
      </div>
    </>
  );
};

export default LandingPage;