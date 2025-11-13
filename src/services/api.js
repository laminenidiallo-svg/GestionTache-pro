// api.js - Fichier pour communiquer avec l'API
// Toutes les requêtes HTTP sont ici (GET, POST, PUT, DELETE)

import axios from 'axios';

// URL de l'API qu'on utilise pour le test
const API_URL = 'https://jsonplaceholder.typicode.com';

// Configuration Axios avec timeout et retry
const axiosInstance = axios.create({
  timeout: 10000, // 10 secondes max par requête
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fonction helper pour retry automatique
const axiosRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      console.log(`Tentative ${i + 1}/${retries} échouée:`, error.message);
      if (i === retries - 1) throw error; // Dernier essai échoué, on lance l'erreur
      // Attendre avant de réessayer (délai progressif)
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};

// ========== RÉCUPÉRER LES TÂCHES ==========
// GET = Demander des données à l'API
export const fetchTasks = async () => {
  try {
    // Envoyer une requête GET avec retry automatique
    const response = await axiosRetry(() => 
      axiosInstance.get(`${API_URL}/todos?_limit=20`)
    );
    
    // L'API retourne 20 tâches directement grâce à _limit=20
    const tasks = response.data;
    
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
    // JSONPlaceholder retourne toujours ID 201, donc on génère notre propre ID unique
    // ID basé sur timestamp pour garantir l'unicité
    const uniqueId = Date.now();
    
    // Créer la tâche localement (l'API JSONPlaceholder est juste pour simulation)
    return {
      id: uniqueId,                      // ID unique basé sur timestamp
      title: task.title,                 // Titre de la tâche
      completed: false,                  // Nouvelle tâche = non complétée
      priority: task.priority || 'low',  // Priorité
      description: task.description || '', // Description
      createdAt: new Date().toISOString(), // Date de création
      userId: 1,                         // Utilisateur fictif
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
    // Envoyer les modifications à l'API avec retry
    const response = await axiosRetry(() => 
      axiosInstance.put(`${API_URL}/todos/${id}`, updates)
    );
    
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
    // Envoyer la demande de suppression avec retry
    await axiosRetry(() => 
      axiosInstance.delete(`${API_URL}/todos/${id}`)
    );
    return true; // Succès
  } catch (error) {
    console.error('Erreur deleteTask:', error);
    throw new Error('Impossible de supprimer la tâche');
  }
};