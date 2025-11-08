// App.js - Point d'entrée de l'application
// Ce fichier configure les éléments globaux : Redux, Navigation, etc.

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import store from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { loadTasks } from './src/store/slices/tasksSlice';

export default function App() {
  
  // useEffect : Se déclenche UNE FOIS au démarrage de l'app
  // [] = dependency array vide = exécute seulement au montage
  useEffect(() => {
    // Charger les tâches sauvegardées localement (AsyncStorage)
    store.dispatch(loadTasks());
  }, []);

  return (
    // Provider : Donne accès au Redux store à TOUTE l'application
    // Sans ça, impossible d'utiliser useSelector ou useDispatch
    <Provider store={store}>
      
      {/* NavigationContainer : Nécessaire pour React Navigation */}
      {/* Gère l'état de navigation (quel écran est affiché) */}
      <NavigationContainer>
        
        {/* StatusBar : Barre en haut (heure, batterie, etc.) */}
        <StatusBar style="auto" />
        
        {/* AppNavigator : Notre configuration personnalisée de navigation */}
        <AppNavigator />
        
      </NavigationContainer>
    </Provider>
  );
}