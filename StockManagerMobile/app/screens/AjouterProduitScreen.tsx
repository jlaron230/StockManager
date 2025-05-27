import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Animated,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';

type Product = {
  nom: string;
  quantité_en_stock: number;
  prix_unitaire: string;
  description?: string;
  seuil_minimal: number;
  id_category: number;
};

type Category = {
  id_category: number;
  nom: string;
};

type RootStackParamList = {
  Dashboard: undefined;
  AjouterProduit: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AjouterProduit'>;

export default function AjouterProduitScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [nom, setNom] = useState('');
  const [prix, setPrix] = useState('');
  const [stock, setStock] = useState('');
  const [seuil, setSeuil] = useState('');
  const [description, setDescription] = useState('');

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    axios.get('http://192.168.1.121:5000/categories')
      .then(res => {
        setCategories(res.data);
        setSelectedCategory(res.data[0]?.id_category?.toString() || null);
      });
  }, []);

  const handleSubmit = async () => {
    if (!nom || !prix || !stock || !seuil || !selectedCategory) {
      alert('Tous les champs doivent être remplis.');
      return;
    }

    try {
      await axios.post('http://192.168.1.121:5000/products', {
        nom,
        prix_unitaire: prix,
        quantité_en_stock: parseInt(stock, 10),
        seuil_minimal: parseInt(seuil, 10),
        description,
        id_category: parseInt(selectedCategory, 10),
      });

      fadeInToast();

      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout.");
    }
  };

  const fadeInToast = () => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
  };

  if (!isAdmin) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Accès interdit</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter un produit</Text>

      <TextInput placeholder="Nom" style={styles.input} value={nom} onChangeText={setNom} />
      <TextInput placeholder="Prix unitaire (€)" style={styles.input} keyboardType="decimal-pad" value={prix} onChangeText={setPrix} />
      <TextInput placeholder="Quantité en stock" style={styles.input} keyboardType="numeric" value={stock} onChangeText={setStock} />
      <TextInput placeholder="Seuil minimal" style={styles.input} keyboardType="numeric" value={seuil} onChangeText={setSeuil} />

      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.picker}
      >
        {categories.map((cat) => (
          <Picker.Item
            label={cat.nom}
            value={cat.id_category.toString()}
            key={cat.id_category}
          />
        ))}
      </Picker>

      <TextInput
        placeholder="Description (facultative)"
        style={[styles.input, { height: 80 }]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <Button title="Ajouter" onPress={handleSubmit} />

      <Animated.View style={[styles.toast, { opacity: fadeAnim }]}>
        <Text style={styles.toastText}>✅ Produit ajouté</Text>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
  },
  picker: {
    backgroundColor: '#f0f0f0',
    marginBottom: 16,
  },
  toast: {
    position: 'absolute',
    bottom: 30,
    left: '10%',
    right: '10%',
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  toastText: {
    color: '#fff',
    fontWeight: '600',
  },
});
