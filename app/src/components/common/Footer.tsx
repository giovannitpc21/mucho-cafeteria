import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, MapPin, Phone, Clock } from 'lucide-react';

export const Footer: React.FC = React.memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1B3A2F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-[#C4A77D] rounded-full flex items-center justify-center">
                <span className="text-[#1B3A2F] font-bold text-lg font-['Playfair_Display']">M</span>
              </div>
              <span className="font-bold text-xl font-['Playfair_Display']">MUCHO Café</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Café mendocino por excelencia. Desde el corazón de los Andes australes, 
              MUCHO espacio para descubrir, compartir y experimentar.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-['Playfair_Display']">Enlaces Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <Link to="/" className="text-white/70 hover:text-[#C4A77D] transition-colors text-sm">
                Inicio
              </Link>
              <Link to="/carta" className="text-white/70 hover:text-[#C4A77D] transition-colors text-sm">
                Nuestra Carta
              </Link>
              <Link to="/tienda" className="text-white/70 hover:text-[#C4A77D] transition-colors text-sm">
                Tienda Online
              </Link>
              <Link to="/reservas" className="text-white/70 hover:text-[#C4A77D] transition-colors text-sm">
                Reservas
              </Link>
              <Link to="/contacto" className="text-white/70 hover:text-[#C4A77D] transition-colors text-sm">
                Contacto
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg font-['Playfair_Display']">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-[#C4A77D] flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  Mercado Central, Mendoza, Argentina
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-[#C4A77D] flex-shrink-0" />
                <a 
                  href="https://wa.me/542615555555" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-[#C4A77D] transition-colors text-sm"
                >
                  +54 9 261 555-5555
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-[#C4A77D] flex-shrink-0 mt-0.5" />
                <div className="text-white/70 text-sm">
                  <p>Lun-Vie: 8:00 - 21:00</p>
                  <p>Sab-Dom: 9:00 - 21:00</p>
                </div>
              </div>
              <a
                href="https://instagram.com/muchocafe.ar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/70 hover:text-[#C4A77D] transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span className="text-sm">@muchocafe.ar</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-white/50 text-sm">
            © {currentYear} MUCHO Café. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
