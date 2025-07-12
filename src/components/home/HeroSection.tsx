import React from 'react';
import { ArrowRight, BookOpen, Printer, ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 to-orange-100 min-h-[80vh] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Votre librairie de
              <span className="text-orange-500 block">confiance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl">
              Découvrez notre large gamme de livres scolaires, fournitures, services d'impression 
              et papeterie pour tous vos besoins éducatifs et professionnels.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="px-8">
                Découvrir nos produits
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8">
                Demander un devis
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">500+</div>
                <div className="text-sm text-gray-600">Produits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">1000+</div>
                <div className="text-sm text-gray-600">Clients satisfaits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">Agadir</div>
                <div className="text-sm text-gray-600">Hay Mohammadi</div>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg"
                alt="Biblio Atawhid - Façade de la librairie"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Floating cards */}
            <div className="absolute -top-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Livres scolaires</div>
                  <div className="text-sm text-gray-500">Tous niveaux</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Printer className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Impression</div>
                  <div className="text-sm text-gray-500">Qualité professionnelle</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <circle cx="5" cy="5" r="2" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>
    </section>
  );
};