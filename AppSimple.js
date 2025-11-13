import React from 'react';
import { View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <StatusBar style="auto" />
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Test Simple App</Text>
      <Text style={{ marginTop: 10 }}>Si ce texte s'affiche, l'erreur vient du code complexe</Text>
    </View>
  );
}