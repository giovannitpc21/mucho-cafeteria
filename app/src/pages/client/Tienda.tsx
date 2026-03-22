import React, { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Plus, Minus, X, ArrowRight, Check, Coffee, MapPin, Clock } from 'lucide-react';
import { AnimatedSection } from '@/components/common/AnimatedSection';
import { PriceFormatter } from '@/components/common/PriceFormatter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/mocks/productsData';
import type { Product } from '@/types';

const categoryLabels: Record<string, string> = {
  'equipamiento': 'Equipamiento',
  'cafe-grano': 'Café en Grano',
  'bebidas-botella': 'Bebidas',
  'accesorios': 'Accesorios',
  'merchandising': 'Merchandising',
};

// Product Card Component
const ProductCard: React.FC<{
  product: Product;
  onAddToCart: (product: Product) => void;
}> = React.memo(({ product, onAddToCart }) => {
  const crossSellProducts = useMemo(() => {
    if (!product.crossSellIds) return [];
    return products.filter((p) => product.crossSellIds?.includes(p.id));
  }, [product.crossSellIds]);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-[#E8DDD4] group">
      <div className="aspect-square relative overflow-hidden">
  <img
    src={product.image}
    alt={product.name}
    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
    onError={(e) => {
      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&fit=crop';
    }}
  />
  {!product.inStock && (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <Badge variant="secondary" className="bg-white text-[#1B3A2F]">
        Sin Stock
      </Badge>
    </div>
  )}
</div>

      <div className="p-5">
        <Badge variant="outline" className="mb-2 text-xs border-[#C4A77D] text-[#C4A77D]">
          {categoryLabels[product.category]}
        </Badge>
        <h3 className="font-semibold text-[#1B3A2F] mb-1 group-hover:text-[#C4A77D] transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-[#1B3A2F]/60 mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between">
          <PriceFormatter price={product.price} className="text-lg font-bold text-[#1B3A2F]" />
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className="bg-[#1B3A2F] hover:bg-[#2D4A3E] disabled:bg-[#E8DDD4] disabled:text-[#1B3A2F]/40"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {crossSellProducts.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[#E8DDD4]">
            <p className="text-xs text-[#1B3A2F]/50 mb-2">Complementa con:</p>
            <div className="flex flex-wrap gap-1">
              {crossSellProducts.slice(0, 2).map((p) => (
                <span key={p.id} className="text-xs text-[#C4A77D] bg-[#C4A77D]/10 px-2 py-1 rounded">
                  {p.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

// Cart Item Component
const CartItemRow: React.FC<{
  item: { product: Product; quantity: number };
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}> = React.memo(({ item, onUpdateQuantity, onRemove }) => (
  <div className="flex items-center space-x-4 py-4 border-b border-[#E8DDD4]">
    <div className="w-16 h-16 bg-[#E8DDD4] rounded-lg flex items-center justify-center flex-shrink-0">
      <Coffee className="w-8 h-8 text-[#1B3A2F]/40" />
    </div>
    <div className="flex-1 min-w-0">
      <h4 className="font-medium text-[#1B3A2F] truncate">{item.product.name}</h4>
      <PriceFormatter price={item.product.price} className="text-sm text-[#C4A77D]" />
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
        className="w-8 h-8 rounded-full bg-[#E8DDD4] flex items-center justify-center hover:bg-[#1B3A2F] hover:text-white transition-colors"
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-8 text-center font-medium">{item.quantity}</span>
      <button
        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
        className="w-8 h-8 rounded-full bg-[#E8DDD4] flex items-center justify-center hover:bg-[#1B3A2F] hover:text-white transition-colors"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
    <button
      onClick={() => onRemove(item.product.id)}
      className="p-2 text-[#1B3A2F]/40 hover:text-red-500 transition-colors"
    >
      <X className="w-5 h-5" />
    </button>
  </div>
));

CartItemRow.displayName = 'CartItemRow';

// Main Tienda Component
const Tienda: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);

  // Checkout Modal States
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<'takeaway' | 'delivery'>('takeaway');
  const [takeawayTime, setTakeawayTime] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Upsell Modal States
  const [upsellModalOpen, setUpsellModalOpen] = useState(false);
  const [upsellCandidate, setUpsellCandidate] = useState<{ main: Product, crossSells: Product[] } | null>(null);

  const { items, addToCart, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return Array.from(cats);
  }, []);

  const generateWhatsAppMessage = useCallback((cartItems: typeof items, total: number, method: string, address: string, time: string): string => {
    const itemsList = cartItems
      .map((item) => `• ${item.quantity}x ${item.product.name} - $${item.product.price.toLocaleString('es-AR')}`)
      .join('\n');

    const methodText = method === 'delivery'
      ? `*Entrega:* Delivery\n*Dirección:* ${address}`
      : `*Entrega:* Retiro por local\n*Horario estimado:* ${time}`;

    return `¡Hola MUCHO Café! 👋\n\nQuiero hacer un pedido:\n\n${itemsList}\n\n*Total: $${total.toLocaleString('es-AR')}*\n\n${methodText}`;
  }, []);

  const handleAddToCartWithUpsell = useCallback((product: Product) => {
    addToCart(product);
    const crossSells = product.crossSellIds
      ? products.filter(p => product.crossSellIds!.includes(p.id))
      : [];

    if (crossSells.length > 0) {
      setUpsellCandidate({ main: product, crossSells });
      setUpsellModalOpen(true);
    }
  }, [addToCart]);

  const initiateCheckout = useCallback(() => {
    setIsCheckoutModalOpen(true);
  }, []);

  const confirmCheckout = useCallback(() => {
    const message = generateWhatsAppMessage(items, totalPrice, deliveryMethod, deliveryAddress, takeawayTime);
    const whatsappUrl = `https://wa.me/5492617003657?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowCheckoutSuccess(true);
    setTimeout(() => {
      clearCart();
      setShowCheckoutSuccess(false);
      setIsCheckoutModalOpen(false);
      setIsCartOpen(false);
    }, 2000);
  }, [items, totalPrice, clearCart, generateWhatsAppMessage, deliveryMethod, deliveryAddress, takeawayTime]);

  return (
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1B3A2F] py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white font-['Playfair_Display'] mb-4">
              Tienda MUCHO
            </h1>
            <p className="text-white/70 max-w-xl mx-auto">
              Llevá el sabor de MUCHO a tu casa. Equipamiento, café en grano y más.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b border-[#E8DDD4] bg-white sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory
                ? 'bg-[#1B3A2F] text-white'
                : 'bg-[#E8DDD4] text-[#1B3A2F] hover:bg-[#1B3A2F]/10'
                }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat
                  ? 'bg-[#1B3A2F] text-white'
                  : 'bg-[#E8DDD4] text-[#1B3A2F] hover:bg-[#1B3A2F]/10'
                  }`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <AnimatedSection key={product.id} delay={index * 0.05}>
                <ProductCard product={product} onAddToCart={handleAddToCartWithUpsell} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Cart Button (Mobile) */}
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-4 left-4 right-4 md:hidden z-50"
        >
          <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
            <SheetTrigger asChild>
              <button className="w-full bg-[#1B3A2F] text-white py-4 px-6 rounded-xl shadow-lg flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShoppingBag className="w-5 h-5" />
                  <span className="font-medium">{totalItems} productos</span>
                </div>
                <PriceFormatter price={totalPrice} className="font-bold" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[80vh]">
              <CartContent
                items={items}
                totalPrice={totalPrice}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onCheckout={initiateCheckout}
                showCheckoutSuccess={showCheckoutSuccess}
              />
            </SheetContent>
          </Sheet>
        </motion.div>
      )}

      {/* Desktop Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent className="w-full sm:max-w-md hidden md:block">
          <CartContent
            items={items}
            totalPrice={totalPrice}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
            onCheckout={initiateCheckout}
            showCheckoutSuccess={showCheckoutSuccess}
          />
        </SheetContent>
      </Sheet>

      {/* Upsell Modal */}
      <Dialog open={upsellModalOpen} onOpenChange={setUpsellModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display']">¡Agregaste {upsellCandidate?.main.name}!</DialogTitle>
            <DialogDescription>
              ¿Te gustaría complementarlo con alguna de estas opciones y llevar tu pedido a otro nivel?
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-4 py-2">
            {upsellCandidate?.crossSells.map(cross => (
              <div key={cross.id} className="flex items-center justify-between border p-3 rounded-lg border-[#E8DDD4]">
                <div>
                  <h4 className="font-medium text-[#1B3A2F]">{cross.name}</h4>
                  <PriceFormatter price={cross.price} className="text-sm text-[#C4A77D]" />
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    addToCart(cross);
                    setUpsellModalOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="bg-[#1B3A2F] hover:bg-[#2D4A3E]"
                >
                  Sumar
                </Button>
              </div>
            ))}
          </div>
          <DialogFooter className="sm:justify-start">
            <Button variant="ghost" className="text-[#1B3A2F]/60 px-0" onClick={() => setUpsellModalOpen(false)}>
              No gracias, continuar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={isCheckoutModalOpen} onOpenChange={setIsCheckoutModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-['Playfair_Display']">Detalles de Entrega</DialogTitle>
            <DialogDescription>
              Seleccioná cómo preferís recibir tu pedido de MUCHO Café.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-2">
            <div className="flex rounded-lg overflow-hidden border border-[#1B3A2F]/20 bg-[#E8DDD4]/30 p-1">
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${deliveryMethod === 'takeaway' ? 'bg-[#1B3A2F] text-white shadow' : 'text-[#1B3A2F] hover:bg-white/50'}`}
                onClick={() => setDeliveryMethod('takeaway')}
              >
                Retiro en Local
              </button>
              <button
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${deliveryMethod === 'delivery' ? 'bg-[#1B3A2F] text-white shadow' : 'text-[#1B3A2F] hover:bg-white/50'}`}
                onClick={() => setDeliveryMethod('delivery')}
              >
                Envío (Delivery)
              </button>
            </div>

            {deliveryMethod === 'takeaway' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="time" className="text-[#1B3A2F]">Horario aproximado de retiro</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3.5 h-4 w-4 text-[#1B3A2F]/50" />
                  <Input
                    id="time"
                    type="time"
                    className="pl-9 h-11"
                    value={takeawayTime}
                    onChange={(e) => setTakeawayTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {deliveryMethod === 'delivery' && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <Label htmlFor="address" className="text-[#1B3A2F]">Dirección de entrega</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-[#1B3A2F]/50" />
                  <Input
                    id="address"
                    placeholder="Ej: San Martín 1234, Ciudad"
                    className="pl-9 h-11"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                  />
                </div>
                <p className="text-xs text-amber-600">El costo de envío se calculará por WhatsApp.</p>
              </div>
            )}

            {showCheckoutSuccess && (
              <div className="bg-green-100 text-green-800 p-3 rounded-md flex items-center justify-center text-sm font-medium animate-in fade-in">
                <Check className="w-4 h-4 mr-2" />
                ¡Pedido generado! Redirigiendo a WhatsApp...
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              onClick={confirmCheckout}
              disabled={showCheckoutSuccess || (deliveryMethod === 'delivery' && !deliveryAddress.trim()) || (deliveryMethod === 'takeaway' && !takeawayTime)}
              className="w-full bg-[#1B3A2F] hover:bg-[#2D4A3E] h-12 text-md"
            >
              Ir a Pagar por WhatsApp <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

// Cart Content Component
const CartContent: React.FC<{
  items: { product: Product; quantity: number }[];
  totalPrice: number;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
  showCheckoutSuccess: boolean;
}> = React.memo(({
  items,
  totalPrice,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  showCheckoutSuccess,
}) => {
  if (showCheckoutSuccess) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Check className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-[#1B3A2F] mb-2">¡Pedido enviado!</h3>
        <p className="text-[#1B3A2F]/60">Te redirigimos a WhatsApp...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8">
        <ShoppingBag className="w-16 h-16 text-[#E8DDD4] mb-4" />
        <h3 className="text-xl font-semibold text-[#1B3A2F] mb-2">Tu carrito está vacío</h3>
        <p className="text-[#1B3A2F]/60">Agregá productos para comenzar tu pedido</p>
      </div>
    );
  }

  return (
    <>
      <SheetHeader>
        <SheetTitle className="font-['Playfair_Display']">Tu Carrito</SheetTitle>
      </SheetHeader>
      <div className="flex-1 overflow-auto py-4">
        {items.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>
      <div className="border-t border-[#E8DDD4] pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[#1B3A2F]/60">Subtotal</span>
          <PriceFormatter price={totalPrice} className="font-semibold" />
        </div>
        <Button
          onClick={onCheckout}
          className="w-full bg-[#1B3A2F] hover:bg-[#2D4A3E] py-6"
        >
          Finalizar por WhatsApp
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </>
  );
});

CartContent.displayName = 'CartContent';

export default Tienda;
