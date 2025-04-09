import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/useAuthStore';
import { Header } from './components/Header';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';

const Login = React.lazy(() => import('./pages/Login'));
const Products = React.lazy(() => import('./pages/Products'));
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Wishlist = React.lazy(() => import('./pages/Wishlist'));

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  return token ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  const token = useAuthStore((state) => state.token);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {token && <Header />}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <React.Suspense fallback={
              <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
              </div>
            }>
              <Routes>
                <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
                <Route path="/" element={
                  <PrivateRoute>
                    <Products />
                  </PrivateRoute>
                } />
                <Route path="/product/:id" element={
                  <PrivateRoute>
                    <ProductDetail />
                  </PrivateRoute>
                } />
                <Route path="/cart" element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                } />
                <Route path="/wishlist" element={
                  <PrivateRoute>
                    <Wishlist />
                  </PrivateRoute>
                } />
              </Routes>
            </React.Suspense>
          </main>
          <Toaster position="top-right" />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;