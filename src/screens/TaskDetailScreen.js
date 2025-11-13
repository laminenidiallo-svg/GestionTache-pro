// TaskDetailScreen.js - Écran qui affiche tous les détails d'une tâche
// Permet aussi de modifier, supprimer ou marquer comme terminée

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeTask, toggleTaskStatus } from '../store/slices/tasksSlice';

export default function TaskDetailScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);
  
  // Récupérer la tâche depuis les paramètres de navigation
  const task = route.params?.task;
  
  // Si pas de tâche (ne devrait jamais arriver), retourner en arrière
  if (!task) {
    navigation.goBack();
    return null;
  }
  
  // Marquer comme terminée ou non terminée
  const handleToggle = () => {
    dispatch(toggleTaskStatus(task.id));
    // Mettre à jour l'objet task localement pour que l'interface se rafraîchisse
    task.completed = !task.completed;
  };
  
  // Naviguer vers l'écran de modification
  const handleEdit = () => {
    navigation.navigate('TaskForm', { task });
  };
  
  // Supprimer la tâche (avec confirmation)
  const handleDelete = () => {
    Alert.alert(
      'Supprimer la tâche', // Titre
      'Êtes-vous sûr ? Cette action est irréversible.', // Message
      [
        {
          text: 'Annuler',
          style: 'cancel', // Style iOS (texte normal)
        },
        {
          text: 'Supprimer',
          style: 'destructive', // Style iOS (texte rouge)
          onPress: async () => {
            try {
              await dispatch(removeTask(task.id)).unwrap();
              Alert.alert('Succès', 'Tâche supprimée !');
              navigation.goBack(); // Retourner à la liste
            } catch (error) {
              Alert.alert('Erreur', error || 'Impossible de supprimer');
            }
          },
        },
      ]
    );
  };
  
  // Fonction pour formater les dates en français
  const formatDate = (dateString) => {
    if (!dateString) return 'Non disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* En-tête avec badges de statut et priorité */}
        <View style={styles.header}>
          {/* Badge Statut (Terminée ou En cours) */}
          <View style={[
            styles.statusBadge,
            task.completed ? styles.statusCompleted : styles.statusPending
          ]}>
            <Text style={styles.statusText}>
              {task.completed ? '✅ Terminée' : '⏳ En cours'}
            </Text>
          </View>
          
          {/* Badge Priorité */}
          <View style={[
            styles.priorityBadge,
            task.priority === 'high' ? styles.priorityHigh : styles.priorityLow
          ]}>
            <Text style={styles.priorityText}>
              {task.priority === 'high' ? '🔥 Priorité haute' : '📋 Priorité basse'}
            </Text>
          </View>
        </View>
        
        {/* Titre de la tâche */}
        <Text style={styles.title}>{task.title}</Text>
        
        {/* Description (si elle existe) */}
        {task.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{task.description}</Text>
          </View>
        )}
        
        {/* Section Informations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations</Text>
          
          {/* ID de la tâche */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>ID</Text>
            <Text style={styles.infoValue}>#{task.id}</Text>
          </View>
          
          {/* Date de création */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Créée le</Text>
            <Text style={styles.infoValue}>
              {formatDate(task.createdAt)}
            </Text>
          </View>
          
          {/* Date de modification (si elle existe) */}
          {task.updatedAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Modifiée le</Text>
              <Text style={styles.infoValue}>
                {formatDate(task.updatedAt)}
              </Text>
            </View>
          )}
          
          {/* ID utilisateur */}
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Utilisateur</Text>
            <Text style={styles.infoValue}>User #{task.userId}</Text>
          </View>
        </View>
        
        {/* Boutons d'action */}
        <View style={styles.actions}>
          {/* Bouton Marquer comme terminée/non terminée */}
          <TouchableOpacity
            style={[styles.actionButton, styles.toggleButton]}
            onPress={handleToggle}
          >
            <Text style={styles.actionButtonText}>
              {task.completed ? '↩️ Marquer non terminée' : '✓ Marquer terminée'}
            </Text>
          </TouchableOpacity>
          
          {/* Bouton Modifier */}
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEdit}
          >
            <Text style={styles.actionButtonText}>
              ✏️ Modifier
            </Text>
          </TouchableOpacity>
          
          {/* Bouton Supprimer */}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={handleDelete}
            disabled={loading} // Désactivé pendant le chargement
          >
            <Text style={styles.deleteButtonText}>
              {loading ? 'Suppression...' : '🗑️ Supprimer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20, // Arrondi pour effet "pill"
  },
  statusCompleted: {
    backgroundColor: '#d1fae5', // Vert clair
  },
  statusPending: {
    backgroundColor: '#fef3c7', // Jaune clair
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  priorityHigh: {
    backgroundColor: '#fee2e2', // Rouge clair
  },
  priorityLow: {
    backgroundColor: '#dbeafe', // Bleu clair
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 24,
    lineHeight: 36, // Hauteur de ligne pour meilleure lisibilité
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2, // Ombre Android
    shadowColor: '#000', // Ombre iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Espace entre label et valeur
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  actions: {
    marginTop: 8,
    gap: 12, // Espace entre les boutons
  },
  actionButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#6366f1', // Violet
  },
  editButton: {
    backgroundColor: '#3b82f6', // Bleu
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ef4444', // Bordure rouge
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButtonText: {
    color: '#ef4444', // Texte rouge
    fontSize: 16,
    fontWeight: 'bold',
  },
});