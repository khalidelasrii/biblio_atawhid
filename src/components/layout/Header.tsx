import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="bg-white shadow-sm border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-bold text-gray-900">
                            <span className="text-orange-500">Librairie</span> Al-Tawhid
                        </Link>
                    </div>

                    {/* Navigation Desktop */}
                    <nav className="hidden md:flex space-x-8">
                        <Link
                            to="/"
                            className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                        >
                            Accueil
                        </Link>
                        <Link
                            to="/products"
                            className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                        >
                            Produits
                        </Link>
                        <Link
                            to="/services"
                            className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                        >
                            Services
                        </Link>
                        <Link
                            to="/about"
                            className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                        >
                            À propos
                        </Link>
                        <Link
                            to="/contact"
                            className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
                        >
                            Contact
                        </Link>
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        <Search className="w-6 h-6 text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />
                            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                0
                            </span>
                        </div>
                        <User className="w-6 h-6 text-gray-600 hover:text-orange-500 cursor-pointer transition-colors" />

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden"
                            onClick={toggleMobileMenu}
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6 text-gray-600" />
                            ) : (
                                <Menu className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                                onClick={toggleMobileMenu}
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/products"
                                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                                onClick={toggleMobileMenu}
                            >
                                Produits
                            </Link>
                            <Link
                                to="/services"
                                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                                onClick={toggleMobileMenu}
                            >
                                Services
                            </Link>
                            <Link
                                to="/about"
                                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                                onClick={toggleMobileMenu}
                            >
                                À propos
                            </Link>
                            <Link
                                to="/contact"
                                className="block px-3 py-2 text-gray-700 hover:text-orange-500 transition-colors font-medium"
                                onClick={toggleMobileMenu}
                            >
                                Contact
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;