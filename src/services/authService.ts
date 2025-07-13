import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    User as FirebaseUser
} from 'firebase/auth';
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    serverTimestamp
} from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AdminUser, User } from '../types';

// Service d'authentification admin
export class AuthService {
    // Connexion admin
    static async signInAdmin(email: string, password: string): Promise<AdminUser | null> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Vérifier si l'utilisateur est admin dans Firestore
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));

            if (!adminDoc.exists()) {
                throw new Error('Accès non autorisé. Compte administrateur requis.');
            }

            const adminData = adminDoc.data() as AdminUser;

            // Mettre à jour la dernière connexion
            await updateDoc(doc(db, 'admins', user.uid), {
                lastLogin: serverTimestamp()
            });

            return adminData;
        } catch (error: any) {
            console.error('Erreur de connexion:', error);
            throw new Error(error.message || 'Erreur lors de la connexion');
        }
    }

    // Création d'un compte admin (à utiliser une seule fois)
    static async createAdmin(email: string, password: string, displayName: string): Promise<AdminUser> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const adminData: AdminUser = {
                id: user.uid,
                email: user.email!,
                displayName,
                role: 'admin',
                createdAt: new Date(),
                lastLogin: new Date()
            };

            // Sauvegarder dans Firestore
            await setDoc(doc(db, 'admins', user.uid), {
                ...adminData,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });

            return adminData;
        } catch (error: any) {
            console.error('Erreur de création admin:', error);
            throw new Error(error.message || 'Erreur lors de la création du compte');
        }
    }

    // Connexion intelligente qui détecte le type de compte
    static async signInSmart(email: string, password: string): Promise<{ user: AdminUser | User, type: 'admin' | 'client' }> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            // Vérifier d'abord si c'est un admin
            const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));

            if (adminDoc.exists()) {
                const adminData = adminDoc.data() as AdminUser;

                // Mettre à jour la dernière connexion admin
                await updateDoc(doc(db, 'admins', firebaseUser.uid), {
                    lastLogin: serverTimestamp()
                });

                return { user: adminData, type: 'admin' };
            }

            // Sinon, vérifier si c'est un utilisateur normal
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data() as User;

                // Mettre à jour la dernière connexion utilisateur
                await updateDoc(doc(db, 'users', firebaseUser.uid), {
                    lastLogin: serverTimestamp()
                });

                return { user: userData, type: 'client' };
            }

            // Si l'utilisateur n'existe dans aucune collection, créer un compte client
            const newUser: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || email.split('@')[0],
                role: 'client',
                createdAt: new Date()
            };

            await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...newUser,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });

            return { user: newUser, type: 'client' };

        } catch (error: any) {
            console.error('Erreur de connexion:', error);
            throw new Error(error.message || 'Erreur lors de la connexion');
        }
    }

    // Inscription d'un nouvel utilisateur client
    static async signUpUser(email: string, password: string, displayName: string): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            const userData: User = {
                id: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName,
                role: 'client',
                createdAt: new Date()
            };

            // Sauvegarder dans Firestore
            await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...userData,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            });

            return userData;
        } catch (error: any) {
            console.error('Erreur inscription utilisateur:', error);
            throw new Error(error.message || 'Erreur lors de l\'inscription');
        }
    }

    // Déconnexion
    static async signOut(): Promise<void> {
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error('Erreur de déconnexion:', error);
            throw new Error('Erreur lors de la déconnexion');
        }
    }

    // Écouter les changements d'authentification
    static onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
        return onAuthStateChanged(auth, callback);
    }

    // Vérifier si l'utilisateur connecté est admin
    static async isAdmin(user: FirebaseUser): Promise<boolean> {
        try {
            const adminDoc = await getDoc(doc(db, 'admins', user.uid));
            return adminDoc.exists();
        } catch (error) {
            console.error('Erreur vérification admin:', error);
            return false;
        }
    }

    // Récupérer les données utilisateur sans mot de passe (pour le state management)
    static async getUserData(firebaseUser: FirebaseUser): Promise<{ user: AdminUser | User, type: 'admin' | 'client' } | null> {
        try {
            // Vérifier d'abord si c'est un admin
            const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));

            if (adminDoc.exists()) {
                const adminData = adminDoc.data() as AdminUser;
                return { user: adminData, type: 'admin' };
            }

            // Sinon, vérifier si c'est un utilisateur normal
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data() as User;
                return { user: userData, type: 'client' };
            }

            return null;
        } catch (error: any) {
            console.error('Erreur récupération données utilisateur:', error);
            return null;
        }
    }
}
