import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Croissant, UtensilsCrossed, Sparkles, ChefHat } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { PriceFormatter } from '@/components/common/PriceFormatter';
import { Badge } from '@/components/ui/badge';
import { menuItems } from '@/mocks/menuData';
import type { MenuItem } from '@/types';

const categoryConfig = {
  cafe: {
    label: 'Café',
    icon: Coffee,
    color: 'bg-[#1B3A2F]',
    description: 'De especialidad, preparado con MUCHO amor',
  },
  infusiones: {
    label: 'Infusiones',
    icon: Sparkles,
    color: 'bg-[#C4A77D]',
    description: 'Tés, matcha y más',
  },
  pasteleria: {
    label: 'Pastelería',
    icon: Croissant,
    color: 'bg-[#8B6914]',
    description: 'Dulces elaboraciones artesanales',
  },
  cocina: {
    label: 'Cocina',
    icon: ChefHat,
    color: 'bg-[#2D4A3E]',
    description: 'Focaccias, brunch y salado',
  },
  promos: {
    label: 'Promos',
    icon: UtensilsCrossed,
    color: 'bg-[#C4A77D]',
    description: 'Combinaciones especiales',
  },
};

// Menu Item Card Component
const MenuItemCard: React.FC<{ item: MenuItem }> = React.memo(({ item }) => (
  <div className="flex items-start justify-between p-4 bg-white rounded-lg border border-[#E8DDD4] hover:border-[#C4A77D] hover:shadow-md transition-all group">
    <div className="flex-1 pr-4">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-semibold text-[#1B3A2F] group-hover:text-[#C4A77D] transition-colors">
          {item.name}
        </h4>
        {item.isFeatured && (
          <Badge className="bg-[#C4A77D] text-white text-xs">Destacado</Badge>
        )}
      </div>
      <p className="text-sm text-[#1B3A2F]/60 mb-2">{item.description}</p>
      <div className="flex items-center gap-2">
        {item.isVegan && (
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Vegano</span>
        )}
        {item.isGlutenFree && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded">Sin TACC</span>
        )}
      </div>
    </div>
    <PriceFormatter price={item.price} className="font-bold text-[#1B3A2F] text-lg flex-shrink-0" />
  </div>
));

MenuItemCard.displayName = 'MenuItemCard';

// Category Section Component
const CategorySection: React.FC<{
  category: keyof typeof categoryConfig;
  items: MenuItem[];
  isActive: boolean;
  onToggle: () => void;
}> = React.memo(({ category, items, isActive, onToggle }) => {
  const config = categoryConfig[category];
  const Icon = config.icon;

  const subcategories = useMemo(() => {
    const subs = new Set(items.map((item) => item.subcategory).filter(Boolean));
    return Array.from(subs);
  }, [items]);

  return (
    <AnimatedSection>
      <div className="border border-[#E8DDD4] rounded-xl overflow-hidden bg-white">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between p-5 hover:bg-[#FAF8F5] transition-colors"
        >
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-semibold text-[#1B3A2F] font-['Playfair_Display']">
                {config.label}
              </h3>
              <p className="text-sm text-[#1B3A2F]/60">{config.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="outline" className="border-[#E8DDD4]">
              {items.length} items
            </Badge>
            <motion.div
              animate={{ rotate: isActive ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-5 h-5 text-[#1B3A2F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-5 pt-0 border-t border-[#E8DDD4]">
                {subcategories.length > 0 ? (
                  subcategories.map((sub) => (
                    <div key={sub} className="mt-4">
                      <h4 className="text-sm font-medium text-[#C4A77D] uppercase tracking-wider mb-3">
                        {sub}
                      </h4>
                      <div className="space-y-3">
                        {items
                          .filter((item) => item.subcategory === sub)
                          .map((item) => (
                            <MenuItemCard key={item.id} item={item} />
                          ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="mt-4 space-y-3">
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatedSection>
  );
});

CategorySection.displayName = 'CategorySection';

// Main Carta Component
const Carta: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>('cafe');
  const [activeFilter, setActiveFilter] = useState<'vegan' | 'gf' | 'featured' | null>(null);

  const groupedItems = useMemo(() => {
    const grouped: Record<string, MenuItem[]> = {};
    
    const filteredItems = menuItems.filter((item) => {
      if (!activeFilter) return true;
      if (activeFilter === 'vegan') return item.isVegan;
      if (activeFilter === 'gf') return item.isGlutenFree;
      if (activeFilter === 'featured') return item.isFeatured;
      return true;
    });

    filteredItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  }, [activeFilter]);

  const handleToggle = useCallback((category: string) => {
    setActiveCategory((prev) => (prev === category ? null : category));
  }, []);

  const handleFilterToggle = useCallback((filter: 'vegan' | 'gf' | 'featured') => {
    setActiveFilter((prev) => (prev === filter ? null : filter));
    // Opcional: Expandir todas las categorías que tengan items bajo este filtro, 
    // pero por ahora mantenemos el comportamiento simple.
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1B3A2F] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <h1 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display'] mb-4">
              Nuestra Carta
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Descubrí todos los sabores que MUCHO tiene para ofrecerte. 
              Café de especialidad, pastelería artesanal y MUCHO más.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Legend / Filters */}
      <section className="py-4 bg-white border-b border-[#E8DDD4]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            <button 
              onClick={() => handleFilterToggle('vegan')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'vegan' 
                  ? 'bg-green-50 ring-2 ring-green-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="w-3 h-3 bg-green-100 rounded"></span>
              <span className="text-[#1B3A2F]/70 font-medium">Opción vegana</span>
            </button>
            <button 
              onClick={() => handleFilterToggle('gf')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'gf' 
                  ? 'bg-amber-50 ring-2 ring-amber-200' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="w-3 h-3 bg-amber-100 rounded"></span>
              <span className="text-[#1B3A2F]/70 font-medium">Sin TACC</span>
            </button>
            <button 
              onClick={() => handleFilterToggle('featured')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all ${
                activeFilter === 'featured' 
                  ? 'bg-[#FAF8F5] ring-2 ring-[#E8DDD4]' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <span className="w-3 h-3 bg-[#C4A77D] rounded"></span>
              <span className="text-[#1B3A2F]/70 font-medium">Destacado del barista</span>
            </button>
          </div>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map((category) => (
              <CategorySection
                key={category}
                category={category}
                items={groupedItems[category] || []}
                isActive={activeCategory === category}
                onToggle={() => handleToggle(category)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-8 bg-[#E8DDD4]/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-[#1B3A2F]/60">
            En MUCHO CAFÉ elaboramos productos con gluten, lactosa y maní. 
            Si tenés alguna restricción alimentaria avisanos así podemos ayudarte en la elección. 
            Los alimentos sin TACC están claramente identificados.
          </p>
          <p className="text-sm text-[#1B3A2F]/60 mt-2">
            Todas las infusiones con leche se preparan con leche entera. 
            Adicional leche descremada $400. Adicional leche vegetal $600.
          </p>
        </div>
      </section>
    </main>
  );
};

export default Carta;
