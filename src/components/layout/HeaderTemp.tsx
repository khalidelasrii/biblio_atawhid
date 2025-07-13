import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, Settings, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import LoginPopup from '../LoginPopup';
import CartDrawer from '../CartDrawer';
import toast from 'react-hot-toast';

export const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { currentUser, isAdmin, signOut } = useAuth();
    const { getCartItemsCount } = useCart();
    const navigate = useNavigate();
    const userMenuRef = useRef<HTMLDivElement>(null);

    // Fermer le menu utilisateur quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setShowUserMenu(false);
            }
        };

        if (showUserMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showUserMenu]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleUserIconClick = () => {
        if (currentUser) {
            setShowUserMenu(!showUserMenu);
        } else {
            setIsLoginPopupOpen(true);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            setShowUserMenu(false);
            setIsMobileMenuOpen(false);
            toast.success('Déconnexion réussie');
        } catch (error: any) {
            toast.error('Erreur lors de la déconnexion');
        }
    };

    const handleAdminDashboard = () => {
        navigate('/admin/dashboard');
        setShowUserMenu(false);
        setIsMobileMenuOpen(false);
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

                        {/* Cart */}
                        <div className="relative">
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative text-gray-600 hover:text-orange-500 cursor-pointer transition-colors"
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {getCartItemsCount() > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {getCartItemsCount()}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={userMenuRef}>
                            <button
                                onClick={handleUserIconClick}
                                className="flex items-center space-x-1 text-gray-600 hover:text-orange-500 transition-colors"
                            >
                                <User className="w-6 h-6" />
                                {currentUser && (
                                    <span className="hidden md:block text-sm font-medium">
                                        {currentUser.displayName}
                                    </span>
                                )}
                                {isAdmin && (
                                    <Shield className="w-4 h-4 text-orange-500" />
                                )}
                            </button>

                            {/* User Dropdown Menu */}
                            {showUserMenu && currentUser && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                                    <div className="py-1">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">{currentUser.displayName}</p>
                                            <p className="text-xs text-gray-500">{currentUser.email}</p>
                                            {isAdmin && (
                                                <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full mt-1">
                                                    <Shield className="w-3 h-3 mr-1" />
                                                    Administrateur
                                                </span>
                                            )}
                                        </div>

                                        {isAdmin && (
                                            <button
                                                onClick={handleAdminDashboard}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Dashboard Admin
                                            </button>
                                        )}

                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

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
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
                            <Link
                                to="/"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Accueil
                            </Link>
                            <Link
                                to="/products"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Produits
                            </Link>
                            <Link
                                to="/services"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Services
                            </Link>
                            <Link
                                to="/about"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                À propos
                            </Link>
                            <Link
                                to="/contact"
                                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-100 rounded-md"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                Contact
                            </Link>

                            {currentUser && (
                                <div className="border-t border-gray-200 pt-4 pb-3">
                                    <div className="flex items-center px-3">
                                        <div className="flex-shrink-0">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium text-gray-800">{currentUser.displayName}</div>
                                            <div className="text-sm font-medium text-gray-500">{currentUser.email}</div>
                                        </div>
                                        {isAdmin && (
                                            <Shield className="w-4 h-4 text-orange-500 ml-2" />
                                        )}
                                    </div>
                                    <div className="mt-3 space-y-1 px-2">
                                        {isAdmin && (
                                            <button
                                                onClick={handleAdminDashboard}
                                                className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-gray-100 rounded-md"
                                            >
                                                <Settings className="w-4 h-4 mr-2" />
                                                Dashboard Admin
                                            </button>
                                        )}
                                        <button
                                            onClick={handleSignOut}
                                            className="flex items-center w-full px-3 py-2 text-base font-medium text-gray-600 hover:text-orange-500 hover:bg-gray-100 rounded-md"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Se déconnecter
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Login Popup */}
            <LoginPopup
                isOpen={isLoginPopupOpen}
                onClose={() => setIsLoginPopupOpen(false)}
            />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
        </header>
    );
};
