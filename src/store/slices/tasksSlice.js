// tasksSlice.js - Gère TOUTES les actions sur les tâches
// C'est ici qu'on crée, modifie, supprime les tâches

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../services/api';

// Clé pour sauvegarder dans AsyncStorage (comme une "boîte" de rangement)
const STORAGE_KEY = '@tasks_storage';

// ========== ACTIONS ASYNCHRONES (avec appel API) ==========

// Récupérer les tâches depuis l'API
// "async" = asynchrone = ça prend du temps (attendre la réponse de l'API)
export const fetchTasksFromAPI = createAsyncThunk(
  'tasks/fetchTasks', // Nom de l'action
  async (_, { rejectWithValue }) => {
    try {
      // Appeler l'API pour récupérer les tâches
      const data = await fetchTasks();
      // Retourner un objet pour indiquer que c'est bien venu de l'API
      return { tasks: data, fromCache: false };
    } catch (error) {
      // En cas d'erreur réseau, tenter de retourner les tâches sauvegardées localement
      console.error('fetchTasksFromAPI error:', error?.message || error);
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        // Retourner les tâches locales en indiquant que c'est un fallback
        return { tasks: parsed, fromCache: true, originalError: error?.message };
      } catch (storageError) {
        // Si la lecture locale échoue aussi, rejeter pour afficher l'erreur
        console.error('Error reading storage fallback:', storageError);
        return rejectWithValue(error?.message || 'Erreur réseau');
      }
    }
  }
);

// Ajouter une nouvelle tâche
export const addTask = createAsyncThunk(
  'tasks/addTask',
  async (task, { rejectWithValue }) => {
    try {
      // Envoyer la nouvelle tâche à l'API
      const newTask = await createTask(task);
      return newTask; // Retourner la tâche créée
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Modifier une tâche existante
export const modifyTask = createAsyncThunk(
  'tasks/modifyTask',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      // Envoyer les modifications à l'API
      const updatedTask = await updateTask(id, updates);
      return updatedTask; // Retourner la tâche modifiée
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Supprimer une tâche
export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (id, { rejectWithValue }) => {
    try {
      // Demander à l'API de supprimer la tâche
      await deleteTask(id);
      return id; // Retourner l'ID de la tâche supprimée
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Charger les tâches sauvegardées localement
export const loadTasksFromStorage = createAsyncThunk(
  'tasks/loadFromStorage',
  async () => {
    try {
      // Lire dans AsyncStorage (comme lire dans un fichier)
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      // Si des tâches existent, les retourner. Sinon, retourner un tableau vide
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erreur chargement:', error);
      return [];
    }
  }
);

// Fonction helper pour sauvegarder dans AsyncStorage
const saveTasksToStorage = async (tasks) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Erreur sauvegarde:', error);
  }
};

// ========== SLICE (le "morceau" d'état Redux) ==========

const tasksSlice = createSlice({
  name: 'tasks', // Nom du slice
  
  // État initial (au démarrage de l'app)
  initialState: {
    items: [],        // Liste des tâches (tableau vide au début)
    loading: false,   // Est-ce qu'on est en train de charger ? (true/false)
    error: null,      // Message d'erreur (null = pas d'erreur)
    lastSync: null,   // Date de la dernière synchronisation avec l'API
  },
  
  // Actions SIMPLES (pas d'appel API)
  reducers: {
    // Marquer une tâche comme terminée/non terminée
    toggleTaskStatus: (state, action) => {
      // action.payload = l'ID de la tâche à modifier
      const task = state.items.find(t => t.id === action.payload);
      if (task) {
        // Inverser le statut : true devient false, false devient true
        task.completed = !task.completed;
        // Sauvegarder immédiatement dans AsyncStorage
        saveTasksToStorage(state.items);
      }
    },
    
    // Effacer le message d'erreur
    clearError: (state) => {
      state.error = null;
    },
  },
  
  // Gérer les résultats des actions asynchrones
  extraReducers: (builder) => {
    
    // ===== RÉCUPÉRER LES TÂCHES =====
    builder
      // En cours de chargement
      .addCase(fetchTasksFromAPI.pending, (state) => {
        state.loading = true; // Afficher le loader
        state.error = null;   // Pas d'erreur pour l'instant
      })
      // Succès : tâches reçues (peut venir de l'API ou du cache local)
      .addCase(fetchTasksFromAPI.fulfilled, (state, action) => {
        state.loading = false; // Cacher le loader

        // action.payload peut être { tasks, fromCache }
        const payload = action.payload;
        const apiTasks = Array.isArray(payload) ? payload : (payload.tasks || []);
        const fromCache = payload && payload.fromCache === true;

        // Préserver les tâches locales créées par l'utilisateur (ID > 1000)
        const localTasks = state.items.filter(t => t.id > 1000);

        // Dédupliquer : éviter d'ajouter des tâches API dont l'ID existe déjà
        const localIds = new Set(localTasks.map(t => t.id));
        const filteredApiTasks = apiTasks.filter(t => !localIds.has(t.id));

        // Combiner : tâches locales en premier, puis tâches API filtrées
        state.items = [...localTasks, ...filteredApiTasks];

        // Mettre à jour lastSync seulement si la source vient réellement de l'API
        if (!fromCache) {
          state.lastSync = new Date().toISOString();
        }

        // Sauvegarder localement (même si c'est une fallback, on veut garder l'état cohérent)
        saveTasksToStorage(state.items);
      })
      // Erreur
      .addCase(fetchTasksFromAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Afficher le message d'erreur
      });
    
    // ===== AJOUTER UNE TÂCHE =====
    builder
      .addCase(addTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.loading = false;
        // Ajouter la nouvelle tâche AU DÉBUT du tableau
        state.items.unshift(action.payload);
        // Sauvegarder
        saveTasksToStorage(state.items);
      })
      .addCase(addTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // ===== MODIFIER UNE TÂCHE =====
    builder
      .addCase(modifyTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(modifyTask.fulfilled, (state, action) => {
        state.loading = false;
        // Trouver la tâche dans le tableau
        const index = state.items.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          // Remplacer l'ancienne tâche par la nouvelle
          state.items[index] = action.payload;
        }
        // Sauvegarder
        saveTasksToStorage(state.items);
      })
      .addCase(modifyTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // ===== SUPPRIMER UNE TÂCHE =====
    builder
      .addCase(removeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.loading = false;
        // Filtrer pour garder toutes les tâches SAUF celle supprimée
        state.items = state.items.filter(t => t.id !== action.payload);
        // Sauvegarder
        saveTasksToStorage(state.items);
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    
    // ===== CHARGER LES TÂCHES LOCALES =====
    builder
      .addCase(loadTasksFromStorage.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadTasksFromStorage.fulfilled, (state, action) => {
        state.loading = false;
        // Charger les tâches depuis AsyncStorage
        // Dédupliquer par ID au chargement pour éviter collisions héritées
        const loaded = Array.isArray(action.payload) ? action.payload : [];
        const seen = new Set();
        const deduped = [];
        for (const t of loaded) {
          if (!t || typeof t.id === 'undefined') continue;
          const key = t.id;
          if (!seen.has(key)) {
            seen.add(key);
            deduped.push(t);
          }
        }
        state.items = deduped;
      })
      .addCase(loadTasksFromStorage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Exporter les actions simples
export const { toggleTaskStatus, clearError } = tasksSlice.actions;

// Exporter le reducer (pour le store)
export default tasksSlice.reducer;