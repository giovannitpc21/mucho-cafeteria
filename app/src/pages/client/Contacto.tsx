import React from 'react';
import { MapPin, Phone, Clock, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Ubicación',
    content: 'Mercado Moreno de Mendoza',
    subContent: 'Mendoza, Argentina',
    action: {
      label: 'Ver en Google Maps',
      href: 'https://maps.app.goo.gl/Z1t8w86ocdhEW9mG6',
      icon: ExternalLink,
    },
  },
  {
    icon: Phone,
    title: 'Teléfono',
    content: '+54 9 261 555-5555',
    subContent: 'WhatsApp disponible',
    action: {
      label: 'Escribir por WhatsApp',
      href: 'https://wa.me/542617003657',
      icon: MessageCircle,
    },
  },
  {
    icon: Clock,
    title: 'Horarios',
    content: 'Lunes a Viernes: 8:00 - 21:00',
    subContent: 'Sábados, Domingos y Feriados: 9:00 - 21:00',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    content: '@muchocafe.ar',
    subContent: 'Seguinos para novedades',
    action: {
      label: 'Seguir en Instagram',
      href: 'https://instagram.com/muchocafe.ar',
      icon: ExternalLink,
    },
  },
];

const Contacto: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1B3A2F] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display'] mb-4">
              Contacto
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Estamos acá para vos. Escribinos, llamanos o pasá a visitarnos.
              MUCHO gusto en atenderte.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactInfo.map((info, index) => (
              <AnimatedSection key={info.title} delay={index * 0.1}>
                <Card className="h-full border-[#E8DDD4] hover:border-[#C4A77D] hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-[#1B3A2F] rounded-xl flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-[#1B3A2F] text-lg mb-1">
                          {info.title}
                        </h3>
                        <p className="text-[#1B3A2F]">{info.content}</p>
                        <p className="text-sm text-[#1B3A2F]/60">{info.subContent}</p>
                        
                        {info.action && (
                          <a
                            href={info.action.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-4"
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-[#1B3A2F] text-[#1B3A2F] hover:bg-[#1B3A2F] hover:text-white"
                            >
                              <info.action.icon className="w-4 h-4 mr-2" />
                              {info.action.label}
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-12 bg-[#E8DDD4]/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1B3A2F] font-['Playfair_Display'] mb-2">
              ¿Dónde estamos?
            </h2>
            <p className="text-[#1B3A2F]/60">
              Encontranos en el corazón de Mendoza
            </p>
          </AnimatedSection>

          <AnimatedSection>
            <div className="relative w-full h-[400px] bg-[#E8DDD4] rounded-xl overflow-hidden">
              {/* Map Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <MapPin className="w-16 h-16 text-[#1B3A2F]/30 mb-4" />
                <p className="text-[#1B3A2F]/60 text-center px-4">
                  Mapa de Google Maps<br />
                  <span className="text-sm">Mariano Moreno 585, Ciudad de Mendoza, Argentina</span>
                </p>
                <a
                  href="https://maps.app.goo.gl/Z1t8w86ocdhEW9mG6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4"
                >
                  <Button className="bg-[#1B3A2F] hover:bg-[#2D4A3E]">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Abrir en Google Maps
                  </Button>
                </a>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-4 left-4 w-20 h-20 bg-[#C4A77D]/20 rounded-full blur-xl" />
              <div className="absolute bottom-4 right-4 w-32 h-32 bg-[#1B3A2F]/10 rounded-full blur-xl" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold text-[#1B3A2F] font-['Playfair_Display'] mb-4">
              ¿Querés hacer una reserva?
            </h2>
            <p className="text-[#1B3A2F]/60 mb-6">
              Asegurate tu lugar en MUCHO Café. Reservá con anticipación.
            </p>
            <a href="/reservas">
              <Button className="bg-[#1B3A2F] hover:bg-[#2D4A3E] px-8 py-6 text-lg">
                <Clock className="w-5 h-5 mr-2" />
                Reservar Mesa
              </Button>
            </a>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
};

export default Contacto;
