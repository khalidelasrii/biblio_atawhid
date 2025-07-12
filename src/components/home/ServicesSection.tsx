import React from 'react';
import { BookOpen, Printer, ShoppingBag, PenTool, Backpack, FileText } from 'lucide-react';
import { Card } from '../ui/Card';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: BookOpen,
      title: 'Livres Scolaires',
      description: 'Large collection de manuels scolaires pour tous les niveaux, du primaire au supérieur.',
      features: ['Manuels officiels', 'Prix compétitifs', 'Commande groupée']
    },
    {
      icon: PenTool,
      title: 'Fournitures Scolaires',
      description: 'Tout le matériel nécessaire pour la réussite scolaire de vos enfants.',
      features: ['Cahiers et classeurs', 'Stylos et crayons', 'Matériel de géométrie']
    },
    {
      icon: Printer,
      title: 'Services d\'Impression',
      description: 'Impression haute qualité pour tous vos documents personnels et professionnels.',
      features: ['Impression couleur/N&B', 'Reliure', 'Plastification']
    },
    {
      icon: FileText,
      title: 'Papeterie',
      description: 'Articles de papeterie de qualité pour le bureau et les études.',
      features: ['Papier de qualité', 'Enveloppes', 'Accessoires de bureau']
    },
    {
      icon: Backpack,
      title: 'Sacs à Dos',
      description: 'Collection de sacs scolaires résistants et pratiques.',
      features: ['Designs modernes', 'Matériaux durables', 'Tailles variées']
    },
    {
      icon: ShoppingBag,
      title: 'Commandes Personnalisées',
      description: 'Service de commande sur mesure pour vos besoins spécifiques.',
      features: ['Devis personnalisé', 'Livraison rapide', 'Suivi commande']
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nos Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez notre gamme complète de produits et services pour répondre à tous vos besoins 
            scolaires, universitaires et professionnels.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} hover className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};