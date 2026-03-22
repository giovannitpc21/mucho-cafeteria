import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Spinner } from '@/components/ui/spinner';

// Lazy load pages for code splitting
const Home = React.lazy(() => import('@/pages/client/Home'));
const Tienda = React.lazy(() => import('@/pages/client/Tienda'));
const Carta = React.lazy(() => import('@/pages/client/Carta'));
const Reservas = React.lazy(() => import('@/pages/client/Reservas'));
const Contacto = React.lazy(() => import('@/pages/client/Contacto'));
const AdminLogin = React.lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard'));

// Loading fallback component
const PageLoader: React.FC = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <Spinner className="w-10 h-10 text-[#C4A77D]" />
  </div>
);

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Public Route Component (redirects to admin if authenticated)
const PublicLoginRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  
  return <>{children}</>;
};

// Client Layout with Header and Footer
const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

// App Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route
        path="/"
        element={
          <ClientLayout>
            <Suspense fallback={<PageLoader />}>
              <Home />
            </Suspense>
          </ClientLayout>
        }
      />
      <Route
        path="/tienda"
        element={
          <ClientLayout>
            <Suspense fallback={<PageLoader />}>
              <Tienda />
            </Suspense>
          </ClientLayout>
        }
      />
      <Route
        path="/carta"
        element={
          <ClientLayout>
            <Suspense fallback={<PageLoader />}>
              <Carta />
            </Suspense>
          </ClientLayout>
        }
      />
      <Route
        path="/reservas"
        element={
          <ClientLayout>
            <Suspense fallback={<PageLoader />}>
              <Reservas />
            </Suspense>
          </ClientLayout>
        }
      />
      <Route
        path="/contacto"
        element={
          <ClientLayout>
            <Suspense fallback={<PageLoader />}>
              <Contacto />
            </Suspense>
          </ClientLayout>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/login"
        element={
          <PublicLoginRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminLogin />
            </Suspense>
          </PublicLoginRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </ProtectedRoute>
        }
      />

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
