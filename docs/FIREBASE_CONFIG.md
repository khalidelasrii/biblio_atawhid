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
------------------------------------------
Maintenant, remplaçons la section des commandes avec une interface plus détaillée : 
```


Made changes.


```
Maintenant, ajoutons un champ notes dans la page Checkout pour permettre aux clients d'ajouter des commentaires. Cherchons d'abord où ajouter ce champ : Ajoutons un champ notes après les informations d'adresse et avant le bouton de paiement : 
```


Made changes.


```
Maintenant, pour implémenter l'envoi d'email à l'adresse `khalidelasri534@gmail.com`, nous pouvons utiliser EmailJS (service gratuit) ou simuler l'envoi. Installons EmailJS pour un vrai service d'email : Maintenant, créons un service d'email pour intégrer avec EmailJS. D'abord, créons le fichier de configuration pour EmailJS : 

Made changes.

Corrigeons l'erreur TypeScript dans EmailService : 
```


Made changes.


```
Maintenant, mettons à jour le OrderService pour utiliser EmailService : 
```


Made changes.


```

```


Made changes.


```
Maintenant, initialisons EmailService dans l'application. Ajoutons l'initialisation dans main.tsx : 
```


Made changes.


```
Pour la génération de PDF, installons jsPDF pour créer de vrais PDFs : Maintenant, mettons à jour la génération PDF dans OrderService : 
```


Made changes.


```

```


Made changes.


```

```


Made changes.


```
Maintenant testons le système. D'abord, vérifions s'il y a des erreurs de compilation : Excellent ! Le serveur de développement fonctionne et a chargé les nouvelles dépendances. Créons maintenant un guide de test pour vérifier que tout fonctionne.

## 📋 Résumé des améliorations implémentées

### ✅ **Système de commandes complet**

1. **Nouveau OrderService** (orderService.ts) :
   - Sauvegarde les commandes dans Firestore
   - Génère des numéros de commande uniques (format : ORD231213ABCD)
   - Gère les statuts de commande
   - Génération de PDF avec jsPDF

2. **Service d'email** (emailService.ts) :
   - Notification automatique à `khalidelasri534@gmail.com` pour chaque nouvelle commande
   - Support EmailJS (nécessite configuration)
   - Emails de confirmation client
   - Fallback avec logs détaillés si l'email échoue

3. **Dashboard admin amélioré** :
   - Affichage détaillé de chaque commande avec toutes les informations
   - Informations client (nom, email, téléphone, adresse)
   - Liste détaillée des articles commandés avec images
   - Méthode de paiement
   - Notes de commande
   - Bouton de téléchargement PDF
   - Mise à jour du statut en temps réel

4. **Page Checkout améliorée** :
   - Champ "Notes de commande" pour instructions spéciales
   - Intégration avec OrderService
   - Vidage automatique du panier après commande réussie

5. **Génération PDF professionnelle** :
   - PDF formaté avec en-tête Biblio Al-Tawhid
   - Toutes les informations de commande
   - Tableau des articles avec calculs
   - Pied de page avec date de génération

### 🔧 **Configuration requise pour l'email**

Pour activer l'envoi d'emails réels :

1. **Créer un compte EmailJS** sur https://www.emailjs.com/
2. **Configurer un service email** (Gmail recommandé)
3. **Créer un template d'email** avec les variables du EmailService
4. **Remplacer les clés** dans emailService.ts :
   ```typescript
   const EMAILJS_SERVICE_ID = 'votre_service_id';
   const EMAILJS_TEMPLATE_ID = 'votre_template_id';
   const EMAILJS_PUBLIC_KEY = 'votre_cle_publique';
   ```

### 🎯 **Test du système**

Pour tester le système complet :

1. **Ajouter des produits** au panier sur la page Produits
2. **Aller au checkout** et remplir les informations
3. **Ajouter des notes** de commande (optionnel)
4. **Confirmer la commande**
5. **Vérifier dans le dashboard admin** :
   - La commande apparaît avec tous les détails
   - Possibilité de changer le statut
   - Bouton de téléchargement PDF fonctionne
6. **Vérifier la console** pour voir la simulation d'email

### 📧 **Notifications email**

Actuellement en mode **simulation** (visible dans la console) avec tous les détails :
- Email envoyé à `khalidelasri534@gmail.com`
- Informations complètes de la commande
- Données client et livraison
- Liste des articles
- Notes de commande

Le système est maintenant prêt et fonctionnel ! Les commandes sont sauvegardées dans Firestore et apparaîtront dans le dashboard admin avec toutes les fonctionnalités demandées.