// Script pour créer manuellement l'admin
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const firebaseConfig = {
    // Votre config Firebase ici
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const createAdminAccount = async () => {
    try {
        // Créer le compte Firebase Auth (si pas déjà fait)
        const adminEmail = 'khalid@atawhid.ma';
        const adminPassword = 'votre_mot_de_passe'; // Remplacez par votre mot de passe
        let userId = 'KmhMdZ9rbqTVGnqv6Cihyc0fVLU2'; // Votre ID existant
        // Créer le document admin dans Firestore
        const adminData = {
            id: userId,
            email: adminEmail,
            displayName: 'Administrateur Biblio Al-Tawhid',
            role: 'admin',
            createdAt: serverTimestamp(),
            lastLogin: serverTimestamp()
        };

        await setDoc(doc(db, 'admins', userId), adminData);
        console.log('Admin créé avec succès!');

    } catch (error) {
        console.error('Erreur création admin:', error);
    }
};

createAdminAccount();
