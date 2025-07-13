import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { MessageService } from '../services/dataService';
import toast from 'react-hot-toast';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await MessageService.addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      toast.success('Message envoyé avec succès ! Nous vous répondrons bientôt.');

      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error: any) {
      console.error('Erreur envoi message:', error);
      toast.error('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Contactez-nous
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Nous sommes là pour vous aider. N'hésitez pas à nous contacter pour toute question
          ou demande d'information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Informations de contact */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Informations de contact
            </h2>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Téléphone</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>06 04 41 53 02</p>
                    <p>06 06 31 33 86</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">biblioatawhid@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Adresse</h3>
                  <div className="text-gray-600">
                    <p>مكتبة التوحيد</p>
                    <p>Biblio Atawhid</p>
                    <p>Témara 12000</p>
                    <p>Maroc</p>
                    <a
                      href="https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8%D8%A9+%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF%E2%80%AD/@33.8650722,-6.9286219,17z/data=!3m1!4b1!4m6!3m5!1s0xda70f437f835e1f:0x88cbf391fb4a6605!8m2!3d33.8650722!4d-6.926047!16s%2Fg%2F11rxhkgll0?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:text-orange-600 text-sm font-medium inline-flex items-center mt-1"
                    >
                      Voir sur Google Maps
                      <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Horaires d'ouverture</h3>
                  <div className="text-gray-600 space-y-1">
                    <p>Lundi - Vendredi: 8h00 - 19h00</p>
                    <p>Samedi: 8h00 - 18h00</p>
                    <p>Dimanche: 9h00 - 17h00</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Carte Google Maps */}
          <Card className="overflow-hidden">
            <div className="w-full h-64">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3320.8650722!2d-6.9286219!3d33.8650722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda70f437f835e1f%3A0x88cbf391fb4a6605!2z2YXZg9iq2KjYqSDYp9mE2KrZiNit2YrYrw!5e0!3m2!1sfr!2sma!4v1720775200000!5m2!1sfr!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation Biblio Atawhid - Témara"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Notre Localisation</h3>
              <p className="text-gray-600 text-sm">
                Trouvez-nous facilement à Témara. Parking disponible à proximité.
              </p>
              <a
                href="https://www.google.com/maps/place/%D9%85%D9%83%D8%AA%D8%A8%D8%A9+%D8%A7%D9%84%D8%AA%D9%88%D8%AD%D9%8A%D8%AF%E2%80%AD/@33.8650722,-6.9286219,17z/data=!3m1!4b1!4m6!3m5!1s0xda70f437f835e1f:0x88cbf391fb4a6605!8m2!3d33.8650722!4d-6.926047!16s%2Fg%2F11rxhkgll0?entry=ttu&g_ep=EgoyMDI1MDcwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm mt-2"
              >
                Ouvrir dans Google Maps
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </Card>
        </div>

        {/* Formulaire de contact */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Envoyez-nous un message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nom complet"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Téléphone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Input
              label="Sujet"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors resize-none"
                placeholder="Décrivez votre demande..."
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              icon={loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Send className="w-4 h-4" />
              )}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};