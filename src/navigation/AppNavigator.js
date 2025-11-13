import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TaskListScreen from '../screens/TaskListScreen';
import TaskFormScreen from '../screens/TaskFormScreen';
import TaskDetailScreen from '../screens/TaskDetailScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="TaskList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#09a143ff',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen 
        name="TaskList"
        component={TaskListScreen}
        options={{
          title: 'Mes Tâches',
        }}
      />
      
      <Stack.Screen 
        name="TaskForm" 
        component={TaskFormScreen}
        options={({ route }) => ({
          title: route.params?.task ? 'Modifier la tâche' : 'Nouvelle tâche',
        })}
      />
      
      <Stack.Screen 
        name="TaskDetail" 
        component={TaskDetailScreen}
        options={{
          title: 'Détails de la tâche',
        }}
      />
    </Stack.Navigator>
  );
}

