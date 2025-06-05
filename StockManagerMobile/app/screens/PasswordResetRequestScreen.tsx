import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation'; 



export default function PasswordResetRequestScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSubmit = async () => {
    if (!email) {
      return Alert.alert("Erreur", "Veuillez entrer votre email.");
    }

    try {
      setLoading(true);
      await axios.post('http://192.168.1.121:5000/forgot-password', { email });
      Alert.alert("✅ Succès", "Lien de réinitialisation envoyé !");
      navigation.navigate('login');
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 404) {
        Alert.alert("Utilisateur introuvable", "Aucun compte avec cet email.");
      } else {
        Alert.alert("Erreur", "Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Réinitialisation du mot de passe</Text>
      <Text style={styles.subtitle}>Entrez votre adresse email pour recevoir un lien.</Text>

      <TextInput
        style={styles.input}
        placeholder="Votre email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#f4f4f4' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
