// Script Node.js pour créer un administrateur
// Ce script peut être exécuté directement avec Node.js

const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

// Configuration Firebase (remplacez par votre vraie config)
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
};

// Initialisez Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const createAdmin = async () => {
    try {
        console.log('🚀 Création du compte administrateur...');

        // Informations de l'administrateur
        const email = 'khalid@atawhid.ma';
        const password = 'admin123';
        const displayName = 'Administrateur Biblio Al-Tawhid';

        // Créer l'utilisateur dans Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Créer le document admin dans Firestore
        await setDoc(doc(db, 'admins', user.uid), {
            id: user.uid,
            email: email,
            displayName: displayName,
            role: 'admin',
            createdAt: new Date(),
            permissions: {
                products: true,
                orders: true,
                messages: true,
                users: true
            }
        });

        console.log('✅ Compte administrateur créé avec succès !');
        console.log('📧 Email:', email);
        console.log('👤 Nom:', displayName);
        console.log('🆔 ID:', user.uid);
        console.log('\n🎉 Vous pouvez maintenant vous connecter à /admin/login');

        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur lors de la création du compte admin:', error.message);

        if (error.code === 'auth/email-already-in-use') {
            console.log('✅ Ce compte existe déjà. Vous pouvez vous connecter directement.');
        }

        process.exit(1);
    }
};

createAdmin();
