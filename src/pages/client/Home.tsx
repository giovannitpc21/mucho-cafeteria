import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Coffee, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { StarRating } from '@/components/common/StarRating';
import { PriceFormatter } from '@/components/common/PriceFormatter';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { menuItems } from '@/mocks/menuData';
import { products } from '@/mocks/productsData';
import { reviews, pendingReviews } from '@/mocks/reviewsData';
import type { Review } from '@/types';

// Hero Section Component
const HeroSection: React.FC = React.memo(() => (
  <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#1B3A2F] via-[#1B3A2F]/90 to-[#2D4A3E]" />
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-20 left-10 w-72 h-72 bg-[#C4A77D] rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#C4A77D] rounded-full blur-3xl" />
    </div>
    
    <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-20 h-20 bg-[#C4A77D] rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-[#1B3A2F] font-bold text-3xl font-['Playfair_Display']">M</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white font-['Playfair_Display'] mb-6">
          MUCHO Café
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-4 max-w-2xl mx-auto">
          Café mendocino por excelencia
        </p>
        <p className="text-white/60 mb-8 max-w-xl mx-auto">
          Desde los pies de los Andes australes, MUCHO espacio para descubrir, 
          compartir y experimentar el verdadero café de especialidad.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/carta">
            <Button className="bg-[#C4A77D] hover:bg-[#B3976D] text-[#1B3A2F] font-semibold px-8 py-6 text-lg">
              Ver Carta
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link to="/reservas">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg">
              <Calendar className="mr-2 w-5 h-5" />
              Reservar Mesa
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  </section>
));

HeroSection.displayName = 'HeroSection';

// Featured Items Component
const FeaturedItems: React.FC = React.memo(() => {
  const featuredMenu = useMemo(
    () => menuItems.filter((item) => item.isFeatured).slice(0, 4),
    []
  );
  const featuredProducts = useMemo(
    () => products.filter((item) => item.isFeatured).slice(0, 2),
    []
  );

  return (
    <section className="py-16 md:py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Coffee className="w-6 h-6 text-[#C4A77D]" />
            <span className="text-[#C4A77D] font-medium uppercase tracking-wider text-sm">
              Favoritos del Barista
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A2F] font-['Playfair_Display'] mb-4">
            Lo más pedido de MUCHO
          </h2>
          <p className="text-[#1B3A2F]/60 max-w-xl mx-auto">
            Descubrí los productos que nuestros clientes aman. 
            Cada uno seleccionado con MUCHO cuidado.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredMenu.map((item, index) => (
            <AnimatedSection key={item.id} delay={index * 0.1}>
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-[#E8DDD4]">
                <div className="w-12 h-12 bg-[#1B3A2F]/10 rounded-lg flex items-center justify-center mb-4">
                  <Coffee className="w-6 h-6 text-[#1B3A2F]" />
                </div>
                <h3 className="font-semibold text-[#1B3A2F] mb-2">{item.name}</h3>
                <p className="text-sm text-[#1B3A2F]/60 mb-3 line-clamp-2">{item.description}</p>
                <PriceFormatter price={item.price} className="text-[#C4A77D] font-bold" />
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <h3 className="text-xl font-semibold text-[#1B3A2F] font-['Playfair_Display'] mb-6">
            Destacados de la Tienda
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to="/tienda"
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-[#E8DDD4] flex items-center space-x-4"
              >
                <div className="w-16 h-16 bg-[#E8DDD4] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-8 h-8 text-[#1B3A2F]" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-[#1B3A2F]">{product.name}</h4>
                  <PriceFormatter price={product.price} className="text-[#C4A77D] font-bold" />
                </div>
              </Link>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
});

FeaturedItems.displayName = 'FeaturedItems';

// Reviews Section Component
const ReviewsSection: React.FC = React.memo(() => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReview, setNewReview] = useState({ author: '', rating: 5, comment: '' });
  const [, setLocalPendingReviews] = useState(pendingReviews);

  const approvedReviews = useMemo(
    () => reviews.filter((r) => r.isApproved),
    []
  );

  const handleSubmitReview = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const review: Review = {
      id: `rev-pending-${Date.now()}`,
      ...newReview,
      date: new Date().toISOString().split('T')[0],
      isApproved: false,
    };
    setLocalPendingReviews((prev) => [...prev, review]);
    setIsModalOpen(false);
    setNewReview({ author: '', rating: 5, comment: '' });
  }, [newReview]);

  return (
    <section className="py-16 md:py-24 bg-[#E8DDD4]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Star className="w-6 h-6 text-[#C4A77D]" />
            <span className="text-[#C4A77D] font-medium uppercase tracking-wider text-sm">
              Opiniones de Clientes
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1B3A2F] font-['Playfair_Display'] mb-4">
            Lo que dicen de MUCHO
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {approvedReviews.slice(0, 4).map((review, index) => (
            <AnimatedSection key={review.id} delay={index * 0.1}>
              <div className="bg-white rounded-xl p-6 shadow-sm h-full">
                <StarRating rating={review.rating} size="sm" />
                <p className="text-[#1B3A2F]/70 my-4 text-sm line-clamp-4">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[#1B3A2F] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {review.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1B3A2F] text-sm">{review.author}</p>
                    <p className="text-xs text-[#1B3A2F]/50">{review.date}</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="border-[#1B3A2F] text-[#1B3A2F] hover:bg-[#1B3A2F] hover:text-white"
          >
            <Star className="mr-2 w-4 h-4" />
            Dejar mi opinión
          </Button>
        </AnimatedSection>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-['Playfair_Display']">Compartí tu experiencia</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#1B3A2F]">Tu nombre</label>
                <Input
                  value={newReview.author}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, author: e.target.value }))}
                  placeholder="Ej: María González"
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-[#1B3A2F]">Calificación</label>
                <div className="mt-1">
                  <StarRating
                    rating={newReview.rating}
                    interactive
                    onRatingChange={(rating) => setNewReview((prev) => ({ ...prev, rating }))}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-[#1B3A2F]">Tu opinión</label>
                <Textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                  placeholder="Contanos tu experiencia en MUCHO..."
                  required
                  className="mt-1"
                  rows={4}
                />
              </div>
              <Button type="submit" className="w-full bg-[#1B3A2F] hover:bg-[#2D4A3E]">
                Enviar opinión
              </Button>
              <p className="text-xs text-center text-[#1B3A2F]/50">
                Tu opinión será revisada antes de publicarse.
              </p>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
});

ReviewsSection.displayName = 'ReviewsSection';

// CTA Section Component
const CTASection: React.FC = React.memo(() => (
  <section className="py-16 md:py-24 bg-[#1B3A2F]">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <AnimatedSection>
        <h2 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display'] mb-4">
          ¿Listo para vivir la experiencia MUCHO?
        </h2>
        <p className="text-white/70 mb-8 max-w-xl mx-auto">
          Reservá tu mesa o pasá por nuestro local en el Mercado Central de Mendoza.
          MUCHO espacio te espera.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/reservas">
            <Button className="bg-[#C4A77D] hover:bg-[#B3976D] text-[#1B3A2F] font-semibold px-8 py-6">
              Reservar Ahora
            </Button>
          </Link>
          <Link to="/contacto">
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-6">
              Ver Ubicación
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  </section>
));

CTASection.displayName = 'CTASection';

// Main Home Component
const Home: React.FC = () => (
  <main>
    <HeroSection />
    <FeaturedItems />
    <ReviewsSection />
    <CTASection />
  </main>
);

export default Home;
