import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Product = {
  id_product: number;
  nom: string;
  quantité_en_stock: number;
  prix_unitaire: string;
  description?: string;
  seuil_minimal: number;
};

type RootStackParamList = {
  DétailProduit: { product: Product };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ProductDetailRouteProp = RouteProp<RootStackParamList, 'DétailProduit'>;

export default function ProductDetailScreen() {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const navigation = useNavigation<NavigationProp>();
  const { params } = useRoute<ProductDetailRouteProp>();
  const { product } = params;

  const [stock, setStock] = useState(product.quantité_en_stock.toString());
  const [productName, setProductName] = useState(product.nom);
  const [unitPrice, setUnitPrice] = useState(product.prix_unitaire);
  const [description, setDescription] = useState(product.description || '');
  const [minThreshold, setMinThreshold] = useState(product.seuil_minimal.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const payload: Partial<Product> = {
        quantité_en_stock: parseInt(stock, 10),
      };

      if (isAdmin) {
        payload.nom = productName;
        payload.prix_unitaire = unitPrice;
        payload.description = description;
        payload.seuil_minimal = parseInt(minThreshold, 10);
      }

      await axios.patch(`http://192.168.1.121:5000/products/${product.id_product}`, payload);
      Alert.alert('✅ Succès', 'Produit mis à jour.');
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Erreur', "Impossible de mettre à jour le produit.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://192.168.1.121:5000/products/${product.id_product}`);
      Alert.alert('🗑 Supprimé', 'Produit supprimé.');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('❌ Erreur', "Impossible de supprimer le produit.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Fiche produit</Text>

      {/* NOM */}
      <Text style={styles.label}>Nom</Text>
      {isAdmin ? (
        <TextInput style={styles.input} value={productName} onChangeText={setProductName} />
      ) : (
        <Text style={styles.value}>{product.nom}</Text>
      )}

      {/* PRIX */}
      <Text style={styles.label}>Prix unitaire (€)</Text>
      {isAdmin ? (
        <TextInput
          style={styles.input}
          value={unitPrice}
          onChangeText={setUnitPrice}
          keyboardType="decimal-pad"
        />
      ) : (
        <Text style={styles.value}>{product.prix_unitaire} €</Text>
      )}

      {/* STOCK */}
      <Text style={styles.label}>Quantité en stock</Text>
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      {/* SEUIL */}
      <Text style={styles.label}>Seuil minimal</Text>
      {isAdmin ? (
        <TextInput
          style={styles.input}
          value={minThreshold}
          onChangeText={setMinThreshold}
          keyboardType="numeric"
        />
      ) : (
        <Text style={styles.value}>{product.seuil_minimal}</Text>
      )}

      {/* DESCRIPTION */}
      <Text style={styles.label}>Description</Text>
      {isAdmin ? (
        <TextInput
          style={[styles.input, { height: 80 }]}
          value={description}
          onChangeText={setDescription}
          multiline
        />
      ) : (
        <Text style={styles.value}>
          {product.description ? product.description : 'Aucune description'}
        </Text>
      )}

      {/* BOUTONS */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleUpdate}
        disabled={isLoading}
      >
        <Text style={styles.saveButtonText}>💾 Mettre à jour</Text>
      </TouchableOpacity>

      {isAdmin && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              'Confirmation',
              'Voulez-vous vraiment supprimer ce produit ?',
              [
                { text: 'Annuler', style: 'cancel' },
                { text: 'Supprimer', style: 'destructive', onPress: handleDelete },
              ]
            )
          }
        >
          <Text style={styles.deleteButtonText}>🗑 Supprimer ce produit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    color: '#555',
  },
  value: {
    fontSize: 16,
    color: '#000',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
