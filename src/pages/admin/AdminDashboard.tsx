import React, { useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  Star,
  Package,
  FileSpreadsheet,
  LogOut,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock3,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { reservations as initialReservations } from '@/mocks/reservationsData';
import { reviews as initialReviews, pendingReviews as initialPendingReviews } from '@/mocks/reviewsData';
import { products as initialProducts } from '@/mocks/productsData';
import type { Reservation, Review, Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Metric Card Component
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}> = React.memo(({ title, value, subtitle, icon: Icon, color }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#1B3A2F]/60">{title}</p>
          <p className="text-3xl font-bold text-[#1B3A2F] mt-1">{value}</p>
          {subtitle && <p className="text-sm text-[#1B3A2F]/50 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </CardContent>
  </Card>
));

MetricCard.displayName = 'MetricCard';

// Status Badge Component
const StatusBadge: React.FC<{ status: Reservation['status'] }> = React.memo(({ status }) => {
  const config = {
    pending: { icon: Clock3, className: 'bg-amber-100 text-amber-700', label: 'Pendiente' },
    confirmed: { icon: CheckCircle, className: 'bg-green-100 text-green-700', label: 'Confirmada' },
    cancelled: { icon: XCircle, className: 'bg-red-100 text-red-700', label: 'Cancelada' },
  };
  const { icon: Icon, className, label } = config[status];

  return (
    <Badge className={className}>
      <Icon className="w-3 h-3 mr-1" />
      {label}
    </Badge>
  );
});

StatusBadge.displayName = 'StatusBadge';

// Main Dashboard Component
const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [pendingReviews, setPendingReviews] = useState<Review[]>(initialPendingReviews);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [activeTab, setActiveTab] = useState('reservas');

  // Metrics
  const today = new Date().toISOString().split('T')[0];
  const todayReservations = useMemo(
    () => reservations.filter((r) => r.date === today && r.status !== 'cancelled').length,
    [reservations, today]
  );
  const pendingCount = useMemo(
    () => reservations.filter((r) => r.status === 'pending').length,
    [reservations]
  );
  const pendingReviewsCount = pendingReviews.length;
  const avgTicket = useMemo(() => {
    const confirmed = reservations.filter((r) => r.status === 'confirmed');
    return confirmed.length > 0 ? Math.round(8500 * confirmed.length / confirmed.length) : 0;
  }, [reservations]);

  // Handlers
  const handleStatusChange = useCallback((reservationId: string, newStatus: Reservation['status']) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservationId ? { ...r, status: newStatus } : r))
    );
  }, []);

  const handleReviewApproval = useCallback((reviewId: string, approve: boolean) => {
    const review = pendingReviews.find((r) => r.id === reviewId);
    if (!review) return;

    if (approve) {
      setReviews((prev) => [...prev, { ...review, isApproved: true }]);
    }
    setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
  }, [pendingReviews]);

  const handleStockToggle = useCallback((productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <header className="bg-[#1B3A2F] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[#C4A77D] rounded-full flex items-center justify-center">
                <span className="text-[#1B3A2F] font-bold">M</span>
              </div>
              <span className="font-bold text-lg font-['Playfair_Display']">MUCHO Admin</span>
            </div>
            <Button variant="ghost" onClick={logout} className="text-white hover:bg-white/10">
              <LogOut className="w-5 h-5 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Reservas Hoy"
            value={todayReservations}
            subtitle={`${pendingCount} pendientes`}
            icon={Calendar}
            color="bg-blue-500"
          />
          <MetricCard
            title="Ticket Promedio"
            value={`$${avgTicket.toLocaleString('es-AR')}`}
            subtitle="Estimado"
            icon={TrendingUp}
            color="bg-green-500"
          />
          <MetricCard
            title="Reseñas Pendientes"
            value={pendingReviewsCount}
            subtitle="Por moderar"
            icon={Star}
            color="bg-amber-500"
          />
          <MetricCard
            title="Total Reservas"
            value={reservations.length}
            subtitle="Este mes"
            icon={Users}
            color="bg-purple-500"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="reservas">
              <Calendar className="w-4 h-4 mr-2" />
              Reservas
            </TabsTrigger>
            <TabsTrigger value="resenas">
              <Star className="w-4 h-4 mr-2" />
              Reseñas
            </TabsTrigger>
            <TabsTrigger value="inventario">
              <Package className="w-4 h-4 mr-2" />
              Inventario
            </TabsTrigger>
            <TabsTrigger value="datos">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Datos
            </TabsTrigger>
          </TabsList>

          {/* Reservations Tab */}
          <TabsContent value="reservas">
            <Card>
              <CardHeader>
                <CardTitle className="font-['Playfair_Display']">Gestión de Reservas</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Pax</TableHead>
                      <TableHead>Ocasión</TableHead>
                      <TableHead>Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>{new Date(reservation.date).toLocaleDateString('es-AR')}</TableCell>
                        <TableCell>{reservation.time}</TableCell>
                        <TableCell className="font-medium">{reservation.name}</TableCell>
                        <TableCell>{reservation.guests}</TableCell>
                        <TableCell>{reservation.occasion || '-'}</TableCell>
                        <TableCell>
                          <Select
                            value={reservation.status}
                            onValueChange={(value) =>
                              handleStatusChange(reservation.id, value as Reservation['status'])
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="confirmed">Confirmada</SelectItem>
                              <SelectItem value="cancelled">Cancelada</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="resenas">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Playfair_Display']">Reseñas Pendientes</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingReviews.length === 0 ? (
                    <p className="text-center text-[#1B3A2F]/50 py-8">No hay reseñas pendientes</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingReviews.map((review) => (
                        <div key={review.id} className="p-4 border border-[#E8DDD4] rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{review.author}</span>
                            <span className="text-sm text-[#1B3A2F]/50">{review.date}</span>
                          </div>
                          <div className="flex items-center mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating ? 'fill-[#C4A77D] text-[#C4A77D]' : 'text-[#E8DDD4]'
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-sm text-[#1B3A2F]/70 mb-3">{review.comment}</p>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => handleReviewApproval(review.id, true)}
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReviewApproval(review.id, false)}
                              className="border-red-500 text-red-500 hover:bg-red-50"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Ocultar
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-['Playfair_Display']">Reseñas Aprobadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-[500px] overflow-auto">
                    {reviews.filter((r) => r.isApproved).map((review) => (
                      <div key={review.id} className="p-4 border border-[#E8DDD4] rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{review.author}</span>
                          <span className="text-sm text-[#1B3A2F]/50">{review.date}</span>
                        </div>
                        <div className="flex items-center mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-[#C4A77D] text-[#C4A77D]' : 'text-[#E8DDD4]'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm text-[#1B3A2F]/70">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventario">
            <Card>
              <CardHeader>
                <CardTitle className="font-['Playfair_Display']">Gestión de Inventario</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>${product.price.toLocaleString('es-AR')}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={product.inStock}
                              onCheckedChange={() => handleStockToggle(product.id)}
                            />
                            <span className={product.inStock ? 'text-green-600' : 'text-red-500'}>
                              {product.inStock ? 'Disponible' : 'Agotado'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="datos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-['Playfair_Display']">Actualizar Precios</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#1B3A2F]/60 mb-4">
                    Modificá los precios de la carta directamente en Google Sheets.
                    Los cambios se reflejarán automáticamente en la web.
                  </p>
                  <a
                    href="https://sheets.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-[#1B3A2F] hover:bg-[#2D4A3E]">
                      <FileSpreadsheet className="w-4 h-4 mr-2" />
                      Abrir Google Sheets
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-['Playfair_Display']">Actualizar Inventario</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#1B3A2F]/60 mb-4">
                    Gestiona el stock de productos de la tienda en Google Sheets.
                    Sincronización automática con el sistema.
                  </p>
                  <a
                    href="https://sheets.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="bg-[#1B3A2F] hover:bg-[#2D4A3E]">
                      <Package className="w-4 h-4 mr-2" />
                      Abrir Inventario
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
