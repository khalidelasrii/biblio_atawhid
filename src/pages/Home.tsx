import { Link } from 'react-router-dom';
import {
  BookOpen,
  PrinterIcon,
  ShoppingBag,
  FileText,
  Star,
  MapPin,
  Phone,
  Clock
} from 'lucide-react';
import headImage from '../assets/head.png';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Composant temporaire pour créer l'admin */}
      {/* <CreateAdminComponent /> */}

      {/* Hero Section */}
      <section
        className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white"
        style={{
          backgroundImage: `url(${headImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay pour l'opacité */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/80 to-orange-600/80"></div>

        {/* Contenu */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Librairie Al-Tawhid
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Votre destination complète pour les livres, fournitures scolaires et services d'impression
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Découvrir nos produits
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-500 transition-colors"
              >
                Nos services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre gamme complète de services pour tous vos besoins éducatifs et professionnels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Service 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <PrinterIcon className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Impression
              </h3>
              <p className="text-gray-600 mb-4">
                Photocopies, impression couleur, reliure et plastification
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Photocopies N&B et couleur</li>
                <li>• Impression de documents</li>
                <li>• Reliure professionnelle</li>
                <li>• Plastification</li>
              </ul>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Livres
              </h3>
              <p className="text-gray-600 mb-4">
                Manuels scolaires, littérature et livres académiques
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Manuels scolaires</li>
                <li>• Littérature classique</li>
                <li>• Livres académiques</li>
                <li>• Dictionnaires</li>
              </ul>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fournitures
              </h3>
              <p className="text-gray-600 mb-4">
                Sacs à dos, cahiers, stylos et matériel scolaire
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Sacs à dos variés</li>
                <li>• Cahiers et carnets</li>
                <li>• Stylos et crayons</li>
                <li>• Matériel de dessin</li>
              </ul>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Papeterie
              </h3>
              <p className="text-gray-600 mb-4">
                Accessoires de bureau et fournitures administratives
              </p>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Classeurs et chemises</li>
                <li>• Papier et enveloppes</li>
                <li>• Accessoires de bureau</li>
                <li>• Calculatrices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Produits Populaires
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos articles les plus demandés pour la rentrée scolaire
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <ShoppingBag className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sacs à dos scolaires
                </h3>
                <p className="text-gray-600 mb-4">
                  Large gamme de sacs à dos pour tous les âges
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">
                    À partir de 150 DH
                  </span>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Voir plus
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Manuels scolaires
                </h3>
                <p className="text-gray-600 mb-4">
                  Tous les manuels pour tous les niveaux
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">
                    À partir de 80 DH
                  </span>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Voir plus
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Fournitures bureau
                </h3>
                <p className="text-gray-600 mb-4">
                  Tout le nécessaire pour le bureau
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-500">
                    À partir de 25 DH
                  </span>
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                    Voir plus
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Avis de nos clients
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez ce que nos clients pensent de nos services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Excellent service d'impression, très rapide et de qualité. Je recommande vivement!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  A
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Ahmed M.</p>
                  <p className="text-sm text-gray-500">Étudiant</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Large choix de fournitures scolaires et prix très compétitifs. Parfait pour la rentrée!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Sarah L.</p>
                  <p className="text-sm text-gray-500">Parent</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Service client exceptionnel et disponibilité de tous les manuels scolaires. Très satisfait!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
                  M
                </div>
                <div className="ml-3">
                  <p className="font-semibold text-gray-900">Mohamed K.</p>
                  <p className="text-sm text-gray-500">Enseignant</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 bg-orange-500 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Visitez notre magasin
            </h2>
            <p className="text-xl max-w-2xl mx-auto">
              Nous sommes là pour vous aider avec tous vos besoins en papeterie et impression
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Address */}
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adresse</h3>
              <p className="text-lg">
                <div>
                  <p>Biblio Atawhid</p>
                  <p>Témara 12000</p>
                  <p>Maroc</p>
                  <a
                    href="https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8%D8%A9+%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF%E2%80%AD/@33.8650722,-6.9286219,17z/data=!3m1!4b1!4m6!3m5!1s0xda70f437f835e1f:0x88cbf391fb4a6605!8m2!3d33.8650722!4d-6.926047!16s%2Fg%2F11rxhkgll0?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:text-orange-300 text-sm"
                  >
                    Voir sur Google Maps
                  </a>
                  <br />
                </div>
              </p>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Téléphone</h3>
              <p className="text-lg">
                +212 6 04 41 53 02
              </p>
            </div>

            {/* Hours */}
            <div className="text-center">
              <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Horaires</h3>
              <p className="text-lg">
                Lun - Sam: 8h - 23h<br />
                Dim: 11h - 23h
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;