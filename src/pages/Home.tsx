import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { ServicesSection } from '../components/home/ServicesSection';

export const Home: React.FC = () => {
  return (
    <div>
      <HeroSection />
      <ServicesSection />
    </div>
  );
};