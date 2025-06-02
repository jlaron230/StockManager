// UserProfileScreen.tsx

import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function UserProfileScreen() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Text style={styles.title}>Chargement du profil...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil utilisateur</Text>
      <Text style={styles.info}>Prénom : {user.prenom}</Text>
      <Text style={styles.info}>Nom : {user.nom}</Text>
      <Text style={styles.info}>Email : {user.email}</Text>
      <Text style={styles.info}>Rôle : {user.role}</Text>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  info: { fontSize: 16, marginBottom: 10 },
});
