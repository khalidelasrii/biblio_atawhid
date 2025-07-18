import React from 'react';
import { BookOpen, Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Biblio Atawhid</h2>
                <p className="text-sm text-orange-400">Librairie & Papeterie</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Votre librairie de confiance pour tous vos besoins scolaires, universitaires et professionnels.
              Nous offrons une large gamme de livres, fournitures scolaires et services d'impression de qualité.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/profile.php?id=61550664507674&locale=fr_FR"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com/librairieatawhid29"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-orange-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Nos Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-orange-400 transition-colors">Livres scolaires</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Fournitures scolaires</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Services d'impression</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Papeterie</a></li>
              <li><a href="#" className="hover:text-orange-400 transition-colors">Sacs à dos</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <div>
                  <span>06 04 41 53 02</span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-400" />
                <span>06 06 31 33 86</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-orange-400" />
              <span>biblioatawhid@gmail.com</span>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-orange-400 mt-1" />
              <div>
                <p>Biblio Atawhid</p>
                <p>Témara 12000</p>
                <p>Maroc</p>
                <a
                  href="https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8%D8%A9+%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF%E2%80%AD/@33.8650722,-6.9286219,17z/data=!3m1!4b1!4m6!3m5!1s0xda70f437f835e1f:0x88cbf391fb4a6605!8m2!3d33.8650722!4d-6.926047!16s%2Fg%2F11rxhkgll0?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-400 hover:text-orange-300 text-sm"
                >
                  Voir sur Google Maps
                </a>
                <br />
              </div>
            </div>

          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Biblio Atawhid. Tous droits réservés.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
              Politique de confidentialité
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors">
              Conditions d'utilisation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};