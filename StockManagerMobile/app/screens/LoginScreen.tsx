import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Title, Text } from 'react-native-paper';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation';
import { AuthContext } from '../context/AuthContext';
import { useRegisterPushToken } from '../hooks/useRegisterPushToken';

import { Image } from 'react-native';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'login'>;

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { login, user } = useContext(AuthContext);

  useRegisterPushToken(user?.id_user);

  const handleLogin = async () => {
    console.log("Tentative de connexion...");

    try {
      const response = await axios.post('http://192.168.1.121:5000/login', {
        email,
        password,
      });

      console.log("Réponse backend :", response.data);

      if (response.data) {
        await login(response.data, 'token');
        navigation.navigate('Acceuil');
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
      navigation.navigate('Acceuil');
    }
  }, [user]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
       <Image
        source={require('../../assets/images/Logo_Gestock.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Title style={styles.title}>Bienvenue sur Gestock</Title>
      <Text style={styles.subtitle}>Connecte-toi à ton compte</Text>

      <TextInput
        label="Email"
        mode="outlined"
        left={<TextInput.Icon icon="email" />}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        label="Mot de passe"
        mode="outlined"
        left={<TextInput.Icon icon="lock" />}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button
        mode="contained"
        onPress={() => navigation.navigate('Acceuil')}
        style={styles.button}
        buttonColor="#007BFF" 
      >
      Connexion
      </Button>

      <TouchableOpacity onPress={() => navigation.navigate('PasswordResetRequest')}>
        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    color: '#555',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  link: {
    marginTop: 16,
    textAlign: 'center',
    color: '#007BFF',
  },
  error: {
    color: '#ff4d4f',
    textAlign: 'center',
    marginBottom: 12,
  },
  forgotText: {
  color: '#007bff',
  fontSize: 14,
  textAlign: 'right',
  marginTop: 12,
},

});
