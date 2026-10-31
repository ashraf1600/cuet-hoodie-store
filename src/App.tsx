import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Order from './pages/Order';
import Confirmation from './pages/Confirmation';
import OrderManagement from './pages/OrderManagement';
import HowToOrder from './pages/HowToOrder';

// Scroll to top helper on page navigation
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-ink text-paper">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/order" element={<Order />} />
            <Route path="/confirmation/:orderNumber" element={<Confirmation />} />
            <Route path="/order-management" element={<OrderManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/how-to-order" element={<HowToOrder />} />
            <Route path="/google-form" element={<Navigate to="/how-to-order" replace />} />
            <Route
              path="*"
              element={
                <div className="max-w-[720px] mx-auto px-4 py-24 text-center space-y-4">
                  <h1 className="font-anton text-4xl uppercase text-paper">404 — Page Not Found</h1>
                  <p className="font-body text-sm text-muted">The requested page could not be found.</p>
                  <a href="/" className="btn-outline inline-flex text-xs">
                    Return to Homepage
                  </a>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
