import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width - 32;

type Product = {
  nom: string;
  quantité_en_stock: number;
  seuil_minimal: number;
  id_category: number | null;
};

type Category = {
  id_category: number;
  nom: string;
};

export default function DashboardScreen() {
  const { user } = useContext(AuthContext);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://192.168.1.121:5000/products').then(res => setProducts(res.data));

    axios.get('http://192.168.1.121:5000/categories').then(res => {
      setCategories(res.data);
      const first = res.data[0]?.id_category?.toString();
      if (first) setSelectedCategory(first);
    });
  }, []);

  const criticalProducts = products.filter(p => p.quantité_en_stock <= p.seuil_minimal);

  const filteredProducts = selectedCategory
    ? products.filter(p =>
        p.id_category !== null && p.id_category.toString() === selectedCategory
      )
    : products;

  const chartData = {
    labels: filteredProducts.map(p => p.nom.length > 10 ? p.nom.slice(0, 10) + '…' : p.nom),
    datasets: [
      {
        data: filteredProducts.map(p => p.quantité_en_stock),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👋 Bienvenue {user?.prenom} <Text style={styles.role}>({user?.role})</Text></Text>

      <View style={[styles.infoCard, criticalProducts.length > 0 ? styles.warningCard : styles.successCard]}>
        <Text style={styles.cardTitle}>⚠️ Produits en stock critique :</Text>
        <Text style={styles.cardText}>
          {criticalProducts.length > 0
            ? `${criticalProducts.length} produit(s) à surveiller`
            : '✅ Aucun produit en stock critique.'}
        </Text>

        {criticalProducts.length > 0 && (
          <View style={styles.criticalList}>
            {criticalProducts.map((p, index) => (
              <Text style={styles.criticalItem} key={index}>
                • {p.nom} (Stock : {p.quantité_en_stock} / Seuil : {p.seuil_minimal})
              </Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.chartBlock}>
        <Text style={styles.chartTitle}>📊 Vue globale par catégorie :</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
            style={styles.picker}
            dropdownIconColor="#333"
          >
            {categories.map(cat => (
              <Picker.Item
                label={cat.nom}
                value={cat.id_category.toString()}
                key={cat.id_category}
                color={Platform.OS === 'android' ? '#000' : undefined}
              />
            ))}
          </Picker>
        </View>

        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            width={screenWidth}
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: () => '#333',
              barPercentage: 0.7,
            }}
            style={{ borderRadius: 12 }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f4f4f4' },

  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#222',
  },

  role: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#777',
  },

  infoCard: {
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  warningCard: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
    borderWidth: 1,
  },

  successCard: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },

  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },

  cardText: {
    fontSize: 14,
    color: '#333',
  },

  criticalList: {
    marginTop: 8,
    paddingLeft: 8,
  },

  criticalItem: {
    fontSize: 13,
    color: '#b45b00',
    marginBottom: 4,
  },

  chartBlock: {
    marginBottom: 20,
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },

  pickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 12,
    overflow: 'hidden',
  },

  picker: {
    height: 50,
    color: '#000',
  },

  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
});
