import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false
}) => {
    const { currentUser, isAdmin, loading } = useAuth();

    // Afficher un loader pendant la vérification
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    // Si admin requis et pas d'utilisateur connecté
    if (requireAdmin && !currentUser) {
        return <Navigate to="/admin/login" replace />;
    }

    // Si admin requis et utilisateur connecté mais pas admin
    if (requireAdmin && currentUser && !isAdmin) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
