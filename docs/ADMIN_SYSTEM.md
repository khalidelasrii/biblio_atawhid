# Système d'Administration - Biblio Al-Tawhid

## 🚀 Fonctionnalités Administrateur

### ✅ Ce qui a été intégré :

1. **🔐 Authentification Admin**
   - Connexion sécurisée avec email/mot de passe
   - Vérification des permissions administrateur
   - Session persistante

2. **📦 Gestion des Produits**
   - Ajout de nouveaux produits
   - Modification des produits existants
   - Activation/désactivation des produits
   - Gestion du stock et des prix

3. **💬 Gestion des Messages**
   - Réception des messages de contact
   - Marquage comme lu/non lu
   - Interface de gestion centralisée

4. **📊 Tableau de Bord**
   - Statistiques en temps réel
   - Vue d'ensemble des activités
   - Actions rapides

## 🛠️ Configuration Initiale

### 1. Créer le premier compte administrateur

Modifiez le fichier `src/scripts/createAdmin.ts` avec vos informations :

```typescript
const email = 'votre-email@exemple.com';
const password = 'VotreMotDePasseSecurise123!';
const displayName = 'Votre Nom';
```

Puis, dans la console de votre navigateur (F12), exécutez :

```javascript
// Copiez et collez le contenu du script createAdmin.ts
// et décommentez la ligne createInitialAdmin();
```

### 2. Structure Firestore

Le système crée automatiquement ces collections :

```
📁 Firestore Database
├── 📂 admins/          # Comptes administrateurs
│   └── {userId}
├── 📂 products/        # Produits du catalogue
│   └── {productId}
└── 📂 messages/        # Messages de contact
    └── {messageId}
```

## 🔑 Accès Administrateur

### URL de connexion : `/admin/login`

**Exemple d'utilisation :**
```
https://votre-site.com/admin/login
```

### Après connexion : `/admin/dashboard`

## 📱 Utilisation

### Pour les Clients :
1. **Page Contact** : Les messages sont automatiquement envoyés à Firestore
2. **Catalogue** : Affichage des produits actifs seulement

### Pour l'Administrateur :
1. **Connexion** : `/admin/login`
2. **Dashboard** : Vue d'ensemble + statistiques
3. **Gestion Produits** : Ajout/modification/suppression
4. **Messages** : Lecture et gestion des demandes clients

## 🔧 Structure Technique

### Services créés :
- `AuthService` : Gestion authentification admin
- `ProductService` : CRUD produits
- `MessageService` : Gestion messages contact

### Composants créés :
- `AdminLogin` : Page de connexion
- `AdminDashboard` : Interface d'administration
- `ProtectedRoute` : Protection des routes admin
- `AuthContext` : Contexte d'authentification global

### Types ajoutés :
- `AdminUser` : Données administrateur
- `Message` : Messages de contact
- `Product` : Structure produit complète

## 🚀 Déploiement

```bash
# 1. Build du projet
npm run build

# 2. Déploiement Firebase
firebase deploy --only hosting

# 3. Configuration Firestore Rules (recommandée)
firebase deploy --only firestore:rules
```

## 🔒 Sécurité

### Recommandations :
1. **Mots de passe forts** pour les comptes admin
2. **Rules Firestore** pour sécuriser l'accès aux données
3. **HTTPS uniquement** en production
4. **Backup régulier** des données Firestore

### Rules Firestore suggérées :
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Seuls les admins peuvent lire/écrire
    match /admins/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Produits : lecture publique, écriture admin
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Messages : écriture publique (contact), lecture admin
    match /messages/{messageId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

## 🎯 Prochaines Étapes

### Extensions possibles :
1. **📊 Analytics** : Statistiques détaillées
2. **🛒 Commandes** : Système de commandes en ligne
3. **👥 Gestion Clients** : Base de données clients
4. **📧 Notifications** : Emails automatiques
5. **📸 Upload Images** : Gestion des photos produits
6. **🏷️ Catégories** : Système de catégorisation avancé

## 💡 Support

Pour toute question ou amélioration, le système est conçu pour être facilement extensible. Chaque service est modulaire et peut être étendu selon vos besoins spécifiques.
