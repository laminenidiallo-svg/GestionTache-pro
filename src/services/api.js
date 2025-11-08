// api.js - Fichier pour communiquer avec l'API
// Toutes les requêtes HTTP sont ici (GET, POST, PUT, DELETE)

import axios from 'axios';

// URL de l'API qu'on utilise pour le test
const API_URL = 'https://jsonplaceholder.typicode.com';

// ========== RÉCUPÉRER LES TÂCHES ==========
// GET = Demander des données à l'API
export const fetchTasks = async () => {
  try {
    // Envoyer une requête GET pour récupérer les tâches
    const response = await axios.get(`${API_URL}/todos`);
    
    // L'API retourne 200 tâches, c'est trop !
    // On prend seulement les 20 premières
    const tasks = response.data.slice(0, 20);
    
    // On ajoute des infos supplémentaires à chaque tâche
    return tasks.map(task => ({
      ...task, // Garder les données originales (id, title, completed, userId)
      priority: Math.random() > 0.5 ? 'high' : 'low', // Priorité aléatoire
      createdAt: new Date().toISOString(), // Date de création
    }));
  } catch (error) {
    console.error('Erreur fetchTasks:', error);
    throw new Error('Impossible de récupérer les tâches');
  }
};

// ========== CRÉER UNE TÂCHE ==========
// POST = Envoyer des données à l'API pour créer quelque chose
export const createTask = async (task) => {
  try {
    // Envoyer la nouvelle tâche à l'API
    const response = await axios.post(`${API_URL}/todos`, {
      title: task.title,           // Titre de la tâche
      completed: false,            // Nouvelle tâche = non complétée
      userId: 1,                   // Utilisateur fictif
    });
    
    // L'API retourne la tâche créée avec un ID
    // On ajoute nos champs personnalisés
    return {
      ...response.data,              // Données de l'API (id, title, etc.)
      priority: task.priority || 'low', // Priorité
      description: task.description || '', // Description
      createdAt: new Date().toISOString(), // Date de création
    };
  } catch (error) {
    console.error('Erreur createTask:', error);
    throw new Error('Impossible de créer la tâche');
  }
};

// ========== MODIFIER UNE TÂCHE ==========
// PUT = Envoyer des modifications à l'API
export const updateTask = async (id, updates) => {
  try {
    // Envoyer les modifications à l'API
    const response = await axios.put(`${API_URL}/todos/${id}`, updates);
    
    // Retourner la tâche mise à jour
    return {
      ...response.data,  // Données de l'API
      ...updates,        // Nos modifications
      updatedAt: new Date().toISOString(), // Date de modification
    };
  } catch (error) {
    console.error('Erreur updateTask:', error);
    throw new Error('Impossible de modifier la tâche');
  }
};

// ========== SUPPRIMER UNE TÂCHE ==========
// DELETE = Demander à l'API de supprimer quelque chose
export const deleteTask = async (id) => {
  try {
    // Envoyer la demande de suppression
    await axios.delete(`${API_URL}/todos/${id}`);
    return true; // Succès
  } catch (error) {
    console.error('Erreur deleteTask:', error);
    throw new Error('Impossible de supprimer la tâche');
  }
};