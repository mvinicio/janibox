import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/public/Home';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Categories from './pages/admin/Categories';
import BasesTreats from './pages/admin/BasesTreats';
import HomeSections from './pages/admin/HomeSections';
import Inventory from './pages/admin/Inventory';
import OperatingCosts from './pages/admin/OperatingCosts';
import Finances from './pages/admin/Finances';
import Orders from './pages/admin/Orders';
import Quiz from './pages/public/Quiz';
import CustomBuilder from './pages/public/CustomBuilder';
import Checkout from './pages/public/Checkout';
import OrderConfirmation from './pages/public/OrderConfirmation';
import OrderTracking from './pages/public/OrderTracking';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabaseClient';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';

function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (err) {
        console.error('Initial session fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-vh-100 h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <CartProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#222',
              borderRadius: '20px',
              padding: '16px 24px',
              fontWeight: '600',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/custom" element={<CustomBuilder />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />
          <Route path="/tracking/:orderId" element={<OrderTracking />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={!session ? <Login /> : <Navigate to="/admin" />} />

          <Route path="/admin" element={session ? <Dashboard /> : <Navigate to="/admin/login" />}>
            <Route index element={<Navigate to="products" replace />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="customization" element={<BasesTreats />} />
            <Route path="home-sections" element={<HomeSections />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="costs" element={<OperatingCosts />} />
            <Route path="finances" element={<Finances />} />
            <Route path="orders" element={<Orders />} />
          </Route>

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
