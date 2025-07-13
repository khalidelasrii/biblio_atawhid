import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { AuthService } from '../services/authService';
import { AdminUser, User } from '../types';

interface AuthContextType {
    firebaseUser: FirebaseUser | null;
    currentUser: AdminUser | User | null;
    userType: 'admin' | 'client' | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, displayName: string) => Promise<void>;
    signOut: () => Promise<void>;
    isAdmin: boolean;
    isClient: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [currentUser, setCurrentUser] = useState<AdminUser | User | null>(null);
    const [userType, setUserType] = useState<'admin' | 'client' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = AuthService.onAuthStateChanged(async (fbUser) => {
            console.log('Auth state changed:', fbUser?.uid);
            setFirebaseUser(fbUser);

            if (fbUser) {
                // Récupérer les données utilisateur
                try {
                    console.log('Récupération des données pour:', fbUser.uid);
                    const result = await AuthService.getUserData(fbUser);
                    console.log('Résultat getUserData:', result);

                    if (result) {
                        setCurrentUser(result.user);
                        setUserType(result.type);
                        console.log('Utilisateur défini:', result.user, 'Type:', result.type);
                    } else {
                        setCurrentUser(null);
                        setUserType(null);
                        console.log('Aucune donnée utilisateur trouvée');
                    }
                } catch (error) {
                    console.error('Erreur récupération données utilisateur:', error);
                    setCurrentUser(null);
                    setUserType(null);
                }
            } else {
                setCurrentUser(null);
                setUserType(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const result = await AuthService.signInSmart(email, password);
            setCurrentUser(result.user);
            setUserType(result.type);
        } catch (error) {
            setCurrentUser(null);
            setUserType(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, displayName: string) => {
        setLoading(true);
        try {
            const userData = await AuthService.signUpUser(email, password, displayName);
            setCurrentUser(userData);
            setUserType('client');
        } catch (error) {
            setCurrentUser(null);
            setUserType(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await AuthService.signOut();
            setFirebaseUser(null);
            setCurrentUser(null);
            setUserType(null);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value: AuthContextType = {
        firebaseUser,
        currentUser,
        userType,
        loading,
        signIn,
        signUp,
        signOut,
        isAdmin: userType === 'admin' || (firebaseUser?.uid === 'KmhMdZ9rbqTVGnqv6Cihyc0fVLU2'), // Force admin pour votre ID
        isClient: userType === 'client'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
