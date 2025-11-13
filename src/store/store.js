// store.js - Configuration du Redux Store
// Le store = l'endroit centralisé où on stocke TOUT l'état global de l'app

import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from './slices/tasksSlice';

// configureStore : Fonction de Redux Toolkit pour créer le store
// Plus simple que l'ancienne méthode createStore
const store = configureStore({
  reducer: {
    // tasks : nom du "slice" (morceau d'état)
    // tasksReducer : fonction qui gère les modifications de cet état
    // On accède à cet état avec : useSelector(state => state.tasks)
    tasks: tasksReducer,
  },
  
  // middleware : fonctions qui interceptent les actions avant qu'elles arrivent au reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // On désactive ces vérifications pour éviter les warnings avec AsyncStorage
      serializableCheck: {
        ignoredActions: ['tasks/loadTasks/fulfilled', 'tasks/fetchTasks/fulfilled'],
      },
    }),
});

export default store;