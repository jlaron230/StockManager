import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useEffect } from 'react';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useNavigation } from '@react-navigation/native';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;


export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useContext(AuthContext);
  



const handleLogin = async () => {
  console.log("Tentative de connexion...");

  try {
    const response = await axios.post('http://192.168.1.121:5000/login', {
      email,
      password,
    });

    console.log("Réponse backend :", response.data);

    if (response.data) {
      await login(response.data,'token');
      navigation.navigate('Dashboard');
    } else {
      setError("Utilisateur introuvable");
    }
  } catch (err) {
    console.log("Erreur lors de la connexion :", err);
    setError('Échec de connexion');
  }
};
    useEffect(() => {
    if (user) {
        navigation.navigate('Dashboard');
    }     else {
        navigation.navigate('Login');
    }
    }, [user]);


  

  return (
    <View style={styles.container}>
      <TextInput placeholder="Email" onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Mot de passe" secureTextEntry onChangeText={setPassword} style={styles.input} />
      <Button title="Connexion" onPress={handleLogin} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { height: 40, borderBottomWidth: 1, marginBottom: 20 },
  error: { color: 'red', marginTop: 10 },
});


