# 📝 GestionTache-Pro

Une application mobile de gestion de tâches développée avec React Native et Expo.

## 🎯 Fonctionnalités

- ✅ Créer, modifier et supprimer des tâches
- 📋 Lister toutes les tâches
- 🔍 Voir les détails d'une tâche
- ✔️ Marquer une tâche comme terminée/non terminée
- 🔥 Définir la priorité (Haute/Basse)
- 🔄 Actualiser la liste (Pull to refresh)
- 💾 Persistance des données avec AsyncStorage
- 🌐 Synchronisation avec une API REST (JSONPlaceholder)

## 🛠️ Technologies utilisées

- **React Native** 0.81.5 - Framework mobile
- **Expo** SDK 54 - Plateforme de développement
- **Redux Toolkit** - Gestion d'état globale
- **React Navigation** - Navigation entre écrans
- **Axios** - Requêtes HTTP
- **AsyncStorage** - Stockage local

## 📱 Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Expo Go sur votre téléphone (iOS/Android)
- Expo CLI : `npm install -g expo-cli`

## 🚀 Installation

1. **Cloner le projet**
```bash
git clone https://github.com/laminenidiallo-svg/GestionTache-pro.git
cd GestionTache-pro
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer l'application**
```bash
npx expo start
```

4. **Scanner le QR code**
   - iOS : Utilisez l'app Appareil photo
   - Android : Utilisez l'app Expo Go

## 📂 Structure du projet

```
GestionTache-pro/
├── src/
│   ├── api/
│   │   └── taskApi.js           # Appels API
│   ├── navigation/
│   │   └── AppNavigator.js      # Configuration navigation
│   ├── screens/
│   │   ├── TaskListScreen.js    # Liste des tâches
│   │   ├── TaskFormScreen.js    # Formulaire ajout/modification
│   │   └── TaskDetailScreen.js  # Détails d'une tâche
│   └── store/
│       ├── store.js             # Configuration Redux
│       └── slices/
│           └── tasksSlice.js    # Logique métier des tâches
├── App.js                       # Point d'entrée
├── app.json                     # Configuration Expo
├── package.json                 # Dépendances
└── README.md                    # Documentation
```

## 🎨 Captures d'écran

### Liste des tâches
- Affichage de toutes les tâches
- Badge de priorité (Haute/Basse)
- Statut (Terminé/En cours)
- Bouton flottant pour ajouter une tâche

### Formulaire
- Titre de la tâche
- Description (optionnelle)
- Sélection de priorité

### Détails
- Informations complètes de la tâche
- Actions : Modifier, Supprimer, Marquer comme terminé


## 📦 Dépendances principales

```json
{
  "expo": "~54.0.0",
  "react": "19.1.0",
  "react-native": "0.81.5",
  "react-redux": "^9.1.2",
  "@reduxjs/toolkit": "^2.2.7",
  "@react-navigation/native": "^6.1.18",
  "@react-navigation/native-stack": "^6.11.0",
  "@react-native-async-storage/async-storage": "2.2.0",
  "axios": "^1.7.7"
}
```

## 🌐 API utilisée

L'application utilise [JSONPlaceholder](https://jsonplaceholder.typicode.com/) pour simuler une API REST :
- `GET /todos` - Récupérer les tâches
- `POST /todos` - Créer une tâche (simulation)
- `PUT /todos/:id` - Modifier une tâche (simulation)
- `DELETE /todos/:id` - Supprimer une tâche (simulation)

## 💾 Stockage local

Les tâches sont également sauvegardées localement avec AsyncStorage pour :
- Fonctionner hors ligne
- Persister les données entre les sessions
- Améliorer les performances

## 👨‍💻 Auteur

**Mamadou Lamine Diallo**
- GitHub: [@laminenidiallo-svg](https://github.com/laminenidiallo-svg)

## 🙏 Remerciements

- [Expo](https://expo.dev/) pour la plateforme de développement
- [Redux Toolkit](https://redux-toolkit.js.org/) pour la gestion d'état simplifiée
- [React Navigation](https://reactnavigation.org/) pour la navigation
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) pour l'API de test

---

