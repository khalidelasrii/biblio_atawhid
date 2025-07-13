import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Script de débogage pour vérifier et forcer la mise à jour admin
export const debugAdminStatus = async () => {
    try {
        // Se connecter avec le compte admin
        const userCredential = await signInWithEmailAndPassword(auth, 'khalid@atawhid.ma', 'votre_mot_de_passe');
        const user = userCredential.user;

        console.log('Utilisateur connecté:', user.uid);

        // Vérifier le document admin
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        console.log('Document admin existe:', adminDoc.exists());

        if (adminDoc.exists()) {
            console.log('Données admin:', adminDoc.data());
        } else {
            console.log('Document admin n\'existe pas, création...');

            // Créer le document admin
            const adminData = {
                id: user.uid,
                email: user.email,
                displayName: 'Administrateur Biblio Al-Tawhid',
                role: 'admin',
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
            };

            await setDoc(doc(db, 'admins', user.uid), adminData);
            console.log('Document admin créé:', adminData);
        }

        // Vérifier si l'utilisateur existe aussi dans la collection users (à supprimer si oui)
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
            console.log('Attention: L\'utilisateur existe aussi dans la collection users:', userDoc.data());
            console.log('Vous devriez supprimer ce document pour éviter les conflits');
        }

    } catch (error) {
        console.error('Erreur de débogage:', error);
    }
};

// Pour exécuter le script depuis la console du navigateur
(window as any).debugAdminStatus = debugAdminStatus;
