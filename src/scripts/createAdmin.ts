import { AuthService } from '../services/authService';

// Script pour créer le premier compte administrateur
// Exécutez ce script une fois pour créer votre compte admin

const createInitialAdmin = async () => {
    try {
        console.log('Création du compte administrateur...');

        // Remplacez ces valeurs par vos vraies informations
        const email = 'admin@biblioatawhid.com'; // Votre email admin
        const password = 'VotreMotDePasseSecurise123!'; // Votre mot de passe sécurisé
        const displayName = 'Administrateur Biblio Al-Tawhid';

        const adminUser = await AuthService.createAdmin(email, password, displayName);

        console.log('Compte administrateur créé avec succès !');
        console.log('Email:', adminUser.email);
        console.log('Nom:', adminUser.displayName);
        console.log('ID:', adminUser.id);

        console.log('\n🎉 Vous pouvez maintenant vous connecter à /admin/login');
        console.log('Email:', email);
        console.log('Mot de passe:', password);

    } catch (error: any) {
        console.error('❌ Erreur lors de la création du compte admin:', error.message);

        if (error.message.includes('email-already-in-use')) {
            console.log('✅ Ce compte existe déjà. Vous pouvez vous connecter directement.');
        }
    }
};

// Décommentez la ligne suivante et exécutez ce script pour créer votre admin
// createInitialAdmin();

export { createInitialAdmin };
