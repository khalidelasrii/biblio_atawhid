# Configuration Firebase

## Sécurité des clés Firebase

Ce projet utilise des variables d'environnement pour sécuriser les clés de configuration Firebase.

### Configuration

1. **Copiez le fichier d'exemple** :
   ```bash
   cp .env.example .env
   ```

2. **Remplissez le fichier `.env`** avec vos vraies clés Firebase :
   ```
   VITE_FIREBASE_API_KEY=your_actual_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_actual_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_actual_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_actual_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_actual_app_id
   ```

### Sécurité

- ✅ Le fichier `.env` est exclu du contrôle de version via `.gitignore`
- ✅ Les clés ne sont plus exposées dans le code source
- ✅ Utilisation du préfixe `VITE_` pour Vite.js
- ✅ Fichier `.env.example` fourni pour la documentation

### Variables d'environnement

Vite.js nécessite le préfixe `VITE_` pour exposer les variables d'environnement côté client. Ces variables sont accessibles via `import.meta.env.VARIABLE_NAME`.

### Production

Pour le déploiement en production, configurez ces variables d'environnement sur votre plateforme d'hébergement (Vercel, Netlify, etc.).

## Obtenir vos clés Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez votre projet
3. Allez dans **Project Settings** > **General**
4. Dans la section **Your apps**, cliquez sur l'icône Web
5. Copiez la configuration depuis l'objet `firebaseConfig`
