import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import { Products } from './pages/Products';
import { Contact } from './pages/Contact';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Routes>
              {/* Routes publiques avec layout */}
              <Route path="/" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Home />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/products" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Products />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Contact />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/checkout" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <Checkout />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/order-success" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <OrderSuccess />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <div className="container mx-auto px-4 py-12">
                      <h1 className="text-3xl font-bold">À propos</h1>
                      <p className="mt-4">Page en construction...</p>
                    </div>
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/services" element={
                <>
                  <Header />
                  <main className="flex-1">
                    <div className="container mx-auto px-4 py-12">
                      <h1 className="text-3xl font-bold">Services</h1>
                      <p className="mt-4">Page en construction...</p>
                    </div>
                  </main>
                  <Footer />
                </>
              } />

              {/* Routes admin sans layout principal */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;