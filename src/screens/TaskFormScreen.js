// TaskFormScreen.js - Écran pour créer une nouvelle tâche OU modifier une existante
// Le même écran sert pour les 2 actions (création et modification)

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addTask, modifyTask } from '../store/slices/tasksSlice';

export default function TaskFormScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.tasks);
  
  // Récupérer la tâche à modifier (si elle existe)
  // Si route.params.task existe = MODE MODIFICATION
  // Sinon = MODE CRÉATION
  const taskToEdit = route.params?.task;
  const isEditMode = !!taskToEdit; // !! transforme en booléen (true/false)
  
  // États locaux du formulaire (ce que l'utilisateur tape)
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [priority, setPriority] = useState(taskToEdit?.priority || 'low');
  
  // État pour les erreurs de validation
  const [errors, setErrors] = useState({});
  
  // Fonction de validation du formulaire
  const validateForm = () => {
    const newErrors = {};
    
    // Vérifier le titre
    if (!title.trim()) {
      newErrors.title = 'Le titre est obligatoire';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Le titre doit faire au moins 3 caractères';
    }
    
    // Vérifier la description
    if (description.length > 200) {
      newErrors.description = 'Maximum 200 caractères';
    }
    
    setErrors(newErrors);
    // Retourner true si aucune erreur, false sinon
    return Object.keys(newErrors).length === 0;
  };
  
  // Fonction pour soumettre le formulaire
  const handleSubmit = async () => {
    // D'abord valider le formulaire
    if (!validateForm()) {
      return; // Arrêter si erreur
    }
    
    // Préparer les données de la tâche
    const taskData = {
      title: title.trim(), // Enlever les espaces au début et à la fin
      description: description.trim(),
      priority,
      completed: taskToEdit?.completed || false,
    };
    
    try {
      if (isEditMode) {
        // MODE MODIFICATION
        await dispatch(modifyTask({
          id: taskToEdit.id,
          updates: taskData,
        })).unwrap(); // unwrap() transforme en Promise normale
        
        Alert.alert('Succès', 'Tâche modifiée !', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        // MODE CRÉATION
        await dispatch(addTask(taskData)).unwrap();
        
        Alert.alert('Succès', 'Tâche créée !', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', error || 'Une erreur est survenue');
    }
  };
  
  return (
    // KeyboardAvoidingView : Fait remonter le contenu quand le clavier apparaît
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled" // Permet de cliquer même avec le clavier ouvert
      >
        {/* Champ Titre */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Titre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            value={title}
            onChangeText={setTitle} // Met à jour l'état à chaque frappe
            placeholder="Ex: Faire les courses"
            placeholderTextColor="#9ca3af"
          />
          {/* Afficher l'erreur si elle existe */}
          {errors.title && (
            <Text style={styles.errorText}>{errors.title}</Text>
          )}
        </View>
        
        {/* Champ Description */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Description (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Ajouter des détails..."
            placeholderTextColor="#9ca3af"
            multiline // Permet plusieurs lignes
            numberOfLines={4}
            textAlignVertical="top" // Texte commence en haut
          />
          {/* Compteur de caractères */}
          <Text style={styles.charCount}>
            {description.length}/200
          </Text>
          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}
        </View>
        
        {/* Sélection de priorité */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Priorité</Text>
          <View style={styles.priorityButtons}>
            {/* Bouton Priorité Basse */}
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'low' && styles.priorityButtonActive, // Style actif si sélectionné
              ]}
              onPress={() => setPriority('low')}
            >
              <Text style={[
                styles.priorityButtonText,
                priority === 'low' && styles.priorityButtonTextActive,
              ]}>
                📋 Basse
              </Text>
            </TouchableOpacity>
            
            {/* Bouton Priorité Haute */}
            <TouchableOpacity
              style={[
                styles.priorityButton,
                priority === 'high' && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority('high')}
            >
              <Text style={[
                styles.priorityButtonText,
                priority === 'high' && styles.priorityButtonTextActive,
              ]}>
                🔥 Haute
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Bouton Soumettre */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading} // Désactivé pendant le chargement
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              {isEditMode ? '✓ Modifier' : '+ Créer la tâche'}
            </Text>
          )}
        </TouchableOpacity>
        
        {/* Bouton Annuler */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 24, // Espace entre les champs
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444', // Rouge pour indiquer obligatoire
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#ef4444', // Bordure rouge si erreur
  },
  textArea: {
    height: 100, // Plus grand pour la description
    paddingTop: 12,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  priorityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  priorityButton: {
    flex: 1, // Prend la moitié de l'espace
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 6, // Espace entre les boutons
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderColor: '#6366f1', // Violet si sélectionné
    backgroundColor: '#eef2ff', // Fond violet clair
  },
  priorityButtonText: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  priorityButtonTextActive: {
    color: '#6366f1', // Texte violet si sélectionné
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#6366f1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af', // Gris si désactivé
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});