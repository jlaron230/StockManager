import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


// Types
type Category = {
  id_category: number;
  nom: string;
};

type Product = {
  id_product: number;
  nom: string;
  quantité_en_stock: number;
  prix_unitaire: string;
  description?: string;
  seuil_minimal: number;
};

// Navigation typée
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'DétailProduit'>;

export default function ProductListScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://192.168.1.121:5000/categories')
      .then(res => {
        setCategories(res.data);
        setSelectedCategory(res.data[0]?.id_category?.toString() || null);
      });
  }, []);

  useEffect(() => {
    const url = selectedCategory
      ? `http://192.168.1.121:5000/products/category/${selectedCategory}`
      : 'http://192.168.1.121:5000/products';

    axios.get(url).then(res => setProducts(res.data));
  }, [selectedCategory]);

  const filteredProducts = products.filter(product =>
    product.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.product}
      onPress={() => navigation.navigate('DétailProduit', { product: item })}
    >
      <Text style={styles.name}>{item.nom}</Text>
      <Text>Stock : {item.quantité_en_stock}</Text>
      <Text>Prix : {item.prix_unitaire} €</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des produits</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

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

      {isAdmin && (
        <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AjouterProduit')}
        >
            <Text style={styles.addButtonText}>➕ Ajouter un produit</Text>
        </TouchableOpacity>
        )}

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id_product.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  picker: { backgroundColor: '#eee', marginBottom: 16 },
  searchInput: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  product: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
    elevation: 1,
  },
  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  name: { fontSize: 16, fontWeight: 'bold' },
});
