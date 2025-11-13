// TaskListScreen.js - Écran principal qui affiche la liste des tâches
// C'est le premier écran que l'utilisateur voit au démarrage

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTasksFromAPI, toggleTaskStatus, loadTasksFromStorage } from '../store/slices/tasksSlice';

export default function TaskListScreen({ navigation }) {
  const dispatch = useDispatch();
  
  // Récupérer les données depuis Redux
  // useSelector permet de lire les données du store Redux
  const { items, loading, error } = useSelector((state) => state.tasks);
  
  // État local pour le "pull to refresh" (tirer vers le bas pour actualiser)
  const [refreshing, setRefreshing] = useState(false);
  
  // useEffect : s'exécute au montage du composant (quand l'écran apparaît)
  useEffect(() => {
    // Charger d'abord depuis AsyncStorage (rapide)
    dispatch(loadTasksFromStorage()).then(() => {
      // Puis synchroniser avec l'API (en arrière-plan)
      dispatch(fetchTasksFromAPI());
    });
  }, [dispatch]);
  
  // Afficher les erreurs dans une popup
  useEffect(() => {
    if (error) {
      Alert.alert('Erreur', error);
    }
  }, [error]);
  
  // Fonction pour rafraîchir la liste (pull to refresh)
  const onRefresh = async () => {
    setRefreshing(true); // Afficher le spinner de refresh
    await dispatch(fetchTasksFromAPI()); // Recharger depuis l'API
    setRefreshing(false); // Cacher le spinner
  };
  
  // Marquer une tâche comme terminée ou non terminée
  const handleToggle = (taskId) => {
    dispatch(toggleTaskStatus(taskId));
  };
  
  // Naviguer vers l'écran de détails
  const handleTaskPress = (task) => {
    navigation.navigate('TaskDetail', { task });
  };
  
  // Fonction qui affiche UNE tâche dans la liste
  // FlatList va appeler cette fonction pour chaque tâche
  const renderTask = ({ item }) => (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => handleTaskPress(item)}
      activeOpacity={0.7} // Opacité quand on appuie (feedback visuel)
    >
      <View style={styles.taskContent}>
        {/* Checkbox pour marquer comme terminé */}
        <TouchableOpacity
          onPress={() => handleToggle(item.id)}
          style={styles.checkbox}
        >
          <View style={[
            styles.checkboxInner,
            item.completed && styles.checkboxChecked // Style différent si terminé
          ]}>
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>
        
        {/* Informations de la tâche */}
        <View style={styles.taskInfo}>
          <Text
            style={[
              styles.taskTitle,
              item.completed && styles.taskTitleCompleted // Barré si terminé
            ]}
            numberOfLines={2} // Max 2 lignes
          >
            {item.title}
          </Text>
          
          {/* Badges (priorité + statut) */}
          <View style={styles.badges}>
            <View style={[
              styles.priorityBadge,
              item.priority === 'high' ? styles.priorityHigh : styles.priorityLow
            ]}>
              <Text style={styles.priorityText}>
                {item.priority === 'high' ? '🔥 Haute' : '📋 Basse'}
              </Text>
            </View>
            
            {item.completed && (
              <View style={styles.completedBadge}>
                <Text style={styles.completedText}>✅ Terminé</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Flèche pour indiquer que c'est cliquable */}
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
  
  // Affichage quand il n'y a aucune tâche
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>📝</Text>
      <Text style={styles.emptyTitle}>Aucune tâche</Text>
      <Text style={styles.emptySubtitle}>
        Appuyez sur + pour créer votre première tâche
      </Text>
    </View>
  );
  
  return (
    <View style={styles.container}>
      {/* Si en cours de chargement ET aucune tâche, afficher le loader */}
      {loading && items.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Chargement des tâches...</Text>
        </View>
      ) : (
        <>
          {/* FlatList : Liste optimisée pour afficher beaucoup d'éléments */}
          <FlatList
            data={items} // Données à afficher
            renderItem={renderTask} // Fonction pour afficher chaque item
            keyExtractor={(item) => item.id.toString()} // ID unique pour chaque item
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={renderEmpty} // Quoi afficher si liste vide
            refreshControl={
              // Pull to refresh (tirer vers le bas)
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#6366f1']} // Couleur du spinner
              />
            }
          />
          
          {/* Bouton flottant pour ajouter une tâche (FAB = Floating Action Button) */}
          <TouchableOpacity
            style={styles.fab}
            onPress={() => navigation.navigate('TaskForm')}
            activeOpacity={0.8}
          >
            <Text style={styles.fabIcon}>+</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

// Styles de l'écran
const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l'espace disponible
    backgroundColor: '#f5f5f5', // Fond gris clair
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', // Centré verticalement
    alignItems: 'center', // Centré horizontalement
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    padding: 16,
    flexGrow: 1, // Permet au contenu de grandir
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12, // Coins arrondis
    padding: 16,
    marginBottom: 12,
    // Ombre pour Android
    elevation: 3,
    // Ombre pour iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskContent: {
    flexDirection: 'row', // Éléments côte à côte (horizontalement)
    alignItems: 'center',
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12, // Rond
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981', // Vert
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskInfo: {
    flex: 1, // Prend tout l'espace disponible
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through', // Texte barré
    color: '#9ca3af', // Gris
  },
  badges: {
    flexDirection: 'row',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8, // Espace entre les badges
  },
  priorityHigh: {
    backgroundColor: '#fee2e2', // Rouge clair
  },
  priorityLow: {
    backgroundColor: '#dbeafe', // Bleu clair
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  completedBadge: {
    backgroundColor: '#d1fae5', // Vert clair
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  completedText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#065f46', // Vert foncé
  },
  arrow: {
    fontSize: 24,
    color: '#d1d5db',
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 64, // Emoji géant
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  // Bouton flottant (FAB)
  fab: {
    position: 'absolute', // Positionné par rapport au parent
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30, // Rond parfait
    backgroundColor: '#6366f1', // Violet
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8, // Ombre forte
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
  },
});