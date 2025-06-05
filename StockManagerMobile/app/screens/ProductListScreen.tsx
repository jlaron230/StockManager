import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
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

  const renderItem = ({ item }: { item: Product }) => {
    const isCritical = item.quantité_en_stock <= item.seuil_minimal;

    return (
      <TouchableOpacity
        style={[styles.card, isCritical && styles.criticalCard]}
        onPress={() => navigation.navigate('DétailProduit', { product: item })}
      >
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.nom}</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: isCritical ? '#FF6B6B' : '#4CAF50' },
            ]}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Stock :</Text>
          <Text style={[styles.value, isCritical && styles.criticalText]}>
            {item.quantité_en_stock}
          </Text>
          {isCritical && <Text style={styles.warning}> ⚠️ Stock critique</Text>}
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Prix :</Text>
          <Text style={styles.value}>{item.prix_unitaire} €</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liste des produits</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un produit"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#888"
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
          dropdownIconColor="#333"
        >
          {categories.map((cat) => (
            <Picker.Item
              label={cat.nom}
              value={cat.id_category.toString()}
              key={cat.id_category}
              color={Platform.OS === 'android' ? '#000' : undefined}
            />
          ))}
        </Picker>
      </View>

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
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#222' },

  searchInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    color: '#000',
  },

  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },

  picker: {
    height: 50,
    color: '#000',
  },

  addButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  criticalCard: {
    borderLeftColor: '#FF6B6B',
    borderLeftWidth: 4,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  label: {
    fontWeight: '600',
    color: '#666',
    marginRight: 4,
  },

  value: {
    color: '#000',
    fontSize: 15,
  },

  criticalText: {
    color: '#FF6B6B',
    fontWeight: '600',
  },

  warning: {
    marginLeft: 6,
    color: '#FF6B6B',
    fontWeight: '600',
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
