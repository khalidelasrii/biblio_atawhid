import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import Home from './pages/Home';
import { Products } from './pages/Products';
import { Contact } from './pages/Contact';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">À propos</h1><p className="mt-4">Page en construction...</p></div>} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<div className="container mx-auto px-4 py-12"><h1 className="text-3xl font-bold">Services</h1><p className="mt-4">Page en construction...</p></div>} />
          </Routes>
        </main>
        <Footer />
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;