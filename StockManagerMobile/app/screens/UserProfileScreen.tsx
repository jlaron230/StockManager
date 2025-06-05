import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function UserProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return <Text style={styles.title}>Chargement du profil...</Text>;
  }

  const handleLogout = () => {
  Alert.alert("Déconnexion", "Voulez-vous vous déconnecter ?", [
    { text: "Annuler", style: "cancel" },
    { text: "Déconnexion", onPress: logout }
  ]);
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Profil utilisateur</Text>

      <View style={styles.card}>
        <Image
          source={require('../../assets/images/profil.png')}
          style={styles.avatar}
        />

        <View style={styles.infoBlock}>
          <Text style={styles.label}>Prénom</Text>
          <Text style={styles.value}>{user.prenom}</Text>

          <Text style={styles.label}>Nom</Text>
          <Text style={styles.value}>{user.nom}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Rôle</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Se déconnecter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
  },
  infoBlock: {
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
